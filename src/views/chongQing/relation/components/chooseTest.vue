<template>
  <!-- 添加或修改岗位对话框 -->
  <el-dialog :title="title" v-model="open" width="800px" append-to-body :show-close="false" :close-on-click-modal="false" :draggable="true">
    <el-table :data="tableData" border style="width: 100%" @select="handleSelect" ref="tableRef">
      <el-table-column type="selection" width="55" :selectable="checkSelectable" />
      <el-table-column property="saTestTopic" align="center" label="测评标题" width="340" show-overflow-tooltip />
      <el-table-column property="saTestState" align="center" label="状态" width="180" show-overflow-tooltip />
      <el-table-column property="saTestCreateTime" align="center" label="创建时间" show-overflow-tooltip />
    </el-table>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm" :disabled="!selectedRow">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, nextTick } from "vue";
import { saSevenRelationSaSevenInsert, saSevenRelationSaSevenUpdate } from "@/api/chongQing/phase.js";
import { selectSaTestTopicInfo } from "@/api/chongQing/test.js";
import { isSubmitData } from "@/utils/index.js";
const { proxy } = getCurrentInstance();
const emit = defineEmits(["closeDia"]);
const open = ref(true);
const detailData = ref(false);
const tableRef = ref(null);
const selectedRow = ref(null); //选中的数据
const tableData = ref([]);
const title = ref("绑定测试题");

// 打开弹窗  数据回显
function show(data) {
  detailData.value = data;
  if (detailData.value.storeTestId) {
    title.value = "更换测试题";
  } else {
    title.value = "绑定测试题";
  }
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
