import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { timeout } from "rxjs/operators";
import { MqttService } from "../mqtt-service/mqtt.service";
import { EncryptDecrypt } from './encryptDecrypt.service';


@Injectable({
    providedIn: 'root'
})
export class authService {
    AutoLogOutTimer: any;

    constructor(private route: Router, private toaster: ToastrService, private encrDecrService: EncryptDecrypt, private _mqttService: MqttService) { }

    logOut() {
        sessionStorage.clear();
        this.route.navigate(['/']);
        if (this.AutoLogOutTimer) {
            clearTimeout(this.AutoLogOutTimer);

        }
        this._mqttService.disconnect();

    }

    autoLogOut() {
        let data: any;
        try {
            data = JSON.parse(this.encrDecrService.decryptData(sessionStorage.getItem('rmsLicense')))
        } catch (e) {
            this.logOut();
            return;
        }
        if (data == null) {
            this.logOut();
            return;
        }
        let licenseData: {
            expiryDate: string
            isLicensed: boolean
            trialDuration: number
        } = data;
        if (!licenseData || licenseData.isLicensed) {
            return;
        }

        let dateTime = new Date().getTime();
        let expireDate = new Date(licenseData.expiryDate).getTime();
        let timeDuration = expireDate - dateTime;
        console.log('in auto logout duration left: ' + timeDuration / 1000);

        this.AutoLogOutTimer = setTimeout(() => {
            this.logOut();
            this.toaster.info('Your trail duration is expired! Thanks for Using RMS For licensed vesrion please contact US.');
        }, timeDuration);

    }


    getCurrentUser() {
        if (sessionStorage.getItem('rmsAccount') != null && sessionStorage.getItem('dummyPwd') != null) {
            return {
                email: JSON.parse(sessionStorage.getItem('rmsAccount')).email,
                password: sessionStorage.getItem('dummyPwd')
            }
        }
        else{
            return null;
        }
    }





}





