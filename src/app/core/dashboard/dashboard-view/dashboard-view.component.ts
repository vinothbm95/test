import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Observable, Subscription,interval } from 'rxjs';
import { map, startWith, throttle } from 'rxjs/operators';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { DashboardService } from '../../rms-services/dashboard/dashboard.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LogingViewResponse } from '../../rms-interfaces/dashboard/dashboard-view/LoginViewResponse';
import { IMqttMessage, MqttService } from '../../rms-services/mqtt-service/mqtt.service';
import { Location } from '@angular/common'
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/shared/notification-services/notification.service';

import * as Highcharts from 'highcharts';
import { error, timeStamp } from 'console';
declare var require: any;
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/solid-gauge')(Highcharts);
require('highcharts/modules/heatmap')(Highcharts);
require('highcharts/modules/treemap')(Highcharts);
require('highcharts/modules/funnel')(Highcharts);
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import { AreasplineChartComponent } from 'src/app/shared/areaspline-chart/areaspline-chart.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ToastrService } from 'ngx-toastr';
import { type } from 'os';
import { DashboardResponse } from '../../rms-interfaces/dashboard/dashboard-view/dashboardResponse';
import { UserListResponse } from '../../rms-interfaces/dashboard/dashboard-view/user-list-response';
import { UserAccountModel } from '../../rms-interfaces/dashboard/dashboard-view/userAccountModelResponse';
import { ExportAsService, ExportOptions } from '../../rms-services/export-as.service';
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};

// import HC_exporting from 'highcharts/modules/exporting';
interface device {
  value: string;
  viewValue: string;
}

interface ISignal {
  signalId: number;
  deviceId: number;
  dataValue: any;
  timeReceived: string;
}

