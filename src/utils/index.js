
import localforage from 'localforage'
import config from '@/config';
export const getId = (e) => {
    e = e || 16;
    var t = "abcdefhijkmnprstwxyz2345678",
        a = t.length,
        n = "";
    for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n
}
const key = 'config'
export const getConfig = async () => {
    if (!localStorage.getItem('initFlag')) {
        await localforage.setItem(key, JSON.stringify(config))
        localStorage.setItem('initFlag', '1')
        return config
    }
    const data = await localforage.getItem(key)
    return JSON.parse(data)
}

export const setConfig = async (data) => {
    localforage.setItem(key, JSON.stringify(data))
}