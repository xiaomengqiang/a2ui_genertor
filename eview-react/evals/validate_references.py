#!/usr/bin/env python3
"""
静态校验脚本：检查 eview-react Skill 的 Reference 文件结构、交叉引用一致性、
资料来源可溯源性，以及正例代码中的 eview-react 反模式。

用法：python3 validate_references.py     （0 错 0 警才算完成）

── 编辑 Reference 前请先读 TODO.md 里的"Reference 写作硬约束" ──
  1. props / 回调 / ref 方法必须能在 eview-react 官方 TypeDoc 表或官网示例里一比一查到（资料在仓库根 hui参考文档/，不随 skill 打包）；
  2. 第 9 节速查只做 api 表的压缩，不新增行；
  3. 参数表与官方 demo 冲突时以 demo 为准；两处资料互相矛盾时显式标注、不拍板；
  4. 任何改动 0 错 0 警；校验告警先改文档，不要轻易放宽规则。
"""

import json
import re
import sys
from pathlib import Path
from typing import NamedTuple

SKILL_DIR = Path(__file__).resolve().parent.parent
REFS_DIR = SKILL_DIR / "references"
PATTERNS_DIR = REFS_DIR / "patterns"
SKILL_MD = SKILL_DIR / "SKILL.md"
TODO_MD = SKILL_DIR / "TODO.md"
EVALS_JSON = SKILL_DIR / "evals" / "evals.json"
REPO_ROOT = SKILL_DIR.parent.parent
README_MD = REPO_ROOT / "README.md"

REQUIRED_SECTIONS = [
    "## 1. 功能定位", "## 2. 典型场景", "## 3. 状态声明", "## 4. 事件与交互逻辑",
    "## 5. 数据结构", "## 6. 联动说明", "## 7. 完整代码示例", "## 8. 反面示例", "## 9. API 速查",
]

# 正例代码里不允许出现的 eview-react 反模式（antd 习惯 / 源码仓别名 / 不存在的 props）
EVIEW_FORBIDDEN = [
    (r"from\s+['\"]eview-react/", "源码仓别名导入 eview-react/，应为 @nce/eview-react/"),
    (r"from\s+['\"]antd['\"]", "从 antd 导入"),
    (r"<Button\b[^\n]*?\btype=\"(?:primary|default|danger|link)\"", "Button 用了 antd 的 type=，应为 status="),
    (r"<Button\b[^\n]*?\bloading=", "Button 没有 loading 属性"),
    (r"<Select\.Option\b|<Option\b|<Radio\.Group\b|<Radio\.Button\b", "antd 子组件写法"),
    (r"<Select\b[^\n]*?\bplaceholder=", "Select 占位应为 defaultLabel"),
    (r"<TextField\b[^\n]*?\brules=", "TextField 没有 rules 属性"),
    # 只查 onChange 里的 e.target.*：TextArea 等组件的 onBlur/onFocus 确实只给 event，读 e.target 是合法的
    (r"onChange=\{[^}]*\be\.target\.(?:value|checked)\b", "onChange 用原生 event 取值，eview 回调第一个参数已是值"),
    (r"\bconsole\.log\(", "正例代码不应遗留 console.log"),
]

# SKILL.md 里用反引号标出、但不是组件（不需要 Reference）的词
NON_COMPONENTS = {"IntlProvider", "ConfigProvider", "Set", "TextButton", "ScrollTable", "Option",
                  "Wizards", "BrowseButton", "Accordion", "TimeLine", "TabPane", "Step", "Upload",
                  "Input", "TimePicker", "TimeRangeSelector", "CheckableTag", "Modal", "Tabs", "Transfer",
                  "Chart", "ChartCard", "HexField", "PagingTree", "TreeSelector", "PageMessage", "Card",
                  "ProgressBar", "Carousel", "PopUpMenu", "DropDown", "ButtonMenu", "AutoComplete",
                  "Breadcrumb", "Collapse", "Tooltip", "Popover", "Spin", "Alert", "Descriptions"}
# eval 文本中出现的子组件 / 旧名 / 他库别名 → 收编到哪份父 Reference
CHILD_TO_PARENT = {"ButtonGroup": "Button", "CheckboxGroup": "Checkbox", "RadioGroup": "Radio",
                   "TabItem": "Tab", "Wizards": "Steps", "Segmented": "SelectCard", "Slider": "DragInput",
                   "InputNumber": "Spinner", "Rate": "Rating", "RangePicker": "DatePicker",
                   "Switch": "Toggle", "Pagination": "Paging", "IconButton": "Icon", "PanelItem": "Panel",
                   "Loader": "Loading"}


