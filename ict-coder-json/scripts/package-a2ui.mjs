#!/usr/bin/env node
// package-a2ui.mjs
// Packages a validated A2UI JSON into a runnable prototype preview.
// Cross-platform (Windows/macOS/Linux) — requires only Node.js.
//
// Static assets (~37MB TTF fonts + JS bundle) are shared via a symlink
// (junction on Windows) to <skill>/scripts/previewdist/assets, so the
// per-generation write is ~70KB (HTML + data.js) instead of 37MB.
// Falls back to fs.cpSync (full copy) when link creation fails
// (cross-volume, restricted filesystems).
//
// Usage:
//   node package-a2ui.mjs --slug "data-dashboard" --json "output/a2ui-output-xxx.json" [--cleanup] [--artifact-folder "..."]
//   short: -s -j -c -a
//
// Output (agent-parseable):
//   RESULT: OK
//   HTML_PATH: <absolute path>
//   RESULT: FAIL | <reason>
//   [WARN: cleanup failed <path>]   (only with --cleanup, on delete failure)
//
// Exit code: 0 on success, 1 on failure.

import {
  existsSync,
  statSync,
  mkdirSync,
  symlinkSync,
  rmSync,
  cpSync,
  copyFileSync,
  writeFileSync,
  readFileSync,
  readdirSync,
} from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function fail(reason) {
  console.log(`RESULT: FAIL | ${reason}`);
  process.exit(1);
}

// --- parse args (no external deps; mirrors validate-a2ui.mjs style) ---
const args = process.argv.slice(2);
function getOpt(long, short) {
  const idx = args.findIndex((a) => a === long || a === short);
  if (idx === -1) return undefined;
  const val = args[idx + 1];
  if (val === undefined || val.startsWith('-')) fail(`Missing value for ${long}`);
  return val;
}
function hasFlag(long, short) {
  return args.includes(long) || args.includes(short);
}

const slug = getOpt('--slug', '-s');
const jsonFile = getOpt('--json', '-j');
const artifactFolder =
  getOpt('--artifact-folder', '-a') ||
  process.env.OCTO_ARTIFACT_FOLDER ||
  process.cwd();
const cleanup = hasFlag('--cleanup', '-c');

if (!slug) fail('Missing --slug');
if (!jsonFile) fail('Missing --json');
if (!existsSync(artifactFolder) || !statSync(artifactFolder).isDirectory()) {
  fail(`ArtifactFolder does not exist or is not a directory: ${artifactFolder}`);
}

// ---------- 1. resolve skill previewdist template (via script location) ----------
const previewdist = resolve(__dirname, 'previewdist');
if (!existsSync(previewdist)) fail(`previewdist template not found: ${previewdist}`);
const assetsSrc = join(previewdist, 'assets');
const htmlSrc = join(previewdist, 'index.prototype.html');
if (!existsSync(assetsSrc)) fail(`template assets missing: ${assetsSrc}`);
if (!existsSync(htmlSrc)) fail(`template index.prototype.html missing: ${htmlSrc}`);

// ---------- 2. validate slug (kebab-case ascii, 2-6 segments) ----------
if (!/^[a-z0-9]+(-[a-z0-9]+){1,5}$/.test(slug)) {
  fail(`Slug must be kebab-case ascii, 2-6 hyphen-separated segments: '${slug}'`);
}

// ---------- 3. read validated JSON ----------
if (!existsSync(jsonFile)) fail(`JsonFile not found: ${jsonFile}`);
const jsonRaw = readFileSync(jsonFile, 'utf8').trim();
if (!jsonRaw) fail(`JsonFile is empty: ${jsonFile}`);

// ---------- 4. prepare destination ----------
const dest = join(artifactFolder, slug);
mkdirSync(dest, { recursive: true });

// ---------- 5. link assets (junction/symlink preferred; cpSync fallback) ----------
const assetsDst = join(dest, 'assets');
let assetsReady = false;
if (existsSync(assetsDst)) {
  // already present (real dir or working link from a prior run) — accept as-is
  assetsReady = true;
} else {
  // clear a possible broken link/junction stub (existsSync follows links → false for broken)
  try { rmSync(assetsDst, { force: true }); } catch { /* nothing to remove */ }

  try {
    if (process.platform === 'win32') {
      symlinkSync(assetsSrc, assetsDst, 'junction'); // junction: no admin, same-volume
    } else {
      symlinkSync(assetsSrc, assetsDst, 'dir');
    }
    assetsReady = existsSync(assetsDst); // follows link → true if target reachable
  } catch {
    // fallback: full recursive copy (cross-volume safe, but ~37MB)
    try {
      cpSync(assetsSrc, assetsDst, { recursive: true });
      assetsReady = existsSync(assetsDst);
    } catch {
      assetsReady = false;
    }
  }
}
if (!assetsReady) fail(`Could not link or copy assets to: ${assetsDst}`);

// verify runtime JS bundle reachable (follows symlink/junction when linked)
// accepts both "index.js" and hashed "index-xxxx.js" naming
const runtimeJs = readdirSync(assetsDst).find((f) => /^index(-[\w-]+)?\.js$/.test(f));
if (!runtimeJs) fail(`assets/ has no index.js — link/copy incomplete at: ${assetsDst}`);

// ---------- 6. copy HTML as-is (small ~21KB, no rename) ----------
const htmlDst = join(dest, 'index.prototype.html');
copyFileSync(htmlSrc, htmlDst);

// ---------- 7. inject data.js (UTF-8 no BOM) ----------
const dataJsPath = join(dest, 'data.js');
const dataContent = `window.__A2UI_DATA__ = ${jsonRaw};`;
writeFileSync(dataJsPath, dataContent, 'utf8');

// ---------- 8. done (print both lines BEFORE any cleanup) ----------
const htmlAbsolute = resolve(htmlDst);
console.log('RESULT: OK');
console.log(`HTML_PATH: ${htmlAbsolute}`);

// ---------- 9. optional cleanup: remove the input JSON (never the deliverables) ----------
if (cleanup) {
  try {
    rmSync(jsonFile, { force: true });
  } catch {
    console.log(`WARN: cleanup failed ${jsonFile}`);
  }
}
process.exit(0);
