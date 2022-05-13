import { ChartSeriesResponse } from "./chart-series-response";
import { HeaderViewModelResponse } from "./header-viewmodels-response";
import { SignalDataModel } from "./signal-data-model";
import { SignalThresholdModels } from "./signal-threshold-models";
import { SignalModel } from "./signalmodel";

export interface ParameterResponse {
    chartSeries: ChartSeriesResponse[],
    headerViewModels: HeaderViewModelResponse[],
    signalDataModels: SignalDataModel[],
    signalModel: SignalModel,
    signalThresholdModels: SignalThresholdModels[]
}