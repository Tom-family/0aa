<template>
  <el-form ref="postRef" :model="form" :rules="rules" label-width="120px">
    <el-form-item label="测评标题" prop="relationName">
      <el-input v-model="form.relationName" placeholder="请输入测评标题" />
    </el-form-item>
    <el-form-item label="封面图" prop="smallScreenCoverUrl">
      <ImageUpload :limit="1" :updateType="17" v-model="form.smallScreenCoverUrl" @fileChange="changeSmallScreenCoverUrl" />
    </el-form-item>
    <el-form-item label="顺序" prop="srSort">
      <el-input-number v-model="form.srSort" controls-position="right" :min="0" style="width: 100%" />
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, reactive } from "vue";
const { proxy } = getCurrentInstance();
const emit = defineEmits(["closeDia"]);
const detailData = ref(false);
const data = reactive({
  oldForm: {},
  form: {
    sevenRelationId: "",
    relationName: "", //测评标题
    srSort: "",
  },
  rules: {
    relationName: [{ required: true, message: "请输入测评标题", trigger: "blur" }],
    srSort: [{ required: true, message: "请输入排序", trigger: "blur" }],
  },
});
const { form, rules, oldForm } = toRefs(data);

/** 提交按钮 */
async function submitForm() {
  proxy.$refs["postRef"].validate((valid) => {
    if (valid) {
    }
  });
}
</script>
