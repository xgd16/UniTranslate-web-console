
export type Translate = {
    /**
     * 原文语言
     */
    from: string;
    /**
     * 原文文字长度
     */
    originalTextLen: number;
    /**
     * 翻译平台
     */
    platform: string;
    /**
     * 译文语言
     */
    to: string;
    /**
     * 翻译结果内容
     */
    translate: string[];
    /**
     * 译文文字长度
     */
    translationLen: number;
}

export type BaiduConfig = {
    key: string,
    url: string,
    appId: string,
    curlTimeOut: number,
}

export type YouDaoConfig = {
    url: string,
    appKey: string,
    secKey: string,
    curlTimeOut: number,
}

export type GoogleConfig = {
    key: string,
    url: string,
    curlTimeOut: number,
}

export type DeeplConfig = {
    key: string,
    url: string,
    curlTimeOut: number,
}

export type AddConfigForm<T = BaiduConfig|YouDaoConfig|GoogleConfig|DeeplConfig|null> = {
    platform: string,
    status: boolean,
    level: number,
    cfg: T
    typeCfg: string
}

export type ConfigList = {
    id: string,
    level: string,
    platform: string,
    status: number,
    'type': string
}