// axios二次封装

import axios from "axios";
import store from "@/store";
const service = axios.create({
    baseURL:'/api',
    // baseURL:'http://localhost:3000',
    timeout:30000,
    // withCredentials: true,//要搜索一下
})

service.interceptors.request.use(config => {

    // 将用户id保存到请求头中
    // let userId = store.state.user.userId
    // if(userId) {
    //     config.headers.userId = userId
    // }

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