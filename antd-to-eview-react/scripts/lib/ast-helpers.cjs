'use strict';
/**
 * ast-helpers.cjs — 共享 AST 解析助手（基于 @babel/parser）
 *
 * 供 check-select-options / check-dropdown / check-accordion 等字段残留类检查共用，
 * 解决纯正则方案对 JS 书写习惯覆盖不全的问题（.map 回调 return 对象、Array.from、
 * spread、嵌套、shorthand、计算键等形态，正则会漏扫）。
 *
 * 设计：从某个 prop 表达式节点出发，递归收集其中【所有】ObjectExpression 节点
 * （无论它来自字面量数组 / .map 隐式返回 / .map 块体 return / function 回调 /
 *  Array.from / spread / 条件 / 嵌套），再按属性键判定残留。标识符引用追同文件
 * const/let/var 定义后同样收集。AST 解析天然覆盖各种 JS 语法形态。
 *
 * 依赖：@babel/parser。从目标工程 node_modules 解析（@vitejs/plugin-react 传递依赖）；
 *       找不到时回退到 skill 自身 node_modules；仍找不到返回 null 由调用方报错。
 */

const path = require('path');

// babel 节点上需要跳过的非 AST 键（loc/start/end/注释等）
const SKIP_KEYS = new Set([
  'loc', 'start', 'end', 'range', 'type',
  'leadingComments', 'trailingComments', 'innerComments',
  'extra', 'directives', 'sourceType', 'tokens', 'errors',
]);

/**
 * 加载 @babel/parser。
 * @param {string} targetRoot 目标工程根
 * @returns {{parse: Function} | null}
 */
function loadParser(targetRoot) {
  const searchPaths = [
    path.join(targetRoot, 'node_modules'),
    targetRoot,
  ];
  try {
    const resolved = require.resolve('@babel/parser', { paths: searchPaths });
    return require(resolved);
  } catch (e) { /* fall through */ }
  try { return require('@babel/parser'); } catch (e) { /* fall through */ }
  return null;
}

/**
 * 解析源码为 AST。
 * @returns {{ast: object} | {error: Error}}
 */
function parse(parser, text) {
  try {
    const ast = parser.parse(text, {
      sourceType: 'module',
      plugins: [
        'jsx',
        'typescript',
        'classProperties',
        'objectRestSpread',
        'optionalChaining',
        'nullishCoalescingOperator',
        'dynamicImport',
        'numericSeparator',
        'exportDefaultFrom',
        'decorators-legacy',
      ],
      errorRecovery: true,
    });
    return { ast };
  } catch (e) {
    return { error: e };
  }
}

/**
 * 通用 AST 子节点遍历：对 node 及其所有 AST 子节点调用 cb。
 * 跳过 loc/start/end/注释等非结构键；只深入 type 节点。
 */
function walk(node, cb) {
  if (!node || typeof node !== 'object') return;
  cb(node);
  for (const key of Object.keys(node)) {
    if (SKIP_KEYS.has(key)) continue;
    const val = node[key];
    if (Array.isArray(val)) {
      for (const v of val) {
        if (v && typeof v === 'object' && typeof v.type === 'string') walk(v, cb);
      }
    } else if (val && typeof val === 'object' && typeof val.type === 'string') {
      walk(val, cb);
    }
  }
}

/**
 * 从某个表达式根节点出发，递归收集其中所有 ObjectExpression 节点。
 * 覆盖：字面量数组、.map(cb)/Array.from(arr,cb) 回调（隐式返回 or 块体 return）、
 *       spread、条件/逻辑表达式、嵌套对象、函数体 return 等。
 * @param {object} rootExpr 表达式节点（如 options={X} 的 X）
 * @returns {object[]} ObjectExpression 节点数组
 */
function collectObjectExpressions(rootExpr) {
  const out = [];
  const seen = new Set();
  walk(rootExpr, (n) => {
    if (n.type === 'ObjectExpression' && !seen.has(n)) {
      seen.add(n);
      out.push(n);
    }
  });
  return out;
}

/**
 * 在整文件 AST 中查找标识符的 const/let/var 初始化表达式（同文件，非跨作用域精确，
 * 取首个匹配——业务里选项常量极少重名/遮蔽）。返回 init 节点或 null。
 */
function findBindingInit(ast, name) {
  let result = null;
  walk(ast, (n) => {
    if (result) return;
    if (
      n.type === 'VariableDeclarator' &&
      n.id && n.id.type === 'Identifier' && n.id.name === name && n.init
    ) {
      result = n.init;
    }
  });
  return result;
}

