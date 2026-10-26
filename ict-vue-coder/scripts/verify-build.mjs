#!/usr/bin/env node
// verify-build.mjs — 对构建产物 index.page.html 的无头验证(无需浏览器)。
//
// 用与页面相同的本地库(Vue → dayjs → ElementPlus → locale → echarts → vue-i18n)
// 在 Node 中重建运行时:提取产物内联的 data-page-script 脚本,在带 DOM stub 的
// 沙箱中真实执行 createApp(...).use(ElementPlus).mount("#root") —
// 组件模板由 Vue 自带编译器现场编译,模板语法错误、setup/渲染期错误均会被抓住。
// 断言 createApp 恰好一次、mount 恰好一次。
//
// Usage:  node verify-build.mjs --dir "<scaffold path>"

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

// --- parse --dir argument (the scaffold path to verify) ---
const args = process.argv.slice(2);
const dirIdx = args.findIndex((a) => a === "--dir" || a === "-d");
if (dirIdx === -1 || !args[dirIdx + 1]) {
  console.error('FAIL  Missing --dir <scaffold path>. Usage: node verify-build.mjs --dir "<path>"');
  process.exit(1);
}
const ROOT = resolve(args[dirIdx + 1]);

const HTML = resolve(ROOT, "index.page.html");
const LIB = (name) => resolve(ROOT, "assets/library", name);

// --- minimal DOM/browser stubs (enough for UMD init + Vue mount) ---
let stubDocument; // 先声明(stubElement 在其初始化期间即被调用,此时为 undefined)

