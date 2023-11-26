

export const langArr: string[] = ["zh-CHS", "zh-CHT", "en", "ko", "ja", "fr", "ru", "es", "pt", "ar", "de", "it", "vi", "id", "nl", "th"]
export const langMap: {[key: string]: string} = {
    "zh-CHS": "简体中文",
    "zh-CHT": "繁体中文",
    "en": "英语",
    "ko": "韩语",
    "ja": "日语",
    "fr": "法语",
    "ru": "俄语",
    "es": "西班牙语",
    "pt": "葡萄牙语",
    "ar": "阿拉伯语",
    "de": "德语",
    "it": "意大利语",
    "vi": "越南语",
    "id": "印度尼西亚语",
    "nl": "荷兰语",
    "th": "泰语"
  }

export function isJSON(str: any): boolean {
    try {
        JSON.parse(str)
        return true
    } catch(e) {
        return false
    }
}