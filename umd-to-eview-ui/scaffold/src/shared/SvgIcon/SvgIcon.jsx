/**
 * SvgIcon 组件：
 * 接收 svg URL/路径/内联字符串/图标名称（keyword），按 type/color/size 渲染内联 svg 或 base64 img。
 *
 * props:
 * - src: 图标名称（经 getIconInfo 解析取第 1 条）/ URL / 本地路径 / 内联 SVG 字符串
 * - renderMode: 'svg' 内联（默认，currentColor 继承）| 'base64' 输出 img
 * - type: 'lined' | 'filled' | 'lined-twotone' | 'filled-twotone' | 'round-bg' | 'square-bg'
 * - size / color / weight / filledStrokeColor / rotate / spin / hoverColor / className / style / onClick
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  fetchSvg,
  resolveTransformOptions,
  resolveSize,
  transformSvgSync,
  svgToBase64,
} from './core/index.js';

export const SvgIcon = (props) => {
  const {
    src,
    renderMode = 'svg',
    type,
    size,
    color,
    weight,
    filledStrokeColor,
    rotate,
    spin,
    hoverColor,
    className,
    style,
    onClick,
    ...rest
  } = props;

  const mounted = useRef(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [svgXml, setSvgXml] = useState('');
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!src) return;
    let disposed = false;
    setLoading(true);
    setError(null);
    fetchSvg(src)
      .then((xml) => {
        if (!disposed && mounted.current) {
          setSvgXml(xml);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!disposed && mounted.current) {
          setError(err);
          setLoading(false);
        }
      });
    return () => {
      disposed = true;
    };
  }, [src]);

  const sizeResult = useMemo(() => resolveSize(size), [size]);

  // hover 色仅作用于单色类型（lined/filled）
  const isSingleType = type === 'filled' || type === undefined || type === 'lined';
  const activeColor = useMemo(() => {
    if (hovering && hoverColor && isSingleType) return hoverColor;
    return color;
  }, [hovering, hoverColor, isSingleType, color]);

  const inner = useMemo(() => {
    if (!svgXml) return '';
    const options = resolveTransformOptions({ type, size, color: activeColor, weight, filledStrokeColor });
    return transformSvgSync(svgXml, options);
  }, [svgXml, type, size, activeColor, weight, filledStrokeColor]);

  const wrapStyle = {
    display: 'inline-block',
    fontStyle: 'normal',
    lineHeight: 0,
    textAlign: 'center',
    cursor: onClick ? 'pointer' : 'inherit',
    width: sizeResult.cssValue,
    height: sizeResult.cssValue,
    ...style,
  };
  if (rotate !== undefined) wrapStyle.transform = `rotate(${rotate}deg)`;
  if (spin) wrapStyle.animation = 'svg-icon-loading-circle 1s infinite linear';

  const base64Src = useMemo(() => {
    if (renderMode !== 'base64' || !inner) return '';
    return svgToBase64(inner);
  }, [renderMode, inner]);

  if (error) {
    return (
      <span className={className} style={wrapStyle} title={error.message} {...rest} />
    );
  }

  return (
    <span
      className={className}
      style={wrapStyle}
      onClick={onClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      {...rest}
    >
      {renderMode === 'base64' ? (
        <img src={base64Src} style={{ width: '100%', height: '100%' }} alt="icon" />
      ) : (
        <span
          style={{ display: 'inline-flex', width: '100%', height: '100%' }}
          dangerouslySetInnerHTML={{ __html: inner }}
        />
      )}
    </span>
  );
};

SvgIcon.displayName = 'SvgIcon';

export default SvgIcon;
