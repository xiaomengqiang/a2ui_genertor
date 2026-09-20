# 国际化迁移（antd → eview-react）

> antd 和 eview-react 的国际化体系完全不同。
> antd 用自带的 `ConfigProvider locale` 对象管组件内置文案，业务文案靠项目自选库或硬编码；
> eview-react 统一用 `react-intl` 的 `IntlProvider` 管组件内置文案，业务文案也走同一套 react-intl。
> 迁移时最大的坑是：源项目如果没用过 react-intl，等于要新引入一整个国际化库。

## 两层国际化模型对比

| 层 | antd | eview-react |
|----|------|-------------|
| **组件内置文案**（DatePicker 月份、Pagination 翻页、Table 筛选、Empty 描述等） | `ConfigProvider locale={zhCN}`，locale 对象从 `antd/locale/zh_CN` 导入 | `IntlProvider locale messages={componentsLocales[locale]}`，locale 包从 `@nce/eview-react/locales` 导入 |
| **Form 校验消息**（必填提示、格式错误提示等） | locale 对象里的 `Form.defaultValidateMessages`（如 `required: "请输入${label}"`） | Form rules 无 `message` 字段；校验提示由控件自带的 `validator` 返回 `{result, message}` 或由 `required` 自动产生 |
| **业务文案**（页面文字、按钮文字、标签等） | antd 不管；项目硬编码或自选 i18n 库 | 同一套 `react-intl`；业务文案可用 `<FormattedMessage id="xxx" />` 或 `useIntl().formatMessage()` |
| **日期库 locale** | antd locale 包同时注册 dayjs locale | 单独处理（见下方 §5） |

## 1. 组件内置文案迁移

### antd 原始写法

```jsx
import zhCN from 'antd/locale/zh_CN';           // 或自写的 antd-zh-cn.js
import enUS from 'antd/locale/en_US';

const [locale, setLocale] = useState(zhCN);

<ConfigProvider locale={locale}>
    <DatePicker />        {/* 月份/星期自动跟随 locale */}
    <Pagination />        {/* "条/页""跳至"自动跟随 */}
    <Table />             {/* "筛选""暂无数据"自动跟随 */}
    <Empty />             {/* "暂无数据"自动跟随 */}
</ConfigProvider>
```

antd 的 locale 对象是一个大 JSON，按组件分组：

```js
{
    locale: 'zh-cn',
    Pagination: { items_per_page: '条/页', ... },
    DatePicker: { lang: { placeholder: '请选择日期', months: '一月_二月_...', ... } },
    Table: { filterConfirm: '确定', filterReset: '重置', emptyText: '暂无数据', ... },
    Modal: { okText: '确定', cancelText: '取消', ... },
    Form: { defaultValidateMessages: { required: '请输入${label}', ... } },
    // ...
}
```

### eview-react 转换后

```jsx
import { IntlProvider } from 'react-intl';
import componentsLocales from '@nce/eview-react/locales';

const [locale, setLocale] = useState('zh');     // 'zh' 或 'en'

<IntlProvider locale={locale} messages={componentsLocales[locale]}>
    <DatePicker />        {/* 月份/星期跟随 locale */}
    <Paging />            {/* "条/页""跳至"跟随 locale */}
    <Table />             {/* 筛选/空态文案跟随 locale */}
    <Empty />             {/* 空态文案跟随 locale */}
</IntlProvider>
```

`componentsLocales` 是 eview-react 内置的语言包，结构是 `{ zh: {...}, en: {...} }`，覆盖所有组件的内置文案。

### 迁移要点

1. **删掉 antd locale 导入**：`import zhCN from 'antd/locale/zh_CN'` 和自写的 `antd-zh-cn.js` 全部删除
2. **删掉 `ConfigProvider locale` prop**：eview-react 的 `ConfigProvider` 不接管 locale，交给 `IntlProvider`
3. **locale 值从对象改为字符串**：antd 的 `locale={zhCN}`（对象）→ eview-react 的 `locale="zh"`（字符串）
4. **`IntlProvider` 必须在最外层**：包在 `ConfigProvider` 外面或里面都可以，但必须在所有 eview-react 组件的外层

## 2. Form 校验消息迁移

### antd 原始写法

antd 的校验消息有两层：

