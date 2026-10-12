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
 * 映射：color→Tag.css token；bordered/fill→eview fill（显式变体时移除 ev_tag_fill，否则 ev_tag_fill 默认存在）；非状态色（自定义 CSS 色）也移除 ev_tag_fill 走 style；
 *       icon→iconName（+isMessageTag/hasIcon）；closable/onClose 原样透传；closeIcon 丢弃。
 * fill/isMessageTag/hasIcon 从 rest 摘出作逃生口（显式传值覆盖派生）；
 * round/size/tagIconProps 等经 ...rest 原样透传给 eview。
 */
export default function Tag({
  // —— antd 原样 prop ——
  color,
  bordered,
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
  fill,
  isMessageTag,
  hasIcon,
  ...rest // round / size / tagIconProps 等原样透传
} = {}) {
  const { token, customColor } = resolveColor(color);

  // 解析 eview fill：fill 逃生口优先 → bordered（true→outline / false→solid）→ 否则不传
  let evFill;
  if (fill === "outline" || fill === "solid") evFill = fill;
  else if (bordered === true) evFill = "outline";
  else if (bordered === false) evFill = "solid";

  // ev_tag_fill（Tag.css 的"填充/浅色"态）默认存在；仅在显式变体（fill 或 bordered）
  // 或非状态色（无 token）时移除——此时改由 eview fill prop / 自定义 style 接管
  const fillExplicit = evFill != null;
  const keepEvFill = !fillExplicit && token != null;

  // className：token + 默认态加 ev_tag_fill + 用户 className
  const cls = [
    token,
    keepEvFill ? "ev_tag_fill" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // 自定义 CSS 色走 style（outline→文字/边框色，solid→背景色）
  let evStyle = style;
  if (customColor != null) {
    evStyle = {
      ...(evFill === "outline"
        ? { color: customColor, borderColor: customColor }
        : { background: customColor }),
      ...style,
    };
  }

  // icon 由调用方按 antd 传入（icon+ 组件节点），原样塞进 eview iconName 槽
  const hasIconProp = icon != null;

  return (
    <EvTag
      fill={evFill}
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
