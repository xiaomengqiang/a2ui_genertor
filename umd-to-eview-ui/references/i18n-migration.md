# 国际化迁移（antd → eview-ui 路线）

> antd 和 eview-ui 的国际化体系不同。
> antd 用自带的 `ConfigProvider locale` 对象管组件内置文案，业务文案靠项目自选库或硬编码；
> eview-ui 的组件内置文案走 `<ConfigProvider locale="zh">`（scaffold 的 ThemeProvider 已预制，步骤 3 接线），
> 业务文案走 scaffold 预置的 `react-intl` `IntlProvider`（main.jsx，仅装业务语言包）。
> 迁移时最大的坑是：源项目如果没用过 react-intl，等于要新引入一整个国际化库。
>
> **执行位置**：scenario A/B 的静态接线（IntlProvider + 业务包合并）由本 skill（umd-to-eview-ui）步骤 3 完成（读 `.umd-conversion.json` 的 `i18nScenario` 字段判定）；本文档作为步骤 3 子 agent 的参考（§4 main.jsx 结构、§5 dayjs locale），scenario C 的 keep i18next vs 迁 react-intl 决策也参考 §3 场景 C。scenario A/B 接线完成后，步骤 8 只做运行时验证。

## 两层国际化模型对比

| 层 | antd | eview-ui |
|----|------|----------|
| **组件内置文案**（DatePicker 月份、分页条、Table 筛选、空态描述等） | `ConfigProvider locale={zhCN}`，locale 对象从 `antd/locale/zh_CN` 导入 | `ConfigProvider locale="zh" version="aui3-1"`（scaffold 的 ThemeProvider 预制，步骤 3 接线）——与 IntlProvider 无关 |
| **校验消息**（必填提示、格式错误提示等） | 源项目无 Form，校验由各输入组件自行处理 | 控件自带的 `validator` 返回 `{result, message}` 或由 `required` 自动产生 |
| **业务文案**（页面文字、按钮文字、标签等） | antd 不管；项目硬编码或自选 i18n 库 | `react-intl`；业务文案用 `<FormattedMessage id="xxx" />` 或 `useIntl().formatMessage()`（与组件文案分属两套体系） |
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

### eview-ui 转换后

```jsx
// main.jsx（scaffold 预置，IntlProvider 只装业务语言包；scenario A 时 messages={{}}）
import { IntlProvider } from 'react-intl';

const locale = 'zh';

<IntlProvider locale={locale} messages={messages[locale]}>
    <App />
</IntlProvider>
```

```jsx
// src/theme/useTheme.jsx（scaffold 预制，步骤 3 接线后——组件内置文案走 ConfigProvider，与 IntlProvider 无关）
import ConfigProvider from '@cloudsop/eview-ui/ConfigProvider';

<ConfigProvider locale="zh" version="aui3-1" theme={isDark ? 'evening' : 'lightday'}>
    <AppShell />
</ConfigProvider>
```

组件内置文案（DatePicker 月份/分页条/空态等）由 `ConfigProvider locale="zh"` 提供；业务文案由 `IntlProvider` 的业务语言包提供——两套体系各管各的。

### 迁移要点

1. **删掉 antd locale 导入**：`import zhCN from 'antd/locale/zh_CN'` 和自写的 `antd-zh-cn.js` 全部删除（步骤 3 执行）
2. **删掉 antd `ConfigProvider`**：步骤 3 搬 app.jsx 时删除（含 `theme.darkAlgorithm`）；eview-ui 的 `ConfigProvider` 已由 scaffold 的 ThemeProvider 预制（locale/version/theme 三项，步骤 3 接线到 AppProvider，不要再另写）
3. **locale 值从对象改为字符串**：antd 的 `locale={zhCN}`（对象）→ react-intl 的 `locale="zh"`（字符串）
4. **`IntlProvider` 保持 main.jsx 最外层**：scaffold 已预置，直接包 `<App/>`，不要搬进 app.jsx

## 2. 校验消息

