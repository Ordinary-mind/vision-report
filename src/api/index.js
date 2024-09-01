import request from './request'
const appBase = '/reportApi'
const api = {
    login: async params => {
        return await request.post(`${appBase}/api/login`, params)
    },
    register: async params => {
        return await request.post(`${appBase}/api/register`, params)
    }
}
export default api