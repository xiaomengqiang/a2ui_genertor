/** 颜色工具：颜色识别与格式归一化 */

const HEX_RE = /^#([0-9a-f]{3}){1,2}$/;
const RGBA_RE = /^rgba?\((\d{1,3}),(\d{1,3}),(\d{1,3})(,([\d.]+))?\)$/;
const HSLA_RE = /^hsla?\((\d{1,3}),([\d.]+)%,([\d.]+)%(,([\d.]+))?\)$/;
const HSVA_RE = /^hsva?\((\d{1,3}),([\d.]+)%,([\d.]+)%(,([\d.]+))?\)$/;
/** 可识别 hex/rgb/rgba（供 attr 值分类判断） */
const IS_COLOR_RE =
  /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$|^(rgb)\(\s*(\d+%?|\d+\.\d+%?)\s*,\s*(\d+%?|\d+\.\d+%?)\s*,\s*(\d+%?|\d+\.\d+%?)\s*\)$|^(rgba)\(\s*(\d+%?|\d+\.\d+%?)\s*,\s*(\d+%?|\d+\.\d+%?)\s*,\s*(\d+%?|\d+\.\d+%?)\s*,\s*(\d+\.\d+|\d+%)\s*\)$/i;
const IS_HEX_COLOR_RE = /^#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?$/;

export function isColor(value) {
  return typeof value === 'string' && IS_COLOR_RE.test(value);
}

export function isHexColor(value) {
  return typeof value === 'string' && IS_HEX_COLOR_RE.test(value);
}

function hueToRgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

/** rgb() → #RRGGBB；其他原样返回 */
export function convertColorFormat(value) {
  if (value.startsWith('rgb')) {
    const nums = value.match(/\d+/g) || [];
    const to2 = (n) => Math.round(n).toString(16).padStart(2, '0');
    const r = Math.max(0, Math.min(255, Number(nums[0])));
    const g = Math.max(0, Math.min(255, Number(nums[1])));
    const b = Math.max(0, Math.min(255, Number(nums[2])));
    return `#${to2(r)}${to2(g)}${to2(b)}`;
  }
  return value;
}

/**
 * 颜色归一化为 hex（支持 #hex / rgb() / hsl() / hsv()）。
 * 无法识别的字符串（如 'red'、'currentColor'）原样返回，SVG 可直接使用。
 */
export function colorToHex(value) {
  if (!value || typeof value !== 'string') return '';
  let color = value.trim().replace(/\s/g, '').toLowerCase();
  let matches = null;

  if (HEX_RE.test(color)) return color;

  if ((matches = color.match(RGBA_RE))) {
    const r = parseInt(matches[1], 10);
    const g = parseInt(matches[2], 10);
    const b = parseInt(matches[3], 10);
    const a = matches[5] ? parseFloat(matches[5]) : 1;
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}${Math
      .round(a * 255)
      .toString(16)
      .padStart(2, '0')}`;
  }

  if ((matches = color.match(HSLA_RE))) {
    const h = parseInt(matches[1], 10) / 360;
    const s = parseInt(matches[2], 10) / 100;
    const l = parseInt(matches[3], 10) / 100;
    const a = matches[5] ? parseFloat(matches[5]) : 1;
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const r = Math.round(hueToRgb(p, q, h + 1 / 3) * 255);
    const g = Math.round(hueToRgb(p, q, h) * 255);
    const b = Math.round(hueToRgb(p, q, h - 1 / 3) * 255);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}${Math
      .round(a * 255)
      .toString(16)
      .padStart(2, '0')}`;
  }

  if ((matches = color.match(HSVA_RE))) {
    const h = parseInt(matches[1], 10) / 360;
    const s = parseInt(matches[2], 10) / 100;
    const v = parseInt(matches[3], 10) / 100;
    const a = matches[5] ? parseFloat(matches[5]) : 1;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    const rgb = [v, q, p, p, t, v][i];
    const r = Math.round(rgb * 255);
    const g = Math.round([t, v, v, q, p, p][i] * 255);
    const b = Math.round([p, p, t, v, v, q][i] * 255);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}${Math
      .round(a * 255)
      .toString(16)
      .padStart(2, '0')}`;
  }

  return color;
}

/** 用户传入 color 参数 → 统一为颜色数组（主色/副色/第三色） */
export function normalizeColors(color) {
  if (!color) return ['currentColor'];
  const list = Array.isArray(color) ? color : [color];
  const out = list.filter((c) => !!c).map((c) => colorToHex(c));
  return out.length ? out : ['currentColor'];
}
