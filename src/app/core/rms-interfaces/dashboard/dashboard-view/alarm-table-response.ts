import { AlaramModelResponse } from "./alarm-model-response";
import { DeviceModel } from "./devicemodel";
import { SignalModel } from "./signalmodel";

export interface AlaramTableResponse {
    alarmModel: AlaramModelResponse,
    deviceModel: DeviceModel,
    signalModel: SignalModel
}