/**
 * 从 JSXOpeningElement 取指定 prop 的值表达式节点。
 * 支持 prop={expr}（JSXExpressionContainer）与 prop="str"（StringLiteral）。
 * 返回表达式节点或 null。
 */
function getAttrExpr(el, propName) {
  const attrs = el.attributes || [];
  for (const a of attrs) {
    if (a.type !== 'JSXAttribute') continue;
    if (!a.name || a.name.type !== 'JSXIdentifier' || a.name.name !== propName) continue;
    const v = a.value;
    if (!v) return null;
    if (v.type === 'JSXExpressionContainer') return v.expression;
    if (v.type === 'StringLiteral' || v.type === 'JSXStringLiteral' || v.type === 'StringLiteral') return v;
    return null;
  }
  return null;
}

/**
 * 取 ObjectExpression 中某属性名是否存在。
 * 支持普通 Identifier/StringLiteral 键、computed StringLiteral 键、shorthand。
 * @returns {{prop: object, line: number} | null}
 */
function findProperty(objNode, name) {
  for (const p of objNode.properties) {
    if (p.type !== 'ObjectProperty' && p.type !== 'ObjectMethod') continue;
    const pn = getPropertyName(p);
    if (pn === name) {
      const line = (p.key && p.key.loc && p.key.loc.start.line)
        || (p.loc && p.loc.start.line)
        || (objNode.loc && objNode.loc.start.line);
      return { prop: p, line };
    }
  }
  return null;
}

/**
 * 取对象属性键名（静态可判定）。computed 用变量/动态表达式时返回 null。
 */
function getPropertyName(prop) {
  const key = prop.key;
  if (!key) return null;
  if (!prop.computed) {
    if (key.type === 'Identifier') return key.name;
    if (key.type === 'StringLiteral') return key.value;
    if (key.type === 'NumericLiteral') return String(key.value);
  } else {
    if (key.type === 'StringLiteral') return key.value;
    if (key.type === 'NumericLiteral') return String(key.value);
    if (key.type === 'TemplateLiteral' && key.quasis && key.quasis.length === 1) {
      return key.quasis[0].value.cooked;
    }
  }
  return null;
}

/** 取对象属性的值节点（shorthand 时值即键本身，babel 仍填 value=Identifier）。 */
function getPropertyValueNode(prop) {
  return prop && prop.value;
}

function isBooleanLiteral(node) {
  return node && node.type === 'BooleanLiteral';
}

/**
 * 取 JSX 元素名（支持 <Foo> 与 <Foo.Bar>，返回 'Foo' / 'Foo.Bar'）。
 */
function jsxElementName(el) {
  const name = el.name;
  if (!name) return null;
  if (name.type === 'JSXIdentifier') return name.name;
  if (name.type === 'JSXMemberExpression') {
    const parts = [];
    let cur = name;
    while (cur.type === 'JSXMemberExpression') {
      parts.unshift(cur.property.name);
      cur = cur.object;
    }
    parts.unshift(cur.name);
    return parts.join('.');
  }
  return null;
}

/**
 * 收集文件 AST 中所有匹配 names 的 JSXOpeningElement（含开标签/自闭合）。
 * @param {object} ast
 * @param {string[]} names 期望的元素名（如 ['Select','MultipleSelect', ...]）
 * @returns {{el: object, name: string}[]}
 */
function findJsxElements(ast, names) {
  const want = new Set(names);
  const out = [];
  walk(ast, (n) => {
    if (n.type !== 'JSXOpeningElement') return;
    const nm = jsxElementName(n);
    if (nm && want.has(nm)) out.push({ el: n, name: nm });
  });
  return out;
}

/**
 * 从一个 prop 表达式出发，收集所有 ObjectExpression，并处理标识符追源。
 * @param {object} ast 整文件 AST（用于追 const 定义）
 * @param {object} expr prop 表达式节点
 * @returns {object[]} ObjectExpression 节点（去重）
 */
function collectOptionsObjects(ast, expr) {
  if (!expr) return [];
  const objs = collectObjectExpressions(expr);
  // 若 expr 本身是标识符 → 追 const 定义，并入其 init 里的对象
  if (expr.type === 'Identifier') {
    const init = findBindingInit(ast, expr.name);
    if (init) {
      for (const o of collectObjectExpressions(init)) {
        if (!objs.includes(o)) objs.push(o);
      }
    }
  }
  // 也追 expr 内出现的任意标识符（如 X.map(...)、helper(opts) 中的 opts）
  // —— 收集 expr 中所有 Identifier 引用，逐个追源并入（去重）
  const idNames = new Set();
  walk(expr, (n) => {
    if (n.type === 'Identifier' && n !== expr) idNames.add(n.name);
  });
  for (const name of idNames) {
    const init = findBindingInit(ast, name);
    if (init) {
      for (const o of collectObjectExpressions(init)) {
        if (!objs.includes(o)) objs.push(o);
      }
    }
  }
  return objs;
}

