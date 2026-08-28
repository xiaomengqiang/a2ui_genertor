#!/usr/bin/env node
// init.mjs
// Copies the skill's preview template into a working scaffold:
//   - [Artifact Folder]/preview when provided via --artifact-folder
//   - otherwise ./preview under the current working directory
//
// What gets copied (default, clean scaffold):
//   assets/  (+ assets/library local UMD libs — fully offline)
//   demo.css                     (preset gallery skeleton)
//   demo.jsx                     (fresh starter, see STARTER_DEMO below)
//
// NOT copied by default: example components (SegmentedSteps) and
// the template's generated index.components.html. Add --with-examples to include example
// components + the full example demo.jsx.
//
// Idempotent: if {dest}/demo.jsx already exists, the scaffold is
// REUSED — nothing is overwritten (user components, added icons, built HTML all
// survive). This lets multiple sessions accumulate components in one folder.
//
// Usage:
//   node init.mjs [--artifact-folder "<abs path>"] [--with-examples]
//   short: -a  -e
//
// Output (agent-parseable):
//   RESULT: OK
//   PREVIEW_DIR: <absolute path>
//   INIT: created | reused
//   RESULT: FAIL | <reason>
//
// Exit code: 0 on success, 1 on failure.

import {
  existsSync,
  statSync,
  mkdirSync,
  cpSync,
  copyFileSync,
  writeFileSync,
  readdirSync,
} from "fs";
import { join, resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATE = join(__dirname, "preview");

function fail(reason) {
  console.log(`RESULT: FAIL | ${reason}`);
  process.exit(1);
}

// --- parse args (no external deps; mirrors package-a2ui.mjs style) ---
const args = process.argv.slice(2);
function getOpt(long, short) {
  const idx = args.findIndex((a) => a === long || a === short);
  if (idx === -1) return undefined;
  const val = args[idx + 1];
  if (val === undefined || val.startsWith("-")) fail(`Missing value for ${long}`);
  return val;
}
function hasFlag(long, short) {
  return args.includes(long) || args.includes(short);
}

const artifactFolder = getOpt("--artifact-folder", "-a");
const withExamples = hasFlag("--with-examples", "-e");

const dest = join(resolve(artifactFolder ? artifactFolder : process.cwd()), "preview");

// --- validate template completeness ---
for (const p of ["assets", "demo.css", "demo.jsx"]) {
  if (!existsSync(join(TEMPLATE, p))) fail(`preview template incomplete, missing: ${p}`);
}

if (existsSync(dest) && !statSync(dest).isDirectory()) {
  fail(`path exists and is not a directory: ${dest}`);
}

const STARTER_DEMO = `import "./demo.css";

export default function Demo() {
  return (
    <div className="demo-page">
      <header className="demo-header">
        <h1 className="demo-title">组件预览</h1>
        <p className="demo-subtitle">组件生成后将在此罗列其多种形态。</p>
      </header>
    </div>
  );
}
`;

try {
  if (existsSync(join(dest, "demo.jsx"))) {
    console.log("RESULT: OK");
    console.log(`PREVIEW_DIR: ${dest}`);
    console.log("INIT: reused (existing demo.jsx kept, nothing overwritten)");
    process.exit(0);
  }

  mkdirSync(dest, { recursive: true });
  mkdirSync(join(dest, "components"), { recursive: true });

  cpSync(join(TEMPLATE, "assets"), join(dest, "assets"), { recursive: true });
  copyFileSync(join(TEMPLATE, "demo.css"), join(dest, "demo.css"));
  writeFileSync(join(dest, "demo.jsx"), STARTER_DEMO, "utf8");

  if (withExamples) {
    for (const entry of readdirSync(join(TEMPLATE, "components"), { withFileTypes: true })) {
      if (entry.isDirectory()) {
        cpSync(join(TEMPLATE, "components", entry.name), join(dest, "components", entry.name), { recursive: true });
      }
    }
    copyFileSync(join(TEMPLATE, "demo.jsx"), join(dest, "demo.jsx"));
  }

  console.log("RESULT: OK");
  console.log(`PREVIEW_DIR: ${dest}`);
  console.log(withExamples ? "INIT: created (with example components)" : "INIT: created");
  console.log(`NEXT: write components into components/, add sections to ${dest}/demo.jsx, then run: node scripts/build.mjs --dir "${dest}" && node scripts/verify-build.mjs --dir "${dest}"`);
} catch (err) {
  fail(err.message);
}
