import request from "@/utils/request";

// 关系管理分页
export function saSevenRelationQueryPage(data) {
  return request({
    url: "/store/backend/saSevenRelation/queryPage",
    method: "post",
    data: data,
  });
}

// 新增关系
export function saSevenRelationSaSevenInsert(data) {
  return request({
    url: "/store/backend/saSevenRelation/saSevenInsert",
    method: "post",
    data: data,
  });
}

// 编辑关系/删除关系
export function saSevenRelationSaSevenUpdate(data) {
  return request({
    url: "/store/backend/saSevenRelation/saSevenUpdate",
    method: "post",
    data: data,
  });
}