源项目无 Form/Form.Item，校验由各输入组件自行处理（如手动判空 + `message.warning()`）。迁移后 eview-ui 控件自带的 `validator` 返回 `{result, message}`，或 `required` 自动产生提示——无需迁移 antd 的 `Form.defaultValidateMessages`。

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

**迁移方式：业务文案不变，合并业务语言包即可（eview-ui 路线不合并组件内置文案——组件文案走 ConfigProvider）。**

```jsx
import { IntlProvider } from 'react-intl';
import businessLocales from './locales';           // 业务自己的语言包

// 只装业务文案（组件内置文案由 app.jsx 的 ConfigProvider locale 管，不进这里）
const messages = {
    zh: { ...businessLocales.zh },
    en: { ...businessLocales.en },
};

const [locale, setLocale] = useState('zh');

<IntlProvider locale={locale} messages={messages[locale]}>
    <App />
</IntlProvider>
```

业务代码里的 `<FormattedMessage id="button.submit" />` 和 `useIntl().formatMessage()` 完全不用改——react-intl 是同一套库。

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

### eview-ui 路线写法

```jsx
const [locale, setLocale] = useState('zh');
const switchToEnglish = () => setLocale('en');

<IntlProvider locale={locale} messages={messages[locale]}>
    <App />
</IntlProvider>
// 组件内置文案如需切换语言，同步改 app.jsx ConfigProvider 的 locale prop（本路线默认固定 "zh"）
```

注意：切换语言时 `locale` 和 `messages` 要**同时**更新。如果用了业务包（场景 B），切换时取 `messages[locale]` 即可。

### 4.1 IntlProvider 放在 main.jsx，不要跟着 AppShell 搬进 src/

> **这是迁移中最常踩的坑。** 源项目的 IntlProvider 通常在 `app.jsx` 的 AppShell 里（因为 antd 项目把 `ConfigProvider locale` 和 `IntlProvider` 放一起，跟着 `lang` state 走）。迁移时容易原样把 IntlProvider 留在 AppShell——但业务 `<FormattedMessage>` 在弹层（Dialog 等 portal）里也要取业务文案，**IntlProvider 必须在 `main.jsx` 最外层直接包 `<App/>`**（scaffold 已预置），否则弹层内容取不到业务文案，报 `MISSING_TRANSLATION`。

**正确结构（IntlProvider 在 main.jsx 最外层直接包 App）：**

```jsx
// main.jsx
import { IntlProvider } from 'react-intl';
import { AppProvider, useApp } from './src/context.jsx';
import { messages as businessMessages } from './src/i18n.js';
import App from './app.jsx';

// 只装业务文案（组件内置文案走 app.jsx 的 ConfigProvider locale，不进这里）
const messages = {
    zh: { ...businessMessages.zh },
    en: { ...businessMessages.en },
};

// lang state 在 context 里 → 用 Root 包一层读 lang，再提供 IntlProvider
function Root() {
    const { lang } = useApp();
    return (
        <IntlProvider locale={lang} messages={messages[lang]}>
            <App />
        </IntlProvider>
    );
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AppProvider>
            <Root />
        </AppProvider>
    </StrictMode>
);
```

```jsx
// app.jsx — 只剩布局，不再放 IntlProvider / AppProvider / messages / dayjs
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
// ❌ main.jsx 没有 IntlProvider（被搬到 app.jsx 了）
<App />

// ❌ app.jsx 的 AppShell 里放 IntlProvider —— 弹层落在了 IntlProvider 之外
function AppShell() {
    const { lang } = useApp();
    return (
        <IntlProvider locale={lang} messages={messages[lang]}>
            {/* Dialog 等弹层的内容取不到 messages 的业务 key */}
        </IntlProvider>
    );
}
```

### 4.2 locale 用 "zh"，不是 "zh-CN"

业务语言包的 key 通常是 `"zh"` / `"en"`（不是 `"zh-CN"`）。IntlProvider 的 `locale` 必须用 `"zh"`，否则：

