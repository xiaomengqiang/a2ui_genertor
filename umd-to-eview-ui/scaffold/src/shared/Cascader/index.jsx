// cascader/index.jsx
// Hand-written Cascader component, API-compatible with antd Cascader.
// No third-party libs; all helpers live in ./utils.js and ./icons.jsx.

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import "./cascader.css";
import {
  buildCheckedSetFromValue,
  defaultFilter,
  flattenOptions,
  getCheckedValue,
  getChildren,
  getLabel,
  getNodeCheckState,
  getValue,
  isOptionLeaf,
  normalizeFieldNames,
  pathKey,
  resolveOptionPath,
  shallowEqualArrays,
  splitByKeyword,
  toggleNode,
} from "./utils.js";
import {
  CheckMarkIcon,
  CloseIcon,
  DownIcon,
  LoadingIcon,
  RightIcon,
} from "./icons.jsx";

const SHOW_PARENT = "SHOW_PARENT";
const SHOW_CHILD = "SHOW_CHILD";
const SHOW_ALL = "SHOW_ALL";

/* ---------- controlled / uncontrolled state hook ---------- */
function useMergedState(defaultValue, controlled) {
  const [internal, setInternal] = useState(defaultValue);
  const controlledRef = useRef(controlled);
  controlledRef.current = controlled;
  const merged = controlled !== undefined ? controlled : internal;
  const setMerged = useCallback((next) => {
    if (controlledRef.current === undefined) {
      setInternal((prev) => (typeof next === "function" ? next(prev) : next));
    }
  }, []);
  return [merged, setMerged, controlled !== undefined];
}

/* ---------- popup placement math ---------- */
function computePosition(rect, pw, ph, placement, gap) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let vertical = placement.startsWith("top") ? "top" : "bottom";
  const spaceBelow = vh - rect.bottom;
  const spaceAbove = rect.top;
  if (vertical === "bottom" && spaceBelow < ph && spaceAbove > spaceBelow) vertical = "top";
  else if (vertical === "top" && spaceAbove < ph && spaceBelow > spaceAbove) vertical = "bottom";
  const alignRight = placement.endsWith("Right");
  let left;
  if (alignRight) {
    left = rect.right - pw;
    if (left < 0) left = rect.left;
  } else {
    left = rect.left;
    if (left + pw > vw) left = Math.max(0, vw - pw - gap);
  }
  const style = { left: left + "px" };
  if (vertical === "bottom") style.top = rect.bottom + gap + "px";
  else style.top = Math.max(gap, rect.top - ph - gap) + "px";
  return style;
}

/* ---------- cascading menus ---------- */
function Menus(props) {
  const {
    columns,
    fns,
    multiple,
    changeOnSelect,
    expandTrigger,
    activePath,
    selectedValue,
    checkedSet,
    loadingNodes,
    expandIcon,
    notFoundContent,
    activeIndices,
    onColumnClick,
    onCheck,
    onHoverExpand,
    onItemHover,
    onKeyDown,
    popupRender,
    menuStyle,
  } = props;

  let content = (
    <div className="cascader-menus" onKeyDown={onKeyDown}>
      {columns.map((col, ci) => (
        <ul className="cascader-menu" key={ci} role="listbox">
          {col.options.length === 0 ? (
            <li className="cascader-menu-empty">{notFoundContent}</li>
          ) : (
            col.options.map((opt, oi) => {
              const v = getValue(opt, fns);
              const path = activePath.slice(0, col.level).concat(v);
              const isActive = activePath[col.level] === v;
              const leaf = isOptionLeaf(opt, fns);
              const hasChildren = !leaf;
              const isSelected =
                !multiple && selectedValue && shallowEqualArrays(selectedValue, path);
              const loading =
                hasChildren && loadingNodes.some((p) => shallowEqualArrays(p, path));
              const checkState = multiple
                ? getNodeCheckState(props.options, fns, changeOnSelect, checkedSet, path)
                : null;
              const keyboardActive = oi === (activeIndices[ci] ?? -1);
              const cls = ["cascader-menu-item"];
              if (isActive) cls.push("cascader-menu-item-active");
              if (!multiple && isSelected) cls.push("cascader-menu-item-selected");
              if (keyboardActive) cls.push("cascader-menu-item-keyboard");
              if (opt.disabled) cls.push("cascader-menu-item-disabled");
              return (
                <li
                  key={String(v) + "@" + oi}
                  className={cls.join(" ")}
                  title={String(getLabel(opt, fns))}
                  onMouseEnter={() => {
                    if (expandTrigger === "hover" && !opt.disabled) onHoverExpand(opt, col.level, oi);
                    else onItemHover(ci, oi);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!opt.disabled) onColumnClick(opt, col.level);
                  }}
                >
                  {multiple && (
                    <span
                      className={`cascader-checkbox cascader-checkbox-${checkState}`}
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        onCheck(path);
                      }}
                    >
                      {checkState === "checked" && (
                        <CheckMarkIcon className="cascader-checkbox-mark" />
                      )}
                    </span>
                  )}
                  <span className="cascader-menu-item-label">{getLabel(opt, fns)}</span>
                  <span className="cascader-menu-item-rest">
                    {loading ? (
                      <LoadingIcon className="cascader-menu-item-loading" />
                    ) : hasChildren ? (
                      expandIcon || <RightIcon className="cascader-menu-item-expand" />
                    ) : null}
                  </span>
                </li>
              );
            })
          )}
        </ul>
      ))}
    </div>
  );
  if (popupRender) content = popupRender(content);
  return (
    <div className="cascader-menus-wrap" style={menuStyle}>
      {content}
    </div>
  );
}

