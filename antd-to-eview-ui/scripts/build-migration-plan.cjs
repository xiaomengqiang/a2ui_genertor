#!/usr/bin/env node

// build-migration-plan.cjs — antd-to-eview-ui 步骤 0 的自动化脚本（fork 自 umd-to-antd-vite 同名脚本）
// 读 .umd-conversion.json（antdComponents）+ 本 skill 自己的 references/component-mapping.md，
// 生成 migrationPlanEui（分类 A/B/P + importPath + keyDiffs + ref）+ globalRefEui
// （拼写异常 + 回调签名 + 显隐 prop 三张速查表，内联省下游读表）。
// 写回 .umd-conversion.json 的独立字段——**不动**上游已有的 migrationPlan/globalRef 字段（如有）。
//
// 类别说明：
//   A = 有对应（改导入 + props）
//   B = 无对应（handwrite-templates.md 手写）
//   P = 保留（保留源封装不动：Icon shim / Chart，不迁移）
//
// 用法：
//   node build-migration-plan.cjs <target-project-root>
//
// mapping 固定取本 skill 目录（脚本在 <skill>/scripts/ 下，mapping 在 ../references/）。

const fs = require('fs');
const path = require('path');

const targetRoot = process.argv[2];
if (!targetRoot) {
  console.error('[build-migration-plan(eui)] 用法: node build-migration-plan.cjs <target-project-root>');
  process.exit(1);
}

const skillDir = path.resolve(__dirname, '..');
const mappingPath = path.join(skillDir, 'references/component-mapping.md');

const handoffPath = path.join(targetRoot, '.umd-conversion.json');
if (!fs.existsSync(handoffPath)) {
  console.error(`[build-migration-plan(eui)] 找不到 .umd-conversion.json: ${handoffPath}——本 skill 仅处理 umd-to-antd-vite 产物`);
  process.exit(1);
}
if (!fs.existsSync(mappingPath)) {
  console.error(`[build-migration-plan(eui)] 找不到本 skill 的 component-mapping.md: ${mappingPath}`);
  process.exit(1);
}

const mappingText = fs.readFileSync(mappingPath, 'utf8').replace(/^\uFEFF/, '');
const handoff = JSON.parse(fs.readFileSync(handoffPath, 'utf8').replace(/^\uFEFF/, ''));

// 导入特例（component-mapping.md「导入规范」小节）——按 eview 组件名查
const SPECIAL_IMPORTS = {
  Tab: 'import Tab, { TabItem } from "@cloudsop/eview-ui/Tab"（TabItem 具名导出）',
  Panel: 'import PanelE from "@cloudsop/eview-ui/Panel"; const { Panel, PanelItem } = PanelE;（必须解构，默认导出不是 Panel 本身）',
  Row: 'import { Row, Col } from "@cloudsop/eview-ui/GridLayout"（具名导出）',
  Col: 'import { Row, Col } from "@cloudsop/eview-ui/GridLayout"（具名导出）',
  RangePicker: 'import DatePicker from "@cloudsop/eview-ui/DatePicker"; const { RangePicker } = DatePicker;（RangePicker 是 DatePicker 静态属性，<DatePicker.RangePicker> 改 <RangePicker>）',
};

