<template>
  <!-- 添加或修改岗位对话框 -->
  <el-dialog :title="title" v-model="open" width="600px" append-to-body :show-close="false" :close-on-click-modal="false" :draggable="true">
    <el-form ref="postRef" :model="form" :rules="rules" label-width="130px">
      <el-form-item label="关系名称" prop="sevenRelationId">
        <el-select v-model="form.sevenRelationId" placeholder="请选择关系名称" :disabled="detailData.setType == 'view'">
          <el-option v-for="item in plaseList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="关系阶段标题" prop="sbiStageTitle">
        <el-input v-model="form.sbiStageTitle" :disabled="detailData.setType == 'view'" placeholder="请输入关系阶段标题"/>
      </el-form-item>
      <el-form-item label="关系阶段引导词" prop="stageGuideWord">
        <el-input v-model="form.stageGuideWord" :disabled="detailData.setType == 'view'" placeholder="请输入关系阶段引导词" type="textarea" :autosize="{ minRows: 3, maxRows: 12 }"/>
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
import { saStageBasicInsert, saStageBasicUpdate,saSevenRelationSelectSaSevenName } from "@/api/chongQing/phase.js";
import { isSubmitData } from "@/utils/index.js";
const { proxy } = getCurrentInstance();
const emit = defineEmits(["closeDia"]);
const title = ref("新增关系阶段基础信息");
const open = ref(true);
const buttonLoading = ref(false);
const detailData = ref(false);
const plaseList=ref([])
const data = reactive({
  oldForm: {},
  form: {
    stageBasicInfoId: "",
    sevenRelationId: "", //关系名称
    sbiStageTitle: "",
    stageGuideWord:''
  },
  rules: {
    sevenRelationId: [{ required: true, message: "请输入关系名称", trigger: ["change", "blur"] }],
    sbiStageTitle: [{ required: true, message: "请输入阶段标题", trigger: ["change", "blur"] }],
    stageGuideWord: [{ required: true, message: "请输入关系阶段引导词", trigger: ["change", "blur"] }],
  },
});
const { form, rules, oldForm } = toRefs(data);

// 七大关系下拉
function getPlaseSelect() {
  saSevenRelationSelectSaSevenName().then((res) => {
    console.log(res);
    plaseList.value = res.data;
  });
}

// 打开弹窗  数据回显
function show(data) {
  detailData.value = data;
  // 标题
  if (data.setType == "edit") {
    title.value = "修改关系阶段基础信息";
  } else if (data.setType == "add") {
    title.value = "新增关系阶段基础信息";
  } else {
    title.value = "查看关系阶段基础信息";
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
      if (form.value.stageBasicInfoId) {
        if (isSubmitData(params, oldForm.value)) {
          proxy.$modal.msgWarning("未修改无法提交");
          return;
        }
        buttonLoading.value = true;
        saStageBasicUpdate(params)
          .then((res) => {
            proxy.$modal.msgSuccess("编辑成功");
            emit("closeDia", true);
          })
          .finally(() => {
            buttonLoading.value = false;
          });
      } else {
        buttonLoading.value = true;
        delete params.stageBasicInfoId;
        saStageBasicInsert(params)
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

getPlaseSelect()
// 暴露
defineExpose({ show });
</script>
