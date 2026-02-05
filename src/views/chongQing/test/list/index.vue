<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="测评标题" prop="relationName">
        <el-input v-model="queryParams.relationName" placeholder="请输入关系名称" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleUpdate({}, 'add')">新增测评</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table stripe  v-loading="loading" :data="postList">
      <el-table-column label="测评标题" show-overflow-tooltip align="center" prop="relationName" />
      <el-table-column label="状态" show-overflow-tooltip align="center" prop="createTime">
        <template #default="scope">
          <el-tag type="danger" v-if="scope.row.srPublishStatus == 0">{{ GetLabelByValue(RelationStatus, scope.row.srPublishStatus) }}</el-tag>
          <el-tag type="success" v-else>{{ GetLabelByValue(RelationStatus, scope.row.srPublishStatus) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="排序" show-overflow-tooltip align="center" prop="srSort" />
      <el-table-column label="创建时间" show-overflow-tooltip align="center" prop="srSort" />
      <el-table-column label="操作" width="200" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row, 'view')">查看</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row, 'edit')">修改</el-button>
          <el-button link :type="scope.row.srPublishStatus ? 'danger' : 'success'" icon="Delete" @click="handleDelete(scope.row)">
            {{ GetLabelByValue(RelationStatus, scope.row.srPublishStatus?0:1) }}
          </el-button>
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
import { saSevenRelationQueryPage, saSevenRelationSaSevenUpdate } from "@/api/chongQing/phase.js";
import { RelationStatus, GetLabelByValue } from "@/utils/enumeration.js";
const { proxy } = getCurrentInstance();

const postList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const total = ref(0);
const setRef = useTemplateRef("setRef");
const setDom = ref(false);

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    relationName: undefined,
  },
});

const { queryParams } = toRefs(data);
/** 查询岗位列表 */
function getList() {
  loading.value = true;
  saSevenRelationQueryPage(queryParams.value).then((res) => {
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

/** 修改按钮操作 */
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

/** 删除按钮操作 */
function handleDelete(row) {
  let text=row.srPublishStatus?'下架':'上架'
  proxy.$modal
    .confirm(`是否确认${text}该条数据？`)
    .then(function () {
      let params = {
        sevenRelationId: row.sevenRelationId,
        srPublishStatus: row.srPublishStatus ? 0 : 1,
      };
      return saSevenRelationSaSevenUpdate(params);
    })
    .then(() => {
      let text = row.srPublishStatus ? "下架成功" : "上架成功";
      proxy.$modal.msgSuccess(text);
      getList();
    })
    .catch(() => {});
}
getList();
</script>