/**
 * 收集"顶层项对象"——数组直接元素里的 ObjectExpression，以及 .map(cb)/Array.from(arr,cb)
 * 回调 return 的 ObjectExpression。不深入嵌套对象（避免列 render 回调里返回的
 * {children,props} 等被误计入列数）。标识符追同文件 const 定义。
 *
 * 与 collectObjectExpressions 的区别：后者深扫收集【所有】ObjectExpression（用于字段残留
 * 检查——任何嵌套对象的 label 都算残留）；本函数只收"作为数组项 / 映射回调产物"的顶层对象
 * （用于 columnsAllWidth 这类"按列统计"的检查——只数列对象，不数列里 render 返回的对象）。
 *
 * 返回 { objects, mapSourced }：mapSourced=true 表示有对象来自 .map/Array.from 回调 return
 * （此时 objects.length 是"对象字面量形状数"而非"运行时列数"——columnsAllWidth 等计数类检查
 * 需据此放宽阈值：map 回调只产生 1 个形状对象，但运行时可能 N 列）。
 */
function collectTopLevelObjects(ast, expr) {
  const objects = [];
  const seen = new Set();
  const flags = { mapSourced: false };
  _collectTopLevel(ast, expr, objects, seen, flags);
  return { objects, mapSourced: flags.mapSourced };
}

function _collectTopLevel(ast, expr, out, seen, flags) {
  if (!expr || seen.has(expr)) return;
  seen.add(expr);
  switch (expr.type) {
    case 'ArrayExpression':
      for (const el of expr.elements) {
        if (!el) continue;
        if (el.type === 'ObjectExpression') {
          pushIfObject(el, out, seen);
        } else if (el.type === 'SpreadElement') {
          _collectTopLevel(ast, el.argument, out, seen, flags);
        } else if (el.type === 'CallExpression') {
          _collectTopLevel(ast, el, out, seen, flags);
        } else if (el.type === 'ConditionalExpression') {
          pushIfObject(el.consequent, out, seen);
          pushIfObject(el.alternate, out, seen);
        }
      }
      return;
    case 'CallExpression': {
      // arr.map(cb) / Array.from(arr, cb) / _.map(arr, cb) —— 取最后一个函数类型参数作回调
      let cb = null;
      for (const a of expr.arguments) {
        if (a.type === 'ArrowFunctionExpression' || a.type === 'FunctionExpression') cb = a;
      }
      if (cb) {
        flags.mapSourced = true;
        collectReturnObjects(cb, out, seen, flags);
      }
      return;
    }
    case 'Identifier': {
      const init = findBindingInit(ast, expr.name);
      if (init) _collectTopLevel(ast, init, out, seen, flags);
      return;
    }
    case 'ConditionalExpression':
      pushIfObject(expr.consequent, out, seen);
      pushIfObject(expr.alternate, out, seen);
      return;
    default:
      return;
  }
}

function pushIfObject(node, out, seen) {
  if (node && node.type === 'ObjectExpression' && !seen.has(node)) {
    seen.add(node);
    out.push(node);
  }
}

function collectReturnObjects(fnNode, out, seen, flags) {
  const body = fnNode.body;
  if (!body) return;
  if (body.type === 'ObjectExpression') { pushIfObject(body, out, seen); return; }
  if (body.type === 'BlockStatement') {
    walk(body, (n) => {
      if (n.type !== 'ReturnStatement' || !n.argument) return;
      const arg = n.argument;
      if (arg.type === 'ObjectExpression') {
        pushIfObject(arg, out, seen);
      } else if (arg.type === 'ConditionalExpression') {
        pushIfObject(arg.consequent, out, seen);
        pushIfObject(arg.alternate, out, seen);
      } else if (arg.type === 'CallExpression') {
        // return buildCol(...) —— 回调 return 又是函数调用构造的对象，继续钻一层
        _collectTopLevel(null, arg, out, seen, flags);
      }
    });
  }
}

module.exports = {
  loadParser,
  parse,
  walk,
  collectObjectExpressions,
  collectTopLevelObjects,
  findBindingInit,
  getAttrExpr,
  findProperty,
  getPropertyName,
  getPropertyValueNode,
  isBooleanLiteral,
  jsxElementName,
  findJsxElements,
  collectOptionsObjects,
};
