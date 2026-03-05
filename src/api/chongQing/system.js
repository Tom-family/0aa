import request from "@/utils/request";

// 版本号分页
export function saVersionQueryPage(data) {
  return request({
    url: "/store/backend/saVersion/queryPage",
    method: "post",
    data: data,
  });
}

// 版本号add
export function saSysVersionInsert(data) {
  return request({
    url: "/store/backend/saVersion/saSysVersionInsert",
    method: "post",
    data: data,
  });
}

// 设备管理分页
export function saDeviceEquipmentQueryPage(data) {
  return request({
    url: "/store/backend/saDeviceEquipment/queryPage",
    method: "post",
    data: data,
  });
}

// 设备管理修改
export function saDeviceUpdate(data) {
  return request({
    url: "/store/backend/saDeviceEquipment/saDeviceUpdate",
    method: "post",
    data: data,
  });
}
