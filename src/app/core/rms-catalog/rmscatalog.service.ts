import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { devicedatamodel } from '../../core/rms-catalog/model/devicedatamodel';

@Injectable({
  providedIn: 'root'
})
export class RmscatalogService {

  constructor(private httpClient: HttpClient) { }
  //  headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  // options = new HttpRequest({ headers: headers });

  private devicedata: any[] = [
    { "deviceId": 1, "deviceExternalId": "1", "deviceName": "Device 1", "deviceDescription": "Device Device 1 added", "deviceSerialNo": "11", "dateOfInstallation": "2020-07-01T00:00:00", "versionNo": "1", "placeOfInstallation": "Bengaluru", "timeZone": "IST", "useDeviceTime": true, "deviceType": 1, "isActive": true }, { "deviceId": 2, "deviceExternalId": "2", "deviceName": "Device 2", "deviceDescription": "Device Device 2 added", "deviceSerialNo": "12", "dateOfInstallation": "2020-07-02T00:00:00", "versionNo": "2", "placeOfInstallation": "Bengaluru", "timeZone": "IST", "useDeviceTime": true, "deviceType": 1, "isActive": true }, { "deviceId": 3, "deviceExternalId": "3", "deviceName": "Device 3", "deviceDescription": "Device Device 3 added", "deviceSerialNo": "13", "dateOfInstallation": "2020-07-03T00:00:00", "versionNo": "3", "placeOfInstallation": "Bengaluru", "timeZone": "IST", "useDeviceTime": true, "deviceType": 1, "isActive": true }, { "deviceId": 4, "deviceExternalId": "4", "deviceName": "Device 4", "deviceDescription": "Device Device 4 added", "deviceSerialNo": "14", "dateOfInstallation": "2020-07-04T00:00:00", "versionNo": "4", "placeOfInstallation": "Bengaluru", "timeZone": "IST", "useDeviceTime": true, "deviceType": 1, "isActive": true }, { "deviceId": 5, "deviceExternalId": "5", "deviceName": "Device 5", "deviceDescription": "Device Device 5 added", "deviceSerialNo": "15", "dateOfInstallation": "2020-07-05T00:00:00", "versionNo": "5", "placeOfInstallation": "Bengaluru", "timeZone": "IST", "useDeviceTime": true, "deviceType": 1, "isActive": true }, { "deviceId": 6, "deviceExternalId": "6", "deviceName": "Device 6", "deviceDescription": "Device Device 6 added", "deviceSerialNo": "16", "dateOfInstallation": "2020-07-06T00:00:00", "versionNo": "6", "placeOfInstallation": "Bengaluru", "timeZone": "IST", "useDeviceTime": true, "deviceType": 1, "isActive": true }, { "deviceId": 7, "deviceExternalId": "7", "deviceName": "Device 7", "deviceDescription": "Device Device 7 added", "deviceSerialNo": "17", "dateOfInstallation": "2020-07-07T00:00:00", "versionNo": "7", "placeOfInstallation": "Bengaluru", "timeZone": "IST", "useDeviceTime": true, "deviceType": 1, "isActive": true }, { "deviceId": 8, "deviceExternalId": "8", "deviceName": "Device 8", "deviceDescription": "Device Device 8 added", "deviceSerialNo": "18", "dateOfInstallation": "2020-07-08T00:00:00", "versionNo": "8", "placeOfInstallation": "Bengaluru", "timeZone": "IST", "useDeviceTime": true, "deviceType": 1, "isActive": true }, { "deviceId": 9, "deviceExternalId": "9", "deviceName": "Device 9", "deviceDescription": "Device Device 9 added", "deviceSerialNo": "19", "dateOfInstallation": "2020-07-09T00:00:00", "versionNo": "9", "placeOfInstallation": "Bengaluru", "timeZone": "IST", "useDeviceTime": true, "deviceType": 1, "isActive": true }, { "deviceId": 10, "deviceExternalId": "10", "deviceName": "Device 10", "deviceDescription": "Device Device 10 added", "deviceSerialNo": "20", "dateOfInstallation": "2020-07-10T00:00:00", "versionNo": "10", "placeOfInstallation": "Bengaluru", "timeZone": "IST", "useDeviceTime": true, "deviceType": 1, "isActive": true }, { "deviceId": 11, "deviceExternalId": "11", "deviceName": "Device 11", "deviceDescription": "Device Device 11 added", "deviceSerialNo": "21", "dateOfInstallation": "2020-07-11T00:00:00", "versionNo": "11", "placeOfInstallation": "Bengaluru", "timeZone": "IST", "useDeviceTime": true, "deviceType": 1, "isActive": true }, { "deviceId": 12, "deviceExternalId": "12", "deviceName": "Device 12", "deviceDescription": "Device Device 12 added", "deviceSerialNo": "22", "dateOfInstallation": "2020-07-12T00:00:00", "versionNo": "12", "placeOfInstallation": "Bengaluru", "timeZone": "IST", "useDeviceTime": true, "deviceType": 1, "isActive": true }, { "deviceId": 13, "deviceExternalId": "13", "deviceName": "Device 13", "deviceDescription": "Device Device 13 added", "deviceSerialNo": "23", "dateOfInstallation": "2020-07-13T00:00:00", "versionNo": "13", "placeOfInstallation": "Bengaluru", "timeZone": "IST", "useDeviceTime": true, "deviceType": 1, "isActive": true }, { "deviceId": 14, "deviceExternalId": "14", "deviceName": "Device 14", "deviceDescription": "Device Device 14 added", "deviceSerialNo": "24", "dateOfInstallation": "2020-07-14T00:00:00", "versionNo": "14", "placeOfInstallation": "Bengaluru", "timeZone": "IST", "useDeviceTime": true, "deviceType": 1, "isActive": true },
  ];
  getdevicedata(): Observable<any> {
    return this.httpClient.get("https://rms.data.source.elpisitsolutions.com/api/Device");

  }
  RegisternewDevice(DeviceInfodata:devicedatamodel):Observable<any>{
   return this.httpClient.put("https://rms.data.source.elpisitsolutions.com/api/Device/"+DeviceInfodata.deviceId,DeviceInfodata);
  }
  EditDevice(DeviceInfodata:devicedatamodel):Observable<any>{
    return this.httpClient.put("https://rms.data.source.elpisitsolutions.com/api/Device/"+DeviceInfodata.deviceId,DeviceInfodata);
   }

   DeletDevice(deviceId:number):Observable<any>{
    return this.httpClient.delete("https://rms.data.source.elpisitsolutions.com/api/Device/"+deviceId);
   }



  getdevicedatainfo() {
    return this.devicedata;

  }
}