interface ISignalView {
  [key: number]: ISignal;
}
@Component({
  selector: 'elpis-rms-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    { provide: MAT_DATE_LOCALE, useValue: '' },

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class DashboardViewComponent implements OnInit, OnDestroy {
fromDateHydac;
toDateHydac;
exportIconHydac: boolean = false;
  //select dashboard dropdown in dashboard  only for sunpowergen start
  selectDashboardData = [];
  selectDashboardtype = [
    {id:1,title:'Parameter Dashboard'},
    {id:2,title:'Device Status Dashboard'}
  ]
  //select dashboard dropdown in dashboard  only for sunpowergen end
  //tvs start
  tvsFromDate;
  tvvsEndDate;
  tvsDeviceID;
  tvsDeviceIDropdown = ['TVS Machine 1',
                        'TVS Machine 2',
                        'TVS Machine 3',
                        'TVS Machine 4',
                        'TVS Machine 5',
                        'TVS Machine 6', 
                        'TVS Machine 7',
                        'TVS Machine 8',
                        'TVS Machine 9',
                        'TVS Machine 10'];

  //tvs end
  //petronash start
  petronashDashboard;
  petronashModel;
  petronashInputModel;
  categories = [

  ];

  data1 = [

  ]


  moredrop: boolean = false;

  pumpAData;
  PumpATrippedData;
  pumpBData;
  pumpBTrippedData;
  EmeregenyData;
  TankLevelData;
  numberData;
  graphData;
  isSignalDataPresnet: boolean = false;
  testingPumpAData;
  testingPumpBData;
  rtdData;
  latitudeData;
  longitudeData;
  signalStrength;
  setFlowRateData;
  petronashLoading: boolean;
  chemicalCostData;
  PumpAStartStopContent;
  PumpBStartStopContent;
  TotalDischargeContent;
  // petronash end
  inlinedevice = "";
  socket;
  socketSignalLive;
  width: number;
  height: number;
  mqttTopicPerfix = "rms/user/";
  selectedDashboardOption: any;
  customerId;
  private readonly decoder: TextDecoder;

  devicelist: device[] = [
    { value: 'Custom', viewValue: 'Custom' },
    { value: 'Bar', viewValue: 'Bar' },
    { value: 'Ruler', viewValue: 'Ruler' },
    { value: 'Gauge', viewValue: 'Gauge' }
  ];


  layoutsValue = 0;
  layouts = [
    { id: 0, value: "grid-0" },
    { id: 1, value: "grid-1" },
    { id: 2, value: "grid-2" },
    { id: 3, value: "grid-3" },
    { id: 4, value: "grid-4" }
  ]
  dashboardType = false;
  gridLayout;
  data;
  dashboardLoading: boolean;
  devicedata: any[] = [];
  rulerseries;
  gaugeseries;
  rmsAct: any;
  accountdetails = {
    email: "",
    password: ""
  }

  users = [];
  dashboardList = [{ dashboardId: 0, DashbordName: "User Dashboard", routeLink: "/dashboard/users" }, { dashboardId: 1, DashbordName: "Group Dashboard", routeLink: "/dashboard/users/md/groups" }]
  selectedUser;
  params;
  userdDashboard;
  subscription: Subscription;
  dashboardtopic: string;
  selectedDashboard: any;
  tvsDaterangeForm:FormGroup;
  tvsData;
  deviceListData;
  utilizationData;
  tvsSelectedDeviceid;
  subscription1: Subscription;
  intervalId;
  tvsUtilizeConfigData;
  throttle = 50;
  scrollDistance = 1;
  scrollUpDistance = 2;
  direction = "";
  notEmptyPost = true;
  notScrolly = true;
  deviceDataLength;
  dashboardName;
  dashboardTitle;
  hydacBackShow:boolean = false;
  fromDate: any;
  Enddate: any;
  tvsFromDate1: any;
  tvvsEndDate1: any;
  tvsStatus: any;
  HighestutilizationData: any;
  hydacDeviceID;
  
  
  constructor(public _dashboardservice: DashboardService, public dialog: MatDialog, private exportAs: ExportAsService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService, private router: Router, private _mqttService: MqttService,
    private notifyService: NotificationService,
    private _Activatedroute: ActivatedRoute, private location: Location, private _adapter: DateAdapter<any>) {
      this._adapter.setLocale('your locale');
    console.log(this._adapter, "checking date formats")
    this.params = _Activatedroute.snapshot;
    this.userdDashboard = this.params.url[0]?.path == 'users' ? true : false;
    this.decoder = new TextDecoder('utf-8');
  }
  dummyPwd;
  parameterDashboard:boolean = true;
  ngOnInit() { 
    this.users = [];
    // this.dashboardLoading=true;

    let accountObject = sessionStorage.getItem('rmsAccount');
    this.dummyPwd = sessionStorage.getItem('dummyPwd');
    let selectedUser = sessionStorage.getItem('rmsSelectedUser');
    console.log(selectedUser,"selectedUser ")
    this.rmsAct = JSON.parse(accountObject);
    if(selectedUser != null)
    {
      this.users.push(JSON.parse(selectedUser));
      console.log(this.users,"users checking")
    }else{
      this.users = [];  
    }
  
    console.log("mqtt is connected:" + this._mqttService.isConnected);
    console.log(this.rmsAct, "accountObject details checking")


    // if (!this._mqttService.isConnected) {
    //   this._mqttService.connect(this.rmsAct.email, this.rmsAct.password).finally(() => {
    //     this._mqttService.isConnected = true;
    //     console.log("mqtt connected from dashboard");
    //   })
    // }
    if (this.rmsAct?.customerId == 6) {
      this.dashboardLoading = true;
      this.accountdetails.email = this.rmsAct.email;
      this.accountdetails.password = this.dummyPwd;
      this.dashboardLoading = true;
      // this._dashboardservice.getAllSignals(this.accountdetails).subscribe(
        this._dashboardservice.getDashboard(this.rmsAct.userAccountId).subscribe(
        (data: any) => {
          this.dashboardLoading = false;
          console.log(data, "data checking");
          // let x: any = data['userAccountModel'];
          this.devicedata = JSON.parse(data.userPreference);
        
          // this.layoutsfun(JSON.parse(x.gridLayoutId));
         
          if (this.devicedata == null) {
            this.devicedata = []
          }
          else {
            this.DashboardMqttConnect(data?.userAccountId);


          }
          console.log(this.devicedata, "TVS device data checking");

        },
        error => {
          console.error(error);
          this.dashboardLoading = false;
          this.toastr.error(error?.errorMessage)

        },
        () => console.log('COMPLETE')
      );
      this.getDeviceData();
      this.getTvsFormVal();
    }
    else if (this.rmsAct?.customerId == 5) {
       
        this.getPeetronashAllData();
    }
    else {
      this.subscription = this._mqttService.observe(d => this.onRecived(d));
      if (this.userdDashboard) {
        console.log(this.users,"users checking");
        if(this.rmsAct?.customerId == 11){
          let selectedId = sessionStorage.getItem('selectedId');
          console.log(selectedId,"selectedId checking")
          this.customerId = selectedId;
          // alert("11");
          
       
          // this.backShow = true;
          this.userdDashboard = false;
          this._dashboardservice.getDashboardDataParitially(this.customerId,0).subscribe(
            (data: DashboardResponse) => {
              this.dashboardLoading = false;
              this.dashboardName = data?.userAccountModel?.dashboardName;
              this.dashboardTitle = data?.userAccountModel?.dashboardName;
              // sessionStorage.setItem('dashboardName', this.dashboardName);
              let deviceDatalen = data?.userAccountModel?.userPreference;
              console.log(deviceDatalen,"deviceDatalen check")
              // sessionStorage.setItem('userPrefrenceData',deviceDatalen);
              let len = JSON.parse(deviceDatalen)
              this.deviceDataLength = len?.length;
              console.log(this.deviceDataLength,"this.deviceDataLength checking")
              this.gridLayout = data?.userAccountModel?.gridLayoutId;
              this.devicedata = JSON.parse(data?.userDashboard);
              this.hydacBackShow = true;
            
            }, error =>{
              console.error(error);
              this.dashboardLoading = false;
               this.toastr.error(error?.errorMessage)
            },
            () => console.log('COMPLETE')
            )
        }else{
        if(this.users.length > 0){
          console.log("users---list is not empty");
          
          if (this._Activatedroute.snapshot.paramMap.get("userAccountId")) 
          {
            console.log(this._Activatedroute.snapshot.paramMap.get("userAccountId"))
            this.onUserSelection();

          }
        }
        else{
          console.log("users---list is  empty");
          // this.dashboardLoading = true;
          console.log("if empty  get users data from api");
          
          this._dashboardservice.getUserList(this.rmsAct.customerId).subscribe(   
            (data:UserListResponse[]) => {
                  console.log("---gettting users  list from api---");
                  console.log(data);
                  
                  // console.log(data);   
                  let activeusersdata = data.filter(t=>t.statusTypeId === 1);
                  console.log("active users list"+activeusersdata);
                  

                  this.users = activeusersdata;
                  
                  this.dashboardLoading = false;

                  if (this._Activatedroute.snapshot.paramMap.get("userAccountId")) 
                  {
                    this.onUserSelection();
                    this.dashboardLoading = false;
                  }

                },
                error =>{
                  console.error(error);
                  this.dashboardLoading = false;
                  this.toastr.error(error?.errorMessage)
                },
                () => console.log('COMPLETE')
                );


                  
        }
      }

      } 
      else {
        console.log("Main Dashboard");
        this.accountdetails.email = this.rmsAct.email;
        this.accountdetails.password = this.dummyPwd;
        this.dashboardLoading = true;
        // this._dashboardservice.getAllSignals(this.accountdetails).subscribe(
          // let indexVal = ;
          // if(this.gridLayout == 5){

          // }else{

          // }
          this.customerId = this.rmsAct.userAccountId;
          this._dashboardservice.getDashboardDataParitially(this.customerId,0).subscribe(
          (data: DashboardResponse) => {
            this.dashboardLoading = false;
            console.log(data, "data checking");
            // // let x: any = data['userAccountModel'];
            this.dashboardName = data?.userAccountModel?.dashboardName;
            this.dashboardTitle = data?.userAccountModel?.dashboardName;
            sessionStorage.setItem('dashboardName', this.dashboardName);
            let deviceDatalen = data?.userAccountModel?.userPreference;
            if(deviceDatalen != null) {
            console.log(deviceDatalen,"deviceDatalen check")
            sessionStorage.setItem('userPrefrenceData',deviceDatalen);
            let len = JSON.parse(deviceDatalen)
            this.deviceDataLength = len?.length;
            console.log(this.deviceDataLength,"this.deviceDataLength checking")
            this.gridLayout = data?.userAccountModel?.gridLayoutId;
            this.devicedata = JSON.parse(data?.userDashboard);

            this.hydacDeviceID = this.devicedata[0]?.deviceModel?.deviceId;
            console.log(this.hydacDeviceID,"this.hydacDeviceID checking")
           
            // this.layoutsfun(JSON.parse(x.gridLayoutId));
          
            if (this.devicedata == null) {
              this.devicedata = []
            }
            else {
              this.DashboardMqttConnect(data?.userAccountModel?.userAccountId);


            }
            console.log(this.devicedata, "device data checking");
          }else{
            this.dashboardLoading = false;
          }
          if (this.rmsAct?.customerId == 1 || this.rmsAct?.customerId == 11) {
            this._dashboardservice.getDashboardNamesApi(this.rmsAct.userAccountId).subscribe(
              (data: any) => {
                console.log(data,"dashboar names checking") 
                this.selectDashboardData = data; 
                let addressTypeDropdownVal;
                // this.selectDashboardData.find(item =>{
                //   if(item?.dashboardName == ){
                //     addressTypeDropdownVal = item;
                //     console.log(addressTypeDropdownVal,"dataFormatTypeID INLINE checking");
                //   }
                //   else{
                //     return ""
                //   } 
                // });
              },
              error => {
                console.error(error);
                this.dashboardLoading = false;
                this.toastr.error(error?.errorMessage)
              },
              () => console.log('COMPLETE')
            );
          }
          },
          error => {
            console.error(error);
            this.dashboardLoading = false;
            this.toastr.error(error?.errorMessage)
          },
          () => console.log('COMPLETE')
        );

      }


    }

    // else {
    //   this.subscription = this._mqttService.observe(d => this.onRecived(d));
    //   if (this.userdDashboard) {
    //     if (this._Activatedroute.snapshot.paramMap.get("customerId")) {
    //       let userListCustomerId = this.selectedUser = this._Activatedroute.snapshot.paramMap.get("customerId");
    //       console.log(userListCustomerId, 'user list id checking');

    //       this.selectedDashboard = 0;

    //       this._dashboardservice.getUserList(userListCustomerId).subscribe(
    //         data => {
    //           this.users = data;
    //           if (selectedUser && this.users.length > 0) {
    //             this.dashboardLoading = true;
    //             let temp = JSON.parse(selectedUser)
    //             const toSelect = this.users.find(x => x.userAccountId == temp.userAccountId);
    //             this.selectedUser = toSelect.userAccountId;
    //             this.layoutsfun(JSON.parse(toSelect.gridLayoutId));
    //             this.devicedata = JSON.parse(toSelect.userPreference);
    //             this.dashboardLoading = false;
    //             this.DashboardMqttConnect(this.selectedUser);
    //           }
    //         },
    //         error => {
    //           console.log('ERROR!! Fetch users list failed')
    //         }
    //       );
    //     } else {
    //       console.log('USERSSSSSSSSSSSSSSSSSSSSSSSS');

    //        this.selectedDashboard = 0;
    //       console.log(this.rmsAct.customerId);
          
    //       this._dashboardservice.getUserList(this.rmsAct.customerId).subscribe(
    //         data => {
    //           console.log(data);
              
    //           this.users = data;
    //           if (selectedUser && this.users.length > 0) {
    //             this.dashboardLoading = true;
    //             let temp = JSON.parse(selectedUser)
    //             const toSelect = this.users.find(x => x.userAccountId == temp.userAccountId);
    //             this.selectedUser = toSelect.userAccountId;
    //             // this.layoutsfun(JSON.parse(toSelect.gridLayoutId));

    //             this.devicedata = JSON.parse(toSelect.userPreference);
    //              this.gridLayout = JSON.parse(toSelect.gridLayoutId);
    //             this.dashboardLoading = false;
    //             this.DashboardMqttConnect(this.selectedUser);
    //             this.onUserSelection();
    //           }
    //         },
    //         error => {
    //           console.log('ERROR!! Fetch users list failed')
    //         }
    //       );
    //     }


    //   } else {
    //     console.log("Main Dashboard");
    //     this.accountdetails.email = this.rmsAct.email;
    //     this.accountdetails.password = this.dummyPwd;
    //     this.dashboardLoading = true;
    //     // this._dashboardservice.getAllSignals(this.accountdetails).subscribe(
    //       // let indexVal = ;
    //       // if(this.gridLayout == 5){

    //       // }else{

    //       // }
    //       this._dashboardservice.getDashboardDataParitially(this.rmsAct.userAccountId,0).subscribe(
    //       (data: any) => {
    //         console.log(data, "data checking");
          
    //         // // let x: any = data['userAccountModel'];
    //         this.dashboardName = data?.userAccountModel?.dashboardName;
    //         sessionStorage.setItem('dashboardName', this.dashboardName);
    //         let deviceDatalen = data?.userAccountModel?.userPreference;
    //         console.log(deviceDatalen,"deviceDatalen check")
    //         sessionStorage.setItem('userPrefrenceData',deviceDatalen);
    //         let len = JSON.parse(deviceDatalen)
    //         this.deviceDataLength = len?.length;
    //         console.log(this.deviceDataLength,"this.deviceDataLength checking")
    //         this.gridLayout = JSON.parse(data?.userAccountModel?.gridLayoutId);
    //         this.devicedata = JSON.parse(data?.userDashboard);
    //         this.dashboardLoading = false;
    //         // this.layoutsfun(JSON.parse(x.gridLayoutId));
    //         if (this.rmsAct?.customerId == 1) {
    //           console.log(" getDashboardNamesApi --api call  if customer id ==1");
              
    //           this._dashboardservice.getDashboardNamesApi(this.rmsAct.userAccountId).subscribe(
    //             (data: any) => {
    //               console.log(data,"dashboar names checking")
    //               this.selectDashboardData = data; 
    //             },
    //             error => {
    //               console.error(error);
      
    //             },
    //             () => console.log('COMPLETE')
    //           );
    //         }
    //         if (this.devicedata == null) {
    //           console.log(" if device data is null");

    //           this.devicedata = []
    //         }
    //         else {
    //           console.log("if device data is not null");
              
    //           this.DashboardMqttConnect(data?.userAccountId);


    //         }
    //         console.log(this.devicedata, "device data checking");

    //       },
    //       error => {
    //         console.error(error);

    //       },
    //       () => console.log('COMPLETE')
    //     );

    //   }


    // }

  }
  onScrollDown(ev) {
    console.log("scrolled down!!", ev);
    if(this.devicedata?.length > 0){
    if(this.deviceDataLength == this.devicedata?.length){
    console.log(this.deviceDataLength,this.devicedata?.length,"checking")
     
    }else{
      this.loadNextDashboardData();
    }
  }
    // add another 20 items
    // const start = this.sum; 
    // this.sum += 20;
    // this.appendItems(start, this.sum);
    

    this.direction = "down";
  }
  loadNextDashboardData(){
    if(this.rmsAct?.customerId == 11 && this.userdDashboard){
      let selectedId = sessionStorage.getItem('selectedId');
      console.log(selectedId,"selectedId checking")
      this.customerId = selectedId;

    }else{
      this.customerId = this.rmsAct.userAccountId;
    }
    const index = this.devicedata.length;
    console.log(index,"index checking") 
    this.dashboardLoading = true;
    this._dashboardservice.getDashboardDataParitially(this.customerId,index).subscribe(
      (data: any) => {
        console.log(data, "data checking");
        // sessionStorage.setItem('userPrefrenceData',JSON.stringify(data?.userDashboard));
        // // let x: any = data['userAccountModel'];
        // this.gridLayout = JSON.parse(data?.userAccountModel?.gridLayoutId);
        const newData = JSON.parse(data?.userDashboard);
        this.dashboardLoading = false;
        // if(newData?.length === 0){
        //   this.notEmptyPost = false;
        // }
        this.devicedata = this.devicedata.concat(newData);
        // sessionStorage.setItem('userPrefrenceData',JSON.stringify( this.devicedata));
        // this.notScrolly = true;
        this.dashboardLoading = false;
        // this.layoutsfun(JSON.parse(x.gridLayoutId));
       
        // if (this.devicedata == null) {
        //   this.devicedata = []
        // }
        // else {
        //   this.DashboardMqttConnect(data?.userAccountId);


        // }
        // console.log(this.devicedata, "device data checking");

      },
      error => {
        console.error(error);
        // if(error?.)
        this.dashboardLoading = false;
        this.toastr.error(error?.errorMessage)
      },
      () => console.log('COMPLETE')
    );
  }
  onUp(ev) {
    console.log("scrolled up!", ev);
    // const start = this.sum;
    // this.sum += 20;
    // this.prependItems(start, this.sum);

    this.direction = "up";
  }
  dashboardTypeDropdown(){
    this.dashboardType = !this.dashboardType;
  }
  deviceStatusDashboard(){
    this.parameterDashboard = false;

    this.dashboardTitle = "Device Status Dashboard"
  }
  //export csv & excel in hydac start
  exportToHydac(format: string): void {
    let signalModel = []
   for(let i = 0; i < this.devicedata?.length;i++){
    signalModel.push({signalModel:this.devicedata[i].signalModel,params:[]});
   }

  let data = {
    "deviceId": this.devicedata[0].deviceModel?.deviceId,
    "signalParamViewModels": signalModel,
    "fromDate": this.fromDateHydac,
    "toDate": this.toDateHydac
  }
  console.log(data,"data checking");
  let dataResponseHydac ;
  this._dashboardservice.getparametersdata(data).subscribe(res => {
    console.log(res,"res checking");
    dataResponseHydac = res;
    type SignalExport = {
      signalid?: string,
      signalname?:string,
      value?: string,
      time?: Date,
     };  
      const rows: SignalExport[] = [];
    
     for (let i = 0; i < dataResponseHydac?.length;i++) {    
     const item: SignalExport = {}; 
    
      for(let j = 0;j < dataResponseHydac[i]?.signalDataModels?.length;j++){
        item.signalid = dataResponseHydac[i]?.signalModel?.signalId;  
        item.signalname = dataResponseHydac[i]?.signalModel?.signalName;
        item.value = dataResponseHydac[i]?.signalDataModels[j]?.value;
        item.time = dataResponseHydac[i]?.signalDataModels[j]?.timeReceived;
         rows.push(item); 
      }
     }
    const options: ExportOptions = {
    columns: [   
     { name: 'Signal ID', field: 'signalid', width: 25  },
     { name: 'Signal Name', field: 'signalname', width: 25 },
     { name: 'Value', field: 'value', width: 25 },
     { name: 'Time', field: 'time', width: 25 },
         ],
         rows: rows,
         fileName: 'Hydac-dataview',
         dateFormat: 'MM/dd/yyyy H:m:ss'
       };
       if (format === 'csv') { 
         this.exportAs.exportAsCsv(options);
         return;
       }
       if (format === 'xlsx') {
         this.exportAs.exportAsXlsx(options);
         return;
       }
  },
  error =>{
    console.error(error);
    this.toastr.error(error?.errorMessage)
  },
  () => console.log('COMPLETE')
  )
 
  }
  //export csv & excel in hydac end
  //release asset in hydac start
  releaseAssetPopup(){
      let dialogRef = this.dialog.open(ReleaseAssetsPopup,
        {
          width: '620px',
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result?.event}`); 
          if(result?.event == "update"){
            
          }
        });
  }

    //release asset in hydac start
  //multiple dashboard data start
  getDashboardName(data){
    this.parameterDashboard = true;
    this.dashboardLoading = true;
    this._dashboardservice.getDashboardApi(this.rmsAct.userAccountId,data?.dashboardName).subscribe(
      (data: any) => {
        this.dashboardLoading = false;
        this.devicedata = [];
        console.log(data,"multiple dashboard data checking")
        this.dashboardName = data?.dashboardName;
        this.dashboardTitle = data?.dashboardName;
        sessionStorage.setItem('dashboardName', this.dashboardName);
        let deviceDatalen = data?.userPreference;
        // console.log(deviceDatalen,"deviceDatalen check")
        sessionStorage.setItem('userPrefrenceData',deviceDatalen);
        this.devicedata = JSON.parse(deviceDatalen);
        console.log(this.devicedata,"v multiple checking");
        console.log(this.gridLayout,"this.gridLayout checking")
        this.deviceDataLength = this.devicedata?.length;
        // console.log(this.deviceDataLength,"this.deviceDataLength checking")
        this.gridLayout = JSON.parse(data?.userAccountModel?.gridLayoutId);
        // this.devicedata = len;
        
      },
      error => {
        console.error(error);
        this.dashboardLoading = false;
        this.toastr.error(error?.errorMessage)
      },
      () => console.log('COMPLETE')
    ); 
  }
  //dashboard change
  changeDashboard(signals){
    console.log(signals,"Parameter checking");
   
    if(signals?.id == 1) {
      this.parameterDashboard = true;
    }
    else {
      this.parameterDashboard = false;
    }
  }
  //multiple dashboard data end 
  getDeviceData(){

      this._dashboardservice.getDeviceData(this.rmsAct.customerId).subscribe(
        (data) => {
          this.deviceListData = data;
          console.log(this.deviceListData, "device data checking");
         
        },
        error => {
          console.error(error);
          this.dashboardLoading = false;
          this.toastr.error(error?.errorMessage)

        },
        () => console.log('COMPLETE')
      )
    
  }
  getTvsFormVal(){
    this.tvsDaterangeForm = new FormGroup(
      {
        fromToDate: new FormControl(null, Validators.required)
      }
    );
  }
  deviceSelection(signals,status){
    // this.tvsDaterangeForm.reset();
    if (this.tvsDaterangeForm.valid) {
      console.log("Form Submitted!");
      this.tvsDaterangeForm.reset();
    }
    console.log(signals,status,"Parameter,status")
    this.tvsSelectedDeviceid = signals?.deviceId;
    this.tvsStatus = status;
    // this.getTvsUtilizationConfigData(); 
    
  //   setTimeout(()=>{
  //     console.log(this.tvsUtilizeConfigData?.utilizationUpdateIntervalUnit,"this.tvsUtilizeConfigData?.utilizationUpdateIntervalUnit cheking")
  //   if(this.tvsUtilizeConfigData?.utilizationUpdateIntervalUnit == "minutes"){
  //     alert("minutes")
  //   }
  // },1000)
  // let today = new Date();
  //     let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  //     let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  //     let dateTime = date+' '+time;
  //     this.tvsFromDate = date+' '+'00:00:00';
  //     this.tvvsEndDate = dateTime;
  //     console.log(dateTime,"da get time cecll")
      this.getUtilizeData();
     setTimeout(()=>{
       console.log(this.utilizationData,"first utilize");
       const source = interval(this.utilizationData.timeGapToRecompute);
       this.subscription = source.subscribe(val =>{
        
         this.getUtilizeData()
       });
     },1000)

    // This is METHOD 2
    // this.intervalId = setInterval(this.getUtilizeData(), 1000);
  }
  getUtilizeData():any{
    if(this.tvsStatus == 'today'){
      let today = new Date();
      let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      let dateTime = date+' '+time;
      this.tvsFromDate = date+' '+'00:00:00';
      this.tvvsEndDate = dateTime;
      console.log(dateTime,"today da get time cecll")
      }else{
        this.tvsFromDate = this.tvsFromDate1;
        this.tvvsEndDate = this.tvvsEndDate1;
      }
    console.log(this.tvsFromDate,this.tvvsEndDate,"checking")
    this._dashboardservice.getTvsUtilizationApi(this.tvsSelectedDeviceid,this.tvsFromDate,this.tvvsEndDate).subscribe(
      (data) => {
        this.utilizationData = data;
        console.log(this.utilizationData, "utilizationData checking");
        this._dashboardservice.getTvsHighestUtilizationApi(this.rmsAct.customerId,this.tvsFromDate,this.tvvsEndDate).subscribe(
          (data1) => {
            this.HighestutilizationData = data1;
            
            console.log(this.HighestutilizationData, "this.HighestutilizationData checking");
            console.log(this.utilizationData.timeGapToRecompute,"time gap")
  
          },
          error => {
            console.error(error);
            this.dashboardLoading = false;
            this.toastr.error(error?.errorMessage)
    
          },
          () => console.log('COMPLETE')
        )
       
      },
      error => {
        console.error(error);
        this.dashboardLoading = false;
        this.toastr.error(error?.errorMessage)

      },
      () => console.log('COMPLETE')
    )
  }
  getTvsUtilizationConfigData(){
    
    this._dashboardservice.getTvsUtilizationConfig(this.tvsSelectedDeviceid).subscribe(
      (data) => {
        console.log(data,"utilization config checking");
        this.tvsUtilizeConfigData = data;
      },
      error => {
        console.error(error);
        this.dashboardLoading = false;
        this.toastr.error(error?.errorMessage)

      },
      () => console.log('COMPLETE') 
    );
  }

  customdate(stDate: any){
    console.log(stDate,"date range");
    this.tvsFromDate1 = stDate[0];
    this.tvvsEndDate1 = stDate[1];
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.deviceSelection(this.tvsSelectedDeviceid,'date')
  
    }
  dateRangeUtilizeApply() {
console.log(this.fromDate,"checking")
  }
//tvs dashboard map data start

getlng(){
  for(let i = 0; i < this.devicedata?.length; i++){
    if(this.devicedata[i].signalModel?.signalName == 'Longitude'){
      // console.log(typeof this.devicedata[i].signalDataModels[0]?.dataValue)
      if(typeof this.devicedata[i].signalDataModels[0]?.dataValue === "string"){
        let num = parseFloat(this.devicedata[i].signalDataModels[0]?.dataValue);
        return num;
      }else{
        return this.devicedata[i].signalDataModels[0]?.dataValue;
      }
     
    }
  }
} 
getlat(){
  for(let i = 0; i < this.devicedata?.length; i++){
    if(this.devicedata[i].signalModel?.signalName == 'Latitude'){
      if(typeof this.devicedata[i].signalDataModels[0]?.dataValue === "string"){
        let num = parseFloat(this.devicedata[i].signalDataModels[0]?.dataValue);
        return num;
      }else{
        return this.devicedata[i].signalDataModels[0]?.dataValue;
      }
    }
  }
}
//tvs dashboard map data end
  opensnack1(te){
    console.log(te,"text check")
  }
  getCalcuteDate(create,current){
    let start = new Date(create,);
    let end = new Date(current);
   console.log(start.getTime(),end.getTime(),"start and end date cekin")
   let diff = end.getTime() - start.getTime();
        let days = Math.floor(diff / (60 * 60 * 24 * 1000));
        let hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
        let minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
        let seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));
        // let tot = +hours+':'+minutes+':'+seconds
        console.log(days,hours,minutes,seconds);

        if(days > 0){
          let hoursSplit = (days * 24);
          console.log(hoursSplit + hours,"hoursSplit ceckin");
          let totalHours = hoursSplit + hours ;
          let totalAll = +totalHours+':'+minutes+':'+seconds
          return totalAll;
        }
        else{
          let tot = +hours+':'+minutes+':'+seconds
          return tot;
        }

  }
  getCalculateTime(start,end){
    // var start = "00:11:06";
    // var end = "10:11:06";
      let a = start.split(":");
     let seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
     var b = end.split(":");
     var seconds2 = (+b[0]) * 60 * 60 + (+b[1]) * 60 + (+b[2]);

     let date1 = new Date(1970,0,1);
         date1.setSeconds(seconds + seconds2);

     let c = date1.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
    console.log(c);
    return c;
  }
  getPeetronashAllData(){
    let today = new Date();
      let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      let dateTime = date+' '+time;
      console.log(dateTime,"da get time cecll")
    this.petronashLoading = true;
      this.accountdetails.email = this.rmsAct.email;
      this.accountdetails.password = this.dummyPwd;
      this.petronashDashboardFormVal();
      this._dashboardservice.getAllSignals(this.accountdetails).subscribe(
        (data: any) => {
          let x: any = data['userAccountModel'];
          this.petronashInputModel = data['inputModel'];

          console.log(this.petronashInputModel, "this.petronashInputModel checking")
          console.log(this.petronashInputModel[0]["value"], "this.setPetronashInputModel[0]?.value checking")
          this.petronashModel = JSON.parse(x.userPreference);
          console.log(this.petronashModel,"this.petronashModel checking")
          this.getTimePeriodPumpA('Today');
          this.getTimePeriodPumpB('Today');
          this.getTimePeriodTotalDischarge('Today');
          this.petronashLoading = false;
          if (this.petronashModel.length > 0) {

             //set Flow rate start
        console.log(this.setFlowRate.value,"this.setFlowRate.value checking")
        this._dashboardservice.getFlowRateApi(this.petronashInputModel[0]["value"],dateTime).subscribe(
          data => {
              this.setFlowRateData = data;
          },
          error => {
            console.error(error);
            this.dashboardLoading = false;
            this.toastr.error(error?.errorMessage)
            
          },
          () => console.log('COMPLETE')
        );
        //set Flow rate end
            this.setPetronashInputModel();
            this.splitAllData();
            let pumpASlideId = 292;
            this._dashboardservice.getPumpSlideApi(pumpASlideId,dateTime).subscribe(
              (data) => {
                this.testingPumpAData = data;
                console.log(this.testingPumpAData,"this.testingPumpAData checking")
              },
              error => {
                console.error(error);
                this.dashboardLoading = false;
                this.toastr.error(error?.errorMessage)

              },
              () => console.log('COMPLETE')
            );
            let pumpBSlideId = 294;
            this._dashboardservice.getPumpSlideApi(pumpBSlideId,dateTime).subscribe(
              (data) => {
                this.testingPumpBData = data;
                console.log(this.testingPumpBData,"this.testingPumpBData checking")
              },
              error => {
                console.error(error);
                this.dashboardLoading = false;
                this.toastr.error(error?.errorMessage)

              },
              () => console.log('COMPLETE')
            );
            this._dashboardservice.getChemCostApi(this.petronashInputModel[1]["value"],dateTime).subscribe(
                (data: any) => {
                this.chemicalCostData = data;
                console.log(this.chemicalCostData,"this.chemicalCostData checking")
                },
                error => {
                  console.error(error);
                  this.dashboardLoading = false;
                  this.toastr.error(error?.errorMessage)

                },
                () => console.log('COMPLETE')
              );
            this.DashboardMqttConnect(this.rmsAct.userAccountId)
          }

          if (this.petronashModel == null) {
            this.petronashModel = []
          }
          else {

          }


        },
        error => {
          console.error(error);
          this.dashboardLoading = false;
          this.toastr.error(error?.errorMessage)

        },
        () => console.log('COMPLETE')
      );
  }
  coursesPercentage;
  datasize;
  setPetronashInputModel() {
    console.log(this.petronashInputModel[0]["value"], "this.petronashInputModel[0]?.value checking")
    this.petronashDashboardForm.get("setFlowRate").setValue(this.petronashInputModel[0]["value"]);
    this.petronashDashboardForm.get("chemicalCost").setValue(this.petronashInputModel[1]["value"]);
    this.petronashDashboardForm.get("tankLevelMax").setValue(this.petronashInputModel[2]["value"]);
  }
  splitAllData() {
    for (let i = 0; i < this.petronashModel.length; i++) {
      if (this.petronashModel[i].signalModel?.signalId == 283) {
        this.pumpAData = this.petronashModel[i];
        console.log(this.pumpAData, "this.pumpAData checking");
      }
      if (this.petronashModel[i].signalModel?.signalId == 285) {
        this.PumpATrippedData = this.petronashModel[i];
        console.log(this.PumpATrippedData, "this.pumpAData checking");
      }
      if (this.petronashModel[i].signalModel?.signalId == 286) {
        this.pumpBData = this.petronashModel[i];
        console.log(this.pumpBData, "this.pumpBData checking");
      }
      if (this.petronashModel[i].signalModel?.signalId == 288) {
        this.pumpBTrippedData = this.petronashModel[i];
        console.log(this.pumpBTrippedData, "this.pumpBTrippedData checking");
      }
      if (this.petronashModel[i].signalModel?.signalId == 289) {
        this.EmeregenyData = this.petronashModel[i];
        console.log(this.EmeregenyData, "this.EmeregenyData checking");
      }
      if (this.petronashModel[i].signalModel?.signalId == 276) {
        this.TankLevelData = this.petronashModel[i];
        this.coursesPercentage = (this.TankLevelData?.signalDataModels[0].dataValue / this.TankLevelData?.signalModel?.signalEndRange) * 100;
        this.datasize = this.coursesPercentage + '%';
      }
      if (this.petronashModel[i].signalModel?.signalId == 277) {
        this.isSignalDataPresnet = true;
        this.numberData = this.petronashModel[i];
      }

      if (this.petronashModel[i].signalModel?.signalId == 279) {
        this.isSignalDataPresnet = true;
        this.rtdData = this.petronashModel[i];
        console.log(this.rtdData, "this.rtdData checking");

      }

      if (this.petronashModel[i].signalModel?.signalId == 301) {
        this.isSignalDataPresnet = true;
        this.latitudeData = this.petronashModel[i];
        console.log(this.latitudeData, "this.latitudeData checking");

      }

      if (this.petronashModel[i].signalModel?.signalId == 302) {
        this.isSignalDataPresnet = true;
        this.longitudeData = this.petronashModel[i];
        console.log(this.longitudeData, "this.longitudeData checking");

      }

      if (this.petronashModel[i].signalModel?.signalId == 303) {
        this.isSignalDataPresnet = true;
        this.signalStrength = this.petronashModel[i];
        console.log(this.signalStrength, "this.signalStrength checking");

      }

    }
  }
  togglePumpStateHydac(signalId: any, deviceId: any, state: number) {
    return new Promise<any>((resolve, reject) => {
      // data may not be updated for rmsAct
      // const accountSettings: any[] = JSON.parse(this.rmsAct.userPreference);
      // const deviceSignal = accountSettings.find(s => s.signalModel.signalId == signalId && s.signalModel.deviceId == deviceId);
      // if (deviceSignal) {
        this._dashboardservice.updatePumpStatusHydac(this.rmsAct.customerId,this.hydacDeviceID, state).subscribe(res => {
          // A signal to device has sent
          // It may take some time to recieve from live data
          resolve(res);
        }, error => {
          reject(error);
        });
      // }
    });
  }

  pumpClickHydac(e: MouseEvent, state: any) {
    if(!state.disabled && confirm(`Confirm ${state.checked?'Stop':'Start'}`)){
      return;
    }else {
      e.preventDefault();
    }
  }
 
  pumpSlideHydac(ob: MatSlideToggleChange) {
    ob.source.setDisabledState(true);
    if(ob.checked === true) {
      this.exportIconHydac = false;
      let today = new Date();
      let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      this.fromDateHydac = date+' '+time;
      
    }else{
      this.exportIconHydac = true;
      let today = new Date();
      let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      this.toDateHydac = date+' '+time;
    }
      this.togglePumpStateHydac('',this.hydacDeviceID, ob.checked ? 1 : 0).then((res) => {
        this.toastr.success(` ${ob.checked?'Starting Test':'Stopping Test'}`);
      }).catch(_ => {
        this.toastr.error(` failed to ${ob.checked?'Start Test':'Stop Test'}`);
        ob.source.toggle();
      }).finally(() => {
        ob.source.setDisabledState(false);
      });
  }

  togglePumpState(signalId: any, deviceId: any, state: number) {
    return new Promise<any>((resolve, reject) => {
      // data may not be updated for rmsAct
      const accountSettings: any[] = JSON.parse(this.rmsAct.userPreference);
      const deviceSignal = accountSettings.find(s => s.signalModel.signalId == signalId && s.signalModel.deviceId == deviceId);
      if (deviceSignal) {
        this._dashboardservice.updatePumpStatus(this.rmsAct.customerId,deviceSignal.signalModel, state).subscribe(res => {
          // A signal to device has sent
          // It may take some time to recieve from live data
          resolve(res);
        }, error => {
          reject(error);
        });
      }
    });
  }

  pumpClick(e: MouseEvent, state: any) {
    if(!state.disabled && confirm(`Confirm ${state.checked?'Stop':'Start'}`)){
      return;
    }else {
      e.preventDefault();
    }
  }
 
  pumpASlide(ob: MatSlideToggleChange) {
    ob.source.setDisabledState(true);
      this.togglePumpState(292, 20, ob.checked ? 1 : 0).then((res) => {
        this.toastr.success(`Pump A ${ob.checked?'Starting':'Stopping'}`);
      }).catch(_ => {
        this.toastr.error(`Pump A failed to ${ob.checked?'Start':'Stop'}`);
        ob.source.toggle();
      }).finally(() => {
        ob.source.setDisabledState(false);
      });
  }

  pumpBSlide(ob: MatSlideToggleChange) {
    ob.source.setDisabledState(true);
      this.togglePumpState(294, 20, ob.checked ? 1 : 0).then((res) => {
        this.toastr.success(`Pump B ${ob.checked?'Starting':'Stopping'}`);
      }).catch(_ => {
        this.toastr.error(`Pump B failed to ${ob.checked?'Start':'Stop'}`);
        ob.source.toggle();
      }).finally(() => {
        ob.source.setDisabledState(false);
      });
  }

  onRecived(data: IMqttMessage) {
    var decodeData: any = new TextDecoder('utf-8').decode(data.message);
    const messages: any = JSON.parse(decodeData);
    console.log(this.devicedata);
    if (this.rmsAct.customerId != 5) {
      this.devicedata.forEach(x => {

        let result = messages.filter(y => y.deviceId == x.deviceModel.deviceId && y.signalId == x.signalModel.signalId);
        console.log(result);   
        if (result.length > 0) {
          x.signalDataModels[0]['dataValue'] = result[0].dataValue;
          x.signalDataModels[0]['timeReceived'] = result[0].timeReceived;
        }
      })
    }
    else {
      this.updatePetronashData(messages);
    }
    console.log(this.devicedata);

  }

  totalDischargeData: any[] = [];
  updatePetronashData(data: any) {
    console.log(data,"mqtt data checking")
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date+' '+time;
    
 const pumpAOldState = this.pumpAData.signalDataModels[0].dataValue;
 const pumpBOldState = this.pumpBData.signalDataModels[0].dataValue;
     let pumpARunDataVal;
    let pumpAStopDataVal;
    let pumpBRunDataVal;
    let pumpBStopDataVal;
    // debugger;
    data.map(x => {
      if (x.signalId == 292) {
        pumpARunDataVal = x.dataValue;
        if (x.dataValue == 1 && pumpAOldState == 0) {
          this.testingPumpAData.lastStartDateTime = x.timeReceived;
          this.testingPumpAData.lastStopDateTime = null;
          this.testingPumpAData.runTime = null;
        }
      }
      if (x.signalId == 293) {
        pumpAStopDataVal = x.dataValue;
        if (x.dataValue == 1 && pumpAOldState == 1) {
          this.testingPumpAData.lastStopDateTime = x.timeReceived;
          this.testingPumpAData.runTime = this.getCalcuteDate(this.testingPumpAData.lastStartDateTime, this.testingPumpAData.lastStopDateTime);
          this.testingPumpAData.pumpTotalRun = this.getCalculateTime(this.testingPumpAData.pumpTotalRun, this.testingPumpAData.runTime);
          this.testingPumpAData.idleTimeLastStop = this.getCalcuteDate(this.testingPumpAData.lastStopDateTime, dateTime);
        }
      }
      if (x.signalId == 294) {
        pumpBRunDataVal = x.dataValue;
        if (x.dataValue == 1 && pumpBOldState == 0) {
          this.testingPumpBData.lastStartDateTime = x.timeReceived;
          this.testingPumpBData.lastStopDateTime = null;
          this.testingPumpBData.runTime = null;
         
        }
      }
      if (x.signalId == 295) {
        pumpBStopDataVal = x.dataValue;
        if (x.dataValue == 1 && pumpBOldState == 1) {
          this.testingPumpBData.lastStopDateTime = x.timeReceived;
          this.testingPumpBData.runTime = this.getCalcuteDate(this.testingPumpBData.lastStartDateTime, this.testingPumpBData.lastStopDateTime);
          this.testingPumpBData.pumpTotalRun = this.getCalculateTime(this.testingPumpBData.pumpTotalRun, this.testingPumpBData.runTime);
          this.testingPumpBData.idleTimeLastStop = this.getCalcuteDate(this.testingPumpBData.lastStopDateTime, dateTime);
         
        }
      }
      if (x.signalId == 283) {
        this.pumpAData.signalDataModels[0]['dataValue'] = x.dataValue;
        this.pumpAData.signalDataModels[0]['timeReceived'] = x.timeReceived;
       
      }
      if (x.signalId == 285) {
        this.PumpATrippedData.signalDataModels[0]['dataValue'] = x.dataValue;
        this.PumpATrippedData.signalDataModels[0]['timeReceived'] = x.timeReceived;
       
      }
      if (x.signalId == 286) {
        this.pumpBData.signalDataModels[0]['dataValue'] = x.dataValue;
        this.pumpBData.signalDataModels[0]['timeReceived'] = x.timeReceived;
        
      }
      if (x.signalId == 288) {
        this.pumpBTrippedData.signalDataModels[0]['dataValue'] = x.dataValue;
        this.pumpBTrippedData.signalDataModels[0]['timeReceived'] = x.timeReceived;
       
      }
      if (x.signalId == 289) {
        this.EmeregenyData.signalDataModels[0]['dataValue'] = x.dataValue;
        this.EmeregenyData.signalDataModels[0]['timeReceived'] = x.timeReceived;
        this.notifyService.notify(x);
        
      }
      if (x.signalId == 276) {
        this.TankLevelData.signalDataModels[0]['dataValue'] = x.dataValue;
        this.TankLevelData.signalDataModels[0]['timeReceived'] = x.timeReceived;
        this.coursesPercentage = (this.TankLevelData?.signalDataModels[0].dataValue / this.TankLevelData?.signalModel?.signalEndRange) * 100;
        this.datasize = this.coursesPercentage + '%';
   

      }
      if (x.signalId == 277) {
        this.numberData.signalDataModels[0]['dataValue'] = x.dataValue;
        this.numberData.signalDataModels[0]['timeReceived'] = x.timeReceived;
        this.isSignalDataPresnet = true;
      
       
    
      }

      if (x.signalId == 279) {
        this.rtdData.signalDataModels[0]['dataValue'] = x.dataValue;
        this.rtdData.signalDataModels[0]['timeReceived'] = x.timeReceived;
      
      }

      if (x.signalId == 301) {
        this.latitudeData.signalDataModels[0]['dataValue'] = x.dataValue;
        this.latitudeData.signalDataModels[0]['timeReceived'] = x.timeReceived;
       
      }

      if (x.signalId == 302) {
        this.longitudeData.signalDataModels[0]['dataValue'] = x.dataValue;
        this.longitudeData.signalDataModels[0]['timeReceived'] = x.timeReceived;
       
      }

      if (x.signalId == 303) {
        this.signalStrength.signalDataModels[0]['dataValue'] = x.dataValue;
        this.signalStrength.signalDataModels[0]['timeReceived'] = x.timeReceived;
       
      }
     
        // this.testingPumpAData.runTime = this.getCalcuteDate(this.testingPumpAData.lastStartDateTime,this.testingPumpAData.lastStopDateTime);
        // this.testingPumpBData.runTime = this.getCalcuteDate(this.testingPumpBData.lastStartDateTime,this.testingPumpBData.lastStopDateTime);
        // if(pumpARunDataVal == 0 && pumpAStopDataVal == 1){
        //   this.testingPumpAData.idleTimeLastStop = this.getCalcuteDate(this.testingPumpAData.lastStopDateTime,dateTime);
        // }
        // if(pumpARunDataVal == 1 && pumpAStopDataVal == 0){
        //   this.testingPumpAData.idleTimeLastStop = this.getCalcuteDate(this.testingPumpAData.lastStopDateTime,this.testingPumpAData.lastStartDateTime);
        // }
        // if(pumpBRunDataVal == 0 && pumpBStopDataVal == 1){
        //   this.testingPumpBData.idleTimeLastStop = this.getCalcuteDate(this.testingPumpBData.lastStopDateTime,dateTime);
        // }
        // if(pumpBRunDataVal == 1 && pumpBStopDataVal == 0){
        //   this.testingPumpBData.idleTimeLastStop = this.getCalcuteDate(this.testingPumpBData.lastStopDateTime,this.testingPumpBData.lastStartDateTime);
        // }
        // // this.testingPumpAData.pumpTotalRun = this.getCalculateTime(this.testingPumpAData.pumpTotalRun,this.testingPumpAData.runTime);
        // this.testingPumpBData.pumpTotalRun = this.getCalculateTime(this.testingPumpBData.pumpTotalRun,this.testingPumpBData.runTime);

    })


  }


  //petronash dashboard code start

  getDateSplit(dateSplit) {
    if (dateSplit != null || dateSplit != undefined) {
      let spl = "";
      if (dateSplit.includes("T") == true) {
        spl = dateSplit.split("T");
      }
      else {
        spl = dateSplit.split(" ");
      }
      return spl[0]
    }
  }
  getTimeSplit(timeSplit) {
    if (timeSplit != null || timeSplit != undefined) {
      let spl = "";
      if (timeSplit.includes("T") == true) {
        spl = timeSplit.split("T");
      }
      else {
        spl = timeSplit.split(" ");
      }
      return spl[1]
    }
  }

  getAmPmSplit(timeSplit) {
    if (timeSplit != null || timeSplit != undefined) {
      let spl = "";
      if (timeSplit.includes("T") == true) {
        spl = timeSplit.split("T");
      }
      else {
        spl = timeSplit.split(" ");
      }
      return spl[2]
    }
  }

  getHoursData(splitHours) {
    if (splitHours != null || splitHours != undefined) {
      let spl = "";
      if (splitHours.includes("T") == true) {
        spl = splitHours.split("T");
      }
      else {
        spl = splitHours.split(" ");
      }
      let hoursSplit = spl[1].split(":");
      return hoursSplit[0];
    }

  }
  getMinutesData(splitHours) {
    if (splitHours != null || splitHours != undefined) {
      let spl = "";
      if (splitHours.includes("T") == true) {
        spl = splitHours.split("T");
      }
      else {
        spl = splitHours.split(" ");
      }
      let hoursSplit = spl[1].split(":");
      return hoursSplit[1];
    }

  }
  getSecondsData(splitHours) {
    if (splitHours != null || splitHours != undefined) {
      let spl = "";
      if (splitHours.includes("T") == true) {
        spl = splitHours.split("T");
      }
      else {
        spl = splitHours.split(" ");
      }
      let hoursSplit = spl[1].split(":");
      return hoursSplit[2];
    }

  }
  getDateData(splitHours) {
    if (splitHours != null || splitHours != undefined) {
      let spl = "";
      if (splitHours.includes("T") == true) {
        spl = splitHours.split("T");
      }
      else {
        spl = splitHours.split(" ");
      }
      let hoursSplit = spl[0].split("-");
      return hoursSplit[2];
    }

  }
  getMonthData(splitHours) {
    if (splitHours != null || splitHours != undefined) {
      let spl =0;
      if (splitHours.includes("T") == true) {
        spl = splitHours.split("T");
      }
      else {
        spl = splitHours.split(" ");
      }
      let hoursSplit = spl[0].split("-");
      //  return hoursSplit[2];
      let s = hoursSplit[1].replace(/^0+/, '');
      if (typeof s == "string") {
        s = parseInt(s);
      } else {

      }
      switch (s) {
        case 1:
          return "Jan";
          break;
        case 2:
          return "Feb";
          break;
        case 3:
          return "mar";
          break;
        case 4:
          return "Apr";
          break;
        case 5:
          return "May";
          break;
        case 6:
          return "Jun";
          break;
        case 7:
          return "jul";
        case 8:
          return "Aug";
          break;
        case 9:
          return "Sep";
          break;
        case 10:
          return "Oct";
          break;
        case 11:
          return "Nov";
          break;
        case 12:
          return "Dec"
          break;

      }

    }

  }

  getYearData(splitHours) {
    if (splitHours != null || splitHours != undefined) {
      let spl = "";
      if (splitHours.includes("T") == true) {
        spl = splitHours.split("T");
      }
      else {
        spl = splitHours.split(" ");
      }
      let hoursSplit = spl[0].split("-");
      return hoursSplit[0];
    }

  }

  // petronash dashboard code start


  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscription.unsubscribe();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.dashboardtopic) {
      this._mqttService.unsubcribe(this.dashboardtopic).finally(() => console.log("Unsubscribed topic from dashboard: " + this.dashboardtopic)
      )
    }
    this.subscription1 && this.subscription1.unsubscribe();

    // For method 2
    clearInterval(this.intervalId);
  }

  back(){
    console.log("------");
    
    var data="usrlist";
    this.router.navigate(['/dashboard/accountsetting'], {
      state: { example: data }
    });
  }
  backHydac() {
    this.router.navigate(['/dashboard/userDashboards'])
  }
  backShow = false;
  onUserSelection() {
    if (this._Activatedroute.snapshot.paramMap.get("userAccountId")) {
      console.log(this._Activatedroute.snapshot.paramMap.get("userAccountId"),"on selection")
      this.backShow = true;
      console.log(this._Activatedroute.snapshot.paramMap.get("userAccountId"), "user list account id ceck")
      this.selectedUser = this._Activatedroute.snapshot.paramMap.get("userAccountId");

    } else {
      this.backShow = false;
    }
    console.log(this.selectedUser);
    console.log(this.users);
    let selectedObj = this.users.find(x => x.userAccountId == this.selectedUser);
    console.log(selectedObj);
    let temp = {
      'firstName': selectedObj.firstName,
      'userAccountId': selectedObj.userAccountId,
      'userRole': selectedObj.userRoleId
    }
    sessionStorage.setItem('rmsSelectedUser', JSON.stringify(temp));
    this.dashboardLoading = true;
    this._dashboardservice.getUserPreferenceAdmin(this.selectedUser).subscribe(
      (data:UserAccountModel) => {
        let x: any = data;
        this.dashboardLoading = false;
        this.devicedata = JSON.parse(x.userPreference);
        if (this.devicedata == null) {
          this.devicedata = []
        }
        else {
          this.gridLayout = data["gridLayoutId"];
          this.DashboardMqttConnect(this.selectedUser);
        }
      },
      error => console.log('ERROR!! Fetch user Parameters failed')
    )
  }

  onDashboardSelection() {
    //  sessionStorage.setItem('rmsSelectedDashboard', JSON.stringify(this.selectedDashboard));
  }




  DashboardMqttConnect(selectedUser: string) {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.dashboardtopic != null) {
      this._mqttService.unsubcribe(this.dashboardtopic).finally(() => console.log("Unsubscribed topic is: " + this.dashboardtopic));
    }
    this.subscription = this._mqttService.observe(d => this.onRecived(d));
    if (this.userdDashboard) {
      this.dashboardtopic = "rms/admin/user/" + selectedUser;
    }
    else {
      this.dashboardtopic = "rms/user/" + this.rmsAct.userAccountId;
    }
    this._mqttService.subscribe(this.dashboardtopic).finally(() => {
      console.log("from user dashboard subscribed to topic: " + this.dashboardtopic);
    });
    console.log(this.dashboardtopic);
  }

  navigateUser() {
    this.router.navigate(['/dashboard/user/selectdevice/' + this.selectedUser]);
  }
  gridMenu() {
    document.getElementById('sidebarMenu').style.transform = "translateX(0px)";
  }
  layoutsfun(layout) {
    this.dashboardLoading = true;
    console.log(this.rmsAct, "use model data checking");
    let gridObj = {
      "firstName": this.rmsAct.firstName,
      "lastName": this.rmsAct.lastName,
      "phoneNo": this.rmsAct.phoneNo,
      "email": this.rmsAct.email,
      "customerId": this.rmsAct.customerId,
      "userRoleId": this.rmsAct.userRoleId,
      "designation": this.rmsAct.designation,
      "statusTypeId": this.rmsAct.statusTypeId,
      "gridLayoutId": layout
    }
    this._dashboardservice.setGridLayout(this.rmsAct.userAccountId, gridObj).subscribe(
      data => {
        console.log(data, "grid layout checking")
        let gridData = data;
        this.gridLayout = gridData["gridLayoutId"];
        
        document.getElementById('sidebarMenu').style.transform = "translateX(350px)";
        this.dashboardLoading = false;
      },

      error => console.log('ERROR!! Fetch user Parameters failed')

    )
    // this.gridLayout = layout;
    console.log(layout, "layout checking")
  }
  closeGrid() {
    document.getElementById('sidebarMenu').style.transform = "translateX(350px)";
  }

  opensnack(text: string): void {
    console.log(text);
  }


  deviceglobalchange(device) {
   
    if (device.value == "Bar") {
     
      for (let i = 0; i < this.devicedata.length; i++) {
        this.devicedata[i].widgetTypeModel.bar = true;
        this.devicedata[i].widgetTypeModel.rule = false;
        this.devicedata[i].widgetTypeModel.gauge = false;
      }
    }
    if (device.value == "Ruler") {
      for (let i = 0; i < this.devicedata.length; i++) {
        this.devicedata[i].widgetTypeModel.bar = false;
        this.devicedata[i].widgetTypeModel.rule = true;
        this.devicedata[i].widgetTypeModel.gauge = false;
      }
     
    }
    if (device.value == "Gauge") {
      for (let i = 0; i < this.devicedata.length; i++) {
        this.devicedata[i].widgetTypeModel.bar = false;
        this.devicedata[i].widgetTypeModel.rule = false;
        this.devicedata[i].widgetTypeModel.gauge = true;
      }
     
    }
  }

  petronashConfigPopup() {

    let dialogRef = this.dialog.open(PetronashConfigPopup,
      {
        width: '600px',
        // height:'400px',
        data:this.petronashInputModel
      });
      dialogRef.afterClosed().subscribe(result => {
         //tank level api purpose will call to petronash validate start
        console.log(result,"result confi close")
        if(result == "update"){
         this.getPeetronashAllData();
        }
        else{

        }
   //tank level api purpose will call to petronash validate end
      });
  }


  petronashDashboardForm: FormGroup;
  titleAlert: string = 'This field is required';
  petronashDashboardFormVal() {
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.petronashDashboardForm = this.formBuilder.group({
      'setFlowRate': [null, Validators.required],
      'tankLevelMax': [null, Validators.required],
      'chemicalCost': [null, Validators.required],
    });
  }
  get setFlowRate() {
    return this.petronashDashboardForm.get('setFlowRate') as FormControl
  }
  get tankLevelMax() {
    return this.petronashDashboardForm.get('tankLevelMax') as FormControl
  }
  get chemicalCost() {
    return this.petronashDashboardForm.get('chemicalCost') as FormControl
  }

  onSubmit() {

  }
  // Petronash-chem-cost-popup end
  //pump start stop trend start here
  PumpADateRangeData;
  pumpAStartStopData;
  pumpAStartStopCategories;
  PumpBDateRangeData;
  pumpBStartStopData;
  pumpBStartStopCategories;
  totalDischargecategories;
  totalDischargeData1;
  signalDateApply(id,from,to) {
    if(id == 292){
      // alert("292")
      this.PumpAStartStopContent = `From:${from} To: ${to}`
      console.log(this.PumpAStartStopContent,"this.PumpAStartStopContent")
      this._dashboardservice.getPetronashSignalDateRangeApi(id,from,to).subscribe(
        (res) => {
          this.isSignalDataPresnet = true;
          this.PumpADateRangeData = res;
          console.log(this.PumpADateRangeData,"this.signalDateRangeData checking")
          this.pumpAStartStopCategories = []
          let items = []
          // if(res){
            this.PumpADateRangeData.forEach((signalDataModel) => {
              this.pumpAStartStopCategories.push(signalDataModel.time);
            })
             items = this.PumpADateRangeData.map(item => Number.parseFloat(item.value));
             this.pumpAStartStopData =[{
              data: items,
              step: 'Pump A',
              name: 'Pump A 0-Off 1-On'
          }]
          // }

        },
        (error) => {
          console.log(error)
          this.dashboardLoading = false;
          this.toastr.error(error?.errorMessage)
        },
        () => console.log('COMPLETE')
      );
    }
    if(id == 294){
      this.PumpBStartStopContent = `From:${from} To: ${to}`;
      // alert("294")
      this._dashboardservice.getPetronashSignalDateRangeApi(id,from,to).subscribe(
        (res) => {
          this.isSignalDataPresnet = true;
          this.PumpBDateRangeData = res;
          console.log(this.PumpBDateRangeData,"this.signalDateRangeData checking")
          this.pumpBStartStopCategories = []
          let items = []
          // if(res){
            this.PumpBDateRangeData.forEach((signalDataModel) => {
              this.pumpBStartStopCategories.push(signalDataModel.time);
            })
             items = this.PumpBDateRangeData.map(item => Number.parseFloat(item.value));
             this.pumpBStartStopData = [{
              data: items,
              step: 'Pump B',
              name: 'Pump B 0-Off 1-On'
          }]
          // }

        },
        (error) => {
          console.log(error)
          this.dashboardLoading = false;
          this.toastr.error(error?.errorMessage)
        },
        () => console.log('COMPLETE')
      );
    }
    if(id == 277){
      // alert("277")
      this.TotalDischargeContent = `From:${from} To: ${to}`;
      this.totalDischargeData1 =[];

    this._dashboardservice.getTotalDischargeRangeApi(id,from,to).subscribe(
        (res) => {
          this.isSignalDataPresnet = true;
          this.totalDischargeData1 = res;
          console.log(this.totalDischargeData1,"this.signalDateRangeData checking")
          this.totalDischargecategories = []
          this.totalDischargeData = [];
          let items = []
          // if(res.length < 0){
            this.totalDischargeData1?.signalDataModels?.forEach((signalDataModel) => {
              this.totalDischargecategories.push(signalDataModel.timeReceived);
            })
             items = this.totalDischargeData1.signalDataModels.map(item => Number.parseFloat(item.dataValue));
             this.totalDischargeData = [{
              name: "Discharge flow",
              data: items
            }];
            console.log(this.totalDischargecategories,this.totalDischargeData,"this.totalDischargeData ceckin")
          // }
          
          

        },
        (error) => {
          console.log(error)
          this.dashboardLoading = false;
          this.toastr.error(error?.errorMessage)
        },
        () => console.log('COMPLETE')
      );
    }

  }

  getTimePeriodPumpA(time) {
    let today = new Date();
      let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      let time1 = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      let dateTime = date+' '+time1;
      
    this.PumpAStartStopContent = time;
    this.PumpADateRangeData = [];
  
    // setTimeout(()=>{
      this._dashboardservice.getPumpStartStopTrendApi(292,dateTime,time).subscribe(
        (res) => {
          this.isSignalDataPresnet = true;
          this.PumpADateRangeData = res;
        
          this.pumpAStartStopCategories = []
          let items = []
          // if(res){
            this.PumpADateRangeData.forEach((signalDataModel) => {
              this.pumpAStartStopCategories.push(signalDataModel.time);
            })
             items = this.PumpADateRangeData.map(item => Number.parseFloat(item.value));
             this.pumpAStartStopData =[{
              data: items,
              step: 'Pump A',
              name: 'Pump A 0-Off 1-On'
          }]
          // }

        },
        (error) => {
          console.log(error)
          this.dashboardLoading = false;
          this.toastr.error(error?.errorMessage)
        },
        () => console.log('COMPLETE')
      );
    // },1000)
  }
  getTimePeriodPumpB(time){
    let today = new Date();
      let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      let time1 = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      let dateTime = date+' '+time1;
     
    this.PumpBStartStopContent = time;
    this.PumpBDateRangeData = [];
  
    // setTimeout(()=>{
      this._dashboardservice.getPumpStartStopTrendApi(294,dateTime,time).subscribe(
        (res) => {
          this.isSignalDataPresnet = true;
          this.PumpBDateRangeData = res;
        
          this.pumpBStartStopCategories = []
          let items = []
          // if(res){
            this.PumpBDateRangeData.forEach((signalDataModel) => {
              this.pumpBStartStopCategories.push(signalDataModel.time);
            })
             items = this.PumpBDateRangeData.map(item => Number.parseFloat(item.value));
             this.pumpBStartStopData = [{
              data: items,
              step: 'Pump B',
              name: 'Pump B 0-Off 1-On'
          }]
          // }

        },
        (error) => {
          console.log(error)
          this.dashboardLoading = false;
          this.toastr.error(error?.errorMessage)
        },
        () => console.log('COMPLETE')
      );
    // },1000)

  }
  getTimePeriodTotalDischarge(time){
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time1 = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date+' '+time1;
   
    this.TotalDischargeContent = time;
    this.PumpBDateRangeData =[];
    let pumpAId = 277;
      this._dashboardservice.getTotalDischargeTrendApi(pumpAId,dateTime,time).subscribe(
        (res) => {
          this.isSignalDataPresnet = true;
          this.totalDischargeData1 = res;
         
          this.totalDischargecategories = []
          this.totalDischargeData = [];
          let items = []
          // if(res.length < 0){
            this.totalDischargeData1?.signalDataModels?.forEach((signalDataModel) => {
              this.totalDischargecategories.push(signalDataModel.timeReceived);
            })
             items = this.totalDischargeData1.signalDataModels.map(item => Number.parseFloat(item.dataValue));
             this.totalDischargeData = [{
              name: "Discharge flow",
              data: items
            }];
           
          // }
          

        },
        (error) => {
          console.log(error)
          this.dashboardLoading = false;
          this.toastr.error(error?.errorMessage)
        },
        () => console.log('COMPLETE')
      );
  }
//pump start stop trend end here

//date range start
dateRangeConfigure(sinalId) {
 console.log(sinalId);
  let dialogRef = this.dialog.open(DateRangeConfigurePopup,
    {
      width: '600px',
      // height:'400px',
      data:sinalId

    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result,"date ran ceckin")
      if(result[0] != undefined && result[1] != undefined && result[2] != undefined && result[3] == "dateRangeApply"){
        this.signalDateApply(result[0],result[1],result[2]);
      }else{
        // alert("normal")
      }
    });

}

//date range end

//TVS Utilization Config popup start
tvsUtilizationConfigPopup() {

  let dialogRef = this.dialog.open(tvsUtilizationConfigPopup,
    {
      width: '600px',
      data:this.tvsSelectedDeviceid
  
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result?.event}`); 
      if(result?.event == "update"){
        this.utilizationData = [];
        this.getTvsUtilizationConfigData();
        this.getUtilizeData();
      }
    })
}

//TVS Utilization Config popup end

}

