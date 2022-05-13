import { SignalThresholdModels } from "./signal-threshold-models";
import { signalBitModel } from "./signalBitModel";
import { SignalModel } from "./signalmodel";

export interface signalResponse {
    signalModel: SignalModel,
    signalThresholdModels: SignalThresholdModels[],
    signalBitModel: signalBitModel
}