<template>
  <!-- 绑定个人 -->
  <el-form :model="queryParams" ref="queryRef" :inline="true" @submit.prevent>
    <el-form-item label="员工工号" prop="name1">
      <el-input v-model="queryParams.name1" placeholder="请输入员工工号" clearable style="width: 150px" @keyup.enter="handleQuery" />
    </el-form-item>
    <el-form-item label="员工名称" prop="name2">
      <el-input v-model="queryParams.name2" placeholder="请输入员工名称" clearable style="width: 150px" @keyup.enter="handleQuery" />
    </el-form-item>
    <el-form-item label="员工联系电话" prop="name3">
      <el-input v-model="queryParams.name3" placeholder="请输入员工联系电话" clearable style="width: 150px" @keyup.enter="handleQuery" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
      <el-button icon="Refresh" @click="resetQuery">重置</el-button>
    </el-form-item>
  </el-form>
  <el-table :data="tableData" border style="width: 100%" @select="handleSelect" ref="tableRef">
    <el-table-column type="selection" width="55" :selectable="checkSelectable" />
    <el-table-column property="saTestTopic" align="center" label="测评标题" width="340" show-overflow-tooltip />
    <el-table-column property="saTestState" align="center" label="状态" width="180" show-overflow-tooltip />
    <el-table-column property="saTestCreateTime" align="center" label="创建时间" show-overflow-tooltip />
  </el-table>
</template>

<script setup>
import { ref, reactive, nextTick } from "vue";
import { saSevenRelationSaSevenInsert, saSevenRelationSaSevenUpdate } from "@/api/chongQing/phase.js";
import { selectSaTestTopicInfo } from "@/api/chongQing/test.js";
import { isSubmitData } from "@/utils/index.js";
const { proxy } = getCurrentInstance();
const emit = defineEmits(["closeDia"]);
const detailData = ref(false);
const tableRef = ref(null);
const selectedRow = ref(null); //选中的数据
const tableData = ref([]);

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

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  console.log(1)
  // getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 打开弹窗  数据回显
function show(data) {
  detailData.value = data;
  getTestList();
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
}

// 禁用名单
function checkSelectable(row) {
  return row.saTestIsBind != 1 || (row.saTestIsBind == 1 && row.saTestId == detailData.value.bindStoreTestId);
}

// 获取测试题
function getTestList() {
  selectSaTestTopicInfo({ sevenRelationId: detailData.value.sevenRelationId }).then(async (res) => {
    tableData.value = res.data;
    let selectedId = detailData.value.storeTestId;
    // 在表格中找到对应的行并选中
    if (selectedId) {
      const row = tableData.value.find((item) => item.saTestId == selectedId);
      if (row) {
        await nextTick();
        tableRef.value.clearSelection();
        tableRef.value.toggleRowSelection(row, true);
        selectedRow.value = row;
      }
    }
  });
}

/** 提交按钮 */
async function submitForm() {
  emit("closeDia", selectedRow.value);
}

/** 取消按钮 */
function cancel() {
  emit("closeDia");
}
// 暴露
defineExpose({ show });
</script>
<style scoped lang="scss">
:deep(.el-table__header-wrapper) {
  .el-checkbox__inner {
    display: none !important;
  }
}
</style>
