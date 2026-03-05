<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" @submit.prevent>
      <el-form-item label="设备类型" prop="deviceStyle">
        <el-select v-model="queryParams.deviceStyle" placeholder="请选择设备类型" clearable style="width: 200px">
          <el-option v-for="item in DeviceType" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="门店名称" prop="storeName">
        <el-select v-model="queryParams.storeName" placeholder="请选择门店名称" clearable style="width: 200px">
          <el-option v-for="item in DeviceType" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="设备状态" prop="dDeviceState">
        <el-select v-model="queryParams.dDeviceState" placeholder="请选择设备状态" clearable style="width: 200px">
          <el-option v-for="item in DeviceStatus" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
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
      <el-table-column label="设备标识符" show-overflow-tooltip align="center" prop="deviceIdentifier"/>
      <el-table-column label="设备类型" show-overflow-tooltip align="center" prop="deviceStyle">
        <template #default="scope">
          <el-tag type="warning" v-if="scope.row.deviceStyle == 1">{{ GetLabelByValue(DeviceType, scope.row.deviceStyle) }}</el-tag>
          <el-tag type="success" v-else>{{ GetLabelByValue(DeviceType, scope.row.deviceStyle) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="门店名称" show-overflow-tooltip align="center" prop="storeName" min-width="100"></el-table-column>
      <el-table-column label="申请时间" show-overflow-tooltip align="center" prop="saResultCreateTime" />
      <el-table-column label="审核时间" show-overflow-tooltip align="center" prop="saApproverTime" />
      <el-table-column label="状态" show-overflow-tooltip align="center" prop="ddeviceState"  width="90">
        <template #default="scope">
          <el-tag type="primary" v-if="scope.row.ddeviceState == 1">{{ GetLabelByValue(DeviceStatus, scope.row.ddeviceState) }}</el-tag>
          <el-tag type="success" v-else-if="scope.row.ddeviceState == 2">{{ GetLabelByValue(DeviceStatus, scope.row.ddeviceState) }}</el-tag>
          <el-tag type="danger" v-else>{{ GetLabelByValue(DeviceStatus, scope.row.ddeviceState) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" show-overflow-tooltip align="center" prop="deviceRemark" />
      <el-table-column label="操作" width="300" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <div style="text-align: left">
            <el-button link type="primary" icon="View" @click="handleUpdate(scope.row, 'view')">查看详情</el-button>
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row, 'edit')" v-if="scope.row.ddeviceState != 3">编辑</el-button>
            <el-button link type="success" icon="CircleCheck" @click="tapPass(scope.row, 2)" v-if="scope.row.ddeviceState == 1">通过</el-button>
            <el-button link type="danger" icon="CircleClose" @click="tapPass(scope.row, 3)" v-if="scope.row.ddeviceState == 1">拒绝</el-button>
            <el-button link type="danger" icon="CircleClose" @click="tapDelete(scope.row)" v-if="scope.row.ddeviceState == 2">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </div>
  <setDia ref="setRef" v-if="setDom" @closeDia="closeDia" />
  <detailDia ref="detailRef" v-if="detailDom" @closeDia="detailDom = false" />
</template>

<script setup>
import { useTemplateRef, nextTick } from "vue";
import detailDia from "./components/detail.vue";
import setDia from "./components/set.vue";
import { saDeviceEquipmentQueryPage } from "@/api/chongQing/system.js";
import { saDeviceUpdate } from "@/api/chongQing/system.js";
import { DeviceType, DeviceStatus, GetLabelByValue } from "@/utils/enumeration.js";
const { proxy } = getCurrentInstance();

const postList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const total = ref(0);
const setRef = useTemplateRef("setRef");
const setDom = ref(false);
const detailRef = useTemplateRef("detailRef");
const detailDom = ref(false);

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deviceStyle: undefined,
    storeName: undefined,
    dDeviceState: undefined,
  },
});

const { queryParams } = toRefs(data);
/** 查询岗位列表 */
function getList() {
  loading.value = true;
  saDeviceEquipmentQueryPage(queryParams.value).then((res) => {
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

async function tapDetail(row) {
  detailDom.value = true;
  await nextTick();
  detailRef.value?.show(row);
}

/** 通过/拒绝 */
function tapPass(row, status) {
  let text = status == 2 ? "是否确认通过该条数据？" : "是否确认拒绝该条数据？";
  proxy.$modal
    .confirm(`${text}`)
    .then(function () {
      let params = {
        deviceId: row.deviceId,
        dDeviceState: status,
      };
      return saDeviceUpdate(params);
    })
    .then(() => {
      proxy.$modal.msgSuccess("操作成功");
      getList();
    })
    .catch(() => {});
}

/** 删除 */
function tapDelete(row) {
  proxy.$modal
    .confirm(`是否确认删除该条数据？`)
    .then(function () {
      let params = {
        deviceId: row.deviceId,
        dIsDel: 1,
      };
      return saDeviceUpdate(params);
    })
    .then(() => {
      proxy.$modal.msgSuccess("删除成功");
      getList();
    })
    .catch(() => {});
}

getList();
</script>
