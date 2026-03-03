<template>
  <!-- 添加或修改岗位对话框 -->
  <el-dialog title="测试结果" v-model="open" width="600px" append-to-body :show-close="false" :close-on-click-modal="false" :draggable="true">
    <div class="print-box">
      <el-button type="primary" @click="cancel" class="print">打印</el-button>
    </div>

    <div class="dia-box">
      <img src="https://img2.baidu.com/it/u=2376489989,3127732063&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=657" alt="" />
    </div>
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
const { proxy } = getCurrentInstance();
const emit = defineEmits(["closeDia"]);
const open = ref(true);
const detailData = ref(false);

// 打开弹窗  数据回显
function show(data) {
  detailData.value = data;
}

/** 取消按钮 */
function cancel() {
  emit("closeDia");
}

// 暴露
defineExpose({ show });
</script>

<style lang="scss" scoped>
.print-box {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: -45px;
}
.dia-box {
  padding-top: 10px;
  img {
    width: 100%;
  }
}
</style>
