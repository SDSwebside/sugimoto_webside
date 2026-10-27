import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { db, initializeDatabase } from './db.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const localData = path.join(root, '.local-data');
const dist = path.join(root, 'dist');
const port = Number(process.env.PORT || process.env.SDS_API_PORT || 3001);
const host = process.env.PORT ? '0.0.0.0' : '127.0.0.1';
const publicOrigin = process.env.PUBLIC_ORIGIN ? new URL(process.env.PUBLIC_ORIGIN).origin : '';
const allowedOrigins = new Set([
  'http://127.0.0.1:5173',
  'http://localhost:5173',
  publicOrigin,
  ...(process.env.SDS_ALLOWED_ORIGINS || '').split(',').map((value) => value.trim()),
].filter(Boolean));
const courseIds = new Set(['seminar', 'beginner', 'intermediate', 'advanced']);
const registrationStatuses = new Set(['new', 'contacting', 'confirmed', 'cancelled']);
const sessions = new Map();
const attempts = new Map();
const uuidPath = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';

await initializeDatabase();

function send(res, status, data, extraHeaders = {}) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...extraHeaders,
  });
  res.end(JSON.stringify(data));
}

function clientError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function text(value, max, required = false) {
  if (typeof value !== 'string') throw clientError('表單欄位格式不正確。');
  const cleaned = value.trim();
  if (required && !cleaned) throw clientError('請填寫必填欄位。');
  if (cleaned.length > max) throw clientError('填寫內容超過字數上限。');
  return cleaned;
}

async function readJson(req, maxBytes = 16_384) {
  if (!req.headers['content-type']?.startsWith('application/json')) throw clientError('請使用 JSON 格式送出。', 415);
  const chunks = [];
  let length = 0;
  for await (const chunk of req) {
    length += chunk.length;
    if (length > maxBytes) throw clientError('送出內容過大。', 413);
    chunks.push(chunk);
  }
  try {
    const value = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error();
    return value;
  } catch {
    throw clientError('表單資料格式不正確。');
  }
}

function checkOrigin(req) {
  const origin = req.headers.origin;
  const protocol = req.headers['x-forwarded-proto'] === 'https' || req.socket.encrypted ? 'https' : 'http';
  const sameOrigin = req.headers.host ? `${protocol}://${req.headers.host}` : '';
  if (origin && origin !== sameOrigin && !allowedOrigins.has(origin)) throw clientError('不允許從此網頁送出資料。', 403);
}

function rateLimit(key, limit, windowMs) {
  const now = Date.now();
  const recent = (attempts.get(key) || []).filter((time) => now - time < windowMs);
  if (recent.length >= limit) throw clientError('操作過於頻繁，請稍後再試。', 429);
  recent.push(now);
  attempts.set(key, recent);
}

function cookieValue(req, name) {
  return req.headers.cookie?.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1);
}

function adminToken(req) {
  const token = cookieValue(req, 'sds_admin');
  if (!token) return null;
  const expires = sessions.get(token);
  if (!expires || expires < Date.now()) {
    sessions.delete(token);
    return null;
  }
  return token;
}

function requireAdmin(req) {
  const token = adminToken(req);
  if (!token) throw clientError('請先登入管理後台。', 401);
  return token;
}

async function readAdminCredential() {
  if (process.env.SDS_ADMIN_PASSWORD) {
    const salt = Buffer.from('sds-admin-environment-v1');
    return { salt: salt.toString('hex'), hash: scryptSync(process.env.SDS_ADMIN_PASSWORD, salt, 64).toString('hex') };
  }
  try {
    return JSON.parse(await readFile(path.join(localData, 'admin.json'), 'utf8'));
  } catch {
    throw clientError('管理者帳號尚未初始化。', 503);
  }
}

function adminCookie(value, maxAge) {
  return `sds_admin=${value}; HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age=${maxAge}${publicOrigin.startsWith('https:') ? '; Secure' : ''}`;
}

