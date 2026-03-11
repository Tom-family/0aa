<template>
  <!-- 添加或修改岗位对话框 -->
  <el-dialog title="查看详情" v-model="open" width="600px" append-to-body :show-close="false" :close-on-click-modal="false" :draggable="true">
    <el-card>
      <table border width="100%" cellspacing="0" cellpadding="8" style="border-color: #e6f0f1">
        <tbody>
          <tr>
            <td width="20%" style="color: #409eff">版本ID：</td>
            <td style="color: #818489">{{ detailData.versionId }}</td>
          </tr>
          <tr>
            <td style="color: #409eff">版本号：</td>
            <td style="color: #818489">{{ detailData.versionNum }}</td>
          </tr>
          <tr>
            <td style="color: #409eff">更新地址：</td>
            <td style="color: #818489">{{ detailData.versionUrl }}</td>
          </tr>
          <tr>
            <td style="color: #409eff">上传时间：</td>
            <td style="color: #818489">{{ detailData.vcreateTime }}</td>
          </tr>
          <tr>
            <td style="color: #409eff">上传人：</td>
            <td style="color: #818489">{{ detailData.workName }}</td>
          </tr>
          <tr>
            <td style="color: #409eff">状态：</td>
            <td>
              <el-tag type="danger" v-if="detailData.versionState == 2">{{ GetLabelByValue(VersionStatus, detailData.versionState) }}</el-tag>
              <el-tag type="success" v-else>{{ GetLabelByValue(VersionStatus, detailData.versionState) }}</el-tag>
            </td>
          </tr>
          <tr>
            <td style="color: #409eff">备注：</td>
            <td style="color: #818489">{{ detailData.versionRemark }}</td>
          </tr>
        </tbody>
      </table>
    </el-card>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from "vue";
import { saSysVersionInsert } from "@/api/chongQing/system.js";
import { isSubmitData } from "@/utils/index.js";
import { VersionStatus, GetLabelByValue } from "@/utils/enumeration.js";
const { proxy } = getCurrentInstance();
const emit = defineEmits(["closeDia"]);
const open = ref(true);
const detailData = ref(false);

// 打开弹窗  数据回显
function show(data) {
  detailData.value = data;
}

/** 提交按钮 */
async function submitForm() {}

/** 取消按钮 */
function cancel() {
  emit("closeDia");
}
// 暴露
defineExpose({ show });
</script>

<style lang="scss" scoped>
.detail-box {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  span {
    color: #409eff;
    margin-right: 3px;
  }
}
</style>
