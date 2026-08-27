import React from "react";

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

export function Icon({ name, size = 16, color, className = "", strokeWidth = 2 }) {
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
      style: { stroke: color || "currentColor" },
    },
    nodes.map(([tag, attrs], i) => React.createElement(tag, { key: i, ...attrs }))
  );
}
