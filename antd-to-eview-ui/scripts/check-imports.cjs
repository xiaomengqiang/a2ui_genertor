#!/usr/bin/env node
/**
 * check-imports.cjs — antd-to-eview-ui 导入路径硬约束检查（strict，发现违规直接 FAIL）
 *
 * 对应 SKILL.md「eview-ui 硬约束」① 导入路径 + ⑨ 图标保留 + ② 骨架换血完整性。
 * 导入路径是迁移的核心且 100% 静态可判，故全量硬 FAIL，不做 advisory。
 *
 * 检查项：
 *   1. ANTD_RESIDUAL        残留 `from 'antd'`（未替换为 eview-ui）
 *   2. ANTD_SUBPATH         残留 `from 'antd/...'` 子路径
 *   3. ICONS_RESIDUAL       残留 `from '@ant-design/icons'`
 *   4. EVIEWREACT_RESIDUAL  残留 `from '@nce/eview-react'`（骨架换血未完成）
 *   4b. EVUI_UNSCOPED_IMPORT 裸包名导入 `from 'eview-ui/...'`（真实包名是 @cloudsop/eview-ui，
 *                          裸形态来自官方组件文档示例抄写——文档里是简写包名，解析必失败）
 *   5. EVUI_ROOT_IMPORT     `import { X } from '@cloudsop/eview-ui'` 根包具名导入（应子路径默认导入：
 *                          `import X from '@cloudsop/eview-ui/X'`；唯一例外走子路径具名：Tab 的 TabItem、
 *                          GridLayout 的 Row/Col——根包具名不在白名单内）
 *   6. PANEL_NO_DESTRUCT    `import ... from '@cloudsop/eview-ui/Panel'` 默认导入后同文件无
 *                          `const { Panel` 解构（默认导出不是 Panel 组件，直接用必炸）
 *   7. SHIM_PATH_RESIDUE    Icon shim 旧路径（`assets/shared/icon`）残留（应 `@/shared/Icon`）
 *   8. EVUI_ICON_FORBIDDEN  图标策略违例：导入 eview-ui/Icon、eview-ui/SvgIcon（废弃）、
 *                          eview-ui/IconButton（废弃）——图标保留源 shim
 *   9. TAB_DATA_PROP        `<Tab>` 上挂了 data（禁止）—— eview-ui Tab 同样是 TabItem
 *                          children 驱动，data 是 Select 系/Wizards 等的 prop
 *   10. LEGACY_PRO_USED     旧版组件导入（有 Pro 版的组件一律用 Pro 版）：
 *                          eview-ui/Select→SelectPro、eview-ui/Table→TablePro、
 *                          eview-ui/Dialog→DialogPro、eview-ui/MessageDialog→MessageDialogPro、
 *                          eview-ui/Form→FormPro（精确路径匹配，*Pro/*Message 后缀不误伤）
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

// 扫描整个工程根（含根目录配置文件 + src/ 子树）。跳过 node_modules / .开头目录 /
// dist / build；并跳过 src/shared（保留区：Icon shim 实现文件，可能有合法的
// icon-plus 运行时依赖，不属于业务替换范围）。
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

  const files = walk(root, root, []);
  const violations = []; // { file, line, code, detail }

  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const rel = path.relative(root, file);
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const ln = i + 1;
      const line = lines[i];

      // 1-3. antd / @ant-design/icons 残留
      if (/\bfrom\s+['"]antd['"]/.test(line)) {
        violations.push({ file: rel, line: ln, code: 'ANTD_RESIDUAL', detail: line.trim() });
      }
      if (/\bfrom\s+['"]antd\//.test(line)) {
        violations.push({ file: rel, line: ln, code: 'ANTD_SUBPATH', detail: line.trim() });
      }
      if (/\bfrom\s+['"]@ant-design\/icons['"]/.test(line)) {
        violations.push({ file: rel, line: ln, code: 'ICONS_RESIDUAL', detail: line.trim() });
      }
      // 4. @nce/eview-react 残留（骨架换血未完成）
      if (/\bfrom\s+['"]@nce\/eview-react(\/[^'"]*)?['"]/.test(line)) {
        violations.push({
          file: rel, line: ln, code: 'EVIEWREACT_RESIDUAL',
          detail: line.trim() + ' —— 骨架换血未完成：@nce/eview-react 依赖应已删除（含 src/shared 转发包壳）',
        });
      }
      // 4b. 裸包名导入（from 'eview-ui/...'）——真实包名是 @cloudsop/eview-ui（scoped），
      //     裸形态来自官方组件文档示例的抄写（文档里写的是简写包名），解析必失败
      if (/\bfrom\s+['"]eview-ui(\/[^'"]*)?['"]/.test(line)) {
        violations.push({
          file: rel, line: ln, code: 'EVUI_UNSCOPED_IMPORT',
          detail: line.trim() + ' —— 真实包名是 @cloudsop/eview-ui（官方文档示例里的 eview-ui/X 是简写），统一 import X from "@cloudsop/eview-ui/X"',
        });
      }
      // 10. 旧版 Pro 组件导入（有 Pro 版的组件一律用 Pro 版）
      //     精确路径匹配：eview-ui/Select 不匹配 SelectPro/SelectCard/MultipleSelect（路径需在名字后结束）
      if (/\bfrom\s+['"](?:@cloudsop\/)?eview-ui\/(?:Select|Table|Dialog|MessageDialog|Form)['"]/.test(line)) {
        violations.push({
          file: rel, line: ln, code: 'LEGACY_PRO_USED',
          detail: line.trim() + ' —— 有 Pro 版的组件一律用 Pro 版：Select→SelectPro、Table→TablePro、Dialog→DialogPro、MessageDialog→MessageDialogPro、Form→FormPro（旧版弃用）',
        });
      }
      // 5. eview-ui 根包具名导入（应子路径默认导入）
      if (/\bimport\s*\{[^}]+\}\s*from\s+['"](?:@cloudsop\/)?eview-ui['"]/.test(line)) {
        violations.push({
          file: rel, line: ln, code: 'EVUI_ROOT_IMPORT',
          detail: line.trim() + ' —— 统一子路径默认导入：import X from "@cloudsop/eview-ui/X"（具名仅限子路径 TabItem/Row/Col）',
        });
      }
      // 7. Icon shim 旧路径残留
      if (/\bfrom\s+['"][^'"]*assets\/shared\/icon['"]/.test(line)) {
        violations.push({
          file: rel, line: ln, code: 'SHIM_PATH_RESIDUE',
          detail: line.trim() + ' —— 应改为 import Icon from "@/shared/Icon"',
        });
      }
      // 8. 图标策略违例（eview-ui Icon / SvgIcon 废弃 / IconButton 废弃）
      if (/\bfrom\s+['"](?:@cloudsop\/)?eview-ui\/(Icon|SvgIcon|IconButton)['"]/.test(line)) {
        violations.push({
          file: rel, line: ln, code: 'EVUI_ICON_FORBIDDEN',
          detail: line.trim() + ' —— 图标保留源 shim（@/shared/Icon）；eview-ui Icon 名体系不同，SvgIcon/IconButton 已废弃',
        });
      }
    }

    // 6. Panel 默认导入未解构（文件级：有 eview-ui/Panel 导入但无 const { Panel 解构）
    if (/from\s+['"](?:@cloudsop\/)?eview-ui\/Panel['"]/.test(text) && !/const\s*\{\s*Panel\b/.test(text)) {
      const lineNum = lines.findIndex(l => /from\s+['"](?:@cloudsop\/)?eview-ui\/Panel['"]/.test(l)) + 1;
      violations.push({
        file: rel, line: lineNum || 1, code: 'PANEL_NO_DESTRUCT',
        detail: 'import "@cloudsop/eview-ui/Panel" 默认导出不是 Panel 组件——必须解构：import PanelE from "@cloudsop/eview-ui/Panel"; const { Panel, PanelItem } = PanelE;',
      });
    }

    // 9. <Tab> 上挂 data prop（禁止）—— eview-ui Tab 同为 TabItem children 驱动
    //    <Tab\b 不匹配 <TabItem（Tab 后跟 I 无词边界）
    const tabRe = /<Tab\b/g;
    let tam;
    while ((tam = tabRe.exec(text)) !== null) {
      const start = tam.index;
      const tagEnd = findTagEnd(text, start);
      const tagWindow = tagEnd > 0 ? text.slice(start, tagEnd) : text.slice(start, start + 300);
      if (/\bdata\b\s*=/.test(tagWindow)) {
        const lineNum = text.slice(0, start).split('\n').length;
        violations.push({
          file: rel, line: lineNum, code: 'TAB_DATA_PROP',
          detail: 'Tab 是 children 驱动（<TabItem>），禁止 data 属性。data 是 Select/SelectCard/Wizards 等的 prop',
        });
      }
    }
  }

  // ---- 报告 ----
  console.log('[check-imports] eview-ui 导入路径硬约束检查报告');
  console.log(`  扫描范围: ${root}（${files.length} 个文件，已跳过 node_modules/dist/build/.开头 + src/shared）`);

  if (violations.length === 0) {
    console.log('\n结论: PASS — 未发现导入路径违规。');
    process.exit(0);
  }

  const byCode = {};
  for (const v of violations) (byCode[v.code] = byCode[v.code] || []).push(v);

  const codeDesc = {
    ANTD_RESIDUAL: '残留 antd（未替换为 eview-ui）',
    ANTD_SUBPATH: '残留 antd/ 子路径',
    ICONS_RESIDUAL: '残留 @ant-design/icons',
    EVIEWREACT_RESIDUAL: '残留 @nce/eview-react（骨架换血未完成）',
    EVUI_UNSCOPED_IMPORT: '裸包名导入（真实包名 @cloudsop/eview-ui）',
    EVUI_ROOT_IMPORT: 'eview-ui 根包具名导入（应子路径默认导入）',
    PANEL_NO_DESTRUCT: 'Panel 默认导入未解构',
    SHIM_PATH_RESIDUE: 'Icon shim 旧路径残留',
    EVUI_ICON_FORBIDDEN: '图标策略违例（导入 eview-ui Icon/SvgIcon/IconButton）',
    TAB_DATA_PROP: 'Tab 挂 data（应 TabItem children 驱动）',
    LEGACY_PRO_USED: '旧版 Pro 组件导入（有 Pro 版一律用 Pro 版）',
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
  console.log('  修复指引见 SKILL.md「eview-ui 硬约束」① 导入路径 / ⑨ 图标保留 / ② 骨架换血。');
  process.exit(1);
}

main();
