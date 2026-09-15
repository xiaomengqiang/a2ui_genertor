import React, { useState, useEffect } from "react";

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

// ---- icon-plus (联通) online flow, same as packages/previewpc ----
const ICON_API_BASE = "https://octo.hdesign.huawei.com";
const GET_CONFIG = `${ICON_API_BASE}/assetRepository/iconPlus/getConfig`;
const GET_ICON_INFO = `${ICON_API_BASE}/assetRepository/iconPlus/getIconInfo`;
const GET_ICON = `${ICON_API_BASE}/assetRepository/iconPlus/getIcon`;

let plusState = null; // null = probing, true = icon-plus available, false = fall back to Lucide
let plusPromise = null; // singleton getConfig probe promise
let iconConfig = null;
let defaultColorId = "";
const iconInfoMap = {}; // name -> { name, url }
const svgCache = new Map(); // "name&variant&color" -> svg text

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

// name -> { name, url } via getIconInfo (cached in iconInfoMap)
async function resolveIconInfo(name) {
  if (iconInfoMap[name]) return iconInfoMap[name];
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
}

// fetch the SVG text for a name via getIcon (url + size + variant + colorId + fileType=svg)
async function fetchSvg(name, variant, colorHex) {
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
}

export function Icon({
  name,
  src,
  size = 16,
  color,
  className = "",
  style,
  strokeWidth = 2,
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
      if (!ok) return; // getConfig probe failed → Lucide branch
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

  // probe not finished yet → render nothing
  if (plus === null) return null;

  // icon-plus unavailable (offline) → Lucide fallback (original behavior)
  if (plus === false) {
    const nodes = lookupIcon(name);
    if (!nodes) return null;
    return React.createElement(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        strokeWidth: strokeWidth,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: className,
        "aria-hidden": true,
        style: { ...style, stroke: color || "currentColor" },
      },
      nodes.map(([tag, attrs], i) =>
        React.createElement(tag, { key: i, ...attrs })
      )
    );
  }

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
