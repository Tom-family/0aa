<template>
  <!-- 添加或编辑岗位对话框 -->
  <el-dialog title="测试题管理" v-model="open" width="1200px" append-to-body :close-on-click-modal="false" :draggable="true" @close="emit('closeDia')">
    <el-button type="primary" @click="tapTest({}, 'add')">添加测试题</el-button>
    <el-table v-loading="loading" size="small" :data="tableData" border style="width: 100%; margin: 20px 0">
      <el-table-column prop="relationName" align="center" label="关系名称" show-overflow-tooltip width="120" />
      <el-table-column prop="saTestTopic" align="center" label="测评标题" show-overflow-tooltip />
      <el-table-column prop="saTestState" align="center" label="状态" show-overflow-tooltip width="100">
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.saTestState == 1">{{ GetLabelByValue(TestStatus, scope.row.saTestState) }}</el-tag>
          <el-tag type="danger" v-else>{{ GetLabelByValue(TestStatus, scope.row.saTestState) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="smallScreenGuidance" align="center" label="小屏引导语" show-overflow-tooltip />
      <el-table-column prop="largeScreenGuidance" align="center" label="大屏引导语" show-overflow-tooltip />
      <el-table-column prop="brtSort" align="center" label="排序" show-overflow-tooltip width="80" />
      <el-table-column label="操作" width="220" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="tapTest(scope.row, 'view')">查看</el-button>
          <el-button link type="primary" icon="Edit" @click="tapTest(scope.row, 'edit')">编辑</el-button>
          <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)">解绑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
  <addTest ref="addTestRef" v-if="addTestDom" @closeDia="closeAddTest" />
</template>

<script setup>
import { ref, reactive } from "vue";
import { selectSaTestTopic } from "@/api/chongQing/phase.js";
import { isSubmitData } from "@/utils/index.js";
import { updateSaTestTopic } from "@/api/chongQing/test.js";
import { TestStatus, GetLabelByValue } from "@/utils/enumeration.js";
import addTest from "./addTest.vue";
const { proxy } = getCurrentInstance();
const emit = defineEmits(["closeDia"]);
const open = ref(true);
const loading = ref(false);
const detailData = ref(false);
const addTestRef = useTemplateRef("addTestRef");
const addTestDom = ref(false);
const tableData = ref([]);

// 打开弹窗  数据回显
function show(data) {
  detailData.value = data;
  getList();
}

// 查询列表
function getList() {
  loading.value = true;
  selectSaTestTopic({ sevenRelationId: detailData.value.sevenRelationId })
    .then((res) => {
      tableData.value = res.data;
    })
    .finally(() => {
      loading.value = false;
    });
}

// 关闭编辑弹窗
function closeAddTest(data) {
  addTestDom.value = false;
  if (data) {
    getList();
  }
}

// 添加测试题
async function tapTest(row, type) {
  if (type == "add" && tableData.value.length >= 3) {
    proxy.$modal.msgWarning("当前关系添加的测试题数量达到上限");
    return;
  }
  let data = {
    ...row,
    setType: type,
    sevenRelationId: detailData.value.sevenRelationId,
  };
  addTestDom.value = true;
  await nextTick();
  addTestRef.value?.show(data);
}

/** 删除按钮操作 */
function handleDelete(row) {
  proxy.$modal
    .confirm(`您确定解除该测试题的绑定关系吗？`)
    .then(function () {
      let params = {
        bindRelationTestId: row.bindRelationTestId,
        brtIsDel: 1,
      };
      return updateSaTestTopic(params);
    })
    .then(() => {
      proxy.$modal.msgSuccess("解绑成功");
      getList();
    })
    .catch(() => {});
}

// 暴露
defineExpose({ show });
</script>
