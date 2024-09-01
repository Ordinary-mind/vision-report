import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import './style.scss'
import './assets/fonts/iconfont/iconfont.js'
import SvgIcon from './components/SvgIcon.vue'
import Vue3ColorPicker from "vue3-colorpicker";
import "vue3-colorpicker/style.css";
import 'element-plus/dist/index.css'
import '@/assets/css/index.scss'

// import qReportView from './package/dist/index' //打包后使用
// main.ts

// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
app.use(Vue3ColorPicker)
app.use(ElementPlus, {
  locale: zhCn,
})
// app.use(qReportView) //打包使用
app.mount('#app')
app.component('SvgIcon', SvgIcon)
