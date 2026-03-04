<template>
  <!-- 添加或修改岗位对话框 -->
  <el-dialog title="绑定用户" v-model="open" width="500px" append-to-body :show-close="false" :close-on-click-modal="false" :draggable="true">
    <div class="dia-box">
      <el-form ref="postRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="用户手机号" prop="userAccNum">
          <el-row :gutter="10" style="width: 100%">
            <el-col :span="16">
              <el-input v-model="form.userAccNum" placeholder="请输入用户手机号" @input="changPhone" />
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="search" :loading="searchLoading">搜索</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="测试用户" prop="userName">
          <el-input v-model="form.userName" disabled placeholder="请输入测试用户" />
        </el-form-item>
      </el-form>
    </div>
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
import { accNumSelectUser, userAccNumAndUserNameBind } from "@/api/chongQing/test.js";
const { proxy } = getCurrentInstance();
const emit = defineEmits(["closeDia"]);
const open = ref(true);
const buttonLoading = ref(false);
const searchLoading = ref(false);
const detailData = ref(false);
const userInfo = ref({}); // 用户信息
const data = reactive({
  form: {
    userAccNum: "", //用户手机号
    userName: "", //测试用户
  },
  rules: {
    // userAccNum: [{ required: true, message: "请输入用户手机号", trigger: ["change", "blur"] }],
    userName: [{ required: true, message: "测试用户不能为空", trigger: ["change", "blur"] }],
  },
});
const { form, rules } = toRefs(data);

// 手机号只能输入数字
function changPhone(val) {
  form.value.userAccNum = val.replace(/[^\d]/g, ""); // 只保留数字
}

// 搜索
function search() {
  searchLoading.value = true;
  accNumSelectUser({ userAccNum: form.value.userAccNum })
    .then((res) => {
      form.value.userName = res.data.userName;
      userInfo.value = {
        userAccNum: form.value.userAccNum,
        userName: res.data.userName,
      };
    })
    .finally(() => {
      searchLoading.value = false;
    });
}
// 打开弹窗  数据回显
function show(data) {
  detailData.value = data;
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["postRef"].validate(async (valid) => {
    if (valid) {
      let params = JSON.parse(JSON.stringify(userInfo.value));
      params.saResultId = detailData.value.saResultId;
      buttonLoading.value = true;
      userAccNumAndUserNameBind(params)
        .then((res) => {
          proxy.$modal.msgSuccess("添加成功");
          emit("closeDia", true);
        })
        .finally(() => {
          buttonLoading.value = false;
        });
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

<style lang="scss" scoped>
.dia-box {
  max-height: 700px;
  overflow: auto;
}
</style>
