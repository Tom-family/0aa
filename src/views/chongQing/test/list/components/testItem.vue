<template>
  <div class="test-container">
    <el-form ref="postRef" :model="form" :rules="rules" label-width="90px">
      <div class="tips">提示：添加好题目后，请联系心通通部门确定答案与算分逻辑</div>
      <el-button type="primary" style="margin-bottom: 20px" @click="addMoreTest">批量添加题目</el-button>
      <div class="text-box" v-for="(item, index) in form.testTopicQuestionsList" :key="index">
        <el-form-item label="题目编号" :prop="`testTopicQuestionsList.${index}.saQuestionSequence`" :rules="{ required: true, message: '请输入题目标题', trigger: 'change' }">
          <div class="deldeta-box">
            <el-input style="width: 300px" v-model="item.saQuestionSequence" placeholder="请输入题目标题" disabled />
            <el-icon :size="18" :color="'red'" @click="deleteQuestion(index)" v-if="form.testTopicQuestionsList.length > 1">
              <Delete />
            </el-icon>
          </div>
        </el-form-item>
        <el-form-item label="题目内容" :prop="`testTopicQuestionsList.${index}.saQuestionName`" :rules="{ required: true, message: '请输入题目内容', trigger: 'change' }">
          <el-input v-model="item.saQuestionName" placeholder="请输入题目内容" />
        </el-form-item>
        <el-form-item label="选择类型" prop="saQuestionOption">
          <div class="type-box">
            <el-radio-group
              v-model="item.saQuestionOption"
              @change="
                (e) => {
                  changeType(e, index);
                }
              "
            >
              <el-radio :value="1" size="large">单选</el-radio>
              <el-radio :value="2" size="large">多选</el-radio>
              <el-radio :value="3" size="large">非必选</el-radio>
              <el-radio :value="4" size="large">填空</el-radio>
            </el-radio-group>
            <el-button class="add-option" type="primary" style="margin-bottom: 20px" @click="addAnswer(index)" v-if="item.saQuestionOption != 4">添加选项</el-button>
          </div>
        </el-form-item>
        <el-table :data="item.saQuestionAnswer" border style="width: 100%" :size="'small'" class="table-box" v-if="item.saQuestionOption != 4">
          <el-table-column prop="choose" align="center" label="选项" width="150" />
          <el-table-column align="center" label="内容" width="320">
            <template #default="scope">
              <el-form-item label="" :prop="`testTopicQuestionsList.${index}.saQuestionAnswer.${scope.$index}.content`" :rules="{ required: true, message: '请输入选项内容', trigger: 'change' }">
                <el-input v-model="scope.row.content" placeholder="请输入内容" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-button type="danger" :size="'small'" @click="deleteAnswer(index, scope.$index)" :disabled="item.saQuestionAnswer.length < 2">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="add-box">
        <img src="@/assets/images/add.svg" alt="" @click="addQuestion" />
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ElMessageBox } from "element-plus";
import { ref, reactive } from "vue";
const { proxy } = getCurrentInstance();
const emit = defineEmits(["closeDia"]);
const detailData = ref(false);
const data = reactive({
  oldForm: {},
  form: {
    testTopicQuestionsList: [
      {
        saQuestionSequence: 1,
        saQuestionName: "", //测评标题
        saQuestionOption: 1,
        saQuestionAnswer: [{ choose: "A", content: "" }],
      },
    ],
  },
  rules: {},
});
const { form, rules, oldForm } = toRefs(data);

// 批量添加
function addMoreTest() {
  ElMessageBox.prompt("请输入添加题目数量", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputPattern: /^(?:[1-9]|\d{2}|1\d{2}|200)$/,
    inputErrorMessage: "请输入小于200的正整数",
    inputPlaceholder: "请输入",
  }).then(({ value }) => {
    let length = form.value.testTopicQuestionsList.length;
    for (var i = 0; i < value; i++) {
      form.value.testTopicQuestionsList.push({
        saQuestionSequence: length + i + 1,
        saQuestionName: "", //测评标题
        saQuestionOption: 1,
        saQuestionAnswer: [{ choose: "A", content: "" }],
      });
    }
  });
}

// 删除题目
function deleteQuestion(index) {
  form.value.testTopicQuestionsList.splice(index, 1);
  // 题目标题排序
  form.value.testTopicQuestionsList.forEach((item, index) => {
    item.saQuestionSequence = index + 1;
  });
}

// 添加题目
function addQuestion() {
  let length = form.value.testTopicQuestionsList.length;
  form.value.testTopicQuestionsList.push({
    saQuestionSequence: length + 1,
    saQuestionName: "", //测评标题
    saQuestionOption: 1,
    saQuestionAnswer: [{ choose: "A", content: "" }],
  });
}

// 添加选项
function addAnswer(index) {
  let data = form.value.testTopicQuestionsList[index].saQuestionAnswer;
  let option = { choose: "", content: "" };
  option.choose = String.fromCharCode(65 + data.length);
  data.push(option);
}

// 删除选项
function deleteAnswer(index, index2) {
  let data = form.value.testTopicQuestionsList[index].saQuestionAnswer;
  if (data.length == 1) {
    return;
  }
  data.splice(index2, 1);
  data.forEach((item, index) => {
    // 将索引转换为字母：0->A, 1->B, 2->C...
    item.choose = String.fromCharCode(65 + index);
  });
}

const historyType = ref(1);
// 类型选择的change
function changeType(e, index) {
  if (e == 4) {
    form.value.testTopicQuestionsList[index].saQuestionAnswer = [];
  }
  if (historyType.value == 4) {
    if (e != 4) {
      form.value.testTopicQuestionsList[index].saQuestionAnswer = [{ choose: "A", content: "" }];
    }
  }
  historyType.value = e;
}

/** 提交按钮 */
function getQuestionsvalid() {
  return new Promise((resolve, reject) => {
    proxy.$refs["postRef"].validate((valid) => {
      if (valid) {
        let data = getData();
        resolve(data);
      } else {
        reject(false);
      }
    });
  });
}

// 提交数据变形处理
function getData() {
  let data = JSON.parse(JSON.stringify(form.value));
  data.testTopicQuestionsList.forEach((item, index) => {
    let result = Object.fromEntries(item.saQuestionAnswer.map((item) => [item.choose, item.content]));
    // 将数据 [{ choose: "A", content: "" }]变成{A: "1", B: "2"}格式
    item.saQuestionAnswer = JSON.stringify(result);
  });

  return data.testTopicQuestionsList;
}

defineExpose({ getQuestionsvalid });
</script>

<style lang="scss" scoped>
.test-container {
  width: 100%;
  .tips{
    color: red;
    font-size: 12px;
  }
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
    .el-icon {
      cursor: pointer;
    }
  }

  .type-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: -4px;
    .add-option {
      margin-bottom: 0 !important;
    }
  }

  .add-box {
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 40px;
      cursor: pointer;
      margin-right: 100px;
    }
  }
}
</style>
