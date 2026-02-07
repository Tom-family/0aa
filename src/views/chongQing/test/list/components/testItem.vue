<template>
  <div class="test-container">
    <el-form ref="postRef" :model="form" :rules="rules" label-width="90px">
      <el-button type="primary" icon="Edit" style="margin-bottom: 20px">批量添加题目</el-button>
      <div class="text-box" v-for="(item, index) in form.testTopioQuestionsList" :key="index">
        <el-form-item label="题目编号" :prop="`testTopioQuestionsList.${index}.questionSequence`" :rules="{ required: true, message: '请输入题目标题', trigger: 'change' }">
          <div class="deldeta-box">
            <el-input style="width:300px" v-model="item.questionSequence" placeholder="请输入题目标题" />
            <el-icon :size="18" :color="'red'" @click="deleteQuestion(index)">
              <Delete />
            </el-icon>
          </div>
        </el-form-item>
        <el-form-item label="题目内容" :prop="`testTopioQuestionsList.${index}.questionName`" :rules="{ required: true, message: '请输入题目内容', trigger: 'change' }">
          <el-input v-model="item.questionName" placeholder="请输入题目内容" />
        </el-form-item>
        <el-form-item label="选择类型" prop="questionOption">
          <div class="type-box">
            <el-radio-group v-model="item.questionOption">
              <el-radio :value="1" size="large">单选</el-radio>
              <el-radio :value="2" size="large">多选</el-radio>
              <el-radio :value="3" size="large">非必选</el-radio>
              <el-radio :value="4" size="large">填空</el-radio>
            </el-radio-group>
            <el-button class="add-option" type="primary" icon="Edit" style="margin-bottom: 20px" @click="addAnswer(index)">添加选项</el-button>
          </div>
        </el-form-item>
        <el-table :data="item.questionAnswer" border style="width: 100%" :size="'small'" class="table-box">
          <el-table-column prop="name1" align="center" label="选项" width="150" />
          <el-table-column align="center" label="内容" width="300">
            <template #default="scope">
              <el-form-item label="" :prop="`testTopioQuestionsList.${index}.questionAnswer.${scope.$index}.name2`" :rules="{ required: true, message: '请输入选项内容', trigger: 'change' }">
                <el-input v-model="scope.row.name2" placeholder="请输入内容" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-button type="danger" :size="'small'" @click="deleteAnswer(index, scope.$index)">删除</el-button>
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
          { name1: "A", name2: "" },
          { name1: "B", name2: "" },
          { name1: "C", name2: "" },
          { name1: "D", name2: "" },
          { name1: "E", name2: "" },
        ],
      },
      {
        questionSequence: "",
        questionName: "", //测评标题
        questionOption: 1,
        questionAnswer: [
          { name1: "A", name2: "" },
          { name1: "B", name2: "内" },
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

// 删除题目
function deleteQuestion(index){
  form.value.testTopioQuestionsList.splice(index, 1);
}

// 添加题目
function addQuestion() {
  form.value.testTopioQuestionsList.push({
    questionSequence: "",
    questionName: "", //测评标题
    questionOption: 1,
    questionAnswer: [],
  });
}

// 添加选项
function addAnswer(index) {
  let data = form.value.testTopioQuestionsList[index].questionAnswer;
  let option = { name1: "", name2: "" };
  option.name1 = String.fromCharCode(65 + data.length + 1);
  data.push(option);
}

// 删除选项
function deleteAnswer(index, index2) {
  let data = form.value.testTopioQuestionsList[index].questionAnswer;
  data.splice(index2, 1);
  data.forEach((item, index) => {
    // 将索引转换为字母：0->A, 1->B, 2->C...
    item.name1 = String.fromCharCode(65 + index);
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
    margin-bottom: 18px;
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

  .table-box {
    .el-form-item {
      margin-bottom: 0;
    }
  }

  .deldeta-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    .el-icon{
      cursor: pointer;
    }
  }

  .type-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    .add-option {
      margin-bottom: 0 !important;
    }
  }
}
</style>
