import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DeviceDetails, SignalDetails } from 'src/app/core/rms-interfaces/index';
import { DashboarviewResponse } from '../../rms-interfaces/dashboard/dashboard-view/dashboard-view-response';
import { Observable } from 'rxjs';
import { logging } from 'protractor';
import { LogingViewResponse } from '../../rms-interfaces/dashboard/dashboard-view/LoginViewResponse';
import { DashboardResponse } from '../../rms-interfaces/dashboard/dashboard-view/dashboardResponse';
import { DeviceResponse } from '../../rms-interfaces/dashboard/dashboard-view/device-response';
import { SignalModel } from '../../rms-interfaces/dashboard/dashboard-view/signalmodel';
import { DeviceModel } from '../../rms-interfaces/dashboard/dashboard-view/devicemodel';
import { signalResponse } from '../../rms-interfaces/dashboard/dashboard-view/signal-response';
import { SignalDataModel } from '../../rms-interfaces/dashboard/dashboard-view/signal-data-model';
import { GroupResponse } from '../../rms-interfaces/dashboard/dashboard-view/group-response';
import { AddGroupResponse } from '../../rms-interfaces/dashboard/dashboard-view/add-group-response';
import { UserListResponse } from '../../rms-interfaces/dashboard/dashboard-view/user-list-response';
import { UserAccountModel } from '../../rms-interfaces/dashboard/dashboard-view/userAccountModelResponse';
import { CustomerResponse } from '../../rms-interfaces/dashboard/dashboard-view/customer-response';
import { UserRoleResponse } from '../../rms-interfaces/dashboard/dashboard-view/user-role-response';
import { UserRoleStatusTypeDropResponse } from '../../rms-interfaces/dashboard/dashboard-view/userRole-Status-type-response';
import { MapResponse } from '../../rms-interfaces/dashboard/dashboard-view/map-response';
import { ParameterResponse } from '../../rms-interfaces/dashboard/dashboard-view/parameter-response';
import { LogSheetParametersResponse } from '../../rms-interfaces/dashboard/dashboard-view/logsheet-parameters-response';
import { LogsheetThresholdResponse } from '../../rms-interfaces/dashboard/dashboard-view/logSheet-threshold-response';
import { TestCertificateResponse } from '../../rms-interfaces/dashboard/dashboard-view/test-certificate-response';
import { AlaramResponse } from '../../rms-interfaces/dashboard/dashboard-view/alarm-response';
import { AlaramTableResponse } from '../../rms-interfaces/dashboard/dashboard-view/alarm-table-response';
import { StatusReportData } from '../../rms-interfaces/dashboard/dashboard-view/StatusReportData';

