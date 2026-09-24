import React, { useState, useEffect } from "react";

// Icon — icon-plus 在线图标组件（内网环境，icon-plus 恒可达，无离线兜底）
// 渲染时按 name 查 icon-plus 接口取 SVG 文本注入；config 单例缓存色板/样式。

const ICON_API_BASE = "https://octo.hdesign.huawei.com";
const GET_CONFIG = `${ICON_API_BASE}/assetRepository/iconPlus/getConfig`;
const GET_ICON_INFO = `${ICON_API_BASE}/assetRepository/iconPlus/getIconInfo`;
const GET_ICON = `${ICON_API_BASE}/assetRepository/iconPlus/getIcon`;

let plusState = null; // null = probing, true = ready, false = probe failed
let plusPromise = null; // singleton getConfig probe promise
let iconConfig = null;
let defaultColorId = "";
const iconInfoMap = {}; // name -> { name, url } (结果缓存)
const iconInfoPromiseMap = {}; // name -> 进行中 Promise (in-flight 去重)
const svgCache = new Map(); // "name&variant&color" -> svg text (结果缓存)
const svgPromiseMap = new Map(); // "name&variant&color" -> 进行中 Promise (in-flight 去重)

// variant prop -> getConfig style key (matches previewpc's shapeToStyleKey)
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

// resolve an API color id from the requested hex against getConfig colors
function resolveColorId(variant, colorHex) {
  const styleValue = getStyleValue(STYLE_KEY[variant] || "border");
  const colors = (iconConfig?.colors || []).filter((c) => c.style === styleValue);
  if (colorHex) {
    const m = colors.find((c) =>
      c.value.split(",").map((v) => v.trim()).includes(colorHex)
    );
    if (m) return m.id;
  }
  return defaultColorId || colors[0]?.id || "";
}

// getConfig probe == 联通可用性验证 (same as previewpc fetchIconConfig)
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
      defaultColorId =
        linear?.id || iconConfig.colors?.[0]?.id || "";
      plusState = true;
      return true;
    } catch (e) {
      plusState = false;
      return false;
    }
  })();
  return plusPromise;
}

// pick the best icon-plus match for a keyword (prefer system-icon group, then name contains keyword, else first)
function selectBestIcon(icons, keyword) {
  return (
    icons.find(
      (i) => Array.isArray(i.group) && i.group.some((g) => g.includes("系统图标"))
    ) ||
    icons.find((i) => i.name?.toLowerCase().includes(keyword.toLowerCase())) ||
    icons[0]
  );
}

// name -> { name, url } via getIconInfo (结果缓存在 iconInfoMap；并发去重靠 iconInfoPromiseMap)
async function resolveIconInfo(name) {
  if (iconInfoMap[name]) return iconInfoMap[name];
  // 同 name 并发请求共享同一个进行中 Promise，避免 N 个相同图标各发一次 getIconInfo
  if (iconInfoPromiseMap[name]) return iconInfoPromiseMap[name];
  const p = (async () => {
    try {
      const resp = await fetch(
        `${GET_ICON_INFO}?keyword=${encodeURIComponent(name)}&topK=2&source_id=6`
      );
      const data = await resp.json(); // [{ keyword, icons: [{ icon_id, name, category, group[], url }] }]
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
  // 落定后清除 in-flight 条目（失败也清除，允许下次重试，不永久缓存 rejected 结果）
  p.finally(() => {
    delete iconInfoPromiseMap[name];
  });
  return p;
}

// fetch the SVG text for a name via getIcon (url + size + variant + colorId + fileType=svg)
// 结果缓存在 svgCache；并发去重靠 svgPromiseMap，相同 key 共享同一进行中 Promise
function fetchSvg(name, variant, colorHex) {
  const key = `${name}&${variant}&${colorHex}`;
  if (svgCache.has(key)) return Promise.resolve(svgCache.get(key));
  if (svgPromiseMap.has(key)) return svgPromiseMap.get(key);
  const p = (async () => {
    const info = await resolveIconInfo(name);
    if (!info) return "";
    const styleValue = getStyleValue(STYLE_KEY[variant] || "border");
    const colorId = resolveColorId(variant, colorHex);
    try {
      const resp = await fetch(
        `${GET_ICON}?url=${encodeURIComponent(info.url)}&size=16&style=${encodeURIComponent(
          styleValue
        )}&color=${encodeURIComponent(colorId)}&fileType=svg`
      );
      const data = await resp.json(); // { url, name, data } or array
      const item = Array.isArray(data) ? data[0] : data;
      return item?.data || ""; // raw SVG text, injected as-is
    } catch (e) {
      return "";
    }
  })();
  svgPromiseMap.set(key, p);
  // 落定后写入结果缓存并清除 in-flight 条目（失败也清除，允许下次重试）
  p.then((s) => {
    svgCache.set(key, s);
  }).finally(() => {
    svgPromiseMap.delete(key);
  });
  return p;
}

export function Icon({
  name,
  src,
  size = 16,
  color,
  className = "",
  style,
  variant = "lined",
}) {
  const [plus, setPlus] = useState(plusState); // reuse already-probed result
  const [svg, setSvg] = useState(
    () => svgCache.get(`${name}&${variant}&${color}`) || ""
  );

  useEffect(() => {
    if (src) return; // user-asset mode: no network needed
    let alive = true;
    ensurePlus().then((ok) => {
      if (!alive) return;
      setPlus(ok);
      if (!ok) return; // probe failed → render nothing (internal network assumed)
      const key = `${name}&${variant}&${color}`;
      if (svgCache.has(key)) {
        setSvg(svgCache.get(key));
        return;
      }
      fetchSvg(name, variant, color).then((s) => {
        if (!alive) return;
        svgCache.set(key, s);
        setSvg(s);
      });
    });
    return () => {
      alive = false;
    };
  }, [src, name, variant, color]);

  // user-provided asset (svg/png/jpg) via relative path — overrides name when both are set
  if (src) {
    return React.createElement("img", {
      src: src,
      width: size,
      height: size,
      className: className,
      alt: "",
      "aria-hidden": true,
      style: { ...style, display: "inline-block", verticalAlign: "middle" },
    });
  }

  // probe not finished yet, or probe failed → render nothing
  if (plus !== true) return null;

  // icon-plus available → render fetched SVG text as-is (only width/height on the wrapper)
  if (!svg) {
    return React.createElement("span", {
      className,
      "aria-hidden": true,
      style: { ...style, width: size, height: size },
    });
  }

  return React.createElement("span", {
    className,
    "aria-hidden": true,
    style: { ...style, width: size, height: size },
    dangerouslySetInnerHTML: { __html: svg },
  });
}
