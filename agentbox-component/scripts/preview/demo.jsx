import { Icon } from "./assets/shared/icons.js";
import SegmentedSteps from "./components/SegmentedSteps/index.jsx";
import "./demo.css";

const journeySteps = [
  { value: 48200, label: "触达", icon: "trending-up" },
  { value: 21500, label: "打开", icon: "mouse-pointer-click" },
  { value: 12800, label: "浏览详情", icon: "eye" },
  { value: 6400, label: "加购", icon: "shopping-cart" },
  { value: 2360, label: "下单", icon: "package-check" },
];

const plainSteps = [
  { value: 1280, label: "曝光" },
  { value: 860, label: "点击" },
  { value: 420, label: "注册" },
  { value: 156, label: "转化" },
];

const brandColors = ["#0067D1", "#2E86DE", "#2070F3", "#5CA2E9", "#8ABEF3"];

export default function Demo() {
  return (
    <div className="demo-page">
      <header className="demo-header">
        <h1 className="demo-title">
          组件预览
        </h1>
        <p className="demo-subtitle">
          罗列当前组件的多种形态。
        </p>
      </header>

      <section className="demo-section">
        <div className="demo-section-header">
          <h2 className="demo-section-name">SegmentedSteps</h2>
          <span className="demo-section-tag">
            <Icon name="chart-column" size={12} />
            数据展示
          </span>
        </div>
        <p className="demo-section-desc">
          分段式漏斗步骤条。轨道宽度按数值占比分配，悬停高亮对应步骤，数值自动格式化为 k / w。
        </p>
        <div className="demo-grid demo-grid-2">
          <div className="demo-item">
            <h3 className="demo-item-title">默认形态（无 icon，色点图例）</h3>
            <SegmentedSteps steps={plainSteps} />
            <p className="demo-note">仅传 steps：系列色用内置图表色，图例回退为色点。</p>
          </div>
          <div className="demo-item">
            <h3 className="demo-item-title">五步用户旅程（数据驱动图标）</h3>
            <SegmentedSteps steps={journeySteps} />
            <p className="demo-note">传入自定义 steps 数据（含 icon 字段），标签区与轨道自动对齐。</p>
          </div>
          <div className="demo-item">
            <h3 className="demo-item-title">进行中 + 自定义配色</h3>
            <SegmentedSteps steps={journeySteps} colors={brandColors} activeIndex={2} />
            <p className="demo-note">activeIndex=2：前三步点亮，其余置灰；colors 支持任意色值数组。</p>
          </div>
        </div>
      </section>
    </div>
  );
}
