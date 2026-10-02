/**
 * Turns the regular build in dist/ into one HTML file: the stylesheet and the script are inlined.
 * The CV is not embedded — "Download CV" points at the copy on the live site — and fonts come
 * from Google Fonts, so those two need a connection; everything else works from the file alone.
 *
 * Usage: npm run build:single  →  single/viktor-zhuk.html
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LIVE_CV = 'https://zazplay.github.io/viktor-zhuk/Viktor_Zhuk_CV.pdf';
const dist = resolve(root, 'dist');
const read = (file) => readFileSync(resolve(dist, file));

let html = read('index.html').toString('utf8');

const css = html.match(/<link rel="stylesheet"[^>]*href="\.\/(assets\/[^"]+\.css)"[^>]*>/);
const js = html.match(/<script type="module"[^>]*src="\.\/(assets\/[^"]+\.js)"[^>]*><\/script>/);
if (!css || !js) throw new Error('dist/index.html does not reference one stylesheet and one script — run `npm run build` first');

let script = read(js[1]).toString('utf8');

// The CV link is the relative string "./Viktor_Zhuk_CV.pdf" in the bundle, which means nothing
// next to a loose HTML file; point it at the published copy instead.
const cvRef = /(["'`])\.\/Viktor_Zhuk_CV\.pdf\1/g;
const found = script.match(cvRef)?.length ?? 0;
if (found !== 1) throw new Error(`expected the CV path once in the bundle, found it ${found} times`);
script = script.replace(cvRef, JSON.stringify(LIVE_CV));

// A literal "</script" inside the code would close the tag early.
script = script.replace(/<\/script/gi, '<\\/script');

html = html
  .replace(css[0], () => `<style>${read(css[1]).toString('utf8')}</style>`)
  .replace(js[0], () => `<script type="module">${script}</script>`);

mkdirSync(resolve(root, 'single'), { recursive: true });
const out = resolve(root, 'single/viktor-zhuk.html');
writeFileSync(out, html);
console.log(`single/viktor-zhuk.html — ${(Buffer.byteLength(html) / 1024).toFixed(0)} KB`);
