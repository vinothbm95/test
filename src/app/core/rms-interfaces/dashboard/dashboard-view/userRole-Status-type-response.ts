import { StatusTypeResponse } from "./status-type-response";
import { UserRoleResponse } from "./user-role-response";

export interface UserRoleStatusTypeDropResponse {
    statusTypes: StatusTypeResponse[],
    userRoles: UserRoleResponse[]
}