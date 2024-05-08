import req from "@/lib/request";
import type { Response } from "@/lib/request";
import type { SystemInitConfigResp } from "@/types/props";

/**
 * GetSystemInitConfig 获取系统基础初始化数据
 */
export const getSystemInitConfig = () => {
  return req<Response<SystemInitConfigResp>>({
    url: "/api/getSystemInitConfig",
    method: "GET",
  });
};

/**
 * RefreshConfigCache 刷新配置缓存
 */
export const refreshConfigCache = () => {
  return req<Response<string[]>>({
    url: "/api/refreshConfigCache",
    method: "GET",
  });
};

export const delConfig = (serialNumber: string) => {
  return req<Response<string>>({
    url: "/api/delConfig",
    method: "POST",
    data: { serialNumber },
  });
};

export const updateStatus = (serialNumber: string, status: number) => {
  return req<Response<string>>({
    url: "/api/updateStatus",
    method: "POST",
    data: { serialNumber, status },
  });
};

export interface CacheSize {
  size: number;
}

export const cleanCache = () => {
  return req<Response<CacheSize>>({
    url: "/api/cleanCache",
    method: "GET",
  });
};

export const cacheSize = () => {
  return req<Response<CacheSize>>({
    url: "/api/cacheSize",
    method: "GET",
  });
};
