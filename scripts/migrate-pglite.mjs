import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PGlite } from '@electric-sql/pglite';
import pg from 'pg';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = process.env.SDS_LEGACY_PGLITE_DIR || path.join(root, '.local-data', 'pgdata');
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
if (!existsSync(path.join(source, 'PG_VERSION'))) throw new Error('No legacy PGlite data found.');

const legacy = new PGlite(source);
const target = new pg.Pool({ connectionString: process.env.DATABASE_URL });
let client;
try {
  await legacy.waitReady;
  const { rows } = await legacy.query('SELECT id, receipt_code, course_id, name, email, phone, note, status, admin_note, created_at, updated_at FROM registrations');
  client = await target.connect();
  await client.query('BEGIN');
  let inserted = 0;
  for (const row of rows) {
    const result = await client.query(
      `INSERT INTO registrations (id, receipt_code, course_id, name, email, phone, note, status, admin_note, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) ON CONFLICT (id) DO NOTHING`,
      [row.id, row.receipt_code, row.course_id, row.name, row.email, row.phone, row.note, row.status, row.admin_note, row.created_at, row.updated_at],
    );
    inserted += result.rowCount;
  }
  await client.query('COMMIT');
  console.log(`Legacy registrations: ${rows.length}; copied to PostgreSQL: ${inserted}. Source files were left intact.`);
} catch (error) {
  if (client) await client.query('ROLLBACK');
  throw error;
} finally {
  client?.release();
  await target.end();
  await legacy.close();
}
