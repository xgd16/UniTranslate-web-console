import type {Response} from "@/lib/request";
import req from "@/lib/request";
import type {
    BaiduConfig,
    ConfigList,
    DeeplConfig,
    GoogleConfig,
    RequestRecord,
    Translate,
    YouDaoConfig
} from "@/types/props";


export const translateRequest = (
    data: {from: string, to: string, text: string, platform: string} = {
        from: 'auto',
        to: 'en',
        text: '',
        platform: '',
    }
) => {
    return req<Response<Translate>>({
        url: '/api/translate',
        method: 'POST',
        data: data
    })
}

export const addConfigRequest = (
    data: {
        platform: string,
        status: boolean,
        level: number,
        cfg: BaiduConfig|YouDaoConfig|GoogleConfig|DeeplConfig
        "type": string,
    }
) => {
    return req<Response<string[]>>({
        url: '/api/addConfig',
        method: 'POST',
        data: data
    })
}

export const getConfigList = () => {
    return req<Response<ConfigList[]>>({
        url: '/api/getConfigList',
        method: 'GET'
    })
}

export const getRequestRecord = (
    params: {page: number, size: number} = {page: 1, size: 10}
) => {
    return req<Response<RequestRecord>>({
        url: '/api/getRequestRecord',
        method: 'GET',
        params
    })
}