function stubElement(tagName) {
  const el = {
    nodeType: 1,
    style: { setProperty() {}, getPropertyValue() { return ""; }, removeProperty() {} },
    sheet: { insertRule() {}, cssRules: [] },
    setAttribute() {},
    getAttribute() { return null; },
    removeAttribute() {},
    hasAttribute() { return false; },
    setAttributeNS() {},
    getAttributeNS() { return null; },
    removeAttributeNS() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() { return true; },
    classList: { add() {}, remove() {}, contains() { return false; }, toggle() {} },
    dataset: {},
    attachShadow() { return stubElement(); },
    shadowRoot: null,
    querySelector() { return null; },
    querySelectorAll() { return []; },
    getElementsByTagName() { return []; },
    getElementsByClassName() { return []; },
    matches() { return false; },
    closest() { return null; },
    getBoundingClientRect() { return { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0 }; },
    scrollIntoView() {},
    focus() {},
    blur() {},
    click() {},
    // echarts 文本测量:即使 SVG 渲染器,zrender 也用 canvas measureText 量文本宽度
    getContext: () => ({
      canvas: { width: 0, height: 0 },
      font: "",
      measureText: (text) => ({
        width: String(text ?? "").length * 7,
        actualBoundingBoxAscent: 8,
        actualBoundingBoxDescent: 2,
      }),
      fillText() {}, strokeText() {}, clearRect() {}, fillRect() {},
      save() {}, restore() {}, beginPath() {}, closePath() {},
      set fillStyle(v) {}, set strokeStyle(v) {},
    }),
    toDataURL: () => "data:,",
    offsetWidth: 0,
    offsetHeight: 0,
    clientWidth: 0,
    clientHeight: 0,
    tagName: (tagName || "DIV").toUpperCase(),
    ownerDocument: null,
  };

  // --- 树结构维护(Vue 组件更新通过 parentNode/nextSibling 定位容器,
  //     react 版哑 stub 不维护树关系,Mount 后的更新链路会崩) ---
  const childNodes = [];
  let _parent = null;
  Object.defineProperty(el, "childNodes", { get: () => childNodes, configurable: true });
  el.appendChild = (child) => {
    if (child.parentNode) child.parentNode.removeChild(child);
    child.parentNode = el;
    childNodes.push(child);
    return child;
  };
  el.insertBefore = (child, anchor) => {
    if (child.parentNode) child.parentNode.removeChild(child);
    const idx = anchor ? childNodes.indexOf(anchor) : -1;
    child.parentNode = el;
    if (idx === -1) childNodes.push(child);
    else childNodes.splice(idx, 0, child);
    return child;
  };
  el.removeChild = (child) => {
    const idx = childNodes.indexOf(child);
    if (idx !== -1) childNodes.splice(idx, 1);
    child.parentNode = null;
    return child;
  };
  el.remove = () => {
    if (el.parentNode) el.parentNode.removeChild(el);
  };
  el.replaceChild = (newChild, oldChild) => {
    const idx = childNodes.indexOf(oldChild);
    if (idx !== -1) childNodes[idx] = newChild;
    else childNodes.push(newChild);
    newChild.parentNode = el;
    oldChild.parentNode = null;
    return oldChild;
  };
  el.append = (...children) => {
    children.forEach((c) => el.appendChild(c));
    return children[children.length - 1];
  };
  el.prepend = (...children) => {
    [...children].reverse().forEach((c) => el.insertBefore(c, childNodes[0] || null));
  };
  el.contains = (target) => {
    if (target === el) return true;
    return childNodes.some((c) => c.nodeType === 1 && typeof c.contains === "function" && c.contains(target));
  };
  Object.defineProperty(el, "parentNode", {
    get: () => _parent,
    set: (v) => { _parent = v; },
    configurable: true,
  });
  Object.defineProperty(el, "parentElement", {
    get: () => (_parent && _parent.nodeType === 1 ? _parent : null),
    configurable: true,
  });
  Object.defineProperty(el, "firstChild", { get: () => childNodes[0] || null, configurable: true });
  Object.defineProperty(el, "lastChild", { get: () => childNodes[childNodes.length - 1] || null, configurable: true });
  Object.defineProperty(el, "nextSibling", {
    get() {
      if (!_parent) return null;
      const sibs = _parent.childNodes;
      return sibs[sibs.indexOf(el) + 1] || null;
    },
    configurable: true,
  });
  Object.defineProperty(el, "previousSibling", {
    get() {
      if (!_parent) return null;
      const sibs = _parent.childNodes;
      return sibs[sibs.indexOf(el) - 1] || null;
    },
    configurable: true,
  });

  // innerHTML / textContent 存取器:Vue 模板编译器用 <div> 解码 HTML 实体
  // (innerHTML 赋值 → textContent 读取)。stub 下做恒等解码(实体保留原文),
  // 真浏览器中由浏览器正确解码。innerHTML 赋值同时清空真实子节点(浏览器语义)。
  let _html = "";
  let _text;
  Object.defineProperty(el, "innerHTML", {
    get() { return _html; },
    set(v) {
      _html = String(v);
      childNodes.length = 0;
    },
    configurable: true,
  });
  Object.defineProperty(el, "textContent", {
    get() { return _text !== undefined ? _text : _html; },
    set(v) { _text = String(v); },
    configurable: true,
  });
  // Vue 属性实体解码: decoder.innerHTML = `<div foo="...">` → children[0].getAttribute("foo")
  Object.defineProperty(el, "children", {
    get() {
      if (childNodes.length === 0 && this._isDecoder === true && _html) {
        const child = stubElement("DIV");
        const m = /^<div foo="([\s\S]*)">$/.exec(_html);
        child.getAttribute = (name) => (name === "foo" && m ? m[1].replace(/&quot;/g, '"') : null);
        return [child];
      }
      return childNodes.filter((c) => c.nodeType === 1);
    },
    configurable: true,
  });
  el.cloneNode = () => stubElement(tagName);
  el.ownerDocument = stubDocument;
  return el;
}

