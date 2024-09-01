<template>
    <div class="login-form">
        <p class="title">{{ config.appName }}</p>
        <el-form label-position="top" :model="form" :rules="rules" ref="formRef" style="width: 100%;">
            <el-form-item label="用户名" prop="userName">
                <el-input size="large" v-model="form.userName" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" size="large" v-model="form.password" placeholder="请输入密码" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="large" class="full-width" style="margin-top: 32px;"
                    @click="handleRegister">注册</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" link @click="handleGotoLogin">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import api from '@/api'
import config from '@/config'
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus/es';
const router = useRouter()
const formRef = ref()
const form = ref({ userName: '', password: '' })
const rules = {
    userName: { required: true, message: '用户名不能为空' },
    password: { required: true, message: '密码不能为空' },
}
const handleRegister = () => {
    formRef.value.validate(async valid => {
        if (valid) {
            const [err, res] = await api.register(form.value)
            if (!err) {
                ElMessage.success('注册成功')
                router.push('/login')
            }
        }
    })
}
const handleGotoLogin = ()=> {
    router.push('/login')
}
</script>
<style lang="scss">
.full-width {
    width: 100% !important;
}

.login-form {
    position: absolute;
    width: 400px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #e1e1e1;
    padding: 32px 64px;
    height: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .title {
        font-size: 24px;
    }
}
</style>