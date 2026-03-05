<template>
  <!-- 添加或修改岗位对话框 -->
  <el-dialog title="新增版本" v-model="open" width="600px" append-to-body :show-close="false" :close-on-click-modal="false" :draggable="true">
    <el-form ref="postRef" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="版本号" prop="versionNum">
        <el-input v-model="form.versionNum" placeholder="请输入版本号" />
      </el-form-item>
      <el-form-item label="地址" prop="versionUrl">
        <el-input v-model="form.versionUrl" placeholder="请输入地址" />
      </el-form-item>
      <el-form-item label="备注" prop="versionRemark">
        <el-input v-model="form.versionRemark" placeholder="请输入备注" type="textarea" :autosize="{ minRows: 3, maxRows: 12 }" />
      </el-form-item>
    </el-form>
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
import { saSysVersionInsert } from "@/api/chongQing/system.js";
import { isSubmitData } from "@/utils/index.js";
const { proxy } = getCurrentInstance();
const emit = defineEmits(["closeDia"]);
const open = ref(true);
const buttonLoading = ref(false);
const detailData = ref(false);
const data = reactive({
  form: {
    versionNum: "",
    versionUrl: "",
    versionRemark: "",
  },
  rules: {
    versionNum: [
      { required: true, message: "请输入版本号", trigger: ["change", "blur"] },
      { validator: validateVersionNum, trigger: ["change", "blur"] },
    ],
    versionUrl: [{ required: true, message: "请输入地址", trigger: ["change", "blur"] }],
    // versionRemark: [{ required: true, message: "请输入备注", trigger: ["change", "blur"] }],
  },
});
const { form, rules } = toRefs(data);

// 打开弹窗  数据回显
function show(data) {
  detailData.value = data;
}

// 版本号验证格式
function validateVersionNum(rule, value, callback) {
  const pattern = /^\d+\.\d+\.\d+$/;
  if (value == "") {
    callback(new Error("请输入版本号"));
  } else if (!pattern.test(value)) {
    callback(new Error("版本号格式不正确"));
  } else {
    callback();
  }
}

/** 提交按钮 */
async function submitForm() {
  proxy.$refs["postRef"].validate((valid) => {
    if (valid) {
      let params = JSON.parse(JSON.stringify(form.value));
      buttonLoading.value = true;
      saSysVersionInsert(params)
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
