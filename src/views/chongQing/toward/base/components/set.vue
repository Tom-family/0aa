<template>
  <!-- 添加或修改岗位对话框 -->
  <el-dialog :title="title" v-model="open" width="600px" append-to-body :show-close="false" :close-on-click-modal="false" :draggable="true">
    <el-form ref="postRef" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="关系名称" prop="sevenRelationId">
        <el-select :disabled="detailData.setType == 'view'" v-model="form.sevenRelationId" placeholder="请选择关系名称" @change="sevenRelationChange">
          <el-option v-for="item in plaseList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="关系阶段名称" prop="stageInfoId">
        <el-select :disabled="detailData.setType == 'view'" v-model="form.stageInfoId" placeholder="请选择关系阶段名称">
          <el-option v-for="item in stageList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="关系走向标题" prop="tbiTrendTitle">
        <el-input :disabled="detailData.setType == 'view'" v-model="form.tbiTrendTitle" placeholder="请输入关系走向标题" />
      </el-form-item>
      <el-form-item label="关系走向引导词" prop="trendGuideWord">
        <el-input :disabled="detailData.setType == 'view'" v-model="form.trendGuideWord" placeholder="请输入关系走向引导词" />
      </el-form-item>
      <el-form-item label="关系阶段跳转引导词" prop="trendChangePagePrompt">
        <el-input :disabled="detailData.setType == 'view'" v-model="form.trendChangePagePrompt" placeholder="请输入关系阶段跳转引导词" />
      </el-form-item>
      <el-form-item label="心通通宣传词" prop="xttSlogan">
        <el-input :disabled="detailData.setType == 'view'" v-model="form.xttSlogan" placeholder="请输入心通通宣传词" type="textarea" :autosize="{ minRows: 3, maxRows: 12 }" />
      </el-form-item>
      <el-form-item label="Semmi分析标题" prop="semmiAnalyzeTitle">
        <el-input :disabled="detailData.setType == 'view'" v-model="form.semmiAnalyzeTitle" placeholder="请输入Semmi分析标题" />
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
import { saTrendBasicInsert, saTrendBasicUpdate, saSevenRelationSelectSaSevenName, selectSiStageName } from "@/api/chongQing/phase.js";
import { isSubmitData } from "@/utils/index.js";
const { proxy } = getCurrentInstance();
const emit = defineEmits(["closeDia"]);
const title = ref("新建关系");
const open = ref(true);
const buttonLoading = ref(false);
const detailData = ref(false);
const plaseList = ref([]);
const stageList = ref([]);
const data = reactive({
  oldForm: {},
  form: {
    trendBasicInfoId: "",
    sevenRelationId: "", //关系名称
    stageInfoId: "", //关系阶段名称
    tbiTrendTitle: "", //关系走向标题
    trendGuideWord: "", //关系走向引导词
    trendChangePagePrompt: "", //关系阶段跳转引导词
    xttSlogan: "", //心通通宣传词
    semmiAnalyzeTitle: "", //Semmi分析标题
  },
  rules: {
    sevenRelationId: [{ required: true, message: "请选择关系名称", trigger: "change" }],
    stageInfoId: [{ required: true, message: "请选择关系阶段名称", trigger: "change" }],
    tbiTrendTitle: [{ required: true, message: "请输入关系走向标题", trigger: "blur" }],
    trendGuideWord: [{ required: true, message: "请输入关系走向引导词", trigger: "blur" }],
    trendChangePagePrompt: [{ required: true, message: "请输入关系阶段跳转引导词", trigger: "blur" }],
    xttSlogan: [{ required: true, message: "请输入心通通宣传词", trigger: "blur" }],
    semmiAnalyzeTitle: [{ required: true, message: "请输入Semmi分析标题", trigger: "blur" }],
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
    title.value = "修改关系走向基础信息";
  } else if (data.setType == "add") {
    title.value = "新增关系走向基础信息";
  } else {
    title.value = "查看关系走向基础信息";
  }
  if (data.setType != "add") {
    for (let key in form.value) {
      form.value[key] = data[key];
    }
    getStageSelect()
  }
  oldForm.value = JSON.parse(JSON.stringify(form.value));
}

/** 提交按钮 */
async function submitForm() {
  proxy.$refs["postRef"].validate((valid) => {
    if (valid) {
      let params = JSON.parse(JSON.stringify(form.value));
      if (form.value.trendBasicInfoId) {
        if (isSubmitData(params, oldForm.value)) {
          proxy.$modal.msgWarning("未修改无法提交");
          return;
        }
        buttonLoading.value = true;
        saTrendBasicUpdate(params)
          .then((res) => {
            proxy.$modal.msgSuccess("编辑成功");
            emit("closeDia", true);
          })
          .finally(() => {
            buttonLoading.value = false;
          });
      } else {
        buttonLoading.value = true;
        delete params.trendBasicInfoId;
        saTrendBasicInsert(params)
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

// 关系名称change
function sevenRelationChange() {
  getStageSelect();
}

// 关系阶段名称下拉
function getStageSelect() {
  selectSiStageName({ sevenRelationId: form.value.sevenRelationId }).then((res) => {
    stageList.value = res.data;
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
