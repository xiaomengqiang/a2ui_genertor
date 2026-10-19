#!/usr/bin/env node
// exchange-a2ui.mjs
// Converts between packaged data.js and plain JSON files.
// Two modes:
//   --extract : data.js  -> output/xxx.json  (strip the window wrapper, pretty-print)
//   --inject  : xxx.json -> data.js          (validate-shaped wrap: window.__A2UI_DATA__ = <json>;)
//
// Usage:
//   node exchange-a2ui.mjs --extract "<data.js>" "<out.json>"   (data.js -> pretty JSON)
//   node exchange-a2ui.mjs --inject  "<in.json>" "<data.js>"    (JSON -> data.js)
//   short: -e -i
//
// Output (agent-parseable):
//   RESULT: OK
//   FILE: <absolute path of the written file>
//   RESULT: FAIL | <reason>
//
// Exit code: 0 on success, 1 on failure.

import {
  existsSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
} from 'fs';
import { resolve, dirname } from 'path';

function fail(reason) {
  console.log(`RESULT: FAIL | ${reason}`);
  process.exit(1);
}

// --- parse args: mode flag + two positional paths (source, target) ---
//   --extract <data.js> <out.json>   data.js -> pretty JSON
//   --inject  <json> <data.js>       JSON    -> data.js
const args = process.argv.slice(2);
const extractMode = args.includes('--extract') || args.includes('-e');
const injectMode = args.includes('--inject') || args.includes('-i');
if (extractMode === injectMode) {
  fail('Specify exactly one mode: --extract or --inject');
}
const KNOWN_FLAGS = ['--extract', '-e', '--inject', '-i'];
const unknown = args.find((a) => a.startsWith('-') && !KNOWN_FLAGS.includes(a));
if (unknown) fail(`Unknown option: ${unknown} (usage: --extract <data.js> <out.json> | --inject <in.json> <data.js>)`);
const positional = args.filter((a) => !a.startsWith('-'));
if (positional.length !== 2) {
  fail('Expected exactly 2 paths: <source> <target>');
}
const [srcFile, dstFile] = positional;

const WRAPPER_PREFIX = 'window.__A2UI_DATA__ = ';
const WRAPPER_SUFFIX = ';';

if (extractMode) {
  // ---------- data.js -> pretty JSON ----------
  if (!existsSync(srcFile)) fail(`data.js not found: ${srcFile}`);

  let raw = readFileSync(srcFile, 'utf8').trim();

  // Strip wrapper. Tolerate a file that is already plain JSON (no wrapper).
  let jsonText = raw;
  if (raw.startsWith(WRAPPER_PREFIX)) {
    jsonText = raw.slice(WRAPPER_PREFIX.length);
    if (jsonText.endsWith(WRAPPER_SUFFIX)) {
      jsonText = jsonText.slice(0, -WRAPPER_SUFFIX.length);
    }
    jsonText = jsonText.trim();
  }

  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch (e) {
    fail(`data.js content is not valid JSON after stripping wrapper: ${e.message}`);
  }

  const pretty = JSON.stringify(parsed, null, 2);
  mkdirSync(dirname(resolve(dstFile)), { recursive: true });
  writeFileSync(dstFile, pretty, 'utf8');
  console.log('RESULT: OK');
  console.log(`FILE: ${resolve(dstFile)}`);
  process.exit(0);
}

// ---------- inject mode: JSON -> data.js ----------
if (!existsSync(srcFile)) fail(`JSON file not found: ${srcFile}`);

let jsonRaw = readFileSync(srcFile, 'utf8').trim();
if (!jsonRaw) fail(`JSON file is empty: ${srcFile}`);

// Re-serialize to guarantee compact, wrapper-safe JSON (comments/trailing
// commas would break the browser eval — parse strictly, stringify compactly).
let parsed;
try {
  parsed = JSON.parse(jsonRaw);
} catch (e) {
  fail(`JSON file is not valid JSON: ${e.message}`);
}

const dataContent = `${WRAPPER_PREFIX}${JSON.stringify(parsed)}${WRAPPER_SUFFIX}`;
writeFileSync(dstFile, dataContent, 'utf8');
console.log('RESULT: OK');
console.log(`FILE: ${resolve(dstFile)}`);
process.exit(0);
