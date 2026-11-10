#!/usr/bin/env node
/**
 * check-menu.cjs — Menu/Accordion 迁移坑检查（advisory）
 *
 * 对应 components/Accordion.md 与 components/Menu.md 的「antd 迁移注意事项」。
 * antd Menu 的两种迁移去向各有静默失败坑：
 *   A. → Accordion（主映射，items 数组）：data 项字段 label/key 残留（应 title/value）、
 *      selectedKeys 数组残留（应 selectedValue 单值）
 *   B. → eview-ui Menu（children 驱动，同构场景）：selectable 默认 false——不传则点击无选中态；
 *      items= prop 残留（eview-ui Menu 无 items，antd v5 数组形态未转）
 *
 * 检查项（均 advisory，须在 result 的 advisoryReviews.menu 逐条回应）：
 *   1. MENU_SELECTABLE_MISSING   <Menu> 无 selectable → 默认 false 点击无选中态（antd 默认可选中）
 *   2. MENU_ITEMS_PROP           <Menu> 上 items=（eview-ui Menu 无 items prop，须转 children JSX）
 *   3. ACCORDION_DATA_FIELDS     Accordion data 项 label:/key: 残留（应 title/value；AST 扫描动态形态，
 *                                无 @babel/parser 时降级跳过并注明）
 *   4. ACCORDION_SELECTEDKEYS    <Accordion> 上 selectedKeys=（应 selectedValue 单 string）
 *
 * 用法：
 *   node check-menu.cjs <目标工程根>          # advisory，退出码 0
 *   node check-menu.cjs <目标工程根> --strict # 有 advisory exit 1
 *
 * 退出码：0=通过/仅 advisory，1=--strict 下有 advisory，2=用法错误。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const EXTS = new Set(['.js', '.jsx', '.ts', '.tsx']);

function walk(dir, out) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return out; }
  for (const ent of entries) {
    if (ent.name === 'node_modules' || ent.name.startsWith('.')) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, out);
    else if (EXTS.has(path.extname(ent.name))) out.push(full);
  }
  return out;
}

function stripComments(text) {
  let out = text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
  out = out.replace(/(^|[^:'"])\/\/[^\n]*/g, (m, p1) => p1);
  return out;
}

function findTagEnd(text, start) {
  let i = start + 1;
  let depth = 0;
  let inStr = null;
  while (i < text.length) {
    const ch = text[i];
    if (inStr) {
      if (ch === '\\') { i += 2; continue; }
      if (ch === inStr) inStr = null;
    } else {
      if (ch === '"' || ch === "'" || ch === '`') inStr = ch;
      else if (ch === '{') depth++;
      else if (ch === '}') depth--;
      else if (depth === 0 && ch === '>') return i;
    }
    i++;
  }
  return -1;
}

function main() {
  const args = process.argv.slice(2);
  const strict = args.includes('--strict');
  const rootIdx = args.findIndex((a) => !a.startsWith('--'));
  const root = rootIdx >= 0 ? path.resolve(args[rootIdx]) : process.cwd();
  const srcDir = path.join(root, 'src');
  if (!fs.existsSync(srcDir)) {
    console.error(`[check-menu] 找不到 ${srcDir}，用法: node check-menu.cjs <目标工程根>`);
    process.exit(2);
  }

  let H = null;
  let parser = null;
  try {
    H = require('./lib/ast-helpers.cjs');
    parser = H.loadParser(root);
  } catch (e) { /* 降级 */ }

  const files = walk(srcDir, []);
  const advisories = [];
  let astSkipped = 0;

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    if (!/<Menu\b/.test(raw) && !/<Accordion\b/.test(raw)) continue;
    const text = stripComments(raw);
    const rel = path.relative(root, file);

    // 1/2. <Menu> 标签级
    const menuRe = /<Menu\b/g;
    let m;
    while ((m = menuRe.exec(text)) !== null) {
      const start = m.index;
      const tagEnd = findTagEnd(text, start);
      const tagWindow = tagEnd > 0 ? text.slice(start, tagEnd) : text.slice(start, start + 400);
      const line = text.slice(0, start).split('\n').length;

      if (!/\bselectable\b/.test(tagWindow)) {
        advisories.push({
          file: rel, line, code: 'MENU_SELECTABLE_MISSING',
          detail: '<Menu> 未传 selectable——eview-ui Menu 默认 selectable=false（antd 默认可选中），点击菜单项将无选中态；需选中须显式 selectable={true}',
        });
      }
      if (/\bitems\b\s*=/.test(tagWindow)) {
        advisories.push({
          file: rel, line, code: 'MENU_ITEMS_PROP',
          detail: '<Menu> 上挂 items=——eview-ui Menu 无 items prop（children 驱动：Menu.Item/Menu.SubMenu/Menu.Divider），antd v5 数组形态须转 JSX；或改用 Accordion data 驱动（主映射）',
        });
      }
    }

    // 4. <Accordion> selectedKeys
    const acRe = /<Accordion\b/g;
    while ((m = acRe.exec(text)) !== null) {
      const start = m.index;
      const tagEnd = findTagEnd(text, start);
      const tagWindow = tagEnd > 0 ? text.slice(start, tagEnd) : text.slice(start, start + 400);
      const line = text.slice(0, start).split('\n').length;
      if (/\bselectedKeys\b\s*=/.test(tagWindow)) {
        advisories.push({
          file: rel, line, code: 'ACCORDION_SELECTEDKEYS',
          detail: '<Accordion> 用 selectedKeys=（antd Menu 数组形态）——应为 selectedValue（单 string）',
        });
      }
    }

    // 3. Accordion data 项 label:/key:（AST）
    if (/<Accordion\b/.test(raw) && parser && H) {
      const parsed = H.parse(parser, raw);
      if (!parsed.error) {
        const elements = H.findJsxElements(parsed.ast, ['Accordion']);
        for (const { el } of elements) {
          const expr = H.getAttrExpr(el, 'data');
          if (!expr) continue;
          const objs = H.collectOptionsObjects(parsed.ast, expr);
          for (const obj of objs) {
            for (const badKey of ['label', 'key']) {
              const hit = H.findProperty(obj, badKey);
              if (hit) {
                advisories.push({
                  file: rel, line: hit.line, code: 'ACCORDION_DATA_FIELDS',
                  detail: `Accordion data 项残留 "${badKey}:"（antd Menu items 字段）——应为 title（显示文字）/ value（选中值）；嵌套 children 里的子项也要逐层映射`,
                });
              }
            }
          }
        }
      }
    } else if (/<Accordion\b/.test(raw) && !parser) {
      astSkipped++;
    }
  }

  // ---- 报告 ----
  console.log('[check-menu] Menu/Accordion 迁移坑检查报告');
  console.log(`  扫描范围: ${srcDir}（${files.length} 个文件${parser ? '' : '，⚠ 无 @babel/parser，Accordion data 项 AST 扫描降级跳过' + (astSkipped ? `（${astSkipped} 个含 Accordion 的文件）` : '')}）`);

  if (advisories.length === 0) {
    console.log('\n结论: PASS — Menu/Accordion 无待核项。');
    process.exit(0);
  }

  console.log(`\n【advisory — 须逐条回应（result 的 advisoryReviews.menu）】${advisories.length} 处：`);
  for (const v of advisories) {
    console.log(`  - ${v.file}:${v.line}  [${v.code}] ${v.detail}`);
  }
  console.log('\n  修复指引见 components/Accordion.md 与 components/Menu.md 的「antd 迁移注意事项」 + migration-workflow.md §2.3。');

  if (strict) process.exit(1);
  process.exit(0);
}

main();
