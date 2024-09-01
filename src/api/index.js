import request from './request'
const appBase = '/reportApi'
const api = {
    login: async params => {
        return await request.post(`${appBase}/api/login`, params)
    }
}
export default api