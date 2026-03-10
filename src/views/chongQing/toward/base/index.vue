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
        <el-button type="primary" plain icon="Plus" @click="handleUpdate({}, 'add')">新增关系走向基础信息</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table stripe v-loading="loading" :data="postList">
      <el-table-column label="关系名称" show-overflow-tooltip align="center" prop="relationName" />
      <el-table-column label="关系阶段名称" show-overflow-tooltip align="center" prop="stageName" min-width="105"/>
      <el-table-column label="关系走向标题" show-overflow-tooltip align="center" prop="tbiTrendTitle" min-width="105" />
      <el-table-column label="关系走向引导词" show-overflow-tooltip align="center" prop="trendGuideWord"  min-width="120"/>
      <el-table-column label="关系阶段跳转引导词" show-overflow-tooltip align="center" prop="trendChangePagePrompt" min-width="145"/>
      <el-table-column label="心通通宣传词" show-overflow-tooltip align="center" prop="xttSlogan" min-width="105" />
      <el-table-column label="Semmi分析标题" show-overflow-tooltip align="center" prop="semmiAnalyzeTitle" min-width="120"/>
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
import { saTrendBasicQueryPage, saTrendBasicUpdate, saSevenRelationSelectSaSevenName } from "@/api/chongQing/phase.js";
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
  saTrendBasicQueryPage(queryParams.value).then((res) => {
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
    plaseList.value = res.data;
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  proxy.$modal
    .confirm(`是否确认删除该条数据？`)
    .then(function () {
      let params = {
        trendBasicInfoId: row.trendBasicInfoId,
        tbiIsDel: 1,
      };
      return saTrendBasicUpdate(params);
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
