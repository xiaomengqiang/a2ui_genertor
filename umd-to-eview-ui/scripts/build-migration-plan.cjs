#!/usr/bin/env node

// build-migration-plan.cjs — 本 skill（umd-to-eview-ui）步骤 5 的自动化脚本
// 读 .umd-conversion.json（antdComponents）+ 各组件文档的「antd 迁移注意事项」区块：
//   - references/components/<Name>.md 的 `## antd 迁移注意事项` 三列表（antd 写法/eview 写法/迁移要点）→ A 类
//   - references/handwrite-templates.md 的 `## antd → 手写模板索引` 表（antd 写法/模板 §N/迁移要点）→ B 类
// 生成 migrationPlanEui（分类 A/B/P + importPath + keyDiffs + ref）+ globalRefEui
// （拼写异常 + 回调签名 + 显隐 prop 三张速查表，内联省后续步骤读表——人读版在 components/INDEX.md 文末）
// + importRewrites（逐文件导入改写清单：addImports/deleteOnlyNames/compoundFlags，供步骤 7 子 agent 照单应用）。
// 写回 .umd-conversion.json 的独立字段。
//
// 类别说明：
//   A = 有对应（改导入 + props，注意事项见各组件 md）
//   B = 无对应（handwrite-templates.md 手写，索引表在其头部）
//   P = 特殊处理（Icon 调用点转 @/shared/SvgIcon——由下方 2b 按计数注入，与 md 无关）；
//   Chart 走 A 类（→ @nce/eview-react/Chart，由下方 2c 按计数注入 + sharedFilesToRemove，与 md 无关）
//
// 区块标记：组件 md 注意事项区块内 `> 迁移分类：A`（缺省 A）；Icon.md 标 P（跳过解析）。
// 导入特例（SPECIAL_IMPORTS）与 ref 特例（SPECIAL_REFS）维持脚本内硬编码。
//
// 用法：
//   node build-migration-plan.cjs <target-project-root>

const fs = require('fs');
const path = require('path');

const targetRoot = process.argv[2];
if (!targetRoot) {
  console.error('[build-migration-plan(eui)] 用法: node build-migration-plan.cjs <target-project-root>');
  process.exit(1);
}

const skillDir = path.resolve(__dirname, '..');
const compDir = path.join(skillDir, 'references', 'components');
const hwPath = path.join(skillDir, 'references', 'handwrite-templates.md');

const handoffPath = path.join(targetRoot, '.umd-conversion.json');
if (!fs.existsSync(handoffPath)) {
  console.error(`[build-migration-plan(eui)] 找不到 .umd-conversion.json: ${handoffPath}——需先跑本 skill 步骤 2（extract-umd.cjs）生成`);
  process.exit(1);
}
if (!fs.existsSync(compDir)) {
  console.error(`[build-migration-plan(eui)] 找不到组件文档目录: ${compDir}`);
  process.exit(1);
}
if (!fs.existsSync(hwPath)) {
  console.error(`[build-migration-plan(eui)] 找不到 handwrite-templates.md: ${hwPath}`);
  process.exit(1);
}

const handoff = JSON.parse(fs.readFileSync(handoffPath, 'utf8').replace(/^\uFEFF/, ''));

// 导入特例（原 component-mapping.md「导入规范」小节）——按 eview 组件名查
const SPECIAL_IMPORTS = {
  Tab: 'import Tab, { TabItem } from "@cloudsop/eview-ui/Tab"（TabItem 具名导出）',
  Panel: 'import PanelE from "@cloudsop/eview-ui/Panel"; const { Panel, PanelItem } = PanelE;（必须解构，默认导出不是 Panel 本身）',
  Row: 'import { Row, Col } from "@cloudsop/eview-ui/GridLayout"（具名导出）',
  Col: 'import { Row, Col } from "@cloudsop/eview-ui/GridLayout"（具名导出）',
  GridLayout: 'import { Row, Col } from "@cloudsop/eview-ui/GridLayout"（具名导出）',
  RangePicker: 'import DatePicker from "@cloudsop/eview-ui/DatePicker"; const { RangePicker } = DatePicker;（RangePicker 是 DatePicker 静态属性，<DatePicker.RangePicker> 改 <RangePicker>）',
};

// ref 特例：文档文件名 ≠ 组件名
const SPECIAL_REFS = {
  RangePicker: 'components/DatePicker.md',
};

