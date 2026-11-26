/**
 * SVG 模板 transform 管线。
 *
 * 模板 SVG 特征：根节点带 rule-id 与 rule-config（LZW 压缩 JSON）。
 * rule-config 结构：{ rule: { [ruleId]: { attr: 基准值 } }, [style]: { [ruleId]: { attr: 差异值 } } }
 * 其中可变颜色的值形如 ['__COLOR__', index]，index 对应用户颜色数组下标；
 * '__EMPTY__' 表示移除该属性。
 */

import { decodeRuleConfig } from './lzw.js'
import { colorToHex, isColor, isHexColor, normalizeColors } from './color.js';
import { resolveSize, resolveWeight } from './size.js';

/** 图标类型 → 模板风格名 */
export const ICON_TYPE_TO_STYLE = {
  lined: 'border',
  filled: 'filled',
  'lined-twotone': 'two_colors1',
  'filled-twotone': 'two_colors2',
  'round-bg': 'round_bottom2',
  'square-bg': 'square_bottom2',
};

const RULE_ID_ATTR = 'rule-id';
const RULE_CONFIG_ATTR = 'rule-config';
const SVGJS_ATTR = 'xmlns:svgjs';
const EMPTY = '__EMPTY__';
const COLOR_TAG = '__COLOR__';

/** 面性描边映射 */
export const DEFAULT_FILLED_TRANSFORM_MAP = [
  { defaultColor: '#FFFFFF', initialColor: '#FFFFFF', transformColor: '#000000' },
  { defaultColor: '#8ABEF3', initialColor: '#FFFFFF', transformColor: '#000000' },
  { defaultColor: '#939393', initialColor: '#FFFFFF', transformColor: '#000000' },
]

export function createSvgDom(svgXml) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgXml, 'image/svg+xml');
  const el = doc.documentElement;
  if (!el || el.nodeName.toLowerCase() === 'parsererror') {
    throw new Error('[svg-icon] Invalid SVG source');
  }
  return el;
}

/** 按 rule-id 查找节点 */
function findDomByRule(root, ruleId) {
  return root.querySelector(`[${RULE_ID_ATTR}="${ruleId}"]`);
}

/**
 * 将 rule 表展开为 attr 修改表：
 * 返回 { [ruleId]: { [attr]: value | null } }，null 表示移除属性。
 */
function buildAttrMap(ruleData, colors, style, transformColorMap) {
  const out = {};
  for (const ruleId of Object.keys(ruleData)) {
    const attrs = ruleData[ruleId];
    if (!attrs || typeof attrs !== 'object') continue;
    const styledMap = {};
    for (const attr of Object.keys(attrs)) {
      let value = attrs[attr];
      if (value === undefined || value === null) continue;

      // filled 描边色替换：attr 值为 initialColor 且用户色命中 defaultColor
      if (transformColorMap.length && typeof value === 'string' && isColor(value)) {
        const formatted = colorToHex(value);
        for (const userColor of colors) {
          for (const map of transformColorMap) {
            if (
              formatted.toLowerCase() === map.initialColor.toLowerCase() &&
              userColor.toLowerCase() === map.defaultColor.toLowerCase()
            ) {
              value = map.transformColor;
            }
          }
        }
      }

      if (value === EMPTY) {
        styledMap[attr] = null;
      } else if (Array.isArray(value)) {
        // ['__COLOR__', index] → 用户色
        const idx = value[1];
        if (colors[idx]) {
          const c = colors[idx];
          styledMap[attr] = isHexColor(c) ? c.toUpperCase() : c;
        }
      } else if (typeof value === 'string' || typeof value === 'number') {
        let v = String(value);
        if (isHexColor(v)) v = v.toUpperCase();
        styledMap[attr] = v;
      }
    }
    out[ruleId] = styledMap;
  }
  return out;
}

/** 按 attr 修改表写 DOM */
function applyAttrMap(root, attrMap) {
  for (const ruleId of Object.keys(attrMap)) {
    const node = findDomByRule(root, ruleId);
    if (!node) continue;
    const attrs = attrMap[ruleId];
    for (const attr of Object.keys(attrs)) {
      const value = attrs[attr];
      if (value === null) {
        node.removeAttribute(attr);
      } else {
        node.setAttribute(attr, value);
      }
    }
  }
}

