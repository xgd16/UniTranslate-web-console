import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";
import { ElMessage } from "element-plus";
import Router from "@/router";
import { isJSON, AuthEncrypt } from "./common";
import { useSystemInitConfigStore } from "@/stores/counter";

// Get current environment
const isDev = import.meta.env.DEV;
const apiUrl = import.meta.env.VITE_API_URL;

// Determine the base URL based on environment
const domain = isDev
  ? apiUrl || 'http://localhost:9431'  // Development fallback
  : apiUrl || window.location.origin;   // Production fallback

if (import.meta.env.DEV) {
  console.log('Running in development mode');
  console.log('API URL:', domain);
}

localStorage.setItem("baseUrl", domain);

const baseUrl = localStorage.getItem("baseUrl") ?? domain;

// Create axios instance
const request = axios.create({
  timeout: 60 * 1000,
  params: {},
  baseURL: baseUrl,
});

request.interceptors.request.use(
  function (config: InternalAxiosRequestConfig) {
    const keyStr = localStorage.getItem("key") ?? "";
    const systemConfig = useSystemInitConfigStore().config;
    // 判断验证方式处理数据
    if (systemConfig.authMode == 1) {
      config.params["key"] = keyStr;
    } else {
      config.headers["auth_key"] = AuthEncrypt(keyStr, config.data);
    }
    return config;
  },
  function (error: any) {
    // 对请求错误做些什么
    console.log(error);
    return Promise.reject(error);
  }
);

// 添加响应拦截器
request.interceptors.response.use(
  function (response: AxiosResponse) {
    if (response.data.code != 1000) {
      ElMessage.warning(response.data.msg);
    } /* else {
        ElMessage.success(response.data.msg)
    }*/
    // 成功返回时处理数据
    return response;
  },
  function (error: AxiosError<{ code: number; msg: string; time: number }>) {
    let data = error.response?.data ?? {
      code: 1001,
      msg: "发起请求失败",
      time: Date.now(),
    };
    console.log("请求出错", error);
    let isJson: boolean = isJSON(data);
    if (data && !isJson && error.response?.status == 404) {
      ElMessage.error(data.msg ?? "操作出错");
      Router.push("/login").then((r) => {});
    }
    if (data.code != 1000) {
      ElMessage.error(data.msg);
    }
    // 出错时调用
    return Promise.reject(error);
  }
);

export interface Response<T = any> {
  code: number;
  data: T;
  msg: string;
  time: number;
}

const req = async <T>(config: AxiosRequestConfig) => {
  const res = await request(config);
  return res.data as T;
};
export default req;
