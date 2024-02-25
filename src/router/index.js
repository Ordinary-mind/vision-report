import { createRouter, createWebHistory } from 'vue-router'
const routes = [
    {
        path: '/vision-report',
        redirect: '/vision-report/xs'
    },
    {
        path: '/vision-report/xs',
        component: ()=>import('../views/xspread/index.vue')
    },
    {
        path: '/vision-report/preview',
        component: ()=>import('../views/preview/index.vue')
    },

]
const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router