//TVS Utilization Config popup template start

@Component({
  selector: 'tvs-utilization-config-popup',
  templateUrl: './tvs-utilization-config-popup.html',
  styleUrls: ['./dashboard-view.component.scss']
})

export class tvsUtilizationConfigPopup implements OnInit {
 
  utilizationUpdateIntervalUnitData = ['hours',
                                           'minutes',
                                           'seconds'
                       ];
tvsUtilizeConfigData;
tvsConfigShow:boolean = false;
constructor(public _dashboardservice: DashboardService,  private toastr: ToastrService, private formBuilder: FormBuilder, public dialogRef: MatDialogRef<tvsUtilizationConfigPopup>,
  dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any,) {

  }

  ngOnInit(): void {
  this.tvsUtilizationConfigFormVal();
  this.getTvsUtilizationConfigData();
  }
  getTvsUtilizationConfigData(){
    this.tvsConfigShow = true;
    this._dashboardservice.getTvsUtilizationConfig(this.data).subscribe(
      (data) => {
        console.log(data,"utilization config checking");
        this.tvsUtilizeConfigData = data;
        this.setEditDetails();
        this.tvsConfigShow = false;
      },
      error => {
        console.error(error);
        this.tvsConfigShow = false;
      },
      () => console.log('COMPLETE')
      
    );
  }


