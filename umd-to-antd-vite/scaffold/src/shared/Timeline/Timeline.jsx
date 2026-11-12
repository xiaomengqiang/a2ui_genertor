import React, { useMemo } from 'react';
import './Timeline.css';

// ---------------------------------------------------------------------------
// Helpers (zero-dep replacements for clsx / @rc-component/util)
// ---------------------------------------------------------------------------

function cx(...args) {
  const str = [];
  const flatten = (list) => {
    list.forEach((item) => {
      if (!item && item !== 0) return;
      if (Array.isArray(item)) {
        flatten(item);
      } else if (typeof item === 'object') {
        Object.keys(item).forEach((key) => {
          if (item[key]) str.push(key);
        });
      } else {
        str.push(`${item}`);
      }
    });
  };
  flatten(args);
  return str.join(' ');
}

// Minimal port of @rc-component/util `toArray`
function toArray(children) {
  let ret = [];
  React.Children.forEach(children, (child) => {
    if (child === null || child === undefined) return;
    if (Array.isArray(child)) {
      ret = ret.concat(toArray(child));
    } else {
      ret.push(child);
    }
  });
  return ret;
}

// ---------------------------------------------------------------------------
// Loading icon (zero-dep stand-in for @ant-design/icons/LoadingOutlined)
// ---------------------------------------------------------------------------

function LoadingOutlined() {
  return (
    <span role="img" aria-label="loading" className="temp-eview-timeline-loading">
      <svg
        viewBox="0 0 1024 1024"
        focusable="false"
        className="temp-eview-timeline-spin"
        data-icon="loading"
        width="1em"
        height="1em"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 0 0-94.3-139.9 437.71 437.71 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3 0 19.9-16.1 36-35.9 36z" />
      </svg>
    </span>
  );
}

// ---------------------------------------------------------------------------
// useItems: port of components/timeline/useItems.tsx
// ---------------------------------------------------------------------------

const PRESET_COLORS = ['blue', 'red', 'green', 'gray'];

function useItems(prefixCls, mode, items, children, pending, pendingDot) {
  const itemCls = `${prefixCls}-item`;

  return useMemo(() => {
    // Merge items and children
    const parseItems = Array.isArray(items)
      ? items
      : toArray(children).map((ele) => ({ ...ele.props }));

    const mergedItems = parseItems.map((item, index) => {
      const {
        label,
        children: legacyChildren,
        title,
        content,
        color,
        className,
        style,
        icon,
        dot,
        placement,
        position,
        loading,
        ...restProps
      } = item;

      let mergedStyle = style;
      let mergedClassName = className;

      if (color) {
        if (PRESET_COLORS.includes(color)) {
          mergedClassName = cx(className, `${itemCls}-color-${color}`);
        } else {
          mergedStyle = {
            '--temp-eview-timeline-dot-color': color,
            ...style,
          };
        }
      }

      // Placement
      const mergedPlacement =
        placement ??
        position ??
        (mode === 'alternate' ? (index % 2 === 0 ? 'start' : 'end') : mode);

      mergedClassName = cx(mergedClassName, `${itemCls}-placement-${mergedPlacement}`);

      // Icon
      let mergedIcon = icon ?? dot;
      if (!mergedIcon && loading) {
        mergedIcon = <LoadingOutlined />;
      }

      return {
        ...restProps,
        title: title ?? label,
        content: content ?? legacyChildren,
        style: mergedStyle,
        className: mergedClassName,
        icon: mergedIcon,
        status: loading ? 'process' : 'finish',
      };
    });

    // Legacy `pending`
    if (pending) {
      mergedItems.push({
        icon: pendingDot ?? <LoadingOutlined />,
        content: pending,
        status: 'process',
      });
    }

    return mergedItems;
  }, [items, children, pending, mode, itemCls, pendingDot]);
}

// ---------------------------------------------------------------------------
// Timeline
// ---------------------------------------------------------------------------

