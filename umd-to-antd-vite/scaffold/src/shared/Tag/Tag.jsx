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

// 匿名默认导出，避免与 import Tag 同名冲突；内部 <Tag> 即 eview Tag
export default function ({
  color,
  bordered,
  icon,
  closable,
  onClose,
  closeIcon: _closeIcon, // antd closeIcon 无 eview 对应项，丢弃不透传
  fill,
  round,
  size,
  onClick,
  isMessageTag,
  hasIcon,
  style,
  className,
  id,
  children,
  ...rest
}) {
  const { token, customColor } = resolveColor(color);

  // outline 判定：fill 优先 → bordered → 默认 solid
  let outline = false;
  if (fill === "outline") outline = true;
  else if (fill === "solid") outline = false;
  else if (bordered === true) outline = true;
  else if (bordered === false) outline = false;

  // className：token + outline 时加 ev_tag_fill（仅 token 色生效）+ 用户 className
  const cls = [
    token,
    outline && token ? "ev_tag_fill" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // 自定义 CSS 色走 style（outline→文字/边框色，solid→背景色）
  let evStyle = style;
  if (customColor != null) {
    evStyle = {
      ...(outline
        ? { color: customColor, borderColor: customColor }
        : { background: customColor }),
      ...style,
    };
  }

  // icon 由调用方传入 icon+ 组件节点，原样塞进 eview iconName 槽
  const hasIconProp = icon != null;

  return (
    <EvTag
      fill={outline ? "outline" : "solid"}
      round={round}
      size={size}
      onClick={onClick}
      isMessageTag={hasIconProp ? (isMessageTag ?? true) : isMessageTag}
      hasIcon={hasIconProp ? (hasIcon ?? true) : hasIcon}
      iconName={icon}
      closable={closable}
      onClose={onClose}
      style={evStyle}
      className={cls || undefined}
      id={id}
      {...rest}
    >
      {children}
    </EvTag>
  );
}
