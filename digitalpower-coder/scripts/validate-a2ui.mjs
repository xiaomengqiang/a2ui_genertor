#!/usr/bin/env node
// validate-a2ui.mjs
// Validates AND auto-fixes A2UI JSON for syntax + bracket errors.
// Usage: node validate-a2ui.mjs <path> [--fix]
// Works on Windows, macOS, and Linux — requires only Node.js (which opencode depends on).

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// --- Parse args ---
const args = process.argv.slice(2);
const fixFlag = args.includes('--fix') || args.includes('-fix');
const inputFile = args.find(a => !a.startsWith('-'));

if (!inputFile) {
  console.error('Usage: node validate-a2ui.mjs <path> [--fix]');
  process.exit(1);
}

const filePath = resolve(inputFile);

if (!existsSync(filePath)) {
  console.error(`FATAL: File not found: ${filePath}`);
  process.exit(1);
}

let raw = readFileSync(filePath, 'utf-8');
const fixesApplied = [];

// =============================================================
// PHASE 1: Auto-fix missing array brackets on raw text
// =============================================================
function applyBracketFix(content) {
  const lines = content.split('\n');
  const result = [];
  const fixes = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Detect: "someKey": {  (single object start, potential missing array)
    if (/^"[^"]+"\s*:\s*\{\s*$/.test(trimmed)) {
      let hasSiblings = false;

      // Track brace depth from THIS object to find its closing brace
      let depth = 1;
      let closingIdx = -1;
      const scanLimit = Math.min(i + 200, lines.length);
      for (let j = i + 1; j < scanLimit; j++) {
        const next = lines[j].trim();
        const opens = (next.match(/\{/g) || []).length;
        const closes = (next.match(/\}/g) || []).length;
        depth += opens - closes;
        if (depth <= 0) {
          closingIdx = j;
          break;
        }
      }

      // Check what comes AFTER this object closes
      if (closingIdx >= 0 && closingIdx + 1 < lines.length) {
        const afterClose = lines[closingIdx].trim();
        // Pattern A: }, { on same line
        if (/^\}\s*,\s*\{/.test(afterClose)) {
          hasSiblings = true;
        }
        // Pattern B: }, on this line, { on next line
        else if (/^\}\s*,\s*$/.test(afterClose) && closingIdx + 1 < lines.length) {
          const nextLine = lines[closingIdx + 1].trim();
          if (/^\{/.test(nextLine)) {
            hasSiblings = true;
          }
        }
      }

      if (hasSiblings) {
        const keyMatch = line.match(/"([^"]+)"/);
        const keyName = keyMatch ? keyMatch[1] : 'unknown';

        const indent = line.substring(0, line.length - line.trimStart().length);
        const prefix = trimmed.replace(/\{\s*$/, '');
        result.push(`${indent}${prefix}[{`);
        fixes.push(`Line ${i + 1}: Added '[' to '${keyName}'`);

        // Track brace depth to find the TRUE end of the array
        depth = 1;
        let j = i + 1;
        while (j < lines.length) {
          const curLine = lines[j];
          const curTrim = curLine.trim();
          const opens = (curTrim.match(/\{/g) || []).length;
          const closes = (curTrim.match(/\}/g) || []).length;
          depth += opens - closes;

          if (depth <= 0) {
            if (/^\}\s*,/.test(curTrim)) {
              // More siblings
              result.push(curLine);
              // Look for next opening brace
              let foundNext = false;
              const nextLimit = Math.min(j + 5, lines.length);
              for (let k = j + 1; k < nextLimit; k++) {
                if (/^\{/.test(lines[k].trim())) {
                  depth = 0;
                  j = k;
                  foundNext = true;
                  break;
                }
              }
              if (!foundNext) {
                // End of array
                const last = result.length - 1;
                result[last] = result[last].replace(/\}/, '}]');
                fixes.push(`Line ${j + 1}: Added ']' for '${keyName}'`);
                j++;
                break;
              }
              continue;
            } else {
              // No comma - true end of array
              const fixedLine = curLine.replace(/\}/, '}]');
              result.push(fixedLine);
              fixes.push(`Line ${j + 1}: Added ']' for '${keyName}'`);
              j++;
              break;
            }
          } else {
            result.push(curLine);
          }
          j++;
        }
        i = j;
        continue;
      }
    }

    result.push(line);
    i++;
  }

  return { content: result.join('\n'), fixes };
}

if (fixFlag) {
  const fixResult = applyBracketFix(raw);
  if (fixResult.fixes.length > 0) {
    raw = fixResult.content;
    fixesApplied.push(...fixResult.fixes);
    writeFileSync(filePath, raw, 'utf-8');
    console.log(`AUTO-FIX: Applied ${fixResult.fixes.length} fix(es):`);
    for (const f of fixResult.fixes) console.log(`  + ${f}`);
    console.log('');
  }
}

// =============================================================
// PHASE 2: JSON Syntax Validation
// =============================================================
const errors = [];
const warnings = [];
let json = null;

