/**
 * fetch-gfonts-family.mjs — download a full Google-Fonts family that is only
 * served as unicode-range subset chunks (e.g. CJK families > 20MB single-file
 * limit of jsdelivr).
 *
 * Usage:
 *   node scripts/fetch-gfonts-family.mjs <familyQuery> <outDir> <metaName>
 *
 * Examples:
 *   node scripts/fetch-gfonts-family.mjs "Noto+Serif+SC:wght@400;700" assets/fonts/_chunks noto-serif-sc
 *
 * What it does:
 *   1. GET fonts.googleapis.com/css2?family=...&display=swap with a desktop UA
 *   2. parse every @font-face block: font-weight + unicode-range + src url
 *   3. download each woff2 chunk (dedup by weight+range) into <outDir>/<metaName>/
 *   4. write <metaName>.json: [{ weight, range, file, bytes }]
 *
 * Output JSON is consumed by build-client.mjs registry ("chunks" entry).
 */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const [, , queryArg, outDirArg, metaName] = process.argv;
if (!queryArg || !outDirArg || !metaName) {
  console.error('usage: node fetch-gfonts-family.mjs <familyQuery> <outDir> <metaName>');
  process.exit(2);
}
const outDir = join(ROOT, outDirArg, metaName);
mkdirSync(outDir, { recursive: true });

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
const cssUrl = `https://fonts.googleapis.com/css2?family=${queryArg}&display=swap`;

async function getText(url) {
  const res = await fetch(url, { headers: { 'user-agent': UA } });
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  return res.text();
}

async function getBytes(url) {
  const res = await fetch(url, { headers: { 'user-agent': UA } });
  if (!res.ok) throw new Error(`GET ${url.slice(0, 90)} -> ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

// Parse @font-face blocks (regex over the css; Google css is regular).
const css = await getText(cssUrl);
const blockRe = /@font-face\s*{([^}]*)}/g;
const entries = [];
let m;
while ((m = blockRe.exec(css)) !== null) {
  const body = m[1];
  const weightM = /font-weight:\s*([0-9]+(?:\s+[0-9]+)?);/.exec(body);
  const rangeM = /unicode-range:\s*([^;]+);/.exec(body);
  const urlM = /url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/.exec(body);
  if (!weightM || !rangeM || !urlM) continue;
  entries.push({ weight: weightM[1].trim(), range: rangeM[1].trim(), url: urlM[1] });
}
if (entries.length === 0) throw new Error('no @font-face entries parsed');
console.log(`[gfonts] ${entries.length} subset entries for ${cssUrl}`);

const seen = new Set();
const chunks = [];
for (let i = 0; i < entries.length; i++) {
  const e = entries[i];
  const key = `${e.weight}|${e.range}`;
  if (seen.has(key)) continue;
  seen.add(key);
  const fileName = `${metaName}-${e.weight}-${String(i).padStart(3, '0')}.woff2`;
  const buf = await getBytes(e.url);
  if (buf.length < 100) throw new Error(`suspiciously small chunk ${fileName} (${buf.length})`);
  writeFileSync(join(outDir, fileName), buf);
  chunks.push({ weight: e.weight, range: e.range, file: fileName, bytes: buf.length });
  if (i % 25 === 0) console.log(`[gfonts] ${i + 1}/${entries.length} ...`);
}
const totalMb = (chunks.reduce((s, c) => s + c.bytes, 0) / 1048576).toFixed(1);
writeFileSync(join(outDir, `${metaName}.json`), JSON.stringify({ familyQuery: queryArg, chunks }, null, 2));
console.log(`[gfonts] done: ${chunks.length} chunks, ${totalMb} MB total -> ${join(outDir, `${metaName}.json`)}`);
