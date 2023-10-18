//import { compareSync, hashSync } from "bcryptjs";
import CryptoJS from "crypto-js"

const KEY = 'my-token'

export class BcryptAdapter {

  static hash(password: string): string {
    //return hashSync( password, 10);

    const iv = CryptoJS.lib.WordArray.random(16);
    // Ciframos el mensaje utilizando AES
    const hashed = CryptoJS.AES.encrypt(password, KEY, {iv}).toString();

    return hashed

  }

  static compare(password: string, hashed: string): boolean {
    //return compareSync( password, hashed );

    return password === CryptoJS.AES.decrypt(hashed, KEY).toString(CryptoJS.enc.Utf8)
  }

}

