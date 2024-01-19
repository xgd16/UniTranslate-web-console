import { MD5 } from "crypto-js"

export const langArr: string[] = [
  "zh-CHS",
  "zh-CHT",
  "en",
  "ko",
  "ja",
  "fr",
  "ru",
  "es",
  "pt",
  "ar",
  "de",
  "it",
  "vi",
  "id",
  "nl",
  "th",
];
export const langMap: { [key: string]: string } = {
  "zh-CHS": "简体中文",
  "zh-CHT": "繁体中文",
  en: "英语",
  ko: "韩语",
  ja: "日语",
  fr: "法语",
  ru: "俄语",
  es: "西班牙语",
  pt: "葡萄牙语",
  ar: "阿拉伯语",
  de: "德语",
  it: "意大利语",
  vi: "越南语",
  id: "印度尼西亚语",
  nl: "荷兰语",
  th: "泰语",
};

export function isJSON(str: any): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}


export function AuthEncrypt(key: string, params: {[key: string]: any}): string {
    return MD5(key + sortMapToStr(params)).toString()
}


const sortMapToStr = (map: { [key: string]: any }): string => {
  let mapArr = new Array();
  
  for (const key in map) {
    const item = map[key];
    if (Array.isArray(item)) {
      mapArr.push(`${key}:${item.join(",")}`);
      continue;
    }
    if (typeof item === "object") {
      mapArr.push(`${key}:|${sortMapToStr(item)}|`);
      continue;
    }
    mapArr.push(`${key}:${item}`);
  }

  return mapArr.sort().join("&");
};
