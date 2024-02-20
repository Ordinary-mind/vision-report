<template>
  <div class="xs-container">
    <div class="xs-container-left">
      <div class="container-sidebar">
        <div class="dataset-add">
          <span>数据集管理</span>
          <el-dropdown @command="handleCommand">
            <div class="icon-wrap">
              <el-icon :size="16">
                <Plus />
              </el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="json">JSON数据集</el-dropdown-item>
                <el-dropdown-item command="api">API数据集</el-dropdown-item>
                <el-dropdown-item command="sql">SQL数据集</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item v-for="(item, index) in datasetList" :key="item.key" :name="item.key">
            <template #title>
              <div class="flex-layout full-width" style="margin: 0px 16px 0px 24px">
                <el-tooltip effect="dark" :content="item.name" placement="top" :enterable="false">
                  <span style="line-height: 20px">{{ item.key }}</span>
                </el-tooltip>
                <div class="flex-layout">
                  <div class="icon-wrap" title="编辑" @click.stop="handleEditDataset(item, index)">
                    <el-icon :size="16">
                      <Edit />
                    </el-icon>
                  </div>
                  <div class="icon-wrap" title="删除" @click.stop="handleDeleteDataset(item, index)">
                    <el-icon :size="16">
                      <Close />
                    </el-icon>
                  </div>
                </div>
              </div>
            </template>
            <ul class="qreport-list">
              <li class="list-item" v-for="(it, i) in item.keyList" :key="`key_${index}_${i}`" draggable="true"
                @dragstart="handleDragStart($event, item, it)">
                <el-tooltip effect="dark" :content="it.name" placement="bottom" :enterable="false">
                  <span>{{ it.key }}</span>
                </el-tooltip>
              </li>
            </ul>
          </el-collapse-item>
        </el-collapse>
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
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
    <datasetComponent v-if="datasetVisible" :data="datasetList[datasetIndex]" @close="handleCloseDataset"
      @confirm="handleConfirm"></datasetComponent>
  </div>
