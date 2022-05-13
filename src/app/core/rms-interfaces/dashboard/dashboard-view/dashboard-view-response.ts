import { UsePreference } from './userpreference';
import { GroupPreference } from './grouppreference';
import { LicenseModel } from './LicenseModel';


export interface DashboarviewResponse {
    customerId: number;
    designation: string;
    email: string,
    firstName: string;
    gridLayoutId: number
    groupUserPreference: GroupPreference[];
    isActive: boolean;
    lastName: string;
    password: string;
    phoneNo: string;
    userAccountId: number;
    userPhoto: string;
    userPreference: UsePreference[];
    userRoleId: number;
}