  tvsUtilizationConfigForm: FormGroup;
  titleAlert: string = 'This field is required';
  tvsUtilizationConfigFormVal() {
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.tvsUtilizationConfigForm = this.formBuilder.group({
      'totalWorkingHour'              : [null, Validators.required],
      'noOfShift'                     : [null, Validators.required],
      'utilizationUpdateInterval'     : [null, Validators.required],
      'utilizationUpdateIntervalUnit' : [null, Validators.required],
    });
  }
  get totalWorkingHour() {
    return this.tvsUtilizationConfigForm.get('totalWorkingHour') as FormControl
  }
  get noOfShift() {
    return this.tvsUtilizationConfigForm.get('noOfShift') as FormControl
  }
  get utilizationUpdateInterval() {
    return this.tvsUtilizationConfigForm.get('utilizationUpdateInterval') as FormControl
  }
  get utilizationUpdateIntervalUnit() {
    return this.tvsUtilizationConfigForm.get('utilizationUpdateIntervalUnit') as FormControl
  }
  setEditDetails(){
    this.tvsUtilizationConfigForm.patchValue({  
      totalWorkingHour : this.tvsUtilizeConfigData?.totalWorkingHour,
      noOfShift : this.tvsUtilizeConfigData?.noOfShift,
      utilizationUpdateInterval : this.tvsUtilizeConfigData?.utilizationUpdateInterval
  });  
 let timeUnit;
  this.utilizationUpdateIntervalUnitData.find(item => {
    if(item == this.tvsUtilizeConfigData?.utilizationUpdateIntervalUnit){
      timeUnit = item;
    }else{
      return "";
    }
  });
  this.tvsUtilizationConfigForm.get('utilizationUpdateIntervalUnit').setValue(this.tvsUtilizeConfigData?.utilizationUpdateIntervalUnit);
  }
  updateConfig(){
    let updateData = {
      deviceId: this.data,
      totalWorkingHour: parseInt(this.tvsUtilizationConfigForm.value.totalWorkingHour),
      noOfShift: parseInt(this.tvsUtilizationConfigForm.value.noOfShift),
      utilizationUpdateInterval: parseInt(this.tvsUtilizationConfigForm.value.utilizationUpdateInterval),
      utilizationUpdateIntervalUnit: this.tvsUtilizationConfigForm.value.utilizationUpdateIntervalUnit
    }
    console.log(updateData,"updateData checking")
    this._dashboardservice.editTvsUtilizeConfigApi(updateData).subscribe(data =>{
      console.log(data,"submitted config");
      this.dialogRef.close({event:"update",deviceid:this.data});
    })
   
  }

}

