import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const api = spawn(process.execPath, [path.join(root, 'server', 'index.mjs')], { cwd: root, stdio: 'inherit' });
const web = spawn(process.execPath, [path.join(root, 'node_modules', 'vite', 'bin', 'vite.js')], { cwd: root, stdio: 'inherit' });

function stop() {
  api.kill();
  web.kill();
}

process.on('SIGINT', stop);
process.on('SIGTERM', stop);
api.on('exit', (code) => { if (code) { console.error('API stopped unexpectedly.'); web.kill(); process.exitCode = code; } });
web.on('exit', (code) => { if (code) { console.error('Web preview stopped unexpectedly.'); api.kill(); process.exitCode = code; } });
