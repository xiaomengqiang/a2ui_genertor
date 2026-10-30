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
  'IPInput', 'TimePicker', 'Crumbs',
];

// skipDirs：遇到这些目录名不递归进去。src/shared/ 是包壳组件的**实现文件**所在
// （scaffold 预置，内部 import X from '@nce/eview-react/X' 转发是正确的），
// 只有业务代码（views/ 等）从 @nce/eview-react/<包壳> 导入才算违规，故跳过 shared 子树。
function walk(dir, out, skipDirs) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    return out;
  }
  for (const ent of entries) {
    if (ent.name === 'node_modules' || ent.name.startsWith('.')) continue;
    if (skipDirs && skipDirs.has(ent.name) && ent.isDirectory()) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, out, skipDirs);
    else if (EXTS.has(path.extname(ent.name))) out.push(full);
  }
  return out;
}

function main() {
  const args = process.argv.slice(2);
  const rootIdx = args.findIndex((a) => !a.startsWith('--'));
  const root = rootIdx >= 0 ? path.resolve(args[rootIdx]) : process.cwd();
  const srcDir = path.join(root, 'src');
  if (!fs.existsSync(srcDir)) {
    console.error(`[check-imports] 找不到 ${srcDir}，用法: node check-imports.cjs <目标工程根>`);
    process.exit(2);
  }

  // 跳过 src/shared/（包壳实现文件，内部转发 @nce/eview-react/<X> 是正确的）
  const files = walk(srcDir, [], new Set(['shared']));
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
  }

  // ---- 报告 ----
  console.log('[check-imports] 导入路径硬约束检查报告');
  console.log(`  扫描范围: ${srcDir}（${files.length} 个文件）`);

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
