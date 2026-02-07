<template>
  <!-- 添加或修改岗位对话框 -->
  <el-dialog :title="title" v-model="open" width="600px" append-to-body :show-close="false" :close-on-click-modal="false" :draggable="true">
    <el-form ref="postRef" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="关系名称" prop="sevenRelationId">
        <el-select :disabled="detailData.setType == 'view'" v-model="form.sevenRelationId" placeholder="请选择关系名称">
          <el-option v-for="item in plaseList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="关系阶段名称" prop="siStageName">
        <el-input :disabled="detailData.setType == 'view'" v-model="form.siStageName" placeholder="请输入关系阶段名称" />
      </el-form-item>
      <el-form-item label="时间" prop="siPeriod">
        <el-input :disabled="detailData.setType == 'view'" v-model="form.siPeriod" placeholder="请输入时间" />
      </el-form-item>
      <el-form-item label="概括词" prop="siSummaryWord">
        <el-input :disabled="detailData.setType == 'view'" v-model="form.siSummaryWord" placeholder="请输入概括词" />
      </el-form-item>
      <el-form-item label="详细描述" prop="siDetailDescribe">
        <el-input :disabled="detailData.setType == 'view'" v-model="form.siDetailDescribe" placeholder="请输入详细描述" type="textarea" :autosize="{ minRows: 3, maxRows: 12 }" />
      </el-form-item>
      <el-form-item label="排序" prop="siSort">
        <el-input-number :disabled="detailData.setType == 'view'" v-model="form.siSort" controls-position="right" :min="0" style="width: 100%" />
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
import { saStageInfoInsert, saStageInfoUpdate, saSevenRelationSelectSaSevenName } from "@/api/chongQing/phase.js";
import { isSubmitData } from "@/utils/index.js";
const { proxy } = getCurrentInstance();
const emit = defineEmits(["closeDia"]);
const title = ref("新建关系");
const open = ref(true);
const buttonLoading = ref(false);
const detailData = ref(false);
const plaseList = ref([]);
const data = reactive({
  oldForm: {},
  form: {
    stageInfoId: "",
    sevenRelationId: "", //关系名称
    siStageName: "", //关系阶段名称
    siPeriod: "", //时间
    siSummaryWord: "", //概括词
    siDetailDescribe: "", //详细描述
    siSort: "", //排序
  },
  rules: {
    sevenRelationId: [{ required: true, message: "请选择关系名称", trigger: "change" }],
    siStageName: [{ required: true, message: "请输入关系阶段名称", trigger: ["change", "blur"] }],
    siPeriod: [{ required: true, message: "请输入时间", trigger: ["change", "blur"] }],
    siSummaryWord: [{ required: true, message: "请输入概括词", trigger: ["change", "blur"] }],
    siDetailDescribe: [{ required: true, message: "请输入详细描述", trigger: ["change", "blur"] }],
    siSort: [{ required: true, message: "请输入排序", trigger: ["change", "blur"] }],
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
      if (form.value.stageInfoId) {
        if (isSubmitData(params, oldForm.value)) {
          proxy.$modal.msgWarning("未修改无法提交");
          return;
        }
        buttonLoading.value = true;
        saStageInfoUpdate(params)
          .then((res) => {
            proxy.$modal.msgSuccess("编辑成功");
            emit("closeDia", true);
          })
          .finally(() => {
            buttonLoading.value = false;
          });
      } else {
        buttonLoading.value = true;
        delete params.stageInfoId;
        saStageInfoInsert(params)
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

getPlaseSelect();
// 暴露
defineExpose({ show });
</script>
