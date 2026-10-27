import { createServer } from 'node:http';
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto';
import { readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { PGlite } from '@electric-sql/pglite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const localData = path.join(root, '.local-data');
const port = Number(process.env.SDS_API_PORT || 3001);
const allowedOrigins = new Set([
  'http://127.0.0.1:5173',
  'http://localhost:5173',
]);
const courseIds = new Set(['seminar', 'beginner', 'intermediate', 'advanced']);
const registrationStatuses = new Set(['new', 'contacting', 'confirmed', 'cancelled']);
const sessions = new Map();
const attempts = new Map();

await mkdir(localData, { recursive: true });
const db = new PGlite(path.join(localData, 'pgdata'));
await db.waitReady;
await db.exec(await readFile(path.join(root, 'server', 'schema.sql'), 'utf8'));

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

async function readJson(req) {
  if (!req.headers['content-type']?.startsWith('application/json')) throw clientError('請使用 JSON 格式送出。', 415);
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 16_384) throw clientError('送出內容過大。', 413);
  }
  try {
    const value = JSON.parse(raw);
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error();
    return value;
  } catch {
    throw clientError('表單資料格式不正確。');
  }
}

function checkOrigin(req) {
  const origin = req.headers.origin;
  if (origin && !allowedOrigins.has(origin)) throw clientError('不允許從此網頁送出資料。', 403);
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
  try {
    return JSON.parse(await readFile(path.join(localData, 'admin.json'), 'utf8'));
  } catch {
    throw clientError('管理者帳號尚未初始化。', 503);
  }
}

function adminCookie(value, maxAge) {
  return `sds_admin=${value}; HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age=${maxAge}`;
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://127.0.0.1:${port}`);
    const method = req.method || 'GET';
    if (method !== 'GET' && method !== 'HEAD') checkOrigin(req);

    if (method === 'GET' && url.pathname === '/api/health') {
      send(res, 200, { ok: true, storage: 'local-pglite' });
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

    send(res, 404, { error: '找不到此功能。' });
  } catch (error) {
    const status = Number(error.status) || 500;
    if (status === 500) console.error(error);
    send(res, status, { error: status === 500 ? '伺服器暫時無法處理，請稍後再試。' : error.message });
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`SDS local API listening at http://127.0.0.1:${port}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, async () => {
    server.close();
    await db.close();
    process.exit(0);
  });
}
