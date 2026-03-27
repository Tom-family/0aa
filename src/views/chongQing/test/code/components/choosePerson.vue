<template>
  <!-- 绑定个人 -->
  <el-form :model="queryParams" ref="queryRef" :inline="true" @submit.prevent>
    <el-form-item label="员工工号" prop="jobNumber">
      <el-input v-model="queryParams.jobNumber" placeholder="请输入员工工号" clearable style="width: 150px" @keyup.enter="handleQuery" />
    </el-form-item>
    <el-form-item label="员工名称" prop="workName">
      <el-input v-model="queryParams.workName" placeholder="请输入员工名称" clearable style="width: 150px" @keyup.enter="handleQuery" />
    </el-form-item>
    <el-form-item label="员工联系电话" prop="workAccnum">
      <el-input v-model="queryParams.workAccnum" placeholder="请输入员工联系电话" clearable style="width: 150px" @keyup.enter="handleQuery" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
      <el-button icon="Refresh" @click="resetQuery">重置</el-button>
    </el-form-item>
  </el-form>
  <el-table :data="tableData" border style="width: 100%" @select="handleSelect" ref="tableRef" max-height="285">
    <el-table-column type="selection" width="55" />
    <el-table-column property="jobNumber" align="center" label="员工工号" show-overflow-tooltip />
    <el-table-column property="divisionName" align="center" label="员工部门" show-overflow-tooltip />
    <el-table-column property="workName" align="center" label="员工名称" show-overflow-tooltip />
    <el-table-column property="jobNumber" align="center" label="岗位" show-overflow-tooltip />
    <el-table-column property="workAccnum" align="center" label="联系电话" show-overflow-tooltip />
    <el-table-column property="saTestCreateTime" align="center" label="在职状态" show-overflow-tooltip>
      <template #default="scope">
        <el-tag type="success" v-if="scope.row.workDepart == 1">在职</el-tag>
        <el-tag type="danger" v-if="scope.row.workDepart == 2">离职</el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { ref, reactive, nextTick, watch } from "vue";
import { queryWorkersByStore } from "@/api/chongQing/test.js";
import { isSubmitData } from "@/utils/index.js";
const { proxy } = getCurrentInstance();
const emit = defineEmits(["closeDia"]);
const tableRef = ref(null);
const selectedRow = ref(null); //选中的数据
const tableData = ref([]);
const bindWorkAccnum = ref("");
const props = defineProps({
  sendData: {
    type: Object,
    default: () => {},
  },
});

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    storeId: undefined,
    jobNumber: undefined,
    workName: undefined,
    workAccnum: undefined,
  },
});

const { queryParams } = toRefs(data);

// 监听 sendData 变化
watch(
  () => props.sendData,
  (newVal) => {
    if (newVal && Object.keys(newVal).length > 0) {
      queryParams.value.storeId = newVal.storeId;
      if (newVal.workAccnum) {
        queryParams.value.workAccnum = newVal.workAccnum;
        bindWorkAccnum.value = newVal.workAccnum;
        emit("closeDia", newVal);
      }
      getList();
    }
  },
  { deep: true, immediate: true },
);

function getList() {
  queryWorkersByStore(queryParams.value).then((res) => {
    tableData.value = res.data;
    getTestList();
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

// 处理单选
function handleSelect(selection, row) {
  if (selection.length > 1) {
    // 如果选中了多个，只保留当前选中的这一个
    tableRef.value.clearSelection();
    tableRef.value.toggleRowSelection(row, true);
    selectedRow.value = row;
  } else if (selection.length === 1) {
    selectedRow.value = selection[0];
  } else {
    selectedRow.value = null;
  }
  if (selectedRow.value) {
    bindWorkAccnum.value = selectedRow.value.workAccnum;
  } else {
    bindWorkAccnum.value = "";
  }
  emit("closeDia", selectedRow.value);
}

// 获取测试题
async function getTestList() {
  let selectedId = bindWorkAccnum.value;
  // 在表格中找到对应的行并选中
  if (selectedId) {
    const row = tableData.value.find((item) => item.workAccnum == selectedId);
    if (row) {
      await nextTick();
      tableRef.value.clearSelection();
      tableRef.value.toggleRowSelection(row, true);
      selectedRow.value = row;
    }
  }
}
</script>
<style scoped lang="scss">
:deep(.el-table__header-wrapper) {
  .el-checkbox__inner {
    display: none !important;
  }
}
</style>