- `messages[locale]` 取不到（`messages["zh-CN"]` 是 `undefined`）
- 报错信息里的 locale 与语言包的 key 对不上，排查困难

```jsx
// ✅ locale="zh"，匹配业务语言包的 key
<IntlProvider locale={lang} messages={messages[lang]}>  // lang === "zh"

// ❌ locale="zh-CN"，messages["zh-CN"] 是 undefined
<IntlProvider locale={isZh ? "zh-CN" : "en"} messages={messages[lang]}>
```

> antd 项目常用 `locale={isZh ? "zh-CN" : "en"}`（因为 antd 的 locale 包是 `zh_CN`）。迁移后改成 `"zh"`。HTML 的 `<html lang="zh-CN">` 不用改——那是给浏览器/无障碍用的，与 react-intl 的 locale 无关。

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

### eview-ui 路线迁移

迁移后 antd 的 locale 包删掉了，dayjs 的 locale 注册也跟着没了。如果项目用到 dayjs 且需要中文星期/月份，需要**单独注册**：

```jsx
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';

import { IntlProvider } from 'react-intl';
import { messages } from './src/i18n.js';           // 业务语言包

const [locale, setLocale] = useState('zh');

// 同步 dayjs locale 与 IntlProvider locale
useEffect(() => {
    dayjs.locale(locale === 'zh' ? 'zh-cn' : 'en');
}, [locale]);

<IntlProvider locale={locale} messages={messages[locale]}>
    <App />
</IntlProvider>
```

> 注意：eview-ui 的 DatePicker 值形态是自有结构（不走 dayjs 对象），dayjs locale 仅影响业务代码里 dayjs 的中文星期/月份格式化。如果业务代码不直接用 dayjs 做中文格式化，则不需要额外注册。

## 6. antd-zh-cn.js 的处置

源项目自写的 `antd-zh-cn.js`（295 行）做了三件事，迁移后全部不需要：

| 原职责 | 迁移后归属 | 操作 |
|--------|-----------|------|
| 注册 dayjs zh-cn locale | §5 单独处理 | 删文件，按 §5 单独注册 |
| 导出 antd ConfigProvider 用的 zhCN locale 对象 | eview-ui 组件文案走 ThemeProvider 里的 `ConfigProvider locale="zh"`（scaffold 预制） | 删文件，无需替代物 |
| Form.defaultValidateMessages | 无对应（源项目无 Form） | 删文件 |

**结论：`antd-zh-cn.js` 整个文件删除。** 它的职责由 ConfigProvider locale + 可选的 dayjs locale 注册替代。

## 7. 迁移检查清单

- [ ] `IntlProvider` 在 **main.jsx** 最外层直接包 `<App/>`（不是在 `app.jsx`/AppShell 里）——否则弹层 MISSING_TRANSLATION（见 §4.1）
- [ ] `locale` 用 `"zh"`（不是 `"zh-CN"`），匹配业务语言包的 key（见 §4.2）
- [ ] `messages` 传了业务语言包 `messages[locale]`（scenario A 为 `{}` 占位），不是 undefined
- [ ] 删掉了 `import zhCN from 'antd/locale/...'` 或自写的 locale 文件
- [ ] 删掉了 antd 的 `ConfigProvider`（含 `theme.darkAlgorithm`）；业务代码无第二个 ConfigProvider（eview-ui 的已由 scaffold ThemeProvider 预制并接线）
- [ ] 业务文案如果是 react-intl，业务语言包已挂进 main.jsx 的 IntlProvider
- [ ] 如果项目用 dayjs 且需要中文星期/月份，已单独注册 dayjs locale
- [ ] `app.jsx`/AppShell 不再放 IntlProvider / AppProvider / messages / dayjs effect（都在 main.jsx 的 Root 里）
- [ ] DatePicker 的中文月份/星期显示正常（ConfigProvider locale="zh" 生效）
- [ ] 分页条的"条/页"显示正常
- [ ] Table 的"筛选""确定""暂无数据"显示正常
- [ ] 空态描述显示正常
