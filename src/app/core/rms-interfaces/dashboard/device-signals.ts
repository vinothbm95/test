export interface DeviceDetails {
    deviceId: number;
    deviceExternalId: string;
    deviceName: string;
    deviceDescription: string;
    deviceSerialNo: string;
	dateOfInstallation: string;
	versionNo: string;
    placeOfInstallation: string;    
    timeZone: string;
	useDeviceTime: boolean;
	dataFormatTypeId : number;
	isActive: boolean;
	deviceTopic : string;
    deviceTypeId: number;
	isGateway : boolean
}
export interface SignalDetails {
	deviceModel: DeviceDetails;
	signalModel:signalModel;
	widgetTypeModel : widgetTypeModel;
	signalThresholdModels :Array<signalThresholdModels>;
	signalDataModel: Array<signalDataModel>;
	isSelected: boolean
}
export interface signalModel {
		signalId: number,
		deviceId: number,
		signalName: string,
		signalDescription: string,
		signalMode: number,
		signalDataType: number,
		dataDecimalPoint: number,
		logOnlyNew: boolean,
		displayTypeId:number,
		signalResolution: number,
		signalStartRange: number,
		signalEndRange: number,
		signalUnit: string,
		signalIcon: string,
		isLatLong: boolean,
		sensorMax: number,
		sensorMin: number,
		isMappingCalculationDone: boolean,
		isActive: boolean,
		isConnected: boolean,
		signalTopic: string		
}
export interface signalThresholdModels {
        "thresholdId": number,
		"thresholdValue": number,
		"thresholdColor": string,
		"alertRequired": boolean,
		"isEmail": boolean,
		"isAudio": boolean,
		"isSms": boolean,
		"signalId": number,
		"isActive": boolean
}
export interface widgetTypeModel {
	gauge: boolean;
	bar: boolean;
	rule: boolean;
	chart: boolean;
	area: boolean;
}

// export interface signalData {
// 	signalDataModel:Array<signalDataModel>
// }
export interface signalDataModel {
	signalDataId: number;
    signalId: number;
    deviceId: number;
    dataValue: string;
    timeStamp: string;
    timeReceived: string;
}
