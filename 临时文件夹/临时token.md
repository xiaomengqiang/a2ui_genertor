# Harmony OS Library — Design Token 手册

> 来源文件：Harmony OS Library.xlsx
> 共 7 个 Sheet：颜色全量Token、颜色业务Token、文本全量Token、文本业务Token、圆角 Radius、间距 Space、边框宽度 Border Width、阴影 Shadow

---

## 一、颜色 Color — 全量 Token

### Brand（品牌色）

| Token | Light Mode | Dark Mode |
|---|---|---|
| brand | #0A59F7 | #317AF7 |
| brand-font | #0A59F7 | #5291FF |
| brand-05 | #0C0A59F7 | #0C317AF7 |
| brand-10 | #190A59F7 | #19317AF7 |
| brand-15 | #260A59F7 | #26317AF7 |
| brand-20 | #330A59F7 | #33317AF7 |
| brand-30 | #4D0A59F7 | #4D317AF7 |
| brand-40 | #660A59F7 | #66317AF7 |
| brand-50 | #7F0A59F7 | #7F317AF7 |
| brand-60 | #990A59F7 | #99317AF7 |
| brand-70 | #B20A59F7 | #B2317AF7 |
| brand-80 | #CC0A59F7 | #CC317AF7 |
| brand-90 | #E50A59F7 | #E5317AF7 |
| brand-100 | #FF0A59F7 | #FF317AF7 |

### Primary（主色）

| Token | Light Mode | Dark Mode | 备注 |
|---|---|---|---|
| primary | #000000 | #FFFFFF | 全局 |
| primary-05 | #0C000000 | #0CFFFFFF |
| primary-10 | #19000000 | #19FFFFFF |
| primary-15 | #26000000 | #26FFFFFF |
| primary-20 | #33000000 | #33FFFFFF |
| primary-30 | #4D000000 | #4DFFFFFF |
| primary-40 | #66000000 | #66FFFFFF |
| primary-50 | #7F000000 | #7FFFFFFF |
| primary-60 | #99000000 | #99FFFFFF |
| primary-70 | #B2000000 | #B2FFFFFF |
| primary-80 | #CC000000 | #CCFFFFFF |
| primary-90 | #E5000000 | #E5FFFFFF |
| primary-100 | #FF000000 | #FFFFFFFF | 全局 |

### On Primary（主色上的颜色）

| Token | Light Mode | Dark Mode | 备注 |
|---|---|---|---|
| on_primary | #FFFFFF | #000000 | 全局 |
| on_primary-05 | #0CFFFFFF | #0C000000 |
| on_primary-10 | #19FFFFFF | #19000000 |
| on_primary-15 | #26FFFFFF | #26000000 |
| on_primary-20 | #33FFFFFF | #33000000 |
| on_primary-30 | #4DFFFFFF | #4D000000 |
| on_primary-40 | #66FFFFFF | #66000000 |
| on_primary-50 | #7FFFFFFF | #7F000000 |
| on_primary-60 | #99FFFFFF | #99000000 |
| on_primary-70 | #B2FFFFFF | #B2000000 |
| on_primary-80 | #CCFFFFFF | #CC000000 |
| on_primary-90 | #E5FFFFFF | #E5000000 |
| on_primary-100 | #FFFFFFFF | #FF000000 | 全局 |

### Container（容器色）

| Token | Light Mode | Dark Mode | 备注 |
|---|---|---|---|
| container | #000000 | #FFFFFF | 全局 |
| container-05 | #0C000000 | #0CFFFFFF |
| container-10 | #19000000 | #19FFFFFF |
| container-15 | #26000000 | #26FFFFFF |
| container-20 | #33000000 | #33FFFFFF |
| container-30 | #4D000000 | #4DFFFFFF |
| container-40 | #66000000 | #66FFFFFF |
| container-50 | #7F000000 | #7FFFFFFF |
| container-60 | #99000000 | #99FFFFFF |
| container-70 | #B2000000 | #B2FFFFFF |
| container-80 | #CC000000 | #CCFFFFFF |
| container-90 | #E5000000 | #E5FFFFFF |
| container-100 | #FF000000 | #FFFFFFFF |

