<template>
  <!-- 添加或修改岗位对话框 -->
  <el-dialog :title="title" v-model="open" width="600px" append-to-body :show-close="false" :close-on-click-modal="false" :draggable="true">
    <el-form ref="postRef" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="关系名称" prop="postName">
        <el-input v-model="form.postName" placeholder="请输入岗位名称" />
      </el-form-item>
      <el-form-item label="小屏关系卡片" prop="postCode">
        <el-input v-model="form.postCode" placeholder="请输入编码名称" />
      </el-form-item>
      <el-form-item label="大屏关系卡片" prop="postCode">
        <el-input v-model="form.postCode" placeholder="请输入编码名称" />
      </el-form-item>
      <el-form-item label="岗位顺序" prop="postSort">
        <el-input-number v-model="form.postSort" controls-position="right" :min="0" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from "vue";
const { proxy } = getCurrentInstance();
const emit = defineEmits(["closeDia"]);
const title = ref("新建关系");
const open = ref(true);
const data = reactive({
  form: {
    postName: "",
    postCode: "",
    postSort: "",
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    postCode: undefined,
    postName: undefined,
    status: undefined,
  },
  rules: {
    postName: [{ required: true, message: "岗位名称不能为空", trigger: "blur" }],
    postCode: [{ required: true, message: "岗位编码不能为空", trigger: "blur" }],
    postSort: [{ required: true, message: "岗位顺序不能为空", trigger: "blur" }],
  },
});
const { form, rules } = toRefs(data);

// 打开弹窗  数据回显
function show(data) {
  console.log(data);
  // 标题
  if (data.setType == "edit") {
    title.value = "修改关系";
  } else if (data.setType == "add") {
    title.value = "新建关系";
  } else {
    title.value = "查看关系";
  }
  if (data.setType != "add") {
    for (let key in form.value) {
      form.value[key] = data[key];
    }
  }
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["postRef"].validate((valid) => {
    if (valid) {
      emit("closeDia", true);
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