class Issue(NamedTuple):
    file: str
    level: str  # ERROR / WARN
    message: str


issues: list[Issue] = []


def add(file: str, level: str, msg: str) -> None:
    issues.append(Issue(file, level, msg))


def ref_files() -> list[Path]:
    """references/ 根目录下的组件 Reference（不含 patterns/）。"""
    return sorted(REFS_DIR.glob("*.md"))


def section(content: str, num: int) -> str:
    """截取 `## {num}.` 到下一个 H2 之间的正文。"""
    m = re.search(rf"## {num}\.[^\n]*\n(.*?)(?=\n## |\Z)", content, re.DOTALL)
    return m.group(1) if m else ""


# ── 1. 9 节模板 + ❌ 数量 + 资料来源头 ─────────────────────
def check_template() -> None:
    for md in ref_files():
        text = md.read_text(encoding="utf-8")
        for sec in REQUIRED_SECTIONS:
            if sec not in text:
                add(md.name, "ERROR", f"缺少标准章节：{sec}")
        if text.count("❌") < 2:
            add(md.name, "WARN", f"反面示例 ❌ 标记只有 {text.count('❌')} 个，建议至少 2 个")
        if "**资料来源**" not in text:
            add(md.name, "ERROR", "文件头缺少「资料来源」段，无法溯源")
        if "export default function" not in section(text, 7):
            add(md.name, "WARN", "第 7 节缺少 `export default function` 完整组件，建议给出可直接运行的示例")
        rows = [ln for ln in section(text, 9).split("\n") if ln.strip().startswith("|")]
        if len(rows) - 2 < 3:  # 去掉表头和分隔行
            add(md.name, "WARN", f"API 速查表只有 {max(len(rows) - 2, 0)} 行数据，建议 ≥ 3 行")


# ── 2. 链接目标必须存在，且不能指向 skill 目录之外（skill 会被单独打包） ──
def check_links() -> None:
    for md in list(ref_files()) + sorted(PATTERNS_DIR.glob("*.md")) + [SKILL_MD]:
        text = md.read_text(encoding="utf-8")
        if "hui参考文档" in text:
            add(md.name, "ERROR", "出现 hui参考文档 路径：原始资料不随 skill 打包，出处只能写纯文本文件名")
        for m in re.finditer(r"\]\(([^)\s#]+)(?:#[^)]*)?\)", text):
            target = m.group(1)
            if target.startswith(("http://", "https://")):
                continue
            resolved = (md.parent / target).resolve()
            if not resolved.exists():
                add(md.name, "ERROR", f"链接目标不存在：{target}")
            elif SKILL_DIR.resolve() not in resolved.parents and resolved != SKILL_DIR.resolve():
                add(md.name, "ERROR", f"链接指向 skill 目录之外，打包后失效：{target}")


# ── 3. SKILL.md 索引 ↔ 实际文件对齐（含 patterns/） ──────────
def check_index_alignment() -> None:
    skill = SKILL_MD.read_text(encoding="utf-8")
    actual = {f.stem for f in ref_files()}
    linked = set(re.findall(r"\[references/(\w+)\.md\]", skill))
    for name in sorted(actual - linked):
        add("SKILL.md", "ERROR", f"references/{name}.md 存在但未出现在组件索引中")
    for name in sorted(linked - actual):
        add("SKILL.md", "ERROR", f"索引引用了 references/{name}.md 但文件不存在")
    for p in PATTERNS_DIR.glob("*.md"):
        if f"references/patterns/{p.name}" not in skill:
            add("SKILL.md", "ERROR", f"patterns/{p.name} 存在但 SKILL.md 未引用")


# ── 4. 数量声明一致（SKILL / README / TODO 的"N 个组件"） ────
def check_counts() -> None:
    actual = len(ref_files())
    for path in (SKILL_MD, README_MD, TODO_MD):
        if not path.exists():
            # 仓库级 README 不随 skill 打包，单独打包后缺失是正常的，静默跳过
            if path is not README_MD:
                add(path.name, "WARN", "文件不存在，跳过数量校验")
            continue
        text = path.read_text(encoding="utf-8")
        # 覆盖三种写法："N 个组件" / "N 个 Reference" / "组件覆盖（当前 N 个）" / 资产表 "组件 Reference | N 个"
        pattern = r"(\d+)\s*个\s*(?:高频\s*)?(?:组件|Reference)|(?:当前|Reference\s*\|)\s*(\d+)\s*个"
        for m in re.finditer(pattern, text):
            claimed = int(m.group(1) or m.group(2))
            if claimed != actual:
                add(path.name, "ERROR", f"声称 {claimed} 个组件，实际 {actual} 个 → {m.group(0)}")


