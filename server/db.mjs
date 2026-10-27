import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is required. Configure a PostgreSQL database before starting the API.');
}

export const db = new pg.Pool({ connectionString, max: 5, connectionTimeoutMillis: 10_000 });
db.on('error', (error) => console.error('PostgreSQL idle connection error:', error));

export async function initializeDatabase() {
  await db.query(await readFile(path.join(root, 'server', 'schema.sql'), 'utf8'));
  return db.query('SELECT current_database() AS name, current_setting($1) AS version', ['server_version']);
}
