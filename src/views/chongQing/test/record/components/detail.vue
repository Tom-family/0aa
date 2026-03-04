<template>
  <!-- 添加或修改岗位对话框 -->
  <el-dialog title="测试记录详情" v-model="open" width="1000px" append-to-body :show-close="false" :close-on-click-modal="false" :draggable="true">
    <el-card class="header">
      <div class="card-header">
        <div class="header-box">
          <span>用户昵称：</span>
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
        <div class="answer-item" v-for="(value, key) in detailData.saResultAnswer" :key="key">
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
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from "vue";
import { saTestTopicInsert, saTestTopicUpdate } from "@/api/chongQing/test.js";
import { isSubmitData } from "@/utils/index.js";
const { proxy } = getCurrentInstance();
const emit = defineEmits(["closeDia"]);
const title = ref("新建关系");
const open = ref(true);
const detailData = ref(false);

// 打开弹窗  数据回显
function show(data) {
  console.log(data, 999);
  detailData.value = JSON.parse(JSON.stringify(data));
  if (detailData.value.saResultAnswer) {
    detailData.value.saResultAnswer = JSON.parse(detailData.value.saResultAnswer);
  } else {
    detailData.value.saResultAnswer = {};
  }
  console.log(detailData.value.saResultAnswer, 999);
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
    .empty-box{
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

:deep(.el-card__body) {
  padding: 20px !important;
}
</style>
