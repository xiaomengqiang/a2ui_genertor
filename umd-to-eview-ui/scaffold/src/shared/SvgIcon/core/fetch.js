/** SVG 加载与缓存 */
import { transformSvgSync, svgToBase64 } from './transform.js';

const svgCache = new Map();

/** 自定义加载器（SSR / 内网鉴权 / 反代场景可注入替换默认 fetch） */
let customLoader = null;

export function setSvgLoader(loader) {
  customLoader = loader;
}

function defaultLoader(src) {
  if (typeof fetch !== 'function') {
    return Promise.reject(new Error('[svg-icon] fetch is not available in this environment'));
  }
  const ICON_ORIGIN = 'https://octo.hdesign.huawei.com';
  return fetch(src.slice(ICON_ORIGIN.length), { credentials: 'include' }).then((res) => {
    if (!res.ok) {
      throw new Error(`[svg-icon] load failed: ${res.status} ${res.statusText} (${src})`);
    }
    return res.text();
  });
}

export function clearIconCache(src) {
  if (src) svgCache.delete(src);
  else {
    svgCache.clear();
    nameUrlCache.clear();
  }
}

/* ------------------------------------------------------------------ */
/* 图标名称 → URL 解析（assetRepository getIconInfo 接口）              */
/* ------------------------------------------------------------------ */

let iconApiConfig = {
  baseUrl: '/assetRepository/iconPlus/getIconInfo',
  sourceId: 6,
  topK: 2,
};

export function setIconApiConfig(config) {
  iconApiConfig = { ...iconApiConfig, ...config };
}

/**
 * 判断 src 是否为「图标名称」（交给 getIconInfo 接口解析）。
 * URL（http/https/协议相对）、路径（/、./、../、*.svg）、内联 <svg>、data: 均不视为名称。
 */
export function isIconName(src) {
  if (!src) return false;
  if (/^\s*<svg[\s>]/i.test(src)) return false;
  if (/^(https?:)?\/\//i.test(src)) return false;
  if (/^(data|blob|file):/i.test(src)) return false;
  if (/^[./]/.test(src)) return false;
  if (/\.svg(\?|#|$)/i.test(src)) return false;
  return /^[A-Za-z0-9_\-\u4e00-\u9fff]+( [A-Za-z0-9_\-\u4e00-\u9fff]+)*$/.test(src);
}

const nameUrlCache = new Map();

/** 从 getIconInfo 响应中取第一条图标的 url，兼容多种常见包裹结构 */
function pickFirstIconUrl(data) {
  const arr = Array.isArray(data) ? data : [data];
  for (const item of arr) {
    const icons = item?.icons;
    const first = Array.isArray(icons) ? icons[0] : undefined;
    if (typeof first?.url === 'string' && first.url) return first.url;
  }
  return undefined;
}

/** 图标名称 → 图标 URL（内存缓存，成功后本会话内不再请求；失败不缓存可重试） */
export function resolveIconUrl(name) {
  const cached = nameUrlCache.get(name);
  if (cached) return cached;
  const { baseUrl, sourceId, topK, pickIconUrl } = iconApiConfig;
  const api = `${baseUrl}?keyword=${encodeURIComponent(name)}&topK=${topK}&source_id=${sourceId}`;
  const loader = customLoader || defaultLoader;
  const p = loader(api)
    .then((text) => JSON.parse(text))
    .then((data) => {
      const url = pickIconUrl ? pickIconUrl(data) : pickFirstIconUrl(data);
      if (!url) throw new Error(`[svg-icon] getIconInfo 未命中图标: "${name}"`);
      return url;
    });
  p.catch(() => nameUrlCache.delete(name));
  nameUrlCache.set(name, p);
  return p;
}

/** 内联 SVG 字符串直接透传；URL/路径/图标名称走 loader 并缓存（成功后本会话内不再请求） */
export function fetchSvg(src) {
  if (!src) return Promise.reject(new Error('[svg-icon] src is required'));
  if (/^\s*<svg[\s>]/i.test(src)) return Promise.resolve(src);
  if (!svgCache.has(src)) {
    const loader = customLoader || defaultLoader;
    const actual = isIconName(src) ? resolveIconUrl(src) : Promise.resolve(src);
    svgCache.set(src, actual.then((url) => loader(url)).catch((err) => {
      svgCache.delete(src);
      throw err;
    }));
  }
  return svgCache.get(src);
}

/** 组合选项：type/size/color/weight */
export function resolveTransformOptions(options = {}) {
  return {
    type: options.type || 'lined',
    size: options.size,
    color: options.color,
    weight: options.weight,
    filledStrokeColor: options.filledStrokeColor || '#000000',
  };
}

/**
 * 加载并转换 SVG，返回最终 SVG 字符串。
 * @param src   图标名称（经 getIconInfo 解析）/ URL / 路径 / 内联 SVG 字符串
 * @param options type、size、color 等
 */
export async function getIconSvg(src, options) {
  const svgXml = await fetchSvg(src);
  return transformSvgSync(svgXml, resolveTransformOptions(options));
}

/**
 * 加载并转换 SVG，返回 base64 data URL（可直接用于 <img src> / 图标配置项）。
 */
export async function getIconBase64(src, options) {
  const svg = await getIconSvg(src, options);
  return svgToBase64(svg);
}
