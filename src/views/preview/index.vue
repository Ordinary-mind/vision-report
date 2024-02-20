<template>
    <div class="preview-wrapper">
        <qReportView :propData="refData"></qReportView>
    </div>
</template>
<script setup>
// 使用打包后的,把下面的注释
import qReportView from '../../package/qReportView/index.vue'
import localforage from 'localforage'
import { ref } from 'vue'
defineOptions({
  name: 'preview'
})
const refData = ref({})
localforage.getItem('previewData').then(res => {
  refData.value = JSON.parse(res)
})
</script>
<style lang="scss">
.preview-wrapper {
  width: 100%;
  height: 100%;
}
</style>