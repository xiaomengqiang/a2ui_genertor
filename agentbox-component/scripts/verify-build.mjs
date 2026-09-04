#!/usr/bin/env node
// verify-build.mjs — Headless verification of the built index.components.html (no browser needed).
//
// Loads the same local UMD libraries the HTML uses (React, ReactDOM, Babel standalone),
// extracts the inline text/babel script from index.components.html, compiles it with Babel
// (exactly like the browser would), executes it with a stubbed DOM, and asserts that
// ReactDOM.createRoot(...).render(<Demo/>) ran successfully.
//
// Usage:  node verify-build.mjs --dir "<scaffold path>"

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

// --- parse --dir argument (the scaffold path to verify) ---
const args = process.argv.slice(2);
const dirIdx = args.findIndex((a) => a === "--dir" || a === "-d");
if (dirIdx === -1 || !args[dirIdx + 1]) {
  console.error("FAIL  Missing --dir <scaffold path>. Usage: node verify-build.mjs --dir \"<path>\"");
  process.exit(1);
}
const ROOT = resolve(args[dirIdx + 1]);

const HTML = resolve(ROOT, "index.components.html");
const LIB = (name) => resolve(ROOT, "assets/library", name);

function loadUmd(code, sandboxRequire) {
  const module = { exports: {} };
  const fn = new Function("module", "exports", "require", code);
  fn(module, module.exports, sandboxRequire || (() => { throw new Error("unexpected require"); }));
  return module.exports;
}

const React = loadUmd(await readFile(LIB("react.production.min.js"), "utf8"));
const ReactDOM = loadUmd(await readFile(LIB("react-dom.production.min.js"), "utf8"), (name) => {
  if (name === "react") return React;
  throw new Error(`unexpected require: ${name}`);
});
const Babel = loadUmd(await readFile(LIB("babel.min.js"), "utf8"));
if (typeof Babel.transform !== "function") {
  throw new Error("Babel standalone did not expose transform()");
}

const html = await readFile(HTML, "utf8");
const match = html.match(/<script type="text\/babel"[^>]*>([\s\S]*?)<\/script>/);
if (!match) throw new Error("No text/babel script found in index.components.html");
const script = match[1];

let compiled;
try {
  compiled = Babel.transform(script, { presets: ["react"] }).code;
  console.log("PASS  Babel compiled the inline script (JSX syntax valid)");
} catch (err) {
  console.error("FAIL  Babel compilation error:");
  console.error(err.message);
  process.exit(1);
}

let renderedElement = null;
let renderCount = 0;
const realCreateRoot = ReactDOM.createRoot;
ReactDOM.createRoot = () => ({
  render: (el) => { renderedElement = el; renderCount++; },
});

const stubDoc = { getElementById: () => ({ nodeType: 1, id: "root" }) };

try {
  const fn = new Function("React", "ReactDOM", "document", "window", compiled);
  fn(React, ReactDOM, stubDoc, { React, ReactDOM });
} catch (err) {
  console.error("FAIL  Runtime error while executing modules:");
  console.error(err.stack || err.message);
  process.exit(1);
}

if (!renderedElement || renderCount !== 1) {
  console.error(`FAIL  Expected exactly 1 render call, got ${renderCount}`);
  process.exit(1);
}

const type = renderedElement && renderedElement.type;
const name = typeof type === "function" ? (type.name || "(anonymous)") : String(type);
console.log(`PASS  ReactDOM.createRoot().render() called once with <${name}/>`);
console.log(`OK    index.components.html verified`);
