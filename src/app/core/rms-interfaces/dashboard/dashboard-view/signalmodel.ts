// export interface SignalModel {
//     signalId: number,
// 		deviceId: number,
// 		signalName: string,
// 		signalDescription: string,
// 		signalMode: number,
// 		signalDataType: number,
// 		dataDecimalPoint: number,
// 		logOnlyNew: boolean,
// 		displayTypeId:number,
// 		signalResolution: number,
// 		signalStartRange: number,
// 		signalEndRange: number,
// 		signalUnit: string,
// 		signalIcon: string,
// 		isLatLong: boolean,
// 		sensorMax: number,
// 		sensorMin: number,
// 		isMappingCalculationDone: boolean,
// 		isActive: boolean,
// 		isConnected: boolean,
// 		signalTopic: string		
// }


export interface SignalModel {
	    signalKey: number,
		signalId: string,
		deviceId: string,
		signalName: string,
		signalDescription: string,
		signalModeId: number,
		signalDataTypeId: number,
		dataDecimalPoint: number,
		logOnlyNew: boolean,
		defaultDisplayTypeId:number,
		signalResolution: number,
		signalStartRange: number,
		signalEndRange: number,
		signalUnit: string,
		signalIconId: string,
		isLatLong: boolean,
		sensorMax: number,
		sensorMin: number,
		isMappingCalculationDone: boolean,
		isActive: boolean,
		isConnected: boolean,
		signalTopic: string,
		signalGroupId: number,
		plcAddress: string,
		plcAddressType: string,
		infoValue: null | string,
		tolerance: null | string,
		visualEffectId: null | string,
		isDashboardTagged: boolean,
		noOfBitId: number,

}