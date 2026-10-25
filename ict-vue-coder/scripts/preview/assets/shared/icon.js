import { h } from "vue";

// Icon — Lucide / icon-plus 图标组件(Vue 版)
// 在线(icon-plus 联通可用)时按 name 拉取官方 SVG;离线回退 Lucide
// (表格数据 assets/library/lucide-icon-nodes.json,build 时按需注入)。
// 用法: import { Icon } from "./assets/shared/icon.js" → <Icon name="search" size="0.875rem" />
// 颜色: 默认继承父元素计算色;显式 color 须为 6 位 hex(icon-plus 按色值匹配)。

// ---- Lucide (offline fallback, table injected at build time) ----
const ICONS = typeof LUCIDE !== "undefined" ? LUCIDE : {};

function camelToKebab(s) {
  return s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function lookupIcon(name) {
  if (!name) return null;
  return (
    ICONS[name] ||
    ICONS[camelToKebab(name)] ||
    ICONS[name.replace(/-([a-z])/g, (_m, c) => c.toUpperCase())] ||
    null
  );
}

// ---- icon-plus (联通) online flow ----
const ICON_API_BASE = "https://octo.hdesign.huawei.com";
const GET_CONFIG = `${ICON_API_BASE}/assetRepository/iconPlus/getConfig`;
const GET_ICON_INFO = `${ICON_API_BASE}/assetRepository/iconPlus/getIconInfo`;
const GET_ICON = `${ICON_API_BASE}/assetRepository/iconPlus/getIcon`;

let plusState = null; // null = probing, true = icon-plus available, false = fall back to Lucide
let plusPromise = null; // singleton getConfig probe promise
let iconConfig = null;
let defaultColorId = "";
const iconInfoMap = {}; // name -> { name, url } (结果缓存)
const iconInfoPromiseMap = {}; // name -> 进行中 Promise (in-flight 去重)
const svgCache = new Map(); // "name&variant&color&size" -> svg text (结果缓存)
const svgPromiseMap = new Map(); // "name&variant&color&size" -> 进行中 Promise (in-flight 去重)

// 动态获取当前 rem 基准 px(html font-size 随视口媒体查询变化)
function getRootFontSize() {
  if (typeof document === "undefined") return 16;
  const fs = getComputedStyle(document.documentElement).fontSize;
  return parseFloat(fs) || 16;
}

// getComputedStyle 的 rgb()/rgba() 字符串 → #RRGGBB,用于 icon-plus API 颜色匹配
function rgbToHex(rgb) {
  if (!rgb) return null;
  const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!m) return null;
  return "#" + [1, 2, 3].map(function (i) { return parseInt(m[i], 10).toString(16).padStart(2, "0"); }).join("").toUpperCase();
}