```js
// 第一层：locale 里的 defaultValidateMessages（全局默认）
Form.defaultValidateMessages = {
    required: '请输入${label}',
    string: { max: '${label}最多${max}个字符' },
    number: { range: '${label}须在${min}-${max}之间' },
};

// 第二层：Form.Item rules 里的 message（单条覆盖）
<Form.Item
    name="deviceName"
    rules={[
        { required: true, message: '请输入设备名称' },
        { max: 32, message: '不超过 32 个字符' },
    ]}
>
    <Input />
</Form.Item>
```

### eview-react 转换后

eview-react **没有** `defaultValidateMessages`，Form rules 也**没有** `message` 字段。校验提示来源：

```jsx
// 来源 1：required 自动产生提示（无需 message）
<Form.Item name="deviceName" rules={[{ required: true }]}>
    <TextField label="设备名称" placeholder="请输入" maxLength={32} />
</Form.Item>
{/* 必填校验失败时自动显示红色提示，文案由组件内置（跟随 IntlProvider locale） */}

// 来源 2：控件自带的 validator 返回 { result, message }
<TextField
    label="端口"
    placeholder="1-65535"
    validator={TextField.defaultValidator.range(1, 65535)}
    hintType="tip"
/>
{/* validator 校验失败时显示 message */}

// 来源 3：Form rules 的 range 等内置规则（自动提示，无需 message）
<Form.Item name="port" rules={[{ required: true }, { range: true, args: [1, 65535] }]}>
    <Spinner min={1} max={65535} />
</Form.Item>
```

### 迁移要点

| antd | eview-react | 说明 |
|------|-------------|------|
| `rules=[{ required: true, message: '请输入设备名称' }]` | `rules=[{ required: true }]` | 删 message，提示由组件内置 |
| `rules=[{ max: 32, message: '不超过 32 个字符' }]` | 控件 `maxLength={32}` | 长度限制用控件的 maxLength |
| `rules=[{ pattern: /regex/, message: '格式错误' }]` | 控件 `validator={(v) => ({result, message})}` | pattern 校验迁移到 validator |
| `rules=[{ type: 'email', message: '邮箱格式错误' }]` | `rules=[{ email: true }]` 或控件 `validator={TextField.defaultValidator.email()}` | 两种方式都行 |
| locale 里的 `Form.defaultValidateMessages` | 无对应 | eview-react 没有"全局默认校验消息模板"，每个控件的提示文案由组件内置 |

## 3. 业务文案迁移

### 场景 A：源项目硬编码中文（最常见）

```jsx
// antd 源项目：业务文字直接写中文
<Button type="primary">提交</Button>
<TextField label="设备名称" />
<span>设备接入配置向导</span>
```

**迁移方式：不变。** 如果目标项目也只做中文，业务文案继续硬编码即可：

```jsx
<Button status="primary" text="提交" />
<TextField label="设备名称" />
<span>设备接入配置向导</span>
```

`IntlProvider` 管的是**组件内置文案**（DatePicker 月份、Pagination 翻页等），业务文案硬编码不受影响。

### 场景 B：源项目已用 react-intl

```jsx
// antd 源项目：业务文案走 react-intl
import { FormattedMessage } from 'react-intl';

<Button type="primary">
    <FormattedMessage id="button.submit" />
</Button>
<FormattedMessage id="page.title" />
```

**迁移方式：业务文案不变，合并 locale 包即可。**

```jsx
import { IntlProvider } from 'react-intl';
import componentsLocales from '@nce/eview-react/locales';
import businessLocales from './locales';           // 业务自己的语言包

// 合并组件内置文案 + 业务文案
const messages = {
    zh: { ...componentsLocales.zh, ...businessLocales.zh },
    en: { ...componentsLocales.en, ...businessLocales.en },
};

const [locale, setLocale] = useState('zh');

<IntlProvider locale={locale} messages={messages[locale]}>
    <App />
</IntlProvider>
```

业务代码里的 `<FormattedMessage id="button.submit" />` 和 `useIntl().formatMessage()` 完全不用改——react-intl 是同一套库，eview-react 也用它。

### 场景 C：源项目用 i18next

```jsx
// antd 源项目：业务文案走 i18next
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
<Button type="primary">{t('button.submit')}</Button>
```

**迁移方式：需要选择——保留 i18next 还是迁移到 react-intl。**

| 选项 | 做法 | 优缺点 |
|------|------|--------|
| 保留 i18next | 同时挂 `IntlProvider`（管组件文案）和 `I18nextProvider`（管业务文案） | 两套 i18n 库并存，包体积大，但业务代码不用改 |
| 迁移到 react-intl | 把 `t('key')` 全部替换为 `useIntl().formatMessage({ id: 'key' })` | 只保留一套库，但业务代码要全改 |

