import { Injectable } from "@angular/core";
import * as CryptoJS from 'crypto-js';


@Injectable({ providedIn: 'root' })
export class EncryptDecrypt {
    encryptSecretKey = '%%$$ElpisRMS$$%%'
    encryptData(data:any) {

        try {
            return CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptSecretKey).toString();
        } catch (e) {
           return null;
        }
    }

    decryptData(data:any) {

        try {
            const bytes = CryptoJS.AES.decrypt(data, this.encryptSecretKey);
            if (bytes.toString()) {
                return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            }
            return data;
        } catch (e) {
            return null;
        }
    }
}