// #RGB / #RRGGBB -> [r,g,b];非法输入返回 null
function hexToRgb(hex) {
  if (!hex) return null;
  let h = String(hex).replace(/^#/, "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// 两个 hex 颜色的欧氏距离(RGB 空间),用于 icon-plus 颜色就近匹配
function colorDistance(a, b) {
  const ra = hexToRgb(a);
  const rb = hexToRgb(b);
  if (!ra || !rb) return Infinity;
  return Math.sqrt(
    (ra[0] - rb[0]) ** 2 + (ra[1] - rb[1]) ** 2 + (ra[2] - rb[2]) ** 2
  );
}

// getIcon 的 size 参数需数字 px;源 size 可能是 rem/px/数字,转 px 后吸附标准尺寸
const API_SIZES = [12, 14, 16, 20, 24, 32, 36, 40, 48, 60];
function toApiSize(size) {
  let n = null;
  if (size != null) {
    const m = String(size).trim().match(/(-?\d+(?:\.\d+)?)\s*(rem|px)?/i);
    if (m) {
      n = Number(m[1]);
      if (m[2] && m[2].toLowerCase() === "rem") n = n * getRootFontSize();
    }
  }
  if (n == null || Number.isNaN(n)) return 16;
  let best = API_SIZES[0], bestDiff = Math.abs(n - best);
  for (const s of API_SIZES) {
    const d = Math.abs(n - s);
    if (d < bestDiff) { bestDiff = d; best = s; }
  }
  return best;
}

// variant prop -> getConfig style key
const STYLE_KEY = {
  lined: "border",
  filled: "filled",
  "two-tone": "two_colors1",
  circle: "round_bottom2",
  square: "square_bottom2",
};

function getStyleValue(styleKey) {
  return iconConfig?.style?.find((s) => s.key === styleKey)?.value || styleKey;
}

// 请求 hex → API color id:精确命中 → 就近匹配 → defaultColorId 兜底
function resolveColorId(variant, colorHex) {
  const styleValue = getStyleValue(STYLE_KEY[variant] || "border");
  const colors = (iconConfig?.colors || []).filter((c) => c.style === styleValue);
  if (colorHex) {
    const target = colorHex.toUpperCase();
    const exact = colors.find((c) =>
      String(c.value).split(",").map((v) => v.trim().toUpperCase()).includes(target)
    );
    if (exact) return exact.id;
    let best = null;
    let bestDist = Infinity;
    for (const c of colors) {
      for (const v of String(c.value).split(",")) {
        const d = colorDistance(target, v.trim());
        if (d < bestDist) { bestDist = d; best = c; }
      }
    }
    if (best) return best.id;
  }
  return defaultColorId || colors[0]?.id || "";
}

// getConfig probe == icon-plus 可用性验证
function ensurePlus() {
  if (plusPromise) return plusPromise;
  plusPromise = (async () => {
    try {
      const resp = await fetch(GET_CONFIG);
      if (!resp.ok) {
        plusState = false;
        return false;
      }
      iconConfig = await resp.json();
      const linear = iconConfig.colors?.find(
        (c) => c.type === "linear" || c.type === "通用色"
      );
      defaultColorId = linear?.id || iconConfig.colors?.[0]?.id || "";
      plusState = true;
      return true;
    } catch (e) {
      plusState = false;
      return false;
    }
  })();
  return plusPromise;
}

// 选出与 keyword 最匹配的 icon(优先系统图标组)
function selectBestIcon(icons, keyword) {
  return (
    icons.find(
      (i) => Array.isArray(i.group) && i.group.some((g) => g.includes("系统图标"))
    ) ||
    icons.find((i) => i.name?.toLowerCase().includes(keyword.toLowerCase())) ||
    icons[0]
  );
}

// name -> { name, url } via getIconInfo(结果缓存 + in-flight 去重)
async function resolveIconInfo(name) {
  if (iconInfoMap[name]) return iconInfoMap[name];
  if (iconInfoPromiseMap[name]) return iconInfoPromiseMap[name];
  const p = (async () => {
    try {
      const resp = await fetch(
        `${GET_ICON_INFO}?keyword=${encodeURIComponent(name)}&topK=2&source_id=6`
      );
      const data = await resp.json();
      const entry = (Array.isArray(data) ? data : [data]).find(
        (d) => d.icons?.length
      );
      const selected = selectBestIcon(entry?.icons || [], name);
      if (!selected?.url) return null;
      iconInfoMap[name] = { name: selected.name, url: selected.url };
      return iconInfoMap[name];
    } catch (e) {
      return null;
    }
  })();
  iconInfoPromiseMap[name] = p;
  p.finally(() => {
    delete iconInfoPromiseMap[name];
  });
  return p;
}

// 按 name/variant/color/size 拉取 SVG 文本(结果缓存 + in-flight 去重)
function fetchSvg(name, variant, colorHex, size) {
  const key = `${name}&${variant}&${colorHex}&${size}`;
  if (svgCache.has(key)) return Promise.resolve(svgCache.get(key));
  if (svgPromiseMap.has(key)) return svgPromiseMap.get(key);
  const p = (async () => {
    const info = await resolveIconInfo(name);
    if (!info) return "";
    const styleValue = getStyleValue(STYLE_KEY[variant] || "border");
    const colorId = resolveColorId(variant, colorHex);
    try {
      const resp = await fetch(
        `${GET_ICON}?url=${encodeURIComponent(info.url)}&size=${toApiSize(size)}&style=${encodeURIComponent(
          styleValue
        )}&color=${encodeURIComponent(colorId)}&fileType=svg`
      );
      const data = await resp.json();
      const item = Array.isArray(data) ? data[0] : data;
      return item?.data || "";
    } catch (e) {
      return "";
    }
  })();
  svgPromiseMap.set(key, p);
  p.then((s) => {
    if (s) svgCache.set(key, s);
  }).finally(() => {
    svgPromiseMap.delete(key);
  });
  return p;
}

// size → rem 字符串;数字(设计画布 px)兜底转换为 rem
function resolveSize(size) {
  if (typeof size === "number") {
    console.warn(`[Icon] size=${size} is a number — use rem string instead (e.g. size="${(size / 16).toFixed(4).replace(/\.?0+$/, "")}rem")`);
    const rootFontSize = getRootFontSize();
    const rem = size / rootFontSize;
    return `${parseFloat(rem.toFixed(4))}rem`;
  }
  return size;
}

// Lucide 离线渲染(表数据由 build 时注入);名称不在表内返回 null
function lucideSvg(vm) {
  const nodes = lookupIcon(vm.name);
  if (!nodes) return null;
  return h(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: vm.resolvedSize,
      height: vm.resolvedSize,
      viewBox: "0 0 24 24",
      fill: "none",
      "stroke-width": vm.strokeWidth,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      id: vm.id || undefined,
      title: vm.title || undefined,
      style: { stroke: vm.color || "currentColor", ...vm.cursorStyle },
    },
    nodes.map(([tag, attrs], i) => h(tag, { key: i, ...attrs }))
  );
}

export const Icon = {
  name: "Icon",
  props: {
    name: { type: String, default: "" },
    // 用户自带资源(svg/png/jpg)相对路径 — 设置时优先于 name
    src: { type: String, default: "" },
    // rem 字符串,如 "0.875rem";数字会告警并按设计画布 px 兜底换算
    size: { type: [String, Number], default: "1rem" },
    // 6 位 hex,如 "#0067D1";缺省继承父元素计算色(仅 icon-plus 模式)
    color: { type: String, default: "" },
    strokeWidth: { type: [String, Number], default: 2 },
    variant: { type: String, default: "lined" },
    title: { type: String, default: "" },
    id: { type: String, default: "" },
  },
  data() {
    return {
      plus: plusState, // 复用已探测结果
      svg: "",
      inheritedColor: null,
    };
  },
  computed: {
    resolvedSize() {
      return resolveSize(this.size);
    },
    effectiveColor() {
      return this.color || this.inheritedColor;
    },
    svgKey() {
      return `${this.name}&${this.variant}&${this.effectiveColor}&${this.size}`;
    },
    // 图标可点击(父级传了 @click)时给指针形态
    cursorStyle() {
      return this.$attrs.onClick ? { cursor: "pointer" } : null;
    },
  },
  watch: {
    svgKey: {
      immediate: true,
      handler() {
        this.load();
      },
    },
    plus() {
      this.load();
    },
  },
  mounted() {
    this.bindColorObserver();
    this.readColor();
  },
  updated() {
    // 每次重渲染读取父元素计算色(覆盖无 transition 的场景)
    this.readColor();
  },
  beforeUnmount() {
    this.unbindColorObserver();
  },
  methods: {
    async load() {
      if (this.src) return; // 用户资源模式:无需网络
      const ok = await ensurePlus();
      this.plus = ok;
      if (!ok) return; // getConfig 探测失败 → Lucide 回退分支
      const key = this.svgKey;
      if (svgCache.has(key)) {
        this.svg = svgCache.get(key);
        return;
      }
      const s = await fetchSvg(this.name, this.variant, this.effectiveColor, this.size);
      if (s) this.svg = s; // 空结果(失败)不写入 state,允许下次重试
    },
    // 仅 icon-plus 模式(plus 就绪、非 src、无显式 color)需要继承父元素颜色
    readColor() {
      if (this.src || this.plus !== true || this.color) return;
      const el = this.$el;
      if (!el || !el.getBoundingClientRect) return;
      const hex = rgbToHex(getComputedStyle(el).color);
      if (hex && hex !== this.inheritedColor) this.inheritedColor = hex;
    },
    // 主题切换时 <html> class 变化不触发组件重渲染,需 MutationObserver 主动监听。
    // EP Button 等组件有 color transition,getComputedStyle 在过渡期返回中间色值;
    // 立即读一次覆盖无 transition 的图标,300ms 后再读一次覆盖带 transition 的图标。
    bindColorObserver() {
      if (typeof document === "undefined") return;
      this._iconTimer = null;
      this._iconMo = new MutationObserver(() => {
        this.readColor();
        if (this._iconTimer) clearTimeout(this._iconTimer);
        this._iconTimer = setTimeout(() => this.readColor(), 300);
      });
      this._iconMo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    },
    unbindColorObserver() {
      if (this._iconMo) this._iconMo.disconnect();
      if (this._iconTimer) clearTimeout(this._iconTimer);
    },
  },
  render() {
    // class/style/@click 等透传到根元素(Vue 默认 attrs 继承)

    // 用户自带资源 — <img>
    if (this.src) {
      return h("img", {
        src: this.src,
        id: this.id || undefined,
        width: this.resolvedSize,
        height: this.resolvedSize,
        alt: "",
        "aria-hidden": "true",
        title: this.title || undefined,
        style: { display: "inline-block", verticalAlign: "middle", ...this.cursorStyle },
      });
    }

    // 探测未完成 → 不渲染
    if (this.plus === null) return null;

    // icon-plus 不可用(离线) → Lucide 回退
    if (this.plus === false) {
      return lucideSvg(this);
    }

    // icon-plus 可用但该名称未取到(匹配失败/请求失败)→ Lucide 兜底渲染,
    // 避免在线模式下低命中名(如 boxes/bot 等工程名)渲染为空白
    if (!this.svg) {
      const lucideFallback = lucideSvg(this);
      if (lucideFallback) return lucideFallback;
      return h("span", {
        id: this.id || undefined,
        "aria-hidden": "true",
        title: this.title || undefined,
        style: {
          display: "inline-block",
          width: this.resolvedSize,
          height: this.resolvedSize,
          ...this.cursorStyle,
        },
      });
    }

    // icon-plus 可用 → 注入拉取的 SVG 文本(宽高只在包装 span 上)
    return h("span", {
      id: this.id || undefined,
      "aria-hidden": "true",
      title: this.title || undefined,
      style: {
        display: "inline-block",
        width: this.resolvedSize,
        height: this.resolvedSize,
        ...this.cursorStyle,
      },
      innerHTML: this.svg,
    });
  },
};
