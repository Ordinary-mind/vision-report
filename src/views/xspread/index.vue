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
  storeConfig()
  router.push(`/preview/${reportData.value.id}`)
};

const storeConfig = () => {
  const originData = xsInstance.sheet.data.getData();
  Object.assign(originData, option)
  reportData.value.data = JSON.stringify(originData)
  const findIndex = config.value.reportList.findIndex(a => a.id === reportData.value.id)
  config.value.reportList[findIndex] = reportData.value
  setConfig(config.value)
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
  window.addEventListener('beforeunload', () => {
    storeConfig()
  })
});
</script>

<style lang="scss">
@import './index.scss';
</style>