function imageType(bytes) {
  if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return 'image/png';
  if (bytes.length > 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return 'image/jpeg';
  if (bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  return null;
}

async function articleWithImages(id, publishedOnly = false) {
  const result = await db.query(
    `SELECT * FROM articles WHERE id = $1 ${publishedOnly ? "AND status = 'published'" : ''}`,
    [id],
  );
  if (!result.rows.length) throw clientError('找不到這篇文章。', 404);
  const images = await db.query('SELECT id, alt_text AS "altText" FROM article_images WHERE article_id = $1 ORDER BY sort_order, created_at', [id]);
  const row = result.rows[0];
  return {
    id: row.id, title: row.title, summary: row.summary, body: row.body,
    status: row.status, publishedAt: row.published_at,
    createdAt: row.created_at, updatedAt: row.updated_at,
    images: images.rows,
  };
}

async function serveImage(res, id, admin) {
  const result = await db.query(
    `SELECT i.content_type, i.image_data FROM article_images i JOIN articles a ON a.id = i.article_id
     WHERE i.id = $1 ${admin ? '' : "AND a.status = 'published'"}`,
    [id],
  );
  if (!result.rows.length) throw clientError('找不到圖片。', 404);
  const { content_type: contentType, image_data: imageData } = result.rows[0];
  res.writeHead(200, {
    'Content-Type': contentType, 'Content-Length': imageData.length,
    'Cache-Control': admin ? 'no-store' : 'public, max-age=3600',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(imageData);
}

async function serveWebsite(res, pathname) {
  let requested;
  try { requested = path.resolve(dist, `.${decodeURIComponent(pathname)}`); }
  catch { throw clientError('網址格式不正確。'); }
  if (requested !== dist && !requested.startsWith(dist + path.sep)) throw clientError('找不到頁面。', 404);
  let file = requested === dist ? path.join(dist, 'index.html') : requested;
  let details = await stat(file).catch(() => null);
  if (!details?.isFile()) {
    if (path.extname(pathname)) throw clientError('找不到檔案。', 404);
    file = path.join(dist, 'index.html');
    details = await stat(file).catch(() => null);
  }
  if (!details?.isFile()) throw clientError('網站尚未建置。', 503);
  const mime = {
    '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon', '.woff2': 'font/woff2',
  }[path.extname(file)] || 'application/octet-stream';
  res.writeHead(200, {
    'Content-Type': mime, 'Content-Length': details.size,
    'Cache-Control': file.endsWith('index.html') ? 'no-cache' : 'public, max-age=3600',
    'X-Content-Type-Options': 'nosniff',
  });
  createReadStream(file).pipe(res);
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://127.0.0.1:${port}`);
    const method = req.method || 'GET';
    if (method !== 'GET' && method !== 'HEAD') checkOrigin(req);

    if (method === 'GET' && url.pathname === '/api/health') {
      await db.query('SELECT 1');
      send(res, 200, { ok: true, storage: 'postgresql' });
      return;
    }

    if (method === 'POST' && url.pathname === '/api/registrations') {
      rateLimit(`registration:${req.socket.remoteAddress}`, 8, 60_000);
      const body = await readJson(req);
      if (body.website) {
        send(res, 201, { receiptCode: 'SDS-RECEIVED' });
        return;
      }
      const courseId = text(body.courseId, 32, true);
      if (!courseIds.has(courseId)) throw clientError('請重新選擇課程。');
      const name = text(body.name, 100, true);
      const email = text(body.email, 254, true).toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw clientError('請填寫有效的電子郵件。');
      const phone = text(body.phone ?? '', 50);
      const note = text(body.note ?? '', 2000);
      const id = randomUUID();
      const receiptCode = `SDS-${randomBytes(5).toString('hex').toUpperCase()}`;
      await db.query(
        'INSERT INTO registrations (id, receipt_code, course_id, name, email, phone, note) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [id, receiptCode, courseId, name, email, phone, note],
      );
      send(res, 201, { receiptCode });
      return;
    }

    if (method === 'POST' && url.pathname === '/api/admin/login') {
      rateLimit(`login:${req.socket.remoteAddress}`, 5, 15 * 60_000);
      const body = await readJson(req);
      const password = text(body.password, 200, true);
      const credential = await readAdminCredential();
      const actual = scryptSync(password, Buffer.from(credential.salt, 'hex'), 64);
      const expected = Buffer.from(credential.hash, 'hex');
      if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) throw clientError('密碼不正確。', 401);
      const token = randomBytes(32).toString('hex');
      sessions.set(token, Date.now() + 8 * 60 * 60 * 1000);
      send(res, 200, { ok: true }, { 'Set-Cookie': adminCookie(token, 8 * 60 * 60) });
      return;
    }

    if (method === 'GET' && url.pathname === '/api/admin/me') {
      requireAdmin(req);
      send(res, 200, { ok: true });
      return;
    }

    if (method === 'POST' && url.pathname === '/api/admin/logout') {
      const token = adminToken(req);
      if (token) sessions.delete(token);
      send(res, 200, { ok: true }, { 'Set-Cookie': adminCookie('', 0) });
      return;
    }

    if (method === 'GET' && url.pathname === '/api/admin/registrations') {
      requireAdmin(req);
      const result = await db.query('SELECT id, receipt_code AS "receiptCode", course_id AS "courseId", name, email, phone, note, status, admin_note AS "adminNote", created_at AS "createdAt", updated_at AS "updatedAt" FROM registrations ORDER BY created_at DESC LIMIT 200');
      send(res, 200, { registrations: result.rows });
      return;
    }

    const updateMatch = url.pathname.match(/^\/api\/admin\/registrations\/([0-9a-f-]{36})$/);
    if (method === 'PATCH' && updateMatch) {
      requireAdmin(req);
      const body = await readJson(req);
      const status = text(body.status, 32, true);
      if (!registrationStatuses.has(status)) throw clientError('處理狀態不正確。');
      const adminNote = text(body.adminNote ?? '', 2000);
      const result = await db.query('UPDATE registrations SET status = $2, admin_note = $3, updated_at = now() WHERE id = $1 RETURNING id', [updateMatch[1], status, adminNote]);
      if (result.rows.length === 0) throw clientError('找不到這筆報名。', 404);
      send(res, 200, { ok: true });
      return;
    }

    if (method === 'GET' && url.pathname === '/api/articles') {
      const result = await db.query(
        `SELECT a.id, a.title, a.summary, a.published_at AS "publishedAt",
          (SELECT i.id FROM article_images i WHERE i.article_id = a.id ORDER BY i.sort_order, i.created_at LIMIT 1) AS "coverImageId"
         FROM articles a WHERE a.status = 'published' ORDER BY a.published_at DESC LIMIT 100`,
      );
      return send(res, 200, { articles: result.rows });
    }
    const publicArticleMatch = url.pathname.match(new RegExp(`^/api/articles/(${uuidPath})$`));
    if (method === 'GET' && publicArticleMatch) return send(res, 200, { article: await articleWithImages(publicArticleMatch[1], true) });

    if (method === 'GET' && url.pathname === '/api/admin/articles') {
      requireAdmin(req);
      const result = await db.query('SELECT id FROM articles ORDER BY updated_at DESC LIMIT 100');
      return send(res, 200, { articles: await Promise.all(result.rows.map((row) => articleWithImages(row.id))) });
    }
    if (method === 'POST' && url.pathname === '/api/admin/articles') {
      requireAdmin(req);
      const body = await readJson(req, 40_000);
      const id = randomUUID();
      await db.query('INSERT INTO articles (id, title, summary, body) VALUES ($1, $2, $3, $4)',
        [id, text(body.title, 160, true), text(body.summary ?? '', 500), text(body.body, 30_000, true)]);
      return send(res, 201, { article: await articleWithImages(id) });
    }
    const adminArticleMatch = url.pathname.match(new RegExp(`^/api/admin/articles/(${uuidPath})$`));
    if (method === 'GET' && adminArticleMatch) {
      requireAdmin(req);
      return send(res, 200, { article: await articleWithImages(adminArticleMatch[1]) });
    }
    if (method === 'PATCH' && adminArticleMatch) {
      requireAdmin(req);
      const body = await readJson(req, 40_000);
      const status = text(body.status, 20, true);
      if (!['draft', 'published'].includes(status)) throw clientError('文章狀態不正確。');
      const result = await db.query(
        `UPDATE articles SET title = $2, summary = $3, body = $4, status = $5,
          published_at = CASE WHEN $5 = 'published' THEN COALESCE(published_at, now()) ELSE NULL END,
          updated_at = now() WHERE id = $1 RETURNING id`,
        [adminArticleMatch[1], text(body.title, 160, true), text(body.summary ?? '', 500), text(body.body, 30_000, true), status],
      );
      if (!result.rows.length) throw clientError('找不到這篇文章。', 404);
      return send(res, 200, { article: await articleWithImages(adminArticleMatch[1]) });
    }
    if (method === 'DELETE' && adminArticleMatch) {
      requireAdmin(req);
      const result = await db.query('DELETE FROM articles WHERE id = $1 RETURNING id', [adminArticleMatch[1]]);
      if (!result.rows.length) throw clientError('找不到這篇文章。', 404);
      return send(res, 200, { ok: true });
    }
    const uploadMatch = url.pathname.match(new RegExp(`^/api/admin/articles/(${uuidPath})/images$`));
    if (method === 'POST' && uploadMatch) {
      requireAdmin(req);
      const body = await readJson(req, 7_100_000);
      if (typeof body.data !== 'string' || !/^[A-Za-z0-9+/]+={0,2}$/.test(body.data)) throw clientError('圖片資料格式不正確。');
      const bytes = Buffer.from(body.data, 'base64');
      if (!bytes.length || bytes.length > 5 * 1024 * 1024) throw clientError('圖片需小於 5 MB。', 413);
      const contentType = imageType(bytes);
      if (!contentType) throw clientError('只接受 PNG、JPEG 或 WebP 圖片。');
      const altText = text(body.altText ?? '', 200);
      const count = await db.query('SELECT count(*)::int AS total FROM article_images WHERE article_id = $1', [uploadMatch[1]]);
      if (count.rows[0].total >= 8) throw clientError('每篇文章最多 8 張圖片。');
      const id = randomUUID();
      try {
        await db.query('INSERT INTO article_images (id, article_id, content_type, image_data, alt_text, sort_order) VALUES ($1, $2, $3, $4, $5, $6)',
          [id, uploadMatch[1], contentType, bytes, altText, count.rows[0].total]);
      } catch (error) {
        if (error.code === '23503') throw clientError('找不到這篇文章。', 404);
        throw error;
      }
      return send(res, 201, { image: { id, altText } });
    }
    const deleteImageMatch = url.pathname.match(new RegExp(`^/api/admin/articles/(${uuidPath})/images/(${uuidPath})$`));
    if (method === 'DELETE' && deleteImageMatch) {
      requireAdmin(req);
      const result = await db.query('DELETE FROM article_images WHERE article_id = $1 AND id = $2 RETURNING id', [deleteImageMatch[1], deleteImageMatch[2]]);
      if (!result.rows.length) throw clientError('找不到圖片。', 404);
      return send(res, 200, { ok: true });
    }
    const adminImageMatch = url.pathname.match(new RegExp(`^/api/admin/images/(${uuidPath})$`));
    if (method === 'GET' && adminImageMatch) {
      requireAdmin(req);
      await serveImage(res, adminImageMatch[1], true);
      return;
    }
    const imageMatch = url.pathname.match(new RegExp(`^/api/images/(${uuidPath})$`));
    if (method === 'GET' && imageMatch) {
      await serveImage(res, imageMatch[1], false);
      return;
    }

    if (url.pathname.startsWith('/api/')) return send(res, 404, { error: '找不到此功能。' });
    if (method === 'GET') {
      await serveWebsite(res, url.pathname);
      return;
    }
    return send(res, 405, { error: '不支援此操作。' });
  } catch (error) {
    const status = Number(error.status) || 500;
    if (status === 500) console.error(error);
    send(res, status, { error: status === 500 ? '伺服器暫時無法處理，請稍後再試。' : error.message });
  }
});

server.listen(port, host, () => {
  console.log(`SDS API listening at http://${host}:${port}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, async () => {
    server.close();
    await db.end();
    process.exit(0);
  });
}