### Black & White（黑白）

| Token | Light Mode | Dark Mode |
|---|---|---|
| black | #000000 | #000000 |
| white | #FFFFFF | #FFFFFF |

### Gray Color（灰色）

| Token | Light Mode | Dark Mode |
|---|---|---|
| gray_01 | #F1F3F5 | #000000 |
| gray_02 | #E5E5EA | #202224 |
| gray_03 | #D1D1D6 | #2E3033 |
| gray_04 | #C7C7CC | #46484D |

---

## 二、颜色 Color — 业务 Token

### Font Color（文本色）

| Token | 使用场景 | Light 全量Token | Light 格式值 | Dark 全量Token | Dark 格式值 |
|---|---|---|---|---|---|
| font_primary | 一级文本色 | primary-90 | #E5000000 | primary-90 | #E5FFFFFF |
| font_secondary | 二级文本色 | primary-60 | #99000000 | primary-60 | #99FFFFFF |
| font_tertiary | 三级文本色 | primary-40 | #66000000 | primary-40 | #66FFFFFF |
| font_fourth | 四级文本色 | primary-20 | #33000000 | primary-20 | #33FFFFFF |
| font_emphasize | 文本强调色 | brand-100 | #FF0A59F7 | brand-font | #5291FF |
| font_on_primary | 一级文本反色 | on_primary-100 | #FFFFFFFF | on_primary-100 | #FF000000 |
| font_on_secondary | 二级文本反色 | on_primary-60 | #99FFFFFF | on_primary-60 | #99000000 |
| font_on_tertiary | 三级文本反色 | on_primary-40 | #66FFFFFF | on_primary-40 | #66000000 |
| font_on_fourth | 四级文本反色 | on_primary-20 | #33FFFFFF | on_primary-20 | #33000000 |

### Background Color（背景色）

| Token | 使用场景 | Light 全量Token | Light 格式值 | Dark 全量Token | Dark 格式值 |
|---|---|---|---|---|---|
| background_primary | 页面级实色背景 | white | #FFFFFF | black | #000000 |
| background_secondary | 页面级实色背景 | gray_01 | #F1F3F5 | gray_01 | #000000 |
| background_tertiary | 页面级实色背景 | gray_02 | #E5E5EA | gray_02 | #202224 |
| background_fourth | 页面级实色背景 | gray_03 | #D1D1D6 | gray_03 | #2E3033 |
| background_emphasize | 页面级实色背景 | brand-100 | #FF0A59F7 | brand-100 | #FF317AF7 |

### Comp Background Color（组件背景色）

| Token | 使用场景 | Light 全量Token | Light 格式值 | Dark 全量Token | Dark 格式值 |
|---|---|---|---|---|---|
| comp_background_primary | 组件通用背景色 100%透明度 | white | #FFFFFF | gray_02 | #202224 |
| comp_background_secondary | 组件通用背景色二级 | container-10 | #19000000 | container-10 | #19FFFFFF |
| comp_background_tertiary | 组件通用背景色三级 | container-05 | #0C000000 | container-10 | #19FFFFFF |
| comp_background_list_card | 系统通用列表/卡片色 | on_primary-100 | #FFFFFFFF | on_primary-10 | #FF000000 |
| comp_background_emphasize | 组件通用强调色 100%透明度 | brand-100 | #FF0A59F7 | brand-100 | #FF317AF7 |
| comp_emphasize_secondary | 组件通用强调色 20%透明度 | brand-20 | #330A59F7 | brand-20 | #33317AF7 |
| comp_emphasize_tertiary | 组件通用强调色 10% | brand-10 | #190A59F7 | brand-10 | #19317AF7 |
| comp_foreground_primary | 前景色 | black | #000000 | white | #FFFFFF |
| comp_background_gray | 灰色背景 | gray_01 | #F1F3F5 | gray_01 | #000000 |
| comp_common_contrary | 反色 | white | #FFFFFF | black | #000000 |
| comp_background_primary_contrary | 主背景反色 | white | #FFFFFF | — | #E5E5E5 |
| comp_background_primary_contrary_secondary | 主背景反色二级 | — | #FFFFFF | — | #666666 |
| fg_color_unchecked | CheckBox/Radio 初始未选色 | — | #33FFFFFF | — | #33000000 |
| comp_background_model_sheet | 底部面板色 | gray_01 | #F1F3F5 | — | #202224 |
| comp_background_gray_secondary | 非模态背景色 | — | #202224 | — | #202224 |

