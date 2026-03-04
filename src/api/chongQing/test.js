
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
