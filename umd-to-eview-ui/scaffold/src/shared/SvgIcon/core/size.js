/** 尺寸与线宽：尺寸归一化与自动线宽映射 */

const GIVEN_PX = [8, 10, 12, 14, 16, 20, 24, 32, 36, 40, 48, 60];
const GIVEN_REM = [0.5, 0.625, 0.75, 0.875, 1, 1.25, 1.5, 2, 2.25, 2.5, 3, 3.75];

/** size → 自动线宽映射表（含 rem 档位） */
export const SIZE_TO_WEIGHT_MAP = {
  '0.75': 4,
  '0.875': 3.42,
  '1': 3,
  '1.25': 3.6,
  '1.5': 3,
  '2': 3,
  '2.25': 2.66,
  '2.5': 2.4,
  '3': 3,
  '3.75': 2.4,
  '12': 4,
  '14': 3.42,
  '16': 3,
  '20': 3.6,
  '24': 3,
  '32': 3,
  '36': 2.66,
  '40': 2.4,
  '48': 3,
  '60': 2.4,
};

const PERCENT_RE = /^(?!\.?$)\d{1,3}(\.\d+)?%$/;
const UNIT_RE = /^\d+(\.\d+)?(rem|px)$/;
const NUM_RE = /^\d+$/;

function clamp(value, arr) {
  return Math.min(Math.max(value, arr[0]), arr[arr.length - 1]);
}

function nearestOf(num, arr) {
  let minDiff = Infinity;
  let nearest = arr[0];
  for (const item of arr) {
    const diff = Math.abs(num - item);
    if (diff < minDiff) {
      minDiff = diff;
      nearest = item;
    }
  }
  return nearest;
}

/** 归一化尺寸，取最近标准档位 */
export function formatIconSize(value) {
  const raw = String(value ?? '').trim();
  let num;
  let pool;

  if (PERCENT_RE.test(raw)) {
    num = Number(raw.replace('%', '')) / 100 * 60;
    pool = GIVEN_PX;
  } else if (UNIT_RE.test(raw)) {
    const isRem = raw.endsWith('rem');
    num = Number(raw.replace(/rem|px/, ''));
    pool = isRem ? GIVEN_REM : GIVEN_PX;
  } else if (NUM_RE.test(raw)) {
    num = Number(raw);
    pool = GIVEN_PX;
  } else {
    return null;
  }
  return nearestOf(clamp(num, pool), pool);
}

/**
 * 解析用户 size → 三种表示：
 * - attrValue：写入 svg width/height 属性（<8 按 rem 处理）
 * - nearest：查 weight 表用的档位键
 * - cssValue：外层容器的 css 宽高
 */
export function resolveSize(value, defaultValue = 16) {
  const nearest = formatIconSize(value ?? defaultValue) ?? formatIconSize(defaultValue) ?? 16;
  const num = Number(nearest);
  if (num < 8) {
    // rem 档位：attr 直接用 rem 字符串
    return { attrValue: `${nearest}rem`, nearest: `${nearest}`, cssValue: `${nearest}rem` };
  }
  return { attrValue: String(num), nearest: `${num}`, cssValue: `${num}px` };
}

/** 按尺寸取默认线宽（显式 weight 优先） */
export function resolveWeight(size, weight) {
  if (weight !== undefined && weight !== null && weight !== '') {
    const n = Number(weight);
    if (!Number.isNaN(n) && n > 0) return n;
  }
  return SIZE_TO_WEIGHT_MAP[size.nearest] ?? SIZE_TO_WEIGHT_MAP['16'] ?? 3;
}
