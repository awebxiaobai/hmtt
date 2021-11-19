import axios from "axios";
import store from "../store";
const BASE_URL = 'http://toutiao.itheima.net'
let isPut = false
axios.interceptors.request.use((config) => {
    if (store.state.tokenObj.token) {
        if (isPut) {
            config.headers.Authorization = "Bearer " + store.state.tokenObj.refresh_token
        } else {
            config.headers.Authorization = "Bearer " + store.state.tokenObj.token
        }
    }
    return config
}, (err) => {
    return Promise.reject(err)
})
axios.interceptors.response.use((response) => {
    return response
}, async (err) => {
    if (err.response.status === 401) {
        const res = await refreshToken()
        store.dispatch('recordTokenObj', {
            token: res.data.token,
            refresh_token: store.state.tokenObj.refresh_token
        })
        const userInfo = await ajax(BASE_URL + '/v1_0/user/profile')
        return { data: userInfo }

    } else {
        return Promise.reject(err)
    }
})
export default function ajax(url, data = {}, method = 'GET') {
    return new Promise((resolve, reject) => {
        let promise
        if (method === 'GET') {
            isPut = false
            promise = axios.get(url, {
                params: data
            })
        } else if (method === 'POST') {
            isPut = false
            promise = axios.post(url, data)
        } else if(method==='PUT'){
            isPut = true
            promise = axios.put(url,data)
        }else if(method==='PATCH'){
            isPut=false
            promise=axios.patch(url,data)
        }else{
            isPut=false
            promise=axios.delete(url)
        }
        promise.then((response) => {
            resolve(response.data)
        }).catch((err) => {
            reject(err)
        })
    })
}
const refreshToken = () => ajax(BASE_URL + '/v1_0/authorizations', {}, 'PUT')