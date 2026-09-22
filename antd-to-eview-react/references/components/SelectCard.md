# SelectCard 组件功能逻辑规格（官网页面名：Segmented / 分段选项卡）

> **资料来源**（eview-react 官方资料，不随 skill 打包）：TypeDoc 类型表 `SelectCard/types`、`Segmented/types`（内容相同，后者多 `isTipShow` 3.5.31 / `disable` 3.7.18）；官网组件页 Segmented（标题 SelectCard，3.5.5 起）及示例 `SelectCardDemo.jsx` / `SelectCardEvent.jsx` / `SelectCardDisable.jsx` / `SelectCardChangeData.jsx` / `SelectTipsCard.jsx` / `SelectCardShowTip.jsx`
>
> ⚠️ **导入名是 `SelectCard`**：`import SelectCard from '@nce/eview-react/SelectCard'`。官网页面叫 Segmented，但 `Segmented` 不在导出清单里，demo 也全部导入 `SelectCard`。
> ⚠️ 禁用属性是 **`disable`**（组件级与选项级都是），不是 `disabled`。

## 1. 功能定位

SelectCard 是一组互斥的选项卡按钮（分段控制器），`data` 驱动，点一个选一个，适合 2-6 个短选项的快速切换。

| 想要的效果 | 用什么 | 不要用 |
|-----------|--------|--------|
| 规格 / 档位选择（100MB / 200MB / 500MB） | `SelectCard` | antd `Segmented` / `Radio.Button` |
| 视图切换（列表 / 卡片） | `SelectCard type="small"` | Tab |
| 选项 > 6 或需要搜索 | `Select`（[Select.md](Select.md)） | 一长排 SelectCard |
| 选项要带说明文字、竖排 | `RadioGroup`（[Radio.md](Radio.md)） | SelectCard |

## 2. 典型场景

- 购买 / 配置页的规格档位：选中后联动价格或下方表单
- 图表时间粒度切换：近 1 天 / 7 天 / 30 天 → 重新拉数据
- 列表视图切换：表格视图 / 卡片视图
- 部分档位不可选（库存不足）：选项级 `disable`，悬浮 `tipsText` 说明原因

## 3. 状态声明

```tsx
// 选中值：存 data[].value（string | number）
const [size, setSize] = useState<number>(200);

// 选项常量或来自接口
const sizeOptions: SelectCardItem[] = [
  { value: 100, text: '100MB' },
  { value: 200, text: '200MB' },
  { value: 500, text: '500MB', disable: true, tipsText: '当前区域暂不支持' },
];
```

## 4. 事件与交互逻辑

### onChange(value, event) —— 第一个参数是选中项的 value

```tsx
<SelectCard
  label="规格"
  data={sizeOptions}
  value={size}
  onChange={(value: number, event) => {
    setSize(value);
    setPrice(PRICE_MAP[value]);          // 联动
  }}
/>
```

### 小尺寸 / 整体禁用 / 关闭悬浮提示

```tsx
<SelectCard type="small" data={viewOptions} value={view} onChange={(v: string) => setView(v)} />
<SelectCard data={sizeOptions} value={size} disable={submitting} />       // 提交中整体禁用
<SelectCard data={sizeOptions} value={size} isTipShow={false} />          // 默认悬浮显示 text 或 tipsText
```

### 动态改选项（demo SelectCardChangeData.jsx）

```tsx
// 父级切换后替换 data；当前 value 不在新 data 里时要重置
const handleRegionChange = (region: string) => {
  const next = SIZE_BY_REGION[region];
  setSizeOptions(next);
  if (!next.some((o) => o.value === size)) setSize(next[0].value);
};
```

## 5. 数据结构

```tsx
// SelectCard.data 每一项（ItemType）
interface SelectCardItem {
  value: string | number;               // 必填，选项值
  text: string;                         // 必填，显示文本 —— 不是 label
  disable?: boolean;                    // 选项禁用（注意拼写）
  tipsText?: string | React.ReactNode;  // 悬浮提示，不设则显示 text
}
```

## 6. 联动说明

- 档位变化 → 价格 / 配额 / 下方表单默认值联动；切换时清掉与旧档位绑定的输入
- 时间粒度变化 → 图表 / 列表重新请求（带取消标记防串数据）
- 父级选项变化 → 替换 `data`，并校正不在新选项里的 `value`
- `required` 用于表单场景，配合 Form 时不传 `value` / `onChange`，由 Form 按 `name` 托管

