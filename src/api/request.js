import axios from "axios";
import to from 'await-to-js'
import { ElMessage } from "element-plus/es";
const instance = axios.create({

})
instance.interceptors.request.use(config => {
    config.headers['token'] = sessionStorage.getItem('token')
    return config
}, error => {
    console.log(111, error)
})

instance.interceptors.response.use(function (response) {
    if (response.status === 200) {
        const { code, message } = response.data
        switch (code) {
            case 2:
                ElMessage.error(message)
                throw new Error(response.data)
            default:
                break
        }
    }
    return response
})

export const request = {
    async get(url, params) {
        const [err, res] = await to(instance({
            method: 'get',
            url,
            params,
        }))
        return [err, res ? res.data : null]
    },
    async post(url, data) {
        const [err, res] = await to(instance({
            method: 'post',
            url,
            data,
        }))
        return [err, res ? res.data.data : null]
    }
}

export default request