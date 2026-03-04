<template>
  <!-- 添加或修改岗位对话框 -->
  <el-dialog title="测试结果" v-model="open" width="600px" append-to-body :show-close="false" :close-on-click-modal="false" :draggable="true">
    <div class="print-box">
      <el-button type="primary" @click="tapPrint" class="print">打印</el-button>
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

// function tapPrint() {
//   const imageUrl = detailData.value.saTestDetailImage;
//   // 创建一个新的Image对象来预加载图片
//   const img = new Image();
//   img.src = imageUrl;
//   img.onload = () => {
//     print({
//       // 可以传单个URL字符串，也可以传URL数组
//       printable: detailData.value.saTestDetailImage,
//       type: "image",
//       imageStyle: "width:100%;margin:0; padding:0;", // 自定义图片样式
//       documentTitle: "用户手机尾号0810", // 打印文档的标题
//       header: "用户手机尾号0810", // 如果需要自定义标题，可以用这个
//       css: "/multpointreport.scss",
//       headerStyle: "font-size: 12px;",
//     });
//   };
// }

function tapPrint() {
  const imageUrl = detailData.value.saTestDetailImage;
  const img = new Image();
  img.src = imageUrl;
  img.onload = () => {
    const htmlContent = `
    <div class="my-print-container" style="page-break-inside: avoid; page-break-after: avoid; page-break-before: avoid;">
      <div style="margin-bottom: 10px; page-break-after: avoid;">
        <h2 style="font-size: 12px; margin: 0 0 5px 0;">用户手机尾号0810的测评结果</h2>
      </div>
      <img src="${detailData.value.saTestDetailImage}" style=" display: block; page-break-before: avoid;" />
      <img src="${detailData.value.saTestDetailImage}" style=" display: block; page-break-before: avoid;" />
    </div>
    `;

    print({
      printable: htmlContent,
      type: "raw-html",
      maxWidth: "100%",
      style: `@media print {
        @page {
          size: auto;
          margin: 10mm;
        }
        body {
          margin: 0 5px;
        }
        .my-print-container {
          page-break-inside: avoid !important;
          page-break-after: avoid !important;
          page-break-before: avoid !important;
          break-inside: avoid !important;
        }
        h2 {
          page-break-after: avoid !important;
          break-after: avoid !important;
        }
        img {
          page-break-before: avoid !important;
          break-before: avoid !important;
          max-height: 90vh;
        }
      }`
    });
  };
}
// 打开弹窗  数据回显
function show(data) {
  console.log(data, 9987);
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
