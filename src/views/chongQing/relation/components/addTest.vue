<template>
  <!-- 添加或编辑岗位对话框 -->
  <el-dialog :title="title" v-model="open" width="600px" append-to-body :show-close="false" :close-on-click-modal="false" :draggable="true">
    <div class="choose-box">
      <el-button type="primary" @click="tapTest" v-if="detailData.setType != 'view'">{{ form.storeTestId ? "更换测试题" : "绑定测试题" }}</el-button>
    </div>
    <el-table size="small" :data="tableData" border style="width: 100%; margin: 20px 0">
      <el-table-column prop="saTestTopic" align="center" label="测评标题" show-overflow-tooltip />
      <el-table-column prop="saTestState" align="center" label="状态" width="100" show-overflow-tooltip>
        <template #default="scope">
          <el-tag type="danger" v-if="scope.row.saTestState == 2">{{ GetLabelByValue(TestStatus, scope.row.saTestState) }}</el-tag>
          <el-tag type="success" v-else>{{ GetLabelByValue(TestStatus, scope.row.saTestState) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="saTestCreateTime" align="center" label="创建时间" width="140" show-overflow-tooltip />
    </el-table>
    <div class="tips" v-if="!form.storeTestId && isSure">请选择测试题</div>
    <el-form ref="postRef" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="小屏引导词" prop="smallScreenGuidance">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 12 }" :disabled="detailData.setType == 'view'" v-model="form.smallScreenGuidance" placeholder="请输入岗位名称" />
      </el-form-item>
      <el-form-item label="大屏引导词" prop="largeScreenGuidance">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 12 }" :disabled="detailData.setType == 'view'" v-model="form.largeScreenGuidance" placeholder="请输入岗位名称" />
      </el-form-item>
      <el-form-item label="宣传图片" prop="promoImageUrl">
        <ImageUpload :disabled="detailData.setType == 'view'" :limit="1" :updateType="17" v-model="form.promoImageUrl" @fileChange="changePromoImageUrl" />
      </el-form-item>
      <el-form-item label="排序" prop="brtSort">
        <el-input-number :disabled="detailData.setType == 'view'" v-model="form.brtSort" controls-position="right" :min="0" style="width: 100%" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm" :loading="buttonLoading" v-if="detailData.setType != 'view'">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
  <chooseTest ref="chooseTestRef" v-if="chooseTestDom" @closeDia="chooseClose" />
</template>

<script setup>
import { ref, reactive } from "vue";
import { updateSaTestTopic, insertSaTestTopic } from "@/api/chongQing/test.js";
import { TestStatus, GetLabelByValue } from "@/utils/enumeration.js";
import { isSubmitData } from "@/utils/index.js";
import chooseTest from "./chooseTest.vue";
const { proxy } = getCurrentInstance();
const emit = defineEmits(["closeDia"]);
const open = ref(true);
const title = ref("添加测试题");
const buttonLoading = ref(false);
const detailData = ref(false);
const chooseTestRef = useTemplateRef("chooseTestRef");
const chooseTestDom = ref(false);
const isSure = ref(false);
const tableData = ref([]);
const data = reactive({
  oldForm: {},
  form: {
    bindRelationTestId: "",
    sevenRelationId: "",
    storeTestId: "", //测试题id
    smallScreenGuidance: "", //小屏引导词
    largeScreenGuidance: "", //大屏引导词
    promoImageUrl: "", //宣传图片
    brtSort: "",
  },
  rules: {
    smallScreenGuidance: [{ required: true, message: "请输入小屏引导词", trigger: ["change", "blur"] }],
    largeScreenGuidance: [{ required: true, message: "请输入大屏引导词", trigger: ["change", "blur"] }],
    promoImageUrl: [{ required: true, message: "请选择宣传图片", trigger: ["change", "blur"] }],
    brtSort: [{ required: true, message: "请输入排序", trigger: ["change", "blur"] }],
  },
});
const { form, rules, oldForm } = toRefs(data);

// 图片选择时  验证小屏关系卡片
function changePromoImageUrl(file) {
  proxy.$refs["postRef"].validateField("promoImageUrl");
}

// 打开弹窗  数据回显
function show(data) {
  detailData.value = data;
  // 标题
  if (data.setType == "edit") {
    title.value = "编辑测试题";
  } else if (data.setType == "add") {
    title.value = "新增测试题";
  } else {
    title.value = "查看测试题";
  }
  if (data.setType != "add") {
    for (let key in form.value) {
      form.value[key] = data[key];
    }
    tableData.value = [
      {
        saTestTopic: data.saTestTopic,
        saTestState: data.saTestState,
        saTestCreateTime: data.saTestCreateTime,
      },
    ];
  }
  form.value.sevenRelationId = data.sevenRelationId;
  oldForm.value = JSON.parse(JSON.stringify(form.value));
}

// 选择测试题
async function tapTest() {
  let data = {
    storeTestId: form.value.storeTestId,
    sevenRelationId: form.value.sevenRelationId,
    bindStoreTestId: detailData.value.storeTestId, //真正关系绑定的测试题id
  };
  chooseTestDom.value = true;
  await nextTick();
  chooseTestRef.value?.show(data);
}

function chooseClose(data) {
  if (data) {
    tableData.value = [data];
    form.value.storeTestId = data.saTestId;
  }
  chooseTestDom.value = false;
}

/** 提交按钮 */
async function submitForm() {
  proxy.$refs["postRef"].validate((valid) => {
    isSure.value = true;
    if (!form.value.storeTestId) {
      return;
    }
    if (valid) {
      let params = JSON.parse(JSON.stringify(form.value));
      if (form.value.bindRelationTestId) {
        if (isSubmitData(params, oldForm.value)) {
          proxy.$modal.msgWarning("未修改无法提交");
          return;
        }
        buttonLoading.value = true;
        updateSaTestTopic(params)
          .then((res) => {
            proxy.$modal.msgSuccess("编辑成功");
            emit("closeDia", true);
          })
          .finally(() => {
            buttonLoading.value = false;
          });
      } else {
        buttonLoading.value = true;
        delete params.bindRelationTestId;
        insertSaTestTopic(params)
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
// 暴露
defineExpose({ show });
</script>
<style scoped lang="scss">
.choose-box {
  // text-align: right
}

.tips {
  color: #f56c6c;
  font-size: 12px;
  margin-top: -15px;
  margin-bottom: 15px;
}
</style>
