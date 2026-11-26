/**
 * useIcon —— string 型 icon prop 的主题响应式 base64 预载 hook。
 *
 * 用于 eview-ui 收 string（图片路径 / base64 data URL）的图标 prop：
 * Button.leftIcon/rightIcon、Card.icon、Crumbs.icon、Tab.icon、Accordion.icon、
 * PageMessage.icon、Tree.iconLeaf ……（详见 references/components/Icon.md 一类表）。
 *
 * - 传 `color`：按指定色烘焙，不随主题变（Button 彩色 status 用：primary 传 '#fff'，
 *   light/dark 两套主题都对）。
 * - 不传 `color`：默认跟随主题文本色翻转（on-surface），主题切换瞬时换色、无闪烁。
 *
 * 调用侧：
 *   const icon = useIcon('search', { size: 16, color: '#fff' }); // Button primary
 *   const icon = useIcon('star', { size: 14 });                   // 其他组件，跟随主题
 *
 * 缓存：base64 按 `${name}|${color}|${size}|${type}` 缓存；命中时同步返回
 *（`return cache.get(key) || url`），主题切换那一刻即拿到新色 base64，无空帧。
 * 原始 SVG XML 走 core/fetch.js 的 svgCache，重烘焙不重新请求网络。
 */
import { useEffect, useState } from 'react';
// 直接从 core 引入，避免经 barrel(index.jsx) 形成循环依赖
import { getIconBase64 } from './core/index.js';
import { useTheme } from '@/theme/useTheme';

// 无 color 时的默认色：跟随主题文本色（eview-ui aui3-1 规范值，可按设计 token 调）
const SURFACE_TEXT = { light: '#191919', dark: '#DFDFDF' };

const cache = new Map(); // `${name}|${color}|${size}|${type}` → base64 data URL

export function useIcon(name, { size = 16, color, type } = {}) {
  const { isDark } = useTheme();
  const resolved = color || (isDark ? SURFACE_TEXT.dark : SURFACE_TEXT.light);
  const key = `${name}|${resolved}|${size}|${type}`;

  const [url, setUrl] = useState(() => (name ? cache.get(key) || '' : ''));
  useEffect(() => {
    if (!name) return;
    let alive = true;
    const hit = cache.get(key);
    if (hit) { setUrl(hit); return; }
    getIconBase64(name, { color: resolved, size, type }).then((u) => {
      if (!alive || !u) return;
      cache.set(key, u);
      setUrl(u);
    });
    return () => { alive = false; };
  }, [key]);

  // 命中缓存时同步返回：主题切换瞬时拿到新色 base64，无异步等待、无空帧闪烁
  return name ? (cache.get(key) || url) : '';
}