建议：如果业务文案量不大，迁移到 react-intl 更干净；如果量大且稳定，保留 i18next 更省事。

## 4. 动态切换语言

### antd 写法

```jsx
const [antLocale, setAntLocale] = useState(zhCN);
const switchToEnglish = () => setAntLocale(enUS);

<ConfigProvider locale={antLocale}>
    <App />
</ConfigProvider>
```

### eview-react 写法

```jsx
const [locale, setLocale] = useState('zh');
const switchToEnglish = () => setLocale('en');

<IntlProvider locale={locale} messages={messages[locale]}>
    <App />
</IntlProvider>
```

注意：切换语言时 `locale` 和 `messages` 要**同时**更新。如果用了合并包（场景 B），切换时取 `messages[locale]` 即可。

### 4.1 IntlProvider 放在 main.jsx，不要跟着 AppShell 搬进 src/

> **这是迁移中最常踩的坑。** 源项目的 IntlProvider 通常在 `app.jsx` 的 AppShell 里（因为 antd 项目把 `ConfigProvider locale` 和 `IntlProvider` 放一起，跟着 `lang` state 走）。迁移时容易原样把 IntlProvider 留在 AppShell——但 eview-react 的 `ConfigProvider` 在 `main.jsx`，弹层（Dialog 等 portal）由 ConfigProvider 统一管理，**IntlProvider 必须是 ConfigProvider 的直接子级**，否则弹层内容会落到 IntlProvider 之外，业务 `<FormattedMessage>` 取不到业务文案，报 `MISSING_TRANSLATION`。

**正确结构（IntlProvider 在 main.jsx，直接包在 ConfigProvider 内）：**

```jsx
// main.jsx
import { IntlProvider } from 'react-intl';
import componentsLocales from '@nce/eview-react/locales';
import ConfigProvider from '@nce/eview-react/ConfigProvider';
import { AppProvider, useApp } from './src/context.jsx';
import { messages as businessMessages } from './src/i18n.js';
import App from './app.jsx';

const mergedMessages = {
    zh: { ...componentsLocales.zh, ...businessMessages.zh },
    en: { ...componentsLocales.en, ...businessMessages.en },
};

// lang state 在 context 里 → 用 Root 包一层读 lang，再提供 IntlProvider
function Root() {
    const { lang } = useApp();
    return (
        <IntlProvider locale={lang} messages={mergedMessages[lang]}>
            <App />
        </IntlProvider>
    );
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ConfigProvider>
            <AppProvider>
                <Root />
            </AppProvider>
        </ConfigProvider>
    </StrictMode>
);
```

```jsx
// app.jsx — 只剩布局，不再放 IntlProvider / AppProvider / mergedMessages / dayjs
import { ToastProvider } from './src/components/Toast.jsx';
import HeaderBar from './src/views/header-bar.jsx';
import SideMenu from './src/views/side-menu.jsx';
import ConsolePage from './src/views/console-page.jsx';

export default function App() {
    return (
        <ToastProvider>
            <div className="app-shell">
                <HeaderBar />
                <SideMenu />
                <ConsolePage />
            </div>
        </ToastProvider>
    );
}
```

**错误结构（IntlProvider 在 app.jsx/AppShell，报 MISSING_TRANSLATION）：**

```jsx
// ❌ main.jsx 没有 IntlProvider
<ConfigProvider>
    <App />
</ConfigProvider>

// ❌ app.jsx 的 AppShell 里放 IntlProvider —— ConfigProvider 的弹层落在外面
function AppShell() {
    const { lang } = useApp();
    return (
        <IntlProvider locale={lang} messages={mergedMessages[lang]}>
            {/* Dialog 等弹层的内容取不到 mergedMessages 的业务 key */}
        </IntlProvider>
    );
}
```

### 4.2 locale 用 "zh"，不是 "zh-CN"

`componentsLocales` 的 key 是 `"zh"` / `"en"`（不是 `"zh-CN"`）。IntlProvider 的 `locale` 必须用 `"zh"`，否则：

- `componentsLocales[locale]` 取不到（`componentsLocales["zh-CN"]` 是 `undefined`）
- 报错信息里的 locale 与 `componentsLocales` 的 key 对不上，排查困难

```jsx
// ✅ locale="zh"，匹配 componentsLocales 的 key
<IntlProvider locale={lang} messages={mergedMessages[lang]}>  // lang === "zh"

// ❌ locale="zh-CN"，componentsLocales["zh-CN"] 是 undefined
<IntlProvider locale={isZh ? "zh-CN" : "en"} messages={mergedMessages[lang]}>
```

