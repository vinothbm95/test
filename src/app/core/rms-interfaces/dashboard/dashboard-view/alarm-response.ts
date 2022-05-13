import { AlaramModelResponse } from "./alarm-model-response";
import { EmailAlarmModelResponse } from "./email-alarm-model-response";
import { PhoneAlarmModelResponse } from "./phone-alarm-model-response";

export interface AlaramResponse {
    alarmModel: AlaramModelResponse,
    emailAlarmModels: EmailAlarmModelResponse[],
    phoneAlarmModels: PhoneAlarmModelResponse[]
}