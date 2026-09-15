import { Form, Input, InputNumber, Switch } from "antd";

// Layer 4: 步骤二 — 网络配置表单
export default function NetworkForm({ form, initialValues }) {
  return (
    <Form form={form} layout="vertical" initialValues={initialValues} className="step-form">
      <div className="step-form-row">
        <Form.Item
          name="host"
          label="通信地址"
          rules={[
            { required: true, message: "请输入通信地址" },
            { pattern: /^(?=.{1,255}$)[a-zA-Z0-9.-]+$/, message: "仅支持域名或 IP 格式" },
          ]}
        >
          <Input placeholder="如:192.168.10.21" allowClear />
        </Form.Item>
        <Form.Item
          name="port"
          label="端口"
          rules={[{ required: true, message: "请输入端口" }]}
        >
          <InputNumber min={1} max={65535} placeholder="502" style={{ width: "100%" }} />
        </Form.Item>
      </div>

      <Form.Item
        name="collectInterval"
        label="采集周期(秒)"
        rules={[{ required: true, message: "请输入采集周期" }]}
        extra="数据点位的轮询间隔,范围 5 ~ 3600 秒"
      >
        <InputNumber min={5} max={3600} placeholder="15" style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item name="encrypted" label="链路加密" valuePropName="checked">
        <Switch />
      </Form.Item>
    </Form>
  );
}
