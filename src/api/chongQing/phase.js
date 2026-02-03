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

// 七大关系下拉
export function saSevenRelationSelectSaSevenName() {
  return request({
    url: "/store/backend/saSevenRelation/selectSaSevenName",
    method: "post"
  });
}

// 关系阶段基础分页
export function saStageBasicQueryPage(data) {
  return request({
    url: "/store/backend/saStageBasic/queryPage",
    method: "post",
    data: data,
  });
}

// 新增阶段基础分页
export function saStageBasicInsert(data) {
  return request({
    url: "/store/backend/saStageBasic/saStageBasicInsert",
    method: "post",
    data: data,
  });
}

// 新增阶段基础分页
export function saStageBasicUpdate(data) {
  return request({
    url: "/store/backend/saStageBasic/saStageBasicUpdate",
    method: "post",
    data: data,
  });
}


