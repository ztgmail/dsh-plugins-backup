/**
 * build-client.mjs — dsh-font-switcher offline-font bundle builder.
 *
 * Inputs:
 *   - scripts/client.template.js   (client logic with marker `/*__DSF_FONTS_BLOCK__*​/`)
 *   - scripts/fonts.registry.json  (embedded-font entries; see schema below)
 *   - assets/fonts/woff2/<slug>/…  (single-file WOFF2 families)
 *   - assets/fonts/chunks/<slug>/  (Google-Fonts unicode-range chunk families:
 *                                   <slug>.json + chunk .woff2 files)
 *   - assets/fonts/licenses/*      (kept for redistribution; recorded in meta)
 *
 * Output: lib/client.js — template with the marker replaced by a generated block
 * declaring DSF_EMBEDDED (slug -> {family, css, license, source}) and
 * installEmbeddedFonts(). Block stays inside the ModuleLoader factory closure.
 *
 * Registry entry schema:
 *   { "slug", "family", "kind": "ui"|"code",
 *     "files":   [{ "file": <rel assets/fonts/woff2>, "weight": 400 } | { …, "weightMin":100, "weightMax":900 }],
 *     "chunks":  { "json": <rel plugin root, points to <slug>.json with {chunks:[{weight,range,file,bytes}]}> },
 *     "license", "source", "note" }
 * (exactly one of files/chunks per entry)
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TEMPLATE = join(ROOT, 'scripts', 'client.template.js');
const REGISTRY = join(ROOT, 'scripts', 'fonts.registry.json');
const OUT = join(ROOT, 'lib', 'client.js');
const WOFF2_DIR = join(ROOT, 'assets', 'fonts', 'woff2');
const MARKER = '/*__DSF_FONTS_BLOCK__*/';

function err(msg) {
  console.error('[build-client] ' + msg);
  process.exitCode = 1;
  throw new Error(msg);
}

const template = readFileSync(TEMPLATE, 'utf8');
if (!template.includes(MARKER)) err(`marker ${MARKER} not found in template`);

let registry = [];
if (existsSync(REGISTRY)) {
  registry = JSON.parse(readFileSync(REGISTRY, 'utf8'));
  if (!Array.isArray(registry)) err('fonts.registry.json must be an array');
}

function weightDecl(f) {
  if (f.weight != null) return `font-weight:${f.weight}`;
  if (f.weightMin != null && f.weightMax != null) return `font-weight:${f.weightMin} ${f.weightMax}`;
  return null;
}

/** Build @font-face CSS for one family. Returns { css, ruleCount } or throws. */
function buildFaces(entry) {
  const family = entry.family;
  const faces = [];
  if (Array.isArray(entry.files) && entry.files.length > 0) {
    for (const f of entry.files) {
      const p = join(WOFF2_DIR, entry.slug, f.file);
      if (!existsSync(p)) err(`missing font file for ${entry.slug}: ${p}`);
      const b64 = readFileSync(p).toString('base64');
      const wd = weightDecl(f);
      if (!wd) err(`entry ${entry.slug}: file must set weight or weightMin/weightMax`);
      faces.push(`@font-face{font-family:"${family}";src:url("data:font/woff2;base64,${b64}") format("woff2");${wd};font-style:normal;font-display:swap}`);
    }
  } else if (entry.chunks && entry.chunks.json) {
    const metaPath = join(ROOT, entry.chunks.json);
    if (!existsSync(metaPath)) err(`missing chunk json for ${entry.slug}: ${metaPath}`);
    const meta = JSON.parse(readFileSync(metaPath, 'utf8'));
    const dir = dirname(metaPath);
    for (const ch of meta.chunks) {
      const p = join(dir, ch.file);
      if (!existsSync(p)) err(`missing chunk file for ${entry.slug}: ${p}`);
      const b64 = readFileSync(p).toString('base64');
      const w = String(ch.weight).trim();
      const wd = w.includes(' ') ? `font-weight:${w.replace(/\s+/g, ' ')}` : `font-weight:${w}`;
      const range = String(ch.range).trim();
      faces.push(`@font-face{font-family:"${family}";src:url("data:font/woff2;base64,${b64}") format("woff2");${wd};unicode-range:${range};font-style:normal;font-display:swap}`);
    }
  } else {
    err(`entry ${entry.slug}: need files[] or chunks.json`);
  }
  return faces;
}

const lines = [];
lines.push('/** Embedded-font metadata & @font-face sheets (generated, offline). */');
lines.push('var DSF_EMBEDDED = {};');
lines.push('var DSF_EMBEDDED_FAMILIES = {};');
lines.push('var DSF_EMBED_STYLE_ID = \'dsh-font-switcher/embedded-fonts\';');
lines.push('function installEmbeddedFonts() {');
lines.push('  if (typeof document === \'undefined\') return;');
lines.push('  var css = [];');
lines.push('  var slug, i, families = Object.keys(DSF_EMBEDDED);');
lines.push('  for (i = 0; i < families.length; i++) { slug = families[i]; css.push(DSF_EMBEDDED[slug].css); }');
lines.push('  if (css.length === 0) return;');
lines.push('  if (document.querySelector(\'style[data-plugin-css="\' + DSF_EMBED_STYLE_ID + \'"]\') !== null) return;');
lines.push('  var tag = document.createElement(\'style\');');
lines.push('  tag.dataset.plugin = \'dsh-font-switcher\';');
lines.push('  tag.dataset.pluginCss = DSF_EMBED_STYLE_ID;');
lines.push('  tag.textContent = css.join(\'\\n\');');
lines.push('  document.head.appendChild(tag);');
lines.push('}');
lines.push('');

let totalBytes = 0;
let ruleCount = 0;
for (const entry of registry) {
  const { slug, family, license, source, note } = entry;
  if (!slug || !family) err(`invalid registry entry: ${JSON.stringify(entry)}`);
  const faces = buildFaces(entry);
  for (const raw of faces) totalBytes += Math.ceil(((raw.length - raw.indexOf('base64,') - 7) * 3) / 4);
  ruleCount += faces.length;
  const cssLiteral = JSON.stringify(faces.join('\n'));
  lines.push(`DSF_EMBEDDED[${JSON.stringify(slug)}] = { family: ${JSON.stringify(family)}, kind: ${JSON.stringify(entry.kind || '')}, license: ${JSON.stringify(license || '')}, source: ${JSON.stringify(source || '')}, note: ${JSON.stringify(note || '')}, css: ${cssLiteral} };`);
  lines.push(`DSF_EMBEDDED_FAMILIES[${JSON.stringify(family)}] = true;`);
}
lines.push('');

const block = lines.map((l) => '    ' + l).join('\n');
const out = template.replace(MARKER, block);
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, out, 'utf8');

const totalMb = (totalBytes / 1048576).toFixed(1);
const outKb = (statSync(OUT).size / 1048576).toFixed(1);
console.log(`[build-client] embedded ${registry.length} families / ${ruleCount} @font-face rules (~${totalMb} MB woff2 payload base64-inline)`);
console.log(`[build-client] wrote ${OUT} (${outKb} MB)`);