const Timeline = (props) => {
  const {
    prefixCls: customizePrefixCls,

    // Style
    className,
    style,
    rootClassName,
    classNames = {},
    styles = {},

    // Design
    variant = 'outlined',
    mode,
    orientation = 'vertical',
    titleSpan,

    // Data
    items,
    children,
    reverse,

    // Legacy Pending
    pending,
    pendingDot,

    ...restProps
  } = props;

  const prefixCls = customizePrefixCls || 'temp-eview-timeline';

  // ===================== Mode =======================
  const mergedMode = useMemo(() => {
    // Deprecated
    if (mode === 'left') {
      return 'start';
    }
    if (mode === 'right') {
      return 'end';
    }
    const modeList = ['alternate', 'start', 'end'];
    return modeList.includes(mode) ? mode : 'start';
  }, [mode]);

  // ===================== Data =======================
  const rawItems = useItems(prefixCls, mergedMode, items, children, pending, pendingDot);

  const mergedItems = useMemo(
    () => (reverse ? [...rawItems].reverse() : rawItems),
    [reverse, rawItems],
  );

  // ==================== Design ======================
  const layoutAlternate = useMemo(
    () =>
      mergedMode === 'alternate' ||
      (orientation === 'vertical' && mergedItems.some((item) => item.title)),
    [mergedItems, mergedMode, orientation],
  );

  // ===================== Items Render ===============
  const lastOriginIndex = mergedItems.length - 1;

  const renderItem = (item, index) => {
    const {
      key: itemKey,
      className: itemClassName,
      style: itemStyle,
      classNames: itemClassNames,
      styles: itemStyles,
      title,
      content,
      icon,
      status,
      onClick,
      onKeyDown,
      ...itemRest
    } = item;

    const isLast = index === lastOriginIndex;
    const clickable = Boolean(onClick);

    const itemCls = cx(
      `${prefixCls}-item`,
      `${prefixCls}-item-${status}`,
      {
        [`${prefixCls}-item-active`]: index === lastOriginIndex,
        [`${prefixCls}-item-custom`]: Boolean(icon),
        [`${prefixCls}-item-empty-header`]: !title,
      },
      itemClassName,
      classNames.item,
      itemClassNames && itemClassNames.item,
    );

    const itemAllStyle = {
      ...styles.item,
      ...(itemStyles && itemStyles.item),
      ...itemStyle,
    };

    // Rail status: follow prev item when `reverse`
    const railStatus = reverse
      ? (mergedItems[index - 1] && mergedItems[index - 1].status) || 'wait'
      : status;

    const liProps = {
      className: itemCls,
      style: itemAllStyle,
      ...itemRest,
    };

    if (clickable) {
      liProps.role = 'button';
      liProps.tabIndex = 0;
      liProps.onClick = onClick;
      liProps.onKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(e);
        }
        if (onKeyDown) onKeyDown(e);
      };
    }

    return (
      <li key={itemKey ?? index} {...liProps}>
        <div
          className={cx(
            `${prefixCls}-item-wrapper`,
            classNames.itemWrapper,
            itemClassNames && itemClassNames.itemWrapper,
          )}
          style={{ ...styles.itemWrapper, ...(itemStyles && itemStyles.itemWrapper) }}
        >
          <div
            className={cx(
              `${prefixCls}-item-icon`,
              classNames.itemIcon,
              itemClassNames && itemClassNames.itemIcon,
            )}
            style={{ ...styles.itemIcon, ...(itemStyles && itemStyles.itemIcon) }}
          >
            {icon}
          </div>
          <div
            className={cx(
              `${prefixCls}-item-section`,
              classNames.itemSection,
              itemClassNames && itemClassNames.itemSection,
            )}
            style={{ ...styles.itemSection, ...(itemStyles && itemStyles.itemSection) }}
          >
            <div
              className={cx(
                `${prefixCls}-item-header`,
                classNames.itemHeader,
                itemClassNames && itemClassNames.itemHeader,
              )}
              style={{ ...styles.itemHeader, ...(itemStyles && itemStyles.itemHeader) }}
            >
              {title ? (
                <div
                  className={cx(
                    `${prefixCls}-item-title`,
                    classNames.itemTitle,
                    itemClassNames && itemClassNames.itemTitle,
                  )}
                  style={{ ...styles.itemTitle, ...(itemStyles && itemStyles.itemTitle) }}
                >
                  {title}
                </div>
              ) : null}
              {!isLast ? (
                <div
                  className={cx(
                    `${prefixCls}-item-rail`,
                    `${prefixCls}-item-rail-${railStatus}`,
                    classNames.itemRail,
                    itemClassNames && itemClassNames.itemRail,
                  )}
                  style={{ ...styles.itemRail, ...(itemStyles && itemStyles.itemRail) }}
                />
              ) : null}
            </div>
            {content ? (
              <div
                className={cx(
                  `${prefixCls}-item-content`,
                  classNames.itemContent,
                  itemClassNames && itemClassNames.itemContent,
                )}
                style={{ ...styles.itemContent, ...(itemStyles && itemStyles.itemContent) }}
              >
                {content}
              </div>
            ) : null}
          </div>
        </div>
      </li>
    );
  };

  // ===================== Root =======================
  const rootStyle = { ...styles.root, ...style };

  if (titleSpan != null && mergedMode !== 'alternate') {
    if (typeof titleSpan === 'number') {
      rootStyle['--temp-eview-timeline-head-span'] = titleSpan;
    } else {
      rootStyle['--temp-eview-timeline-head-span-ptg'] = titleSpan;
    }
  }

  return (
    <ol
      {...restProps}
      className={cx(
        prefixCls,
        `${prefixCls}-${variant}`,
        {
          [`${prefixCls}-horizontal`]: orientation === 'horizontal',
          [`${prefixCls}-layout-alternate`]: layoutAlternate,
        },
        className,
        rootClassName,
        classNames.root,
      )}
      style={rootStyle}
    >
      {mergedItems.map(renderItem)}
    </ol>
  );
};

// Legacy `Timeline.Item` (only props are collected, renders nothing)
const TimelineItem = () => null;

Timeline.Item = TimelineItem;

if (process.env.NODE_ENV !== 'production') {
  Timeline.displayName = 'Timeline';
}

export default Timeline;