// ========== 1. 解析数据源 → lookup 表 ==========

// antd 名 token 提取（同旧 parseMappingTable 逻辑 + '/' 别名修复：成员名行如
// "Radio.Button / Segmented" 此前只注册成员段漏了别名段，现补齐）：
//  - head：去掉中文括号注释后的前缀（"Row / Col（GridLayout）" → "Row / Col"）
//  - seg：head 首词（"Button type=..." → "Button"）
//  - "." 成员名（Dropdown.Button / DatePicker.RangePicker）：注册全名 + 基名
//  - "/" 别名（Row / Col、Layout/Header/Sider/Content、Tabs / TabPane）：逐段注册
function extractAntdTokens(antdRaw) {
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
  // 别名修复：成员名行含 '/' 时，'/' 段也注册（"Radio.Button / Segmented" → 补 Segmented）
  if (head.includes('/') && seg.includes('.')) {
    for (const alias of head.split(/\//).map(t => t.trim().split(/\s+/)[0]).filter(t => /^[A-Z]/.test(t))) {
      if (!tokens.includes(alias)) tokens.push(alias);
    }
  }
  return tokens;
}

function extractEviewName(eviewRaw) {
  const startMatch = eviewRaw.match(/^([A-Z][A-Za-z0-9]+)/);
  if (startMatch) return startMatch[1];
  if (eviewRaw.includes('手写')) return '手写';
  const m = eviewRaw.match(/\b([A-Z][A-Za-z0-9]+)\b/);
  return m ? m[1] : null;
}

// 提取 md 中 `## <title>` 区块的行（到下一个 ## 标题为止）
function sliceSectionLines(mdText, sectionTitle) {
  const lines = mdText.split('\n');
  const start = lines.findIndex(l => l.trim() === `## ${sectionTitle}`);
  if (start < 0) return null;
  const out = [];
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].startsWith('## ')) break;
    out.push(lines[i]);
  }
  return out;
}

