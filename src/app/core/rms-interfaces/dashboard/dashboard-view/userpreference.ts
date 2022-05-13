import { DeviceModel } from './devicemodel';
import { SignalDataModel } from './signal-data-model';
import { SignalThresholdModels } from './signal-threshold-models';
import { SignalModel } from './signalmodel';
import { WidgetTypeModel } from './widget-typemodel';


export interface UsePreference {
    deviceModel: DeviceModel;
    isSelected : boolean;
	signalModel:SignalModel;
	widgetTypeModel : WidgetTypeModel;
	signalThresholdModels :SignalThresholdModels[];
	signalDataModel: SignalDataModel[];	
}