try {
  json = JSON.parse(raw);
} catch (e) {
  console.error('==========================================');
  console.error('FATAL: INVALID JSON SYNTAX');
  if (fixesApplied.length === 0) {
    console.error('Tip: Run with --fix to auto-repair bracket errors.');
  } else {
    console.error('Auto-fix applied but JSON still invalid. Manual fix needed.');
  }
  console.error('==========================================');
  console.error(e.message);

  // Try to extract line number from error
  const lines = raw.split('\n');
  const lineMatch = e.message.match(/position (\d+)/);
  if (lineMatch) {
    let pos = parseInt(lineMatch[1]);
    let lineNum = 0;
    let charPos = 0;
    for (let k = 0; k < lines.length; k++) {
      if (charPos + lines[k].length + 1 > pos) {
        lineNum = k;
        break;
      }
      charPos += lines[k].length + 1;
    }
    const start = Math.max(0, lineNum - 3);
    const end = Math.min(lines.length - 1, lineNum + 3);
    console.error('');
    console.error('Context:');
    for (let k = start; k <= end; k++) {
      const marker = k === lineNum ? '>>>' : '   ';
      console.error(`${marker} ${k + 1}: ${lines[k]}`);
    }
  }
  process.exit(1);
}

console.log('JSON syntax: VALID');

// =============================================================
// PHASE 3: Structure Validation
// =============================================================
if (!json.state)    errors.push('Missing state key');
if (!json.rootId)   errors.push('Missing rootId key');
if (!json.elements) errors.push('Missing elements key');

const keys = Object.keys(json);
if (keys.length >= 3 && (keys[0] !== 'state' || keys[1] !== 'rootId' || keys[2] !== 'elements')) {
  warnings.push('Key order should be: state -> rootId -> elements');
}

// =============================================================
// PHASE 4: Bracket Deep Scan
// =============================================================
const scanLines = raw.split('\n');
for (let i = 0; i < scanLines.length; i++) {
  const line = scanLines[i].trim();
  if (/^"[^"]+"\s*:\s*\{\s*$/.test(line)) {
    const scanLimit = Math.min(i + 20, scanLines.length);
    for (let j = i + 1; j < scanLimit; j++) {
      const next = scanLines[j].trim();
      if (/^\}\s*,\s*\{/.test(next)) {
        const keyMatch = line.match(/^"([^"]+)"/);
        const keyName = keyMatch ? keyMatch[1] : '?';
        errors.push(`Bracket: '${keyName}' (line ${i + 1}) missing [] - run with --fix`);
        break;
      }
      if (/^\}/.test(next) && !/,/.test(next)) break;
    }
  }
}

// =============================================================
// PHASE 5: Element Validation
// =============================================================
if (json.elements) {
  const elemArray = json.elements;
  const allIds = new Set();
  const dupIds = [];

  for (const elem of elemArray) {
    if (elem.id) {
      if (allIds.has(elem.id)) dupIds.push(elem.id);
      allIds.add(elem.id);
    }
    if (elem.type !== undefined) {
      errors.push(`'${elem.id}' uses 'type' instead of 'component'`);
    }
    if (elem.props && elem.props.class !== undefined) {
      errors.push(`'${elem.id}' uses 'class' instead of 'className'`);
    }
    const validKeys = new Set(['id', 'component', 'props', 'children']);
    for (const p of Object.keys(elem)) {
      if (!validKeys.has(p)) {
        errors.push(`'${elem.id}' has invalid key: '${p}'`);
      }
    }
  }

  for (const elem of elemArray) {
    if (elem.children && Array.isArray(elem.children)) {
      for (const cid of elem.children) {
        if (typeof cid === 'string' && !allIds.has(cid)) {
          errors.push(`'${elem.id}' references missing child: '${cid}'`);
        }
      }
    }
  }

  if (dupIds.length > 0) errors.push(`Duplicate IDs: ${dupIds.join(', ')}`);
  console.log(`Elements: ${elemArray.length} checked`);
}

// =============================================================
// PHASE 6: Path Integrity
// =============================================================
if (json.state && json.elements) {
  let pathIssues = 0;
  const pathRegex = /"path"\s*:\s*"([^"]+)"/g;

  for (const elem of json.elements) {
    if (elem.props) {
      const propsJson = JSON.stringify(elem.props);
      let m;
      while ((m = pathRegex.exec(propsJson)) !== null) {
        const p = m[1];
        if (p.startsWith('/')) {
          const key = p.substring(1).split('/')[0];
          if (!(key in json.state)) {
            pathIssues++;
            if (pathIssues <= 5) {
              warnings.push(`Path '/${key}' in '${elem.id}' may not exist in state`);
            }
          }
        }
      }
    }
  }
  if (pathIssues > 5) {
    warnings.push(`... and ${pathIssues - 5} more path issues`);
  }
}

// =============================================================
// Summary
// =============================================================
console.log('');
console.log('==========================================');
if (errors.length === 0) {
  console.log('RESULT: PASS');
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
