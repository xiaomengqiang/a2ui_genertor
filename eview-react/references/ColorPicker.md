# ColorPicker 组件功能逻辑规格（颜色选择器）

> ⚠️ 核验的 3.10 源码线中，**`onColorChange(color)` 仅在确认提交颜色时触发，不随拖动实时触发**；回传带 `#` 的 6 位 hex 字符串，如 `#ff0000`，不是 Color 对象或原生 event。
> ⚠️ 使用子路径默认导入 `@nce/eview-react/ColorPicker`。已有入口清单未列出根命名导出，不生成 `import { ColorPicker } from '@nce/eview-react'`。

## 1. 功能定位

ColorPicker 用于选择业务展示颜色，例如图例、分类和标记色。`value` + `onColorChange` 保存选择结果，颜色预览和保存操作由业务处理。

| 需求 | 用法 |
|------|------|
| 选择分类 / 图例颜色 | ColorPicker + 字符串状态 + 文字预览 |
| 不允许编辑 | `disabled`，保留当前 `value` |
| 状态等级展示 | 优先用 [Tag](Tag.md) / [Badge](Badge.md) 的语义色 |

## 2. 典型场景

- 编辑分类颜色：在色板中确认后更新预览，再点业务保存按钮提交。
- 图表系列配色：以业务 ID 存储每条序列的颜色。
- 权限只读：禁用选择器及提交按钮，仍显示当前颜色文本。

## 3. 状态声明

```tsx
const [color, setColor] = useState<string>('#0077ee');
const [savedColor, setSavedColor] = useState<string>('#0077ee');
const dirty = color !== savedColor;
```

编辑态保存业务草稿与已保存值两份状态。可以通过 state 恢复草稿；外部 `value` 变化后，色板内部回填与重置的精确同步行为仍需验证。不要假设存在 `defaultValue` / `reset()`。

## 4. 事件与交互逻辑

```tsx
<ColorPicker
  value={color}
  onColorChange={(nextColor: string) => setColor(nextColor)}
/>
```

- `onColorChange(color)` 是色板确认提交入口；只有确认后的颜色更新业务状态，拖动过程不通过该回调实时预览。
- `onClick(event, color)` 是点击通知，`onCollapse(event, color)` 是弹层收起通知；第二参才是颜色。
- 收起不等于业务保存成功。需要确认保存时由独立按钮提交，失败保留草稿。
- 禁用使用 `disabled`；业务保存函数也复核权限与忙碌状态。

### Form 托管

```tsx
<Form initialValues={{ color: '#0077ee' }}>
  <Form.Item label="分类颜色" name="color" updateTrigger="onColorChange">
    <ColorPicker />
  </Form.Item>
</Form>
```

Form 使用默认的 `value` 属性和回调第一参，无须额外 `valuePropName="value"`、`updateTriggerIndex` 或值转换；子控件不再独立传 `value` / `onColorChange`。此取值接入已确认，精确回填与重置仍需单独核验。

## 5. 数据结构

```tsx
interface CategoryColor {
  id: string;
  color: string;
}
type ColorPickerEvent = Event | React.MouseEvent | React.KeyboardEvent;
```

确认回调输出 `#RRGGBB` 形式的 6 位 hex 字符串；直接保留回传值，不套用 `format` / `presets` / `disabledAlpha` 等未记录接口。

## 6. 联动说明

- 色板确认后更新业务草稿、预览色块与颜色文本，避免只靠颜色表达状态。
- 保存成功后更新已保存值；保存失败后恢复按钮可用，保留选色结果供重试。
- 选色面板默认挂在 body 弹层容器；Dialog / Drawer 内是否被遮挡尚未核验，需检查实际层级，不能因默认挂载已知就宣称嵌套场景已验证。
- 放进 [Form](Form.md) 使用 `updateTrigger="onColorChange"`；回填 / 重置的精确表现仍需目标工程验证。

## 7. 完整代码示例

```tsx
import { useRef, useState } from 'react';
import ColorPicker from '@nce/eview-react/ColorPicker';
import Button from '@nce/eview-react/Button';

interface Props {
  canEdit: boolean;
  onSave: (color: string) => Promise<void>;
}

export default function CategoryColorEditor({ canEdit, onSave }: Props) {
  const [color, setColor] = useState('#0077ee');
  const [savedColor, setSavedColor] = useState('#0077ee');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const busy = useRef(false);
  const dirty = color !== savedColor;

  const handleSave = async () => {
    if (!canEdit || busy.current || !dirty) return;
    const submitted = color;
    busy.current = true;
    setSaving(true);
    setMessage('');
    try {
      await onSave(submitted);
      setSavedColor(submitted);
      setMessage('颜色已保存');
    } catch {
      setMessage('保存失败，请重试');
    } finally {
      busy.current = false;
      setSaving(false);
    }
  };

  return (
    <section aria-label="分类颜色">
      <ColorPicker
        value={color}
        disabled={!canEdit || saving}
        onColorChange={setColor}
      />
      <span style={{ backgroundColor: color, display: 'inline-block', width: 24, height: 24 }} aria-hidden="true" />
      <output>当前颜色：{color}</output>
      <Button text="重置草稿" disabled={!canEdit || saving || !dirty} onClick={() => { setColor(savedColor); setMessage(''); }} />
      <Button status="primary" text={saving ? '保存中...' : '保存'} disabled={!canEdit || saving || !dirty} onClick={handleSave} />
      <p role="status">{message}</p>
    </section>
  );
}
```

## 8. 反面示例

```tsx
// ❌ antd 的值对象和回调名：这里回传的是字符串
<ColorPicker onChange={(value) => setColor(value.toHexString())} />

// ❌ 收起回调第一参是事件，第二参才是颜色
<ColorPicker onCollapse={(color) => setColor(color)} />

// ❌ 未记录的预设色、受控展开和默认值 API
<ColorPicker presets={presets} open={open} onOpenChange={setOpen} defaultValue="#0077ee" />
```

## 9. API 速查

| API | 类型 / 默认值 | 说明 |
|-----|--------------|------|
| `value` | `string` | 当前颜色 |
| `onColorChange` | `(color: string) => void` | 仅色板确认提交时触发；输出 # 加 6 位 hex，非拖动实时事件 |
| `disabled` | `boolean`，默认 `false` | 禁用选色 |
| `onClick` | `(event: ColorPickerEvent, color: string) => void` | 点击通知 |
| `onCollapse` | `(event: ColorPickerEvent, color: string) => void` | 弹层收起通知，不代替保存 |
| `zIndex` | `number`，默认 `9999` | 选色弹层层级 |
| `style` / `popupStyle` | `React.CSSProperties` | 外层 / 弹出层样式 |
| `className` | `string` | 外层类名 |

没有已记录的 ref 方法、children 自定义触发器或颜色转换方法。
