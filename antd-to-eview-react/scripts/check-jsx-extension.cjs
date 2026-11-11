#!/usr/bin/env node
/**
 * check-jsx-extension.cjs — .js/.ts 文件承载 JSX 检查 + 自动改扩展名（硬 FAIL + --fix）
 *
 * Vite/esbuild 默认不对 .js/.ts 启用 JSX loader——.js/.ts 文件含 JSX 语法时项目启动报错。
 * 任何步骤（icon 改写 / 步骤 2 组件替换 / LLM 手改）向 .js/.ts 注入 JSX 都必须同步把文件
 * 改扩展名为 .jsx/.tsx 并修引用方显式扩展名 import。match-icons.cjs 的 renameJsxFiles 只覆盖
 * icon 步骤自己的 <IconPlusIc 改写、且只扫 src/；本脚本是项目级、来源无关的兜底网——
 * icon 步骤漏的、其它步骤注入的、mock 数据在 src 外的，统一拦。
 *
 * 检测（AST，@babel/parser，复用 lib/ast-helpers.cjs）：扫工程根下所有 .js/.ts（排除
 * node_modules/dist/build/.git 等产物目录），解析（jsx 插件），若 AST 含 JSXElement /
 * JSXFragment 节点 → 该文件承载 JSX → 违规。
 * AST 节点类型判定零误报：
 *   - a < b 比较运算 → BinaryExpression（非 JSX）
 *   - 字符串 "<Foo/>" → StringLiteral（非 JSX）
 *   - TS 类型断言 <Foo>x → TSTypeAssertion（非 JSXElement，故 .ts 类型断言不误报）
 *   - 仅 <Foo/> / <Foo>...</Foo> / <>...</> 真 JSX 触发（产出 JSXElement / JSXFragment）
 *
 * 模式：
 *   node check-jsx-extension.cjs <目标工程根>           # 检查：列出违规 .js/.ts，硬 FAIL（exit 1）
 *   node check-jsx-extension.cjs <目标工程根> --fix     # 自动修复：违规文件 .js→.jsx / .ts→.tsx
 *                                                        # + 工程级修引用方显式 .js/.ts 扩展名 import
 *                                                        # + 复核无残留
 *
 * 退出码：0=通过（无违规 / --fix 后全部修复），1=发现违规（检查模式）/ --fix 后仍有残留，2=用法错误/无解析器。
 */
'use strict';

const fs = require('fs');
const path = require('path');
const H = require('./lib/ast-helpers.cjs');

const SCAN_EXTS = new Set(['.js', '.ts']);          // 检测范围：可能误承载 JSX 的扩展名
const REF_EXTS = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs']); // 引用修法扫描范围

// 递归收集 dir 下指定扩展名文件，跳过 node_modules/dist/build/.git + 点开头目录
function walk(dir, extSet, out) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return out; }
  for (const ent of entries) {
    if (ent.name === 'node_modules' || ent.name === 'dist' || ent.name === 'build'
        || ent.name === '.git' || ent.name.startsWith('.')) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, extSet, out);
    else if (extSet.has(path.extname(ent.name))) out.push(full);
  }
  return out;
}

// 文件 AST 中是否含 JSX 节点（JSXElement / JSXFragment）。返回首个命中行号数组（可能多命中）。
function findJsxNodes(ast) {
  const hits = [];
  H.walk(ast, (n) => {
    if (n.type === 'JSXElement' || n.type === 'JSXFragment') {
      const line = (n.loc && n.loc.start) ? n.loc.start.line : 0;
      hits.push(line);
    }
  });
  return hits;
}

// 扫工程根，返回违规 .js/.ts 文件清单（含首个 JSX 行号 + 命中数）+ 解析告警
function scanOffending(parser, root) {
  const files = walk(root, SCAN_EXTS, []);
  const offending = [];
  const parseWarnings = [];
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    // 快筛：无 '<' 字符直接跳过（JSX 必含 <，多数 .js 配置/工具脚本无 <）
    if (!text.includes('<')) continue;
    const parsed = H.parse(parser, text);
    if (parsed.error) {
      parseWarnings.push({ file: path.relative(root, file), msg: parsed.error.message });
      continue;
    }
    const lines = findJsxNodes(parsed.ast);
    if (lines.length) {
      offending.push({
        file,
        rel: path.relative(root, file),
        firstLine: lines[0],
        count: lines.length,
      });
    }
  }
  return { offending, parseWarnings, scanned: files.length };
}

// 工程级修引用：把引用了 renamed 旧路径且带显式 .js/.ts 扩展名的 import/require 说明符
// 改为新扩展名。无扩展名 import 不动（解析器仍能命中 .jsx/.tsx）。
function fixExplicitExtensionImports(renamed, root) {
  if (!renamed.size) return 0;
  const allFiles = walk(root, REF_EXTS, []);
  let fixed = 0;
  for (const f of allFiles) {
    if (!fs.existsSync(f)) continue;
    let text = fs.readFileSync(f, 'utf8');
    let changed = false;
    const rewrite = (spec) => {
      if (!/\.(js|ts)$/.test(spec)) return spec;
      const resolved = path.resolve(path.dirname(f), spec);
      if (renamed.has(resolved)) {
        const newExt = path.extname(renamed.get(resolved)); // '.jsx' / '.tsx'
        return spec.replace(/\.(js|ts)$/, newExt);
      }
      return spec;
    };
    // 静态 import ... from '...'
    text = text.replace(/(\bfrom\s*['"])([^'"]+)(['"])/g, (m, pre, spec, post) => {
      const ns = rewrite(spec);
      if (ns !== spec) { changed = true; return `${pre}${ns}${post}`; }
      return m;
    });
    // 动态 import('...')
    text = text.replace(/(\bimport\s*\(\s*['"])([^'"]+)(['"]\s*\))/g, (m, pre, spec, post) => {
      const ns = rewrite(spec);
      if (ns !== spec) { changed = true; return `${pre}${ns}${post}`; }
      return m;
    });
    // require('...')
    text = text.replace(/(\brequire\s*\(\s*['"])([^'"]+)(['"]\s*\))/g, (m, pre, spec, post) => {
      const ns = rewrite(spec);
      if (ns !== spec) { changed = true; return `${pre}${ns}${post}`; }
      return m;
    });
    if (changed) { fs.writeFileSync(f, text, 'utf8'); fixed++; }
  }
  return fixed;
}

