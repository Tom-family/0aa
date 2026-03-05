<template>
  <!-- 添加或修改岗位对话框 -->
  <el-dialog title="测试结果" v-model="open" width="600px" append-to-body :show-close="false" :close-on-click-modal="false" :draggable="true">
    <div class="print-box">
      <el-button type="primary" icon="Printer" @click="tapPrint" class="print">打印</el-button>
    </div>

    <div class="dia-box">
      <img :src="detailData.saTestDetailImage" alt="" />
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

// 打印
function tapPrint() {
  let htmlContent = "";
  const imageUrl = detailData.value.saTestDetailImage;
  const img = new Image();
  img.src = imageUrl;
  img.onload = () => {
    if (detailData.value.userAccnum) {
      let phone = detailData.value.userAccnum.slice(-4);
      htmlContent = `
        <div class="print-title">用户手机尾号${phone}</div>
        <div class="print-img">
          <img src="${detailData.value.saTestDetailImage}" />
        </div>
    `;
    } else {
      htmlContent = `
        <div class="print-img">
          <img src="${detailData.value.saTestDetailImage}" />
        </div>
    `;
    }

    print({
      printable: htmlContent,
      type: "raw-html",
      header: "用户手机尾号0810", // 如果需要自定义标题，可以用这个
      css: "/multpointreport.scss",
      headerStyle: "font-size: 12px;",
    });
  };
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
  max-height: 650px;
  overflow: auto;
  margin-top: 10px;
  img {
    width: 100%;
  }
}
</style>
