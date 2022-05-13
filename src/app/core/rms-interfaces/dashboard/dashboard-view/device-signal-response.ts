import { AddGroupResponse } from "./add-group-response";
import { DeviceModel } from "./devicemodel";
import { SignalDataModel } from "./signal-data-model";
import { SignalThresholdModels } from "./signal-threshold-models";
import { signalBitModel } from "./signalBitModel";
import { SignalModel } from "./signalmodel";
import { WidgetTypeModel } from "./widget-typemodel";
import { widgetModels } from "./widgetModels";

export interface DeviceSignalModel {
    deviceModel: DeviceModel,
    signalModel: SignalModel,
    widgetTypeModel: WidgetTypeModel,
    widgetModels: widgetModels[],
    signalThresholdModels: SignalThresholdModels[],
    signalDataModels: SignalDataModel[],
    signalBitModel: signalBitModel,
    isSelected: boolean,
    height: number,
    width: number,
    cardFontColor: string,
    cardBackgroundColor: string,
    signalGroupModel: AddGroupResponse
}