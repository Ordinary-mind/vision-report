<template>
  <div class="preview-wrapper">
    <qReportView :propData="refData" v-if="initFlag"></qReportView>
  </div>
</template>
<script setup>
// 使用打包后的,把下面的注释
import qReportView from '../../package/qReportView/index.vue'
import CellRange from 'x-data-spreadsheet/src/core/cell_range';
import { ref } from 'vue'
import { getConfig } from '@/utils';
import { useRoute } from 'vue-router';
defineOptions({
  name: 'preview'
})
const route = useRoute()
const initFlag = ref(false)
const refData = ref({})

const analysisExpression = (cell) => {
  let text = cell.text
  const pattern = { dataset: '', cellConfigList: [] }
  if (text && text.startsWith('#{')) {
    text = text.replaceAll(' ', '');
    const a = text.slice(2, text.length - 1);
    const arr = a.split('.');
    if (arr[1].startsWith('group(')) {
      let sliceStr = arr[1].slice(6, arr[1].length - 1);
      pattern.group = true;
      pattern.cellConfigList.push({ key: sliceStr, group: true, ...cell });
    } else {
      pattern.group = false;
      const splitArr = a.split('.');
      pattern.dataset = splitArr[0];
      pattern.dataKey = splitArr[1];
      pattern.cellConfigList.push({ key: splitArr[1], group: false, ...cell });
    }
  }
  return pattern
}

onMounted(async () => {
  const data = await getConfig()
  const reportObj = data.reportList.find(a => a.id === route.params.id)
  const originData = JSON.parse(reportObj.data)
  const { rows: originRows } = originData;
  const pattern = { dataset: '', cellConfigList: [] };
  const constructRows = {};
  let formulaRowIndex = -1; // 公式行所在索引
  Object.keys(originRows).forEach((rowKey) => {
    const row = originRows[rowKey];
    const { cells: originCells } = row;
    if (!originCells) {
      return;
    }
    console.log(111, originCells)
    Object.keys(originCells).forEach((key) => {
      const cell = originCells[key];
      let { text, dataset, field, groupType } = cell;
      if (text && text.startsWith('#{')) {
        formulaRowIndex = +rowKey;
        text = text.replaceAll(' ', '');
        const a = text.slice(2, text.length - 1);
        const arr = a.split('.');
        if (arr[1].startsWith('group(')) {
          let sliceStr = arr[1].slice(6, arr[1].length - 1);
          pattern.group = true;
          pattern.cellConfigList.push({ key: sliceStr, group: true, ...cell });
        } else {
          pattern.group = false;
          const splitArr = a.split('.');
          pattern.dataset = splitArr[0];
          pattern.dataKey = splitArr[1];
          pattern.cellConfigList.push({ key: splitArr[1], group: false, ...cell });
        }
      }
    });
  });
  console.log(9393, pattern)
  if (formulaRowIndex > -1) {
    for (let i = 0; i < formulaRowIndex; i++) {
      constructRows[i] = originRows[i];
    }
  }
  let previewData = ''
  if (pattern.dataset) {
    const findObj = data.datasetList.find((a) => a.key === pattern.dataset);
    if (findObj) {
      const data = JSON.parse(findObj.data);
      if (Array.isArray(data)) {
        let mergeList = [];
        data.forEach((item, rowIndex) => {
          const constructCells = {};
          const finalRowIndex = formulaRowIndex + rowIndex;
          pattern.cellConfigList.forEach((cell, cellIndex) => {
            const text = item[cell.key];
            constructCells[cellIndex] = { ...cell, text };
            if (cell.group) {
              if (finalRowIndex === formulaRowIndex) {
                mergeList.push({ rowIndex: finalRowIndex, cellIndex, rowCount: 1 });
              } else {
                if (data[rowIndex - 1][cell.key] === text) {
                  mergeList.at(-1).rowCount++;
                } else {
                  mergeList.push({ rowIndex: finalRowIndex, cellIndex, rowCount: 1 });
                }
              }
            }
          });
          Reflect.set(constructRows, finalRowIndex, { cells: constructCells });
        });
        mergeList = mergeList.filter((a) => a.rowCount > 1);
        const constructMerges = mergeList.map((item) => {
          const { rowIndex, cellIndex, rowCount } = item;
          constructRows[rowIndex].cells[cellIndex].merge = [rowCount - 1, 0];
          return new CellRange(rowIndex, cellIndex, rowIndex + rowCount, cellIndex).toString();
        });
        const cloneData = JSON.parse(JSON.stringify(originData));
        cloneData.rows = constructRows;
        cloneData.merges = cloneData.merges.concat(constructMerges);
        previewData = cloneData
      }
      else {
        const cloneData = JSON.parse(JSON.stringify(originData));
        const { rows } = cloneData
        Object.keys(rows).forEach(key => {
          const item = rows[key]
          if (item.cells) {
            Object.keys(item.cells).forEach(cellKey => {
              const cell = item.cells[cellKey]
              const result = analysisExpression(cell)
              if (result && result.dataset === findObj.key) {
                cell.text = data[result.dataKey] || ''
              }
            })
          }
        })
        previewData = cloneData
      }
    }
    else {
      previewData = originData
    }
    refData.value = previewData
    initFlag.value = true
  }
})
</script>
<style lang="scss">
.preview-wrapper {
  width: 100%;
  height: 100%;
}
</style>