const listeners = {};
stubDocument = {
  nodeType: 9,
  createElement: (tag) => {
    const el = stubElement(tag);
    // 编译器解码器特征:createElement("div") 后仅做 innerHTML/textContent 存取 —
    // 统一标记,children getter 按需派生解码子节点
    el._isDecoder = true;
    return el;
  },
  createElementNS: (_ns, tag) => stubElement(tag),
  createTextNode: () => ({ nodeType: 3, textContent: "" }),
  createDocumentFragment: () => stubElement("FRAGMENT"),
  createComment: () => ({ nodeType: 8, textContent: "" }),
  getElementById: () => stubRoot,
  querySelector: (sel) => (sel === "#root" ? stubRoot : null),
  querySelectorAll: () => [],
  getElementsByTagName: () => [],
  getElementsByClassName: () => [],
  addEventListener(type, fn) { (listeners[type] = listeners[type] || []).push(fn); },
  removeEventListener() {},
  dispatchEvent() { return true; },
  documentElement: stubElement("HTML"),
  head: stubElement("HEAD"),
  body: stubElement("BODY"),
  contains() { return false; },
  importNode(node) { return node; },
  adoptNode(node) { return node; },
  implementation: { hasFeature() { return true; }, createHTMLDocument() { return stubDocument; } },
  visibilityState: "visible",
  hidden: false,
  currentScript: null,
  activeElement: null,
  fonts: { check: () => true },
};
const stubRoot = stubElement("ROOT");
stubRoot.nodeType = 1;

const raf = (cb) => setTimeout(() => cb(Date.now()), 0);
const stubWindow = {
  document: stubDocument,
  addEventListener: stubDocument.addEventListener,
  removeEventListener() {},
  dispatchEvent() { return true; },
  navigator: { userAgent: "node", platform: process.platform, language: "zh-CN", languages: ["zh-CN"], vendor: "" },
  location: { href: "file:///index.page.html", protocol: "file:", host: "", hostname: "", origin: "null", pathname: "/", search: "", hash: "" },
  history: { pushState() {}, replaceState() {}, go() {}, back() {}, forward() {} },
  getComputedStyle: () => ({ getPropertyValue: () => "", removeProperty() {}, setProperty() {} }),
  matchMedia: () => ({ matches: false, media: "", addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; } }),
  requestAnimationFrame: raf,
  cancelAnimationFrame: (id) => clearTimeout(id),
  requestIdleCallback: raf,
  cancelIdleCallback: (id) => clearTimeout(id),
  setTimeout, clearTimeout, setInterval, clearInterval,
  MutationObserver: class { observe() {} disconnect() {} takeRecords() { return []; } },
  ResizeObserver: class { observe() {} unobserve() {} disconnect() {} },
  IntersectionObserver: class { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } },
  CustomEvent: class { constructor(t, o) { this.type = t; this.detail = o?.detail; } },
  Event: class { constructor(t) { this.type = t; } },
  MessageChannel: class { constructor() { this.port1 = {}; this.port2 = {}; } },
  devicePixelRatio: 1,
  innerWidth: 1920,
  innerHeight: 1080,
  opener: null,
  closed: false,
};
stubWindow.self = stubWindow;
stubWindow.top = stubWindow;
stubWindow.parent = stubWindow;
stubWindow.window = stubWindow;
stubDocument.defaultView = stubWindow; // echarts/zrender 经 document.defaultView 取 getComputedStyle

// 离线 fetch — icon 组件的 icon-plus 探测在无头环境直接走 Lucide 回退分支
const offlineFetch = () => Promise.reject(new Error("offline (headless verify)"));

// 通用脚本执行器:代码体 + 尾部 return 表达式取回全局(IIFE 型包)
function execIife(code, globalName) {
  const fn = new Function(
    "window", "document", "navigator", "self", "fetch",
    `${code}\n;return ${globalName};`
  );
  return fn(stubWindow, stubDocument, stubWindow.navigator, stubWindow, offlineFetch);
}