/* ---------- search results panel ---------- */
function SearchPanel(props) {
  const {
    searchOptions,
    inputValue,
    multiple,
    options,
    fns,
    changeOnSelect,
    checkedSet,
    activeSearchIndex,
    notFoundContent,
    onSelect,
    onCheck,
    onKeyDown,
    popupRender,
  } = props;

  const renderPath = (labelPath, keyword) => {
    const nodes = [];
    labelPath.forEach((label, i) => {
      if (i > 0)
        nodes.push(
          <span className="cascader-search-item-sep" key={`s${i}`}>
            {" / "}
          </span>
        );
      splitByKeyword(label, keyword).forEach((seg, j) => {
        nodes.push(
          <span
            className={seg.hit ? "cascader-search-item-hit" : undefined}
            key={`${i}-${j}`}
          >
            {seg.text}
          </span>
        );
      });
    });
    return nodes;
  };

  let content = (
    <div className="cascader-search" onKeyDown={onKeyDown}>
      {searchOptions.length === 0 ? (
        <div className="cascader-search-empty">{notFoundContent}</div>
      ) : (
        searchOptions.map((item, i) => {
          const active = i === activeSearchIndex;
          const checkState = multiple
            ? getNodeCheckState(options, fns, changeOnSelect, checkedSet, item.valuePath)
            : null;
          const cls = ["cascader-search-item"];
          if (active) cls.push("cascader-search-item-active");
          return (
            <div
              key={pathKey(item.valuePath)}
              className={cls.join(" ")}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => props.onActiveSearchChange(i)}
              onClick={() => (multiple ? onCheck(item.valuePath) : onSelect(item))}
            >
              {multiple && (
                <span
                  className={`cascader-checkbox cascader-checkbox-${checkState}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCheck(item.valuePath);
                  }}
                >
                  {checkState === "checked" && (
                    <CheckMarkIcon className="cascader-checkbox-mark" />
                  )}
                </span>
              )}
              <span className="cascader-search-item-content">
                {renderPath(item.labelPath, inputValue)}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
  if (popupRender) content = popupRender(content);
  return content;
}

/* ---------- main component ---------- */
export default function Cascader(props) {
  const {
    options = [],
    value,
    defaultValue,
    onChange,
    placeholder = "Please select",
    disabled = false,
    allowClear = false,
    showSearch = false,
    changeOnSelect = false,
    multiple = false,
    fieldNames,
    expandTrigger = "click",
    notFoundContent = "Not Found",
    popupClassName,
    popupStyle,
    style,
    className,
    size = "middle",
    status,
    variant = "outlined",
    bordered,
    placement = "bottomLeft",
    suffixIcon,
    expandIcon,
    clearIcon,
    removeIcon,
    loadData,
    loading: globalLoading = false,
    maxTagCount,
    maxTagPlaceholder,
    showCheckedStrategy = SHOW_PARENT,
    displayRender,
    open: openProp,
    defaultOpen = false,
    onDropdownVisibleChange,
    popupRender,
    getPopupContainer,
    id,
    tabIndex = 0,
  } = props;

  const fns = useMemo(() => normalizeFieldNames(fieldNames), [fieldNames]);

  // resolved variant (bordered=false => borderless, deprecated)
  const resolvedVariant = bordered === false ? "borderless" : variant;

  // value (single: string[] | undefined; multiple: string[][] | undefined)
  const [internalValue, setInternalValue] = useMergedState(
    multiple ? defaultValue ?? [] : defaultValue,
    value
  );
  const valueControlled = value !== undefined;
  const mergedValue = valueControlled ? value : internalValue;

  // open
  const [internalOpen, setInternalOpen] = useMergedState(defaultOpen, openProp);
  const openControlled = openProp !== undefined;
  const mergedOpen = openControlled ? openProp : internalOpen;

  // search input
  const [inputValue, setInputValue] = useState("");
  // menu expansion path + keyboard index
  const [activePath, setActivePath] = useState([]);
  const [activeIndices, setActiveIndices] = useState([0]);
  const [activeSearchIndex, setActiveSearchIndex] = useState(0);
  const [loadingNodes, setLoadingNodes] = useState([]);
  const [focused, setFocused] = useState(false);
  const [popupStyleState, setPopupStyleState] = useState(null);

  const triggerRef = useRef(null);
  const popupRef = useRef(null);
  const inputRef = useRef(null);
  const inFlightLoadRef = useRef(new Set());

  // multiple: derive internal checked set from merged value
  const checkedSet = useMemo(() => {
    if (!multiple) return new Set();
    return buildCheckedSetFromValue(options, mergedValue, fns, changeOnSelect);
  }, [multiple, options, mergedValue, fns, changeOnSelect]);

  // single: resolve display options/labels
  const selectedOptions = useMemo(() => {
    if (multiple || !Array.isArray(mergedValue) || mergedValue.length === 0) return [];
    return resolveOptionPath(options, mergedValue, fns);
  }, [multiple, mergedValue, options, fns]);
  const labels = useMemo(
    () => selectedOptions.map((o) => getLabel(o, fns)),
    [selectedOptions, fns]
  );
  const displayText = labels.length
    ? displayRender
      ? displayRender(labels, selectedOptions)
      : labels.join(" / ")
    : "";
  const displayTextStr = labels.length ? labels.join(" / ") : "";

  // search config
  const showSearchConfig = useMemo(() => {
    if (showSearch === true) return { filter: defaultFilter, limit: 50, render: null };
    if (showSearch && typeof showSearch === "object")
      return {
        filter: showSearch.filter || defaultFilter,
        limit: showSearch.limit ?? 50,
        render: showSearch.render || null,
      };
    return null;
  }, [showSearch]);
  const searchable = !!showSearchConfig;

  const searchOptions = useMemo(() => {
    if (!searchable || !inputValue) return [];
    const flat = flattenOptions(options, fns, changeOnSelect);
    const filtered = flat.filter((item) =>
      showSearchConfig.filter(inputValue, item.labelPath, item.valuePath)
    );
    return showSearchConfig.limit > 0 ? filtered.slice(0, showSearchConfig.limit) : filtered;
  }, [searchable, inputValue, options, fns, changeOnSelect, showSearchConfig]);

  const isSearching = searchable && mergedOpen && inputValue.length > 0;

  // build menu columns from activePath
  const columns = useMemo(() => {
    const cols = [{ options, level: 0 }];
    let list = options;
    for (let i = 0; i < activePath.length; i++) {
      const opt = resolveOptionPath(options, activePath.slice(0, i + 1), fns).slice(-1)[0];
      if (!opt) break;
      const children = getChildren(opt, fns);
      if (!children || !children.length) break;
      cols.push({ options: children, level: i + 1, parent: opt });
      list = children;
    }
    return cols;
  }, [options, activePath, fns]);

  /* ----- open/close ----- */
  const changeOpen = useCallback(
    (next) => {
      if (disabled) return;
      if (onDropdownVisibleChange) onDropdownVisibleChange(next);
      if (!openControlled) setInternalOpen(next);
    },
    [disabled, onDropdownVisibleChange, openControlled, setInternalOpen]
  );

  // initialize internal state when popup opens/closes
  useEffect(() => {
    if (mergedOpen) {
      const init = multiple ? [] : Array.isArray(mergedValue) ? mergedValue : [];
      const path = init.length ? init : [];
      setActivePath(path);
      // compute active indices from the value path
      const indices = [];
      let list = options;
      for (const v of path) {
        const idx = list.findIndex((o) => getValue(o, fns) === v);
        if (idx >= 0) {
          indices.push(idx);
          list = getChildren(list[idx], fns) || [];
        } else break;
      }
      if (indices.length === 0) indices.push(0);
      setActiveIndices(indices);
      setInputValue("");
      setActiveSearchIndex(0);
    } else {
      setInputValue("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mergedOpen]);

  // focus search input on open
  useEffect(() => {
    if (mergedOpen && searchable && inputRef.current) {
      const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [mergedOpen, searchable]);

  // clamp active indices within columns
  useEffect(() => {
    if (!mergedOpen || isSearching) return;
    const lastLevel = columns.length - 1;
    if (lastLevel < 0) return;
    const last = columns[lastLevel];
    if (!last || last.options.length === 0) return;
    setActiveIndices((prev) => {
      const lastIdx = prev[lastLevel];
      if (lastIdx === undefined || lastIdx > last.options.length - 1) {
        const next = [...prev];
        while (next.length < columns.length) next.push(0);
        next[lastLevel] = 0;
        return next;
      }
      return prev;
    });
  }, [columns, mergedOpen, isSearching]);

  /* ----- async loadData ----- */
  useEffect(() => {
    if (!mergedOpen || !loadData || activePath.length === 0) return;
    const optPath = resolveOptionPath(options, activePath, fns);
    const node = optPath[optPath.length - 1];
    if (!node || isOptionLeaf(node, fns)) return;
    const children = getChildren(node, fns);
    if (children && children.length) return;
    if (node.isLeaf === true) return;
    const key = pathKey(activePath);
    if (inFlightLoadRef.current.has(key)) return;
    inFlightLoadRef.current.add(key);
    setLoadingNodes((prev) => [...prev, activePath]);
    const ret = loadData(optPath);
    Promise.resolve(ret).finally(() => {
      inFlightLoadRef.current.delete(key);
      setLoadingNodes((prev) => prev.filter((p) => !shallowEqualArrays(p, activePath)));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mergedOpen, activePath, options, loadData]);

  // clear loading for nodes that now have children
  useEffect(() => {
    setLoadingNodes((prev) => {
      if (prev.length === 0) return prev;
      return prev.filter((p) => {
        const optPath = resolveOptionPath(options, p, fns);
        const node = optPath[optPath.length - 1];
        if (!node) return false;
        const children = getChildren(node, fns);
        return !(children && children.length);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  /* ----- positioning ----- */
  const positionPopup = useCallback(() => {
    const tr = triggerRef.current;
    const pop = popupRef.current;
    if (!tr || !pop) return;
    const rect = tr.getBoundingClientRect();
    setPopupStyleState(computePosition(rect, pop.offsetWidth, pop.offsetHeight, placement, 4));
  }, [placement]);

  useLayoutEffect(() => {
    if (!mergedOpen) {
      setPopupStyleState(null);
      return;
    }
    positionPopup();
  }, [mergedOpen, positionPopup, isSearching, searchOptions.length, activePath, columns]);

  useEffect(() => {
    if (!mergedOpen) return;
    const handler = () => positionPopup();
    window.addEventListener("scroll", handler, true);
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler, true);
      window.removeEventListener("resize", handler);
    };
  }, [mergedOpen, positionPopup]);

  /* ----- click outside ----- */
  useEffect(() => {
    if (!mergedOpen) return;
    const onDown = (e) => {
      const t = e.target;
      if (triggerRef.current && triggerRef.current.contains(t)) return;
      if (popupRef.current && popupRef.current.contains(t)) return;
      changeOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [mergedOpen, changeOpen]);

  /* ----- selection handlers ----- */
  const fireChange = useCallback(
    (nextValue, selOptions) => {
      if (!valueControlled) setInternalValue(nextValue);
      onChange && onChange(nextValue, selOptions);
    },
    [valueControlled, setInternalValue, onChange]
  );

  const selectSingle = useCallback(
    (path, close = true) => {
      fireChange(path, resolveOptionPath(options, path, fns));
      if (close) changeOpen(false);
    },
    [fireChange, options, fns, changeOpen]
  );

  const onCheck = useCallback(
    (path) => {
      if (!multiple) return;
      const state = getNodeCheckState(options, fns, changeOnSelect, checkedSet, path);
      const nextSet = toggleNode(options, fns, changeOnSelect, checkedSet, path, state);
      const nextValue = getCheckedValue(options, fns, changeOnSelect, nextSet, showCheckedStrategy);
      const selOptions = nextValue.map((vp) => resolveOptionPath(options, vp, fns));
      fireChange(nextValue, selOptions);
    },
    [multiple, options, fns, changeOnSelect, checkedSet, showCheckedStrategy, fireChange]
  );

  const onColumnClick = useCallback(
    (opt, level) => {
      const v = getValue(opt, fns);
      const path = activePath.slice(0, level).concat(v);
      const leaf = isOptionLeaf(opt, fns);
      setActivePath(path);
      const col = columns[level];
      const idx = col ? col.options.findIndex((o) => getValue(o, fns) === v) : -1;
      setActiveIndices((prev) => {
        const next = prev.slice(0, level);
        if (idx >= 0) next[level] = idx;
        if (!leaf) next[level + 1] = 0;
        return next;
      });
      if (multiple) {
        if (leaf) onCheck(path);
      } else {
        if (leaf) selectSingle(path);
        else if (changeOnSelect) selectSingle(path, false);
      }
    },
    [activePath, fns, multiple, changeOnSelect, selectSingle, onCheck, columns]
  );

  const onHoverExpand = useCallback(
    (opt, level, oi) => {
      const v = getValue(opt, fns);
      const path = activePath.slice(0, level).concat(v);
      setActivePath(path);
      setActiveIndices((prev) => {
        const next = prev.slice(0, level);
        next[level] = oi;
        if (!isOptionLeaf(opt, fns)) next[level + 1] = 0;
        return next;
      });
    },
    [activePath, fns]
  );

  const onItemHover = useCallback((ci, oi) => {
    setActiveIndices((prev) => {
      const next = [...prev];
      while (next.length <= ci) next.push(-1);
      next[ci] = oi;
      return next;
    });
  }, []);

  const onSearchSelect = useCallback(
    (item) => {
      if (multiple) {
        onCheck(item.valuePath);
        setInputValue("");
      } else {
        selectSingle(item.valuePath);
      }
    },
    [multiple, onCheck, selectSingle]
  );

  /* ----- clear / tag remove ----- */
  const onClear = useCallback(
    (e) => {
      e.stopPropagation();
      if (multiple) {
        fireChange([], []);
      } else {
        fireChange([], []);
      }
      changeOpen(false);
      triggerRef.current && triggerRef.current.focus();
    },
    [multiple, fireChange, changeOpen]
  );

  const onTagRemove = useCallback(
    (path) => (e) => {
      e.stopPropagation();
      if (!multiple) return;
      const state = getNodeCheckState(options, fns, changeOnSelect, checkedSet, path);
      const nextSet =
        state === "unchecked"
          ? checkedSet
          : toggleNode(options, fns, changeOnSelect, checkedSet, path, "checked");
      const nextValue = getCheckedValue(options, fns, changeOnSelect, nextSet, showCheckedStrategy);
      const selOptions = nextValue.map((vp) => resolveOptionPath(options, vp, fns));
      fireChange(nextValue, selOptions);
    },
    [multiple, options, fns, changeOnSelect, checkedSet, showCheckedStrategy, fireChange]
  );

  /* ----- keyboard ----- */
  const onKeyDown = useCallback(
    (e) => {
      if (disabled) return;
      if (!mergedOpen) {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          changeOpen(true);
        }
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        changeOpen(false);
        triggerRef.current && triggerRef.current.focus();
        return;
      }
      if (isSearching) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setActiveSearchIndex((i) => Math.min(searchOptions.length - 1, i + 1));
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setActiveSearchIndex((i) => Math.max(0, i - 1));
        } else if (e.key === "Enter") {
          e.preventDefault();
          const item = searchOptions[activeSearchIndex];
          if (item) onSearchSelect(item);
        }
        return;
      }
      const last = columns[columns.length - 1];
      if (!last) return;
      const lastLevel = columns.length - 1;
      const idx = Math.min(activeIndices[lastLevel] ?? 0, last.options.length - 1);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndices((prev) => {
          const next = [...prev];
          while (next.length <= lastLevel) next.push(-1);
          next[lastLevel] = Math.min(last.options.length - 1, (next[lastLevel] ?? -1) + 1);
          return next;
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndices((prev) => {
          const next = [...prev];
          while (next.length <= lastLevel) next.push(0);
          next[lastLevel] = Math.max(0, (next[lastLevel] ?? 0) - 1);
          return next;
        });
      } else if (e.key === "ArrowRight") {
        const item = last.options[idx];
        if (item && !isOptionLeaf(item, fns)) {
          setActivePath(activePath.concat(getValue(item, fns)));
          setActiveIndices((prev) => {
            const next = [...prev];
            next[lastLevel + 1] = 0;
            return next;
          });
        }
      } else if (e.key === "ArrowLeft") {
        if (activePath.length > 0) {
          const np = activePath.slice(0, -1);
          setActivePath(np);
          setActiveIndices((prev) => prev.slice(0, -1));
        }
      } else if (e.key === "Enter") {
        const item = last.options[idx];
        if (item && !item.disabled) onColumnClick(item, last.level);
      }
    },
    [disabled, mergedOpen, isSearching, searchOptions, activeSearchIndex, onSearchSelect, columns, activeIndices, activePath, fns, onColumnClick, changeOpen]
  );

  /* ----- derived display for multiple tags ----- */
  const tagList = useMemo(() => {
    if (!multiple) return [];
    const valPaths = Array.isArray(mergedValue) ? mergedValue : [];
    return valPaths.map((vp) => {
      const optPath = resolveOptionPath(options, vp, fns);
      const lbls = optPath.map((o) => getLabel(o, fns));
      return { valuePath: vp, label: lbls.join(" / ") };
    });
  }, [multiple, mergedValue, options, fns]);

  const { visibleTags, restTags } = useMemo(() => {
    if (!multiple || tagList.length === 0) return { visibleTags: [], restTags: [] };
    if (maxTagCount == null || maxTagCount < 0) return { visibleTags: tagList, restTags: [] };
    return { visibleTags: tagList.slice(0, maxTagCount), restTags: tagList.slice(maxTagCount) };
  }, [multiple, tagList, maxTagCount]);

  const hasValue = multiple
    ? Array.isArray(mergedValue) && mergedValue.length > 0
    : Array.isArray(mergedValue) && mergedValue.length > 0;

  const showClear = allowClear && hasValue && !disabled && (focused || mergedOpen);

  /* ----- selector render ----- */
  const rootCls = [
    "cascader",
    `cascader-${resolvedVariant}`,
    `cascader-size-${size}`,
    focused && "cascader-focused",
    mergedOpen && "cascader-open",
    disabled && "cascader-disabled",
    status && `cascader-status-${status}`,
    multiple && "cascader-multiple",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const suffixNode = showClear ? (
    <span
      className="cascader-clear"
      aria-label="close"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={onClear}
    >
      {clearIcon || <CloseIcon className="cascader-clear-icon" />}
    </span>
  ) : (
    <span className="cascader-arrow">
      {suffixIcon || <DownIcon className="cascader-arrow-icon" />}
    </span>
  );

  let selectorContent;
  if (multiple) {
    selectorContent = (
      <div className="cascader-selection-overflow">
        {visibleTags.map((t) => (
          <span className="cascader-selection-item" key={pathKey(t.valuePath)} title={t.label}>
            <span className="cascader-selection-item-content">{t.label}</span>
            {!disabled && (
              <span
                className="cascader-selection-item-remove"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={onTagRemove(t.valuePath)}
              >
                {removeIcon || <CloseIcon className="cascader-remove-icon" />}
              </span>
            )}
          </span>
        ))}
        {restTags.length > 0 && (
          <span className="cascader-selection-item cascader-selection-item-rest">
            {typeof maxTagPlaceholder === "function"
              ? maxTagPlaceholder(restTags)
              : maxTagPlaceholder != null
              ? maxTagPlaceholder
              : `+${restTags.length}...`}
          </span>
        )}
        {searchable ? (
          <div className="cascader-selection-search">
            <input
              ref={inputRef}
              className="cascader-input"
              value={inputValue}
              disabled={disabled}
              placeholder={hasValue ? "" : placeholder}
              onChange={(e) => {
                setInputValue(e.target.value);
                setActiveSearchIndex(0);
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              readOnly={!mergedOpen}
              autoComplete="off"
            />
          </div>
        ) : (
          !hasValue && <span className="cascader-placeholder">{placeholder}</span>
        )}
      </div>
    );
  } else if (searchable) {
    selectorContent = (
      <div className="cascader-selection-search cascader-selection-search-single">
        <input
          ref={inputRef}
          className="cascader-input"
          value={mergedOpen ? inputValue : displayTextStr}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => {
            setInputValue(e.target.value);
            setActiveSearchIndex(0);
          }}
          onFocus={() => {
            setFocused(true);
            if (!mergedOpen) changeOpen(true);
          }}
          onBlur={() => setFocused(false)}
          readOnly={!mergedOpen || disabled}
          autoComplete="off"
        />
      </div>
    );
  } else {
    selectorContent = (
      <div className="cascader-selection-overflow cascader-selection-overflow-single">
        {hasValue ? (
          <span className="cascader-selection-item cascader-selection-item-single">
            {displayText}
          </span>
        ) : (
          <span className="cascader-placeholder">{placeholder}</span>
        )}
      </div>
    );
  }

  /* ----- popup content ----- */
  let popupContent;
  if (isSearching) {
    popupContent = (
      <SearchPanel
        searchOptions={searchOptions}
        inputValue={inputValue}
        multiple={multiple}
        options={options}
        fns={fns}
        changeOnSelect={changeOnSelect}
        checkedSet={checkedSet}
        activeSearchIndex={activeSearchIndex}
        notFoundContent={notFoundContent}
        onSelect={onSearchSelect}
        onCheck={onCheck}
        onActiveSearchChange={setActiveSearchIndex}
        onKeyDown={onKeyDown}
        popupRender={popupRender}
      />
    );
  } else {
    popupContent = (
      <Menus
        columns={columns}
        options={options}
        fns={fns}
        multiple={multiple}
        changeOnSelect={changeOnSelect}
        expandTrigger={expandTrigger}
        activePath={activePath}
        selectedValue={!multiple ? mergedValue : null}
        checkedSet={checkedSet}
        loadingNodes={loadingNodes}
        expandIcon={expandIcon}
        notFoundContent={notFoundContent}
        activeIndices={activeIndices}
        onColumnClick={onColumnClick}
        onCheck={onCheck}
        onHoverExpand={onHoverExpand}
        onItemHover={onItemHover}
        onKeyDown={onKeyDown}
        popupRender={popupRender}
        menuStyle={showSearchConfig && showSearchConfig.matchInputWidth ? { minWidth: 120 } : undefined}
      />
    );
  }

  const portalTarget = (getPopupContainer && getPopupContainer()) || document.body;

  return (
    <div className={rootCls} style={style} ref={triggerRef} id={id}>
      <div
        className="cascader-selector"
        tabIndex={disabled ? -1 : tabIndex}
        onClick={() => {
          if (disabled) return;
          if (!mergedOpen) changeOpen(true);
          else if (!multiple && !searchable) changeOpen(false);
        }}
        onMouseDown={(e) => {
          if (disabled) return;
          if (e.target.closest(".cascader-clear") || e.target.closest(".cascader-selection-item-remove"))
            return;
        }}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
        }}
        onKeyDown={onKeyDown}
        role="combobox"
        aria-expanded={mergedOpen}
        aria-haspopup="listbox"
      >
        {selectorContent}
        <span className="cascader-selector-suffix">{suffixNode}</span>
        {globalLoading && <LoadingIcon className="cascader-loading" />}
      </div>
      {mergedOpen &&
        createPortal(
          <div
            className={`cascader-dropdown cascader-dropdown-placement-${placement}${
              popupClassName ? " " + popupClassName : ""
            }`}
            style={Object.assign({ position: "fixed" }, popupStyleState, popupStyle)}
            ref={popupRef}
          >
            {popupContent}
          </div>,
          portalTarget
        )}
    </div>
  );
}