const BASEURL = `${environment.baseURL}`;

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  storage: any;
  profileUrl;
  headerurl;
  customerIdVal;
  rmsAccount;
  petronashEmergencyClass: boolean = false;
  pumpStatus: boolean = true;
  process: boolean = false;;
  mangagement: boolean = false;
  inactiveDeviceData: any;
  errorMsg = {
    deviceMsg: "You cannot delete this device because signals are configured against this device. Do delete the signals for this device first and then delete this device",
    signalMsg: "You cannot delete this signal because alarms are configured against this signal. Do delete the alarms for this signal first and then delete this signal"

  }

  constructor(private http: HttpClient) { }

  // Roles for admin usage
  getUserAunthicate(account) {
    return this.http.post<any>(`${BASEURL}UserAccount/Authenticate`, account);
  }
  getDashboard(id) {
    console.log(id, "useaccount id")
    return this.http.get<any>(`${BASEURL}UserAccount/GetDashboard/${id}`);
  }
  getRoles() {
    return this.http.get<UserRoleResponse[]>(`${BASEURL}UserRole`);
  }

  addNewUser(obj) {
    return this.http.post<UserAccountModel>(`${BASEURL}UserAccount`, obj);
  }

  updateAccountPassword(id, obj) {
    return this.http.put<UserAccountModel>(`${BASEURL}UserAccount/ResetPassword/${id}`, obj);
  }
  getCustomerDetails(id) {
    return this.http.get<CustomerResponse>(`${BASEURL}Customer/${id}`);
  }

  getprofilephoto(id) {
    return this.http.get<any>(`${BASEURL}Customer/${id}`);
  }
  setprofilephoto(img) {
    return this.http.put<UserAccountModel>(`${BASEURL}UserAccount/UpdatePhoto`, img);
  }

  // setCompanylogo(logo){
  //   return this,this.http.put(`${BASEURL}Customer/UpdatePhoto`,logo);
  // }

  getUsersList(id) {
    return this.http.get<UserListResponse[]>(`${BASEURL}UserAccount/GetUserList/CustomerId/${id}`);
  }
  getreport(report) {
    return this.http.post(`${BASEURL}ExportReport`, report, { responseType: 'blob' });

  }

  getcngreport(reportdata) {
    return this.http.post(`${BASEURL}ExportReport/LogSheet`, reportdata, { responseType: 'blob' });
  }

  CloneNewDevice(devicedata) {
    console.log(devicedata);
    return this.http.post<any>(`${BASEURL}Device/CloneDevice`, devicedata);

  }

  getUserPreferenceAdmin(id) {
    return this.http.get<UserAccountModel>(`${BASEURL}UserAccount/${id}`);
  }
  //Select device screen, Loads all
  getAllDevices() {
    // const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8', );

    // const headers = new HttpHeaders({
    //   'Access-Control-Allow-Origin': '*',
    //   'content-type' :'application/json; charset=utf-8'
    // })
    return this.http.get<any>(`${BASEURL}Device`);
  }

  getDeviceSignalDetails(deviceId) {
    return this.http.get<any>(`${BASEURL}Signal/Revised/DeviceId/WithSignalData/` + deviceId);
    //return this.http.get<SignalDetails>(`${BASEURL}Signal/Revised/DeviceId/`+deviceId+`/userExternalId/`+1+`/WithSignalData/`);

  }

  submitSignals(signals: any) {
    return this.http.post(`${BASEURL}Signal`, signals);
  }

  submitGroupSignals(signals: any) {
    return this.http.put(`${BASEURL}SignalGroup/EditGroupUserPreference`, signals);
  }

  getAllSignals(account: any): Observable<LogingViewResponse> {
    console.log(account)
    return this.http.post<LogingViewResponse>(`${BASEURL}UserAccount/Validate`, account);
  }

  UpdateAccountSettings(UserId: number, accountData: any): Observable<UserAccountModel> {
    return this.http.put<UserAccountModel>(`${BASEURL}UserAccount/${UserId}`, accountData);
  }
  UpdateCompanySettings(CustomerId: number, CompanyData: any) {
    return this.http.put<CustomerResponse>(`${BASEURL}Customer/${CustomerId}`, CompanyData);
  }

  getDeviceData(CustomerId) {
    return this.http.get<DeviceModel[]>(`${BASEURL}Device/CustomerId/${CustomerId}`);
  }

  getAllDeviceData(CustomerId) {
    return this.http.get<DeviceResponse>(`${BASEURL}Device/WithAllDevId/CustomerId/${CustomerId}`);
  }
  getCngDeviceApi(CustomerId) {
    return this.http.get<DeviceModel[]>(`${BASEURL}device/GetCngDevices/CustomerId/${CustomerId}`);
  }

  getparametersdata(parametrsdata) {
    // TODO: Model To Create for Response
    return this.http.post<ParameterResponse[]>(`${BASEURL}Report/MultipleSignal/WithSelectedParameters`, parametrsdata);

  }

  getcngdevicedata(data) {
    console.log(data, "in service data")
    // return this.http.get<any>(`${BASEURL}Report/LogSheet/${cngid}/${cnddate1}/${cngdate2}`);
    // return this.http.get<any>(`${BASEURL}Report/LogSheetPerHour/${cngid}/${cnddate1}/${cngdate2}`);
    return this.http.post<LogSheetParametersResponse[]>(`${BASEURL}Report/LogSheetPerHour`, data);
  }

  getPetroSignalData(pdeviceid) {
    return this.http.get<DashboarviewResponse>(`${BASEURL}Signal/DeviceId/${pdeviceid}`);
  }

  getAllGroups() {
    return this.http.get<any>(`${BASEURL}SignalGroup`);
  }

  addGroup(obj) {
    return this.http.post<AddGroupResponse>(`${BASEURL}SignalGroup`, obj);
  }

  getSpecificGroupSignals(SignalGroupId) {
    let accountObject = sessionStorage.getItem('rmsAccount');
    this.rmsAccount = JSON.parse(accountObject);
    return this.http.get<any>(`${BASEURL}Signal/Revised/UserAccountId/${this.rmsAccount.userAccountId}/SignalGroupId/` + SignalGroupId + `/WithSignalData/`);
    //https://rms.data.source.elpisitsolutions.com/api/Signal/Revised/UserAccountId/%7BuserAccountId%7D/SignalGroupId/%7BgroupId%7D/WithSignalData/%7BdataCount?%7D

  }

  getGroupPreference(userAccountId) {
    return this.http.get<GroupResponse>(`${BASEURL}UserAccount/${userAccountId}`);
  }


  getSignalDataViewSignalApi(deviceid, signalId) {
    return this.http.get<SignalDataModel[]>(`${BASEURL}SignalData/deviceId/${deviceid}/signalId/${signalId}/dateRange`);
  }

  deleteGroup(groups: any, userAcountId: any) {
    // if (groups.length == 1) {
    //   return this.http.delete<any>(`${BASEURL}SignalGroup/${groups[0].signalGroupId}`);
    // } else {
    let ids;
    ids = groups.map(x => {
      return x['signalGroupId']
    });
    ids = '?ids=' + ids.join(",")
    console.log(`${BASEURL}SignalGroup/MultipleSignalGroup/${userAcountId}${ids}`);

    return this.http.delete<GroupResponse[]>(`${BASEURL}SignalGroup/MultipleSignalGroup/${userAcountId}${ids}`);
    // }
  }

  addSignalsToGroup(obj) {
    return this.http.put(`${BASEURL}SignalGroup/EditGroupUserPreference`, obj);
  }

  deleteSignals(obj) {
    console.log(obj);
    // let temp = signals.map(x=> {
    //    x.signalGroupModel = null;
    //    return x;
    // })
    // console.log(temp);
    //return this.http.put<any>(`${BASEURL}Signal`,signals);
    return this.http.put(`${BASEURL}SignalGroup/EditGroupUserPreference`, obj);
  }

  getCompareSignalsData(obj) {
    console.log(obj)
    return this.http.post<any>(`${BASEURL}SignalData/Compare`, obj, {
      headers: {
        'content-type': 'application/json',
        'Content-Encoding': 'gzip'
      }
    });
  }
  addDevice(device: any) {
    console.log(device, "device checking in service")
    return this.http.post(`${BASEURL}Device`, device);
  }
  // getTimeZoneApi(){
  //   return this.http.get<DashboarviewResponse>(`${BASEURL}TimeZone`);
  // }
  // getCustomerIdApi(){
  //   return this.http.get<DashboarviewResponse>(`${BASEURL}Customer`);
  // }
  // getDataFormatTypeIdApi(){
  //   return this.http.get<DashboarviewResponse>(`${BASEURL}DeviceDataFormatType`);
  // }
  // getDeviceTypeIdApi(){
  //   return this.http.get<DashboarviewResponse>(`${BASEURL}DeviceType`);
  // }
  getTimeZoneApi() {
    return this.http.get<any>(`${BASEURL}Device/DeviceDropdown`);
  }

  editDevice(deviceId, device) {
    console.log(deviceId, device, "device checking in service")

    return this.http.put(`${BASEURL}Device/${deviceId}`, device);
  }

  deleteDeviceId(deviceId, Status) {
    return this.http.delete<any>(`${BASEURL}Device/${deviceId}/${Status}`);
  }

  getSignalData(customerid) {
    console.log(customerid, "customerid checking")
    return this.http.get<SignalModel[]>(`${BASEURL}Signal/CustomerId/${customerid}`);
  }
  getDeviceSignaldata(deviceid) {
    return this.http.get<SignalModel[]>(`${BASEURL}Signal/GetSignalList/DeviceId/${deviceid}`);
  }
  getSignalById(signalId) {
    return this.http.get<signalResponse[]>(`${BASEURL}Signal/${signalId}`);
  }
  deleteSignalId(signalId, status) {
    return this.http.delete<any>(`${BASEURL}Signal/${signalId}/${status}`);
  }

  getSignalDropdownApi() {
    return this.http.get<any>(`${BASEURL}Signal/SignalDropdown`);
  }
  addSignal(signal: any) {
    console.log(signal, "device checking in service")
    return this.http.post(`${BASEURL}Signal/AddNewSignal`, signal);
  }

  editSignal(signalId, signal) {
    console.log(signalId, signal, "device checking in service")

    return this.http.put(`${BASEURL}Signal/${signalId}`, signal);
  }

  setGridLayout(userAccountId, grid) {

    return this.http.put(`${BASEURL}UserAccount/${userAccountId}`, grid);
  }

  updateProfilePic(userPhoto: any) {

    if (userPhoto != null) {
      this.profileUrl = userPhoto;
    }
    else {
      this.profileUrl = "../../../assets/images/profile_picture.png";
      // this.profileUrl = "../../../assets/images/profile_picture.png";
    }
  }

  updateCompanylogo(companylogo: any) {
    if (companylogo != null) {
      this.headerurl = companylogo;
    }
    else {
      this.headerurl = "../../../../assets/images/elpis_logo.png";
    }
  }
  getSignalDateRangeData(deviceId, signalId, fromDate, toDate) {
    console.log(`${BASEURL}SignalData/deviceId/${deviceId}/signalId/${signalId}/dateRange/${fromDate}/${toDate}`);
    return this.http.get<SignalDataModel[]>(`${BASEURL}SignalData/deviceId/${deviceId}/signalId/${signalId}/dateRange/${fromDate}/${toDate}`, {
      headers: {
        'content-type': 'application/json',
        'Content-Encoding': 'gzip'
      }
    })
  }
  getUserList(Id) {
    console.log(Id, "device checking in service")
    return this.http.get<UserListResponse[]>(`${BASEURL}UserAccount/GetUserList/CustomerId/${Id}`);
  }

  getUserRoleApi() {
    return this.http.get<UserRoleStatusTypeDropResponse>(`${BASEURL}UserAccount/UserAccountDropdown`);
  }
  editUserListApi(id, editUserData) {
    return this.http.put<UserAccountModel>(`${BASEURL}UserAccount/${id}`, editUserData);
  }

  //petronash start
  getPetronashAllSignals(account: any): Observable<LogingViewResponse> {
    console.log(account)
    return this.http.post<LogingViewResponse>(`${BASEURL}Petronash/Validate`, account);
  }
  getPumpSlideApi(id, dateTime) {
    return this.http.get<any>(`${BASEURL}Petronash/TestDetail/SignalId/${id}/${dateTime}`);
  }

  editPetronashInputModel(obj) {
    console.log(obj, "input model  checking in service")

    return this.http.put(`${BASEURL}Petronash/DeviceInput/UpdateInput`, obj);
  }

  getChemCostApi(chemCost, dateTime) {
    return this.http.get<any>(`${BASEURL}Petronash/ChemCostDetails/${chemCost}/${dateTime}`);
  }

  getFlowRateApi(flowRate, dateTime) {
    return this.http.get<any>(`${BASEURL}Petronash/ProcessViewParameter/${flowRate}/${dateTime}`);
  }
  getPumpStartStopTrendApi(signalId, dateTime, timePeroid) {
    console.log(signalId, timePeroid, "in servie pump start stop")
    return this.http.get<any>(`${BASEURL}Petronash/TestDetail/PumpStartStopTrend/${signalId}/${dateTime}?timePeriod=${timePeroid}`);
  }
  getPetronashSignalDateRangeApi(signalId, fromDate, toDate) {
    return this.http.get<any>(`${BASEURL}Petronash/TestDetail/PumpStartStopTrend/${signalId}/${fromDate}/${toDate}`)
  }
  getTotalDischargeTrendApi(signalId, dateTime, timePeroid) {
    return this.http.get<any>(`${BASEURL}SignalData/${signalId}/${dateTime}?timePeriod=${timePeroid}`);
  }
  getTotalDischargeRangeApi(signalId, fromDate, toDate) {
    return this.http.get<any>(`${BASEURL}SignalData/${signalId}/dateRange/${fromDate}/${toDate}`)
  }

  updatePumpStatus(cid, signal: any, state: number) {
    return this.http.post<any>(`${environment.deviceApiURL}Signal/Send/PumpState?provider=${cid}`, `"${signal.signalId};${signal.plcAddress};${signal.deviceId};${state}"`, {
      headers: {
        'content-type': 'application/json'
      }
    })
  }
  updatePumpStatusHydac(cid, deviceId: any, state: number) {
    return this.http.post<any>(`${environment.deviceApiURL}Signal/Send/PumpState?provider=${cid}`, `"${deviceId};${state}"`, {
      headers: {
        'content-type': 'application/json'
      }
    })
  }
  signalWriteValidateApi(data) {
    return this.http.post<any>(`${BASEURL}SignalWriteCredential/Validate `, data)
  }
  getAlarmDataApi(id) {
    return this.http.get<AlaramTableResponse[]>(`${BASEURL}Alarm/CustomerId/${id}`)
  }
  addAlarmApi(alarm) {
    return this.http.post<AlaramResponse>(`${BASEURL}Alarm`, alarm)
  }
  editAlarmApi(id, alarm) {
    return this.http.put<AlaramResponse>(`${BASEURL}Alarm/${id}`, alarm)
  }
  deleteAlarmApi(id) {
    return this.http.delete<any>(`${BASEURL}Alarm/${id}`)
  }
  getEmailPhoneDataApi(id) {
    return this.http.get<any>(`${BASEURL}Alarm/${id}`)
  }
  getInactiveDeviceDataApi(id) {
    return this.http.get<any>(`${BASEURL}Device/Inactive_Device/CustomerId/${id}`)
  }
  getMultiplesignalDataApi(signal, fromDate, toDate) {
    console.log(signal, fromDate, toDate, "params checking in services")
    let ids;
    ids = signal?.map(x => {
      return x;
    });
    ids = '?ids=' + ids.join(",")
    console.log(ids, "ids cheking in services")
    return this.http.get<any>(`${BASEURL}Report/MultipleSignal/DateRange/${fromDate}/${toDate}${ids}`)
  }
  //device certificate post
  deviceCertificatePostApi(deviceCertificate) {
    return this.http.post<any>(`${BASEURL}DeviceCertificate`, deviceCertificate)
  }
  //getting logsheet threshold values
  getLogSheetSignalThreshold(logBody) {
    return this.http.post<LogsheetThresholdResponse[]>(`${BASEURL}LogsheetSignalThreshold`, logBody)
  }
  getDeviceLogSheetSignaldata(deviceid) {
    return this.http.get<SignalModel[]>(`${BASEURL}Signal/GetLogSheetSignalList/DeviceId/${deviceid}`)
  }
  editLogsheetThresholdApi(logSheetData) {
    return this.http.put<any>(`${BASEURL}LogsheetSignalThreshold/ConfigureThreshold`, logSheetData)
  }
  //tvs dashboard api start
  getTvsUtilizationApi(deviceid,from,to) {
    return this.http.get<any>(`${BASEURL}TvsUtilization/deviceId/${deviceid}/fromDate/${from}/toDate/${to}`)
  }
  getTvsHighestUtilizationApi(cid,from,to) {
    return this.http.get<any>(`${BASEURL}TvsUtilization/GetHighestUtilization/customerId/${cid}/fromDate/${from}/toDate)/${to}`)
  }
  getTvsUtilizationConfig(deviceid) {
    return this.http.get<any>(`${BASEURL}TVSUtilizationSetting/${deviceid}`)
  }
  editTvsUtilizeConfigApi(utilizeData) {
    return this.http.put<any>(`${BASEURL}TVSUtilizationSetting`, utilizeData)
  }
  getDashboardDataParitially(id, index) {
    console.log(id, index, "service data checking")
    return this.http.get<DashboardResponse>(`${BASEURL}UserAccount/GetPartialDashboard/${id}/startIndex/${index}`)

  }
  //signal certificate api
  getSignalCerificateData(data) {

    return this.http.post<any>(`${BASEURL}BoosterFactoryAcceptanceTest/GetFatReport`, data);
  }
  saveFinalCertificateApi(data) {

    return this.http.post<any[]>(`${BASEURL}BoosterFactoryAcceptanceTest`, data);
  }
  //device,alarm and signal certificate pdf generation
  getCertificatePdfGenerationApi(data) {
    return this.http.post(`${BASEURL}ExportCertificateToPdf`, data, { responseType: 'blob' });
  }

  getDashboardNamesApi(uid) {
    return this.http.get<any>(`${BASEURL}UserDashboard/${uid}`);
  }

  getDashboardApi(uid, dname) {
    return this.http.get<any>(`${BASEURL}UserDashboard/UserAccountId/${uid}/DashboardName/${dname}`);
  }
  // https://rmstest.data.source.elpisitsolutions.com/api/Petronash/TestDetail/PumpStartStopTrend/292?timePeriod=monthly
  //petronash end
  getMapDeviceApi(cid) {
    return this.http.get<MapResponse[]>(`${BASEURL}Map/CustomerId/${cid}`);
  }
  getDeviceStatusApi(id, time) {
    return this.http.get<any>(`${BASEURL}Device/DeviceStatusDashboard/CustomerId/${id}/PresentDateTime/${time}`);
  }

  getRmsStatusReportData(data) {
    return this.http.post<StatusReportData>(`${BASEURL}DeviceStatus`, data);
  }

  getPieChartData(fromdate, Todate, data) {
    return this.http.post<any>(`${BASEURL}DeviceStatus/Piechart Report/FromDate/${fromdate}/ToDate/${Todate}`, data);
  }
  //get devices for hydac only
  getSelectDeviceHydacApi(cid) {
    return this.http.get<any>(`${BASEURL}Device/ReleasedDevices/CustomerId/${cid}`);
  }
  getHydacUserDashboardsApi(cid) {
    return this.http.get<any>(`${BASEURL}UserDashboard/CustomerId/${cid}`);
  }
  getWriteDevicePassword(account){
    return this.http.post<any>(`${BASEURL}SignalWriteCredential`, account);
  }
  getHydacDeviceList(id){
    return this.http.get<any>(`${BASEURL}Device/GetUnReleasedDeviceList/UserAccountId/${id}`);
  }

  releaseAssetApi(data:string){
    const options = {
      params: new HttpParams({
        fromString: data
      })
    }
    return this.http.put<any>(`${BASEURL}Device/ReleaseDevices`, {},                                                // 2. request body
    { params: {ids:data } } 
    );
  }
  getUserLogout(id){
    console.log(id, "account id")
    
    let headers = new HttpHeaders()
 
    headers=headers.append('Authorization','Basic ' + btoa('sayan_elpis:Testing123$'))
 
    return this.http.get<any>(`https://remoslog.elpisitsolutions.com/api/UserSessionLog/logged out/userAccountId/${id}`,
    { 'headers': headers })
  }

}
