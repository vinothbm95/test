// export interface DeviceModel {
//     deviceId: number;
//     deviceExternalId: string;
//     deviceName: string;
//     deviceDescription: string;
//     deviceSerialNo: string;
// 	dateOfInstallation: string;
// 	versionNo: string;
//     placeOfInstallation: string;    
//     timeZone: string;
// 	useDeviceTime: boolean;
// 	dataFormatTypeId : number;
// 	isActive: boolean;
// 	deviceTopic : string;
//     deviceTypeId: number;
// 	isGateway : boolean
// }



export interface DeviceModel {
    deviceKey: number,
    deviceId: string,
    deviceName: string,
    deviceDescription: string,
    deviceSerialNo: string,
	dateOfInstallation: string,
	versionNo: string,
    placeOfInstallation: string,
    cityOfInstallation: string,  
    timeZone: string,
	useDeviceTime: boolean,
	dataFormatTypeId : number,
	isActive: boolean,
	deviceTopicIn : string,
    deviceTypeId: number;
	isGateway : boolean,
    deviceTopicOut: string,
    customerId: number,
    isLatLong: boolean,
    email: string,
    isPresent: boolean
}