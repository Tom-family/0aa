<template>
  <!-- 添加或修改岗位对话框 -->
  <el-dialog :title="title" v-model="open" width="800px" append-to-body :show-close="false" :close-on-click-modal="false" :draggable="true">
    <div class="dia-box">
      <el-form ref="postRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="测评标题" prop="relationName">
          <el-input :disabled="detailData.setType == 'view'" v-model="form.relationName" placeholder="请输入测评标题" />
        </el-form-item>
        <el-form-item label="封面图" prop="smallScreenCoverUrl">
          <ImageUpload :disabled="detailData.setType == 'view'" :limit="1" :updateType="17" v-model="form.smallScreenCoverUrl" @fileChange="changeSmallScreenCoverUrl" />
        </el-form-item>
        <el-form-item label="顺序" prop="srSort">
          <el-input-number :disabled="detailData.setType == 'view'" v-model="form.srSort" controls-position="right" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="测试题目" prop="srSort">
          <testItem />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm" :loading="buttonLoading">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from "vue";
import { saSevenRelationSaSevenInsert, saSevenRelationSaSevenUpdate } from "@/api/chongQing/phase.js";
import { isSubmitData } from "@/utils/index.js";
import testItem from "./testItem.vue";
const { proxy } = getCurrentInstance();
const emit = defineEmits(["closeDia"]);
const title = ref("新建关系");
const open = ref(true);
const buttonLoading = ref(false);
const detailData = ref(false);
const data = reactive({
  oldForm: {},
  form: {
    sevenRelationId: "",
    relationName: "", //测评标题
    smallScreenCoverUrl: "", //封面图
    srSort: "",
  },
  rules: {
    relationName: [{ required: true, message: "请输入测评标题", trigger: ["change", "blur"] }],
    smallScreenCoverUrl: [{ required: true, message: "请选择封面图", trigger: ["change", "blur"] }],
    srSort: [{ required: true, message: "请输入排序", trigger: ["change", "blur"] }],
  },
});
const { form, rules, oldForm } = toRefs(data);

// 图片选择时  验证小屏关系卡片
function changeSmallScreenCoverUrl(file) {
  proxy.$refs["postRef"].validateField("smallScreenCoverUrl");
}

// 打开弹窗  数据回显
function show(data) {
  detailData.value = data;
  // 标题
  if (data.setType == "edit") {
    title.value = "修改测评";
  } else if (data.setType == "add") {
    title.value = "新增测评";
  } else {
    title.value = "查看测评";
  }
  if (data.setType != "add") {
    for (let key in form.value) {
      form.value[key] = data[key];
    }
  }
  oldForm.value = JSON.parse(JSON.stringify(form.value));
}

/** 提交按钮 */
async function submitForm() {
  proxy.$refs["postRef"].validate((valid) => {
    if (valid) {
      let params = JSON.parse(JSON.stringify(form.value));
      if (form.value.sevenRelationId) {
        if (isSubmitData(params, oldForm.value)) {
          proxy.$modal.msgWarning("未修改无法提交");
          return;
        }
        buttonLoading.value = true;
        saSevenRelationSaSevenUpdate(params)
          .then((res) => {
            proxy.$modal.msgSuccess("编辑成功");
            emit("closeDia", true);
          })
          .finally(() => {
            buttonLoading.value = false;
          });
      } else {
        buttonLoading.value = true;
        delete params.sevenRelationId;
        saSevenRelationSaSevenInsert(params)
          .then((res) => {
            proxy.$modal.msgSuccess("添加成功");
            emit("closeDia", true);
          })
          .finally(() => {
            buttonLoading.value = false;
          });
      }
    }
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
.dia-box {
  max-height: 700px;
  overflow: auto;
}
</style>
