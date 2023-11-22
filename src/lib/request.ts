import type {AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig} from 'axios'
import axios from 'axios'
import {ElMessage} from "element-plus";
import Router from "@/router";

let baseKey = ''

// 创建axios实例
const request = axios.create({
    baseURL: 'http://127.0.0.1:9431',
    timeout: 60 * 1000,
    params: {}
});
request.interceptors.request.use(function (config:InternalAxiosRequestConfig) {
    config.params['key'] = localStorage.getItem('key')
    // 在发送请求之前做些什么
    return config;
}, function (error: any) {
    // 对请求错误做些什么
    console.log(error)
    return Promise.reject(error);
});

// 添加响应拦截器
request.interceptors.response.use(function (response: AxiosResponse) {
    if (response.data.code != 1000) {
        ElMessage.warning(response.data.msg)
    }/* else {
        ElMessage.success(response.data.msg)
    }*/
    // 成功返回时处理数据
    return response;
}, function (error: AxiosError<{code: number, msg: string, time: number}>) {
    let data = error.response?.data
    if (data) {
        ElMessage.error(data.msg ?? '操作出错')
        Router.push('/login').then(r => {})
    }
    // 出错时调用
    return Promise.reject(error);
});


export interface Response<T = any> {
    code: number,
    data: T,
    msg: string,
    time: number
}

const req = async <T>(config: AxiosRequestConfig) => {
    const res = await request(config)
    return (res.data) as T
}
export default req