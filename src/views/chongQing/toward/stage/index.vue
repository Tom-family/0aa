<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" @submit.prevent>
      <el-form-item label="关系名称" prop="sevenRelationId">
        <el-select v-model="queryParams.sevenRelationId" placeholder="请选择关系阶段名称" clearable style="width: 200px">
          <el-option v-for="item in plaseList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="关系阶段名称" prop="tbiTrendTitle">
        <el-input v-model="queryParams.tbiTrendTitle" placeholder="请输入关系名称" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleUpdate({}, 'add')">新增关系走向</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table stripe v-loading="loading" :data="postList">
      <el-table-column label="关系名称" show-overflow-tooltip align="center" prop="relationName" />
      <el-table-column label="关系阶段名称" show-overflow-tooltip align="center" prop="stageName" />
      <el-table-column label="关系走向" show-overflow-tooltip align="center" prop="tiTrendName">
        <template #default="scope">
          <el-tag type="primary" v-if="scope.row.tiTrendName == 1">{{ GetLabelByValue(TowardType, scope.row.tiTrendName) }}</el-tag>
          <el-tag type="success" v-else-if="scope.row.tiTrendName == 2">{{ GetLabelByValue(TowardType, scope.row.tiTrendName) }}</el-tag>
          <el-tag type="warning" v-else>{{ GetLabelByValue(TowardType, scope.row.tiTrendName) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="关系走向概括词" show-overflow-tooltip align="center" prop="tiSummaryWord" />
      <el-table-column label="详细分析" show-overflow-tooltip align="center" prop="tiDetailDescribe" />
      <el-table-column label="操作" width="200" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleUpdate(scope.row, 'view')">查看</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row, 'edit')">编辑</el-button>
          <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </div>
  <setDia ref="setRef" v-if="setDom" @closeDia="closeDia" />
</template>

<script setup>
import { useTemplateRef, nextTick } from "vue";
import setDia from "./components/set.vue";
import { saTrendQueryPage, saTrendUpdate, saSevenRelationSelectSaSevenName } from "@/api/chongQing/phase.js";
import { TowardType, GetLabelByValue } from "@/utils/enumeration.js";
const { proxy } = getCurrentInstance();

const postList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const total = ref(0);
const setRef = useTemplateRef("setRef");
const setDom = ref(false);
const plaseList = ref([]);

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    sevenRelationId: undefined,
    tbiTrendTitle: undefined,
  },
});

const { queryParams } = toRefs(data);
/** 查询岗位列表 */
function getList() {
  loading.value = true;
  saTrendQueryPage(queryParams.value).then((res) => {
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

/** 编辑按钮操作 */
async function handleUpdate(row, type) {
  let data = {
    ...row,
    setType: type,
  };
  setDom.value = true;
  await nextTick();
  setRef.value?.show(data);
}

function closeDia(data) {
  setDom.value = false;
  if (data) {
    getList();
  }
}

// 七大关系下拉
function getPlaseSelect() {
  saSevenRelationSelectSaSevenName().then((res) => {
    console.log(res);
    plaseList.value = res.data;
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  proxy.$modal
    .confirm(`是否确认删除该条数据？`)
    .then(function () {
      let params = {
        trendInfoId: row.trendInfoId,
        tiIsDel: 1,
      };
      return saTrendUpdate(params);
    })
    .then(() => {
      proxy.$modal.msgSuccess("删除成功");
      getList();
    })
    .catch(() => {});
}
getList();
getPlaseSelect();
</script>
