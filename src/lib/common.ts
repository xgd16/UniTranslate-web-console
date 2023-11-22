

export const langArr: string[] = ["zh-CHS", "zh-CHT", "en", "ko", "ja", "fr", "ru", "es", "pt", "ar", "de", "it", "vi", "id", "nl", "th"]

export function isJSON(str: any): boolean {
    try {
        JSON.parse(str)
        return true
    } catch(e) {
        return false
    }
}