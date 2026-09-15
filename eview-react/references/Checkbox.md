# Checkbox 组件功能逻辑规格（含 CheckboxGroup）

> **资料来源**（eview-react 官方资料，不随 skill 打包）：TypeDoc 类型表 `Checkbox/types`、`CheckboxGroup/types`；官网组件页 Checkbox 及示例 `Basic.tsx` / `Disabled.tsx` / `Tip.tsx` / `GroupBasic.tsx` / `GroupRequired.tsx` / `GroupSelectAll.tsx`
>
> CheckboxGroup 的官方示例与说明都收在 Checkbox 组件页下（GroupBasic / GroupRequired / GroupSelectAll），本文一并覆盖；独立的 `CheckboxGroup.md` 留待后续。

## 1. 功能定位

Checkbox 是单个复选框，三态：未选 / 选中 / 半选（`halfChecked`）。CheckboxGroup 是 `data` 驱动的复选框组，自带全选、必填、行列排布。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 一组可多选的枚举项（表单字段） | `CheckboxGroup` + `data` | `<CheckboxGroup>` 里嵌 `<Checkbox>` children（不支持） |
| 列表 / 表格每行一个勾选 + 表头全选 | 多个 `Checkbox` + 一个 `halfChecked` 表头 | — |
| 单个开关式布尔项（"记住我"、"同意协议"） | `Checkbox` | `Toggle`（第二批，语义是开关不是勾选） |
| 表格整列勾选 | `Table` 的 `enableCheckBox`（第二批） | 自己往单元格塞 Checkbox |

## 2. 典型场景

- 表单里的多选字段："告警级别"选紧急 / 重要 / 次要，必填至少一项
- 待办 / 资源列表：每行勾选 → 计数 → 批量删除；表头全选 / 半选
- 协议勾选：勾上才允许点"注册"
- 权限矩阵：一组 CheckboxGroup 按 `rows` 分行排布

## 3. 状态声明

```tsx
// 单个布尔项
const [agreed, setAgreed] = useState<boolean>(false);

// CheckboxGroup：value 是选中项 value 的数组
const [levels, setLevels] = useState<Array<number>>([]);

// 列表逐行勾选：用"选中 id 集合"而不是给每行对象加 checked 字段，派生全选 / 半选
const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
const allChecked = items.length > 0 && checkedIds.size === items.length;
const halfChecked = checkedIds.size > 0 && !allChecked;
```

## 4. 事件与交互逻辑

### Checkbox.onChange —— `(value, checked, event, additionalData)`，第二个参数才是勾选态

```tsx
<Checkbox
  label="我已阅读并同意《服务协议》"
  value="agree"
  checked={agreed}
  onChange={(value, checked: boolean) => setAgreed(checked)}
/>
<Button status="primary" text="注册" disabled={!agreed} onClick={handleRegister} />
```

### onPreChange —— 返回 false 阻止本次切换（如禁止取消最后一项）

```tsx
<Checkbox
  label={item.name}
  value={item.id}
  checked={checkedIds.has(item.id)}
  onPreChange={(value, nextChecked: boolean) => {
    if (!nextChecked && checkedIds.size === 1) {
      showTip('至少保留一项');
      return false;                       // 拦住
    }
    return true;
  }}
  onChange={(value, checked: boolean) => toggleId(item.id, checked)}
/>
```

### 表头全选 / 半选

```tsx
<Checkbox
  label="全选"
  checked={allChecked}
  halfChecked={halfChecked}
  onChange={(value, checked: boolean) => {
    setCheckedIds(checked ? new Set(items.map((i) => i.id)) : new Set());
  }}
/>
```

### CheckboxGroup —— data 驱动 + value 数组 + selectAll

