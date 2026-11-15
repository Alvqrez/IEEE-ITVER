// Copia la cabecera y el pie de index.html a las demás páginas de cada propuesta multipágina,
// y marca con aria-current="page" el enlace de la página actual.
// Bloques: <!-- comun:nombre --> ... <!-- /comun:nombre -->. Edita los bloques SOLO en index.html.
// Uso: node scripts/sincronizar.mjs   (o npm run sincronizar)
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PROP = join(ROOT, 'propuestas');
const BLOCK = /<!-- comun:([\w-]+) -->([\s\S]*?)<!-- \/comun:\1 -->/g;

const mark = (html, file) => html.replace(BLOCK, (all, name, body) => {
  const clean = body.replaceAll(' aria-current="page"', '');
  const marked = clean.replace(new RegExp(`(<a\\b[^>]*?\\shref="${file.replace('.', '\\.')}")`, 'g'), '$1 aria-current="page"');
  return `<!-- comun:${name} -->${marked}<!-- /comun:${name} -->`;
});

let total = 0;
for (const dir of readdirSync(PROP)) {
  const index = join(PROP, dir, 'index.html');
  if (!existsSync(index)) continue;
  const src = readFileSync(index, 'utf8');
  const blocks = new Map([...src.matchAll(BLOCK)].map((m) => [m[1], m[2]]));
  if (!blocks.size) continue;
  const pages = readdirSync(join(PROP, dir)).filter((f) => f.endsWith('.html'));
  for (const f of pages) {
    const p = join(PROP, dir, f);
    let html = readFileSync(p, 'utf8');
    if (f !== 'index.html') html = html.replace(BLOCK, (all, name, body) => (blocks.has(name) ? `<!-- comun:${name} -->${blocks.get(name)}<!-- /comun:${name} -->` : all));
    html = mark(html, f);
    writeFileSync(p, html);
    total++;
  }
  console.log(`${dir}: ${pages.length} páginas sincronizadas (${[...blocks.keys()].join(', ')}).`);
}
if (!total) console.log('Ninguna propuesta usa bloques comunes.');
