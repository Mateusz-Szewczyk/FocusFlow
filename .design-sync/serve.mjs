/* Static server for local verification.
   The _ds_bundle.js loader uses synchronous XHR, which does not work over
   file:// — so the pages must be served over HTTP to render at all.

   Usage:  node .design-sync/serve.mjs   →  http://localhost:8177 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { extname, join, normalize, dirname } from 'node:path';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const PORT = 8177;

const TYPES = {
  '.html': 'text/html', '.js': 'text/javascript', '.jsx': 'text/plain',
  '.css': 'text/css', '.json': 'application/json', '.md': 'text/plain',
  '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml',
};

createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    const file = join(ROOT, normalize(p).replace(/^(\.\.[/\\])+/, ''));
    const buf = await readFile(file);
    res.writeHead(200, {
      'Content-Type': TYPES[extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(buf);
  } catch (e) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 ' + e.message);
  }
}).listen(PORT, () => console.log(`serving ${ROOT} on http://localhost:${PORT}`));
