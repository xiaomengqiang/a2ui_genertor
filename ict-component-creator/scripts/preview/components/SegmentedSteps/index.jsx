const { useState } = React;

const defaultColors = [
  "#0067D1",
  "#09AA71",
  "#FCC800",
  "#F4840C",
  "#E02128",
  "#2070F3",
  "#9B59B6",
  "#1ABC9C",
];

const defaultSteps = [
  { value: 1280, label: "曝光" },
  { value: 860, label: "点击" },
  { value: 420, label: "注册" },
  { value: 156, label: "转化" },
];

function SegmentedSteps(props) {
  const steps = props.steps || defaultSteps;
  const colors = props.colors || defaultColors;
  const trackHeight = props.trackHeight || 11;
  const trackGap = props.trackGap != null ? props.trackGap : 3;
  const trackRadius = props.trackRadius != null ? props.trackRadius : 2;
  const labelAreaGap = props.labelAreaGap || 12;
  const dotSize = props.dotSize || 8;
  const valueFontSize = props.valueFontSize || 24;
  const valueLineHeight = props.valueLineHeight || 32;
  const labelFontSize = props.labelFontSize || 12;
  const activeIndex = props.activeIndex != null ? props.activeIndex : steps.length - 1;

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const maxValue = Math.max(...steps.map((s) => s.value));
  const totalValue = steps.reduce((sum, s) => sum + s.value, 0);

  const trackFlexBasis = steps.map((s) => (s.value / totalValue) * 100);

  const formatValue = (val) => {
    if (val >= 10000) return (val / 10000).toFixed(1) + "w";
    if (val >= 1000) return (val / 1000).toFixed(1) + "k";
    return String(val);
  };

  return (
    <div className="ss-container">
      <div className="ss-tracks">
        {steps.map((step, i) => {
          const color = colors[i % colors.length];
          const isActive = i <= activeIndex;
          const isHovered = hoveredIndex === i;
          return (
            <div
              key={i}
              className="ss-track-wrapper"
              style={{
                flexGrow: 0,
                flexShrink: 0,
                flexBasis: `calc(${trackFlexBasis[i]}% - ${trackGap}px)`,
                marginRight: i < steps.length - 1 ? `${trackGap}px` : "0",
              }}
            >
              <div
                className={`ss-track ${isActive ? "ss-track-active" : "ss-track-inactive"} ${isHovered ? "ss-track-hover" : ""}`}
                style={{
                  height: `${trackHeight}px`,
                  borderRadius: `${trackRadius}px`,
                  backgroundColor: isActive ? color : "#E8E8E8",
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="ss-label-area" style={{ marginTop: `${labelAreaGap}px` }}>
        {steps.map((step, i) => {
          const color = colors[i % colors.length];
          const isActive = i <= activeIndex;
          const isHovered = hoveredIndex === i;
          return (
            <div
              key={i}
              className="ss-label-item"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className="ss-value"
                style={{
                  fontSize: `${valueFontSize}px`,
                  lineHeight: `${valueLineHeight}px`,
                  color: isActive || isHovered ? "#191919" : "#AEAEAE",
                }}
              >
                {formatValue(step.value)}
              </div>
              <div className="ss-label-bottom">
                <span
                  className="ss-dot"
                  style={{
                    width: `${dotSize}px`,
                    height: `${dotSize}px`,
                    backgroundColor: color,
                    opacity: isActive ? 1 : 0.4,
                  }}
                />
                <span
                  className="ss-label"
                  style={{
                    fontSize: `${labelFontSize}px`,
                    color: isActive || isHovered ? "#777777" : "#AEAEAE",
                  }}
                >
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
