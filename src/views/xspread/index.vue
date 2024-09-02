<template>
  <div class="xs-container">
    <div class="xs-container-left">
      <div class="com-header">
        <div class="back-wrap" @click="handleBack">
          <el-icon>
            <Back />
          </el-icon>
          <span>返回</span>
        </div>
      </div>
      <div class="container-sidebar">
        <div class="form-item">
          <span>报表名称</span>
          <el-input v-model="reportData.name"></el-input>
        </div>
        <div class="form-item">
          <span>数据集</span>
          <el-select v-model="reportData.datasetId" placeholder="请选择" filterable @change="handleDatasetChange">
            <el-option v-for="item in datasetList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </div>
        <div class="form-item">
          <span>数据集字段</span>
          <div class="qreport-list">
            <div class="list-item" v-for="item in state.datasetFields" draggable="true"
              @dragstart="handleDragStart($event, item)">{{ item.field }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="xs-container-middle" @drop="handleDrop" @dragover="handleDragOver">
      <div id="xSpreadSheet" style="width: 100%; height: 100%"></div>
    </div>
    <div class="xs-container-right">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本" name="basic">
          <el-form label-position="left" label-width="64px" style="padding: 0 12px">
            <el-form-item label="动作">
              <el-button @click="handlePreview">预览</el-button>
            </el-form-item>
            <el-form-item label="坐标">
              <el-input v-model="selectedCoord" disabled />
            </el-form-item>
            <el-form-item label="值">
              <el-input v-model="activeCell.text" @input="handleActiveCellText" placeholder="请输入值" />
            </el-form-item>
            <el-form-item label="宽度">
              <el-input-number v-model="activeCell.width" controls-position="right" @change="handleCellWidth"
                placeholder="请输入宽度" />
            </el-form-item>
            <el-form-item label="高度">
              <el-input-number v-model="activeCell.height" controls-position="right" @change="handleCellHeight"
                placeholder="请输入高度" />
            </el-form-item>
            <el-form-item label="分组类型">
              <el-select v-model="activeCell.groupType" placeholder="Select" @change="handleGroupTypeChange">
                <el-option v-for="item in groupOptions" :key="item.value" v-bind="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="动态宽度">
              <el-checkbox v-model="activeCell.dynamicWidth" @change="handleDynamicWidthChange" />
            </el-form-item>
            <el-form-item label="计算属性">
              <el-input v-model="activeCell.computed" @input="handleComputedInput" placeholder="请输入值" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import CellRange from 'x-data-spreadsheet/src/core/cell_range';
import localforage from 'localforage';
import { useRoute, useRouter } from 'vue-router';
import { getConfig, setConfig } from '@/utils';
const config = ref({})
const activeTab = ref('basic');
const route = useRoute()
const router = useRouter()
const reportData = ref({})

const datasetList = ref([]);
const state = reactive({
  datasetFields: []
})
const groupOptions = ref([
  { value: 'no', label: '不分组' },
  { value: 'group', label: '向下分组' },
  { value: 'groupRight', label: '向右分组' },
])
const activeCell = ref({
  text: '',
  ri: 0,
  ci: 0,
  width: null,
  height: null,
  groupType: 'no',
  dynamicWidth: false,
  computed: '',
});

const selectedCoord = computed(() => {
  const { ri, ci } = activeCell.value;
  return `${ri},${ci}`;
});
const handleComputedInput = (e) => {
  const { dataset, ri, ci } = activeCell.value
  if (dataset) {
    const text = `#{test.computed(${e})}`
    activeCell.value.text = text
    xsInstance.sheet.data.setCellText(ri, ci, text, 'finished');
    xsInstance.reRender();
  }
}
const handleActiveCellText = (e) => {
  xsInstance.sheet.data.setSelectedCellText(e);
  xsInstance.reRender();
};
const handleCellWidth = (e) => {
  xsInstance.sheet.data.setColWidth(activeCell.value.ci, +e);
  xsInstance.reRender();
};
const handleCellHeight = (e) => {
  xsInstance.sheet.data.setRowHeight(activeCell.value.ri, +e);
  xsInstance.reRender();
};
const getExpressionStr = (dataset, field, groupType) => {
  let str = ''
  switch (groupType) {
    case 'no':
      str = `#{${dataset}.${field}}`
      break
    case 'group':
      str = `#{${dataset}.group(${field})}`
      break
    case 'groupRight':
      str = `#{${dataset}.groupRight(${field})}`
      break
  }
  return str
}
const handleGroupTypeChange = e => {
  const cell = xsInstance.sheet.data.getSelectedCell()
  const { dataset, field } = cell
  cell.groupType = e
  if (dataset && field) {
    cell.text = getExpressionStr(dataset, field, e)
  }
  xsInstance.reRender()
  syncCellData()
}
const handleDynamicWidthChange = e => {
  const cell = xsInstance.sheet.data.getSelectedCell()
  cell.dynamicWidth = e
  xsInstance.reRender()
  syncCellData()
}
const handleDragStart = (event, data) => {
  event.dataTransfer.setData('data', JSON.stringify(data));
};
const handleDrop = (e) => {
  const data = e.dataTransfer.getData('data');
  const { dataset, field } = JSON.parse(data);
  const text = `#{${dataset}.${field}}`;
  const { ri, ci } = xsInstance.sheet.data.selector;
  xsInstance.sheet.data.setCellText(ri, ci, text, 'finished');
  const cell = xsInstance.sheet.data.getCell(ri, ci)
  cell.dataset = dataset
  cell.field = field
  cell.groupType = 'no'
  cell.dynamicWidth = false
  xsInstance.reRender();
  syncCellData()
};
const syncCellData = () => {
  let cell = xsInstance.sheet.data.getSelectedCell() || {}
  const { ri, ci } = xsInstance.sheet.data.selector;
  const { width, height } = xsInstance.sheet.data.getSelectedRect();
  activeCell.value = {
    ...cell,
    ri,
    ci,
    width,
    height
  };
}
const handlePreview = () => {
  const originData = xsInstance.sheet.data.getData();
  Object.assign(originData, option)
  reportData.value.data = JSON.stringify(originData)
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
    const findObj = datasetList.value.find((a) => a.key === pattern.dataset);
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
        previewData = JSON.stringify(cloneData)
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
        previewData = JSON.stringify(cloneData)
      }
    }
    else {
      previewData = JSON.stringify(originData)
    }
  }
  const key = 'previewData';
  localforage.setItem(key, previewData);
  const findIndex = config.value.reportList.findIndex(a => a.id === reportData.value.id)
  config.value.reportList[findIndex] = reportData.value
  setConfig(config.value)
  router.push(`/preview/${reportData.value.id}`)
};
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
const handleDragOver = (e) => {
  const { clientX, clientY } = e;
  const { ri, ci } = xsInstance.sheet.data.getCellRectByXY(clientX - 220, clientY - 40);
  xsInstance.sheet.selector.set(ri, ci, true);
  e.preventDefault();
};
const handleDatasetChange = () => {
  handleAnalysis()
};
const handleAnalysis = () => {
  const findObj = datasetList.value.find(a => a.id === reportData.value.datasetId)
  if (findObj) {
    const data = JSON.parse(findObj.data)
    const obj = Array.isArray(data) ? data.length ? data[0] : {} : data
    state.datasetFields = Object.keys(obj).map(key => {
      return {
        field: key,
        dataset: findObj.key
      }
    })
  }
  else {
    state.datasetFields = []
  }
}
const handleBack = () => {
  router.push('/list')
}
let xsInstance = null;
const option = {
  row: {
    len: 100,
    height: 25
  },
  col: {
    len: 26,
    width: 100,
    minWidth: 10
  },
}
onMounted(async () => {
  const data = await getConfig()
  config.value = data
  reportData.value = data.reportList.find(a => a.id === route.params.id)
  datasetList.value = data.datasetList
  handleAnalysis()
  const options = {
    mode: 'edit', // edit | read
    showToolbar: true,
    showBottomBar: false,
    showGrid: true,
    showContextmenu: true,
    view: {
      height: () => document.getElementById('xSpreadSheet').clientHeight,
      width: () => document.getElementById('xSpreadSheet').clientWidth,
    },
    ...option,
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
  x_spreadsheet.locale('zh-cn', x_spreadsheet.$messages['zh-cn']);
  const editorData = JSON.parse(reportData.value.data)
  xsInstance = new x_spreadsheet('#xSpreadSheet', options).loadData(editorData) // load data
  xsInstance.reRender()
  xsInstance.on('cell-selected', (cell, ri, ci) => {
    syncCellData()
  });
  window.xsInstance = xsInstance;
});
</script>

<style lang="scss">
@import './index.scss';
</style>
