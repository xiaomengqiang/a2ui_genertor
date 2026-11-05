#!/usr/bin/env node
/**
 * check-dropdown.cjs — Dropdown→DropDown 迁移正确性检查（硬 FAIL + advisory）
 *
 * 对应 component-mapping.md Dropdown 行 + components/DropDown.md §4/§5/§8/§9。
 * antd Dropdown→eview DropDown 是「prop 重命名（menu/items→data）+ 字段重命名
 * （key→value，label→text）+ 回调签名改（onClick({key})→onItemClick(item,event)）
 * + 不支持多级子菜单 + disabled 正确拼写（非 disable）」的高错迁移，文档已强约束，
 * 本脚本做机器兜底——拦弱模型最常漏的 prop/字段残留、误当 Select、误用受控显隐、
 * disable 拼错、trigger 数组等硬错误，外加 onClick/onItemClick 与 value=0 真假值判断两类待核项。
 *
 * 检查项：
 *   硬 FAIL（exit 1）：
 *     1. MENU_PROP_RESIDUE        menu= 残留（antd Dropdown menu={{items}}，应为 data=）
 *     2. ITEMS_PROP_RESIDUE       items= 残留（应为 data=）
 *     3. OPTIONS_PROP_RESIDUE     options= 残留（误当 Select，应为 data=）
 *     4. KEY_FIELD_RESIDUE        data 项 key: 残留（应为 value:）
 *     5. LABEL_TEXT_RESIDUE       data 项 label: 带字符串值（antd 文字 label，应为 text:；
 *                                 label: true 是 DropDown 合法分组标记，不报）
 *     6. CHILDREN_SUBMENU_RESIDUE data 项 children: 残留（antd 多级子菜单，DropDown 仅一级不支持）
 *     7. DISABLE_PROP_RESIDUE     disable 残留（应为 disabled，DropDown 用正确拼写）
 *     8. TRIGGER_ARRAY            trigger={['click']} 数组（应为单字符串 'click'/'hover'）
 *     9. PLACEMENT_RESIDUE        placement= 残留（应为 position+popupDirection）
 *    10. OPEN_CONTROL_RESIDUE     open=/onOpenChange= 残留（DropDown 展开内部管理，无受控显隐 API）
 *    11. SELECT_API_RESIDUE       value=/onChange= 残留（误当 Select，DropDown 无选值契约）
 *   advisory（exit 0，需逐条回应写入 dropdownReviews）：
 *    12. ONCLICK_USED             <DropDown> 用 onClick=（应用 onItemClick(item, event) 处理菜单项点击；
 *                                 onClick 是未记录无参事件）
 *    13. VALUE_BOOLEAN_CHECK      onItemClick 回调里 if (x.value)/if (!x.value) 真假值判断
 *                                 （value=0 有效，会误拦；应 === undefined）
 *
 * 用法：
 *   node check-dropdown.cjs <目标工程根>          # 硬 FAIL exit 1，advisory exit 0
 *
 * 纯静态正则（扫描前移除注释），不执行代码。退出码：0=通过/仅 advisory，1=硬 FAIL，2=用法错误。
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

function lineOfOffset(text, offset) {
  let line = 1;
  for (let i = 0; i < offset && i < text.length; i++) if (text.charCodeAt(i) === 10) line++;
  return line;
}

// 移除注释（同 check-provider.cjs）：/* */ 块注释（保留换行维持行号）+ // 行注释
function stripComments(text) {
  let out = text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
  out = out.replace(/(^|[^:'"])\/\/[^\n]*/g, (m, p1) => p1);
  return out;
}

// 从 <DropDown 开始提取开标签片段（跳过字符串和 {} 表达式），同 check-steps-defaults tagWindow
function tagWindow(code, start) {
  let i = start + 1;
  let inStr = null;
  let braceDepth = 0;
  while (i < code.length) {
    const ch = code[i];
    if (inStr) {
      if (ch === '\\') { i += 2; continue; }
      if (ch === inStr) inStr = null;
      i++; continue;
    }
    if (ch === '"' || ch === "'") { inStr = ch; i++; continue; }
    if (ch === '{') { braceDepth++; i++; continue; }
    if (ch === '}') { braceDepth--; i++; continue; }
    if (braceDepth === 0 && ch === '>') return code.slice(start, i + 1);
    i++;
  }
  return code.slice(start, start + 800);
}

// 从 startIdx（指向 openCh）平衡匹配到 closeCh，返回 { body, bodyStart }
function extractBalanced(text, openCh, closeCh, startIdx) {
  let depth = 0, i = startIdx, inStr = null;
  while (i < text.length) {
    const ch = text[i];
    if (inStr) {
      if (ch === '\\') { i += 2; continue; }
      if (ch === inStr) inStr = null;
    } else {
      if (ch === '"' || ch === "'" || ch === '`') inStr = ch;
      else if (ch === openCh) depth++;
      else if (ch === closeCh) { depth--; if (depth === 0) return { body: text.slice(startIdx + 1, i), bodyStart: startIdx + 1 }; }
    }
    i++;
  }
  return null;
}

// 提取 prop={...} 的值内容（不含外层 {}）。返回 { body, bodyStartOffsetInText } 或 null
function extractPropExpr(text, frag, propName, fragOffsetInText) {
  const re = new RegExp(`\\b${propName}\\b\\s*=\\s*\\{`);
  const m = re.exec(frag);
  if (!m) return null;
  const braceIdxInFrag = m.index + m[0].length - 1; // 指向 {
  const braceIdxInText = fragOffsetInText + braceIdxInFrag;
  const res = extractBalanced(text, '{', '}', braceIdxInText);
  if (!res) return null;
  return { body: res.body, bodyStartOffsetInText: res.bodyStart };
}

// 从 prop 表达式体（{} 内）解析数组体：内联 [ 或标识符追同文件 const/let/var X = [
function resolveArrayBody(text, exprBody, exprStart) {
  const arrOff = exprBody.indexOf('[');
  if (arrOff >= 0) {
    const arrIdxInText = exprStart + arrOff;
    const res = extractBalanced(text, '[', ']', arrIdxInText);
    if (res) return { body: res.body, bodyStart: res.bodyStart };
  }
  const nameM = exprBody.trim().match(/^([A-Za-z_$][\w$]*)/);
  if (nameM) {
    const re = new RegExp(`\\b(?:const|let|var)\\s+${nameM[1]}\\s*=\\s*\\[`);
    const defM = re.exec(text);
    if (defM) {
      const arrIdxInText = defM.index + defM[0].lastIndexOf('[');
      const res = extractBalanced(text, '[', ']', arrIdxInText);
      if (res) return { body: res.body, bodyStart: res.bodyStart };
    }
  }
  return null;
}

// 收集 DropDown 持有菜单项的数组体：data= / items= / options=（直取）+ menu=（钻 items:）
// menu={{ items: [...] }} / menu={{ items: identifier }} 时 items 套在对象里，需进一层
function collectItemArrays(text, frag, fragOffset) {
  const out = [];
  for (const prop of ['data', 'items', 'options']) {
    const expr = extractPropExpr(text, frag, prop, fragOffset);
    if (expr) {
      const arr = resolveArrayBody(text, expr.body, expr.bodyStartOffsetInText);
      if (arr) out.push(arr);
    }
  }
  const menuExpr = extractPropExpr(text, frag, 'menu', fragOffset);
  if (menuExpr) {
    const itemsM = /\bitems\b\s*:\s*/.exec(menuExpr.body);
    if (itemsM) {
      const valStartInBody = itemsM.index + itemsM[0].length;
      const valBody = menuExpr.body.slice(valStartInBody);
      const valStartInText = menuExpr.bodyStartOffsetInText + valStartInBody;
      const arr = resolveArrayBody(text, valBody, valStartInText);
      if (arr) out.push(arr);
    }
  }
  return out;
}

function main() {
  const args = process.argv.slice(2);
  const rootIdx = args.findIndex((a) => !a.startsWith('--'));
  const root = rootIdx >= 0 ? path.resolve(args[rootIdx]) : process.cwd();
  const srcDir = path.join(root, 'src');
  if (!fs.existsSync(srcDir)) {
    console.error(`[check-dropdown] 找不到 ${srcDir}，用法: node check-dropdown.cjs <目标工程根>`);
    process.exit(2);
  }

  const files = walk(srcDir, []);
  const fails = [];      // 硬 FAIL
  const advisories = []; // advisory
  // 字段残留去重键：同一 file:line:field 只报一次（data 常量被多个 <DropDown> 引用时避免重复）
  const fieldSeen = new Set();
  // disable 去重键：同一 file:line 只报一次（tag 级 disable= 与 data 项 disable: 可能同文件多处）
  const disableSeen = new Set();

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    if (!/<DropDown\b/.test(raw)) continue;
    const text = stripComments(raw);
    const rel = path.relative(root, file);

    const re = /<DropDown\b/g;
    let m;
    while ((m = re.exec(text)) !== null) {
      const start = m.index;
      const frag = tagWindow(text, start);
      const line = lineOfOffset(text, start);

      // 1/2/3. prop 残留：menu= / items= / options=
      if (/\bmenu\b\s*=\s*\{/.test(frag)) {
        fails.push({ file: rel, line, code: 'MENU_PROP_RESIDUE',
          detail: 'menu= 残留——antd Dropdown 的 menu={{items}} 应改为 DropDown 的 data={[{text,value}]}' });
      }
      if (/\bitems\b\s*=\s*\{/.test(frag)) {
        fails.push({ file: rel, line, code: 'ITEMS_PROP_RESIDUE',
          detail: 'items= 残留——应为 data=（antd menu.items→eview data）' });
      }
      if (/\boptions\b\s*=\s*\{/.test(frag)) {
        fails.push({ file: rel, line, code: 'OPTIONS_PROP_RESIDUE',
          detail: 'options= 残留——DropDown 用 data，无 options（options 是 Select 的 prop，勿把操作菜单当输入控件）' });
      }

      // 4/5/6. 字段残留（扫 data/items/options/menu 持有的项数组体）
      const arrays = collectItemArrays(text, frag, start);
      for (const arr of arrays) {
        // key: → value:
        const keyRe = /\bkey\b\s*:/g;
        let rm;
        while ((rm = keyRe.exec(arr.body)) !== null) {
          const off = arr.bodyStart + rm.index;
          const resLine = lineOfOffset(text, off);
          const dk = `${rel}:${resLine}:key`;
          if (fieldSeen.has(dk)) continue;
          fieldSeen.add(dk);
          fails.push({ file: rel, line: resLine, code: 'KEY_FIELD_RESIDUE',
            detail: 'data 项残留 antd 字段名 "key:"（应为 value:）——DropDownItem 用 value 做命令标识，key 是 antd menu item 字段。见 DropDown.md §5' });
        }
        // label: 带字符串值 → text:（label: true/false/<var> 是 DropDown 合法分组标记，不报）
        const labelRe = /\blabel\b\s*:\s*(['"`])/g;
        while ((rm = labelRe.exec(arr.body)) !== null) {
          const off = arr.bodyStart + rm.index;
          const resLine = lineOfOffset(text, off);
          const dk = `${rel}:${resLine}:label`;
          if (fieldSeen.has(dk)) continue;
          fieldSeen.add(dk);
          fails.push({ file: rel, line: resLine, code: 'LABEL_TEXT_RESIDUE',
            detail: 'data 项残留 antd 字段名 "label:" 带文字值（应为 text:）——DropDown 的 label 是 boolean（true=分组标题/分割行），文字内容用 text。见 DropDown.md §5' });
        }
        // children: → 多级子菜单不支持
        const childrenRe = /\bchildren\b\s*:/g;
        while ((rm = childrenRe.exec(arr.body)) !== null) {
          const off = arr.bodyStart + rm.index;
          const resLine = lineOfOffset(text, off);
          const dk = `${rel}:${resLine}:children`;
          if (fieldSeen.has(dk)) continue;
          fieldSeen.add(dk);
          fails.push({ file: rel, line: resLine, code: 'CHILDREN_SUBMENU_RESIDUE',
            detail: 'data 项残留 "children:" 子菜单字段——DropDown 仅一级操作菜单，不支持 children/submenus 多级下钻。源 antd 多级菜单需拍平为一级（label:true 做分组）或拆成多个菜单。见 DropDown.md §5/§8' });
        }
        // disable: 字段（应为 disabled:）—— 仅 chased const 数组需在此补扫；
        //   内联数组里的 disable: 会被下方 tag 级扫描命中，靠 disableSeen 去重不重复报
        const disFieldRe = /\bdisable\b\s*:/g;
        while ((rm = disFieldRe.exec(arr.body)) !== null) {
          const off = arr.bodyStart + rm.index;
          const resLine = lineOfOffset(text, off);
          const dk = `${rel}:${resLine}`;
          if (disableSeen.has(dk)) continue;
          disableSeen.add(dk);
          fails.push({ file: rel, line: resLine, code: 'DISABLE_PROP_RESIDUE',
            detail: 'data 项字段 "disable:" 残留——应为 disabled:（DropDown 用正确拼写 disabled，disable 静默丢禁用态）。见 DropDown.md §5' });
        }
      }

      // 7. disable（应为 disabled）—— disable 后不跟字母/数字/下划线（排除 disabled/disableXxx）
      //     覆盖 prop 级 disable= / 裸 disable 与内联 data 项 disable:（chased const 的 disable: 由上方数组扫描补）
      const disRe = /\bdisable\b(?![\w])/g;
      let dm;
      while ((dm = disRe.exec(frag)) !== null) {
        const off = start + dm.index;
        const dLine = lineOfOffset(text, off);
        const dk = `${rel}:${dLine}`;
        if (disableSeen.has(dk)) continue;
        disableSeen.add(dk);
        fails.push({ file: rel, line: dLine, code: 'DISABLE_PROP_RESIDUE',
          detail: 'disable 残留——DropDown 用正确拼写 disabled（disable 是 SelectCard/FileUpload 的拼错 API，DropDown 不认，静默丢禁用态）。见 DropDown.md §5' });
      }

      // 8. trigger 数组（antd ['click'] → eview 单字符串）
      if (/\btrigger\b\s*=\s*\{\s*\[/.test(frag)) {
        fails.push({ file: rel, line, code: 'TRIGGER_ARRAY',
          detail: "trigger 传了数组——DropDown 的 trigger 是单个字符串 'click' / 'hover'（非 antd 的数组 ['click']）" });
      }

      // 9. placement 残留
      if (/\bplacement\b\s*=/.test(frag)) {
        fails.push({ file: rel, line, code: 'PLACEMENT_RESIDUE',
          detail: 'placement= 残留——DropDown 用 position（left/right/auto）+ popupDirection（top/bottom/auto），无 placement' });
      }

      // 10. open=/onOpenChange= 受控显隐残留
      if (/\bopen\b\s*=\s*\{/.test(frag) || /\bonOpenChange\b\s*=/.test(frag)) {
        fails.push({ file: rel, line, code: 'OPEN_CONTROL_RESIDUE',
          detail: 'open=/onOpenChange= 残留——DropDown 展开由组件内部管理，无受控显隐 API；用 onDropDown(display)/onClosePopup() 仅作通知，不能驱动显隐' });
      }

      // 11. value=/onChange= 当 Select 用
      if (/\bvalue\b\s*=\s*\{/.test(frag) || /\bonChange\b\s*=/.test(frag)) {
        fails.push({ file: rel, line, code: 'SELECT_API_RESIDUE',
          detail: 'value=/onChange= 残留——DropDown 不是 Select，无选值契约（无 value/onChange/options）；选中高亮用 selectedIndex（匹配 item.value）' });
      }

      // 12. advisory: onClick=（应用 onItemClick）
      if (/\bonClick\b\s*=/.test(frag)) {
        advisories.push({ file: rel, line, code: 'ONCLICK_USED',
          detail: '<DropDown> 用了 onClick=——DropDown 用 onItemClick(item, event) 处理菜单项点击（首参是菜单项，item.value/item.text）；onClick 是未记录的无参事件，不能取点击项。核对是否应改为 onItemClick。见 DropDown.md §4/§9' });
      }

      // 13. advisory: onItemClick 回调里 if (x.value)/if (!x.value) 真假值判断（value=0 有效）
      const icExpr = extractPropExpr(text, frag, 'onItemClick', start);
      if (icExpr) {
        const boolRe = /if\s*\(\s*!?[\w$]+\.value\b\s*\)/g;
        let bm;
        while ((bm = boolRe.exec(icExpr.body)) !== null) {
          const off = icExpr.bodyStartOffsetInText + bm.index;
          const bLine = lineOfOffset(text, off);
          advisories.push({ file: rel, line: bLine, code: 'VALUE_BOOLEAN_CHECK',
            detail: `onItemClick 回调用真假值判断 "${bm[0]}"——DropDown 的 value=0 有效（如 {text:'复制',value:0}），if(item.value)/if(!item.value) 会误拦 value=0 的项。应改为 item.value === undefined 判缺失。见 DropDown.md §4` });
        }
      }
    }
  }

  // ---- 报告 ----
  const ddFiles = files.filter((f) => /<DropDown\b/.test(fs.readFileSync(f, 'utf8'))).length;
  console.log('[check-dropdown] Dropdown→DropDown 迁移正确性检查报告');
  console.log(`  扫描范围: ${srcDir}（${files.length} 个文件，含 <DropDown> 的 ${ddFiles} 个）`);

  if (fails.length === 0 && advisories.length === 0) {
    console.log('\n结论: PASS — 无 DropDown，或所有 <DropDown> 通过检查。');
    process.exit(0);
  }

  if (fails.length > 0) {
    console.log(`\n【硬 FAIL】${fails.length} 处：`);
    for (const v of fails) console.log(`  - ${v.file}:${v.line}  [${v.code}] ${v.detail}`);
  }
  if (advisories.length > 0) {
    console.log(`\n【advisory — 需逐条回应写入 dropdownReviews】${advisories.length} 处：`);
    for (const v of advisories) console.log(`  - ${v.file}:${v.line}  [${v.code}] ${v.detail}`);
  }
  console.log('\n  修复指引见 component-mapping.md Dropdown 行 + components/DropDown.md §4/§5/§8/§9。');
  process.exit(fails.length > 0 ? 1 : 0);
}

main();
