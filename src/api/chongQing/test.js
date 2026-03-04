
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