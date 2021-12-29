import * as gbk from './gbk';

function convert10To16(num: number) {
  return (num).toString(16);
}

function convert16To10(hex: string): number {
  return parseInt(hex, 16);
}

/**
 * 10进制数组 => 16进制字符串
 * @param arr
 */
function decArrToHexString(arr: number[]): string {
  const hexArr = arr.map(num => convert10To16(num));
  return hexArr.join('');
}

/**
 * 普通字符串 => 16进制 GBK码 字符串
 * @param utfStr
 */
export function utfStrToGbkHexStr(utfStr: string): string {
  let gbkHexStr = '';
  Array.from(utfStr).forEach((item) => {
    const decArr = gbk.encode(item);
    const hexStr = decArrToHexString(decArr);
    gbkHexStr += hexStr;
  });
  return gbkHexStr.toUpperCase();
}

/**
 * GBK 16进制 字符串 => 普通字符串
 * @param gbkHexStr
 */
export function gbkHexStrToUtfStr(gbkHexStr: string) {
  const gbkHexArr: string[] = [];
  for (let i = 0; i < gbkHexStr.length; i += 2) {
    gbkHexArr.push(gbkHexStr.slice(i, i + 2));
  }
  const gbkDecArr: number[] = gbkHexArr.map(hex => convert16To10(hex));
  return gbk.decode(gbkDecArr);
}