```tsx
const levelData = [
  { value: 1, text: '紧急', tipText: '需立即处理' },
  { value: 2, text: '重要' },
  { value: 3, text: '次要' },
];
<CheckboxGroup
  label="告警级别"
  required                                   // 必填：一项都不选时校验不过
  data={levelData}
  value={levels}
  selectAll={{ text: '全部', onChange: (selected, event) => {} }}   // 全选框（GroupSelectAll.tsx）
  rows="0:1|2"                               // 第一行 0-1 项，第二行第 2 项
  onChange={(value: number[], oldValue: number[], event) => setLevels(value)}
/>
```

## 5. 数据结构

```tsx
// CheckboxGroup.data 每一项（api/CheckboxGroup_types.md）
interface CheckboxGroupItem {
  value: string | number;      // 存取值
  text: string;                // 显示文字 —— 不是 label
  checked?: boolean;           // 初始选中（有 value 属性时以 value 数组为准）
  tipText?: string;            // 悬浮提示
}

// 列表勾选场景的行数据：不要在行对象里塞 checked，用外部 Set 管理
interface TaskItem {
  id: string;
  title: string;
}
```

## 6. 联动说明

- 勾选数量 `checkedIds.size` > 0 → 显示 / 解锁"批量删除"按钮，按钮文案带计数
- 全选框状态由子项派生：全选中 → `checked`；部分 → `halfChecked`；都不选 → 两者皆 false
- 批量删除成功 → 从 `items` 移除 → 同步 `checkedIds` 删掉已不存在的 id
- 协议 Checkbox → 注册按钮 `disabled`
- CheckboxGroup `required` 校验与 TextField / Select 一并纳入提交前校验（`hintType` 决定提示形式）

## 7. 完整代码示例

```tsx
import React, { useMemo, useState } from 'react';
import Checkbox from '@nce/eview-react/Checkbox';
import CheckboxGroup from '@nce/eview-react/CheckboxGroup';
import Button from '@nce/eview-react/Button';

interface TaskItem {
  id: string;
  title: string;
}

// 待办列表：逐行勾选 + 表头全选/半选 + 批量删除 + 一组筛选 CheckboxGroup
export default function TodoBatchPage() {
  const [items, setItems] = useState<TaskItem[]>([
    { id: 't1', title: '巡检核心交换机' },
    { id: 't2', title: '更新告警阈值' },
    { id: 't3', title: '导出上月报表' },
  ]);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [levels, setLevels] = useState<number[]>([1]);
  const [deleting, setDeleting] = useState<boolean>(false);

  const allChecked = items.length > 0 && checkedIds.size === items.length;
  const halfChecked = checkedIds.size > 0 && !allChecked;

  const levelData = useMemo(
    () => [
      { value: 1, text: '紧急' },
      { value: 2, text: '重要' },
      { value: 3, text: '次要' },
    ],
    [],
  );

  // 单行勾选：复制 Set 再修改，保证 state 不可变
  const toggleId = (id: string, checked: boolean) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleToggleAll = (value: any, checked: boolean) => {
    setCheckedIds(checked ? new Set(items.map((i) => i.id)) : new Set());
  };

  const handleBatchDelete = async () => {
    if (deleting || checkedIds.size === 0) return;
    setDeleting(true);
    try {
      // 真实项目替换为已有 Service
      await new Promise((resolve) => setTimeout(resolve, 300));
      setItems((prev) => prev.filter((i) => !checkedIds.has(i.id)));
      setCheckedIds(new Set());
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ width: 480, padding: 24 }}>
      <CheckboxGroup
        label="级别筛选"
        required
        hintType="tip"
        data={levelData}
        value={levels}
        onChange={(value: number[]) => setLevels(value)}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '16px 0' }}>
        <Checkbox label="全选" checked={allChecked} halfChecked={halfChecked} onChange={handleToggleAll} />
        <Button
          status="risk"
          text={deleting ? '删除中...' : `删除所选（${checkedIds.size}）`}
          disabled={checkedIds.size === 0 || deleting}
          onClick={handleBatchDelete}
        />
      </div>

      {items.length === 0 ? (
        <div style={{ color: '#939393' }}>暂无待办</div>
      ) : (
        items.map((item) => (
          <div key={item.id} style={{ padding: '8px 0' }}>
            <Checkbox
              label={item.title}
              value={item.id}
              checked={checkedIds.has(item.id)}
              onChange={(value, checked: boolean) => toggleId(item.id, checked)}
            />
          </div>
        ))
      )}
    </div>
  );
}
```

