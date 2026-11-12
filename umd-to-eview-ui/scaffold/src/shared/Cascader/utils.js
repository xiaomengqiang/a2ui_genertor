// cascader/utils.js
// Hand-written pure utilities for the Cascader component (no third-party deps).

const DEFAULT_FIELD_NAMES = { label: "label", value: "value", children: "children" };
const SEP = "\u0001";

export function normalizeFieldNames(fieldNames) {
  if (fieldNames && typeof fieldNames === "object") {
    return Object.assign({}, DEFAULT_FIELD_NAMES, fieldNames);
  }
  return DEFAULT_FIELD_NAMES;
}

export function getLabel(option, fns) {
  return option == null ? undefined : option[fns.label];
}
export function getValue(option, fns) {
  return option == null ? undefined : option[fns.value];
}
export function getChildren(option, fns) {
  if (option == null) return undefined;
  const c = option[fns.children];
  return Array.isArray(c) ? c : undefined;
}
export function isOptionLeaf(option, fns) {
  if (option == null) return true;
  if (option.isLeaf === false) return false;
  if (option.isLeaf === true) return true;
  const c = getChildren(option, fns);
  return !c || c.length === 0;
}

export function pathKey(path) {
  return path.map((v) => String(v)).join(SEP);
}

export function isPrefix(short, long) {
  if (long.length < short.length) return false;
  for (let i = 0; i < short.length; i++) {
    if (String(short[i]) !== String(long[i])) return false;
  }
  return true;
}

