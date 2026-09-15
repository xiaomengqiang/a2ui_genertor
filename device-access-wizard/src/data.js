// Layer 2: mock 数据与流程配置

// 侧边菜单(亮色体系,默认不生成深色侧导航)
export const menuItems = [
  { key: "overview", icon: "gauge", label: "设备总览" },
  { key: "devices", icon: "server", label: "设备管理" },
  { key: "alarms", icon: "bell", label: "告警中心" },
  { key: "settings", icon: "settings", label: "系统设置" },
];

// 面包屑路径(真实层级,不凑假路径)
export const breadcrumbs = ["设备管理", "新建接入", "配置向导"];

// 步骤定义(横向 Steps 不承载长文案,说明放内容区)
export const stepItems = [
  { key: "basic", title: "基础信息" },
  { key: "network", title: "网络配置" },
  { key: "confirm", title: "确认提交" },
];

export const deviceTypeOptions = [
  { value: "inverter", label: "光伏逆变器" },
  { value: "turbine", label: "风力发电机组" },
  { value: "storage", label: "储能电池簇" },
  { value: "meter", label: "智能电表" },
];

export const stationOptions = [
  { value: "north-wind-03", label: "华北风电场-03" },
  { value: "east-pv-11", label: "华东光伏站-11" },
  { value: "south-storage-02", label: "华南储能站-02" },
];

export const protocolOptions = [
  { value: "modbus-tcp", label: "Modbus TCP" },
  { value: "iec104", label: "IEC 104" },
  { value: "mqtt", label: "MQTT" },
];

// 第三步确认页的字段分组呈现配置
export const confirmGroups = [
  {
    key: "basic",
    title: "基础信息",
    fields: [
      ["deviceName", "设备名称"],
      ["deviceType", "设备类型"],
      ["station", "所属站点"],
      ["protocol", "接入协议"],
      ["remark", "备注"],
    ],
  },
  {
    key: "network",
    title: "网络配置",
    fields: [
      ["host", "通信地址"],
      ["port", "端口"],
      ["collectInterval", "采集周期(秒)"],
      ["encrypted", "链路加密"],
    ],
  },
];

// label → 文案映射(用于确认页回显)
export const labelMaps = {
  deviceType: Object.fromEntries(deviceTypeOptions.map((o) => [o.value, o.label])),
  station: Object.fromEntries(stationOptions.map((o) => [o.value, o.label])),
  protocol: Object.fromEntries(protocolOptions.map((o) => [o.value, o.label])),
  encrypted: { true: "已启用", false: "未启用" },
};
