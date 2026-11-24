/**
 * LZW 解压 + 键名优化还原。
 * rule-config 属性值 = JSON 字符串 LZW 压缩后逐字符取 charCode 的十进制逗号串。
 */

function lzwUnpack(input) {
  if (!Array.isArray(input)) return null;
  let i;
  const dict = [];
  let w;
  let k;
  let entry = '';
  let result = '';
  let dictSize = 256;
  for (i = 0; i < 256; i += 1) dict[i] = String.fromCharCode(i);
  w = String.fromCharCode(input[0]);
  result = w;
  for (i = 1; i < input.length; i += 1) {
    k = input[i];
    if (dict[k]) {
      entry = dict[k];
    } else if (k === dictSize) {
      entry = w + w.charAt(0);
    } else {
      return null;
    }
    result += entry;
    dict[dictSize++] = w + entry.charAt(0);
    w = entry;
  }
  return result;
}

/** 还原键名优化：{ __k: [键名...], __v: {索引: 值} } → 正常对象 */
function keyOptimizeUnpack(data) {
  const keys = data && data.__k;
  if (!keys || !Array.isArray(keys)) return data;
  const walk = (value) => {
    if (typeof value !== 'object' || value === null) return value;
    if (Array.isArray(value)) return value.map(walk);
    const out = {};
    for (const idx of Object.keys(value)) {
      const key = keys[Number(idx)];
      if (key !== undefined) {
        out[key] = walk(value[idx]);
      }
    }
    return out;
  };
  return walk(data.__v);
}

/** 解码 rule-config 字符串 → JSON 对象 */
export function decodeRuleConfig(raw) {
  if (!raw) return {};
  try {
    const codes = raw.split(',').map((s) => parseInt(s, 10));
    const unpacked = lzwUnpack(codes);
    if (!unpacked) return {};
    try {
      const parsed = JSON.parse(unpacked);
      if (typeof parsed === 'object' && parsed !== null) {
        return keyOptimizeUnpack(parsed);
      }
      return {};
    } catch {
      return {};
    }
  } catch {
    return {};
  }
}