/** 递归替换 stroke-width */
function applyStrokeWidth(node, weight) {
  if (node.getAttribute('stroke-width')) {
    node.setAttribute('stroke-width', String(weight));
  }
  for (let i = 0; i < node.children.length; i += 1) {
    applyStrokeWidth(node.children[i], weight);
  }
}

/** 清理私有属性 */
function cleanupPrivateAttrs(root) {
  root.removeAttribute(RULE_CONFIG_ATTR);
  root.removeAttribute(SVGJS_ATTR);
  root.removeAttribute(RULE_ID_ATTR);
  const walk = (el) => {
    for (let i = 0; i < el.children.length; i += 1) {
      const child = el.children[i];
      child.removeAttribute(RULE_ID_ATTR);
      walk(child);
    }
  };
  walk(root);
}

/** 普通SVG（无 rule-config）兜底：把可见 fill/stroke 替换为主色 */
function fallbackRecolor(root, colors) {
  const primary = colors[0];
  const secondary = colors[1];
  const isIgnored = (v) =>
    /^(none|transparent|inherit|currentcolor)$/i.test(v) ||
    /^url\(/i.test(v);
  const walk = (el) => {
    if (el instanceof SVGUseElement) return;
    const fill = el.getAttribute('fill');
    if (fill && !isIgnored(fill) && !fill.startsWith('url(')) {
      el.setAttribute('fill', primary);
    }
    const stroke = el.getAttribute('stroke');
    if (stroke && !isIgnored(stroke) && !stroke.startsWith('url(')) {
      el.setAttribute('stroke', secondary || primary);
    }
    for (let i = 0; i < el.children.length; i += 1) walk(el.children[i]);
  };
  walk(root);
}

/**
 * 将模板/普通 SVG 转换为目标风格、颜色、尺寸的最终 SVG 字符串。
 * - 模板（带 rule-config）：完整支持 6 种 type 与多色
 * - 普通 SVG：仅做尺寸 + 主色兜底替换
 */

export function transformSvgSync(svgXml, options = {}) {
  const { type = 'lined', size, color, weight, filledStrokeColor = '#000000', cleanup = true } = options;
  const root = createSvgDom(svgXml);
  const sizeResult = resolveSize(size);
  const colors = normalizeColors(color);
  const realWeight = resolveWeight(sizeResult, weight);
  const style = ICON_TYPE_TO_STYLE[type] || ICON_TYPE_TO_STYLE.lined;
  // 尺寸：width/height 同步设置
  root.setAttribute('width', sizeResult.attrValue);
  root.setAttribute('height', sizeResult.attrValue);

  const ruleConfigRaw = root.getAttribute(RULE_CONFIG_ATTR);
  if (ruleConfigRaw) {
    const decoded = decodeRuleConfig(ruleConfigRaw);
    const baseRule = decoded.rule || {};
    const curRule = decoded[style] || {};

    const filledTransformMap = DEFAULT_FILLED_TRANSFORM_MAP.map((item) => ({
      ...item,
      transformColor: filledStrokeColor,
    }));

    // 先应用基准属性表（还原设计基准），再叠加当前风格差异
    applyAttrMap(root, buildAttrMap(baseRule, colors, style, filledTransformMap));
    if (Object.keys(curRule).length) {
      applyAttrMap(root, buildAttrMap(curRule, colors, style, filledTransformMap));
    }
  } else {
    fallbackRecolor(root, colors);
  }

  applyStrokeWidth(root, realWeight);
  if (cleanup) cleanupPrivateAttrs(root);

  return root.outerHTML;
}

/** SVG 字符串 → base64 data URL（使用 btoa） */
export function svgToBase64(svg) {
  const utf8Bytes = new TextEncoder().encode(svg);
  let binary = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < utf8Bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...Array.from(utf8Bytes.subarray(i, i + CHUNK)));
  }
  return `data:image/svg+xml;base64,${btoa(binary)}`;
}