//TVS Utilization Config popup template end

//Petronash-config-popup component start
@Component({
  selector: 'Petronash-config-popup',
  templateUrl: './Petronash-config-popup.html',
  styleUrls: ['./dashboard-view.component.scss']
})

export class PetronashConfigPopup implements OnInit {
chemicalCostData;
petronashInputModel;
constructor(public _dashboardservice: DashboardService, private formBuilder: FormBuilder,   private toastr: ToastrService,public dialogRef: MatDialogRef<PetronashConfigPopup>,
  dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any,) {

  }

  ngOnInit(): void {
    console.log(this.data,"petronash popup checkig");
    this.petronashInputModel = this.data;
    this.petronashDashboardFormVal();
    this.setPetronashInputModel();
  }



  petronashDashboardForm: FormGroup;
  titleAlert: string = 'This field is required';
  petronashDashboardFormVal() {
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.petronashDashboardForm = this.formBuilder.group({
      'setFlowRate': [null, Validators.required],
      'tankLevelMax': [null, Validators.required],
      'chemicalCost': [null, Validators.required],
    });
  }
  get setFlowRate() {
    return this.petronashDashboardForm.get('setFlowRate') as FormControl
  }
  get tankLevelMax() {
    return this.petronashDashboardForm.get('tankLevelMax') as FormControl
  }
  get chemicalCost() {
    return this.petronashDashboardForm.get('chemicalCost') as FormControl
  }
  setPetronashInputModel() {
    console.log(this.data[0]["value"], "this.petronashInputModel[0]?.value checking")
    this.petronashDashboardForm.get("setFlowRate").setValue(this.petronashInputModel[0]["value"]);
    this.petronashDashboardForm.get("chemicalCost").setValue(this.petronashInputModel[1]["value"]);
    this.petronashDashboardForm.get("tankLevelMax").setValue(this.petronashInputModel[2]["value"]);
  }

