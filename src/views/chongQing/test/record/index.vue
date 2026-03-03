<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" @submit.prevent>
      <el-form-item label="用户名" prop="name1">
        <el-input v-model="queryParams.name1" placeholder="请输入关系名称" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="联系方式" prop="name2">
        <el-input v-model="queryParams.name2" placeholder="请输入关系名称" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="测试题名称" prop="name3">
        <el-input v-model="queryParams.name3" placeholder="请输入关系名称" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5"></el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table stripe v-loading="loading" :data="postList">
      <el-table-column label="测评标题" show-overflow-tooltip align="center" prop="saTestTopic" />
      <el-table-column label="状态" show-overflow-tooltip align="center" prop="saTestState">
        <template #default="scope">
          <el-tag type="danger" v-if="scope.row.saTestState == 2">{{ GetLabelByValue(TestStatus, scope.row.saTestState) }}</el-tag>
          <el-tag type="success" v-else>{{ GetLabelByValue(TestStatus, scope.row.saTestState) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="排序" show-overflow-tooltip align="center" prop="saTestSort" />
      <el-table-column label="创建时间" show-overflow-tooltip align="center" prop="saTestCreateTime" />
      <el-table-column label="操作" width="200" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleDetail(scope.row)">查看详情</el-button>
          <el-button link type="primary" icon="Edit" @click="handleResult(scope.row)">查看结果</el-button>
          <el-button style="margin-left: 0" link type="primary" icon="Edit" @click="exportAnswer(scope.row)">导出答卷</el-button>
          <el-button link type="primary" icon="Edit" @click="handleBind(scope.row)">绑定用户</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </div>
  <!-- 绑定用户 -->
  <bindDia ref="bindRef" v-if="bindDom" @closeDia="closeDia" />
  <!-- 测试记录详情 -->
  <detailDia ref="detailRef" v-if="detailDom" @closeDia="detailDom = false" />
  <!-- 查看结果 -->
  <resultDia ref="resultRef" v-if="resultDom" @closeDia="resultDom = false" />
</template>

<script setup>
import { useTemplateRef, nextTick } from "vue";
import bindDia from "./components/bind.vue";
import detailDia from "./components/detail.vue";
import resultDia from "./components/result.vue";
import { saTestTopicQueryPage, saTestTopicUpdate } from "@/api/chongQing/test.js";
import { TestStatus, GetLabelByValue } from "@/utils/enumeration.js";
const { proxy } = getCurrentInstance();

const postList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const total = ref(0);
const bindRef = useTemplateRef("bindRef");
const bindDom = ref(false);

// 测试记录详情
const detailDom = ref(false);
const detailRef = useTemplateRef("detailRef");

// 查看结果
const resultDom = ref(false);
const resultRef = useTemplateRef("detailRef");

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name1: undefined,
    name2: undefined,
    name3: undefined,
  },
});

const { queryParams } = toRefs(data);
/** 查询岗位列表 */
function getList() {
  loading.value = true;
  saTestTopicQueryPage(queryParams.value).then((res) => {
    postList.value = res.data.records;
    total.value = res.data.total;
    loading.value = false;
  });
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 查看详情
async function handleDetail(row) {
  let data = {
    ...row,
  };
  detailDom.value = true;
  // await nextTick();
  // bindRef.value?.show(data);
}

// 查看结果
async function handleResult(row) {
  let data = {
    ...row,
  };
  resultDom.value = true;
  // await nextTick();
  // bindRef.value?.show(data);
}

/** 修改按钮操作 */
async function handleBind(row) {
  let data = { ...row };
  bindDom.value = true;
  await nextTick();
  bindRef.value?.show(data);
}

function closeDia(data) {
  bindDom.value = false;
  if (data) {
    getList();
  }
}

// 导出答卷
function exportAnswer(row) {
  exportTestExamResultDetail({
    resultId: row.resultId,
  }).then((res) => {
    console.log(res);
    const blob = new Blob([res], { type: "application/octet-stream" });
    const filename = `${row.username}_${row.accnum}.xlsx`;
    if (typeof window.navigator.msSaveBlob !== "undefined") {
      window.navigator.msSaveBlob(blob, filename);
    } else {
      const blobURL = window.URL.createObjectURL(blob);
      const tempLink = document.createElement("a");
      tempLink.style.display = "none";
      tempLink.href = blobURL;
      tempLink.setAttribute("download", filename);
      if (typeof tempLink.download === "undefined") {
        tempLink.setAttribute("target", "_blank");
      }
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(blobURL);
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  let text = row.saTestState == 1 ? "下架" : "上架";
  proxy.$modal
    .confirm(`是否确认${text}该条数据？`)
    .then(function () {
      let params = {
        saTestId: row.saTestId,
        saTestState: row.saTestState == 1 ? 2 : 1,
      };
      return saTestTopicUpdate(params);
    })
    .then(() => {
      let text = row.saTestState == 1 ? "下架成功" : "上架成功";
      proxy.$modal.msgSuccess(text);
      getList();
    })
    .catch(() => {});
}
getList();
</script>
