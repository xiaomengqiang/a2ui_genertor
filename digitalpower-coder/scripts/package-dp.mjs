#!/usr/bin/env node
// package-dp.mjs
// Initializes a digitalpower prototype folder: creates {slug}/, links assets/,
// and copies the slim template HTML. The AI then fills the babel block via Edit.
//
// Usage:
//   node package-dp.mjs "<artifact-folder>" "<slug>"
//   (if artifact-folder is omitted, falls back to cwd)
//
// Output (agent-parseable):
//   RESULT: OK
//   HTML_PATH: <absolute path to {slug}/index.digitalpower.html>
//   RESULT: FAIL | <reason>
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
  readdirSync,
} from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function fail(reason) {
  console.log(`RESULT: FAIL | ${reason}`);
  process.exit(1);
}

// --- args: [artifactFolder?, slug] ---
const args = process.argv.slice(2).filter((a) => !a.startsWith('-'));
let artifactFolder, slug;
if (args.length === 2) {
  [artifactFolder, slug] = args;
} else if (args.length === 1) {
  artifactFolder = process.cwd();
  [slug] = args;
} else {
  fail('Usage: node package-dp.mjs "<artifact-folder>" "<slug>"');
}

if (!existsSync(artifactFolder) || !statSync(artifactFolder).isDirectory()) {
  fail(`Artifact folder does not exist or is not a directory: ${artifactFolder}`);
}
if (!/^[a-z0-9]+(-[a-z0-9]+){1,5}$/.test(slug)) {
  fail(`Slug must be kebab-case ascii, 2-6 hyphen-separated segments: '${slug}'`);
}

// ---------- 1. resolve template (via script location) ----------
const previewdist = resolve(__dirname, 'previewdist');
const assetsSrc = join(previewdist, 'assets');
const htmlSrc = join(previewdist, 'index.digitalpower.html');
if (!existsSync(assetsSrc)) fail(`template assets missing: ${assetsSrc}`);
if (!existsSync(htmlSrc)) fail(`template html missing: ${htmlSrc}`);

// ---------- 2. create destination ----------
const dest = join(artifactFolder, slug);
mkdirSync(dest, { recursive: true });

// ---------- 3. link assets (junction/symlink preferred; cpSync fallback) ----------
const assetsDst = join(dest, 'assets');
let assetsReady = false;
if (existsSync(assetsDst)) {
  assetsReady = true; // already present from a prior run — accept as-is
} else {
  try { rmSync(assetsDst, { force: true }); } catch { /* nothing to remove */ }
  try {
    if (process.platform === 'win32') {
      symlinkSync(assetsSrc, assetsDst, 'junction'); // junction: no admin needed
    } else {
      symlinkSync(assetsSrc, assetsDst, 'dir');
    }
    assetsReady = existsSync(assetsDst);
  } catch {
    try {
      cpSync(assetsSrc, assetsDst, { recursive: true }); // fallback: full copy
      assetsReady = existsSync(assetsDst);
    } catch {
      assetsReady = false;
    }
  }
}
if (!assetsReady) fail(`Could not link or copy assets to: ${assetsDst}`);

// verify the runtime js is reachable through the link (it lives in assets/library/)
const libraryDir = join(assetsDst, 'library');
let libFiles = [];
try { libFiles = readdirSync(libraryDir); } catch { /* link broken */ }
const runtimeOk =
  libFiles.includes('@tailwindcss-browser.js') &&
  libFiles.includes('antd.min.js') &&
  libFiles.includes('babel.min.js');
if (!runtimeOk) fail(`assets/library runtime js not reachable at: ${libraryDir}`);

// ---------- 4. copy the slim template ----------
const htmlDst = join(dest, 'index.digitalpower.html');
copyFileSync(htmlSrc, htmlDst);

// ---------- 5. done ----------
console.log('RESULT: OK');
console.log(`HTML_PATH: ${resolve(htmlDst)}`);
process.exit(0);
