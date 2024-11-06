<template>
  <el-table
    :data="tableData"
    style="width: 100%"
    :row-class-name="tableRowClassName"
  >
    <el-table-column prop="id" label="ID" width="100" align="center" />
    <el-table-column prop="tId" label="任务ID" width="auto" align="center" />
    <el-table-column
      prop="clientIp"
      label="客户端IP"
      align="center"
      width="150"
    />
    <el-table-column
      prop="statusName"
      label="状态"
      width="100"
      align="center"
    />
    <el-table-column prop="" label="语言 (源/目标)" width="120" align="center"
      ><template #default="scope">{{
        scope.row.reqFrom + " / " + scope.row.reqTo
      }}</template></el-table-column
    >
    <el-table-column
      prop="platform"
      label="翻译类型"
      width="250"
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
      width="110"
      align="center"
    />
    <el-table-column
      prop="createTime"
      label="操作时间"
      align="center"
      width="200"
    />
    <el-table-column fixed="right" label="操作" width="240" align="center">
      <template #default="scope">
        <el-button
          link
          type="primary"
          size="small"
          @click="bodyModal(scope.row)"
          >请求内容</el-button
        >
        <el-button
          v-if="scope.row.translate"
          link
          type="primary"
          size="small"
          @click="transContentModal(scope.row)"
          >结果</el-button
        >
        <el-button
          v-if="scope.row.status == 0"
          link
          type="primary"
          size="small"
          @click="errBoduModal(scope.row)"
          >错误信息</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <div class="w-full flex flex-row">
    <div class="basis-1/2">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="currChange"
        :page-size="pageSize"
        :total="tableTotal"
        style="margin-top: 10px"
      />
    </div>
    <div class="basis-1/2 inline-block text-right" style="margin-top: 0.51rem">
      <el-button @click="autoRefreshStatus = !autoRefreshStatus">{{
        autoRefreshStatus ? "停止" : "自动刷新"
      }}</el-button>
    </div>
  </div>
  <el-dialog v-model="dialogVisible" :title="modalTitle" width="50%">
    <el-input
      type="textarea"
      resize="none"
      :autosize="{ minRows: 30, maxRows: 30 }"
      v-model="bodyView"
    ></el-input>
  </el-dialog>
  <el-dialog v-model="transContentDialogVisible" :title="transContentTitle" width="50%">
    <el-input
      type="textarea"
      resize="none"
      :autosize="{ minRows: 30, maxRows: 30 }"
      v-model="transContent"
    ></el-input>
  </el-dialog>
  <el-dialog v-model="errDialogVisible" :title="errModalTitle" width="50%">
    <el-input
      type="textarea"
      resize="none"
      :autosize="{ minRows: 30, maxRows: 30 }"
      v-model="errBodyView"
    ></el-input>
  </el-dialog>
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

const pageSize = 15;
const tableTotal = ref<number>(0);
const bodyView = ref("");
const errBodyView = ref("");
const transContent = ref("");





const getRequestRecordFunc = (page: number = 1, size: number = pageSize) => {
  getRequestRecord({ page: page, size: size }).then((res) => {
    if (res.code != 1000) return;
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
  });
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

<style scoped></style>
