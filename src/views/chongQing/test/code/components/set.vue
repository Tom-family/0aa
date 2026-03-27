<template>
  <!-- 添加或修改岗位对话框 -->
  <el-dialog title="编辑" v-model="open" width="1050px" append-to-body :show-close="false" :close-on-click-modal="false" :draggable="true">
    <el-form ref="postRef" :model="form" :rules="rules" label-width="120px" :label-position="labelPosition">
      <el-form-item label="当前信息">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="storeName" label="门店名称" show-overflow-tooltip align="center" />
          <el-table-column prop="bindType" label="绑定类型" show-overflow-tooltip align="center" />
          <el-table-column prop="workName" label="绑定员工姓名" show-overflow-tooltip align="center" width="190" />
          <el-table-column prop="divisionName" label="绑定员工部门" show-overflow-tooltip align="center" width="190" />
          <el-table-column prop="workAccnum" label="绑定员工电话" show-overflow-tooltip align="center" width="190" />
        </el-table>
      </el-form-item>
      <el-form-item label="更换绑定类型" prop="bindType">
        <el-radio-group v-model="form.bindType" @change="isSubmit=false">
          <el-radio :value="0">绑定至部门池</el-radio>
          <el-radio :value="1">绑定至个人</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div v-show="form.bindType == 1">
      <choosePerson :sendData="sendData" @closeDia="chooseData" />
    </div>
    <div class="tips" v-if="form.bindType == 1 && !form.jobNumber && isSubmit">请选择员工</div>

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
import { userAccNumAndWorkerBind } from "@/api/chongQing/test.js";
import { isSubmitData } from "@/utils/index.js";
import choosePerson from "./choosePerson.vue";
const { proxy } = getCurrentInstance();
const emit = defineEmits(["closeDia"]);
const open = ref(true);
const buttonLoading = ref(false);
const detailData = ref(false);
const labelPosition = ref("top");
const tableData = ref([]);
const sendData = ref({});
const isSubmit = ref(false);
const data = reactive({
  form: {
    bindType: 1,
    deviceId: undefined,
    jobNumber: undefined,
  },
  rules: {
    bindType: [{ required: true, message: "请输入版本号", trigger: ["change", "blur"] }],
    versionUrl: [{ required: true, message: "请输入地址", trigger: ["change", "blur"] }],
  },
});
const { form, rules } = toRefs(data);

// 打开弹窗  数据回显
function show(data) {
  form.value.deviceId = data.deviceId;
  sendData.value = data;
  tableData.value = [data];
  if (data.bindType == "部门池") {
    form.value.bindType = 0;
  } else {
    form.value.bindType = 1;
  }
}

/** 提交按钮 */
async function submitForm() {
  isSubmit.value = true;
  if (!form.value.jobNumber && form.value.bindType == 1) {
    return;
  }
  proxy.$refs["postRef"].validate((valid) => {
    if (valid) {
      let params = JSON.parse(JSON.stringify(form.value));
      if(params.bindType == 0){
        delete params.jobNumber;
      }
      delete params.bindType;
      buttonLoading.value = true;
      userAccNumAndWorkerBind(params)
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

function chooseData(data) {
  if (data) {
    form.value.jobNumber = data.jobNumber;
  } else {
    form.value.jobNumber = "";
  }
}

/** 取消按钮 */
function cancel() {
  emit("closeDia");
}
// 暴露
defineExpose({ show });
</script>

<style scoped>
.tips {
  color: red;
  font-size: 12px;
  margin-top: 4px;
}
</style>
