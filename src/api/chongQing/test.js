
import request from "@/utils/request";

// 测试题分页
export function saTestTopicQueryPage(data) {
  return request({
    url: "/store/backend/saTestTopic/queryPage",
    method: "post",
    data: data,
  });
}

// 测试题添加
export function saTestTopicInsert(data) {
  return request({
    url: "/store/backend/saTestTopic/saTestTopicInsert",
    method: "post",
    data: data,
    headers: {
      sendDataType:'json'
    }
  });
}

// 测试题编辑
export function saTestTopicUpdate(data) {
  return request({
    url: "/store/backend/saTestTopic/saTestTopicUpdate",
    method: "post",
    data: data,
    // headers: {
    //   sendDataType:'json'
    // }
  });
}

// 测试记录分页
export function saTestResultsQueryPage(data) {
  return request({
    url: "/store/backend/saTestResults/queryPage",
    method: "post",
    data: data,
  });
}

// 导出答卷
export function exportTestExamResultDetail(data) {
  return request({
    url: "/store/backend/saTestResults/exportTestExamResultDetail",
    method: "post",
    data: data,
    responseType:'blob'
  });
}


// 通过用户手机号与用户的名称绑定用户到测试记录中
export function userAccNumAndUserNameBind(data) {
  return request({
    url: "/store/backend/saTestResults/userAccNumAndUserNameBind",
    method: "post",
    data: data,
  });
}

// 根据手机号查询用户信息
export function accNumSelectUser(data) {
  return request({
    url: "/store/backend/saTestResults/accNumSelectUser",
    method: "post",
    data: data,
  });
}

// 查看每一道题目的详情
export function selectTopicQuestion(data) {
  return request({
    url: "/store/backend/saTestResults/selectTopicQuestion",
    method: "post",
    data: data,
  })
}


// 通过七大关系id 查询测试题信息（回显选择框版本）
export function selectSaTestTopicInfo(data) {
  return request({
    url: "/store/backend/saSevenRelation/selectSaTestTopicInfo",
    method: "post",
    data: data,
  })
}

// 根据主键id 修改解绑关联（解绑操作））
export function updateSaTestTopic(data) {
  return request({
    url: "/store/backend/saSevenRelation/updateSaTestTopic",
    method: "post",
    data: data,
  })
}


// 关系添加测试题
export function insertSaTestTopic(data) {
  return request({
    url: "/store/backend/saSevenRelation/insertSaTestTopic",
    method: "post",
    data: data,
  })
}

// 二维码绑定列表
export function querySmallScreenPage(data) {
  return request({
    url: "/store/backend/saTestResults/querySmallScreenPage",
    method: "post",
    data: data,
  })
}


// 绑定二维码绑定
export function userAccNumAndWorkerBind(data) {
  return request({
    url: "/store/backend/saTestResults/userAccNumAndWorkerBind",
    method: "post",
    data: data,
  })
}

// 获取绑定二维码的成员信息
export function queryWorkersByStore(data) {
  return request({
    url: "/store/backend/saTestResults/queryWorkersByStore",
    method: "post",
    data: data,
  })
}