</template>
<script setup>
import { onMounted, ref, computed } from 'vue';
import Spreadsheet from 'x-data-spreadsheet';
import { ElMessage } from 'element-plus';
import CellRange from 'x-data-spreadsheet/src/core/cell_range';
import zhCN from 'x-data-spreadsheet/src/locale/zh-cn';
import datasetComponent from '../dataset/index.vue';
import localforage from 'localforage';
const activeNames = ref(['dataset1']);
const datasetVisible = ref(false);
const activeTab = ref('basic');
const datasetIndex = ref(0);
const handleCommand = (command) => {
  if (command !== 'json') {
    return ElMessage.error('目前暂时只支持JSON数据集，敬请期待其他数据集！');
  }
  handleCreateDataset('json');
};
const datasetList = ref([
  {
    key: 'dataset1',
    name: '数据集1',
    keyList: [
      { key: 'date', name: '日期' },
      { key: 'name', name: '名称' },
      { key: 'address', name: '地址' },
    ],
    data: JSON.stringify([
      {
        date: '2016-05-03',
        name: 'Jim',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-02',
        name: 'Jim',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
    ]),
  },
  {
    key: 'dataset2',
    name: '数据集2',
    keyList: [{ key: 'name', name: '姓名' }, { key: 'num', name: '学号' }, { key: 'subject', name: '学科' }, { key: 'score', name: '分数' }],
    data: JSON.stringify([
      { name: '张三', num: '001', subject: '语文', score: 87 },
      { name: '张三', num: '001', subject: '数学', score: 69 },
      { name: '李四', num: '002', subject: '数学', score: 77 },
      { name: '王五', num: '003', subject: '英语', score: 92 },
    ]),
  },
]);
const groupOptions = ref([
  { value: '', label: '不分组' },
  { value: 'group', label: '向下分组' },
  { value: 'groupRight', label: '向右分组' },
])
const activeCell = ref({
  text: '',
  ri: 0,
  ci: 0,
  width: null,
  height: null,
  groupType: ''
});
const handleEditDataset = (item, index) => {
  datasetIndex.value = index;
  datasetVisible.value = true;
};
const handleCreateDataset = () => {
  datasetIndex.value = -1;
  datasetVisible.value = true;
};
const handleDeleteDataset = (item, index) => {
  if (datasetList.value.length <= 1) {
    return ElMessage.error('数据集个数不能少于1');
  }
};

const handleCloseDataset = () => {
  datasetVisible.value = false;
};
const handleConfirm = (data) => {
  datasetVisible.value = false;
  if (datasetIndex.value === -1) {
    datasetList.value.push(data);
  } else {
    datasetList.value[datasetIndex.value] = data;
  }
};
const selectedCoord = computed(() => {
  const { ri, ci } = activeCell.value;
  return `${ri},${ci}`;
});

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
const handleGroupTypeChange = e => {
  xsInstance.sheet.data.getSelectedCell().groupType = e
}
const handleDragStart = (event, dataset, data) => {
  const obj = {
    datasetKey: dataset.key,
    data,
  };
  event.dataTransfer.setData('data', JSON.stringify(obj));
};
const handleDrop = (e) => {
  const data = e.dataTransfer.getData('data');
  const json = JSON.parse(data);
  const text = `#{${json.datasetKey}.${json.data.key}}`;
  const { ri, ci } = xsInstance.sheet.data.selector;
  xsInstance.sheet.data.setCellText(ri, ci, text, 'finished');
  xsInstance.reRender();
};
const handlePreview = () => {
  const originData = xsInstance.sheet.data.getData();
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
    Object.keys(originCells).forEach((key) => {
      const cell = originCells[key];
      let { text } = cell;
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
  if (formulaRowIndex > -1) {
    for (let i = 0; i < formulaRowIndex; i++) {
      constructRows[i] = originRows[i];
    }
  }
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
      const key = 'previewData';
      localforage.setItem(key, JSON.stringify(cloneData));
      window.open('/preview');
    }
  } else {
    ElMessage.error('未找到数据源');
  }
};
const handleDragOver = (e) => {
  const { clientX, clientY } = e;
  const { ri, ci } = xsInstance.sheet.data.getCellRectByXY(clientX - 220, clientY - 40);
  xsInstance.sheet.selector.set(ri, ci, true);
  e.preventDefault();
};
const handleChange = (e) => { };
let xsInstance = null;
onMounted(() => {
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
    row: {
      len: 100,
      height: 25,
    },
    col: {
      len: 26,
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
  Spreadsheet.locale('zh-cn', zhCN);
  xsInstance = new Spreadsheet('#xSpreadSheet', options)
    .loadData({
      name: 'sheet2',
      freeze: 'A1',
      styles: [
        {
          border: {
            bottom: ['thin', '#000'],
            top: ['thin', '#000'],
            left: ['thin', '#000'],
            right: ['thin', '#000'],
          },
        },
        {
          border: {
            bottom: ['thin', '#000'],
            top: ['thin', '#000'],
            left: ['thin', '#000'],
            right: ['thin', '#000'],
          },
          bgcolor: '#d8d8d8',
        },
        {
          format: 'percent',
        },
        {
          format: 'datetime',
        },
        {
          format: 'date',
        },
        {
          format: 'text',
        },
        {
          format: 'normal',
        },
        {
          align: 'center',
        },
        {
          align: 'center',
          font: {
            size: 12,
          },
        },
        {
          align: 'center',
          font: {
            size: 14,
          },
        },
      ],
      merges: ['A1:C1'],
      rows: {
        0: {
          cells: {
            0: {
              merge: [0, 2],
              text: '统计报表',
              style: 9,
            },
            1: {
              style: 9,
            },
            2: {
              style: 9,
            },
          },
          height: 41,
        },
        1: {
          cells: {
            0: {
              text: '日期',
              style: 1,
            },
            1: {
              text: '姓名',
              style: 1,
            },
            2: {
              text: '地址',
              style: 1,
            },
          },
        },
        2: {
          cells: {
            0: {
              style: 0,
              text: '#{userApi.date}',
            },
            1: {
              style: 0,
              text: '#{userApi.group(name)}',
            },
            2: {
              style: 0,
              text: '#{userApi.address}',
            },
          },
        },
        3: {
          cells: {
            0: {
              style: 6,
            },
          },
        },
        4: {
          cells: {
            0: {},
          },
        },
        5: {
          cells: {
            0: {},
            3: {},
          },
        },
        6: {
          cells: {
            0: {},
          },
        },
        7: {
          cells: {
            0: {},
          },
        },
        len: 101,
      },
      cols: {
        0: {
          width: 120,
        },
        1: {
          width: 149,
        },
        2: {
          width: 152,
        },
        len: 26,
      },
      validations: [],
      autofilter: {},
    }) // load data
    .change((data) => {
      // console.log(JSON.stringify(data))
      // save data to db
    });
  xsInstance.on('cell-selected', (cell, ri, ci) => {
    let obj = cell || {};
    const { width, height } = xsInstance.sheet.data.getSelectedRect();
    activeCell.value = {
      text: obj.text || '',
      ri,
      ci,
      width,
      height,
      groupType: obj.groupType || ''
    };
    console.log(activeCell)
  });
  window.xsInstance = xsInstance;
});
</script>
<style lang="scss">
@import './index.scss';
</style>
