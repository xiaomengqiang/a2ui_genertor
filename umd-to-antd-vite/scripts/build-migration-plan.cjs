#!/usr/bin/env node

// build-migration-plan.cjs
// Automated Step 5 of umd-to-antd-vite:
// Reads .umd-conversion.json (antdComponents) + component-mapping.md from antd-to-eview-react,
// generates enriched migrationPlan (full keyDiffs + importPath + shellComponent + ref),
// plus globalRef (static spelling anomalies + callback signatures).
// Writes back to .umd-conversion.json — downstream antd-to-eview-react Step 0 reads it
// and can skip reading component-mapping.md + component docs for A-class components.
//
// Usage:
//   node build-migration-plan.cjs <target-project-root> [--skill-dir <antd-to-eview-react skill dir>]
//
// If --skill-dir not provided, tries:
//   1. ../../antd-to-eview-react (sibling of this script's skill, works for workspace copy)
//   2. ~/.opencode/skills/antd-to-eview-react (installed skill)

const fs = require('fs');
const path = require('path');
const os = require('os');

const targetRoot = process.argv[2];
let skillDir = null;

const skillDirIdx = process.argv.indexOf('--skill-dir');
if (skillDirIdx !== -1 && process.argv[skillDirIdx + 1]) {
  skillDir = process.argv[skillDirIdx + 1];
} else {
  const sibling = path.resolve(__dirname, '../../antd-to-eview-react');
  if (fs.existsSync(path.join(sibling, 'references/component-mapping.md'))) {
    skillDir = sibling;
  } else {
    const homeSkill = path.join(os.homedir(), '.opencode/skills/antd-to-eview-react');
    if (fs.existsSync(path.join(homeSkill, 'references/component-mapping.md'))) {
      skillDir = homeSkill;
    }
  }
}

if (!targetRoot) {
  console.error('[build-migration-plan] 用法: node build-migration-plan.cjs <target-project-root> [--skill-dir <dir>]');
  process.exit(1);
}

const handoffPath = path.join(targetRoot, '.umd-conversion.json');
if (!fs.existsSync(handoffPath)) {
  console.error(`[build-migration-plan] 找不到 .umd-conversion.json: ${handoffPath}`);
  process.exit(1);
}

if (!skillDir) {
  console.error('[build-migration-plan] 找不到 antd-to-eview-react skill 目录（component-mapping.md），请用 --skill-dir 指定');
  process.exit(1);
}

const mappingPath = path.join(skillDir, 'references/component-mapping.md');
const mappingText = fs.readFileSync(mappingPath, 'utf8');
const handoff = JSON.parse(fs.readFileSync(handoffPath, 'utf8'));

// scaffold 包壳组件硬编码清单（兜底：Steps 在 mapping table keyDiffs 里没有 @/shared/ 字样，
// 需硬编码检测。其余包壳都能从 keyDiffs 的 @/shared/<X> 自动检测）
const SHELL_COMPONENTS = [
  'Select', 'TextField', 'InputSelect', 'MultipleSelect', 'SearchInput', 'TextArea',
  'Tag', 'DatePicker', 'Spinner', 'Steps', 'Cascader', 'TreeSelector', 'IPInput', 'TimePicker',
];

// ========== 1. Parse component-mapping.md into lookup table ==========

