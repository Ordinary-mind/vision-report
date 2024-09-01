import { createRouter, createWebHistory } from 'vue-router'
const routes = [
    {
        path: '/',
        redirect: '/list'
    },
    {
        path: '/visionReport/:id?',
        component: () => import('../views/xspread/index.vue')
    },
    {
        path: '/preview/:id?',
        component: () => import('../views/preview/index.vue')
    },
    {
        path: '/login',
        component: () => import('../views/login/index.vue')
    },
    {
        path: '/main',
        component: () => import('../views/main/index.vue'),
        children: [
            {
                path: '/list',
                component: () => import('../views/list/index.vue'),
            },
            {
                path: '/dataset',
                component: () => import('../views/dataset/index.vue'),
            }
        ]
    },

]
const router = createRouter({
    history: createWebHistory(),
    routes
})
router.beforeEach((to, from, next) => {
    if (!localStorage.getItem('token') && to.path !== '/login') {
        next('/login')
    }
    else {
        next()
    }
})
export default router