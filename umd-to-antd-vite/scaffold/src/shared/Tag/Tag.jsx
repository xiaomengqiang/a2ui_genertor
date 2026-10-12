import EvTag from "@nce/eview-react/Tag";
import "./Tag.css";

// antd 颜色 → tag.css className token（词汇来自 tag.css：info/error/alert/warning/success/default/green/rose/pink/purple/indigo/cyan）
const TOKEN_MAP = {
  // antd 状态色
  success: "success",
  error: "error",
  warning: "warning",
  processing: "info",
  default: "default",
  danger: "error",
  // antd 预设色
  green: "green",
  lime: "green",
  red: "error",
  volcano: "error",
  magenta: "pink",
  pink: "pink",
  rose: "rose",
  orange: "alert",
  gold: "warning",
  yellow: "warning",
  cyan: "cyan",
  blue: "info",
  geekblue: "indigo",
  purple: "purple",
  indigo: "indigo",
};

// 把 antd color 解析为 tag.css token 或自定义 CSS 色（走 style）
function resolveColor(color) {
  if (color == null) return {};
  const k = String(color).toLowerCase();
  if (TOKEN_MAP[k]) return { token: TOKEN_MAP[k] };
  return { customColor: color }; // hex/rgb/hsl/命名色 → style
}

/**
 * 包壳 Tag：props 按 antd 原样传入，内部适配到 @nce/eview-react/Tag。
 * （import 已别名 EvTag，故包装器可命名为 Tag，无命名冲突。）
 *
 * antd API：color / bordered / closable / onClose / closeIcon / icon / children
 *           + 原生 DOM（onClick / style / className / id）。
 * 映射：color→Tag.css token；ev_tag_fill（浅色/outline 态）默认存在（状态色 token 时），非状态色（自定义 CSS 色）移除走 style（实心背景）；
 *       eview 无 fill/bordered 概念（只有 solid/outline 视觉态，由 ev_tag_fill+Tag.css 模拟），bordered/fill 接收但忽略；
 *       icon→iconName（+isMessageTag/hasIcon）；closable/onClose 原样透传；closeIcon 丢弃。
 * isMessageTag/hasIcon 从 rest 摘出作逃生口（显式传值覆盖派生）；
 * round/size/tagIconProps 等经 ...rest 原样透传给 eview。
 */
export default function Tag({
  // —— antd 原样 prop ——
  color,
  bordered: _bordered, // eview 无 bordered 概念，接收但忽略（边框由 Tag.css 透明处理）
  closable,
  onClose,
  closeIcon: _closeIcon, // eview 无 closeIcon，丢弃不透传
  icon,
  onClick,
  style,
  className,
  id,
  children,
  // —— eview 内部派生（摘出避免与下方计算值重复透传；显式传值作逃生口）——
  fill: _fill, // eview 无 fill 概念，丢弃（solid/outline 由 ev_tag_fill + Tag.css 模拟）
  isMessageTag,
  hasIcon,
  ...rest // round / size / tagIconProps 等原样透传
} = {}) {
  const { token, customColor } = resolveColor(color);

  // eview Tag 无 fill/bordered 概念，只有 solid/outline 视觉态——由 ev_tag_fill className + Tag.css 模拟。
  // ev_tag_fill（浅色/outline 态）默认存在（状态色 token 时）；仅非状态色（自定义 CSS 色）移除，改走 style。
  const keepEvFill = token != null;

  // className：token + 默认加 ev_tag_fill + 用户 className
  const cls = [
    token,
    keepEvFill ? "ev_tag_fill" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // 自定义 CSS 色走 style（实心背景）
  let evStyle = style;
  if (customColor != null) {
    evStyle = { background: customColor, ...style };
  }

  // icon 由调用方按 antd 传入（icon+ 组件节点），原样塞进 eview iconName 槽
  const hasIconProp = icon != null;

  return (
    <EvTag
      isMessageTag={hasIconProp ? (isMessageTag ?? true) : isMessageTag}
      hasIcon={hasIconProp ? (hasIcon ?? true) : hasIcon}
      iconName={icon}
      closable={closable}
      onClose={onClose}
      onClick={onClick}
      style={evStyle}
      className={cls || undefined}
      id={id}
      {...rest}
    >
      {children}
    </EvTag>
  );
}
