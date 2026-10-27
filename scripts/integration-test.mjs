import assert from 'node:assert/strict';
import pg from 'pg';

const base = process.env.SDS_TEST_BASE || 'http://127.0.0.1:3002';
const password = process.env.SDS_TEST_ADMIN_PASSWORD;
if (!process.env.DATABASE_URL || !password) throw new Error('Set DATABASE_URL and SDS_TEST_ADMIN_PASSWORD before running this test.');

const db = new pg.Pool({ connectionString: process.env.DATABASE_URL });
let receiptCode;
let articleId;

async function json(path, options = {}, expected = 200) {
  const response = await fetch(`${base}${path}`, options);
  const body = await response.json();
  assert.equal(response.status, expected, `${path}: ${JSON.stringify(body)}`);
  return { response, body };
}

try {
  const health = await json('/api/health');
  assert.equal(health.body.storage, 'postgresql');
  await json('/api/admin/articles', {}, 401);
  await json('/api/admin/login', { method: 'POST', headers: { Origin: 'https://untrusted.example', 'Content-Type': 'application/json' }, body: '{}' }, 403);
  await json('/api/registrations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ courseId: 'seminar', name: 'Test', email: 'bad' }) }, 400);

  const registration = await json('/api/registrations', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: base },
    body: JSON.stringify({ courseId: 'seminar', name: 'Integration Test', email: 'integration@example.invalid', phone: '', note: 'Automated test' }),
  }, 201);
  receiptCode = registration.body.receiptCode;
  assert.match(receiptCode, /^SDS-/);
  const savedRegistration = await db.query('SELECT id, status FROM registrations WHERE receipt_code = $1', [receiptCode]);
  assert.equal(savedRegistration.rows[0].status, 'new');

  const login = await json('/api/admin/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: base }, body: JSON.stringify({ password }),
  });
  const cookie = login.response.headers.get('set-cookie')?.split(';')[0];
  assert.ok(cookie);
  const auth = { Cookie: cookie };
  const registrations = await json('/api/admin/registrations', { headers: auth });
  assert.ok(registrations.body.registrations.some((row) => row.receiptCode === receiptCode));
  await json(`/api/admin/registrations/${savedRegistration.rows[0].id}`, {
    method: 'PATCH', headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'contacting', adminNote: 'Verified' }),
  });
  const changedRegistration = await db.query('SELECT status, admin_note FROM registrations WHERE receipt_code = $1', [receiptCode]);
  assert.equal(changedRegistration.rows[0].status, 'contacting');
  assert.equal(changedRegistration.rows[0].admin_note, 'Verified');

  const article = await json('/api/admin/articles', {
    method: 'POST', headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Integration article', summary: 'Saved in PostgreSQL', body: 'First paragraph.\n\nSecond paragraph.' }),
  }, 201);
  articleId = article.body.article.id;
  assert.equal(article.body.article.status, 'draft');
  await json(`/api/articles/${articleId}`, {}, 404);

  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a4ZkAAAAASUVORK5CYII=', 'base64');
  const uploaded = await json(`/api/admin/articles/${articleId}/images`, {
    method: 'POST', headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: png.toString('base64'), altText: 'Test image' }),
  }, 201);
  const imageId = uploaded.body.image.id;
  assert.equal((await fetch(`${base}/api/images/${imageId}`)).status, 404);
  await json(`/api/admin/articles/${articleId}/images`, {
    method: 'POST', headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: Buffer.from('not-an-image').toString('base64') }),
  }, 400);
  const storedImage = await db.query('SELECT content_type, image_data FROM article_images WHERE id = $1', [imageId]);
  assert.equal(storedImage.rows[0].content_type, 'image/png');
  assert.deepEqual(storedImage.rows[0].image_data, png);

  await json(`/api/admin/articles/${articleId}`, {
    method: 'PATCH', headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Integration article updated', summary: 'Saved in PostgreSQL', body: 'Edited text.', status: 'published' }),
  });
  const published = await json(`/api/articles/${articleId}`);
  assert.equal(published.body.article.body, 'Edited text.');
  assert.equal(published.body.article.images[0].id, imageId);
  const list = await json('/api/articles');
  assert.ok(list.body.articles.some((row) => row.id === articleId));
  const publicImage = await fetch(`${base}/api/images/${imageId}`);
  assert.equal(publicImage.status, 200);
  assert.deepEqual(Buffer.from(await publicImage.arrayBuffer()), png);
  const persistedArticle = await db.query('SELECT title, body, status FROM articles WHERE id = $1', [articleId]);
  assert.equal(persistedArticle.rows[0].status, 'published');
  assert.equal(persistedArticle.rows[0].body, 'Edited text.');

  await json(`/api/admin/articles/${articleId}`, {
    method: 'PATCH', headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Integration article updated', summary: 'Saved in PostgreSQL', body: 'Edited text.', status: 'draft' }),
  });
  await json(`/api/articles/${articleId}`, {}, 404);
  assert.equal((await fetch(`${base}/api/images/${imageId}`)).status, 404);

  const journalPage = await fetch(`${base}/journal/${articleId}`);
  assert.equal(journalPage.status, 200);
  assert.match(journalPage.headers.get('content-type'), /text\/html/);
  await json('/api/missing', {}, 404);
  console.log('PASS: registration, admin update, article edit/publish, image bytes, PostgreSQL persistence, static routes');
} finally {
  if (articleId) await db.query('DELETE FROM articles WHERE id = $1', [articleId]);
  if (receiptCode) await db.query('DELETE FROM registrations WHERE receipt_code = $1', [receiptCode]);
  await db.end();
}