  updateConfig(){
    this._dashboardservice.editPetronashInputModel([
      {
        inputId: 1,
        name: "Set Flow rate",
        id: "fRate",
        deviceId: 20,
        value: this.setFlowRate.value,
        dataType: 4,
        isActive: true
      },
      {
        inputId: 2,
        name: "chemical cost",
        id: "cCost",
        deviceId: 20,
        value: this.chemicalCost.value,
        dataType: 4,
        isActive: true
      },
      {
        inputId: 3,
        name: "Tank Level Max",
        id: "tLevelMax",
        deviceId: 20,
        value: this.tankLevelMax.value,
        dataType: 4,
        isActive: true
      }
    ]).subscribe(
      data => {
        this.petronashInputModel = data;
        console.log(data, "after registered api data checking");
        this.dialogRef.close("update");
        // this.showSuccess("signal edit  sucessfully")
      },
      error => {
        console.error(error);
        // this.showError("signal changes are not added")
      },
      () => console.log('COMPLETE')
    );
  }


}

//Petronash-config-popup component end

//Date-range-config-popup component start
@Component({
  selector: 'Date-Range-config-popup',
  templateUrl: './date-range-configure.html',
  styleUrls: ['./dashboard-view.component.scss'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    { provide: MAT_DATE_LOCALE, useValue: '' },

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

export class DateRangeConfigurePopup implements OnInit {

constructor(public _dashboardservice: DashboardService,  private toastr: ToastrService, private formBuilder: FormBuilder, public dialogRef: MatDialogRef<DateRangeConfigurePopup>,
  dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, private _adapter: DateAdapter<any>) {
    this._adapter.setLocale('your locale');
    console.log(this._adapter, "checking date formats")
  }

  ngOnInit(): void {
    console.log(this.data)
  this.PetronashsignalDateFormVal();
  }

  PetronashDateForm: FormGroup;
  PetronashsignalDateFormVal() {
    this.PetronashDateForm = this.formBuilder.group({
      'fromDate': [null, Validators.required],
      'toDate': [null, Validators.required]
    });
  }

  get fromDate() {
    return this.PetronashDateForm.get('fromDate') as FormControl
  }
  get toDate() {
    return this.PetronashDateForm.get('toDate') as FormControl
  }
  fromdateVal;
  todateVal;
  fromDateChange(event: any) {
    // alert("date change")
    console.log(event, "date ");
    this.fromdateVal = event;
    // this.getData(newDate);
  }

  toDateChange(event: any) {
    // alert("date change")
    console.log(event, "date ");
    this.todateVal = event;
    // this.getData(newDate);
  }
  getDateRange(){
    this.dialogRef.close([this.data,this.fromdateVal,this.todateVal,"dateRangeApply"]);
  }
}

//Date-range-config-popup component end

//release assests popup for hydac start
@Component({
  selector: 'release-assets-popup',
  templateUrl: './release-assets-popup.html',
  styleUrls: ['./dashboard-view.component.scss']
})
export class ReleaseAssetsPopup implements OnInit {
  selectedsignalname = [];
  rmsAct:any;
  devicedata=[];
constructor(public _dashboardservice: DashboardService,  private toastr: ToastrService, private formBuilder: FormBuilder, public dialogRef: MatDialogRef<ReleaseAssetsPopup>,
  dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, ) {
  }
  ngOnInit(): void {
    console.log(this.data)
    let accountObject = sessionStorage.getItem('rmsAccount');
    this.rmsAct = JSON.parse(accountObject);
    console.log(this.rmsAct,"rmsAct check");
    this._dashboardservice.getHydacDeviceList(this.rmsAct?.userAccountId).subscribe(res=>{
      console.log(res,"res checking");
      this.devicedata = res;
    });
    console.log(this.selectedsignalname,"selectedsignalname")
  }
  releaseAsset(){
    console.log(this.selectedsignalname.toString(),"selectedsignalname");
    if(this.selectedsignalname?.length > 0){
      console.log(typeof this.selectedsignalname.toString(),"type checking")
      this._dashboardservice.releaseAssetApi(this.selectedsignalname.toString()).subscribe(res=>{
        console.log(res,"res checking")
        this.toastr.success("Release assets sucessfully!");
        this.dialogRef.close({event:""});
      },
      error => {
        console.error(error);
        this.toastr.error(error?.errorMessage);
      },
      () => console.log('COMPLETE'))
    }else{
      this.toastr.error("Release assets not sucessfully!");
      this.dialogRef.close({event:""});
      // alert("please choose devices");
    }
  }
}
//release assets popup for hydac end