# ── 5. 正例代码中的 eview-react 反模式 ─────────────────────
def check_eview_compliance() -> None:
    for md in list(ref_files()) + [SKILL_MD] + sorted(PATTERNS_DIR.glob("*.md")):
        text = md.read_text(encoding="utf-8")
        in_code, in_bad = False, False
        for i, line in enumerate(text.split("\n"), 1):
            if line.strip().startswith("```"):
                in_code = not in_code
                continue
            if not in_code:
                # §8 反面示例整节跳过；其他 H2 标题退出反例区
                if line.startswith("## "):
                    in_bad = "反面示例" in line
                continue
            if in_bad or "❌" in line or line.strip().startswith("//"):
                continue
            for pattern, desc in EVIEW_FORBIDDEN:
                if re.search(pattern, line):
                    add(md.name, "WARN", f"第 {i} 行正例代码疑似反模式 [{desc}]：{line.strip()[:80]}")


# ── 6. evals.json 结构 + 组件覆盖 ────────────────────────────
def check_evals() -> None:
    if not EVALS_JSON.exists():
        add("evals.json", "ERROR", "文件不存在")
        return
    try:
        data = json.loads(EVALS_JSON.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        add("evals.json", "ERROR", f"JSON 解析失败：{e}")
        return
    skill = SKILL_MD.read_text(encoding="utf-8")
    indexed = set(re.findall(r"`([A-Z][a-zA-Z]+)`", skill)) - NON_COMPONENTS
    refs = {f.stem for f in ref_files()}
    ids = set()
    for ev in data.get("evals", []):
        eid = ev.get("id")
        if eid in ids:
            add("evals.json", "ERROR", f"用例 id 重复：{eid}")
        ids.add(eid)
        if len(ev.get("assertions", [])) < 4:
            add("evals.json", "WARN", f"用例 {eid} 断言少于 4 条")
        for a in ev.get("assertions", []):
            if a.get("type") not in {"contains_pattern", "behavioral", "eview_compliance"}:
                add("evals.json", "ERROR", f"用例 {eid} 断言类型非法：{a.get('type')}")
        text = "\n".join([ev.get("prompt", ""), ev.get("expected_output", "")]
                         + [a.get("text", "") for a in ev.get("assertions", [])])
        for word in set(re.findall(r"\b([A-Z][a-z]+(?:[A-Z][a-z]+)*)\b", text)):
            name = CHILD_TO_PARENT.get(word, word)
            if name in indexed and name not in refs:
                add("evals.json", "ERROR", f"用例 {eid} 涉及组件 `{name}` 但 references/{name}.md 不存在")


# ── 7. README 目录树 ↔ 实际文件 ──────────────────────────────
def check_readme_tree() -> None:
    if not README_MD.exists():
        return
    readme = README_MD.read_text(encoding="utf-8")
    for f in ref_files():
        if f.name not in readme:
            add("README.md", "WARN", f"{f.name} 存在但未在 README 目录树中列出")
    # 目录树里首字母大写的 .md 视为组件 Reference；排除仓库级文档本身
    for name in set(re.findall(r"[├└]──\s+([A-Z]\w+\.md)", readme)) - {"README.md", "TODO.md", "SKILL.md"}:
        if not (REFS_DIR / name).exists():
            add("README.md", "ERROR", f"README 目录树列出了 {name} 但文件不存在")


def main() -> int:
    print("=" * 60)
    print("eview-react 静态校验")
    print("=" * 60)
    print(f"\nReference 文件数量：{len(ref_files())}（patterns：{len(list(PATTERNS_DIR.glob('*.md')))}）\n")

    check_template()
    check_links()
    check_index_alignment()
    check_counts()
    check_eview_compliance()
    check_evals()
    check_readme_tree()

    errors = [i for i in issues if i.level == "ERROR"]
    warns = [i for i in issues if i.level == "WARN"]
    if not issues:
        print("✅ 全部通过，未发现问题！\n")
        return 0
    for iss in errors:
        print(f"  ERROR  [{iss.file}] {iss.message}")
    for iss in warns:
        print(f"  WARN   [{iss.file}] {iss.message}")
    print(f"\n总计：{len(errors)} 错误，{len(warns)} 警告")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
