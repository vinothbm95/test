// export interface SignalDataModel {
//     signalDataId: number;
//     signalId: number;
//     deviceId: number;
//     dataValue: string;
//     timeStamp: string;
//     timeReceived: string;
// }


export interface SignalDataModel {
    signalDataId: number;
    signalId: string;
    deviceId: string;
    dataValue: string;
    timeReceived: string;
    timeStamp: string;
}