### Icon Color（图标色）

| Token | 使用场景 | Light 全量Token | Light 格式值 | Dark 全量Token | Dark 格式值 |
|---|---|---|---|---|---|
| icon_primary | 一级图标颜色 | primary-90 | #E5000000 | primary-90 | #E5FFFFFF |
| icon_secondary | 二级图标颜色 | primary-60 | #99000000 | primary-60 | #99FFFFFF |
| icon_tertiary | 三级图标颜色 | primary-40 | #66000000 | primary-40 | #66FFFFFF |
| icon_fourth | 四级图标颜色 | primary-20 | #33000000 | primary-20 | #33FFFFFF |
| icon_emphasize | 图标强调色 | brand-100 | #FF0A59F7 | brand-font | #5291FF |
| icon_sub_emphasize | 图标次要强调色 | brand-40 | #660A59F7 | brand-40 | #66317AF7 |
| icon_on_primary | 一级图标反色 | on_primary-100 | #FFFFFFFF | on_primary-100 | #FF000000 |
| icon_on_secondary | 二级图标反色 | on_primary-60 | #99FFFFFF | on_primary-60 | #99000000 |
| icon_on_tertiary | 三级图标反色 | on_primary-40 | #66FFFFFF | on_primary-40 | #66000000 |
| icon_on_fourth | 四级图标反色 | on_primary-20 | #33FFFFFF | on_primary-20 | #33000000 |

### Interactive Color（交互色）

| Token | 使用场景 | Light 全量Token | Light 格式值 | Dark 全量Token | Dark 格式值 |
|---|---|---|---|---|---|
| interactive_focus | 通用获焦态颜色 | brand-100 | #FF0A59F7 | brand-100 | #FF317AF7 |
| interactive_hover | 通用悬停态颜色 | container-5 | #0C000000 | container-10 | #19FFFFFF |
| interactive_pressed | 通用按压态颜色 | container-10 | #19000000 | container-15 | #26FFFFFF |
| interctive_select | 通用选择态颜色 | brand-20 | #330A59F7 | brand-20 | #33317AF7 |
| interactive_click | 通用点击态颜色 | container-10 | #19000000 | container-15 | #26FFFFFF |

### Border Color（边框色）

| Token | 使用场景 | Light 全量Token | Light 格式值 | Dark 全量Token | Dark 格式值 |
|---|---|---|---|---|---|
| comp_divider | 系统分割线/分隔符通用色 | container-20 | #33000000 | container-20 | #33FFFFFF |
| border | 边框色 | — | #26FFFFFF | — | — |
| color-border-input | 输入框边框色 | gray-20 | #C9C9C9 | gray-70 | #393939 |

### Functional Color（功能色）

| Token | 使用场景 | Light | Dark |
|---|---|---|---|
| warning | 警告色 | #E84026 | #D94838 |
| alert | 提示色 | #ED6F21 | #DB6B42 |
| confirm | 通讯色 | #64BB5C | #5BA854 |

### Multi-Color（系统多色）

