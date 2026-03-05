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
