// index.ts
import qReportViewCom from "./qReportView/index.vue";

const components = [qReportViewCom]

const qReportView = {
  install(App) {
    components.forEach((item) => {
      App.component(item.name, item)
    })
  }
}
export default qReportView
