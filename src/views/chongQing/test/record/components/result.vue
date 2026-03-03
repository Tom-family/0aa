<template>
  <!-- 添加或修改岗位对话框 -->
  <el-dialog title="测试结果" v-model="open" width="600px" append-to-body :show-close="false" :close-on-click-modal="false" :draggable="true">
    <div class="print-box">
      <el-button type="primary" @click="tapPrint" class="print">打印</el-button>
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
// 引入 print-js
import print from "print-js";
import { saTestTopicInsert, saTestTopicUpdate } from "@/api/chongQing/test.js";
const { proxy } = getCurrentInstance();
const emit = defineEmits(["closeDia"]);
const open = ref(true);
const detailData = ref(false);

function tapPrint() {
  print({
    // 可以传单个URL字符串，也可以传URL数组
    printable: ["https://img2.baidu.com/it/u=2376489989,3127732063&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=657"],
    type: "image",
    imageStyle: "width:100%", // 自定义图片样式
    documentTitle: "xxx的测试结果", // 打印文档的标题
    header: "XXX的测评结果", // 如果需要自定义标题，可以用这个
    css: "/multpointreport.scss",
    headerStyle: 'font-size: 20px; color: #1890ff; text-align: center; margin: 20px 0; font-weight: bold; border-bottom: 2px solid #ccc; padding-bottom: 10px;',
  });
}
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
