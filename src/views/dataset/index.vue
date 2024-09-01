<template>
    <div>
        <div class="search-form">
            <div class="search-form-item">
                <span>关键词</span>
                <el-input v-model="state.query.keyword" placeholder="请输入关键词搜索..." clearable
                    style="width: 200px;"></el-input>
            </div>
            <div class="search-form-item">
                <span>数据集类型</span>
                <el-select v-model="state.query.type" placeholder="请选择" clearable style="width: 150px;">
                    <el-option v-for="item in sourceTypeList" :key="item.value" :label="item.label"
                        :value="item.value" />
                </el-select>
            </div>
            <div class="search-form-item">
                <el-button type="primary" @click="handleQuery">查询</el-button>
            </div>
            <div class="search-form-item">
                <el-button type="primary" @click="handleAdd">新增数据集</el-button>
            </div>
        </div>
        <el-table :data="tableData" stripe>
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="name" label="数据集名称" />
            <el-table-column prop="type" label="数据集类型">
                <template #default="scope">
                    {{ sourceTypeObj[scope.row[scope.column.property]] }}
                </template>
            </el-table-column>
            <el-table-column prop="key" label="编码" />
            <el-table-column prop="createdOn" label="创建时间" />
            <el-table-column prop="updatedOn" label="修改时间" />
            <el-table-column label="操作" width="150">
                <template #default="scope">
                    <el-button link type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button link type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <business-dialog ref="businessDialogRef" @command="handleBusinessDialogCommand"></business-dialog>
    </div>
</template>

<script setup lang="ts">
import config from '@/config'
import { ElMessageBox, ElMessage } from 'element-plus'
import businessDialog from './com/businessDialog/index.vue'
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { getId } from '@/utils';
defineOptions({
    name: 'dataset'
})
const originData = config.datasetList
const tableData = ref([])
const sourceTypeList = [
    { value: 'json', label: 'JSON数据集' },
    { value: 'api', label: 'API数据集' },
    { value: 'sql', label: 'SQL数据集' },
]
const sourceTypeObj = {
    'json': 'JSON数据集',
    'api': 'API数据集',
    'sql': 'SQL数据集',
}
const state = reactive({
    query: {
        type: '',
        keyword: ''
    }
})
const handleEdit = (e) => {
    businessDialogRef.value.handleOpen({
        title: '编辑数据集',
        form: cloneDeep(e),
        sourceTypeList
    })
}
const handlePreview = (e) => {
    console.log(222, e)
}
const handleQuery = () => {
    tableData.value = originData.filter(a => {
        const { keyword, type } = state.query
        const flag1 = !type || a.type === type
        const flag2 = !keyword || a.name.includes(keyword)
        return flag1 && flag2
    })
}
const handleAdd = () => {
    businessDialogRef.value.handleOpen({
        title: '新增数据集',
        form: {
            id: '',
            name: '',
            type: 'json',
            key: '',
            data: '[]',
            createdOn: '',
            updatedOn: '',
        },
        sourceTypeList
    })
}
const handleDelete = (e) => {
    ElMessageBox.confirm(
        `是否确定删除数据集【${e.name}】？`,
        '警告',
    )
        .then(() => {
            const findIndex = originData.findIndex(a => a.id === e.id)
            console.log(findIndex)
            originData.splice(findIndex, 1)
            handleQuery()
            ElMessage.success('删除成功')
        })
        .catch(() => {
        })
}
const businessDialogRef = ref()
const handleBusinessDialogCommand = (e) => {
    const data = e.form
    data.updatedOn = dayjs().format('YYYY-MM-DD HH:mm:ss')
    if (!data.id) {
        data.id = getId()
        data.createdOn = dayjs().format('YYYY-MM-DD HH:mm:ss')
        originData.unshift(data)
    }
    else {
        const findObj = originData.find(a => a.id === data.id)
        Object.assign(findObj, data)
    }
    handleQuery()
    businessDialogRef.value.handleClose()
}
onMounted(() => {
    handleQuery()
})
</script>

<style scoped></style>