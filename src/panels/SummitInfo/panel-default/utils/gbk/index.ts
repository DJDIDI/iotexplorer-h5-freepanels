/* eslint-disable */
import codes from './codes.json';

function GBK() {
  const arr_index = 0x8140;
  return {
    decode(arr: number[]) {
      let str = '';
      for (let n = 0, max = arr.length; n < max; n++) {
        let code = arr[n];
        if (code & 0x80) {
          code = codes[(code << 8 | arr[++n]) - arr_index];
        }
        str += String.fromCharCode(code);
      }
      return str;
    },
    encode(str: string) {
      str += '';
      const gbk: number[] = [];
      const wh = '?'.charCodeAt(0);
      for (let i = 0; i < str.length; i++) {
        const charcode = str.charCodeAt(i);
        if (charcode < 0x80) gbk.push(charcode);
        else {
          let gcode = codes.indexOf(charcode);
          if (~gcode) {
            gcode += arr_index;
            gbk.push(0xFF & (gcode >> 8), 0xFF & gcode);
          } else {
            gbk.push(wh);
          }
        }
      }
      return gbk;
    },
  };
}

let gbk;
const createOrReuseInstance = () => {
  if (!gbk) gbk = GBK();
  return gbk;
};

Object.defineProperties(GBK, {
  encode: {
    get() {
      const gbk = createOrReuseInstance();
      return gbk.encode;
    },
  },
  decode: {
    get() {
      const gbk = createOrReuseInstance();
      return gbk.decode;
    },
  },
});

export const { encode, decode } = GBK();
