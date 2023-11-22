<template>
  <el-table :data="tableData" style="width: 100%" :row-class-name="tableRowClassName">
    <el-table-column prop="id" label="ID" />
    <el-table-column prop="clientIp" label="客户端IP" />
    <el-table-column prop="statusName" label="状态" />
    <el-table-column prop="createTime" label="操作时间" />
    <el-table-column fixed="right" label="操作" width="240">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="bodyModal(scope.row)">请求内容</el-button>
        <el-button v-if="scope.row.status == 0" link type="primary" size="small" @click="errBoduModal(scope.row)">错误信息</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination background layout="prev, pager, next" @current-change="currChange" :page-size="pageSize" :total="tableTotal" style="margin-top: 10px" />
  <el-dialog
      v-model="dialogVisible"
      :title="modalTitle"
      width="50%"
  >
    <el-input type="textarea" resize="none" :autosize="{ minRows: 30, maxRows: 30 }" v-model="bodyView"></el-input>
  </el-dialog>
  <el-dialog
      v-model="errDialogVisible"
      :title="errModalTitle"
      width="50%"
  >
    <el-input type="textarea" resize="none" :autosize="{ minRows: 30, maxRows: 30 }" v-model="errBodyView"></el-input>
  </el-dialog>
</template>

<script setup lang="ts">
import {ref} from "vue";
import type {RequestRecordList} from "@/types/props";
import {getRequestRecord} from "@/api/translate";

const tableRowClassName = ({
  row,
  rowIndex
}: {
  row: RequestRecordList,
  rowIndex: number
}) => {
  if (row.status == 0) {
    return 'warning-row'
  } else {
    return 'success-row'
  }
}

const dialogVisible = ref(false)
const errDialogVisible = ref(false)
const modalTitle = ref("")
const errModalTitle = ref('')

const tableData = ref<RequestRecordList[]>([])

const pageSize = 15
const tableTotal = ref<number>(0)
const bodyView = ref('')
const errBodyView = ref('')

const getRequestRecordFunc = (page: number = 1, size: number = pageSize) => {
  getRequestRecord({page: page, size: size}).then(res => {
    if (res.code != 1000) return;
    console.log(res)
    tableTotal.value = res.data.count
    res.data.list.forEach((value: RequestRecordList) => {
      value.statusName = value.status == 1 ? '成功' : '失败'
      value.errMsg ??= '无'
    })
    tableData.value = res.data.list
  })
}
getRequestRecordFunc()

const currChange = (val: number) => {
  getRequestRecordFunc(val, pageSize)
}

const bodyModal = (row: RequestRecordList) => {
  dialogVisible.value = true
  modalTitle.value = `[${row.id}] 请求内容`
  bodyView.value = JSON.stringify(JSON.parse(row.body), null, 2)
}

const errBoduModal = (row: RequestRecordList) => {
  errModalTitle.value = `[${row.id}] 错误内容`
  errDialogVisible.value = true
  errBodyView.value = row.errMsg
}
</script>

<style scoped>
</style>