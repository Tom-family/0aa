<template>
  <!-- 添加或修改岗位对话框 -->
  <el-dialog title="绑定用户" v-model="open" width="600px" append-to-body :show-close="false" :close-on-click-modal="false" :draggable="true">
    <div class="dia-box">
      <el-form ref="postRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="用户手机号" prop="name1">
          <el-input v-model="form.name1" placeholder="请输入用户手机号" @input="changPhone" />
        </el-form-item>
        <el-form-item label="用户名称" prop="name2">
          <el-input v-model="form.name2" placeholder="请输入用户名称" @input="changPhone" />
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
import { saTestTopicInsert, saTestTopicUpdate } from "@/api/chongQing/test.js";
const { proxy } = getCurrentInstance();
const emit = defineEmits(["closeDia"]);
const open = ref(true);
const buttonLoading = ref(false);
const detailData = ref(false);
const data = reactive({
  form: {
    name1: "", //用户手机号
    name2: "", //用户名称
  },
  rules: {
    // name1: [{ required: true, message: "请输入用户手机号", trigger: ["change", "blur"] }],
    name2: [{ required: true, message: "请选择用户名称", trigger: ["change", "blur"] }],
  },
});
const { form, rules } = toRefs(data);

// 手机号只能输入数字
function changPhone(val) {
  form.value.saTestTopic = val.replace(/[^\d]/g, ""); // 只保留数字
}

// 打开弹窗  数据回显
function show(data) {
  detailData.value = data;
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["postRef"].validate(async (valid) => {
    if (valid) {
      let params = JSON.parse(JSON.stringify(form.value));
      buttonLoading.value = true;
      saTestTopicInsert(params)
        .then((res) => {
          proxy.$modal.msgSuccess("添加成功");
          emit("closeDia", true);
        })
        .finally(() => {
          buttonLoading.value = false;
        });
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
