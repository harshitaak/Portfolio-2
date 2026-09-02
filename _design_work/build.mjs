import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, 'build');
mkdirSync(out, { recursive: true });

const font = readFileSync('D:\\Portfolio\\assets\\fonts\\Satoshi-Variable.woff2').toString('base64');

const DARK_TO_LIGHT = {
  '#262626': '#e8e8e8',
  '#e4e4e4': '#161616',
  '#58a7dc': '#0a8fd1',
  '#7bbbe5': '#37a5df',
  '#858585': '#7f7f7f'
};

const CRESCENT = /<svg viewBox="0 0 24 24" style="width: 20px; height: 20px; display: block;">[\s\S]*?<\/svg>/;
const SUN = `<svg viewBox="0 0 24 24" style="width: 20px; height: 20px; display: block;">
            <circle cx="12" cy="12" r="6" fill="#7f7f7f" />
            <g stroke="#7f7f7f" stroke-width="2" stroke-linecap="round">
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </g>
          </svg>`;

function toLight(src) {
  let s = src.replace(/#262626|#e4e4e4|#58a7dc|#7bbbe5|#858585/g, m => DARK_TO_LIGHT[m]);
  s = s.replace(/rgba\(228,228,228,0\.12\)/g, 'rgba(22,22,22,0.12)');
  if (!CRESCENT.test(s)) throw new Error('theme-toggle glyph not found in Main.dc.html');
  return s.replace(CRESCENT, SUN);
}

const sources = readdirSync(here).filter(f => f.endsWith('.dc.html'));
const written = [];

for (const f of sources) {
  const src = readFileSync(join(here, f), 'utf8');
  writeFileSync(join(out, f), src.replaceAll('__SATOSHI_WOFF2__', font));
  written.push(f);
}

const main = readFileSync(join(here, 'Main.dc.html'), 'utf8');
writeFileSync(join(out, 'LightMode.dc.html'), toLight(main).replaceAll('__SATOSHI_WOFF2__', font));
written.push('LightMode.dc.html (generated from Main)');

writeFileSync(join(out, 'canvas.json'), readFileSync(join(here, 'canvas.json')));

console.log('built into build/:', written.join(', '));
console.log('font base64:', Math.round(font.length / 1024) + 'KB');
