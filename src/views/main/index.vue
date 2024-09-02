<template>
    <div class="main-layout">
        <el-container>
            <el-header>
                <div class="main-header">
                    <div class="main-header-left">
                        <img src="../../../public/favicon.ico" alt="">
                        <span>{{ config.appName }}</span>
                    </div>
                    <div class="main-header-right">
                        <el-tooltip placement="bottom-end" effect="light" popper-class="report-tooltip">
                            <template #content>
                                <div class="list">
                                    <div class="list-item" @click="handleLogout">退出登录</div>
                                </div>
                            </template>
                            <el-avatar>用户</el-avatar>
                        </el-tooltip>
                    </div>
                </div>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <el-menu :default-active="defaultActive" @select="handleMenuSelect">
                        <el-menu-item v-for="(item) in menuList" :index="item.url">
                            <el-icon>
                                <component :is="item.icon"></component>
                            </el-icon>
                            <span>{{ item.name }}</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup lang="ts">
import { getConfig } from '@/utils';
import { useRouter, useRoute } from 'vue-router';
defineOptions({
    name: 'mainLayout'
})
const config = ref({})
const menuList = ref([])
const router = useRouter()
const route = useRoute()
const defaultActive = computed(() => {
    return route.path
})
const handleLogout = () => {
    localStorage.clear()
    router.push('/login')
}
const handleMenuSelect = (index) => {
    router.push(index)
}

onMounted(async () => {
    const data = await getConfig()
    config.value = data
    menuList.value = data.menuList
})
</script>

<style lang="scss">
.main-layout {
    height: 100%;

    >.el-container {
        height: 100%;

        >.el-header {
            background-color: #c2e0ff;
        }

        .el-aside {
            .el-menu {
                height: 100%;

                .el-menu-item.is-active {
                    background-color: #409eff;
                    color: #ffffff;
                }
            }
        }
    }

    .main-header {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .main-header-left {
            height: 100%;
            display: flex;
            align-items: center;
            font-size: 16px;
            gap: 10px;
        }

        .main-header-right {
            .el-avatar {
                background-color: #409eff;
                cursor: pointer;
            }
        }
    }
}

.list {
    padding: 6px 0px;

    .list-item {
        padding: 6px 12px;
        cursor: pointer;

        &:hover {
            background-color: #f5f7fa;
        }
    }
}

.report-tooltip {
    padding: 0px;
}

.search-form {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 16px;

    .search-form-item {
        margin-right: 16px;
        margin-top: 10px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;

        >span {
            padding: 5px 0;
            font-size: 14px;
        }
    }
}
</style>