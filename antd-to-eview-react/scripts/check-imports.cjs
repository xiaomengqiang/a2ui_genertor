#!/usr/bin/env node
/**
 * check-imports.cjs — 迁移后导入路径硬约束检查（strict，发现违规直接 FAIL）
 *
 * 对应 SKILL.md「eview-react 硬约束」① 导入路径。导入路径是迁移的核心、
 * 且 100% 静态可判（无歧义），故本脚本全量硬 FAIL，不做 advisory。
 *
 * 检查项：
 *   1. ANTD_RESIDUAL   残留 `from 'antd'`（未替换为 eview-react）
 *   2. ANTD_SUBPATH    残留 `from 'antd/...'` 子路径
 *   3. ICONS_RESIDUAL  残留 `from '@ant-design/icons'`（应由 match-icons.cjs 转 @hui/icon-plus）
 *   4. RADIOGROUP_WRONG_IMPORT  `import { RadioGroup } from '@nce/eview-react/Radio'`
 *      （RadioGroup 必须默认导入：import RadioGroup from '@nce/eview-react/RadioGroup'，
 *       @nce/eview-react/Radio 只导出 Radio 本身，不导出 RadioGroup）
 *   5. SHELL_WRONG_PATH 包壳组件从 @nce/eview-react/<X> 导入（须从 @/shared/<X> 导入）
 *   6. TOGGLE_DISABLE_PROP  `<Toggle>` 上用了 disable（应为 disabled）—— Toggle 用 disabled 正确拼写，
 *      disable 只属于 SelectCard/FileUpload
 *   7. TAB_DATA_PROP  `<Tab>` 上挂了 data（禁止）—— Tab 是 children 驱动（TabItem），
 *      data 是 Select/SelectCard/RadioGroup/Steps 等的 prop
 *
 * 用法：
 *   node check-imports.cjs <目标工程根>
 *
 * 纯静态正则，不执行代码。退出码：0=通过，1=发现违规，2=用法错误。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const EXTS = new Set(['.js', '.jsx', '.ts', '.tsx']);

// 包壳组件清单（SKILL.md 硬约束①）：这些必须从 @/shared/<X> 导入，scaffold 预置转发
const SHELL_COMPONENTS = [
  'Tag', 'Select', 'TextField', 'InputSelect', 'MultipleSelect', 'SearchInput',
  'TextArea', 'DatePicker', 'Spinner', 'Cascader', 'TreeSelector',
  'IPInput', 'TimePicker', 'Crumbs', 'Accordion',
];

// 扫描整个工程根（含根目录配置文件 + src/ 子树）。跳过 node_modules / .开头目录 /
// dist / build 等产物目录；并精确跳过 src/shared（包壳组件的实现文件，scaffold 预置，
// 内部 import X from '@nce/eview-react/X' 转发是正确的）——只有业务代码（views/ 等）
// 从 @nce/eview-react/<包壳> 导入才算违规，故按相对路径 'src/shared' 跳过该子树。
function walk(dir, root, out) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    return out;
  }
  for (const ent of entries) {
    if (ent.name === 'node_modules' || ent.name.startsWith('.')) continue;
    if (ent.name === 'dist' || ent.name === 'build') continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      const rel = path.relative(root, full).replace(/\\/g, '/');
      if (rel === 'src/shared') continue;
      walk(full, root, out);
    } else if (EXTS.has(path.extname(ent.name))) out.push(full);
  }
  return out;
}

// 从 `<Tag` 的 `<` 开始，跳过 {...} 内的 > 和字符串内的 >，找标签结束的 >（含 />）
// 避免开标签（<Tab>...</Tab>）用 indexOf('/>') 跨界到下一个自闭合标签
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
  if (!fs.existsSync(root)) {
    console.error(`[check-imports] 找不到 ${root}，用法: node check-imports.cjs <目标工程根>`);
    process.exit(2);
  }

  // 扫描整个工程根（含根目录配置文件 + src/），跳过 src/shared（包壳实现文件，内部转发 @nce/eview-react/<X> 是正确的）
  const files = walk(root, root, []);
  const violations = []; // { file, line, code, detail }

  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const rel = path.relative(root, file);
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const ln = i + 1;
      const line = lines[i];

      // 1. 残留 antd（整体导入）
      if (/\bfrom\s+['"]antd['"]/.test(line)) {
        violations.push({ file: rel, line: ln, code: 'ANTD_RESIDUAL', detail: line.trim() });
      }
      // 2. 残留 antd/ 子路径
      if (/\bfrom\s+['"]antd\//.test(line)) {
        violations.push({ file: rel, line: ln, code: 'ANTD_SUBPATH', detail: line.trim() });
      }
      // 3. 残留 @ant-design/icons
      if (/\bfrom\s+['"]@ant-design\/icons['"]/.test(line)) {
        violations.push({ file: rel, line: ln, code: 'ICONS_RESIDUAL', detail: line.trim() });
      }
      // 4. RadioGroup 从 Radio 包具名导入（禁止）
      if (/\bimport\s*\{[^}]*\bRadioGroup\b[^}]*\}\s*from\s+['"]@nce\/eview-react\/Radio['"]/.test(line)) {
        violations.push({
          file: rel, line: ln, code: 'RADIOGROUP_WRONG_IMPORT',
          detail: 'RadioGroup 须默认导入: import RadioGroup from "@nce/eview-react/RadioGroup"（Radio 包不导出 RadioGroup）',
        });
      }
      // 5. 包壳组件从 @nce/eview-react/<X> 错误导入
      for (const c of SHELL_COMPONENTS) {
        const re = new RegExp(`\\bfrom\\s+['"]@nce/eview-react/${c}['"]`);
        if (re.test(line)) {
          violations.push({
            file: rel, line: ln, code: 'SHELL_WRONG_PATH',
            detail: `${c} 是包壳组件，须从 "@/shared/${c}" 导入，不是 "@nce/eview-react/${c}"`,
          });
        }
      }
    }

    // 6. Toggle 上的 disable prop（应为 disabled）—— eview Toggle 用 disabled 正确拼写，
    //    disable 只属于 SelectCard/FileUpload，Toggle 上写 disable 是错误。
    //    文件级扫描 <Toggle 标签范围（到 />），避免跨行 props 漏检。
    const toggleRe = /<Toggle\b/g;
    let tm;
    while ((tm = toggleRe.exec(text)) !== null) {
      const start = tm.index;
      const tagEnd = findTagEnd(text, start);
      const tagWindow = tagEnd > 0 ? text.slice(start, tagEnd) : text.slice(start, start + 300);
      // disable prop：disable 后不跟字母/数字/下划线（排除 disabled / disableToolTip 等）
      if (/\bdisable\b(?![\w])/.test(tagWindow)) {
        const lineNum = text.slice(0, start).split('\n').length;
        violations.push({
          file: rel, line: lineNum, code: 'TOGGLE_DISABLE_PROP',
          detail: 'Toggle 用 disabled（正确拼写），不是 disable。disable 只属于 SelectCard/FileUpload',
        });
      }
    }

    // 7. Tab 上的 data prop（禁止）—— Tab 是 children 驱动（TabItem），不接收数组；
    //    data 是 Select/SelectCard/RadioGroup/Steps 等的 prop，给 Tab 挂 data 是错误。
    //    <Tab\b 不匹配 <TabItem（Tab 后跟 I 无词边界），不会误报 TabItem。
    const tabRe = /<Tab\b/g;
    let tam;
    while ((tam = tabRe.exec(text)) !== null) {
      const start = tam.index;
      const tagEnd = findTagEnd(text, start);
      const tagWindow = tagEnd > 0 ? text.slice(start, tagEnd) : text.slice(start, start + 300);
      // data prop：data 后不跟字母（排除 dataIndex/dataset 等），后跟 =
      if (/\bdata\b\s*=/.test(tagWindow)) {
        const lineNum = text.slice(0, start).split('\n').length;
        violations.push({
          file: rel, line: lineNum, code: 'TAB_DATA_PROP',
          detail: 'Tab 是 children 驱动（<TabItem>），禁止 data 属性。data 是 Select/SelectCard/Steps 等的 prop',
        });
      }
    }
  }

  // ---- 报告 ----
  console.log('[check-imports] 导入路径硬约束检查报告');
  console.log(`  扫描范围: ${root}（${files.length} 个文件，已跳过 node_modules/dist/build/.开 + src/shared）`);

  if (violations.length === 0) {
    console.log('\n结论: PASS — 未发现导入路径违规。');
    process.exit(0);
  }

  const byCode = {};
  for (const v of violations) (byCode[v.code] = byCode[v.code] || []).push(v);

  const codeDesc = {
    ANTD_RESIDUAL: '残留 antd（未替换为 eview-react）',
    ANTD_SUBPATH: '残留 antd/ 子路径',
    ICONS_RESIDUAL: '残留 @ant-design/icons（应由 match-icons.cjs 转 @hui/icon-plus）',
    RADIOGROUP_WRONG_IMPORT: 'RadioGroup 错误地从 Radio 包具名导入',
    SHELL_WRONG_PATH: '包壳组件未从 @/shared 导入',
    TOGGLE_DISABLE_PROP: 'Toggle 用 disable（应为 disabled）',
    TAB_DATA_PROP: 'Tab 挂 data（应 TabItem children 驱动）',
  };

  console.log(`\n发现 ${violations.length} 处违规：\n`);
  for (const code of Object.keys(byCode)) {
    console.log(`【${code}】${codeDesc[code] || code}（${byCode[code].length} 处）`);
    for (const v of byCode[code]) {
      const detail = v.detail.length > 100 ? v.detail.slice(0, 100) + '…' : v.detail;
      console.log(`  - ${v.file}:${v.line}  ${detail}`);
    }
    console.log('');
  }
  console.log('结论: FAIL — 导入路径硬约束违规，必须修复后重跑。');
  console.log('  修复指引见 SKILL.md「eview-react 硬约束」① 导入路径。');
  process.exit(1);
}

main();
