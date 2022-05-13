import { DashboarviewResponse } from "./dashboard-view-response";
import { LicenseModel } from "./LicenseModel";
import { UserAccountModel } from "./userAccountModelResponse";

export interface LogingViewResponse {
    licenseModel: LicenseModel,
    userAccountModel: UserAccountModel
}
