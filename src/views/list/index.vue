<template>
    <div>
        <div class="search-form">
            <div class="search-form-item">
                <span>关键词</span>
                <el-input v-model="state.query.keyword" placeholder="请输入关键词搜索..." clearable
                    style="width: 200px;"></el-input>
            </div>
            <div class="search-form-item">
                <el-button type="primary" @click="handleQuery">查询</el-button>
            </div>
            <div class="search-form-item">
                <el-button type="primary" @click="handleAdd">新建报表</el-button>
            </div>
        </div>
        <el-table :data="tableData" stripe>
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="name" label="报表名称" />
            <el-table-column prop="createdOn" label="创建时间" />
            <el-table-column prop="updatedOn" label="修改时间" />
            <el-table-column label="操作" width="150">
                <template #default="scope">
                    <el-button link type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button link type="primary" size="small" @click="handlePreview(scope.row)">预览</el-button>
                    <el-button link type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup lang="ts">
import { getId, getConfig, setConfig } from '@/utils';
import dayjs from 'dayjs';
import { ElMessageBox, ElMessage } from 'element-plus'
import { useRouter } from 'vue-router';
defineOptions({
    name: 'reportList'
})
let config = {} as any
let originData = []
const router = useRouter()
const tableData = ref([])
const state = reactive({
    query: {
        keyword: ''
    }
})
const handleEdit = (e) => {
    const url = `/visionReport/${e.id}`
    // window.open(url)
    router.push(url)
}
const handlePreview = (e) => {
    const url = `/preview/${e.id}`
    window.open(url)
}
const handleQuery = () => {
    tableData.value = originData.filter(a => {
        const { keyword } = state.query
        const flag1 = !keyword || a.name.includes(keyword)
        return flag1
    })
}
const handleDelete = (e) => {
    ElMessageBox.confirm(
        `是否确定删除报表【${e.name}】？`,
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
const handleAdd = () => {
    const nowTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const data = {
        id: getId(),
        name: '未命名',
        createdOn: nowTime,
        updatedOn: nowTime,
        data: '{"name":"sheet2","freeze":"A1","styles":[{"bgcolor":"#e7e5e6"},{"bgcolor":"#e7e5e6","border":{"bottom":["thin","#000"],"top":["thin","#000"],"left":["thin","#000"],"right":["thin","#000"]}},{"border":{"bottom":["thin","#000"],"top":["thin","#000"],"left":["thin","#000"],"right":["thin","#000"]}}],"merges":[],"rows":{"0":{"cells":{"0":{},"1":{},"2":{}}},"1":{"cells":{"0":{"dataset":"address","field":"name","groupType":"group","dynamicWidth":true},"1":{"dataset":"address","field":"email","groupType":"no","dynamicWidth":true},"2":{"dataset":"address","field":"address","groupType":"group","dynamicWidth":true}}},"len":100},"cols":{"len":26},"validations":[],"autofilter":{}}',
        datasetId: '',
    }
    originData.unshift(data)
    setConfig(config)
    router.push(`/visionReport/${data.id}`)
}
onMounted(async () => {
    config = await getConfig()
    originData = config.reportList
    handleQuery()
    window.addEventListener('beforeunload', () => {
        setConfig(config)
    })
})
</script>

<style scoped></style>