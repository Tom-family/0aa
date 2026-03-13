<template>
  <!-- 添加或修改岗位对话框 -->
  <el-dialog :title="title" v-model="open" width="600px" append-to-body :show-close="false" :close-on-click-modal="false" :draggable="true">
    <el-form ref="postRef" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="设备标识符" prop="deviceIdentifier">
        <el-input v-model="form.deviceIdentifier" disabled placeholder="请输入设备标识符" />
      </el-form-item>
      <el-form-item label="设备类型" prop="deviceStyle">
        <el-radio-group v-model="form.deviceStyle" :disabled="detailData.setType == 'view'">
          <el-radio :value="1">小屏软件</el-radio>
          <el-radio :value="2">大屏软件</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="门店名称" prop="storeName">
        <el-input v-model="form.storeName" disabled placeholder="请输入门店名称" />
      </el-form-item>
      <el-form-item label="申请时间" prop="saResultCreateTime">
        <el-input v-model="form.saResultCreateTime" disabled placeholder="请输入申请时间" />
      </el-form-item>
      <el-form-item label="审核时间" prop="name5">
        <el-input v-model="form.name5" disabled placeholder="请输入审核时间" />
      </el-form-item>
      <el-form-item label="状态" prop="ddeviceState">
        <el-radio-group v-model="form.ddeviceState" disabled>
          <el-radio :value="1">待审核</el-radio>
          <el-radio :value="2">已通过</el-radio>
          <el-radio :value="3">已拒绝</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="deviceRemark">
        <el-input v-model="form.deviceRemark" placeholder="请输入备注" type="textarea" :disabled="detailData.setType == 'view'" :autosize="{ minRows: 3, maxRows: 12 }" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm" :loading="buttonLoading" v-if="detailData.setType != 'view'">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from "vue";
import { saDeviceUpdate } from "@/api/chongQing/system.js";
import { isSubmitData } from "@/utils/index.js";
const { proxy } = getCurrentInstance();
const emit = defineEmits(["closeDia"]);
const title = ref("查看详情");
const open = ref(true);
const buttonLoading = ref(false);
const detailData = ref(false);
const data = reactive({
  oldForm: {},
  form: {
    deviceId: "",
    deviceIdentifier: "",
    deviceStyle: undefined,
    storeName: "",
    saResultCreateTime: "",
    name5: "",
    ddeviceState: "",
    deviceRemark: "",
  },
  rules: {},
});
const { form, rules, oldForm } = toRefs(data);

// 打开弹窗  数据回显
function show(data) {
  detailData.value = data;
  // 标题
  if (data.setType == "edit") {
    title.value = "编辑";
  } else {
    title.value = "查看详情";
  }
  if (data.setType != "add") {
    for (let key in form.value) {
      form.value[key] = data[key];
    }
  }
  oldForm.value = JSON.parse(JSON.stringify(form.value));
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
      let params = {
        deviceId: form.value.deviceId,
        deviceRemark: form.value.deviceRemark,
        deviceStyle: form.value.deviceStyle,
      };
      if (form.value.deviceStyle == oldForm.value.deviceStyle && form.value.deviceRemark == oldForm.value.deviceRemark) {
        proxy.$modal.msgWarning("未修改无法提交");
        return;
      }
      buttonLoading.value = true;

      saDeviceUpdate(params)
        .then((res) => {
          proxy.$modal.msgSuccess("编辑成功");
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
