import { Descriptions, Alert } from "antd";
import { confirmGroups, labelMaps } from "../../data.js";

// Layer 4: 步骤三 — 确认提交(只读回显,不做输入)
function displayValue(key, value) {
  if (value === undefined || value === null || value === "") return "—";
  const map = labelMaps[key];
  return map ? map[String(value)] : String(value);
}

export default function ConfirmForm({ values }) {
  return (
    <div className="step-form">
      <Alert
        type="info"
        showIcon
        message="请核对以下配置信息,提交后设备将进入接入调试队列"
        className="confirm-alert"
      />
      {confirmGroups.map((group) => (
        <Descriptions
          key={group.key}
          title={group.title}
          bordered
          size="small"
          column={2}
          className="confirm-group"
        >
          {group.fields.map(([key, label]) => (
            <Descriptions.Item key={key} label={label}>
              {displayValue(key, values[key])}
            </Descriptions.Item>
          ))}
        </Descriptions>
      ))}
    </div>
  );
}
