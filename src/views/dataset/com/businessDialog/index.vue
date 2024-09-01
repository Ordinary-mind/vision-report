<template>
    <el-dialog v-model="state.visible" :title="state.title" width="840px" :before-close="handleClose">
        <el-form ref="formRef" :rules="rules" :model="state.form" :label-width="95">
            <el-form-item label="数据集编码" prop="key">
                <el-input v-model="state.form.key" :disabled="!!state.form.id" placeholder="请输入数据集编码" />
            </el-form-item>
            <el-form-item label="数据集名称" prop="name">
                <el-input v-model="state.form.name" placeholder="请输入数据集名称" />
            </el-form-item>
            <el-form-item label="数据集类型" prop="type">
                <el-select v-model="state.form.type" placeholder="请选择" clearable disabled>
                    <el-option v-for="item in state.sourceTypeList" :key="item.value" :label="item.label"
                        :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="数据" prop="data" class="full-width">
                <el-input v-model="state.form.data" type="textarea" :rows="8" placeholder="请填入数据"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="handleConfirm">确定</el-button>
        </template>
    </el-dialog>
</template>
<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
const emit = defineEmits(['command']);
defineOptions({
    name: 'bussinessDialog'
})
const formRef = ref();
const rules = ref({
    key: [{ required: true, message: '数据集编码不能为空' }],
    name: [{ required: true, message: '数据集名称不能为空' }],
    data: [{ required: true, message: '数据不能为空' }],
});
const state = reactive({
    visible: false,
    title: '',
    form: { id: '', name: '', code: '', },
    sourceTypeList: []
})
const handleOpen = (e) => {
    Object.assign(state, e)
    nextTick(() => {
        formRef.value.clearValidate()
    })
    state.visible = true
}
const handleClose = () => {
    state.visible = false
};
defineExpose({
    handleOpen, handleClose
})
const getParsedKeyList = () => {
    eval(`(${state.form.data})`);
};
const handleConfirm = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            try {
                getParsedKeyList();
                emit('command', { form: state.form });
            } catch (err) {
                console.log(99, err)
                ElMessage.error('数据格式错误');
            }
        }
    });
};
</script>
<style lang="scss"></style>