export function shallowEqualArrays(a, b) {
  if (a === b) return true;
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function findOption(list, value, fns) {
  if (!Array.isArray(list)) return undefined;
  return list.find((o) => getValue(o, fns) === value);
}

// Resolve a value-path (array of values) into the matching option objects.
export function resolveOptionPath(options, valuePath, fns) {
  const result = [];
  let list = options;
  for (const v of valuePath) {
    const opt = findOption(list, v, fns);
    if (!opt) break;
    result.push(opt);
    list = getChildren(opt, fns);
  }
  return result;
}

// Deep-find the full value-path that ends at a single target value.
export function findValuePath(options, targetValue, fns) {
  function dfs(list, path) {
    for (const o of list) {
      const v = getValue(o, fns);
      const next = path.concat(v);
      if (v === targetValue) return next;
      const c = getChildren(o, fns);
      if (c && c.length) {
        const r = dfs(c, next);
        if (r) return r;
      }
    }
    return undefined;
  }
  return dfs(options, []) || [];
}

// Walk all selectable nodes (leaf, or every node when changeOnSelect) in a subtree.
export function walkSelectable(list, prefix, fns, changeOnSelect, cb) {
  if (!Array.isArray(list)) return;
  list.forEach((o) => {
    const v = getValue(o, fns);
    const path = prefix.concat(v);
    const leaf = isOptionLeaf(o, fns);
    const selectable = changeOnSelect || leaf;
    if (selectable) cb(path, o, leaf);
    const c = getChildren(o, fns);
    if (c && c.length) walkSelectable(c, path, fns, changeOnSelect, cb);
  });
}

// All selectable value-paths in the whole tree.
export function collectSelectablePaths(options, fns, changeOnSelect) {
  const out = [];
  walkSelectable(options, [], fns, changeOnSelect, (p) => out.push(p));
  return out;
}

// ---------- Multiple selection (tree checkbox semantics) ----------

// Checked state of a single node: 'checked' | 'indeterminate' | 'unchecked'.
export function getNodeCheckState(options, fns, changeOnSelect, checkedSet, nodePath) {
  const optionPath = resolveOptionPath(options, nodePath, fns);
  const node = optionPath[optionPath.length - 1];
  if (!node) return "unchecked";
  let total = 0;
  let checked = 0;
  const selfSelectable = changeOnSelect || isOptionLeaf(node, fns);
  if (selfSelectable) {
    total++;
    if (checkedSet.has(pathKey(nodePath))) checked++;
  }
  const children = getChildren(node, fns);
  if (children && children.length) {
    walkSelectable(children, nodePath, fns, changeOnSelect, (p) => {
      total++;
      if (checkedSet.has(pathKey(p))) checked++;
    });
  }
  if (checked === 0) return "unchecked";
  if (total > 0 && checked === total) return "checked";
  return "indeterminate";
}

// Toggle a node; returns a NEW checkedSet.
export function toggleNode(options, fns, changeOnSelect, checkedSet, nodePath, currentState) {
  const optionPath = resolveOptionPath(options, nodePath, fns);
  const node = optionPath[optionPath.length - 1];
  const newSet = new Set(checkedSet);
  if (!node) return newSet;
  const shouldCheck = currentState !== "checked";
  const selfSelectable = changeOnSelect || isOptionLeaf(node, fns);
  const targets = [];
  if (selfSelectable) targets.push(nodePath);
  const children = getChildren(node, fns);
  if (children && children.length) {
    walkSelectable(children, nodePath, fns, changeOnSelect, (p) => targets.push(p));
  }
  for (const p of targets) {
    if (shouldCheck) newSet.add(pathKey(p));
    else newSet.delete(pathKey(p));
  }
  return newSet;
}

// Build the internal checkedSet from an incoming value (string[][]), expanding parent paths.
export function buildCheckedSetFromValue(options, value, fns, changeOnSelect) {
  const set = new Set();
  if (!Array.isArray(value)) return set;
  value.forEach((vp) => {
    if (!Array.isArray(vp) || vp.length === 0) return;
    const optionPath = resolveOptionPath(options, vp, fns);
    const node = optionPath[optionPath.length - 1];
    if (!node) return;
    const selfSelectable = changeOnSelect || isOptionLeaf(node, fns);
    if (selfSelectable) set.add(pathKey(vp));
    const children = getChildren(node, fns);
    if (children && children.length) {
      walkSelectable(children, vp, fns, changeOnSelect, (p) => set.add(pathKey(p)));
    }
  });
  return set;
}

// Convert the internal checkedSet back to an output value, honoring showCheckedStrategy.
export function getCheckedValue(options, fns, changeOnSelect, checkedSet, strategy) {
  const result = [];
  function dfs(list, prefix) {
    if (!Array.isArray(list)) return;
    list.forEach((o) => {
      const v = getValue(o, fns);
      const path = prefix.concat(v);
      const c = getChildren(o, fns);
      const selfSelectable = changeOnSelect || isOptionLeaf(o, fns);
      let total = 0;
      let checked = 0;
      if (selfSelectable) {
        total++;
        if (checkedSet.has(pathKey(path))) checked++;
      }
      if (c && c.length) {
        walkSelectable(c, path, fns, changeOnSelect, (p) => {
          total++;
          if (checkedSet.has(pathKey(p))) checked++;
        });
      }
      const fully = total > 0 && checked === total;

      if (strategy === "SHOW_PARENT") {
        if (fully) result.push(path);
        else if (c && c.length) dfs(c, path);
      } else if (strategy === "SHOW_CHILD") {
        if (selfSelectable && checkedSet.has(pathKey(path))) {
          let hasCheckedDesc = false;
          if (c && c.length) {
            walkSelectable(c, path, fns, changeOnSelect, (p) => {
              if (checkedSet.has(pathKey(p))) hasCheckedDesc = true;
            });
          }
          if (!hasCheckedDesc) result.push(path);
        }
        if (c && c.length) dfs(c, path);
      } else {
        if (selfSelectable && checkedSet.has(pathKey(path))) result.push(path);
        if (c && c.length) dfs(c, path);
      }
    });
  }
  dfs(options, []);
  return result;
}

// ---------- Search ----------

// Flatten selectable paths for search results.
export function flattenOptions(options, fns, changeOnSelect) {
  const result = [];
  walkSelectable(options, [], fns, changeOnSelect, (path, o, leaf) => {
    const optionPath = resolveOptionPath(options, path, fns);
    const labelPath = optionPath.map((opt) => getLabel(opt, fns));
    result.push({ optionPath, labelPath, valuePath: path, isLeaf: leaf });
  });
  return result;
}

export function defaultFilter(inputValue, labelPath) {
  const iv = String(inputValue || "").toLowerCase();
  if (!iv) return true;
  return labelPath.some((l) => String(l).toLowerCase().includes(iv));
}

// Split text into segments, marking those that match the keyword (for highlighting).
export function splitByKeyword(text, keyword) {
  const kw = String(keyword || "");
  const str = String(text);
  if (!kw) return [{ text: str, hit: false }];
  const lower = str.toLowerCase();
  const kl = kw.toLowerCase();
  const parts = [];
  let i = 0;
  while (i <= lower.length) {
    const idx = lower.indexOf(kl, i);
    if (idx === -1) {
      parts.push({ text: str.slice(i), hit: false });
      break;
    }
    if (idx > i) parts.push({ text: str.slice(i, idx), hit: false });
    parts.push({ text: str.slice(idx, idx + kw.length), hit: true });
    i = idx + kw.length;
  }
  return parts;
}
