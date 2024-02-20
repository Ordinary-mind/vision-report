<template>
    <div ref="container" class="q-report-view"></div>
</template>
<script setup>
import Spreadsheet from "x-data-spreadsheet";
import { onMounted, ref, watch, nextTick } from "vue";
const props = defineProps({
    propData: {
        type: Object,
        default: () => { return {} }
    }
})
defineOptions({
    name: 'qReportView'
})
const container = ref()
const qReportInstance = ref(null)
const instanceData = ref(null)
const handleData = () => {
    const renderData = () => {
        const { rows } = instanceData.value
        if(!rows) {
            return
        }
        let colsCount = 0
        Object.values(rows).forEach(row => {
            colsCount = Math.max(colsCount, Object.keys(row.cells).length)
        })
        const rowsCount = Object.keys(rows).length
        instanceData.value.rows.len = rowsCount
        instanceData.value.cols.len = colsCount
        qReportInstance.value.loadData(instanceData.value)
        qReportInstance.value.reRender()
    }
    if (!qReportInstance.value) {
        nextTick(() => {
            initQReport()
            renderData()
        })
    }
    else {
        renderData()
    }
}
const initQReport = () => {
    if (qReportInstance.value) {
        return
    }
    const options = {
        mode: 'read', // edit | read
        showToolbar: false,
        showBottomBar: false,
        showGrid: false,
        showContextmenu: false,
        view: {
            height: () => container.value.clientHeight,
            width: () => container.value.clientWidth,
        },
        row: {
            len: 0,
            height: 25,
        },
        col: {
            len: 0,
            width: 100,
            indexWidth: 60,
            minWidth: 60,
        },
        style: {
            bgcolor: '#ffffff',
            align: 'left',
            valign: 'middle',
            textwrap: false,
            strike: false,
            underline: false,
            color: '#0a0a0a',
            font: {
                name: 'Helvetica',
                size: 10,
                bold: false,
                italic: false,
            },
        },
    };
    qReportInstance.value = new Spreadsheet(container.value, options)
}
watch(
    () => props.propData, newValue => {
        instanceData.value = JSON.parse(JSON.stringify(newValue))
        handleData()
    },
    { immediate: true })
onMounted(() => {
    initQReport()
})
</script>
<style lang="scss">
.q-report-view {
    width: 100%;
    height: 100%;

    .x-spreadsheet-selector .x-spreadsheet-selector-area {
        display: none !important;
    }
}
</style>