| Token | 使用场景 | Light | Dark |
|---|---|---|---|
| multi_color_01 | 系统多色 01 | #564AF7 | #5F58C7 |
| multi_color_02 | 系统多色 02 | #46B1E3 | #4796C4 |
| multi_color_03 | 系统多色 03 | #61CFBE | #5AADA0 |
| multi_color_04 | 系统多色 04 | #64BB5C | #5BA854 |
| multi_color_05 | 系统多色 05 | #A5D61D | #86AD53 |
| multi_color_06 | 系统多色 06 | #AC49F5 | #8C55C2 |
| multi_color_07 | 系统多色 07 | #E64566 | #D64966 |
| multi_color_08 | 系统多色 08 | #E84026 | #D94838 |
| multi_color_09 | 系统多色 09 | #ED6F21 | #DB6B42 |
| multi_color_10 | 系统多色 10 | #F9A01E | #E08C3A |
| multi_color_11 | 系统多色 11 | #F7CE00 | #D1A738 |
| multi_color_aux_01 | 系统多色辅助 01 | #8981F7 | #5550A6 |
| multi_color_aux_02 | 系统多色辅助 02 | #86C5E3 | #467794 |
| multi_color_aux_03 | 系统多色辅助 03 | #92D6CC | #4C7A73 |
| multi_color_aux_04 | 系统多色辅助 04 | #92C48D | #5C8059 |
| multi_color_aux_05 | 系统多色辅助 05 | #BDDB69 | #6B8052 |
| multi_color_aux_06 | 系统多色辅助 06 | #C386F0 | #634794 |
| multi_color_aux_07 | 系统多色辅助 07 | #E67C92 | #A14A5C |
| multi_color_aux_08 | 系统多色辅助 08 | #E87361 | #9C554B |
| multi_color_aux_09 | 系统多色辅助 09 | #ED955F | #9E644F |
| multi_color_aux_10 | 系统多色辅助 10 | #F9BC64 | #9E7349 |
| multi_color_aux_11 | 系统多色辅助 11 | #F5DC62 | #997E39 |

---

## 三、文本 Typography — 全量 Token

### Font Size（字号）

| Token | px | rem |
|---|---|---|
| font_size_xs | 10px | — |
| font_size_sm | 12px | — |
| font_size_base | 14px | — |
| font_size_md | 16px | — |
| font_size_lg | 18px | — |
| font_size_xl | 20px | — |
| font_size_2xl | 24px | — |
| font_size_3xl | 30px | — |
| font_size_4xl | 38px | — |
| font_size_5xl | 48px | — |
| font_size_6xl | 56px | — |

### Font Weight（字重）

| Token | 值 | 命名 |
|---|---|---|
| font-weight-regular | 400 | regular |
| font-weight-medium | 500 | medium |
| font-weight-bold | 600 | bold |

### Line Height（行高）

| Token | 说明 |
|---|---|
| lineHeight-none | 行高倍数 1 |
| lineHeight-tight | 行高倍数 1.25 |
| lineHeight-snug | 行高倍数 1.375 |
| lineHeight-base | 行高倍数 1.5 |
| lineHeight-relaxed | 行高倍数 1.625 |
| lineHeight-loose | 行高倍数 2 |

> 全量 Token 总数：25

---

## 四、文本 Typography — 业务 Token

### Display（展示文本）

| Token | 字号全量Token | 字号格式值 | 字重全量Token | 字重格式值 |
|---|---|---|---|---|
| font-display-s-regular | font_size_4xl | 38px | font-weight-regular | 400 |
| font-display-s-medium | font_size_4xl | 38px | font-weight-medium | 500 |
| font-display-s-bold | font_size_4xl | 38px | font-weight-bold | 600 |
| font-display-m-regular | font_size_5xl | 48px | font-weight-regular | 400 |
| font-display-m-medium | font_size_5xl | 48px | font-weight-medium | 500 |
| font-display-m-bold | font_size_5xl | 48px | font-weight-bold | 600 |
| font-display-l-regular | font_size_6xl | 56px | font-weight-regular | 400 |
| font-display-l-medium | font_size_6xl | 56px | font-weight-medium | 500 |
| font-display-l-bold | font_size_6xl | 56px | font-weight-bold | 600 |