// 通用 UMD 加载器 — 统一走浏览器分支:
// 不声明 module/exports/require 参数(typeof 检测得 "undefined"),
// 全局对象已注入(globalThis.Vue 等),结果落 globalThis,由调用方读取。
function execUmd(code) {
  const fn = new Function(
    "window", "document", "navigator", "self", "fetch",
    "getComputedStyle", "requestAnimationFrame", "cancelAnimationFrame", "MutationObserver", "ResizeObserver", "getBoundingClientRect",
    code
  );
  fn.call(
    globalThis,
    stubWindow, stubDocument, stubWindow.navigator, stubWindow, offlineFetch,
    stubWindow.getComputedStyle, stubWindow.requestAnimationFrame, stubWindow.cancelAnimationFrame,
    stubWindow.MutationObserver, stubWindow.ResizeObserver,
    () => ({ top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 })
  );
}

// ---- 1. Vue (full build, 自带模板编译器) ----
// DOM 类 stub(浏览器内为真实类;无头下 Vue/EP 的 instanceof 检测走 HTML 路径)
for (const name of [
  "Element", "HTMLElement", "SVGElement", "Node",
  "HTMLInputElement", "HTMLTextAreaElement", "HTMLSelectElement",
  "HTMLButtonElement", "HTMLImageElement", "HTMLCanvasElement", "HTMLFormElement",
]) {
  if (!globalThis[name]) globalThis[name] = class {};
}
if (!globalThis.Image) globalThis.Image = class {};

const Vue = execIife(await readFile(LIB("vue.global.prod.js"), "utf8"), "Vue");
if (!Vue || typeof Vue.createApp !== "function" || typeof Vue.version !== "string") {
  console.error("FAIL  vue.global.prod.js did not expose Vue (createApp/version missing)");
  process.exit(1);
}
globalThis.Vue = Vue; // EP UMD 浏览器分支读 globalThis.Vue
console.log(`PASS  Vue ${Vue.version} loaded (createApp present, compiler built-in)`);

// ---- 2. dayjs ----
execUmd(await readFile(LIB("dayjs.min.js"), "utf8"));
const dayjsCore = globalThis.dayjs;
if (typeof dayjsCore !== "function") {
  console.error("FAIL  dayjs.min.js did not expose a callable global");
  process.exit(1);
}
console.log(`PASS  dayjs loaded (v${dayjsCore.version || "?"})`);

// ---- 3. Element Plus (UMD,仅需 globalThis.Vue;自带 dayjs) ----
execUmd(await readFile(LIB("element-plus.full.min.js"), "utf8"));
let ElementPlus = globalThis.ElementPlus || stubWindow.ElementPlus;
function epLoadedOk(ep) {
  return !!(ep && typeof ep.version === "string" && ep.ElButton && ep.ElConfigProvider);
}
if (!epLoadedOk(ElementPlus)) {
  const keys = ElementPlus ? Object.keys(ElementPlus).slice(0, 30) : [];
  console.error(`FAIL  ElementPlus UMD did not expose components (typeof=${typeof ElementPlus}, keys=${keys.length}: ${keys.join(", ")})`);
  process.exit(1);
}
console.log(`PASS  ElementPlus ${ElementPlus.version} loaded (ElButton/ElConfigProvider present)`);

// ---- 4. Element Plus zh-cn locale ----
execUmd(await readFile(LIB("element-zh-cn.min.js"), "utf8"));
const ElementPlusLocaleZhCn = globalThis.ElementPlusLocaleZhCn;
if (!ElementPlusLocaleZhCn || !ElementPlusLocaleZhCn.el) {
  console.error("FAIL  element-zh-cn.min.js did not expose ElementPlusLocaleZhCn");
  process.exit(1);
}
console.log(`PASS  ElementPlus zh-cn locale loaded (el.* keys present)`);

// EP 自带 dayjs 可能覆写 globalThis.dayjs — 取最终实例供页面使用
const finalDayjs = globalThis.dayjs || dayjsCore;

// ---- 5. vue-i18n (offline IIFE, exposes VueI18n) ----
let VueI18n = null;
try {
  VueI18n = execIife(await readFile(LIB("vue-i18n.global.prod.js"), "utf8"), "VueI18n");
  if (!VueI18n || typeof VueI18n.createI18n !== "function") throw new Error("createI18n missing");
  globalThis.VueI18n = VueI18n;
  console.log(`PASS  vue-i18n loaded (VueI18n global present)`);
} catch (e) {
  console.log(`NOTE  vue-i18n headless load skipped: ${e.message}`);
}