> antd 项目常用 `locale={isZh ? "zh-CN" : "en"}`（因为 antd 的 locale 包是 `zh_CN`）。迁移到 eview-react 后改成 `"zh"`。HTML 的 `<html lang="zh-CN">` 不用改——那是给浏览器/无障碍用的，与 react-intl 的 locale 无关。

## 5. 日期库 locale

### antd 写法

antd v5 的 locale 包（如 `antd/locale/zh_CN`）会自动注册 dayjs 的 zh-cn locale：

```js
// antd/locale/zh_CN 内部会执行：
dayjs.locale('zh-cn', { name: 'zh-cn', weekdays: '星期日_星期一_...'.split('_'), ... }, true);
```

源项目自写的 `antd-zh-cn.js` 里也做了同样的事：

```js
dayjs.locale('zh-cn', {
    name: 'zh-cn',
    weekdays: '星期日_星期一_星期二_...'.split('_'),
    months: '一月_二月_三月_...'.split('_'),
    // ...
}, true);
```

### eview-react 迁移

迁移后 antd 的 locale 包删掉了，dayjs 的 locale 注册也跟着没了。如果项目用到 dayjs 且需要中文星期/月份，需要**单独注册**：

```jsx
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';

import { IntlProvider } from 'react-intl';
import componentsLocales from '@nce/eview-react/locales';

const [locale, setLocale] = useState('zh');

// 同步 dayjs locale 与 IntlProvider locale
useEffect(() => {
    dayjs.locale(locale === 'zh' ? 'zh-cn' : 'en');
}, [locale]);

<IntlProvider locale={locale} messages={componentsLocales[locale]}>
    <App />
</IntlProvider>
```

> 注意：eview-react 的 DatePicker 内部是否依赖 dayjs、locale 怎么接，需要在实际工程中验证。如果 DatePicker 的中文月份/星期在 `IntlProvider` 配置后已经正常显示，则不需要额外注册 dayjs locale。

## 6. antd-zh-cn.js 的处置

源项目自写的 `antd-zh-cn.js`（295 行）做了三件事，迁移后全部不需要：

| 原职责 | 迁移后归属 | 操作 |
|--------|-----------|------|
| 注册 dayjs zh-cn locale | §5 单独处理 | 删文件，按 §5 单独注册 |
| 导出 antd ConfigProvider 用的 zhCN locale 对象 | `@nce/eview-react/locales` 的 `componentsLocales.zh` | 删文件，用 `componentsLocales` |
| Form.defaultValidateMessages | 无对应（见 §2） | 删文件，Form rules 不带 message |

**结论：`antd-zh-cn.js` 整个文件删除。** 它的职责被 `componentsLocales` + 可选的 dayjs locale 注册替代。

## 7. 迁移检查清单

- [ ] `IntlProvider` 在 **main.jsx**，是 `ConfigProvider` 的直接子级（不是在 `app.jsx`/AppShell 里）——否则弹层 MISSING_TRANSLATION（见 §4.1）
- [ ] `locale` 用 `"zh"`（不是 `"zh-CN"`），匹配 `componentsLocales` 的 key（见 §4.2）
- [ ] `messages` 传了合并包 `mergedMessages[locale]`（`componentsLocales` + 业务语言包），不是空对象
- [ ] 已运行 `check-i18n-keys.cjs`：无 `t(x, x)` 调用落在 `value ≠ msgId` 的字段上（Table render 动态 key，见 [migration-workflow.md](migration-workflow.md) §3.5/§5.2）
- [ ] 删掉了 `import zhCN from 'antd/locale/...'` 或自写的 locale 文件
- [ ] 删掉了 `ConfigProvider` 的 `locale` prop（eview-react 的 ConfigProvider 不管 locale）
- [ ] Form rules 里删掉了所有 `message` 字段
- [ ] 业务文案如果是 react-intl，已合并 `componentsLocales` + 业务语言包
- [ ] 如果项目用 dayjs 且需要中文星期/月份，已单独注册 dayjs locale
- [ ] `app.jsx`/AppShell 不再放 IntlProvider / AppProvider / mergedMessages / dayjs effect（都在 main.jsx 的 Root 里）
- [ ] DatePicker 的月份/星期在配置 `IntlProvider` 后显示正常
- [ ] Pagination 的"条/页""跳至"显示正常
- [ ] Table 的"筛选""确定""暂无数据"显示正常
- [ ] Empty 的空态描述显示正常