## 7. 完整代码示例

```tsx
import React, { useState } from 'react';
import SelectCard from '@nce/eview-react/SelectCard';
import Button from '@nce/eview-react/Button';

interface SelectCardItem {
  value: number;
  text: string;
  disable?: boolean;
  tipsText?: string;
}

const SIZE_OPTIONS: SelectCardItem[] = [
  { value: 100, text: '100MB' },
  { value: 200, text: '200MB' },
  { value: 500, text: '500MB' },
  { value: 800, text: '800MB', disable: true, tipsText: '当前区域暂不支持 800MB' },
];
const PRICE_MAP: Record<number, number> = { 100: 10, 200: 18, 500: 40, 800: 60 };
const RANGE_OPTIONS = [
  { value: '1d', text: '近 1 天' },
  { value: '7d', text: '近 7 天' },
  { value: '30d', text: '近 30 天' },
];

// 购买配置：规格档位联动价格；小尺寸选项卡切换统计范围并重新拉数据
export default function PurchaseConfig() {
  const [size, setSize] = useState<number>(200);
  const [range, setRange] = useState<string>('7d');
  const [usage, setUsage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleRangeChange = async (value: string) => {
    setRange(value);
    setLoading(true);
    try {
      // 真实项目替换为已有 Service
      await new Promise((resolve) => setTimeout(resolve, 300));
      setUsage(`${value} 内平均用量 ${Math.round(Math.random() * 100)}MB`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      alert(`已购买 ${size}MB，¥${PRICE_MAP[size]}/月`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ width: 520, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SelectCard label="规格" data={SIZE_OPTIONS} value={size} disable={submitting} onChange={(value: number) => setSize(value)} />
      <div>价格：¥{PRICE_MAP[size]} / 月</div>

      <SelectCard label="统计范围" type="small" data={RANGE_OPTIONS} value={range} onChange={handleRangeChange} />
      <div style={{ color: '#676767' }}>{loading ? '加载中...' : usage || '请选择统计范围'}</div>

      <div>
        <Button status="primary" text={submitting ? '提交中...' : '立即购买'} disabled={submitting} onClick={handleSubmit} />
      </div>
    </div>
  );
}
```

## 8. 反面示例

```tsx
// ❌ 导入不存在的名字（官网页面叫 Segmented，导出名是 SelectCard）
import Segmented from '@nce/eview-react/Segmented';

// ❌ antd 习惯：没有 options / Radio.Button / block
<Segmented options={['列表', '卡片']} block onChange={setView} />
<Radio.Group optionType="button" />

// ❌ 拼写错：禁用是 disable，不是 disabled（组件级与选项级同理）
<SelectCard data={opts} disabled />
const opts = [{ value: 1, text: 'A', disabled: true }];

// ❌ data 字段名写 label（应为 text）
<SelectCard data={[{ value: 1, label: '100MB' }]} />

// ❌ 替换 data 后不校正 value，选中值落在新选项之外
setSizeOptions(next); // 少了 if (!next.some(o => o.value === size)) setSize(...)
```

## 9. API 速查

> 压缩自 `SelectCard/types` + `Segmented/types`；ref 方法仅列官网 API 表出现的。

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `data` | `Array<{ value, text, disable?, tipsText? }>` | 选项数据 |
| `value` | `string \| number` | 选中项的 value |
| `onChange` | `(value, event) => void` | 切换回调，第一个参数是选中值 |
| `type` | `'default' \| 'small'`，默认 `default` | 大 / 小尺寸 |
| `disable` | `boolean`，默认 `false`（3.7.18） | 整体禁用（**不是 disabled**） |
| `isTipShow` | `boolean`，默认 `true`（3.5.31） | 悬浮是否显示提示 |
| `label` / `labelPosition` | `string` / `'before' \| 'after'`（默认 before） | 名称文字及位置 |
| `required` | `boolean`，默认 `false` | 必填 |
| `itemStyle` / `itemClassName` | `CSSProperties` / `string` | 单个选项卡样式 |
| `labelStyle` / `labelClassName` / `style` / `className` / `id` | — | 常规透传 |
| `ref.getValue()` | `() => value` | 获取选中值（官网 API 表 methods） |
