<template>
    <div class="preview-page">
        <div class="preview-header">
            <div class="com-header">
                <div class="back-wrap" @click="handleBack">
                    <el-icon>
                        <Back />
                    </el-icon>
                    <span>返回</span>
                </div>
            </div>
        </div>
        <div ref="container" class="q-report-view"></div>
    </div>
</template>
<script setup>
import { onMounted, ref, watch, nextTick } from "vue";
import { useRoute, useRouter } from 'vue-router';
const props = defineProps({
    propData: {
        type: Object,
        default: () => { return {} }
    }
})
defineOptions({
    name: 'qReportView'
})

const route = useRoute()
const router = useRouter()
const getTextWidth = (text, style) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const font = style.font || {
        name: 'Arial',
        size: 10,
        bold: false,
        italic: false,
    }
    const { size, bold, italic, name } = font
    const fontSize = parseInt(size * window.devicePixelRatio, 10)
    let fontStr = ''
    if (italic) {
        fontStr += 'italic '
    }
    if (bold) {
        fontStr += 'bold '
    }
    fontStr += `${fontSize}px `
    if (name) {
        fontStr += name
    }
    context.font = fontStr;
    const metrics = context.measureText(text)
    const actual = Math.abs(metrics.actualBoundingBoxLeft) + Math.abs(metrics.actualBoundingBoxRight);
    const width = Math.max(metrics.width, actual) + 4;
    return width
}

const container = ref()
const qReportInstance = ref(null)
const instanceData = ref(null)
const handleData = () => {
    const renderData = () => {
        const { rows, styles, cols, col } = instanceData.value
        if (!rows) {
            return
        }
        console.log(111, instanceData.value)
        const calcCols = {}
        const mergeKeys = []
        let colsCount = 0
        Object.values(rows).forEach(row => {
            if (typeof row === 'object') {
                Object.keys(row.cells).forEach(key => {
                    const cell = row.cells[key]
                    const { style, text, dynamicWidth } = cell
                    const num = +key
                    colsCount = Math.max(colsCount, num + 1)
                    if (dynamicWidth) {
                        if (!mergeKeys.includes(key)) {
                            mergeKeys.push(key)
                        }
                        const realStyle = styles[style] || {}
                        const width = getTextWidth(text, realStyle)
                        const item = Reflect.get(calcCols, key)
                        const oldWidth = item ? item.width : 0
                        const finalWidth = Math.max(width, oldWidth)
                        if (item) {
                            item.width = finalWidth
                        }
                        else {
                            Reflect.set(calcCols, key, { width: finalWidth })
                        }
                    }
                })
            }
        })
        const rowsCount = Object.keys(rows).reduce((pre, cur) => {
            if (!isNaN(+cur)) {
                return +cur + 1
            }
            return pre
        }, 0)
        mergeKeys.forEach(key => {
            cols[key] = calcCols[key]
        });
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
const handleBack = () => {
    router.go(-1)
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
    qReportInstance.value = new x_spreadsheet(container.value, options)
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
.preview-page {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .preview-header {
        height: 60px;
    }

    .q-report-view {
        flex: 1;
        overflow: hidden;

        .x-spreadsheet-selector .x-spreadsheet-selector-area {
            display: none !important;
        }
    }

}
</style>