### Title（标题）

| Token | 字号全量Token | 字号格式值 | 字重全量Token | 字重格式值 |
|---|---|---|---|---|
| font-title-s-regular | font_size_xl | 20px | font-weight-regular | 400 |
| font-title-s-medium | font_size_xl | 20px | font-weight-medium | 500 |
| font-title-s-bold | font_size_xl | 20px | font-weight-bold | 600 |
| font-title-m-regular | font_size_2xl | 24px | font-weight-regular | 400 |
| font-title-m-medium | font_size_2xl | 24px | font-weight-medium | 500 |
| font-title-m-bold | font_size_2xl | 24px | font-weight-bold | 600 |
| font-title-l-regular | font_size_3xl | 30px | font-weight-regular | 400 |
| font-title-l-medium | font_size_3xl | 30px | font-weight-medium | 500 |
| font-title-l-bold | font_size_3xl | 30px | font-weight-bold | 600 |

### Subtitle（副标题）

| Token | 字号全量Token | 字号格式值 | 字重全量Token | 字重格式值 |
|---|---|---|---|---|
| font-subtitle-s-regular | font_size_base | 14px | font-weight-regular | 400 |
| font-subtitle-s-medium | font_size_base | 14px | font-weight-medium | 500 |
| font-subtitle-s-bold | font_size_base | 14px | font-weight-bold | 600 |
| font-subtitle-m-regular | font_size_md | 16px | font-weight-regular | 400 |
| font-subtitle-m-medium | font_size_md | 16px | font-weight-medium | 500 |
| font-subtitle-m-bold | font_size_md | 16px | font-weight-bold | 600 |
| font-subtitle-l-regular | font_size_lg | 18px | font-weight-regular | 400 |
| font-subtitle-l-medium | font_size_lg | 18px | font-weight-medium | 500 |
| font-subtitle-l-bold | font_size_lg | 18px | font-weight-bold | 600 |

### Body（正文）

| Token | 字号全量Token | 字号格式值 | 字重全量Token | 字重格式值 |
|---|---|---|---|---|
| font-body-s-regular | font_size_sm | 12px | font-weight-regular | 400 |
| font-body-s-medium | font_size_sm | 12px | font-weight-medium | 500 |
| font-body-s-bold | font_size_sm | 12px | font-weight-bold | 600 |
| font-body-m-regular | font_size_base | 14px | font-weight-regular | 400 |
| font-body-m-medium | font_size_base | 14px | font-weight-medium | 500 |
| font-body-m-bold | font_size_base | 14px | font-weight-bold | 600 |
| font-body-l-regular | font_size_md | 16px | font-weight-regular | 400 |
| font-body-l-medium | font_size_md | 16px | font-weight-medium | 500 |
| font-body-l-bold | font_size_md | 16px | font-weight-bold | 600 |

### Caption（注释）

| Token | 字号全量Token | 字号格式值 | 字重全量Token | 字重格式值 |
|---|---|---|---|---|
| font-caption-m-regular | font_size_xs | 10px | font-weight-regular | 400 |
| font-caption-m-medium | font_size_xs | 10px | font-weight-medium | 500 |
| font-caption-m-bold | font_size_xs | 10px | font-weight-bold | 600 |
| font-caption-l-regular | font_size_sm | 12px | font-weight-regular | 400 |
| font-caption-l-medium | font_size_sm | 12px | font-weight-medium | 500 |
| font-caption-l-bold | font_size_sm | 12px | font-weight-bold | 600 |

> 业务 Token 总数：36

---

## 五、圆角 Radius

