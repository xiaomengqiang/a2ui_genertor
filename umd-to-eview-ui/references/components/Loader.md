# Loader 加载

> 分类：数据展示

Loader 是指示灯，显示项或状态为 in progress。

**重要行为说明：**
- `type="global"`：全屏遮罩加载，父容器需有明确 id 用于遮罩定位
- `type="local"`：容器内加载，**父容器必须设置 `position: "relative"`**，`style` 属性仅在此模式下生效
- `type="micro"`：行内小 spinner 加载，`style` 属性不生效
- `iconUrl` 为非必填属性；不传时使用默认旋转图标（aui3-1 场景使用 IconSvg loading 图标，其他场景使用 CSS 动画）

## antd 迁移注意事项

> 迁移分类：A｜本表由 build-migration-plan.cjs 解析生成迁移计划

| antd 写法 | eview 写法 | 迁移要点 |
|-----------|-----------|----------|
| `Spin` | `Loader` | `spinning`→**`isOpen`**；`tip`→**`desc`**；`type="global"/"local"/"micro"`（全屏遮罩/容器内/行内——antd 无此分层：全屏用 global，包内容器用 local **需父容器 position:relative**，小 spinner 用 micro）；`fullscreen`→type="global" |

## API


### 属性

| 属性名称 | 描述 | 输入 | 默认 |
|:-----|:-----|:-----|:-----|
| id | 设置元素的id，不传则自动生成 (evu_Loader_N) | string | 自动生成 |
| isOpen | 定制加载是否显示。E.g: `isOpen={true}` | boolean | false |
| type | 元素的类型：<br>&nbsp;"global" - 全屏遮罩加载<br>&nbsp;"local" - 容器内加载（需父容器 position:relative）<br>&nbsp;"micro" - 行内小 spinner | enum:<br>&nbsp;"global"<br>&nbsp;"local"<br>&nbsp;"micro"<br> | "global" |
| iconUrl | 自定义图标路径，将作为加载/刷新图标显示。不传则使用默认旋转图标 | string | |
| desc | 设置加载过程说明文字 | string | |
| textClassName | 设置描述文字的 CSS class，用于自定义描述文字样式 | string | |
| style | 设置组件的样式。**注意：此属性仅在 `type="local"` 时生效，global 和 micro 模式下不应用此属性** | object | |
| version | 传入该值可定制当前组件匹配的ucd规范，例如 `version='aui3'` | string | |
| theme | 传入该值可定制当前组件匹配的主题模式样式，例如 `theme='evening'` | string | |

## 使用示例

### 全局加载示例











```jsx
import Loader from 'eview-ui/Loader';

// type="global"：全屏遮罩加载，isOpen 两态控制显隐
<Loader type="global" isOpen={true} desc="Please wait..." />;

// textClassName 自定义描述文字样式
<Loader type="global" isOpen={true} desc="Loading..." textClassName="loading_text_custom_cls" />;
```

### 本地加载示例











```jsx
import Loader from 'eview-ui/Loader';

// type="local"：父容器必须设置 position: "relative"，style 仅在此模式下生效
<div style={{ position: "relative", minHeight: "100px" }}>
  {/* 业务内容放这里 */}
  <Loader type="local" desc="Loading..." isOpen={true} style={{ zIndex: 9998 }} />
</div>;
```

### 微加载示例











```jsx
import Loader from 'eview-ui/Loader';

// type="micro"：行内小 spinner，style 不生效
<Loader type="micro" desc="Micro Progress description.." isOpen={true} />;

// iconUrl 自定义图标（不传用默认旋转图标），textClassName 自定义文字样式
<Loader
  type="micro"
  desc="Micro Progress description.."
  isOpen={true}
  iconUrl="" // 自定义图标 url，空则用默认图标
  textClassName="loading_text_custom_cls"
/>;
```

