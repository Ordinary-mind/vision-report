import { createRouter, createWebHistory } from 'vue-router'
const routes = [
    {
        path: '/',
        redirect: '/xs'
    },
    {
        path: '/xs',
        component: ()=>import('../views/xspread/index.vue')
    },
    {
        path: '/preview',
        component: ()=>import('../views/preview/index.vue')
    },

]
const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router