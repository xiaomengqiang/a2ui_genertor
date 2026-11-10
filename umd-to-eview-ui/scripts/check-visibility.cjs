#!/usr/bin/env node
/**
 * check-visibility.cjs — 显隐 prop 张冠李戴检查（硬 FAIL）
 *
 * 对应 SKILL.md「eview-ui 硬约束」4 + components/INDEX.md 文末「显隐 prop 速查」。
 * eview-ui 各组件显隐 prop 名不统一，是最高频迁移错误：
 *   isOpen:   Dialog / DialogPro / MessageDialog / MessageDialogPro / Loader
 *   visible:  Drawer / Tooltip
 *   display:  Popup / TipBox / DivMessage
 *   iconDisplay: HelpTip；isShow: Shade；PopConfirm/PageMessage/FormMessage 无显隐 prop
 *
 * 检查项（均硬 FAIL）：
 *   1. VISIBILITY_WRONG_PROP   isOpen 系组件用了 visible=/display=/isShow=（或反向）
 *   2. ANTD_OPEN_RESIDUE       antd open= 残留（Dialog/DialogPro/MessageDialog 系应为 isOpen=；
 *                              Drawer antd v5 open= 应为 visible=）
 *   3. SPIN_SPINNING_RESIDUE   Loader 上 antd Spin 的 spinning= 残留（应为 isOpen=）
 *
 * 用法：
 *   node check-visibility.cjs <目标工程根>
 *
 * 纯静态正则（tagWindow 提取跨行标签），不执行代码。退出码：0=通过，1=FAIL，2=用法错误。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const EXTS = new Set(['.js', '.jsx', '.ts', '.tsx']);

// 组件 → 正确显隐 prop（null = 无显隐 prop，出现任何显隐 prop 都报）
const VISIBILITY_MAP = {
  Dialog: 'isOpen',
  DialogPro: 'isOpen',
  MessageDialog: 'isOpen',
  MessageDialogPro: 'isOpen',
  Loader: 'isOpen',
  Drawer: 'visible',
  Tooltip: 'visible',
  Dropdown: 'visible',
  Popup: 'display',
  TipBox: 'display',
  DivMessage: 'display',
  HelpTip: 'iconDisplay',
  Shade: 'isShow',
  LinkField: 'display',
};

// antd open= 残留检查的组件（弹层系）
const OPEN_RESIDUE_COMPONENTS = ['Dialog', 'DialogPro', 'MessageDialog', 'MessageDialogPro', 'Drawer'];

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
  const rootIdx = args.findIndex((a) => !a.startsWith('--'));
  const root = rootIdx >= 0 ? path.resolve(args[rootIdx]) : process.cwd();
  const srcDir = path.join(root, 'src');
  if (!fs.existsSync(srcDir)) {
    console.error(`[check-visibility] 找不到 ${srcDir}，用法: node check-visibility.cjs <目标工程根>`);
    process.exit(2);
  }

  const files = walk(srcDir, []);
  const fails = [];
  const names = Object.keys(VISIBILITY_MAP);

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    let hasAny = false;
    for (const n of names) { if (new RegExp(`<${n}\\b`).test(raw)) { hasAny = true; break; } }
    if (!hasAny) continue;

    const text = stripComments(raw);
    const rel = path.relative(root, file);

    for (const n of names) {
      const re = new RegExp(`<${n}\\b`, 'g');
      let m;
      while ((m = re.exec(text)) !== null) {
        const start = m.index;
        const tagEnd = findTagEnd(text, start);
        const tagWindow = tagEnd > 0 ? text.slice(start, tagEnd) : text.slice(start, start + 400);
        const line = text.slice(0, start).split('\n').length;

        const correct = VISIBILITY_MAP[n];
        const wrongProps = ['isOpen', 'visible', 'display', 'isShow', 'iconDisplay'].filter(p => p !== correct);

        for (const wp of wrongProps) {
          const wpRe = new RegExp(`\\b${wp}\\b\\s*=`);
          if (wpRe.test(tagWindow)) {
            fails.push({
              file: rel, line, code: 'VISIBILITY_WRONG_PROP',
              detail: `<${n}> 的显隐 prop 应是 ${correct}=（不是 ${wp}=）——eview-ui 显隐 prop 全家速查：isOpen(Dialog系/Loader)、visible(Drawer/Tooltip)、display(Popup/TipBox/DivMessage)、iconDisplay(HelpTip)、isShow(Shade)`,
            });
          }
        }

        // antd open= 残留
        if (OPEN_RESIDUE_COMPONENTS.includes(n)) {
          if (/\bopen\b\s*=/.test(tagWindow)) {
            fails.push({
              file: rel, line, code: 'ANTD_OPEN_RESIDUE',
              detail: `<${n}> 残留 antd open= —— 应为 ${VISIBILITY_MAP[n]}=（antd Modal open→isOpen；Drawer antd v5 open→visible）`,
            });
          }
        }

        // Loader 的 spinning= 残留（antd Spin）
        if (n === 'Loader') {
          if (/\bspinning\b\s*=/.test(tagWindow)) {
            fails.push({
              file: rel, line, code: 'SPIN_SPINNING_RESIDUE',
              detail: '<Loader> 残留 antd Spin 的 spinning= —— 应为 isOpen=',
            });
          }
        }
      }
    }
  }

  // ---- 报告 ----
  console.log('[check-visibility] 显隐 prop 张冠李戴检查报告');
  console.log(`  扫描范围: ${srcDir}（${files.length} 个文件，监控组件：${names.join('/')}）`);

  if (fails.length === 0) {
    console.log('\n结论: PASS — 显隐 prop 无张冠李戴、无 antd open/spinning 残留。');
    process.exit(0);
  }

  // 去重（同一标签同一行可能重复报）
  const seen = new Set();
  const uniq = fails.filter(f => {
    const k = `${f.file}:${f.line}:${f.detail}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  console.log(`\n【硬 FAIL】${uniq.length} 处：`);
  for (const v of uniq) {
    console.log(`  - ${v.file}:${v.line}  [${v.code}] ${v.detail}`);
  }
  console.log('\n  修复指引见 components/INDEX.md 文末「显隐 prop 速查」+ SKILL.md 硬约束 4。');
  process.exit(1);
}

main();
