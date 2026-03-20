<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" @submit.prevent>
      <el-form-item label="门店名称" prop="versionNum">
        <el-input v-model="queryParams.versionNum" placeholder="请输入门店名称" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <!-- <el-button type="primary" plain icon="Plus" @click="handleUpdate({})">新增版本</el-button> -->
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table stripe v-loading="loading" :data="postList">
      <el-table-column label="设备类型" show-overflow-tooltip align="center" prop="versionNum" />
      <el-table-column label="门店名称" show-overflow-tooltip align="center" prop="versionRemark"></el-table-column>
      <el-table-column label="绑定类型" show-overflow-tooltip align="center" prop="vcreateTime" min-width="100"></el-table-column>
      <el-table-column label="绑定员工姓名" show-overflow-tooltip align="center" prop="workName" />
      <el-table-column label="绑定员工部门" show-overflow-tooltip align="center" prop="versionState">
        <template #default="scope">
          <el-tag type="danger" v-if="scope.row.versionState == 2">{{ GetLabelByValue(VersionStatus, scope.row.versionState) }}</el-tag>
          <el-tag type="success" v-else>{{ GetLabelByValue(VersionStatus, scope.row.versionState) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="绑定员工电话" show-overflow-tooltip align="center" prop="workName" />
      <el-table-column label="操作" width="200" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleUpdate(scope.row)">编辑</el-button>
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
import { saVersionQueryPage } from "@/api/chongQing/system.js";
import { VersionStatus, GetLabelByValue } from "@/utils/enumeration.js";
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
    versionNum: undefined,
  },
});

const { queryParams } = toRefs(data);
/** 查询岗位列表 */
function getList() {
  loading.value = true;
  saVersionQueryPage(queryParams.value).then((res) => {
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
async function handleUpdate(row) {
  let data = {
    ...row,
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

getList();
</script>
