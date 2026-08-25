#!/usr/bin/env node
// validate-component.mjs
// Validates a generated React TSX component file for common issues.
// Usage: node validate-component.mjs <path>
// Works on Windows, macOS, and Linux — requires only Node.js.

import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const args = process.argv.slice(2);
const inputFile = args.find((a) => !a.startsWith("-"));

if (!inputFile) {
  console.error("Usage: node validate-component.mjs <path>");
  process.exit(1);
}

const filePath = resolve(inputFile);

if (!existsSync(filePath)) {
  console.error(`FATAL: File not found: ${filePath}`);
  process.exit(1);
}

const raw = readFileSync(filePath, "utf-8");
const errors = [];
const warnings = [];

// =============================================================
// PHASE 1: Basic Structure Checks
// =============================================================

// Check for React import
if (!/import\s+.*\bfrom\s+["']react["']/.test(raw) && !/from\s+["']react["']/.test(raw)) {
  const hasJsx = /<[A-Z]\w*/.test(raw);
  if (hasJsx) {
    errors.push("Missing React import (required for JSX with react-jsx)");
  }
}

// Check for default export
const defaultExportMatch = raw.match(/export\s+default\s+(?:function|const|class)\s+(\w+)/);
if (!defaultExportMatch) {
  // Also check for separate default export
  const separateExport = raw.match(/export\s+default\s+\w+/);
  if (!separateExport) {
    errors.push("Missing default export — the component MUST be a default export");
  }
} else {
  const componentName = defaultExportMatch[1];

  // Check PascalCase
  if (!/^[A-Z][a-zA-Z0-9]*$/.test(componentName)) {
    errors.push(`Component name "${componentName}" is not PascalCase`);
  }

  console.log(`Component: ${componentName}`);
}

// Check for TypeScript types
if (!/interface\s+\w+|type\s+\w+\s*=/.test(raw)) {
  warnings.push("No TypeScript interfaces or types found — consider adding type definitions");
}

// =============================================================
// PHASE 2: Import Validation
// =============================================================

// Check imports are from allowed packages only
const importRegex = /import\s+.*?\s+from\s+["']([^"']+)["']/g;
let importMatch;
const allowedPackages = ["react", "react-dom", "lucide-react", "recharts"];
const imports = [];

while ((importMatch = importRegex.exec(raw)) !== null) {
  const pkg = importMatch[1];
  imports.push(pkg);

  // Check if it's a relative path import (not allowed for external assets)
  if (pkg.startsWith(".") || pkg.startsWith("/")) {
    if (!pkg.endsWith(".tsx") && !pkg.endsWith(".ts")) {
      errors.push(`Relative import "${pkg}" — only .ts/.tsx relative imports allowed`);
    }
  } else if (!allowedPackages.includes(pkg)) {
    errors.push(`External import "${pkg}" — only ${allowedPackages.join(", ")} are allowed`);
  }
}

console.log(`Imports: ${imports.join(", ") || "none"}`);

// Check for unused imports (basic heuristic)
const lucideImportMatch = raw.match(/import\s+\{([^}]+)\}\s+from\s+["']lucide-react["']/);
if (lucideImportMatch) {
  const icons = lucideImportMatch[1]
    .split(",")
    .map((s) => s.trim().split(/\s+as\s+/)[0])
    .filter(Boolean);
  for (const icon of icons) {
    // Check if the icon name appears elsewhere in the code (as JSX tag or reference)
    const usageRegex = new RegExp(`\\b${icon}\\b`, "g");
    const matches = raw.match(usageRegex) || [];
    if (matches.length <= 1) {
      warnings.push(`Lucide icon "${icon}" may be unused (appears only in import)`);
    }
  }
}

// =============================================================
// PHASE 3: JSX Quality Checks
// =============================================================

// Check for inline style (discouraged)
const inlineStyleCount = (raw.match(/style\s*=\s*\{\{/g) || []).length;
if (inlineStyleCount > 0) {
  warnings.push(`Found ${inlineStyleCount} inline style(s) — prefer Tailwind className`);
}

// Check for console.log
if (/console\.(log|warn|error|debug|info)\s*\(/.test(raw)) {
  errors.push("Found console.log/debug statements — remove before output");
}

// Check for comments
const commentCount = (raw.match(/\/\*[\s\S]*?\*\//g) || []).length + (raw.match(/\/\/.*$/gm) || []).length;
if (commentCount > 3) {
  warnings.push(`Found ${commentCount} comments — minimize comments unless necessary`);
}

// Check for key prop in list rendering
const mapRegex = /\.map\(\s*\([^)]*\)\s*=>\s*[(<]/g;
let mapMatch;
let mapCount = 0;
while ((mapMatch = mapRegex.exec(raw)) !== null) {
  mapCount++;
}
if (mapCount > 0) {
  // Check that each map has a key prop nearby (rough heuristic)
  const keyCount = (raw.match(/\bkey\s*=\s*[{"]/g) || []).length;
  if (keyCount < mapCount) {
    warnings.push(`Found ${mapCount} .map() calls but only ${keyCount} key props — ensure all list items have keys`);
  }
}

// Check for any type
const anyCount = (raw.match(/:\s*any\b/g) || []).length;
if (anyCount > 0) {
  warnings.push(`Found ${anyCount} usage(s) of "any" type — use specific types instead`);
}

// =============================================================
// PHASE 4: React Best Practices
// =============================================================

// Check for useState without import
if (raw.includes("useState") && !raw.includes("from \"react\"") && !raw.includes("from 'react'")) {
  errors.push("useState used without importing from react");
}

// Check for proper event handler patterns
const onClickArrowCount = (raw.match(/onClick\s*=\s*\(\)\s*=>/g) || []).length;
const onClickDirectCount = (raw.match(/onClick\s*=\s*\{/g) || []).length;
if (onClickDirectCount > onClickArrowCount && onClickArrowCount === 0) {
  // All inline, might be fine if they reference handler functions
}

// Check for img without alt
const imgWithoutAlt = raw.match(/<img[^>]+(?:src|className)[^>]*(?!alt)[^>]*\/?>/g);
if (imgWithoutAlt) {
  for (const imgTag of imgWithoutAlt) {
    if (!imgTag.includes("alt=")) {
      warnings.push("Found <img> without alt attribute — add alt for accessibility");
      break;
    }
  }
}

// =============================================================
// PHASE 5: Balance Check (brackets, tags)
// =============================================================

const openBraces = (raw.match(/\{/g) || []).length;
const closeBraces = (raw.match(/\}/g) || []).length;
if (openBraces !== closeBraces) {
  errors.push(`Brace mismatch: ${openBraces} opening vs ${closeBraces} closing`);
}

const openParens = (raw.match(/\(/g) || []).length;
const closeParens = (raw.match(/\)/g) || []).length;
if (openParens !== closeParens) {
  errors.push(`Parenthesis mismatch: ${openParens} opening vs ${closeParens} closing`);
}

// =============================================================
// Summary
// =============================================================
console.log("");
console.log("==========================================");
if (errors.length === 0) {
  console.log("RESULT: PASS");
  if (warnings.length > 0) {
    console.log(`Warnings (${warnings.length}):`);
    for (const w of warnings) console.log(`  ! ${w}`);
  }
  process.exit(0);
} else {
  console.log(`RESULT: FAIL (${errors.length} error(s))`);
  for (const e of errors) console.log(`  X ${e}`);
  if (warnings.length > 0) {
    console.log(`Warnings (${warnings.length}):`);
    for (const w of warnings) console.log(`  ! ${w}`);
  }
  process.exit(1);
}
