// 关系状态
export const RelationStatus = [
  { value: 0, label: "下架" },
  { value: 1, label: "上架" },
];

// 关系走向下拉
export const TowardType = [
  { value: 1, label: "风景线" },
  { value: 2, label: "自然线" },
  { value: 3, label: "事故线" },
];

// 测试题状态
export const TestStatus = [
  { value: 1, label: "上架" },
  { value: 2, label: "下架" },
];

// 版本状态
export const VersionStatus = [
  { value: 1, label: "生效中" },
  { value: 2, label: "已过期" },
];

// 设备类型
export const DeviceType = [
  { value: 1, label: "小屏软件" },
  { value: 2, label: "大屏软件" },
];

// 设备状态
export const DeviceStatus = [
  { value: 1, label: "待审核" },
  { value: 2, label: "已通过" },
  { value: 3, label: "已拒绝" },
];

// 导出对应的回显方法
// primary    success     info   warning   danger
export function GetLabelByValue(data, value, valueKey = "value", labelKey = "label") {
  const item = data.find((item) => item[valueKey] == value);
  return item ? item[labelKey] : value;
}
