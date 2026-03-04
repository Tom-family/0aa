<template>
  <!-- 添加或修改岗位对话框 -->
  <el-dialog title="测试记录详情" v-model="open" width="1000px" append-to-body :show-close="false" :close-on-click-modal="false" :draggable="true">
    <el-card class="header">
      <div class="card-header">
        <div class="header-box">
          <span>测试用户：</span>
          {{ detailData.userName || "-" }}
        </div>
        <div class="header-box">
          <span>测试题：</span>
          {{ detailData.saTestTopic || "-" }}
        </div>
        <div class="header-box">
          <span>联系电话：</span>
          {{ detailData.userAccnum || "-" }}
        </div>
        <div class="header-box">
          <span>测试时间：</span>
          {{ detailData.saResultCreateTime || "-" }}
        </div>
      </div>
    </el-card>
    <el-card class="card-content">
      <div class="answer-title">测试答案</div>
      <div class="answer-box">
        <div class="answer-item" v-for="(value, key) in detailData.saResultAnswer" :key="key" @click="tapDetail(key, value)">
          <div class="answer-left">{{ key }}</div>
          <div class="answer-right">{{ value }}</div>
        </div>
        <div class="empty-box">
          <el-empty description="暂无数据" v-if="JSON.stringify(detailData.saResultAnswer) == '{}'" />
        </div>
      </div>
    </el-card>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>

    <el-dialog v-model="detailVisible" width="600" title="答案详情" append-to-body :draggable="true" >
      <div v-loading="detailLoading">
        <div class="detail-box">
          <div class="detail-title">题目编号：</div>
          <div>{{ questionDetail.saQuestionSequence }}</div>
        </div>
        <div class="detail-box">
          <div class="detail-title">题目内容：</div>
          <div>{{ questionDetail.saQuestionName }}</div>
        </div>
        <div class="detail-box" v-if="questionDetail.saQuestionOption != 4">
          <div class="detail-title">题目选项：</div>
          <div v-if="questionDetail.content">
            <div v-for="(value, key) in questionDetail.content" :key="key" style="margin-bottom: 4px">
              {{ key }}：
              {{ value }}
            </div>
          </div>
          <div v-else>-</div>
        </div>
        <div class="detail-box">
          <div class="detail-title">答案：</div>
          <div>{{ questionDetail.answer }}</div>
        </div>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from "vue";
import { selectTopicQuestion } from "@/api/chongQing/test.js";
import { isSubmitData } from "@/utils/index.js";
const { proxy } = getCurrentInstance();
const emit = defineEmits(["closeDia"]);
const title = ref("新建关系");
const open = ref(true);
const detailData = ref(false);
const detailVisible = ref(false);
const questionDetail = ref({});
const detailLoading = ref(false);

// 打开弹窗  数据回显
function show(data) {
  detailData.value = JSON.parse(JSON.stringify(data));
  if (detailData.value.saResultAnswer) {
    detailData.value.saResultAnswer = JSON.parse(detailData.value.saResultAnswer);
  } else {
    detailData.value.saResultAnswer = {};
  }
  console.log(detailData.value.saResultAnswer, 999);
}

function tapDetail(key, value) {
  detailLoading.value = true;
  let params = {
    saResultTestId: detailData.value.saResultTestId,
    saQuestionSequence: key,
  };
  detailVisible.value = true;
  selectTopicQuestion(params).then((res) => {
    questionDetail.value = {
      saQuestionName: res.data.saQuestionName, //题目
      saQuestionSequence: res.data.saQuestionSequence, //编号
      answer: value, //答案
      content: JSON.parse(res.data.saQuestionAnswer), //选项内容
      saQuestionOption: res.data.saQuestionOption, //题目类型 1单选 2多选 3非必选 4问答
    };
  }).finally(() => {
    detailLoading.value = false;
  });
}

/** 取消按钮 */
function cancel() {
  emit("closeDia");
}

// 暴露
defineExpose({ show });
</script>

<style lang="scss" scoped>
.header {
  margin-top: 10px;
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .header-box {
      max-width: 25%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      span {
        color: #409eff;
      }
    }
  }
}

.card-content {
  margin-top: 20px;
  margin-bottom: 10px;
  max-height: 480px;
  overflow: auto;
  .answer-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 10px;
    text-align: center;
    color: #409eff;
  }
  .answer-box {
    width: 100%;
    display: flex;
    align-items: center;
    // justify-content: space-between;
    flex-wrap: wrap;
    .answer-item {
      cursor: pointer;
      border: 1px solid #eee;
      margin-top: 10px;
      width: 30%;
      margin-right: 5%;
      display: flex;
      align-items: center;
      height: 42px;
      &:nth-child(3n) {
        margin-right: 0 !important;
      }
      .answer-left {
        width: 40px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-right: 1px solid #eee;
        color: #606266;
      }
      .answer-right {
        padding: 0 5px;
        flex: 1;
        text-align: center;
        color: #606266;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
    .empty-box {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.detail-box {
  margin-block: 15px;
  display: flex;
  .detail-title {
    color: #409eff;
    flex-shrink: 0;
  }
}

:deep(.el-card__body) {
  padding: 20px !important;
}
</style>
