import req from "@/lib/request"
import type { Response } from "@/lib/request";
import type { SystemInitConfigResp } from "@/types/props"

/**
 * GetSystemInitConfig 获取系统基础初始化数据
 */
export const getSystemInitConfig = () => {
    return req<Response<SystemInitConfigResp>>({
        url: "/api/getSystemInitConfig",
        method: "GET",
    })
}