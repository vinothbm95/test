
export class SignalModel {
    signalId: number;
    deviceId: number;
    signalName: string;
    signalDescription: string;
    signalModeId: number;
    signalDataTypeId: number;
    dataDecimalPoint: number;
    logOnlyNew: boolean;
    defaultDisplayTypeId: number;
    signalResolution: number;
    signalStartRange: number;
    signalEndRange: number;
    signalUnit: string;
    signalIconId?: any;
    isLatLong: boolean;
    sensorMax: number;
    sensorMin: number;
    isMappingCalculationDone: boolean;
    isActive: boolean;
    isConnected: boolean;
    signalTopic?: any;
    signalGroupId?: any;
    plcAddress?: any;
    plcAddressType: string;
    infoValue?: any;
    tolerance?: any;
    visualEffectId?: any;
    isDashboardTagged: boolean;
    noOfBitId: number;
}

export class SignalThresholdModel {
    thresholdId: number;
    thresholdValue: number;
    thresholdColor: string;
    alertRequired: boolean;
    isEmail: boolean;
    isAudio: boolean;
    isSms: boolean;
    signalId: number;
    isActive: boolean;
    isAlertRange: boolean;
}

export class SignalViewModel {
    signalModel: SignalModel;
    signalThresholdModels: SignalThresholdModel[];
    signalBitModel?: any;
}

export class SignalDataModel {
    signalDataId: number;
    signalId: number;
    deviceId: number;
    dataValue: string;
    timeReceived: string;
    timeStamp: Date;
}

export class SignalDateRangeData {
    signalViewModel: SignalViewModel;
    signalDataModels: SignalDataModel[];
}
