#!/usr/bin/env node
/**
 * check-divmessage.cjs — DivMessage type 枚举 + 命令式 message 残留检查（硬 FAIL）
 *
 * 对应 component-mapping.md message 行 + components/DivMessage.md §2.5 / §4。
 * antd `message.*()` 命令式 → eview-react 渲染式 `<DivMessage display type=...>`。
 * DivMessage 的 `type` 枚举仅 `default/success/error/warn`——**无 `info`/`warning`**：
 *   - message.info()    → type="default"（不是 info）
 *   - message.success() → type="success"
 *   - message.error()   → type="error"
 *   - message.warning()/warn() → type="warn"
 *   - message.loading() → type="default" + enableDisposeTimeOut={false}（或用 Loading）
 *
 * 为什么需要本脚本：步骤 2 LLM 常犯两类错——① message.info() 臆造 type="info"
 * （DivMessage 无 info 枚举，应是 default）；② 漏转命令式 message.xxx() 调用（应改为
 * setNotice + <DivMessage>）。本脚本做机器兜底。
 *
 * 检查项（硬 FAIL，exit 1）：
 *   INVALID_TYPE              <DivMessage type="X"> 的 X 不在 {default,success,error,warn}
 *                             ——仅检 StringLiteral 字面量；表达式/变量/三元等动态值静态无法判定，跳过
 *   IMPERATIVE_MESSAGE_RESIDUE  残留命令式 `message.info(`/`message.success(`/... 调用
 *                             ——callee 为 `message.<method>(`，method ∈
 *                             {info,success,error,warning,warn,open,loading,destroy}；
 *                             这些是 antd message 的方法名，迁移后应已转为 <DivMessage>
 *
 * 用法：
 *   node check-divmessage.cjs <目标工程根>
 *
 * AST（@babel/parser）精准定位，与字段残留类 check 共用 lib/ast-helpers.cjs。
 * 退出码：0=通过，1=硬 FAIL，2=用法错误/无解析器。
 */
'use strict';

const fs = require('fs');
const path = require('path');
const H = require('./lib/ast-helpers.cjs');

const EXTS = new Set(['.js', '.jsx', '.ts', '.tsx']);

// DivMessage type 合法枚举
const VALID_TYPES = new Set(['default', 'success', 'error', 'warn']);
// antd message 的命令式方法名（残留即未转 DivMessage）
const MESSAGE_METHODS = new Set([
  'info', 'success', 'error', 'warning', 'warn', 'open', 'loading', 'destroy',
]);

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

