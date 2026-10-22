import EvTag from "@nce/eview-react/Tag";
import "./Tag.css";

// antd 颜色 → Tag.css className token（词汇来自 Tag.css：info/error/alert/warning/success/default/green/rose/pink/purple/indigo/cyan/disabled）
// 仅收录 ant.css 第 1695 行起已定义的预设色/状态色，严格对齐 antd 5.29.3 + ant.css 参考。
const TOKEN_MAP = {
  // antd 状态色
  success: "success",
  error: "error",
  warning: "warning",
  processing: "info",
  danger: "error", // danger 非标准 Tag 色，作 error 别名保留（无害）
  // antd 预设色（ant.css 已定义 → token）
  gold: "alert",
  green: "green",
  magenta: "rose",
  pink: "pink",
  purple: "purple",
  geekblue: "indigo",
  cyan: "cyan",
};

// ant.css 未定义的 antd 预设色 → eview 无对应 token，按「自定义颜色」处理，采用 antd 5.x 色值，
// 走 outline 态 inline style（{color, 浅 alpha 背景, 同色边框}），与 ant.css 的浅色态视觉一致。
const ANT_PRESET_HEX = {
  red: "#f5222d",
  volcano: "#fa541c",
  orange: "#fa8c16",
  lime: "#a0d911",
  blue: "#1677ff",
};

// hex → rgba（用于未映射预设色的浅色 alpha 背景/边框）
function hexToRgba(hex, alpha) {
  const h = String(hex).replace("#", "");
  const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// 把 antd color 解析为三种结果之一：
//  - { token }         已映射预设色/状态色 → Tag.css className token（浅色 fill 态）
//  - { presetStyle }   未映射 antd 预设色（red/volcano/orange/lime/blue）→ antd 色值 outline inline style
//  - { customColor }   用户手传的 hex/rgb/hsl/命名色 → solid 实心背景（antd 5 行为）
//  - {}                default / 不传 → base 灰底
function resolveColor(color) {
  if (color == null) return {};
  const k = String(color).toLowerCase();
  if (TOKEN_MAP[k]) return { token: TOKEN_MAP[k] };
  if (k === "default") return {}; // default → base 灰底
  if (ANT_PRESET_HEX[k]) {
    const hex = ANT_PRESET_HEX[k];
    return {
      presetStyle: {
        color: hex,
        background: hexToRgba(hex, 0.1),
        border: `1px solid ${hexToRgba(hex, 0.4)}`,
      },
    };
  }
  return { customColor: color }; // 自定义 CSS 色 → solid 实心背景 + 白字（antd 5 行为）
}

/**
 * 包壳 Tag：props 按 antd 5.29.3 原样传入，内部适配到 @nce/eview-react/Tag。
 * （import 已别名 EvTag，故包装器可命名为 Tag，无命名冲突。）
 *
 * antd 5.29.3 API：color / bordered / closable / onClose / closeIcon / icon / children
 *                  + 原生 DOM（onClick / style / className / id）。
 * color 解析（见 resolveColor）：
 *   - 已映射预设色/状态色 → Tag.css className token + ev_tag_fill（浅色态，由 Tag.css 配色，对齐 ant.css）
 *   - 未映射预设色（red/volcano/orange/lime/blue）→ antd 色值 outline inline style（color + 浅 alpha 背景 + 同色边框）
 *   - 自定义 hex/rgb/hsl → solid 实心背景 + 白字（走 style）
 *   - default / 不传 → base 灰底
 * eview 无 fill/bordered 概念（只有 solid/outline 视觉态，由 ev_tag_fill + Tag.css 模拟），bordered/fill 接收但忽略；
 * icon（组件节点）前置到 children（eview iconName 不渲染组件图标）；closable/onClose 原样透传；closeIcon 丢弃。
 * round/size/tagIconProps 等经 ...rest 原样透传给 eview。
 */
export default function Tag({
  // —— antd 原样 prop ——
  color,
  bordered: _bordered, // eview 无 bordered 概念，接收但忽略（边框由 Tag.css / inline style 处理）
  closable,
  onClose,
  closeIcon: _closeIcon, // eview 无 closeIcon，丢弃不透传
  icon,
  onClick,
  style,
  className,
  id,
  children,
  // —— eview 内部 prop（icon 路径已弃用，摘出避免透传给 eview 触发其不渲染组件图标的逻辑）——
  fill: _fill,               // eview 无 fill 概念，丢弃（solid/outline 由 ev_tag_fill + Tag.css 模拟）
  ...rest // round / size / tagIconProps 等原样透传
} = {}) {
  const { token, presetStyle, customColor } = resolveColor(color);

  // 仅已映射 token 色加 ev_tag_fill（走 Tag.css 浅色态）；preset/custom 不加，落到 base + inline style。
  const keepEvFill = token != null;

  // className：token + ev_tag_fill（仅 token 色）+ 用户 className
  const cls = [
    token,
    keepEvFill ? "ev_tag_fill" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // style 合并：未映射预设色 → outline（color/背景/边框）；自定义色 → solid 实心背景 + 白字；否则原样
  let evStyle = style;
  if (presetStyle) {
    evStyle = { ...presetStyle, ...style };
  } else if (customColor != null) {
    evStyle = { background: customColor, color: "#fff", ...style };
  }

  // icon 作为组件节点时 eview iconName 不渲染，改为前置到 children
  const content = icon != null ? <>{icon}{children}</> : children;

  return (
    <EvTag
      closable={closable}
      onClose={onClose}
      onClick={onClick}
      style={evStyle}
      className={cls || undefined}
      id={id}
      {...rest}
    >
      {content}
    </EvTag>
  );
}
