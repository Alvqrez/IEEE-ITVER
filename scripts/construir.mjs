// Construye el sitio en dist/: la landing elegida en sitio.config.json queda como página de inicio.
// Sin dependencias. Uso: node scripts/construir.mjs   (o npm run construir)
import { readFileSync, writeFileSync, rmSync, mkdirSync, cpSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const config = JSON.parse(readFileSync(join(ROOT, 'sitio.config.json'), 'utf8'));
const landing = config.landing;
const src = join(ROOT, 'propuestas', landing);
if (!landing || !existsSync(join(src, 'index.html'))) {
  console.error(`La landing "${landing}" no existe. Opciones: ${(config.opciones || []).join(', ')}`);
  process.exit(1);
}

const DIST = join(ROOT, 'dist');
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

// 1. assets compartidos (sin originales ni descargas en bruto)
const SKIP = new Set(['found', 'originales']);
cpSync(join(ROOT, 'propuestas', 'assets'), join(DIST, 'assets'), {
  recursive: true,
  filter: (p) => !p.split(/[\\/]/).some((part) => SKIP.has(part)),
});
// 2. datos del capítulo
cpSync(join(ROOT, 'contenido'), join(DIST, 'contenido'), { recursive: true, filter: (p) => !p.endsWith('ejemplos.js') }); // ejemplos.js es solo para revisar el diseño
// 3. la landing, en la raíz
cpSync(src, DIST, { recursive: true });
// 4. páginas adicionales (inicio de sesión, etc.), cuando existan
if (existsSync(join(ROOT, 'paginas'))) cpSync(join(ROOT, 'paginas'), DIST, { recursive: true, filter: (p) => !p.endsWith('LEEME.md') });

// rutas: las landings viven en propuestas/<nombre>/, el sitio publicado en la raíz
const TEXT = new Set(['.html', '.css', '.js']);
const fix = (s) => s.replaceAll('../../contenido/', 'contenido/').replaceAll('../assets/', 'assets/');
const walk = (dir) => readdirSync(dir).forEach((f) => {
  const p = join(dir, f);
  if (statSync(p).isDirectory()) { if (f !== 'assets' && f !== 'contenido') walk(p); return; }
  if (TEXT.has(extname(p))) writeFileSync(p, fix(readFileSync(p, 'utf8')));
});
walk(DIST);

console.log(`Sitio construido en dist/ con la landing "${landing}".`);
