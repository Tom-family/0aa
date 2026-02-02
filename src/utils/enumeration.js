// 关系状态
export const RelationStatus = [
  { value: 0, label: "下架" },
  { value: 1, label: "上架" },
];

// 导出对应的回显方法
// primary    success     info   warning   danger
export function GetLabelByValue(data, value, valueKey = "value", labelKey = "label") {
  const item = data.find((item) => item[valueKey] == value);
  return item ? item[labelKey] : value;
}
