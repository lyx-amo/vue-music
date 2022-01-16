// axios二次封装

import axios from "axios";

const service = axios.create({
    baseURL:'/api',
    // baseURL:'http://localhost:3000',
    timeout:30000,
    withCredentials: true,//要搜索一下
})

service.interceptors.request.use(config => {
    return config
})


service.interceptors.response.use(
    response => {
        return response.data
    },
    error => {
        alert(error.message || '请求错误')
        throw error
    }
)


export default service