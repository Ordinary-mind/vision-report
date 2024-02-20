<template>
  <el-dialog v-model="visible" title="数据源配置" width="840px" :before-close="handleClose">
    <el-form ref="formRef" :rules="rules" :model="form" inline :label-width="95">
      <el-form-item label="数据集编码" prop="key">
        <el-input v-model="form.key" :disabled="datasetKeyEditable" />
      </el-form-item>
      <el-form-item label="数据集名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="数据" prop="data" class="full-width">
        <el-input v-model="form.data" type="textarea" :rows="8"></el-input>
      </el-form-item>
      <el-form-item label="操作">
        <el-button type="primary" @click="handleAnalysis">解析数据</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column type="index" width="60" label="序号" />
      <el-table-column prop="key" label="字段" width="150" />
      <el-table-column prop="name" label="字段解读">
        <template #default="scope">
          <el-input v-model="scope.row.name"></el-input>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>
<script setup>
import { onMounted, ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
const emit = defineEmits(['close', 'confirm']);
const props = defineProps(['data']);
const visible = ref(true);
const form = ref({ key: '', data: '' });
const formRef = ref();
const rules = ref({
  key: [{ required: true, message: '数据集编码不能为空' }],
  name: [{ required: true, message: '数据集名称不能为空' }],
  data: [{ required: true, message: '数据不能为空' }],
});
const datasetKeyEditable = computed(() => {
  return Boolean(props.data);
});
const tableData = ref([]);
const handleClose = () => {
  emit('close');
};
const getParsedKeyList = () => {
  const data = eval(form.value.data);
  if (!Array.isArray(data)) {
    throw new Error('数据格式错误');
  }
  const firstItem = data[0] || {};
  const arr = [];
  Object.keys(firstItem).forEach((key) => {
    arr.push({ key, name: key });
  });
  return arr;
};
const handleConfirm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      try {
        const data = getParsedKeyList();
        if (!form.value.keyList) {
          form.value.keyList = data;
        }
        emit('confirm', form.value);
      } catch (err) {
        ElMessage.error('数据格式错误');
      }
    }
  });
};
const handleAnalysis = () => {
  try {
    tableData.value = getParsedKeyList();
  } catch (err) {
    ElMessage.error('数据格式错误');
  }
};
onMounted(() => {
  if (props.data) {
    form.value = JSON.parse(JSON.stringify(props.data));
    tableData.value = form.value.keyList;
  }
});
</script>
<style lang="scss"></style>
