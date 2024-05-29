import { MD5 } from "crypto-js"

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
