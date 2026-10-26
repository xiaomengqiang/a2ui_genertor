// element-zh.js — 中文 locale 补丁包(Vue + Element Plus)
//
// element-plus.full.min.js / dayjs.min.js UMD 均不含中文 locale,本文件补齐:
//   1. 注册 dayjs zh-cn locale(页面代码直接使用的全局 dayjs 实例)
//   2. 注册 dayjs zh-cn locale 到 ElementPlus 内置 dayjs(ElementPlus.dayjs —
//      EP 2.13 UMD 打包了独立的 dayjs 实例,locale 注册表与全局实例互不相通)
//   3. 导出 el-config-provider 可用的 zh-cn locale 对象
//      (来自 library/element-zh-cn.min.js 暴露的全局 ElementPlusLocaleZhCn)
//
// 用法(页面入口 app.vue):
//   import zhCn from "./assets/shared/element-zh.js";
//   <el-config-provider :locale="zhCn"> ... </el-config-provider>
import dayjs from "dayjs";

// ---- dayjs zh-cn locale 定义(两份 dayjs 实例共用) ----
const DAYJS_ZH_CN = {
  name: "zh-cn",
  weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
  weekdaysShort: "周日_周一_周二_周三_周四_周五_周六".split("_"),
  weekdaysMin: "日_一_二_三_四_五_六".split("_"),
  months: "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),
  monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
  weekStart: 1,
  formats: {
    LT: "HH:mm",
    LTS: "HH:mm:ss",
    L: "YYYY/MM/DD",
    LL: "YYYY年M月D日",
    LLL: "YYYY年M月D日 Ah点mm分",
    LLLL: "YYYY年M月D日ddddAh点mm分",
    l: "YYYY/M/D",
    ll: "YYYY年M月D日",
    lll: "YYYY年M月D日 HH:mm",
    llll: "YYYY年M月D日dddd HH:mm",
  },
  relativeTime: {
    future: "%s内",
    past: "%s前",
    s: "几秒",
    m: "1 分钟",
    mm: "%d 分钟",
    h: "1 小时",
    hh: "%d 小时",
    d: "1 天",
    dd: "%d 天",
    M: "1 个月",
    MM: "%d 个月",
    y: "1 年",
    yy: "%d 年",
  },
  meridiem(hour, minute) {
    const hm = hour * 100 + minute;
    if (hm < 600) return "凌晨";
    if (hm < 900) return "早上";
    if (hm < 1130) return "上午";
    if (hm < 1230) return "中午";
    if (hm < 1800) return "下午";
    return "晚上";
  },
  ordinal(number, period) {
    switch (period) {
      case "W":
        return `${number}周`;
      default:
        return `${number}日`;
    }
  },
};

// 1. 全局 dayjs(页面代码 import dayjs from "dayjs" 的实例)
dayjs.locale("zh-cn", DAYJS_ZH_CN, true);

// 2. ElementPlus 内置 dayjs(EP 日期组件内部使用)
if (typeof ElementPlus !== "undefined" && ElementPlus.dayjs && ElementPlus.dayjs.locale) {
  ElementPlus.dayjs.locale("zh-cn", DAYJS_ZH_CN, true);
}

// 3. EP 组件 locale 对象(library/element-zh-cn.min.js 提供的全局)
const zhCn =
  typeof ElementPlusLocaleZhCn !== "undefined"
    ? ElementPlusLocaleZhCn
    : { name: "zh-cn", el: {} };

export default zhCn;
