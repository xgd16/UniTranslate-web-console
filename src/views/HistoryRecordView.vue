<template>
  <div class="history-container">
    <el-table
      :data="tableData"
      :row-class-name="tableRowClassName"
      class="history-table"
      height="calc(100vh - 120px)"
      v-loading="loading"
    >
      <el-table-column prop="id" label="ID" width="80" align="center" />
      <el-table-column prop="tId" label="任务ID" min-width="120" align="center" />
      <el-table-column
        prop="clientIp"
        label="客户端IP"
        align="center"
        width="130"
      />
      <el-table-column prop="statusName" label="状态" width="80" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'warning'" size="small">
            {{ scope.row.statusName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="语言 (源/目标)" width="120" align="center">
        <template #default="scope">
          <span>{{ scope.row.reqFrom }} / {{ scope.row.reqTo }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="platform"
        label="翻译类型"
        width="200"
        align="center"
      />
      <el-table-column
        prop="reqPlatform"
        label="请求类型"
        width="100"
        align="center"
      />
      <el-table-column
        prop="takeTimeViewStr"
        label="耗时"
        width="100"
        align="center"
      />
      <el-table-column
        prop="createTime"
        label="操作时间"
        align="center"
        width="180"
      />
      <el-table-column fixed="right" label="操作" width="200" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click="bodyModal(scope.row)"
          >请求内容</el-button>
          <el-button
            v-if="scope.row.translate"
            link
            type="primary"
            size="small"
            @click="transContentModal(scope.row)"
          >结果</el-button>
          <el-button
            v-if="scope.row.status == 0"
            link
            type="warning"
            size="small"
            @click="errBoduModal(scope.row)"
          >错误信息</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="table-footer">
      <el-pagination
        background
        layout="total, prev, pager, next"
        @current-change="currChange"
        :page-size="pageSize"
        :total="tableTotal"
      />
      <el-button 
        :type="autoRefreshStatus ? 'success' : 'primary'"
        @click="autoRefreshStatus = !autoRefreshStatus"
      >
        {{ autoRefreshStatus ? "停止自动刷新" : "自动刷新" }}
      </el-button>
    </div>

    <el-dialog v-model="dialogVisible" :title="modalTitle" width="60%" destroy-on-close>
      <el-input
        v-model="bodyView"
        type="textarea"
        :autosize="{ minRows: 20, maxRows: 20 }"
        resize="none"
        readonly
      />
    </el-dialog>

    <el-dialog v-model="transContentDialogVisible" :title="transContentTitle" width="60%" destroy-on-close>
      <el-input
        v-model="transContent"
        type="textarea"
        :autosize="{ minRows: 20, maxRows: 20 }"
        resize="none"
        readonly
      />
    </el-dialog>

    <el-dialog v-model="errDialogVisible" :title="errModalTitle" width="60%" destroy-on-close>
      <el-input
        v-model="errBodyView"
        type="textarea"
        :autosize="{ minRows: 20, maxRows: 20 }"
        resize="none"
        readonly
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import type { RequestRecordList } from "@/types/props";
import { getRequestRecord } from "@/api/translate";
import { ElMessage } from "element-plus";

const tableRowClassName = ({
  row,
  rowIndex,
}: {
  row: RequestRecordList;
  rowIndex: number;
}) => {
  if (row.status == 0) {
    return "warning-row";
  } else {
    return "success-row";
  }
};

const dialogVisible = ref(false);
const errDialogVisible = ref(false);
const transContentDialogVisible = ref(false);
const modalTitle = ref("");
const errModalTitle = ref("");
const transContentTitle = ref("");

const tableData = ref<RequestRecordList[]>([]);
const loading = ref(false);

const pageSize = 15;
const tableTotal = ref<number>(0);
const bodyView = ref("");
const errBodyView = ref("");
const transContent = ref("");

const getRequestRecordFunc = async (page: number = 1, size: number = pageSize) => {
  loading.value = true;
  try {
    const res = await getRequestRecord({ page, size });
    if (res.code === 1000) {
      tableTotal.value = res.data.count;
      res.data.list.forEach((value: RequestRecordList) => {
        const jsonData = JSON.parse(value.body);
        value.reqFrom = jsonData["from"];
        value.reqTo = jsonData["to"];
        value.statusName = value.status == 1 ? "成功" : "失败";
        value.tId ??= "无";
        value.reqPlatform ??=
          jsonData["platform"] != "" ? jsonData["platform"] : "无";
        if (value.platform == "") value.platform = "无";
        value.takeTimeViewStr = value.takeTime ? value.takeTime + "ms" : "无";
        value.errMsg ??= "无";
      });
      tableData.value = res.data.list;
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
getRequestRecordFunc();

const currChange = (val: number) => {
  getRequestRecordFunc(val, pageSize);
};

const bodyModal = (row: RequestRecordList) => {
  dialogVisible.value = true;
  modalTitle.value = `[${row.id}] 请求内容`;
  bodyView.value = JSON.stringify(JSON.parse(row.body), null, 2);
};

const errBoduModal = (row: RequestRecordList) => {
  errModalTitle.value = `[${row.id}] 错误内容`;
  errDialogVisible.value = true;
  errBodyView.value = row.errMsg;
};

const transContentModal = (row: RequestRecordList) => {
  transContentDialogVisible.value = true;
  transContentTitle.value = `[${row.id}] 翻译内容`;
  transContent.value = JSON.stringify(JSON.parse(row.translate), null, 2);
};

const autoRefreshStatus = ref(false); // 自动刷新状态
const autoRefreshTimer = ref<any>(0); // 自动刷新定时器
const autoRefreshSec = 3; // 自动刷新秒数

// 组件销毁时清除定时器
onBeforeUnmount(() => {
  if (autoRefreshTimer.value > 0) clearInterval(autoRefreshTimer.value);
});

// 监听自动刷新状态
watch(autoRefreshStatus, (isOpen: any) => {
  if (isOpen) {
    ElMessage.success(`自动刷新已开启-每${autoRefreshSec}秒刷新一次`);
    getRequestRecordFunc();
    autoRefreshTimer.value = setInterval(() => {
      getRequestRecordFunc();
    }, autoRefreshSec * 1000);
  } else {
    ElMessage.success("自动刷新已关闭");
    if (autoRefreshTimer.value > 0) clearInterval(autoRefreshTimer.value);
  }
});
</script>

<style scoped>
.history-container {
  height: 100%;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.history-table {
  flex: 1;
  background-color: var(--el-bg-color-overlay);
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-lighter);
}

.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background-color: var(--el-bg-color-overlay);
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-lighter);
}

:deep(.warning-row) {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}

:deep(.success-row) {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}

:deep(.el-dialog__body) {
  padding: 16px;
}

:deep(.el-textarea__inner) {
  background-color: var(--el-bg-color-overlay);
  border-color: var(--el-border-color-light);
  font-family: monospace;
}
</style>
