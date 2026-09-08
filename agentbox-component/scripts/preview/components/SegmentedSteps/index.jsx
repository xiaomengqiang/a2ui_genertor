import { useState } from "react";
import { Icon } from "../../assets/shared/icons.js";
import "./index.css";

const builtInColors = [
  "#564AF7",
  "#46B1E3",
  "#61CFBE",
  "#64BB5C",
  "#A5D61D",
  "#AC49F5",
  "#E64566",
  "#E84026",
];

export default function SegmentedSteps(props) {
  const steps = props.steps;
  const colors = props.colors || builtInColors;
  const trackHeight = 11;
  const trackGap = 3;
  const trackRadius = 2;
  const labelAreaGap = 12;
  const valueFontSize = 16;
  const labelFontSize = 12;
  const activeIndex = props.activeIndex != null ? props.activeIndex : steps.length - 1;
  const [hoveredIndex, setHoveredIndex] = useState(null);
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
                  ...(isActive ? { backgroundColor: color } : {}),
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
          const emphasized = isActive || isHovered;
          return (
            <div
              key={i}
              className="ss-label-item"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={`ss-value ${emphasized ? "" : "ss-value-muted"}`}
                style={{
                  fontSize: `${valueFontSize}px`,
                  lineHeight: 1.4,
                }}
              >
                {formatValue(step.value)}
              </div>
              <div className="ss-label-bottom">
                {step.icon ? (
                  <Icon
                    name={step.icon}
                    size={13}
                    color={color}
                    className={emphasized ? "ss-step-icon" : "ss-step-icon ss-step-icon-muted"}
                  />
                ) : (
                  <span
                    className="ss-dot"
                    style={{
                      backgroundColor: color,
                      opacity: emphasized ? 1 : 0.4,
                    }}
                  />
                )}
                <span
                  className={`ss-label ${emphasized ? "" : "ss-label-muted"}`}
                  style={{
                    fontSize: `${labelFontSize}px`,
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