## 8. 反面示例

```tsx
// ❌ CheckboxGroup 嵌 children（rules/component-use.md：Group 类组件必须用 data）
<CheckboxGroup value={levels}>
  <Checkbox value={1} label="紧急" />
</CheckboxGroup>

// ❌ 把 onChange 第一个参数当勾选态（第一个是 value，第二个才是 checked）
<Checkbox onChange={(checked) => setAgreed(checked)} />

// ❌ antd 习惯：eview-react 没有 indeterminate / onChange(e) / e.target.checked
<Checkbox indeterminate={half} onChange={(e) => setAll(e.target.checked)} />

// ❌ data 字段名写 label（应为 text）
<CheckboxGroup data={[{ label: '紧急', value: 1 }]} />

// ❌ 全选框自己存一份 allChecked state，与子项脱节
const [allChecked, setAllChecked] = useState(false);
<Checkbox checked={allChecked} onChange={(v, c) => setAllChecked(c)} />

// ❌ 直接 mutate Set / 数组，React 不重渲染
checkedIds.add(item.id); setCheckedIds(checkedIds);
```

## 9. API 速查

> 压缩自 `api/Checkbox_types.md` / `api/CheckboxGroup_types.md`。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `Checkbox.label` / `value` | `string` / `any` | 显示文字 / 存取值 |
| `Checkbox.checked` | `boolean`，默认 `false` | 是否选中 |
| `Checkbox.halfChecked` | `boolean`，默认 `false` | 半选态（与 `checked` 同时传，见 Basic.tsx） |
| `Checkbox.disabled` | `boolean`，默认 `false` | 灰化 |
| `Checkbox.labelPosition` | `'before' \| 'after'`，默认 `after` | 文字在图标左 / 右 |
| `Checkbox.onChange` | `(value, checked, event, additionalData) => void` | **第二个参数**是勾选态 |
| `Checkbox.onPreChange` | `(value, checked, event) => boolean` | 返回 `false` 阻止切换 |
| `Checkbox.onFocus` / `onBlur` | `(value, checked, event) => void` | 聚焦 / 失焦 |
| `Checkbox.additionalData` | `object` | 透传到 `onChange` 第四参 |
| `Checkbox.tipText` / `tipData` | `string` / `object` | 悬浮提示文案 / 配置（`disposeTimeOut`、`arrowDirection`） |
| `Checkbox.name` / `boxTabIndex` | `string` | 表单 name / 方框 tabindex |
| `CheckboxGroup.data` | `Array<{ value, text, checked?, tipText? }>` | 选项数据 |
| `CheckboxGroup.value` | `any[]` | 选中值数组 |
| `CheckboxGroup.onChange` | `(value, oldValue, event) => void` | 选中集合变化 |
| `CheckboxGroup.selectAll` | `{ text?, checked?, onChange? }` | 全选框；`checked` 优先于子项 |
| `CheckboxGroup.rows` | `string`，如 `"0:2\|3:5\|6"` | 行列排布（`a:b` 范围或 `a,b` 枚举，勿混用） |
| `CheckboxGroup.required` / `disabled` | `boolean`，默认 `false` | 必填 / 灰化 |
| `CheckboxGroup.validtor` | `{ minSelect?, maxSelect? }` | 仅支持最少 / 最多选几项（API 表拼写即为 `validtor`） |
| `CheckboxGroup.hintType` | `'div' \| 'tip'` | 提示形式 |
| `CheckboxGroup.label` / `labelPosition` / `itemLabelPosition` | `string` / `'before' \| 'after'` | 组名（默认 before）/ 子项文字位置（默认 after） |
| `CheckboxGroup.fieldStyle` / `fieldClassName` | 样式 | 子项样式（如宽度） |
