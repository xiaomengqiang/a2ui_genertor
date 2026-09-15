import { Form, Input, Select, Radio } from "antd";
import { deviceTypeOptions, stationOptions, protocolOptions } from "../../data.js";

// Layer 4: 步骤一 — 基础信息表单
export default function BasicInfoForm({ form, initialValues }) {
  return (
    <Form form={form} layout="vertical" initialValues={initialValues} className="step-form">
      <Form.Item
        name="deviceName"
        label="设备名称"
        rules={[{ required: true, message: "请输入设备名称" }, { max: 32, message: "不超过 32 个字符" }]}
      >
        <Input placeholder="如:华北风电场-03 逆变器 A12" allowClear />
      </Form.Item>

      <div className="step-form-row">
        <Form.Item
          name="deviceType"
          label="设备类型"
          rules={[{ required: true, message: "请选择设备类型" }]}
        >
          <Select placeholder="请选择设备类型" options={deviceTypeOptions} />
        </Form.Item>
        <Form.Item
          name="station"
          label="所属站点"
          rules={[{ required: true, message: "请选择所属站点" }]}
        >
          <Select placeholder="请选择所属站点" options={stationOptions} />
        </Form.Item>
      </div>

      <Form.Item name="protocol" label="接入协议" rules={[{ required: true, message: "请选择接入协议" }]}>
        <Radio.Group>
          {protocolOptions.map((p) => (
            <Radio.Button key={p.value} value={p.value}>
              {p.label}
            </Radio.Button>
          ))}
        </Radio.Group>
      </Form.Item>

      <Form.Item name="remark" label="备注">
        <Input.TextArea placeholder="补充设备用途、投运时间等信息(选填)" rows={3} maxLength={200} showCount />
      </Form.Item>
    </Form>
  );
}