function main() {
  const args = process.argv.slice(2);
  const fix = args.indexOf('--fix') >= 0;
  const rootIdx = args.findIndex((a) => !a.startsWith('--'));
  const root = rootIdx >= 0 ? path.resolve(args[rootIdx]) : process.cwd();
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
    console.error('[check-jsx-extension] 用法: node check-jsx-extension.cjs <目标工程根> [--fix]');
    console.error('[check-jsx-extension] 示例: node check-jsx-extension.cjs ./my-app --fix');
    process.exit(2);
  }

  const parser = H.loadParser(root);
  if (!parser) {
    console.error('[check-jsx-extension] 未找到 @babel/parser。目标工程跑 npm install 后重试');
    console.error('  （@vitejs/plugin-react 已含其为传递依赖）');
    process.exit(2);
  }

  const { offending, parseWarnings, scanned } = scanOffending(parser, root);
  console.log('[check-jsx-extension] .js/.ts 承载 JSX 检查报告');
  console.log(`  扫描范围: ${root}（${scanned} 个 .js/.ts 文件）`);

  if (parseWarnings.length) {
    console.log(`\n【AST 解析告警 — ${parseWarnings.length} 个文件无法解析，请人工复核是否含 JSX】`);
    for (const w of parseWarnings) console.log(`  - ${w.file}: ${w.msg}`);
  }

  if (offending.length === 0) {
    console.log('\n结论: PASS — 无 .js/.ts 文件承载 JSX。');
    process.exit(0);
  }

  console.log(`\n【${fix ? '修复中' : '硬 FAIL'} — ${offending.length} 个 .js/.ts 文件承载 JSX（Vite 不对 .js/.ts 启用 JSX loader，项目启动报错）】`);
  for (const o of offending) {
    console.log(`  - ${o.rel}:${o.firstLine}  (${o.count} 处 JSX 节点)`);
  }

  if (!fix) {
    console.log('\n修复：node <skill目录>/scripts/check-jsx-extension.cjs <工程根> --fix');
    console.log('  （自动 .js→.jsx / .ts→.tsx + 工程级修引用方显式扩展名 import）；或手动改扩展名 + 修引用。');
    console.log('  规则见 SKILL.md 硬约束 #14 + migration-workflow.md §4.19。');
    console.log('\n结论: FAIL — .js/.ts 文件承载 JSX，必须改扩展名为 .jsx/.tsx 并修引用后重跑。');
    process.exit(1);
  }

  // --fix：重命名违规文件 .js→.jsx / .ts→.tsx
  const renamed = new Map(); // oldAbs -> newAbs
  const skipped = [];
  for (const o of offending) {
    const ext = path.extname(o.file);
    const newExt = ext === '.js' ? '.jsx' : '.tsx';
    const newPath = o.file.slice(0, o.file.length - ext.length) + newExt;
    if (fs.existsSync(newPath) && path.resolve(newPath) !== path.resolve(o.file)) {
      // 目标 .jsx/.tsx 已存在（同名不同扩展冲突）——不覆盖，交人工
      skipped.push({ rel: o.rel, reason: `目标 ${path.basename(newPath)} 已存在` });
      continue;
    }
    const text = fs.readFileSync(o.file, 'utf8');
    fs.writeFileSync(newPath, text, 'utf8');
    if (fs.existsSync(o.file)) fs.unlinkSync(o.file);
    renamed.set(o.file, newPath);
  }

  if (renamed.size) {
    const fixedRefs = fixExplicitExtensionImports(renamed, root);
    console.log(`\n[--fix] 重命名 ${renamed.size} 个文件（.js→.jsx / .ts→.tsx），修引用 ${fixedRefs} 处：`);
    for (const [old, nw] of renamed) {
      console.log(`  - ${path.relative(root, old)} → ${path.relative(root, nw)}`);
    }
  }
  if (skipped.length) {
    console.log(`\n[--fix] 跳过 ${skipped.length} 个（同名冲突，交人工）：`);
    for (const s of skipped) console.log(`  - ${s.rel}: ${s.reason}`);
  }

  // 复核：重命名后应无违规 .js/.ts 残留（.jsx/.tsx 不在扫描范围）
  const reoff = scanOffending(parser, root);
  if (reoff.offending.length) {
    console.log(`\n复核: 仍有 ${reoff.offending.length} 个违规 .js/.ts 文件（可能同名冲突跳过或新引入），交人工：`);
    for (const o of reoff.offending) console.log(`  - ${o.rel}:${o.firstLine}`);
    process.exit(1);
  }
  console.log('\n复核: PASS — 无 .js/.ts 文件承载 JSX 残留。');
  process.exit(0);
}

main();
