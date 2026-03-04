<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" @submit.prevent>
      <el-form-item label="测试用户" prop="userName">
        <el-input v-model="queryParams.userName" placeholder="请输入用户名" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="联系方式" prop="userAccnum">
        <el-input v-model="queryParams.userAccnum" placeholder="请输入联系方式" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="测试题名称" prop="saTestTopic">
        <el-input v-model="queryParams.saTestTopic" placeholder="请输入测试题名称" clearable style="width: 200px" @keyup.enter="handleQuery" />
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
      <el-table-column label="测评标题" show-overflow-tooltip align="center" prop="saTestTopic" min-width="200"/>
      <el-table-column label="测试用户" show-overflow-tooltip align="center" prop="userName"></el-table-column>
      <el-table-column label="联系方式" show-overflow-tooltip align="center" prop="userAccnum" />
      <el-table-column label="提交时间" show-overflow-tooltip align="center" prop="saResultCreateTime" />
      <el-table-column label="操作" width="200" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleDetail(scope.row)">查看详情</el-button>
          <el-button link type="primary" icon="View" @click="handleResult(scope.row)">查看结果</el-button>
          <el-button style="margin-left: 0" link type="primary" icon="Document" @click="exportAnswer(scope.row)">导出答卷</el-button>
          <el-button link type="primary" icon="Avatar" @click="handleBind(scope.row)" v-if="scope.row.userAccnum">绑定用户</el-button>
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
import { saTestResultsQueryPage, exportTestExamResultDetail } from "@/api/chongQing/test.js";
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
const resultRef = useTemplateRef("resultRef");

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userName: undefined,
    userAccnum: undefined,
    saTestTopic: undefined,
  },
});

const { queryParams } = toRefs(data);
/** 查询岗位列表 */
function getList() {
  loading.value = true;
  saTestResultsQueryPage(queryParams.value).then((res) => {
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
  detailDom.value = true;
  await nextTick();
  detailRef.value?.show(row);
}

// 查看结果
async function handleResult(row) {
  resultDom.value = true;
  await nextTick();
  resultRef.value?.show(row);
}

/** 修改按钮操作 */
async function handleBind(row) {
  bindDom.value = true;
  await nextTick();
  bindRef.value?.show(row);
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
    saResultId: row.saResultId,
  }).then((res) => {
    console.log(res);
    const blob = new Blob([res], { type: "application/octet-stream" });
    const filename = `${row.saTestTopic}_${row.userAccnum}.xlsx`;
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

getList();
</script>
