import { useState } from "react";
import { Form, Steps, Button, Space, Result } from "antd";
import { Icon } from "../../assets/shared/icons.js";
import { stepItems } from "../data.js";
import BasicInfoForm from "./steps/BasicInfoForm.jsx";
import NetworkForm from "./steps/NetworkForm.jsx";
import ConfirmForm from "./steps/ConfirmForm.jsx";
import "./step-flow.css";

const { useForm } = Form;

// Layer 4: 步骤流编排 — 步骤条 + 当前步骤表单 + 底部操作按钮
export default function StepFlow() {
  const [current, setCurrent] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [allValues, setAllValues] = useState({});
  const [basicForm] = useForm();
  const [networkForm] = useForm();

  const isLast = current === stepItems.length - 1;

  // 表单实例与已收集数据按步骤分派(确认页只读回显)
  const forms = [basicForm, networkForm, null];
  const stepInitialValues = [allValues.basic, allValues.network, undefined];

  async function goNext() {
    const form = forms[current];
    if (form) {
      try {
        const values = await form.validateFields();
        setAllValues((prev) => ({
          ...prev,
          [stepItems[current].key]: values,
        }));
      } catch {
        return; // 校验失败停留在当前步
      }
    }
    if (isLast) {
      setSubmitted(true);
    } else {
      setCurrent((c) => c + 1);
    }
  }

  function goPrev() {
    setCurrent((c) => Math.max(0, c - 1));
  }

  function restart() {
    setSubmitted(false);
    setCurrent(0);
    setAllValues({});
    basicForm.resetFields();
    networkForm.resetFields();
  }

  if (submitted) {
    return (
      <section className="panel step-panel">
        <Result
          status="success"
          title="设备接入任务已提交"
          subTitle={`设备「${allValues.basic?.deviceName || "未命名"}」已进入接入调试队列,预计 2 分钟内完成首轮采集`}
          extra={
            <Button type="primary" onClick={restart} icon={<Icon name="rotate-ccw" size={14} />}>
              再配置一台
            </Button>
          }
        />
      </section>
    );
  }

  return (
    <section className="panel step-panel">
      <Steps current={current} items={stepItems} />

      <div className="step-content">
        {current === 0 && (
          <BasicInfoForm form={basicForm} initialValues={stepInitialValues[0]} />
        )}
        {current === 1 && (
          <NetworkForm form={networkForm} initialValues={stepInitialValues[1]} />
        )}
        {current === 2 && <ConfirmForm values={{ ...allValues.basic, ...allValues.network }} />}
      </div>

      <div className="step-footer">
        <Space>
          <Button onClick={goPrev} disabled={current === 0} icon={<Icon name="arrow-left" size={14} />}>
            上一步
          </Button>
          <Button type="primary" onClick={goNext}>
            {isLast ? (
              "提交配置"
            ) : (
              <>
                下一步 <Icon name="arrow-right" size={14} />
              </>
            )}
          </Button>
        </Space>
      </div>
    </section>
  );
}
