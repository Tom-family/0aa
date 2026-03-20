<template>
  <!-- 添加或修改岗位对话框 -->
  <el-dialog title="编辑" v-model="open" width="1050px" append-to-body :show-close="false" :close-on-click-modal="false" :draggable="true">
    <el-form ref="postRef" :model="form" :rules="rules" label-width="120px" :label-position="labelPosition">
      <el-form-item label="当前信息">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="name1" label="设备类型" show-overflow-tooltip align="center" />
          <el-table-column prop="name1" label="门店名称" show-overflow-tooltip align="center" />
          <el-table-column prop="name1" label="绑定类型" show-overflow-tooltip align="center" />
          <el-table-column prop="name1" label="绑定员工姓名" show-overflow-tooltip align="center" width="160" />
          <el-table-column prop="name1" label="绑定员工部门" show-overflow-tooltip align="center" width="160" />
          <el-table-column prop="name1" label="绑定员工电话" show-overflow-tooltip align="center" width="160" />
        </el-table>
      </el-form-item>
      <el-form-item label="更换绑定类型" prop="name3">
        <el-radio-group v-model="form.name3">
          <el-radio :value="1">绑定至部门池</el-radio>
          <el-radio :value="2">绑定至个人</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <choosePerson />

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
import choosePerson from "./choosePerson.vue";
const { proxy } = getCurrentInstance();
const emit = defineEmits(["closeDia"]);
const open = ref(true);
const buttonLoading = ref(false);
const detailData = ref(false);
const labelPosition = ref("top");
const tableData = ref([{ name1: 15555555555 }]);
const data = reactive({
  form: {
    name3: 1,
  },
  rules: {
    name3: [{ required: true, message: "请输入版本号", trigger: ["change", "blur"] }],
    versionUrl: [{ required: true, message: "请输入地址", trigger: ["change", "blur"] }],
  },
});
const { form, rules } = toRefs(data);

// 打开弹窗  数据回显
function show(data) {
  detailData.value = data;
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
