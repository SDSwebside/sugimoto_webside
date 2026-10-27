import { randomBytes, scryptSync } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(root, '.local-data');
const target = path.join(dataDir, 'admin.json');
await mkdir(dataDir, { recursive: true });

try {
  await readFile(target);
  console.error('管理者帳號已建立。若要重設，請先備份並移除 .local-data/admin.json。');
  process.exit(1);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const password = randomBytes(18).toString('base64url');
const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64);
await writeFile(target, JSON.stringify({ salt: salt.toString('hex'), hash: hash.toString('hex') }), { mode: 0o600 });
console.log(`本機管理者密碼（只顯示這一次）：${password}`);