// ref 特例：文档文件名 ≠ 组件名
const SPECIAL_REFS = {
  RangePicker: 'components/DatePicker.md',
};

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
    if (trimmed.startsWith('### ')) currentSection = trimmed.replace(/^###\s+/, '');
    if (!trimmed.startsWith('|')) continue;
    if (/^[\s|_-]+$/.test(trimmed)) continue;

    const cells = trimmed.split('|').slice(1, -1).map(c => c.trim());
    if (cells.length < 3) continue; // 跳过「导入规范」等 2 列表

    const antdRaw = cells[0].replace(/`/g, '').trim();
    const eviewRaw = cells[1].replace(/`/g, '').trim();
    const keyDiffs = cells[2].replace(/`/g, '').trim();

    if (!antdRaw || antdRaw === 'antd' || antdRaw === 'antd / 源项目' || /^[-]+$/.test(antdRaw)) continue;
    if (antdRaw.startsWith('@ant-design')) continue;
    if (antdRaw.startsWith('<')) continue; // Icon/Chart 保留行走 P 注入，不入表

    // antd 名 token 提取：
    //  - head：去掉中文括号注释后的前缀（"Row / Col（GridLayout）" → "Row / Col"）
    //  - seg：head 首词（"Button type=..." → "Button"）
    //  - "." 成员名（Dropdown.Button / DatePicker.RangePicker / Typography.Link）：注册全名 + 基名，
    //    主行选择时精确 pattern 优先（防止 Dropdown.Button 行抢占 Dropdown 的主映射）
    //  - "/" 别名（Row / Col、Layout/Header/Sider/Content、Tabs / TabPane）：逐段取首词注册
    const head = antdRaw.split(/[（(]/)[0].trim();
    const seg = head.split(/\s+/)[0];
    let tokens;
    if (seg.includes('.')) {
      tokens = [seg, ...seg.split(/[.]/)];
    } else if (head.includes('/')) {
      tokens = head.split(/\//).map(t => t.trim().split(/\s+/)[0]).filter(t => /^[A-Z]/.test(t));
    } else {
      tokens = [seg];
    }
    if (tokens.length === 0 || !/^[A-Z]/.test(tokens[0])) continue;

    const eviewName = extractEviewName(eviewRaw);
    const category = determineCategory(eviewName, eviewRaw);

    const entry = {
      antdPattern: antdRaw,
      eviewRaw,
      eviewName,
      category,
      importPath: determineImportPath(category, eviewName),
      ref: determineRef(category, eviewName, keyDiffs),
      keyDiffs,
      section: currentSection,
    };

    for (const tk of tokens) {
      if (!lookup[tk]) lookup[tk] = [];
      if (!lookup[tk].some(e => e.antdPattern === antdRaw)) lookup[tk].push(entry);
    }
  }

  return lookup;
}

function extractEviewName(eviewRaw) {
  const startMatch = eviewRaw.match(/^([A-Z][A-Za-z0-9]+)/);
  if (startMatch) return startMatch[1];
  if (eviewRaw.includes('手写')) return '手写';
  const m = eviewRaw.match(/\b([A-Z][A-Za-z0-9]+)\b/);
  return m ? m[1] : null;
}

function determineCategory(eviewName, eviewRaw) {
  if (eviewName === '手写' || !eviewName) return 'B';
  return 'A';
}

function determineImportPath(category, eviewName) {
  if (category === 'B') return null;
  if (SPECIAL_IMPORTS[eviewName]) return SPECIAL_IMPORTS[eviewName];
  if (eviewName) return `@cloudsop/eview-ui/${eviewName}`;
  return null;
}

function determineRef(category, eviewName, keyDiffs) {
  if (category === 'B') {
    const sectionMatch = keyDiffs.match(/§(\d+)/);
    if (sectionMatch) return `handwrite-templates.md §${sectionMatch[1]}`;
    return 'handwrite-templates.md';
  }
  if (SPECIAL_REFS[eviewName]) return SPECIAL_REFS[eviewName];
  if (eviewName) return `components/${eviewName}.md`;
  return null;
}

const lookup = parseMappingTable(mappingText);

// ========== 2. Build migrationPlanEui from antdComponents ==========

const antdComponents = handoff.antdComponents || {};
const migrationPlanEui = [];
const unmatched = [];

// 上游步骤 3 已删除的 antd Provider（不纳入迁移清单）
const SKIP_COMPONENTS = new Set(['ConfigProvider']);

for (const [antdName, files] of Object.entries(antdComponents)) {
  if (SKIP_COMPONENTS.has(antdName)) continue;
  const rows = lookup[antdName] || [];

  if (rows.length === 0) {
    unmatched.push(antdName);
    migrationPlanEui.push({
      antd: antdName,
      category: 'unknown',
      eview: null,
      importPath: null,
      keyDiffs: '未在 antd-to-eview-ui 的 component-mapping.md 中找到映射，需人工评估（可能是低频组件，查 references/components/INDEX.md）',
      ref: null,
      files,
    });
    continue;
  }

  const primaryRow =
    rows.find(r => r.antdPattern === antdName) ||          // 精确 pattern 优先（Dropdown ≠ Dropdown.Button）
    rows.find(r => r.eviewName && r.eviewName !== '手写') || rows[0];

  const allKeyDiffs = rows
    .map(r => (rows.length > 1 ? `[${r.antdPattern}] ${r.keyDiffs}` : r.keyDiffs))
    .join(' | ');

  migrationPlanEui.push({
    antd: antdName,
    category: primaryRow.category,
    eview: primaryRow.eviewName,
    importPath: primaryRow.importPath,
    keyDiffs: allKeyDiffs,
    ref: primaryRow.ref,
    files,
  });
}

// ========== 2b. P 类注入：Icon shim（保留不迁） ==========
// 触发：iconCallSites.callSites 非空（上游 extract-umd.cjs 预扫）
const iconInfo = handoff.iconCallSites;
const iconCallSitesArr = Array.isArray(iconInfo) ? iconInfo : ((iconInfo && iconInfo.callSites) || []);
if (iconCallSitesArr.length) {
  const iconFiles = [...new Set(iconCallSitesArr.map(c => c.file))];
  migrationPlanEui.push({
    antd: 'Icon（源 shim）',
    category: 'P',
    eview: 'Icon（保留源 shim）',
    importPath: '@/shared/Icon',
    keyDiffs: '保留不动——import Icon from "@/shared/Icon" 与 <Icon name="..."> 调用点零改动；禁止改用 eview-ui Icon/SvgIcon（废弃）/IconButton（废弃）；禁止把 Icon shim 塞进 eview-ui 组件的 leftIcon/rightIcon/icon（url 字符串 prop，类型不匹配）；Button 带图标用 children 组合：<Button><Icon name="x" size={14}/>{文字}</Button>。步骤 3 仅 check-imports.cjs 校验路径',
    ref: null,
    files: iconFiles,
  });
  console.log(`[build-migration-plan(eui)] 注入 Icon 保留行（P 类）: ${iconFiles.length} 个调用文件`);
}

// ========== 2c. P 类注入：Chart（保留不迁） ==========
// 触发：chartCallSites.callSites 非空
const chartInfo = handoff.chartCallSites;
if (chartInfo && chartInfo.callSites && chartInfo.callSites.length) {
  const chartFiles = [...new Set(chartInfo.callSites.map(c => c.file))];
  migrationPlanEui.push({
    antd: 'Chart（源封装）',
    category: 'P',
    eview: 'Chart（保留源封装）',
    importPath: null,
    keyDiffs: '保留不动——eview-ui 无 Chart 组件，源项目 chart.jsx 封装及其 import 原样保留；不需要补 a2ui: true / theme（eview-ui 无此约束，勿凭空添加）；暗色下图表主题跟随由源项目逻辑自理',
    ref: null,
    files: chartFiles,
  });
  console.log(`[build-migration-plan(eui)] 注入 Chart 保留行（P 类）: ${chartFiles.length} 个调用文件`);
}

// ========== 2d. A 类注入：ict-coder IpInput 手写件 → eview-ui IPInput ==========
// 触发：ipInputCallSites.callSites 非空
const ipInputInfo = handoff.ipInputCallSites;
if (ipInputInfo && ipInputInfo.callSites && ipInputInfo.callSites.length) {
  const ipFiles = [...new Set(ipInputInfo.callSites.map(c => c.file))];
  const ipSharedFiles = ipInputInfo.sharedFiles || [];
  migrationPlanEui.push({
    antd: 'IpInput',
    category: 'A',
    eview: 'IPInput',
    importPath: '@cloudsop/eview-ui/IPInput',
    keyDiffs: 'ict-coder 手写 IPInput 共享件迁移到 eview-ui/IPInput：① 删除手写共享件（' + (ipSharedFiles.join(', ') || '见上游 sharedFiles') + '），import 改 import IPInput from "@cloudsop/eview-ui/IPInput"；② type 值：源 "ipv4"→"v4"、"ipv6"→"v6"、"mac" 不变；③ onChange(value, event) 首参是完整字符串（如 "192.168.1.1"），不要拆数组；④ tip 样式 prop 是 tipStyle（IPInput）/tipProps（IPAddress，不要混用）；⑤ ref 有 getValue()/validator(value)=>{result,message}；⑥ IPAddress 是同功能新版（onChange(value) 单参），二选一勿混用',
    ref: 'components/IPInput.md',
    files: ipFiles,
    sharedFilesToRemove: ipSharedFiles,
  });
  console.log(`[build-migration-plan(eui)] 注入 IpInput 迁移行（→ eview-ui/IPInput）: ${ipFiles.length} 个调用文件`);
}

// ========== 3. globalRefEui（三张速查表内联，省下游读表） ==========

const globalRefEui = {
  spellingAnomalies: [
    { eview: 'seprator', correct: 'separator', component: 'Crumbs（另有 sepratorStyle）' },
    { eview: 'disable', correct: 'disabled', component: 'SelectCard、FileUpload、Tag(message 型)、PopUpMenu 项、ButtonMenu options 项', note: '仅这些用 disable；Button/TextField/Select/Menu 等仍用 disabled，勿全局替换' },
    { eview: 'placeHolder', correct: 'placeholder', component: 'FileUpload、BrowseButton' },
    { eview: 'upLoadErrorMessage/upLoadSuccessMessage', correct: 'uploadErrorMessage/…', component: 'FileUpload' },
    { eview: 'disposeTimeOut', correct: 'disposeTimeout', component: 'TipBox、DivMessage' },
    { eview: 'disabelCheckAssociated', correct: 'disableCheckAssociated', component: 'TablePro selection、Tree、TreeTable' },
    { eview: 'enableMulitiExpand', correct: 'enableMultiExpand', component: 'Table' },
    { eview: 'onRowExpend/expandedRow', correct: 'onRowExpand/…', component: 'Table' },
    { eview: 'mutiSelectEnable', correct: 'multiSelectEnable', component: 'JList、TreeTable' },
    { eview: 'enablHorzScroll', correct: 'enableHorzScroll', component: 'Select、InputSelect、Popup' },
    { eview: 'minimizModalEnable', correct: 'minimizeModalEnable', component: 'Dialog' },
  ],
  antdToEviewRenames: [
    { antd: 'type(primary/danger)', eview: 'status(primary/risk)', component: 'Button' },
    { antd: 'children 文字', eview: 'text', component: 'Button/TextButton/DivMessage/LabelField' },
    { antd: 'Select', eview: 'SelectPro（mode single/singleSearch/multiple/multiSearch；placeholder 同名保留——defaultLabel 是旧 Select 的，不用）', component: 'SelectPro' },
    { antd: 'checked', eview: 'toggled', component: 'Toggle' },
    { antd: 'onChange', eview: 'onToggle', component: 'Toggle' },
    { antd: 'count', eview: 'starCount', component: 'Rating' },
    { antd: 'percent', eview: 'current', component: 'ProgressBar' },
    { antd: 'title(tooltip 内容)', eview: 'content', component: 'Tooltip' },
    { antd: 'picker', eview: 'type', component: 'DatePicker' },
    { antd: 'value(dayjs)', eview: 'time(数字数组[时,分,秒])', component: 'TimePicker' },
    { antd: 'current(下标)', eview: 'currentStep(对应 data[].value)', component: 'Wizards(Steps)' },
    { antd: 'activeKey', eview: 'selectedIndex(数字下标)', component: 'Tab' },
    { antd: 'items', eview: 'data', component: 'SelectCard/CheckboxGroup/RadioGroup/Wizards/Accordion' },
    { antd: 'options 的 label', eview: 'text', component: 'SelectPro 系全部' },
    { antd: 'dataSource', eview: 'dataset', component: 'TablePro(Table)' },
    { antd: 'total', eview: 'recordCount', component: 'Paging' },
    { antd: 'spinning', eview: 'isOpen', component: 'Loader' },
    { antd: 'footer(ReactNode)', eview: '自写(children 底部排 Button——DialogPro 无 buttons prop)', component: 'DialogPro(Modal)' },
    { antd: 'open', eview: 'isOpen(DialogPro) / visible(Drawer) / display(DivMessage)', component: '弹层系（不统一，查 visibilityProps）' },
    { antd: 'destroyOnClose(默认false)', eview: 'destroyOnClose(默认true)', component: 'DialogPro/MessageDialogPro' },
    { antd: 'indicator(size)', eview: 'type(global/local/micro)', component: 'Loader' },
  ],
  callbackSignatures: [
    { component: 'TextField/TextArea/HexField', signature: 'onChange(value1, value2, event)', note: '新值/旧值/事件，首参是值' },
    { component: 'SelectPro', signature: 'onChange(value, options)', note: '两参；options 是选中项对象/数组（labelInValue 替代）。搜索模式 onInputChange 必填' },
    { component: 'MultipleSelect', signature: 'onChange(value[], changeValue[], event)' },
    { component: 'InputSelect', signature: 'onChange(value, oldValue)' },
    { component: 'Checkbox', signature: 'onChange(value, checked, event, additionalData)', note: '四参' },
    { component: 'CheckboxGroup', signature: 'onChange(newValue[], oldValue[], event)' },
    { component: 'Radio', signature: 'onChange(value, event)' },
    { component: 'RadioGroup', signature: 'onChange(value, oldValue, event)' },
    { component: 'SelectCard', signature: 'onChange(value, event)', note: '首参即选中值' },
    { component: 'Toggle', signature: 'onToggle(value)', note: '事件名也变了' },
    { component: 'Spinner', signature: 'onChange(value) 仅有效值；onError(value) 无效值；onBlur(value)——参数是值不是事件' },
    { component: 'SearchInput', signature: 'onSearch(value)', note: '值变化也触发，需防抖' },
    { component: 'Rating', signature: 'onClick(event, value)', note: 'event 在前！且事件名是 onClick' },
    { component: 'DatePicker', signature: 'onChange(date, {moment, isDst, unix, utcTime})' },
    { component: 'TimePicker', signature: 'onChange(time: number[])' },
    { component: 'IPInput', signature: 'onChange(value, event)；IPAddress onChange(value) 单参' },
    { component: 'CategorySearch', signature: 'onSearch(category, value)；onClear(oldValue, newValue)——old 在前' },
    { component: 'FileUpload', signature: 'onChange(event, itemList)——event 在前；onReload({event, data})' },
    { component: 'Table', signature: 'onRowClick(row, e)；onRowRightClick(e, row)——右键事件在前；onColumnSort(sortColumn, sortType)' },
    { component: 'TablePro', signature: 'onChange(currentDataset, changeEvent)——分页/排序/筛选统一' },
    { component: 'Tab', signature: 'onClick(index, title, event)', note: '不是 onChange；index 是下标' },
    { component: 'Panel', signature: 'onExpand(selectedIndex, event)——下标' },
    { component: 'Tree', signature: 'onSelect(selectedKeys, node, event)；onCheck(checkedKeys, node)；onExpand 必须接' },
    { component: 'Popup', signature: 'onItemClick(item, e)——item 是数据项' },
    { component: 'PopUpMenu', signature: 'onClick({text, value, clickItem})' },
    { component: 'ButtonMenu', signature: 'onClick(value, event)' },
    { component: 'Crumbs', signature: 'onClick(url, event)——组件级非每项' },
    { component: 'DialogPro/MessageDialogPro', signature: 'onClose(event) 不自动关闭', note: '必须自己 setIsOpen(false)' },
    { component: 'Drawer', signature: 'onClose(event?: {type: ok/cancel/mask}) 不自动关闭' },
    { component: 'Paging', signature: 'onPageChange(currentPage)；onPageSizeChange(pageSize)', note: 'antd onChange(page, pageSize) 拆两个' },
  ],
  visibilityProps: {
    isOpen: ['DialogPro', 'MessageDialogPro', 'PopUpMenu(废弃)', 'Loader'],
    visible: ['Drawer', 'Tooltip', 'Dropdown'],
    display: ['Popup', 'TipBox(默认 true)', 'DivMessage(默认 true)', 'LinkField(默认 true)'],
    iconDisplay: ['HelpTip(默认 true)'],
    isShow: ['Shade(默认 true)'],
    none: ['PopConfirm(内部管理)', 'PageMessage', 'FormMessage(父级条件渲染)'],
    notes: '所有弹层 onClose 均不自动关闭；DialogPro/MessageDialogPro 的 destroyOnClose 默认 true（antd 默认 false）；Pro 优先：Select→SelectPro、Table→TablePro、Modal→DialogPro、Modal.confirm→MessageDialogPro、Form→FormPro，旧版导入即违规',
  },
};

// ========== 4. Write back（独立字段，不动上游已有字段） ==========

handoff.migrationPlanEui = migrationPlanEui;
handoff.globalRefEui = globalRefEui;

fs.writeFileSync(handoffPath, JSON.stringify(handoff, null, 2) + '\n', 'utf8');

// ========== Report ==========

const catCounts = {};
for (const e of migrationPlanEui) {
  catCounts[e.category] = (catCounts[e.category] || 0) + 1;
}

console.log('');
console.log('=== build-migration-plan(eview-ui) 报告 ===');
console.log(`  组件总数: ${migrationPlanEui.length}`);
console.log(`  分类: A(有对应)=${catCounts.A || 0}, B(无对应手写)=${catCounts.B || 0}, P(保留不迁)=${catCounts.P || 0}, unknown=${catCounts.unknown || 0}`);
if (unmatched.length) {
  console.log(`  未匹配: ${unmatched.join(', ')}`);
}
console.log(`  globalRefEui: ${globalRefEui.spellingAnomalies.length} 条拼写异常, ${globalRefEui.callbackSignatures.length} 条回调签名, 显隐速查 6 组`);
console.log(`  写入字段: migrationPlanEui + globalRefEui（未动上游 migrationPlan/globalRef）`);
console.log(`  交接文件: ${handoffPath}`);