| Token | 说明 | px | rem |
|---|---|---|---|
| corner_radius_none | 无圆角 | 0px | / |
| corner_radius_level1 | 通用圆角 | 2px | / |
| corner_radius_level2 | 通用圆角 | 4px | 0.5rem |
| corner_radius_level3 | 通用圆角 | 6px | 1rem |
| corner_radius_level4 | 通用圆角 | 8px | 1.5rem |
| corner_radius_level5 | 通用圆角 | 10px | 2rem |
| corner_radius_level6 | 通用圆角 | 12px | 3rem |
| corner_radius_level7 | 通用圆角 | 14px | / |
| corner_radius_level8 | 通用圆角 | 16px | / |
| corner_radius_level9 | 通用圆角 | 18px | — |
| corner_radius_level10 | 通用圆角 | 20px | — |
| corner_radius_level11 | 通用圆角 | 22px | — |
| corner_radius_level12 | 通用圆角 | 24px | / |
| corner_radius_level16 | 通用圆角 | 32px | / |

> 总数：14

---

## 六、间距 Space

| Token | 说明 | px | rem |
|---|---|---|---|
| padding_level0 | 内边距/间距 | 0px | / |
| padding_level1 | 间距 1 | 2px | / |
| padding_level2 | 间距 2 | 4px | 0.5rem |
| padding_level3 | 间距 3 | 6px | 1rem |
| padding_level4 | 间距 4 | 8px | 1.5rem |
| padding_level5 | 间距 5 | 10px | 2rem |
| padding_level6 | 间距 6 | 12px | 3rem |
| padding_level7 | 间距 7 | 14px | / |
| padding_level8 | 间距 8 | 16px | / |
| padding_level9 | 间距 9 | 18px | — |
| padding_level10 | 间距 10 | 20px | — |
| padding_level11 | 间距 11 | 22px | — |
| padding_level12 | 间距 12 | 24px | / |

> 总数：13

---

## 七、边框宽度 Border Width

| Token | 说明 | 分类 | px |
|---|---|---|---|
| border_none | 无边框 | 无 | 0px |
| border_base | 基础边框 | 小号 | 1px |
| border_medium | 中等边框 | 大号 | 2px |
| outline_none | 无轮廓 | 无 | 0px |
| outline_base | 基础轮廓 | 无 | 1px |
| outline_medium | 中等轮廓 | 无 | 2px |

> 总数：6

---

## 八、阴影 Shadow

| Token | 说明 | 阴影值 |
|---|---|---|
| shadow_elevation_01 | 层级 01 | X: 0, Y: 0, Blur: 4px, Spread: 0, Color: #1A000000 |
| shadow_elevation_02 | 层级 02 | X: 0, Y: 2px, Blur: 12px, Spread: 0, Color: #0F000000 |
| shadow_elevation_03 | 层级 03 | X: 0, Y: 4px, Blur: 8px, Spread: 0, Color: #1A000000 |
| shadow_elevation_04 | 层级 04 | X: 0, Y: 4px, Blur: 24px, Spread: 0, Color: #0F000000 |
| shadow_elevation_05 | 层级 05 | X: 0, Y: 6px, Blur: 24px, Spread: 0, Color: #1F000000 |
| shadow_elevation_06 | 层级 06 | X: 0, Y: 8px, Blur: 48px, Spread: 0, Color: #14000000 |
| shadow_elevation_07 | 层级 07 | X: 0, Y: 4px, Blur: 16px, Spread: 0, Color: #33000000 |
| shadow_side_left | 左侧阴影 | X: -2px, Y: 0, Blur: 12px, Spread: 0, Color: #14000000 |
| shadow_light_glow | 发光阴影 | X: 0, Y: 4px, Blur: 32px, Spread: 0, Color: #CCF1F3F5 |

> 总数：9
------------------- 上面是一个系统的token，我现在想知道，如果我只给这个token给你，你能正常的用好他吗？作为一个完整的设计系统，这个token有没有缺少哪些部分？