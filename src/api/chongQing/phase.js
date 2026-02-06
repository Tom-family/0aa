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

// 新增阶段基础
export function saStageBasicInsert(data) {
  return request({
    url: "/store/backend/saStageBasic/saStageBasicInsert",
    method: "post",
    data: data,
  });
}

// 修改阶段基础
export function saStageBasicUpdate(data) {
  return request({
    url: "/store/backend/saStageBasic/saStageBasicUpdate",
    method: "post",
    data: data,
  });
}

// 关系阶段管理
export function saStageInfoQueryPage(data) {
  return request({
    url: "/store/backend/saStageInfo/queryPage",
    method: "post",
    data: data,
  });
}

// 关系阶段添加
export function saStageInfoInsert(data) {
  return request({
    url: "/store/backend/saStageInfo/saStageInfoInsert",
    method: "post",
    data: data,
  });
}

// 关系阶段编辑
export function saStageInfoUpdate(data) {
  return request({
    url: "/store/backend/saStageInfo/saStageInfoUpdate",
    method: "post",
    data: data,
  });
}

// 关系阶段下拉
export function selectSiStageName(data) {
  return request({
    url: "/store/backend/saStageInfo/selectSiStageName",
    method: "post",
    data: data,
  });
}

// 关系走向基础列表
export function saTrendBasicQueryPage(data) {
  return request({
    url: "/store/backend/saTrendBasic/queryPage",
    method: "post",
    data: data,
  });
}

// 关系走向基础添加
export function saTrendBasicInsert(data) {
  return request({
    url: "/store/backend/saTrendBasic/saTrendBasicInsert",
    method: "post",
    data: data,
  });
}

// 关系走向基础编辑
export function saTrendBasicUpdate(data) {
  return request({
    url: "/store/backend/saTrendBasic/saTrendBasicUpdate",
    method: "post",
    data: data,
  });
}


// 关系走向管理列表
export function saTrendQueryPage(data) {
  return request({
    url: "/store/backend/saTrend/queryPage",
    method: "post",
    data: data,
  });
}

// 添加关系走向管理
export function saTrendInsert(data) {
  return request({
    url: "/store/backend/saTrend/saTrendInsert",
    method: "post",
    data: data,
  });
}

// 编辑关系走向管理
export function saTrendUpdate(data) {
  return request({
    url: "/store/backend/saTrend/saTrendUpdate",
    method: "post",
    data: data,
  });
}






