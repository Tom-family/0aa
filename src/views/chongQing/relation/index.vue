<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="岗位编码" prop="postCode">
        <el-input v-model="queryParams.postCode" placeholder="请输入岗位编码" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleUpdate({},'add')">新增</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="postList">
      <el-table-column label="岗位编号" align="center" prop="postId" />
      <el-table-column label="岗位编码" align="center" prop="postCode" />
      <el-table-column label="岗位名称" align="center" prop="postName" />
      <el-table-column label="岗位排序" align="center" prop="postSort" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="260">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row,'view')">查看</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row,'edit')">修改</el-button>
          <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </div>
  <setDia ref="setRef" v-if="setDom" @closeDia="closeDia" />
</template>

<script setup name="Post">
import { listPost, addPost, delPost, getPost, updatePost } from "@/api/system/post";
import { useTemplateRef, nextTick } from "vue";
import setDia from "./components/set.vue";
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
    postCode: undefined,
  },
});

const { queryParams } = toRefs(data);
/** 查询岗位列表 */
function getList() {
  loading.value = true;
  postList.value = [
    {
      createBy: "admin",
      createTime: "2026-01-18 10:58:15",
      updateBy: null,
      updateTime: null,
      remark: "",
      postId: 1,
      postCode: "ceo",
      postName: "董事长",
      postSort: 1,
      status: "0",
      flag: false,
    },
    {
      createBy: "admin",
      createTime: "2026-01-18 10:58:15",
      updateBy: null,
      updateTime: null,
      remark: "",
      postId: 1,
      postCode: "ceo",
      postName: "董事长",
      postSort: 1,
      status: "0",
      flag: false,
    },{
      createBy: "admin",
      createTime: "2026-01-18 10:58:15",
      updateBy: null,
      updateTime: null,
      remark: "",
      postId: 1,
      postCode: "ceo",
      postName: "董事长",
      postSort: 1,
      status: "0",
      flag: false,
    },{
      createBy: "admin",
      createTime: "2026-01-18 10:58:15",
      updateBy: null,
      updateTime: null,
      remark: "",
      postId: 1,
      postCode: "ceo",
      postName: "董事长",
      postSort: 1,
      status: "0",
      flag: false,
    },
    {
      createBy: "admin",
      createTime: "2026-01-18 10:58:15",
      updateBy: null,
      updateTime: null,
      remark: "",
      postId: 4,
      postCode: "user",
      postName: "普通员工",
      postSort: 4,
      status: "0",
      flag: false,
    },
  ];
  total.value = 4;
  loading.value = false;
  return;
  listPost(queryParams.value).then((response) => {
    postList.value = response.rows;
    total.value = response.total;
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
async function handleUpdate(row,type) {
  let data={
    ...row,
    setType:type
  }
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
  const postIds = row.postId;
  proxy.$modal
    .confirm('是否确认删除岗位编号为"' + postIds + '"的数据项？')
    .then(function () {
      return delPost(postIds);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => {});
}

getList();
</script>
