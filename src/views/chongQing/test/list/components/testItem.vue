<template>
  <div class="test-container">
    <el-form ref="postRef" :model="form" :rules="rules" label-width="90px">
      <el-button type="primary" icon="Edit" style="margin-bottom: 20px">批量添加题目</el-button>
      <div class="text-box" v-for="(item, index) in form.testTopioQuestionsList" :key="index">
        <el-form-item label="题目编号" :prop="`testTopioQuestionsList.${index}.questionSequence`" :rules="{ required: true, message: '请输入', trigger: 'change' }">
          <el-input v-model="item.questionSequence" placeholder="请输入测评标题" />
        </el-form-item>
        <el-form-item label="题目内容" :prop="`testTopioQuestionsList.${index}.questionName`" :rules="{ required: true, message: '请输入', trigger: 'change' }">
          <el-input v-model="item.questionName" placeholder="请输入测评标题" />
        </el-form-item>
        <el-form-item label="选择类型" prop="questionOption">
          <el-radio-group v-model="item.questionOption">
            <el-radio :value="1" size="large">单选</el-radio>
            <el-radio :value="2" size="large">多选</el-radio>
            <el-radio :value="3" size="large">非必选</el-radio>
            <el-radio :value="4" size="large">填空</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-table :data="item.questionAnswer" border style="width: 100%" :size="'small'">
          <el-table-column prop="name1" align="center" label="选项" width="150" />
          <el-table-column prop="name2" align="center" label="内容" width="300">
            <template #default="scope">
              <el-input v-model="scope.row.content" placeholder="请输入内容" />
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default>
              <el-button type="danger" :size="'small'">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-button type="primary" icon="Edit" @click="addQuestion">添加题目</el-button>
      <el-button type="primary" icon="Edit" @click="submitForm">保存</el-button>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
const { proxy } = getCurrentInstance();
const emit = defineEmits(["closeDia"]);
const detailData = ref(false);
const data = reactive({
  oldForm: {},
  form: {
    testTopioQuestionsList: [
      {
        questionSequence: "",
        questionName: "", //测评标题
        questionOption: 1,
        questionAnswer: [
          { name1: "选项1", name2: "内容1", title: "A", content: "内容1" },
          { name1: "选项2", name2: "内容2", title: "B", content: "内容2" },
        ],
      },
      {
        questionSequence: "",
        questionName: "", //测评标题
        questionOption: 1,
        questionAnswer: [
          { name1: "选项1", name2: "内容1", title: "A", content: "内容1" },
          { name1: "选项2", name2: "内容2", title: "B", content: "内容2" },
        ],
      },
    ],
  },
  rules: {
    // questionSequence: [{ required: true, message: "请输入测评标题", trigger: "blur" }],
    // srSort: [{ required: true, message: "请输入排序", trigger: "blur" }],
  },
});
const { form, rules, oldForm } = toRefs(data);

// 添加题目
function addQuestion() {
  form.value.testTopioQuestionsList.push({
    questionSequence: "",
    questionName: "", //测评标题
    questionOption: 1,
    questionAnswer: [],
  });
}

/** 提交按钮 */
async function submitForm() {
  proxy.$refs["postRef"].validate((valid) => {
    if (valid) {
    }
  });
}
</script>

<style lang="scss" scoped>
.test-container {
  width: 100%;
  .el-form-item {
    margin-bottom: 12px;
  }
  .text-box {
    &:first-child {
      margin-top: 32px;
    }
    width: 100%;
    // margin-top: 32px;
    border-radius: 20px;
    margin-bottom: 20px;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.12);
    padding: 25px 30px 20px 20px;
  }
}
</style>