function parseMappingTable(text) {
  const lookup = {};
  let currentSection = '';

  for (const line of text.split('\n')) {
    const trimmed = line.trim();

    if (trimmed.startsWith('## ')) {
      currentSection = trimmed.replace(/^##\s+/, '');
      continue;
    }

    if (!trimmed.startsWith('|')) continue;
    if (/^[\s|_-]+$/.test(trimmed)) continue;

    const cells = trimmed.split('|').slice(1, -1).map(c => c.trim());
    if (cells.length < 3) continue;

    const antdRaw = cells[0].replace(/`/g, '').trim();
    const eviewRaw = cells[1].replace(/`/g, '').trim();
    const keyDiffs = cells[2].replace(/`/g, '').trim();

    if (!antdRaw || antdRaw === 'antd' || /^[-]+$/.test(antdRaw)) continue;
    if (antdRaw.startsWith('@ant-design')) continue;

    const baseNameMatch = antdRaw.match(/^([A-Za-z][\w]*)/);
    if (!baseNameMatch) continue;
    const baseName = baseNameMatch[1];

    const eviewName = extractEviewName(eviewRaw);
    const category = determineCategory(baseName, eviewName, eviewRaw);
    const importPath = determineImportPath(category, eviewName, keyDiffs);
    const ref = determineRef(category, eviewName, keyDiffs);
    const shellComponent = isShellComponent(eviewName, keyDiffs);

    const entry = {
      antdPattern: antdRaw,
      baseName,
      eviewRaw,
      eviewName,
      category,
      importPath,
      shellComponent,
      keyDiffs,
      ref,
      section: currentSection,
    };

    if (!lookup[baseName]) lookup[baseName] = [];
    lookup[baseName].push(entry);
  }

  return lookup;
}

function extractEviewName(eviewRaw) {
  // If starts with a component name (capitalized word), use it
  // (handles "Cascader（@/shared/Cascader 手写）" where 手写 is a description, not B-class)
  const startMatch = eviewRaw.match(/^([A-Z][A-Za-z0-9]+)/);
  if (startMatch) return startMatch[1];
  // If contains 手写 and doesn't start with a component, it's B class
  if (eviewRaw.includes('手写')) return '手写';
  // Try to find any component name elsewhere
  const m = eviewRaw.match(/\b([A-Z][A-Za-z0-9]+)\b/);
  return m ? m[1] : null;
}

function determineCategory(baseName, eviewName, eviewRaw) {
  if (baseName === 'Steps') return 'C';
  if (baseName === 'Modal') return 'C';
  if (eviewName === '手写' || !eviewName) return 'B';
  return 'A';
}

function isShellComponent(eviewName, keyDiffs) {
  if (!eviewName) return false;
  if (/@\/shared\//.test(keyDiffs)) return true;
  if (SHELL_COMPONENTS.includes(eviewName)) return true;
  return false;
}

function determineImportPath(category, eviewName, keyDiffs) {
  const shellMatch = keyDiffs.match(/@\/shared\/(\w+)/);
  if (shellMatch) return `@/shared/${shellMatch[1]}`;
  if (SHELL_COMPONENTS.includes(eviewName)) return `@/shared/${eviewName}`;
  if (category === 'B') return null;
  if (eviewName && category !== 'B') return `@nce/eview-react/${eviewName}`;
  return null;
}

function determineRef(category, eviewName, keyDiffs) {
  if (category === 'A') return `components/${eviewName}.md`;
  if (category === 'B') {
    const sectionMatch = keyDiffs.match(/§(\d+)/);
    if (sectionMatch) return `handwrite-templates.md §${sectionMatch[1]}`;
    return 'handwrite-templates.md';
  }
  if (category === 'C') {
    if (eviewName === 'Dialog') return 'components/Dialog.md';
    if (eviewName === 'MessageDialog') return 'components/MessageDialog.md';
    return `components/${eviewName}.md`;
  }
  return null;
}

const lookup = parseMappingTable(mappingText);

// ========== 2. Build migrationPlan from antdComponents ==========

const antdComponents = handoff.antdComponents || {};
const migrationPlan = [];
const unmatched = [];

for (const [antdName, files] of Object.entries(antdComponents)) {
  let rows = lookup[antdName] || [];

  if (rows.length === 0) {
    unmatched.push(antdName);
    migrationPlan.push({
      antd: antdName,
      category: 'unknown',
      eview: null,
      importPath: null,
      shellComponent: false,
      keyDiffs: '未在 component-mapping.md 中找到映射，需人工评估',
      ref: null,
      files,
    });
    continue;
  }

  const primaryRow = rows.find(r => r.eviewName && r.eviewName !== '手写') || rows[0];

  const allKeyDiffs = rows
    .map((r, i) => rows.length > 1 ? `[${r.antdPattern}] ${r.keyDiffs}` : r.keyDiffs)
    .join(' | ');

  const importPaths = [...new Set(rows.map(r => r.importPath).filter(Boolean))];
  const shellFlags = [...new Set(rows.map(r => r.shellComponent).filter(Boolean))];

  migrationPlan.push({
    antd: antdName,
    category: primaryRow.category,
    eview: primaryRow.eviewName,
    importPath: importPaths[0] || null,
    shellComponent: shellFlags.length > 0,
    keyDiffs: allKeyDiffs,
    ref: primaryRow.ref,
    files,
  });
}

// ========== 2b. 注入 IPInput 迁移行（ict-coder 手写共享件，非 antd 导入，步骤 2 扫不到） ==========
// 触发条件：.umd-conversion.json 的 ipInputCallSites.callSites 非空（extract-umd.cjs §4.7 扫到 <IpInput> 调用点）
// antd 无 IPInput 组件，ict-coder 在 assets/shared/ 或 src/components/ip-input/ 手写了一份；
// extract-umd.cjs 只扫 from 'antd' 导入，该手写件零 antd 依赖（assets/shared/ 版本）或仅内部用 antd Input（src/components/ 版本），
// antdComponents 不含 IPInput 键 → 上面 §2 循环不会为它生成行 → 此处补注入，让下游步骤 0/2 能看到。

const ipInputInfo = handoff.ipInputCallSites;
if (ipInputInfo && ipInputInfo.callSites && ipInputInfo.callSites.length) {
  const ipFiles = [...new Set(ipInputInfo.callSites.map(c => c.file))];
  const ipSharedFiles = ipInputInfo.sharedFiles || [];
  migrationPlan.push({
    antd: 'IpInput',
    category: 'A',
    eview: 'IPInput',
    importPath: '@/shared/IPInput',
    shellComponent: true,
    keyDiffs: 'ict-coder 手写 IPInput 共享件（非 antd 组件）。迁移到 @/shared/IPInput（scaffold 包壳，转发 @nce/eview-react/IPInput）。关键差异：① 删除手写共享件（' + ipSharedFiles.join(', ') + '），import 路径改为 import IPInput from "@/shared/IPInput"；② type 值：源 "ipv4"→"v4"、"ipv6"→"v6"、"mac"→"mac"（不变）；③ size（large/middle/small）eview 无对应 API，删或用 className 控制尺寸；④ status="error" → 用 validator 返回 { result:false, message } + hintType="tip"；⑤ onChange/onBlur 首参均为完整字符串（与源一致，回调签名不变）；⑥ value 传完整字符串（如 "192.168.1.1"），不要拆成数组；⑦ 组件名 IpInput→IPInput（默认导入名随意，建议大写以匹配文档）',
    ref: 'components/IPInput.md',
    files: ipFiles,
    sharedFilesToRemove: ipSharedFiles,
  });
  console.log(`[build-migration-plan] 注入 IPInput 迁移行（ict-coder 手写件 → @/shared/IPInput）: ${ipFiles.length} 个调用文件`);
}

// ========== 2c. 注入 Chart 迁移行（ict-coder 内置图表共享件，非 antd 导入，步骤 2 扫不到） ==========
// 触发条件：.umd-conversion.json 的 chartCallSites.callSites 非空（extract-umd.cjs §4.9 扫到 <Chart> 调用点）
// antd 无 Chart 组件，ict-coder 在 assets/shared/chart.jsx 内置了图表封装（HUICharts wrapper）；
// extract-umd.cjs 只扫 from 'antd' 导入，该共享件非 antd 组件，
// antdComponents 不含 Chart 键 → 上面 §2 循环不会为它生成行 → 此处补注入，让下游步骤 0/2 能看到。

const chartInfo = handoff.chartCallSites;
if (chartInfo && chartInfo.callSites && chartInfo.callSites.length) {
  const chartFiles = [...new Set(chartInfo.callSites.map(c => c.file))];
  const chartSharedFiles = chartInfo.sharedFiles || [];
  migrationPlan.push({
    antd: 'Chart',
    category: 'A',
    eview: 'Chart',
    importPath: '@nce/eview-react/Chart',
    shellComponent: false,
    keyDiffs: 'ict-coder 内置 Chart 共享件（非 antd 组件，从 assets/shared/chart.jsx 导入）。迁移到 @nce/eview-react/Chart。只改 import 路径，name + option 契约不变。⚠️ 每个 option 必须显式补 a2ui: true + theme（暗色派生 hdesign-dark/hdesign-light）：源 Chart 封装在 setSimpleOption 前统一注入这两项，改包导入后不会自动补——漏写则 a2ui 视觉规范失效、暗色切换图表主题不跟随。theme 从全局暗色状态派生（如 useApp().isDark ? "hdesign-dark" : "hdesign-light"）。推荐聚合 const chartBase = { a2ui: true, theme: ... } 后展开进各 option',
    ref: 'components/Chart.md',
    files: chartFiles,
    sharedFilesToRemove: chartSharedFiles,
  });
  console.log(`[build-migration-plan] 注入 Chart 迁移行（ict-coder 内置件 → @nce/eview-react/Chart）: ${chartFiles.length} 个调用文件`);
}

// ========== 3. Global reference (static, inlined to save downstream reads) ==========

const globalRef = {
  spellingAnomalies: [
    { eview: 'seprator', correct: 'separator', component: 'Crumbs' },
    { eview: 'taggledChildren', correct: 'toggledChildren', component: 'Toggle' },
    { eview: 'disable', correct: 'disabled', component: 'SelectCard/FileUpload' },
    { eview: 'status', antd: 'type', component: 'Button' },
    { eview: 'defaultLabel', antd: 'placeholder', component: 'Select' },
    { eview: 'toggled', antd: 'checked', component: 'Toggle' },
    { eview: 'iconSize', antd: 'size', component: 'icon-plus' },
  ],
  callbackSignatures: [
    { component: 'TextField', signature: 'onChange(value, oldValue, event)', note: '首参是值不是 event' },
    { component: 'Select', signature: 'onChange(value, oldValue, text, oldText, event)', note: '五参' },
    { component: 'TextArea', signature: 'onChange(targetValue, value, event)' },
    { component: 'MultipleSelect', signature: 'onChange(value[], changeValue[], event)' },
    { component: 'SearchInput', signature: 'onSearch(value)', note: '值变化也触发，需防抖' },
    { component: 'Button', signature: 'onClick(event, additionalData)', note: '第二参是业务数据' },
    { component: 'Tab', signature: 'onClick(index, title, event)', note: '不是 onChange' },
    { component: 'Toggle', signature: 'onToggle(value)' },
    { component: 'Spinner', signature: 'onChange(value)', note: '只在有效值触发' },
    { component: 'Checkbox', signature: 'onChange(value, checked, event, additionalData)' },
    { component: 'Radio', signature: 'onChange(value, event)', note: '参数顺序有冲突，用兼容写法' },
    { component: 'DragInput', signature: 'onChange(value[])', note: 'value 永远是数组' },
    { component: 'TreeSelector', signature: 'onChange(value: string|string[], checkedKeys?)', note: '首参是 id' },
  ],
};

// ========== 4. Write back ==========

handoff.migrationPlan = migrationPlan;
handoff.globalRef = globalRef;

fs.writeFileSync(handoffPath, JSON.stringify(handoff, null, 2) + '\n', 'utf8');

// ========== Report ==========

const catCounts = {};
for (const e of migrationPlan) {
  catCounts[e.category] = (catCounts[e.category] || 0) + 1;
}

console.log('');
console.log('=== build-migration-plan 报告 ===');
console.log(`  组件总数: ${migrationPlan.length}`);
console.log(`  分类: A(有对应)=${catCounts.A || 0}, B(手写)=${catCounts.B || 0}, C(模式转换)=${catCounts.C || 0}, unknown=${catCounts.unknown || 0}`);
const shellCount = migrationPlan.filter(e => e.shellComponent).length;
if (shellCount) console.log(`  包壳组件: ${shellCount} 个`);
if (unmatched.length) {
  console.log(`  未匹配: ${unmatched.join(', ')}`);
}
console.log(`  globalRef: ${globalRef.spellingAnomalies.length} 条拼写异常, ${globalRef.callbackSignatures.length} 条回调签名`);
console.log(`  交接文件: ${handoffPath}`);
