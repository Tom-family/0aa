<template>
  <!-- 添加或修改岗位对话框 -->
  <el-dialog :title="title" v-model="open" width="850px" append-to-body :show-close="false" :close-on-click-modal="false" :draggable="true">
    <el-form ref="postRef" :model="form" :rules="rules" label-width="140px">
      <el-form-item label="关系名称" prop="sevenRelationId">
        <el-select v-model="form.sevenRelationId" placeholder="请选择关系名称" @change="sevenRelationChange" :disabled="detailData.setType == 'view'">
          <el-option v-for="item in plaseList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="关系阶段名称" prop="stageInfoId">
        <el-select :disabled="detailData.setType == 'view'" v-model="form.stageInfoId" placeholder="请选择关系阶段名称">
          <el-option v-for="item in stageList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="关系走向" prop="tiTrendName">
        <el-select v-model="form.tiTrendName" placeholder="请选择关系走向" :disabled="detailData.setType == 'view'">
          <el-option v-for="item in TowardType" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="关系走向概括词" prop="tiSummaryWord">
        <el-input v-model="form.tiSummaryWord" placeholder="请输入时间" :disabled="detailData.setType == 'view'" />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="关系走向背景图片" prop="trendBackgroundImage">
            <ImageUpload :disabled="detailData.setType == 'view'" :limit="1" :updateType="17" v-model="form.trendBackgroundImage" @fileChange="changeSmallScreenCoverUrl1" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="漫画图片1" prop="detailImageA">
            <ImageUpload :disabled="detailData.setType == 'view'" :limit="1" :updateType="17" v-model="form.detailImageA" @fileChange="changeSmallScreenCoverUrl2" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="漫画图片2" prop="detailImageB">
            <ImageUpload :disabled="detailData.setType == 'view'" :limit="1" :updateType="17" v-model="form.detailImageB" @fileChange="changeSmallScreenCoverUrl3" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="漫画图片3" prop="detailImageC">
            <ImageUpload :disabled="detailData.setType == 'view'" :limit="1" :updateType="17" v-model="form.detailImageC" @fileChange="changeSmallScreenCoverUrl4" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="详细分析" prop="tiDetailDescribe">
        <el-input v-model="form.tiDetailDescribe" placeholder="请输入详细分析" type="textarea" :autosize="{ minRows: 3, maxRows: 12 }" :disabled="detailData.setType == 'view'" />
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
import { saTrendInsert, saTrendUpdate, saSevenRelationSelectSaSevenName, selectSiStageName } from "@/api/chongQing/phase.js";
import { isSubmitData } from "@/utils/index.js";
import { TowardType } from "@/utils/enumeration.js";
const { proxy } = getCurrentInstance();
const emit = defineEmits(["closeDia"]);
const title = ref("新建关系走向");
const open = ref(true);
const buttonLoading = ref(false);
const detailData = ref(false);
const plaseList = ref([]);
const stageList = ref([]);
const data = reactive({
  oldForm: {},
  form: {
    trendInfoId: "",
    sevenRelationId: "", //关系名称
    stageInfoId: "", //关系阶段名称
    tiTrendName: "", //关系走向
    tiSummaryWord: "", //关系走向概括词
    trendBackgroundImage: "", //关系走向背景图
    detailImageA: "", //漫画图片1
    detailImageB: "", //漫画图片2
    detailImageC: "", //漫画图片3
    tiDetailDescribe: "", //详细分析
  },
  rules: {
    sevenRelationId: [{ required: true, message: "请选择关系名称", trigger: "change" }],
    stageInfoId: [{ required: true, message: "请选择关系阶段名称", trigger: "change" }],
    tiTrendName: [{ required: true, message: "请选择关系走向", trigger: "blur" }],
    tiSummaryWord: [{ required: true, message: "请输关系走向概括词", trigger: "blur" }],
    trendBackgroundImage: [{ required: true, message: "请选择关系走向背景图", trigger: "change" }],
    detailImageA: [{ required: true, message: "请选择漫画图片1", trigger: "change" }],
    detailImageB: [{ required: true, message: "请选择漫画图片2", trigger: "change" }],
    detailImageC: [{ required: true, message: "请选择漫画图片3", trigger: "change" }],
    tiDetailDescribe: [{ required: true, message: "请输入详细分析", trigger: "blur" }],
  },
});
const { form, rules, oldForm } = toRefs(data);

// 七大关系下拉
function getPlaseSelect() {
  saSevenRelationSelectSaSevenName().then((res) => {
    plaseList.value = res.data;
  });
}

// 打开弹窗  数据回显
function show(data) {
  detailData.value = data;
  // 标题
  if (data.setType == "edit") {
    title.value = "修改关系走向";
  } else if (data.setType == "add") {
    title.value = "新增关系走向";
  } else {
    title.value = "查看关系走向";
  }
  if (data.setType != "add") {
    for (let key in form.value) {
      form.value[key] = data[key];
    }
    getStageSelect();
  }
  oldForm.value = JSON.parse(JSON.stringify(form.value));
}

/** 提交按钮 */
async function submitForm() {
  proxy.$refs["postRef"].validate((valid) => {
    if (valid) {
      let params = JSON.parse(JSON.stringify(form.value));
      if (form.value.trendInfoId) {
        if (isSubmitData(params, oldForm.value)) {
          proxy.$modal.msgWarning("未修改无法提交");
          return;
        }
        buttonLoading.value = true;
        saTrendUpdate(params)
          .then((res) => {
            proxy.$modal.msgSuccess("编辑成功");
            emit("closeDia", true);
          })
          .finally(() => {
            buttonLoading.value = false;
          });
      } else {
        buttonLoading.value = true;
        delete params.trendInfoId;
        saTrendInsert(params)
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

// 图片选择时  验证关系走向背景图片
function changeSmallScreenCoverUrl1() {
  proxy.$refs["postRef"].validateField("trendBackgroundImage");
}

// 图片选择时  验证漫画图片1
function changeSmallScreenCoverUrl2() {
  proxy.$refs["postRef"].validateField("detailImageA");
}

// 图片选择时  验证漫画图片2
function changeSmallScreenCoverUrl3() {
  proxy.$refs["postRef"].validateField("detailImageB");
}

// 图片选择时  验证漫画图片3
function changeSmallScreenCoverUrl4() {
  proxy.$refs["postRef"].validateField("detailImageC");
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
