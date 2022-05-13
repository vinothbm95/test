// export interface SignalThresholdModels {
//     thresholdId: number,
//     thresholdValue: number,
//     thresholdColor : string,
//     alertRequired: boolean,
//     isEmail: boolean,
//     isAudio: boolean,
//     isSms: boolean,
//     signalId: number,
//     isActive: boolean
// }


export interface SignalThresholdModels {
    alertMessage: string,
    alertRequired: boolean,
    isActive : boolean,
    isAlertRange: boolean,
    isAudio: boolean,
    isEmail: boolean,
    isSms: boolean,
    signalId: string,
    thresholdColor: string,
    thresholdId: number,
    thresholdValue: number
}