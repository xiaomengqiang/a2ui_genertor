import { h } from "vue";

// Chart — echarts 的 Vue 封装(声明式)
//
// 底层: assets/library/echarts.min.js(全局 echarts),option 原样透传给 setOption。
// ICT 配色: 运行时用 getComputedStyle 读 token(--color-chart-1..25 / 文本色 / 分隔线色),
//   亮暗模式自动跟随(.dark 切换 → dispose + 重建,同一条 init 路径);
//   token 读取失败(无头环境等)时回退到内置 ICT 色板。
// 尺寸: 图表填满根容器(100% × 100%),父级必须有可计算高度 —
//   固定高度卡片或 flex-fill 区域,或直接给 <Chart style="height: x rem" />。
// 隐藏容器(el-tabs / el-collapse / el-drawer 面板)初始 0×0,展示时 ResizeObserver 自愈。

// Chart.md 默认色板(token 读取失败时的回退)
const FALLBACK_PALETTE = [
  "#2070f3", "#62B42E", "#715AFB", "#2CB8C9", "#F69E39",
  "#5CA2E9", "#BF68FA", "#ED448A", "#BFB9FA", "#D19F00", "#B8D9F9",
];

function readToken(name, fallback) {
  try {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  } catch (e) {
    return fallback;
  }
}

// ICT 基础 option — 色板 + 文本/轴/提示的 token 化默认值,用户 option 后置覆盖
function buildBaseOption() {
  const palette = [];
  for (let i = 1; i <= 25; i++) {
    const v = readToken(`--color-chart-${i}`, "");
    if (v) palette.push(v);
  }
  if (!palette.length) palette.push(...FALLBACK_PALETTE);

  const textPrimary = readToken("--color-text-primary", "#191919");
  const textSecondary = readToken("--color-text-secondary", "#777777");
  const separator = readToken("--color-border-separator", "#DFDFDF");
  const separatorSubtle = readToken("--color-border-separator-sbutle", "#F3F3F3");
  const tooltipBg = readToken("--color-bg-2", "#FFFFFF");
  const fontFamily = readToken("--font-family", "'HarmonyOS Sans', 'Microsoft YaHei', Arial, sans-serif");

  const axisStyle = {
    axisLine: { lineStyle: { color: separator } },
    axisTick: { lineStyle: { color: separator } },
    axisLabel: { color: textSecondary },
    splitLine: { lineStyle: { color: separatorSubtle } },
  };

  return {
    color: palette,
    textStyle: { color: textPrimary, fontFamily },
    legend: { textStyle: { color: textSecondary } },
    tooltip: {
      backgroundColor: tooltipBg,
      borderColor: separator,
      textStyle: { color: textPrimary },
    },
    xAxis: { ...axisStyle },
    yAxis: { ...axisStyle },
  };
}

// 根容器默认尺寸(内联样式优先级高于本规则,父级 style/class 可覆盖)
function ensureChartCss() {
  if (typeof document === "undefined") return;
  if (document.getElementById("ict-chart-style")) return;
  const style = document.createElement("style");
  style.id = "ict-chart-style";
  style.textContent = ".ict-chart{width:100%;height:100%}";
  document.head.appendChild(style);
}

export default {
  name: "Chart",
  props: {
    // echarts option — 完整配置原样透传;基础配色/文本默认值由本组件注入
    option: { type: Object, required: true },
  },
  emits: ["rendered"],
  data() {
    return { isDark: false };
  },
  watch: {
    // 深度监听:option 数据变化 → 增量 setOption(不重建实例)
    option: {
      handler() {
        this.applyOption();
      },
      deep: true,
    },
  },
  mounted() {
    ensureChartCss();
    this.initChart();

    // 容器尺寸变化(侧栏折叠/窗口缩放/隐藏面板展开) → 同步画布
    this._ro = new ResizeObserver(() => {
      if (this.chart && !this.chart.isDisposed()) this.chart.resize();
    });
    this._ro.observe(this.$refs.container);

    // .dark 切换 → dispose + 重建(重新读 token,走同一条 init 路径)
    this._mo = new MutationObserver(() => {
      const dark = document.documentElement.classList.contains("dark");
      if (dark !== this.isDark) this.initChart();
    });
    this._mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  },
  beforeUnmount() {
    if (this._ro) this._ro.disconnect();
    if (this._mo) this._mo.disconnect();
    this.disposeChart();
  },
  methods: {
    initChart() {
      const container = this.$refs.container;
      if (!container || typeof echarts === "undefined" || !echarts.init) return;
      this.disposeChart();
      this.isDark = document.documentElement.classList.contains("dark");
      this.chart = echarts.init(container, null, { renderer: "svg" });
      this.chart.setOption(buildBaseOption(), true);
      this.chart.setOption(this.option);
      this.$emit("rendered", this.chart);
    },
    applyOption() {
      if (!this.chart || this.chart.isDisposed()) {
        this.initChart();
        return;
      }
      this.chart.setOption(buildBaseOption(), true);
      this.chart.setOption(this.option);
    },
    disposeChart() {
      if (this.chart) {
        try {
          this.chart.dispose();
        } catch (e) {
          /* 容器已卸载时静默 */
        }
        this.chart = null;
      }
    },
    // 模板 ref 方法:高级操作(事件绑定、dataZoom、tooltip 定制等)
    getEchartsInstance() {
      return this.chart || null;
    },
    // 模板 ref 方法:极端场景手动兜底 resize(ResizeObserver 已覆盖大多数情况)
    resizeHandler() {
      if (this.chart && !this.chart.isDisposed()) this.chart.resize();
    },
  },
  render() {
    return h("div", { ref: "container", class: "ict-chart" });
  },
};