// 三列表格行 → cells（去反引号，同旧解析器）
function parseTableRow(line) {
  const t = line.trim();
  if (!t.startsWith('|')) return null;
  if (/^[\s|:-]+$/.test(t)) return null;
  const cells = t.split('|').slice(1, -1).map(c => c.trim());
  if (cells.length < 3) return null;
  return cells.map(c => c.replace(/`/g, '').trim());
}

function buildLookup() {
  const lookup = {};
  const register = (entry) => {
    const tokens = extractAntdTokens(entry.antdPattern);
    if (tokens.length === 0 || !/^[A-Z]/.test(tokens[0])) return; // 小写 antd 名（message.success 等）不注册
    for (const tk of tokens) {
      if (!lookup[tk]) lookup[tk] = [];
      if (!lookup[tk].some(e => e.antdPattern === entry.antdPattern)) lookup[tk].push(entry);
    }
  };

  // ---- 1a. 组件 md 的「antd 迁移注意事项」区块（A 类） ----
  const skippedP = [];
  for (const name of fs.readdirSync(compDir).sort()) {
    if (!name.endsWith('.md')) continue;
    if (name === 'INDEX.md' || name === 'performanceDesc.md') continue;
    const md = fs.readFileSync(path.join(compDir, name), 'utf8').replace(/^\uFEFF/, '');
    const secLines = sliceSectionLines(md, 'antd 迁移注意事项');
    if (!secLines) continue;
    const marker = secLines.find(l => l.trim().startsWith('>'));
    const catMatch = marker && marker.match(/迁移分类[：:]\s*(A|B|P)/);
    const category = catMatch ? catMatch[1] : 'A';
    if (category === 'P') { skippedP.push(name); continue; }
    for (const line of secLines) {
      const cells = parseTableRow(line);
      if (!cells) continue;
      const [antdRaw, eviewRaw, keyDiffs] = cells;
      if (!antdRaw || /^[-]+$/.test(antdRaw)) continue;
      const eviewName = extractEviewName(eviewRaw);
      if (!eviewName) continue;
      register({
        antdPattern: antdRaw,
        eviewRaw,
        eviewName,
        category: 'A',
        importPath: SPECIAL_IMPORTS[eviewName] || `@cloudsop/eview-ui/${eviewName}`,
        ref: SPECIAL_REFS[eviewName] || `components/${name}`,
        keyDiffs,
      });
    }
  }
  if (skippedP.length) console.log(`[build-migration-plan(eui)] P 类区块跳过（保留不迁）: ${skippedP.join(', ')}`);

  // ---- 1b. handwrite-templates.md 的「antd → 手写模板索引」表（B 类） ----
  const hwMd = fs.readFileSync(hwPath, 'utf8').replace(/^\uFEFF/, '');
  const hwLines = sliceSectionLines(hwMd, 'antd → 手写模板索引');
  if (!hwLines) {
    console.error('[build-migration-plan(eui)] handwrite-templates.md 缺少「## antd → 手写模板索引」区块');
    process.exit(1);
  }
  let bCount = 0;
  for (const line of hwLines) {
    const cells = parseTableRow(line);
    if (!cells) continue;
    const [antdRaw, templateCell, keyDiffs] = cells;
    if (!antdRaw || /^[-]+$/.test(antdRaw)) continue;
    const secMatch = templateCell.match(/§(\d+)/);
    register({
      antdPattern: antdRaw,
      eviewRaw: '手写',
      eviewName: '手写',
      category: 'B',
      importPath: null,
      ref: secMatch ? `handwrite-templates.md §${secMatch[1]}` : 'handwrite-templates.md',
      keyDiffs,
    });
    bCount++;
  }
  console.log(`[build-migration-plan(eui)] 解析: 组件 md A 类区块 + handwrite B 类索引（${bCount} 行）`);
  return lookup;
}

const lookup = buildLookup();

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
      keyDiffs: '未在本 skill 的组件映射（components/*.md 的「antd 迁移注意事项」+ handwrite-templates.md 索引）中找到，需人工评估（可能是低频组件，查 references/components/INDEX.md）',
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

// ========== 2b. P 类注入：Icon 调用点（转 @/shared/SvgIcon） ==========
// 触发：iconCallSites 非空（上游 extract-umd.cjs 预扫，含 tagText 供 step 7 改写）
const iconInfo = handoff.iconCallSites;
const iconCallSitesArr = Array.isArray(iconInfo) ? iconInfo : ((iconInfo && iconInfo.callSites) || []);
if (iconCallSitesArr.length) {
  const iconFiles = [...new Set(iconCallSitesArr.map(c => c.file))];
  migrationPlanEui.push({
    antd: 'Icon（源调用点）',
    category: 'P',
    eview: 'SvgIcon（@/shared/SvgIcon）',
    importPath: '@/shared/SvgIcon',
    keyDiffs: '源 <Icon name="x" size color/> 转换为 @/shared/SvgIcon：① prop 改名 name→src（<SvgIcon src={name} size={n} color={...}/>）；② interactiveProps 搬迁——读 iconCallSites[].tagText 逐 prop（onClick/title/aria-*/role/tabIndex/style/className/id/data-*）原样透传到 <SvgIcon>；③ ReactNode 型 icon prop 位（Menu.SubMenu.icon / Menu.MenuItem.icon / PopUpMenu.icon / 独立 <Icon> 调用点）直接传 <SvgIcon src={name} .../>；④ string 型 icon prop 位（leftIcon/rightIcon/icon/iconUrl/iconLeaf/options[].icon 等收图片路径/base64 的 prop）用 getIconBase64(src,{color,size}) 异步取 base64 data URL 传入（useEffect+useState 预载，不可同步赋值）；⑤ type 默认 lined（可选 filled/lined-twotone/filled-twotone/round-bg/square-bg），color 经 transform 烘焙进 SVG；⑥ 禁 eview-ui/Icon、eview-ui/SvgIcon、eview-ui/svg-icons、eview-ui/IconButton、@/shared/Icon。方法见 components/Icon.md',
    ref: null,
    files: iconFiles,
  });
  console.log(`[build-migration-plan(eui)] 注入 Icon 转换行（P 类→@/shared/SvgIcon）: ${iconFiles.length} 个调用文件`);
}

// ========== 2c. A 类注入：ict-coder Chart 共享件 → @nce/eview-react/Chart ==========
// 触发：chartCallSites.callSites 非空（源 assets/shared/chart.jsx 套壳 → @nce/eview-react/Chart）
const chartInfo = handoff.chartCallSites;
if (chartInfo && chartInfo.callSites && chartInfo.callSites.length) {
  const chartFiles = [...new Set(chartInfo.callSites.map(c => c.file))];
  const chartSharedFiles = chartInfo.sharedFiles || [];
  migrationPlanEui.push({
    antd: 'Chart',
    category: 'A',
    eview: 'Chart',
    importPath: '@nce/eview-react/Chart',
    keyDiffs: 'ict-coder 手写 Chart 共享件迁移到 @nce/eview-react/Chart：① 删除手写共享件（' + (chartSharedFiles.join(', ') || '见上游 sharedFiles') + '），import 改 import Chart from "@nce/eview-react/Chart"；② 源 Chart 套壳在 setSimpleOption 前自动注入 { theme, a2ui: true } + watch <html>.dark 自动 re-render，改包导入后自动行为整体丢失——每个 <Chart option> 必须显式补 a2ui: true 与 theme（禁止残留 setSimpleOption(）；③ theme 从全局暗色派生：theme: isDark ? "hdesign-dark" : "hdesign-light"（isDark 来自 useApp()——context.jsx 的 AppProvider，步骤 3 已保留；禁止写静态字符串），推荐 const chartBase = { a2ui: true, theme: isDark ? "hdesign-dark" : "hdesign-light" } 聚合后展开进各 option；④ onChartRendered(chart) 的 chart 参数即底层 echarts 实例，直接 chart.on("click",...) / chart.setOption(...)，禁止在回调内再调 chart.getEchartsInstance()（该方法只在组件 ref 上：chartRef.current.getEchartsInstance()）；⑤ name 指定图表类型（BarChart/LineChart/PieChart/GaugeChart 等），option 原样透传给 HUI Charts；⑥ 这里的 hdesign-dark/hdesign-light 是 HUI Charts 图表 option 主题名，与 ConfigProvider theme（evening/lightday）是两套主题系统，勿混用。方法见 components/Chart.md（硬约束 9 + 步骤 8 check-chart-options.cjs 机器验证）',
    ref: 'components/Chart.md',
    files: chartFiles,
    sharedFilesToRemove: chartSharedFiles,
  });
  console.log(`[build-migration-plan(eui)] 注入 Chart 迁移行（A 类→ @nce/eview-react/Chart）: ${chartFiles.length} 个调用文件`);
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

// ========== 2e. importRewrites：逐文件导入改写清单（供步骤 7 子 agent 照单应用） ==========
// 解决「子 agent 漏拆花括号 import / 漏重命名 JSX / 漏删 B 类 antd 导入」：机器给逐文件该加哪些默认导入、
// 该删哪些名（B 类手写不需 eview-ui 导入）、哪些 compound（按 import 名定不了子用法，只 flag）。
// 数据源：antdComponents（name→files，extract-umd 已填）+ icon/chart/ipInput 文件集。
// compound 名（Input/Checkbox/Radio/Modal/DatePicker/Tabs/Collapse/Menu）按 import 名定不了实际子用法
// （如 <Input.TextArea> 要 TextArea 非 Input 的 TextField），不入 addImports，入 compoundFlags 让子 agent
// 按实际 JSX 用法 + references/component-mapping.md 成员拆解行定。

const COMPOUND_ANTD = new Set(['Input', 'Checkbox', 'Radio', 'Modal', 'DatePicker', 'Tabs', 'TabPane', 'Collapse', 'Menu']);

// 反转 antdComponents → file → [antdName,...]
const fileToAntdNames = {};
for (const [antdName, files] of Object.entries(antdComponents)) {
  if (SKIP_COMPONENTS.has(antdName)) continue;
  for (const f of files) {
    (fileToAntdNames[f] = fileToAntdNames[f] || []).push(antdName);
  }
}

// icon/chart/ipInput 文件集（这些文件可能无 antd 组件导入，但仍需改写 @ant-design/icons / 加 SvgIcon/Chart/IPInput）
const iconFiles = new Set(iconCallSitesArr.map(c => c.file));
const chartFilesSet = new Set(chartInfo && chartInfo.callSites ? chartInfo.callSites.map(c => c.file) : []);
const ipInputFilesSet = new Set(ipInputInfo && ipInputInfo.callSites ? ipInputInfo.callSites.map(c => c.file) : []);

// migrationPlanEui 按 antd 名建索引（取首个匹配行；compound 名的 primary 行已在 §2 选定）
const planByAntd = {};
for (const row of migrationPlanEui) {
  if (row.antd && !planByAntd[row.antd]) planByAntd[row.antd] = row;
}

const importRewrites = [];
const allFiles = new Set([
  ...Object.keys(fileToAntdNames),
  ...iconFiles,
  ...chartFilesSet,
  ...ipInputFilesSet,
]);
for (const file of allFiles) {
  const addImportsMap = {}; // eview -> importPath（去重）
  const deleteOnlyNames = [];
  const compoundFlags = [];
  const unknownNames = [];

  for (const antdName of (fileToAntdNames[file] || [])) {
    if (COMPOUND_ANTD.has(antdName)) {
      compoundFlags.push({
        antd: antdName,
        reason: 'compound：按文件实际 JSX 子用法查 references/component-mapping.md 成员拆解行定导入（如 <Input.TextArea>→TextArea，非 Input 的 TextField）',
      });
      continue;
    }
    const row = planByAntd[antdName];
    if (!row || row.category === 'unknown') {
      unknownNames.push(antdName);
      continue;
    }
    if (row.category === 'B') {
      deleteOnlyNames.push(antdName); // 手写件不需 eview-ui 导入，ant 导入整行删
      continue;
    }
    // A / P 类叶子
    if (row.importPath && row.eview && row.eview !== '手写') {
      addImportsMap[row.eview] = row.importPath;
    }
  }

  // icon 文件：加 SvgIcon + 标记删 @ant-design/icons
  let removeIconsImport = false;
  if (iconFiles.has(file)) {
    addImportsMap['SvgIcon'] = '@/shared/SvgIcon';
    removeIconsImport = true;
  }
  // chart 文件：加 Chart（本 skill 唯一 @nce/eview-react 包导入）
  if (chartFilesSet.has(file)) {
    addImportsMap['Chart'] = '@nce/eview-react/Chart';
  }
  // ipInput 文件：加 IPInput
  if (ipInputFilesSet.has(file)) {
    addImportsMap['IPInput'] = '@cloudsop/eview-ui/IPInput';
  }

  const addImports = Object.entries(addImportsMap).map(([eview, importPath]) => ({ eview, importPath }));

  importRewrites.push({
    file,
    addImports,
    deleteOnlyNames,
    compoundFlags,
    unknownNames,
    removeIconsImport,
  });
}

console.log(`[build-migration-plan(eui)] importRewrites：${importRewrites.length} 个文件（A 类 addImports / B 类 deleteOnly / compound flags / icon-chart-ipInput 注入）`);

// ========== 3. globalRefEui（三张速查表内联，省下游读表；人读版在 components/INDEX.md 文末） ==========

const globalRefEui = {
  spellingAnomalies: [
    { eview: 'seprator', correct: 'separator', component: 'Crumbs（另有 sepratorStyle）' },
    { eview: 'disable', correct: 'disabled', component: 'SelectCard、FileUpload、PopUpMenu 项、ButtonMenu options 项', note: '仅这些用 disable；Button/TextField/Select/Menu/Tag 等仍用 disabled，勿全局替换' },
    { eview: 'placeHolder', correct: 'placeholder', component: 'FileUpload、BrowseButton' },
    { eview: 'upLoadErrorMessage/upLoadSuccessMessage', correct: 'uploadErrorMessage/…', component: 'FileUpload' },
    { eview: 'disposeTimeOut', correct: 'disposeTimeout', component: 'DivMessage' },
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
    display: ['Popup', 'DivMessage(默认 true)', 'LinkField(默认 true)'],
    iconDisplay: ['HelpTip(默认 true)'],
    isShow: ['Shade(默认 true)'],
    none: ['PopConfirm(内部管理)', 'PageMessage', 'FormMessage(父级条件渲染)'],
    notes: '所有弹层 onClose 均不自动关闭；DialogPro/MessageDialogPro 的 destroyOnClose 默认 true（antd 默认 false）；Pro 优先：Select→SelectPro、Table→TablePro、Modal→DialogPro、Modal.confirm→MessageDialogPro、Form→FormPro，旧版导入即违规',
  },
};

// ========== 4. Write back（独立字段，不动上游已有字段） ==========

handoff.migrationPlanEui = migrationPlanEui;
handoff.globalRefEui = globalRefEui;
handoff.importRewrites = importRewrites;

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
console.log(`  importRewrites: ${importRewrites.length} 个文件（逐文件导入改写清单：addImports/deleteOnlyNames/compoundFlags）`);
console.log(`  写入字段: migrationPlanEui + globalRefEui + importRewrites`);
console.log(`  交接文件: ${handoffPath}`);
