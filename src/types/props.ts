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
};

export type BaiduConfig = {
  key: string;
  url: string;
  appId: string;
  curlTimeOut: number;
};

export type YouDaoConfig = {
  url: string;
  appKey: string;
  secKey: string;
  curlTimeOut: number;
};

export type GoogleConfig = {
  key: string;
  url: string;
  curlTimeOut: number;
};

export type DeeplConfig = {
  key: string;
  url: string;
  curlTimeOut: number;
};

export type ChatGPTConfig = {
  url: string;
  key: string;
  model: string;
  orgId: string;
};

export type XunFeiConfig = {
  appId: string;
  apiKey: string;
  secret: string;
};

export type TencentConfig = {
  url: string;
  region: string;
  secretId: string;
  secretKey: string;
};

export type HuoShanConfig = {
  accessKey: string;
  secretKey: string;
};

export type PaPaGoConfig = {
  key: string;
  url: string;
  keyId: string;
  curlTimeOut: number;
};

export type FreeGoogleConfig = {
  proxy: string;
  curlTimeOut: number;
};

export type AddConfigForm<
  T =
    | BaiduConfig
    | YouDaoConfig
    | GoogleConfig
    | DeeplConfig
    | ChatGPTConfig
    | XunFeiConfig
    | TencentConfig
    | HuoShanConfig
    | PaPaGoConfig
    | FreeGoogleConfig
    | null
> = {
  platform: string;
  status: boolean;
  level: number;
  cfg: T;
  typeCfg: string;
};

export type ConfigList = {
  id: string;
  level: string;
  platform: string;
  status: number;
  type: string;
  cfg: any;
};

export type RequestRecordList = {
  id: number;
  tId: string;
  body: string;
  clientIp: string;
  errMsg: string;
  status: number;
  platform: string;
  takeTime: number;
  takeTimeViewStr: string;
  reqPlatform: string;
  reqFrom: string;
  reqTo: string;
  translate: string,
  statusName: string;
  createTime: string;
  updateTime: string;
};

export type RequestRecord = {
  count: number;
  list: RequestRecordList[];
};

/**
 * 系统初始化配置
 */
export type SystemInitConfigResp = {
  authMode: number;
  editConfig: boolean;
};
