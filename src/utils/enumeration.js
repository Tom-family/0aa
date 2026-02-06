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

// 导出对应的回显方法
// primary    success     info   warning   danger
export function GetLabelByValue(data, value, valueKey = "value", labelKey = "label") {
  const item = data.find((item) => item[valueKey] == value);
  return item ? item[labelKey] : value;
}