// 粗筛：文件无 DivMessage / message. 字样则跳过（省解析）
function maybeHas(raw) {
  return /<DivMessage\b/.test(raw) || /\bmessage\s*\.\s*(info|success|error|warning|warn|open|loading|destroy)\s*\(/.test(raw);
}

function main() {
  const args = process.argv.slice(2);
  const rootIdx = args.findIndex((a) => !a.startsWith('--'));
  const root = rootIdx >= 0 ? path.resolve(args[rootIdx]) : process.cwd();
  const srcDir = path.join(root, 'src');
  if (!fs.existsSync(srcDir)) {
    console.error(`[check-divmessage] 找不到 ${srcDir}，用法: node check-divmessage.cjs <目标工程根>`);
    process.exit(2);
  }

  const parser = H.loadParser(root);
  if (!parser) {
    console.error('[check-divmessage] 未找到 @babel/parser。目标工程跑 npm install 后重试'
      + '（@vitejs/plugin-react 已含其为传递依赖）。');
    process.exit(2);
  }

  const files = walk(srcDir, []);
  const fails = [];
  const seen = new Set(); // 去重 file:line:code
  const parseWarnings = [];

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    if (!maybeHas(raw)) continue;
    const rel = path.relative(root, file);

    const parsed = H.parse(parser, raw);
    if (parsed.error) {
      parseWarnings.push(`${rel}: ${parsed.error.message}`);
      continue;
    }
    const ast = parsed.ast;

    // 1. <DivMessage type="X"> 字面量类型校验
    const divEls = H.findJsxElements(ast, ['DivMessage']);
    for (const { el } of divEls) {
      const typeExpr = H.getAttrExpr(el, 'type');
      if (!typeExpr) continue; // 未传 type（默认 default），跳过
      // 仅检 StringLiteral；JSXExpressionContainer 里是表达式/变量/三元等动态值，静态无法判定
      let literalValue = null;
      if (typeExpr.type === 'StringLiteral') literalValue = typeExpr.value;
      else if (typeExpr.type === 'JSXStringLiteral') literalValue = typeExpr.value;
      if (literalValue === null) continue; // 动态值，跳过
      if (VALID_TYPES.has(literalValue)) continue; // 合法枚举
      const line = (typeExpr.loc && typeExpr.loc.start) ? typeExpr.loc.start.line
        : (el.loc && el.loc.start) ? el.loc.start.line : 0;
      const dk = `${rel}:${line}:INVALID_TYPE`;
      if (seen.has(dk)) continue;
      seen.add(dk);
      fails.push({ file: rel, line, code: 'INVALID_TYPE',
        detail: `<DivMessage type="${literalValue}">——type 枚举仅 default/success/error/warn，无 "${literalValue}"。message.info()→type="default"（不是 info）、message.warning()→type="warn"（不是 warning）。见 component-mapping.md message 行 + DivMessage.md §2.5` });
    }

    // 2. 残留命令式 message.xxx() 调用
    H.walk(ast, (n) => {
      if (n.type !== 'CallExpression') return;
      const callee = n.callee;
      if (!callee || callee.type !== 'MemberExpression') return;
      if (!callee.object || callee.object.type !== 'Identifier' || callee.object.name !== 'message') return;
      if (!callee.property || callee.property.type !== 'Identifier') return;
      const method = callee.property.name;
      if (!MESSAGE_METHODS.has(method)) return;
      const line = (callee.loc && callee.loc.start) ? callee.loc.start.line
        : (n.loc && n.loc.start) ? n.loc.start.line : 0;
      const dk = `${rel}:${line}:IMPERATIVE`;
      if (seen.has(dk)) return;
      seen.add(dk);
      const typeMap = {
        info: 'default', success: 'success', error: 'error',
        warning: 'warn', warn: 'warn', open: '按内容 type 拆成 default/success/error/warn',
        loading: 'default + enableDisposeTimeOut={false}（或用 Loading）', destroy: 'setNotice(null) 关闭',
      };
      fails.push({ file: rel, line, code: 'IMPERATIVE_MESSAGE_RESIDUE',
        detail: `残留命令式 \`message.${method}()\`——eview-react 无命令式 API，必须改为渲染式 <DivMessage display type=...>（${method} → type="${typeMap[method]}"）。改写：setNotice({ type, text, key }) + <DivMessage display type={notice.type} text={notice.text} key={notice.key}/>，外层 position:fixed+居中。见 DivMessage.md §2/§2.5` });
    });
  }

  // ---- 报告 ----
  const hitFiles = files.filter((f) => maybeHas(fs.readFileSync(f, 'utf8'))).length;
  console.log('[check-divmessage] DivMessage type 枚举 + 命令式 message 残留检查报告');
  console.log(`  扫描范围: ${srcDir}（${files.length} 个文件，命中粗筛的 ${hitFiles} 个）`);

  if (parseWarnings.length) {
    console.log(`\n【AST 解析告警 — ${parseWarnings.length} 个文件被跳过，请人工复核】`);
    for (const w of parseWarnings) console.log(`  - ${w}`);
  }

  if (fails.length === 0) {
    console.log('\n结论: PASS — 无 DivMessage 非法 type，无命令式 message 残留。');
    process.exit(0);
  }

  console.log(`\n【硬 FAIL】${fails.length} 处：`);
  for (const v of fails) console.log(`  - ${v.file}:${v.line}  [${v.code}] ${v.detail}`);
  console.log('\n  修复指引见 component-mapping.md message 行 + components/DivMessage.md §2/§2.5/§4。');
  process.exit(1);
}

main();
