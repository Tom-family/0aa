<template>
  <!-- 添加或修改岗位对话框 -->
  <el-dialog :title="title" v-model="open" width="800px" append-to-body :show-close="false" :close-on-click-modal="false" :draggable="true">
    <el-form ref="postRef" :model="form" :rules="rules" label-width="140px">
      <el-form-item label="关系名称" prop="relationName">
        <el-select v-model="form.relationName" placeholder="请选择关系名称">
          <el-option v-for="item in plaseList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="关系阶段名称" prop="srSort">
        <el-select v-model="form.srSort" placeholder="请选择关系阶段名称">
          <el-option v-for="item in plaseList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="关系走向" prop="work1">
        <el-select v-model="form.work1" placeholder="请选择关系走向">
          <el-option v-for="item in plaseList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="关系走向概括词" prop="time">
        <el-input v-model="form.time" placeholder="请输入时间" />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="关系走向背景图片" prop="work3">
            <ImageUpload :disabled="detailData.setType == 'view'" :limit="1" :updateType="17" v-model="form.work3" @fileChange="changeSmallScreenCoverUrl1" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="漫画图片1" prop="work4">
            <ImageUpload :disabled="detailData.setType == 'view'" :limit="1" :updateType="17" v-model="form.work4" @fileChange="changeSmallScreenCoverUrl2" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="漫画图片2" prop="work5">
            <ImageUpload :disabled="detailData.setType == 'view'" :limit="1" :updateType="17" v-model="form.work5" @fileChange="changeSmallScreenCoverUrl3" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="漫画图片3" prop="work6">
            <ImageUpload :disabled="detailData.setType == 'view'" :limit="1" :updateType="17" v-model="form.work6" @fileChange="changeSmallScreenCoverUrl4" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="详细分析" prop="work2">
        <el-input v-model="form.work2" placeholder="请输入详细分析" type="textarea" :autosize="{ minRows: 3, maxRows: 12 }" />
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
import { saSevenRelationSaSevenInsert, saSevenRelationSaSevenUpdate, saSevenRelationSelectSaSevenName } from "@/api/chongQing/phase.js";
import { isSubmitData } from "@/utils/index.js";
const { proxy } = getCurrentInstance();
const emit = defineEmits(["closeDia"]);
const title = ref("新建关系走向");
const open = ref(true);
const buttonLoading = ref(false);
const detailData = ref(false);
const plaseList = ref([]);
const data = reactive({
  oldForm: {},
  form: {
    sevenRelationId: "",
    relationName: "", //关系名称
    srSort: "", //关系阶段名称
    work1: "", //关系走向
    time: "", //关系走向概括词
    work3: "", //关系走向背景图
    work4: "", //漫画图片1
    work5: "", //漫画图片2
    work6: "", //漫画图片3
    work2: "", //详细分析
  },
  rules: {
    relationName: [{ required: true, message: "请选择关系名称", trigger: "change" }],
    srSort: [{ required: true, message: "请选择关系阶段名称", trigger: "change" }],
    work1: [{ required: true, message: "请选择关系走向", trigger: "blur" }],
    time: [{ required: true, message: "请输关系走向概括词", trigger: "blur" }],
    work3: [{ required: true, message: "请选择关系走向背景图", trigger: "change" }],
    work4: [{ required: true, message: "请选择漫画图片1", trigger: "change" }],
    work5: [{ required: true, message: "请选择漫画图片2", trigger: "change" }],
    work6: [{ required: true, message: "请选择漫画图片3", trigger: "change" }],
    work2: [{ required: true, message: "请输入详细分析", trigger: "blur" }],
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

// 图片选择时  验证关系走向背景图片
function changeSmallScreenCoverUrl1() {
  proxy.$refs["postRef"].validate("work3");
}

// 图片选择时  验证漫画图片1
function changeSmallScreenCoverUrl2() {
  proxy.$refs["postRef"].validate("work4");
}

// 图片选择时  验证漫画图片2
function changeSmallScreenCoverUrl3() {
  proxy.$refs["postRef"].validate("work5");
}

// 图片选择时  验证漫画图片3
function changeSmallScreenCoverUrl4() {
  proxy.$refs["postRef"].validate("work6");
}

/** 取消按钮 */
function cancel() {
  emit("closeDia");
}

getPlaseSelect();
// 暴露
defineExpose({ show });
</script>