// ---- 6. echarts(图表引擎;无头 smoke init 失败不阻断 — 图表渲染本就需真实浏览器) ----
let echartsGlobal = null;
try {
  execUmd(await readFile(LIB("echarts.min.js"), "utf8"));
  const echarts = globalThis.echarts;
  if (!echarts || typeof echarts.init !== "function") throw new Error("echarts.init missing");
  // smoke:显式宽高 + stub 容器,验证 SVG 渲染器在 stub DOM 下可跑
  const probe = echarts.init(stubElement("DIV"), null, { renderer: "svg", width: 100, height: 100 });
  try { probe.dispose(); } catch { /* noop */ }
  echartsGlobal = echarts;
  console.log(`PASS  echarts loaded (init + svg smoke ok)`);
} catch (e) {
  console.log(`NOTE  echarts headless init skipped: ${e.message} — Chart 组件将跳过 init(浏览器不受影响)`);
}

// ---- 7. 提取产物内联脚本并执行 ----
const html = await readFile(HTML, "utf8");
const match = html.match(/<script data-page-script[^>]*>([\s\S]*?)<\/script>/);
if (!match) throw new Error("No data-page-script found in index.page.html");
const pageScript = match[1];

let createCount = 0;
let mountCount = 0;
const collectedErrors = []; // Vue 默认会吞掉组件错误(仅 console.error)→ 主动收集并判 FAIL
const realCreateApp = Vue.createApp;
Vue.createApp = function (...a) {
  createCount++;
  const app = realCreateApp.apply(this, a);
  try {
    app.config.errorHandler = (err) => {
      collectedErrors.push(err);
    };
  } catch { /* config 不可写时退回默认行为 */ }
  const realMount = app.mount;
  app.mount = function (...m) {
    mountCount++;
    return realMount.apply(this, m);
  };
  return app;
};

try {
  const fn = new Function(
    "Vue", "ElementPlus", "ElementPlusLocaleZhCn", "VueI18n", "echarts", "dayjs",
    "document", "window", "navigator", "location", "history", "getComputedStyle",
    "requestAnimationFrame", "cancelAnimationFrame", "matchMedia",
    "MutationObserver", "ResizeObserver", "CustomEvent", "Event", "fetch",
    pageScript
  );
  fn(
    Vue, ElementPlus, ElementPlusLocaleZhCn, VueI18n, echartsGlobal, finalDayjs,
    stubDocument, stubWindow, stubWindow.navigator, stubWindow.location, stubWindow.history,
    stubWindow.getComputedStyle, stubWindow.requestAnimationFrame, stubWindow.cancelAnimationFrame,
    stubWindow.matchMedia, stubWindow.MutationObserver, stubWindow.ResizeObserver,
    stubWindow.CustomEvent, stubWindow.Event, offlineFetch
  );
  // 让异步任务(icon-plus 探测回退触发的重渲染等)在捕获范围内落地
  await new Promise((r) => setTimeout(r, 150));
} catch (err) {
  console.error("FAIL  Runtime error while executing modules:");
  console.error(err.stack || err.message);
  process.exit(1);
} finally {
  Vue.createApp = realCreateApp;
}

if (createCount !== 1 || mountCount !== 1) {
  console.error(`FAIL  Expected exactly 1 createApp + 1 mount call, got createApp=${createCount}, mount=${mountCount}`);
  process.exit(1);
}

if (collectedErrors.length) {
  console.error(`FAIL  ${collectedErrors.length} component error(s) during mount/updates:`);
  for (const e of collectedErrors) {
    console.error(`  ${(e && e.stack) || e}`);
  }
  process.exit(1);
}

console.log(`PASS  Vue.createApp(...).use(ElementPlus).mount("#root") executed once`);
console.log(`OK    index.page.html verified`);
