import React from 'react';
import Form from '@nce/eview-react/Form';
import TextField from '@nce/eview-react/TextField';
import TextArea from '@nce/eview-react/TextArea';
import Select from '@nce/eview-react/Select';
import SelectCard from '@nce/eview-react/SelectCard';

/**
 * 控件本体宽度设置速查（Form.Item name 托管模式下，样式属性照常传，不与 Form 托管冲突）
 * ----------------------------------------------------------------------------
 * - 项的栅格宽度（这一项占 Form 行宽的多少）→ Form 上的 itemCol / Form.Item 上的 col
 * - 控件本体宽度（输入框/下拉框自己多宽）→ 各控件自己的样式属性：
 *
 *   控件           | 控本体宽度的属性                   | 备注
 *   ---------------|-----------------------------------|----------------------------------------
 *   TextField      | inputStyle                        | 如 inputStyle={{ width: '100%' }}
 *   TextArea       | inputStyle                        | 同上
 *   SearchInput    | inputStyle                        | 同上
 *   IPInput        | inputStyle                        | 同上
 *   Spinner        | 无 inputStyle，只有 inputClassName | 用外部 class 控，如 .w-100 { width:100% }
 *   Select         | selectStyle                       | 不是 inputStyle！如 selectStyle={{ width: '100%' }}
 *   MultipleSelect | inputStyle 或 selectStyle         | 两者都可
 *   Cascader       | selectStyle                       | 不是 inputStyle
 *   TreeSelect     | selectStyle（框）/ inputStyle（已选预览）
 *   DatePicker     | selectStyle 或 style              | 官方示例多用 style={{ width: '18.5rem' }}
 *   SelectCard     | itemStyle（单卡）/ style（外层）
 *
 * 规律：文本类输入框 → inputStyle；下拉框 → selectStyle；Spinner 例外（inputClassName）
 * 注意：style 是最外层容器，会连 label 一起影响；Form 内控本体宽度优先用 inputStyle / selectStyle
 */

interface StepFormProps {
  formRef: React.Ref<any>;
  initialValues?: Record<string, any>;
  onSuccess: (values: any) => void;
  onFailed: (errors: any, values: any) => void;
}

interface BasicInfoFormState {
  deviceTypeOptions: { value: string; text: string }[];
  stationOptions: { value: string; text: string }[];
  protocolRadioData: { value: string; text: string }[];
}

class BasicInfoForm extends React.Component<StepFormProps, BasicInfoFormState> {
  constructor(props: StepFormProps) {
    super(props);
    this.state = {
      deviceTypeOptions: [
        { value: 'inverter', text: '光伏逆变器' },
        { value: 'turbine', text: '风力发电机组' },
        { value: 'storage', text: '储能电池簇' },
        { value: 'meter', text: '智能电表' },
      ],
      stationOptions: [
        { value: 'north-wind-03', text: '华北风电场-03' },
        { value: 'east-pv-11', text: '华东光伏站-11' },
        { value: 'south-storage-02', text: '华南储能站-02' },
      ],
      protocolRadioData: [
        { value: 'modbus-tcp', text: 'Modbus TCP' },
        { value: 'iec104', text: 'IEC 104' },
        { value: 'mqtt', text: 'MQTT' },
      ],
    };
  }

  render() {
    const { formRef, initialValues, onSuccess, onFailed } = this.props;
    const { deviceTypeOptions, stationOptions, protocolRadioData } = this.state;
    return (
      <Form
        ref={formRef}
        layout="vertical"
        initialValues={initialValues}
        onSuccess={onSuccess}
        onFailed={onFailed}
        className="step-form"
        validateAllChildComponent
        validateErrorType="div"
      >
        {/* col={24}: Form.Item 单项覆盖 Form 级 itemCol，占整行；inputStyle 控 TextField 本体宽度 */}
        <Form.Item name="deviceName" label="设备名称" rules={[{ required: true }]} col={24}>
          <TextField placeholder="如:华北风电场-03 逆变器 A12" maxLength={32} inputStyle={{width: '100%'}}/>
        </Form.Item>
          {/* col={12}: 半宽；Select 用 selectStyle（不是 inputStyle）控选择框本体宽度 */}
          <Form.Item name="deviceType" label="设备类型" rules={[{ required: true }]}  col={12}>
            <Select options={deviceTypeOptions} defaultLabel="请选择设备类型" enableClear selectStyle={{width: '100%'}}/>
          </Form.Item>
          <Form.Item name="station" label="所属站点" rules={[{ required: true }]}   col={12}>
            <Select options={stationOptions} defaultLabel="请选择所属站点" enableClear selectStyle={{width: '100%'}} />
          </Form.Item>
        {/* SelectCard（Radio.Button 等价）：itemStyle 控单个选项卡样式，style 控外层；这里用默认 */}
        <Form.Item name="protocol" label="接入协议" rules={[{ required: true }]}>
          <SelectCard data={protocolRadioData} />
        </Form.Item>
        {/* TextArea 同 TextField，用 inputStyle 控本体宽度 */}
        <Form.Item name="remark" label="备注">
          <TextArea placeholder="补充设备用途、投运时间等信息(选填)" rows={3} maxLength={200}  inputStyle={{width: '100%'}}/>
        </Form.Item>
      </Form>
    );
  }
}

export default BasicInfoForm;