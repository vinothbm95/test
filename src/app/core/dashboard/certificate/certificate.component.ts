import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith, tap} from 'rxjs/operators';
import * as Highcharts from 'highcharts';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
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
import HC_exporting from 'highcharts/modules/exporting';
import { DashboardService } from '../../rms-services';
import { DeviceModel } from '../../rms-interfaces/dashboard/dashboard-view/devicemodel';
import { SignalModel } from '../../rms-interfaces/dashboard/dashboard-view/signalmodel';
import { TestCertificateResponse } from '../../rms-interfaces/dashboard/dashboard-view/test-certificate-response';
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
export interface User {
  name: string;
}
@Component({
  selector: 'elpis-rms-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.scss'],
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
  ]
})
export class CertificateComponent implements OnInit {
  certificateDataForm: FormGroup;  
  //device
  categories = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
]
 
gasTypeDropdownData = ['Nitrogen',
'CNG'
];
data =  [
  {
  name: 'Samee Shaik',
  data: [0,3,4,3,5,4,12],
  color: '#ffffff',
  lineWidth: 5,
  lineColor:'red'
},
{
name: 'Venugopal Vutlapalli',
data: [2,4,2,5,1,5,10],
color:'#ffffff',
lineWidth: 5,
        lineColor:'red'
}

]

  myControl = new FormControl();
  options: User[] = [
    {name: 'device 1'},
    {name: 'device 2'},
    {name: 'device 3'}
  ];
  filteredOptions: Observable<User[]>;
//signal 
  myControl1 = new FormControl();
  options1: User[] = [
    {name: 'signal 1'},
    {name: 'signal 2'},
    {name: 'signal 3'}
  ];
  nominalData = [
    {val:""}
  ]
  filteredOptions1: Observable<User[]>;
  chartOptions = {};

  Highchartscertificate = Highcharts;
  CertificateDateForm :FormGroup;
  Startdate:any;
  Enddate:any;
  //local stroage varable and loader varaibles
  showCertificate:boolean;
  rmsAct;
  devicelist;
  filteredDeviceOne: Observable<string[]>;
  filteredSignalOne: Observable<string[]>;
  deviceOneId;
  fn: any;
  value: any;
  signalListOne = [];
  firstDeviceSelected: any;
  signalOneId;
  signalOneDataTable;
  //select the certificate 
  showPdfIcon:boolean = false;
  selectCertificate:boolean = true;
  deviceCertificate:boolean = false;
  deviceCertificateShow:boolean = false;
  signalCertificate:boolean = false;
  alarmCertificate:boolean = false;
  selectedMultipleSignalData;
  deviceCertificateCategories = []
  deviceCertificateCategoriesData = [];
  deviceCertificateCategoriesData1 = [];
  isSignalDataPresnet: boolean = false;
  certificateSignalData = {
    flowRate:{},
    dischargePressure:{}
  }

  //signal certificate properties start
  signalIds =[];
  dateofsignalCertificate="";
  mytime:any;
  time1:any; 
  time2:any; 
  time3:any; 
  time4:any; 
  time5:any; 
  time6:any; 
  GastypeV:any;
  // GastypeV1:any
  // GastypeV2:any
  // GastypeV3:any

  AmbienttempV:any;
  AmbienttempV1:any;
  AmbienttempV2:any;
  AmbienttempV3:any;

  HpRegPressureV:any;
  HpRegPressureV1:any;
  HpRegPressureV2:any;
  HpRegPressureV3:any;

  LpRegPressureV:any;
  LpRegPressureV1:any;
  LpRegPressureV2:any;
  LpRegPressureV3:any;

  HeatExWaterTempV:any;
  HeatExWaterTempV1:any;
  HeatExWaterTempV2:any;
  HeatExWaterTempV3:any;

  InGasTemp1StV:any;
  InGasTemp1StV1:any;
  InGasTemp1StV2:any;
  InGasTemp1StV3:any;

  OutGasTemp1StV:any;
  OutGasTemp1StV1:any;
  OutGasTemp1StV2:any;
  OutGasTemp1StV3:any;

  InGasTemp2StV:any;
  InGasTemp2StV1:any;
  InGasTemp2StV2:any;
  InGasTemp2StV3:any;

  OutGasTemp2StV:any;
  OutGasTemp2StV1:any;
  OutGasTemp2StV2:any;
  OutGasTemp2StV3:any;

  test1time:any;
  test2time:any;
  test3time:any;

  SignalCertificateFormGroup: FormGroup;
  SignalCertificateTestFormGroup:FormGroup;

  Checkboxcontrol:FormGroup;
  inletgastemp1:boolean=false;
  outletgastemp1:boolean=false;
  inletgastemp2:boolean=false;
  outletgastemp2:boolean=false;

  PowerSupplyVoltageP:any;
  PowerSupplyVoltageV1:any;
  PowerSupplyVoltageV2:any;
  PowerSupplyVoltageV3:any;

  TotalAvgCurrentP:any;
  TotalAvgCurrentV1:any;
  TotalAvgCurrentV2:any;
  TotalAvgCurrentV3:any;

  GasDetectorLevelP:any;
  GasDetectorLevelV1:any;
  GasDetectorLevelV2:any;
  GasDetectorLevelV3:any;

  FlowRateKghP:any;
  FlowRateKghV1:any;
  FlowRateKghV2:any;
  FlowRateKghV3:any;

  FlowRateSmhP:any;
  FlowRateSmhV1:(number | string);
  FlowRateSmhV2:any;
  FlowRateSmhV3:any;

  InletSusctionP:any
  InletSusctionV1:any
  InletSusctionV2:any
  InletSusctionV3:any

  DischargePressureP:any;
  DischargePressureV1:any;
  DischargePressureV2:any;
  DischargePressureV3:any;

  CoolingWaterPressureP:any;
  CoolingWaterPressureV1:any;
  CoolingWaterPressureV2:any;
  CoolingWaterPressureV3:any;

  DischargePressure1stStageP:any;
  DischargePressure1stStageV1:any;
  DischargePressure1stStageV2:any;
  DischargePressure1stStageV3:any;

  DischargeGasTempretureP:any;
  DischargeGasTempretureV1:any;
  DischargeGasTempretureV2:any;
  DischargeGasTempretureV3:any;

  HeatExchangerOutletWaterTempP:any;
  HeatExchangerOutletWaterTempV1:any;
  HeatExchangerOutletWaterTempV2:any;
  HeatExchangerOutletWaterTempV3:any;

  CompressorAutoStartPressureP:any;
  CompressorAutoStartPressureV1:any;
  CompressorAutoStartPressureV2:any;
  CompressorAutoStartPressureV3:any;

  test1formvalidation:boolean=false;
  test2formvalidation:boolean=false;
  test3formvalidation:boolean=false;

  //signal cerificate properties end
  constructor(private formBuilder: FormBuilder,private _dashboardservice:DashboardService,private router: Router,
    private _adapter: DateAdapter<any>,private toastr: ToastrService,private Checkerror: ChangeDetectorRef,) {
      this._adapter.setLocale('your locale');
   }

  ngOnInit(): void {
    this.showPdfIcon = false;
    this.showDeviceCertificate();  
    this.Checkboxcontrol = new FormGroup({
      InletStage1: new FormControl(),
      OutletStage1: new FormControl(),
      InletStage2: new FormControl(),
      OutletStage2: new FormControl(),
  
      
   });
  }

  ngAfterContentChecked(): void {

    this.Checkerror.detectChanges();

 }
 
  //select the certificate start 
  showDeviceCertificate(){
    this.selectCertificate = false;
    this.deviceCertificate = true;
    this.signalCertificate = false;
    this.alarmCertificate = false;
    this.signalDateFormVal();
    this.alaramcertificatevalue();
    this.getAllDeviceData();
    this.signalcerificateval();
  }
  showSignalCertificate(){
    this.selectCertificate = false;
    this.deviceCertificate = false;
    this.signalCertificate = true;
    this.alarmCertificate = false;
    this.deviceCertificateShow = false;
    console.log(this.alaramformgroup.value,"this.alaramformgroup checking")
  }
  showAlarmCertificate(){
    this.selectCertificate = false;
    this.deviceCertificate = false;
    this.signalCertificate = false;
    this.alarmCertificate = true;
    this.deviceCertificateShow = false;
    console.log(this.certificateDataForm.value,"device certificate data checking")
  }
  signalCertificateBack(){
    this.selectCertificate = false;
    this.deviceCertificate = false;
    this.signalCertificate = false;
    this.alarmCertificate = false;
    this.deviceCertificate = true;
    this.deviceCertificateShow = true;
  }
  //select the certificate end 
  
  getAllDeviceData(){
    this.showCertificate = true;
   
    let accountObject = sessionStorage.getItem('rmsAccount');
    this.rmsAct = JSON.parse(accountObject);
    this._dashboardservice.getCngDeviceApi(this.rmsAct.customerId).subscribe(
      (data:DeviceModel[]) => {
        console.log(data, "cng device data checking");
        this.showCertificate = false;
        this.devicelist = data;
        console.log(this.devicelist, "device data checking");
        this.filteredDeviceOne = this.CertificateDateForm.get('deviceName').valueChanges
        .pipe(
          startWith(''),
          map(device => this._filterDeviceOne(device)),
          tap(value => this.value = value)
        );
  
      this.fn = (evt: KeyboardEvent) => {
        if (evt.key === "ArrowDown" || evt.key === "ArrowUp") {
          if (this.value.length === 1 && this.value[0].deviceName === 'No device found !' ||
            this.value.length === 1 && this.value[0].signalModel.signalName === 'No signal found !') {
            evt.stopPropagation();
          }
        }
      }
      }
    )
  
  }
  //signa   


  ///
  /////////////////datepicket from and to date ///////////////////////
  customdate(stDate: any) {
    this.Startdate = stDate[0];
    this.Enddate = stDate[1];
    console.log(this.Startdate, this.Enddate);
  }

  signalDateFormVal() {
    this.CertificateDateForm = this.formBuilder.group({    
      'deviceName': [null, Validators.required],
      'fromToDate': [null, Validators.required]
    });
  }
  get deviceName() {
    return this.CertificateDateForm.get('deviceName') as FormControl
  }
  // getting the device data and autocomplete start
  private _filterDeviceOne(value: string): any[] {
    const filterValue = value.toLowerCase();
    const results = this.devicelist.filter(device => device.deviceName.toLowerCase().includes(filterValue));
    return results.length ? results : [{ deviceName: 'No device found !' }];
  }
  _deviceSelection(option: string): { [className: string]: boolean } {
    return {
      'no-data': option === 'No device found !',
    }
  }
  deviceSelection(device, controlName, event, id) {
    this.deviceCertificateCategories = []
    this.deviceCertificateCategoriesData = [];
    this.selectedMultipleSignalData = [];
    console.log(id);

    if (id === 1) {
      // this.selectSignalName = "";
    }
    if (id === 2) {
      // this.selectSignalTwoName = "";
    }
    if (event.isUserInput) {
      console.log(device);
      this.firstDeviceSelected = device;
      this.deviceOneId = device.deviceId;
    
    }
  }
  fromToDate;
  toDateChange(event: any) {
    // alert("date change")
    console.log(event, "date ");
    this.fromToDate = event;
    // this.getData(newDate);
  }
  deviceCertificateApply(){
    // this.fromToDate = data;
    console.log(this.CertificateDateForm.value,this.fromToDate,"this.CertificateDateForm checking")
    this.deviceCertificateShow = true;
    this.certificateDataFormVal();
    this._dashboardservice.getDeviceSignaldata(this.deviceOneId).subscribe((x:SignalModel[]) => {
      console.log(x,"cng signals checking")
      // if (controlName === 'deviceName') {
        this.signalListOne = [];
        this.signalListOne = x;
        console.log(this.signalListOne,"this.signalListOne")
        console.log('Device One Id--------> ' + this.deviceOneId);
        if (this.signalListOne.length > 0) {
          this.getSignalsData();
        }
      // } else {
       
      // }
    });
  }
//getting the cng signals start
  getSignalsData(){
    for(let i = 0; i < this.signalListOne?.length; i++){
      if(this.signalListOne[i]?.plcAddress == "40053"){
        console.log(this.signalListOne[i],"this.signalListOne[i] checking")
        this.certificateSignalData["flowRate"] = this.signalListOne[i];
        console.log(this.certificateSignalData,"this.certificateSignalData checking")
      }
    }
  }
//getting the cng signals end
  nominalSignalFilter(i){
    this.filteredSignalOne = this.nominalCharacterstics().controls[i].get('signalName').valueChanges
              .pipe(
                startWith(''),
                map(signal => this._filterSignalOne(signal)),
                tap(value => this.value = value)
              );
  }

  private _filterSignalOne(value: string): any[] {
    const filterValue = value.toLowerCase();
    const results = this.signalListOne.filter(signal => signal.signalName.toLowerCase().includes(filterValue));
    return results.length ? results : [{ signalName: 'No signal found !' } ];
  }
 
  _signalSelection(option: string): { [className: string]: boolean } {
    return {
      'no-data': option === 'No signal found !',
    }
  }
  signalDetails;
    signalSelection(signal,i,controlName, event) {
  console.log(signal,i,controlName, event,"function arg check")
      if (event.isUserInput) {
        console.log(signal);
        this.signalDetails = signal;
        console.log(this.signalDetails,"this.signalDetails checking")
       
        if (controlName === 'signalName') {
          this.showCertificate = true;
          this.isSignalDataPresnet = false; 
          this.selectedMultipleSignalData = [];
          let signalData = [];
          this.signalOneId = signal?.signalId;
          console.log('Signal One Id--------> ' + this.signalOneId);
          this.nominalCharacterstics().controls[i].get("signalStartRange").setValue(signal?.signalStartRange);
          this.nominalCharacterstics().controls[i].get("signalEndRange").setValue(signal?.signalEndRange);
          this.nominalCharacterstics().controls[i].get("tolerance").setValue(signal?.tolerance);
          this.nominalCharacterstics().controls[i].get("signalId").setValue(signal?.signalId);
          this.nominalCharacterstics().controls[i].get("color").setValue('#3b86ff3d');
          console.log(signal?.signalStartRange,this.nominalCharacterstics().controls[i].get("signalStartRange").value,"signal start range checking")
         console.log( this.nominalCharacterstics().controls?.length,"checking nominal length")
         this.showCertificate = true;
          for(let i = 0; i < this.nominalCharacterstics().controls?.length; i++){
            signalData.push(this.nominalCharacterstics().controls[i].get("signalId").value)
          }
          console.log(signalData,"signalData checking")
          this._dashboardservice.getMultiplesignalDataApi(signalData,this.Startdate,this.Enddate).subscribe(
            (data) => {
              this.showCertificate = false;
              console.log(data,"selected signals getMultiplesignalDataApi data")
              this.selectedMultipleSignalData = data;
              this.deviceCertificateCategories = []
              this.deviceCertificateCategoriesData = [];
              let items = [];
              let signaldataModel;
              // if(res.length < 0){
                for(let i = 0; i < this.selectedMultipleSignalData?.length; i++){
                  this.selectedMultipleSignalData[i]?.signalDataModels?.forEach((signalDataModel) => {
                    this.deviceCertificateCategories.push(signalDataModel.timeReceived);
                  })
                   items = this.selectedMultipleSignalData[i]?.signalDataModels.map(item => Number.parseFloat(item.dataValue));
                   this.deviceCertificateCategoriesData.push({
                    name: this.selectedMultipleSignalData[i]?.signalViewModel?.signalModel?.signalName,
                    data: items,
                    color: '#ffffff',
                    lineWidth: 5,
                    lineColor:this.nominalCharacterstics().controls[i].get("color").value
                  });
                }
                this.isSignalDataPresnet = true; 
               console.log(this.deviceCertificateCategories,this.deviceCertificateCategoriesData,"graph data checking")
                console.log(this.certificateDataForm.value,this.selectedMultipleSignalData,"certificateDataForm checking")
              // }
              
              

            }
          )
         
        } else {
         
        }
      }
    }

  onSubmit(){

  }
graphRender(){
  //graph start



this.chartOptions = {
  chart: {
    type: 'areaspline'
},
title: {

    text: 'IO Signal SPARE Data'
  
},

legend: {
  enabled:false,
    layout: 'vertical',
    align: 'left',
    verticalAlign: 'top',
    x: 150,
    y: 100,
    floating: true,
    borderWidth: 1,
    backgroundColor:
        Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF'
},
xAxis: {
    categories: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ],
    plotBands: [{ // visualize the weekend
        // from: 4.5,
        // to: 6.5,
        // color: 'rgba(68, 170, 213, .2)'
    }]
},
yAxis: {
    title: {
        text: ''
    }
},
tooltip: {
    shared: true,
    valueSuffix: ' units'
},
credits: {
    enabled: false
},
exporting: {
  enabled: true
},
plotOptions: {
    areaspline: {
        fillOpacity: 0.5
    }
},

series: [{
    name: 'samee shaik',
    data: [0,3, 4, 3, 5, 4, 10, 12]
}

],



}

// HC_exporting(this.Highchartscertificate);


  // exporting(this.Highchartscertificate);


//graph end

}


  //device
  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }
//signal
private _filter1(name: string): User[] {
  const filterValue = name.toLowerCase();

  return this.options1.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
}
certificateDataSubmit(){

  }

  certificateDataFormVal(){
    this.certificateDataForm = this.formBuilder.group({
      'customerName' : [null, Validators.required],
      'pIdDrawing' : [null, Validators.required],
      'jobNumber'  : [null, Validators.required],
      'electricalDrawing'  : [null, Validators.required],
      'purchaseOrderNo'  : [null, Validators.required],
      'oilCircuitDrawing' : [null, Validators.required],
      'deliveryPlace'  : [null, Validators.required],
      'waterCircuitDrawing'  : [null, Validators.required],
      'compressorModelNumber' : [null, Validators.required],
      'compressorCode'  : [null, Validators.required],
      'compressorStroke' : [null, Validators.required],
      'compressorPistonDiameter' : [null, Validators.required],
      'compressorTransmissionType' : [null, Validators.required],
      'compressorPistonLoad'  : [null, Validators.required],
      'flowRateRange':[null, Validators.required],
      'flowRateValue':[null, Validators.required],
      'flowRateTolerance':[null, Validators.required],
      'inletPressureRange':[null, Validators.required],
      'inletPressureTolerance':[null, Validators.required],
      'inletPressureValue':[null, Validators.required],
      'maxDeliveryPressureRange':[null, Validators.required],
      'maxDeliveryPressureTolerance':[null, Validators.required],
      'maxDeliveryPressureValue':[null, Validators.required],
      'powerMainMotorRange':[null, Validators.required],
      'powerMainMotorTolerance':[null, Validators.required],
      'powerMainMotorValue':[null, Validators.required],
      'powerAuxillariesRange':[null, Validators.required],
      'powerAuxillariesTolerance':[null, Validators.required],
      'powerAuxillariesValue':[null, Validators.required],
      'temperatureRange':[null, Validators.required],
      'temperatureTolerance':[null, Validators.required],
      'temperatureValue':[null, Validators.required],



      'nominalCharacterstics': this.formBuilder.array([
      ])
    });
    this.nominalCharacterstics().push(this.newNominalCharacterstics());
    
  }  

  nominalCharacterstics(): FormArray {
    return this.certificateDataForm.get('nominalCharacterstics') as FormArray
  }
 
   
  newNominalCharacterstics(): FormGroup {
    return this.formBuilder.group({
      'signalId':[null],
      'signalName':[null],
      'signalStartRange':[null],
      'signalEndRange':[null],
      'tolerance':[null],
      'color':[null]
     
    })
    this.nominalCharacterstics().controls[0].get('signalName').setValue('');
    this.nominalCharacterstics().controls[0].get('signalStartRange').setValue(null);
    this.nominalCharacterstics().controls[0].get('signalEndRange').setValue(null);
    this.nominalCharacterstics().controls[0].get('tolerance').setValue(null);
    this.nominalCharacterstics().controls[0].get('color').setValue(null);
    this.nominalCharacterstics().controls[0].get('signalId').setValue(null);
    
  }
  AddNominalCharacterstics() {
    this.nominalCharacterstics().push(this.newNominalCharacterstics()); 
  }
  removeNominalCharacterstics(i:number) {
    this.nominalCharacterstics().removeAt(i);
  }
   
  get customerName() {
    return this.certificateDataForm.get('customerName') as FormControl
  }
  get pIdDrawing() {
    return this.certificateDataForm.get('pIdDrawing') as FormControl
  }
  get jobNumber() {
    return this.certificateDataForm.get('jobNumber') as FormControl
  }
  get electricalDrawing() {
    return this.certificateDataForm.get('electricalDrawing') as FormControl
  }
  get purchaseOrderNo() {
    return this.certificateDataForm.get('purchaseOrderNo') as FormControl
  }
  get oilCircuitDrawing() {
    return this.certificateDataForm.get('oilCircuitDrawing') as FormControl
  }
  get deliveryPlace() {
    return this.certificateDataForm.get('deliveryPlace') as FormControl
  }
  get waterCircuitDrawing() {
    return this.certificateDataForm.get('waterCircuitDrawing') as FormControl
  }
  get compressorModelNumber() {
    return this.certificateDataForm.get('compressorModelNumber') as FormControl
  }
  get compressorCode() {
    return this.certificateDataForm.get('compressorCode') as FormControl
  }
  get compressorStroke() {
    return this.certificateDataForm.get('compressorStroke') as FormControl
  }
  get compressorPistonDiameter() {
    return this.certificateDataForm.get('compressorPistonDiameter') as FormControl
  }
  get compressorTransmissionType() {
    return this.certificateDataForm.get('compressorTransmissionType') as FormControl
  }
  get compressorPistonLoad() {
    return this.certificateDataForm.get('compressorPistonLoad') as FormControl
  }
  get flowRateRange() {
    return this.certificateDataForm.get('flowRateRange') as FormControl
  }
  get flowRateTolerance() {
    return this.certificateDataForm.get('flowRateTolerance') as FormControl
  }
  get flowRateValue() {
    return this.certificateDataForm.get('flowRateValue') as FormControl
  }
  get inletPressureRange() {
    return this.certificateDataForm.get('inletPressureRange') as FormControl
  }
  get inletPressureTolerance() {
    return this.certificateDataForm.get('inletPressureTolerance') as FormControl
  }
  get inletPressureValue() {
    return this.certificateDataForm.get('inletPressureValue') as FormControl
  }
  get maxDeliveryPressureRange() {
    return this.certificateDataForm.get('maxDeliveryPressureRange') as FormControl
  }
  get maxDeliveryPressureTolerance() {
    return this.certificateDataForm.get('maxDeliveryPressureTolerance') as FormControl
  }
  get maxDeliveryPressureValue() {
    return this.certificateDataForm.get('maxDeliveryPressureValue') as FormControl
  }
  get powerMainMotorRange() {
    return this.certificateDataForm.get('powerMainMotorRange') as FormControl
  }
  get powerMainMotorTolerance() {
    return this.certificateDataForm.get('powerMainMotorTolerance') as FormControl
  }
  get powerMainMotorValue() {
    return this.certificateDataForm.get('powerMainMotorValue') as FormControl
  }
  get powerAuxillariesRange() {
    return this.certificateDataForm.get('powerAuxillariesRange') as FormControl
  }
  get powerAuxillariesTolerance() {
    return this.certificateDataForm.get('powerAuxillariesTolerance') as FormControl
  }
  get powerAuxillariesValue() {
    return this.certificateDataForm.get('powerAuxillariesValue') as FormControl
  }
  get temperatureRange() {
    return this.certificateDataForm.get('temperatureRange') as FormControl
  }
  get temperatureTolerance() {
    return this.certificateDataForm.get('temperatureTolerance') as FormControl
  }
  get temperatureValue() {
    return this.certificateDataForm.get('temperatureValue') as FormControl
  }
  saveCertificate(){
    console.log(this.certificateDataForm.value,this.selectedMultipleSignalData,"certificateDataForm checking")
    // let today = new Date();
    // let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    // let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    // let dateTime = date+' '+time;
    // console.log(dateTime,"dateTime checking")
    // let certicateData = {
    //   data:this.certificateDataForm.value,
    //   fromDate:this.Startdate,
    //   toDate:this.Enddate
    // }
    // fromToDate:{fromDate:this.Startdate,toDate:this.Enddate}
    // let certificatePostData = {
    //   "deviceId": this.deviceOneId,
    //   "deviceCertificate":JSON.stringify(certicateData),
    //   "createdOn": dateTime
    // }
    // console.log(certificatePostData,"certicateData checking")
    // console.log(JSON.stringify(certicateData),"stringfy checking")
    // JSON.stringify(certicateData)
    // this._dashboardservice.deviceCertificatePostApi(certificatePostData).subscribe((data) => {
    //   console.log(data,"submitted certificate data checking")
    // })
    console.log(this.certificateDataForm.value.jobNumber,typeof this.certificateDataForm.value.jobNumber,this.SignalCertificateFormGroup.controls.HpRegPressure1.value,)
    //final json strutue start
    let finalCertificateData = {
      "deviceId": this.deviceOneId,
      "certificateDate": this.fromToDate,
      "jobNo": this.certificateDataForm.value.jobNumber,
      "pidDrawing":  this.certificateDataForm.value.pIdDrawing,
      "purchaseOrderNo": this.certificateDataForm.value.purchaseOrderNo,
      "electricalDrawing":this.certificateDataForm.value.electricalDrawing,
      "clientName": this.certificateDataForm.value.customerName,
      "oilCircuitDrawing": this.certificateDataForm.value.oilCircuitDrawing,
      "deliveryPlace": this.certificateDataForm.value.deliveryPlace,
      "waterCircuitDrawing":  this.certificateDataForm.value.waterCircuitDrawing,
      "modelNo":  this.certificateDataForm.value.compressorModelNumber,
      "code": this.certificateDataForm.value.compressorCode,
      "compressorStroke": this.certificateDataForm.value.compressorStroke,
      "pistonDiameter": this.certificateDataForm.value.compressorPistonDiameter,
      "transmissionType":this.certificateDataForm.value.compressorTransmissionType,
      "pistonRod":  this.certificateDataForm.value.compressorPistonLoad,
      "flowRateValue": this.certificateDataForm.value.flowRateValue,
      "inletPressureValue": this.certificateDataForm.value.inletPressureValue,
      "maxDeliveryPressureValue":this.certificateDataForm.value.maxDeliveryPressureValue,
      "powerMainMotorValue": this.certificateDataForm.value.powerMainMotorValue,
      "powerAuxillariesValue": this.certificateDataForm.value.powerAuxillariesValue,
      "temperatureValue": this.certificateDataForm.value.temperatureValue,
      "fatDate":  this.mytime,
      // "unitGasType": "string",
      // "test1FromTime": {},
      // "test1ToTime": {},
      // "test2FromTime": {},
      // "test2ToTime": {},
      // "test3FromTime": {},
      // "test3ToTime": {},
      // "test1TimeDuration": {},
      // "test2TimeDuration": {},
      // "test3TimeDuration": {},
      // "ambientTemperatureValue": "string",
      // "hpRegulatorPressureValue": "string",
      // "lpRegulatorPressureValue": "string",
      // "stage1InletGasTempValue": "string",
      // "stage1OutletGasTempValue": "string",
      // "stage2InletGasTempValue": "string",
      // "stage2OutletGasTempValue": "string",
      // "heatExchangerInletWaterTempValue": "string",
      "inletPressureMinAlarmSet": this.alaramformgroup.value.inletPressureMinAlarmSet,
      "inletPressureMaxAlarmSet": this.alaramformgroup.value.inletPressureMaxAlarmSet,
      "maxDeliveryPressureAlarmSet": this.alaramformgroup.value.maxDeliveryPressureAlarmSet,
      "mediumBankPressureMaxAlarmSet": this.alaramformgroup.value.mediumBankPressureMaxAlarmSet,
      "highBankPressureMinAlarmSet":  this.alaramformgroup.value.highBankPressureMinAlarmSet,
      "highBankPressureMaxAlarmSet": this.alaramformgroup.value.highBankPressureMaxAlarmSet,
      "maxOilPressureLowRegulatorRange": this.alaramformgroup.value.maxOilPressureLowRegulatorRange,
      "maxOilPressureLowRegulatorValue": this.alaramformgroup.value.maxOilPressureLowRegulatorValue,
      "maxOilPressureHighRegulatorRange": this.alaramformgroup.value.maxOilPressureHighRegulatorRange,
      "maxOilPressureHighRegulatorValue":  this.alaramformgroup.value.maxOilPressureHighRegulatorValue,
      "airPressureRange": this.alaramformgroup.value.airPressureRange,
      "airPressureValue": this.alaramformgroup.value.airPressureValue,
      "oilTempAlarmSetRange": this.alaramformgroup.value.oilTempAlarmSetRange,
      "oilTempAlarmSetValue": this.alaramformgroup.value.oilTempAlarmSetValue,
      "oilPressureAlarmSetRange": this.alaramformgroup.value.oilPressureAlarmSetRange,
      "oilPressureAlarmSetValue": this.alaramformgroup.value.oilPressureAlarmSetValue,
      "flowRateRange":  this.certificateDataForm.value.flowRateRange,
      "inletPressureRange":this.certificateDataForm.value.inletPressureRange,
      "maxDeliveryPressureRange": this.certificateDataForm.value.maxDeliveryPressureRange,
      "powerMainMotorRange": this.certificateDataForm.value.powerMainMotorRange,
      "powerAuxillariesRange": this.certificateDataForm.value.powerAuxillariesRange,
      "temperatureRange": this.certificateDataForm.value.temperatureRange,
      "flowRateTolerance": this.certificateDataForm.value.flowRateTolerance,
      "inletPressureTolerance": this.certificateDataForm.value.inletPressureTolerance,
      "maxDeliveryPressureTolerance": this.certificateDataForm.value.maxDeliveryPressureTolerance,
      "powerMainMotorTolerance": this.certificateDataForm.value.powerMainMotorTolerance,
      "powerAuxillariesTolerance": this.certificateDataForm.value.powerAuxillariesTolerance,
      "temperatureTolerance": this.certificateDataForm.value.temperatureTolerance,
      "alarmInletPressureRange": this.certificateDataForm.value.inletPressureValue,
      "alarmMaxDeliveryPressureRange": this.certificateDataForm.value.maxDeliveryPressureValue,
      "mediumBankPressureRange": this.alaramformgroup.value.mediumbankpressure,
      "highBankPressureRange": this.alaramformgroup.value.highbankpressure,
      "unitGasType":this.GastypeV,
      "test1FromTime":this.SignalCertificateTestFormGroup.controls.FTime1.value,
      "test1ToTime":this.SignalCertificateTestFormGroup.controls.FTime2.value,
      "test2FromTime":this.SignalCertificateTestFormGroup.controls.FTime3.value,
      "test2ToTime":this.SignalCertificateTestFormGroup.controls.FTime4.value,
      "test3FromTime":this.SignalCertificateTestFormGroup.controls.FTime5.value,
      "test3ToTime":this.SignalCertificateTestFormGroup.controls.FTime6.value,
      "test1TimeDuration":this.test1time,
      "test2TimeDuration":this.test2time,
      "test3TimeDuration":this.test3time,
      "test1AmbientTempValue":this.SignalCertificateFormGroup.controls.Ambienttemp1.value,
      "test2AmbientTempValue":this.SignalCertificateFormGroup.controls.Ambienttemp2.value,
      "test3AmbientTempValue":this.SignalCertificateFormGroup.controls.Ambienttemp3.value,

      "test1HpRegulatorPressureValue":this.SignalCertificateFormGroup.controls.HpRegPressure1.value,
      "test2HpRegulatorPressureValue":this.SignalCertificateFormGroup.controls.HpRegPressure2.value,
      "test3HpRegulatorPressureValue":this.SignalCertificateFormGroup.controls.HpRegPressure3.value,
      "test1LpRegulatorPressureValue":this.SignalCertificateFormGroup.controls.LpRegPressure1.value,
      "test2LpRegulatorPressureValue":this.SignalCertificateFormGroup.controls.LpRegPressure2.value,
      "test3LpRegulatorPressureValue":this.SignalCertificateFormGroup.controls.LpRegPressure3.value,

      "test1Stage1InletGasTempValue":this.SignalCertificateFormGroup.controls.InGasTemp1St1.value ? this.SignalCertificateFormGroup.controls.InGasTemp1St1.value : null,
      "test2Stage1InletGasTempValue":this.SignalCertificateFormGroup.controls.InGasTemp1St2.value ? this.SignalCertificateFormGroup.controls.InGasTemp1St2.value : null,
      "test3Stage1InletGasTempValue":this.SignalCertificateFormGroup.controls.InGasTemp1St3.value ? this.SignalCertificateFormGroup.controls.InGasTemp1St3.value : null,
      "test1Stage1OutletGasTempValue":this.SignalCertificateFormGroup.controls.OutGasTemp1St1.value ? this.SignalCertificateFormGroup.controls.OutGasTemp1St1.value : null, 
      "test2Stage1OutletGasTempValue":this.SignalCertificateFormGroup.controls.OutGasTemp1St2.value ? this.SignalCertificateFormGroup.controls.OutGasTemp1St2.value : null,
      "test3Stage1OutletGasTempValue":this.SignalCertificateFormGroup.controls.OutGasTemp1St3.value ? this.SignalCertificateFormGroup.controls.OutGasTemp1St3.value : null,
      "test1Stage2InletGasTempValue":this.SignalCertificateFormGroup.controls.InGasTemp2St1.value ? this.SignalCertificateFormGroup.controls.InGasTemp2St1.value : null,
      "test2Stage2InletGasTempValue":this.SignalCertificateFormGroup.controls.InGasTemp2St2.value ? this.SignalCertificateFormGroup.controls.InGasTemp2St2.value : null,
      "test3Stage2InletGasTempValue":this.SignalCertificateFormGroup.controls.InGasTemp2St3.value ? this.SignalCertificateFormGroup.controls.InGasTemp2St3.value : null,
      "test1Stage2OutletGasTempValue":this.SignalCertificateFormGroup.controls.OutGasTemp2St1.value ? this.SignalCertificateFormGroup.controls.OutGasTemp2St1.value : null,
      "test2Stage2OutletGasTempValue":this.SignalCertificateFormGroup.controls.OutGasTemp2St2.value ? this.SignalCertificateFormGroup.controls.OutGasTemp2St2.value : null,
      "test3Stage2OutletGasTempValue":this.SignalCertificateFormGroup.controls.OutGasTemp2St3.value ? this.SignalCertificateFormGroup.controls.OutGasTemp2St3.value : null,

      "test1HeatExchangerInletWaterTempValue":this.SignalCertificateFormGroup.controls.HeatExWaterTemp1.value,
      "test2HeatExchangerInletWaterTempValue":this.SignalCertificateFormGroup.controls.HeatExWaterTemp2.value,
      "test3HeatExchangerInletWaterTempValue":this.SignalCertificateFormGroup.controls.HeatExWaterTemp3.value,

      }
      console.log(finalCertificateData,"finalCertificateData checking")
      this._dashboardservice.saveFinalCertificateApi(finalCertificateData).subscribe((data) => {
          console.log(data,"submitted certificate data checking");
          this.showSuccess("Certificate saved sucessfully, please click on pdf icon to download the certificate");
          this.showPdfIcon = true;
        },
        error =>{
          console.error(error);
          this.showError(error?.errorMessage);
        },
        () => console.log('COMPLETE')
        )
  }
  showSuccess(message) {
    this.toastr.success(message);
  }

  showError(message:string) {
    this.toastr.error(message);
  }
  //certificate pdf start
  isLoading:boolean = false;
  exportToPdf(){
    let pdfInput = {}
    this.isLoading = true;
    let today = new Date();
    let currdate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

    console.log(this.Checkboxcontrol.value,"this.Checkboxcontrol checking")
     pdfInput = {
      "compressorCode": this.certificateDataForm.value.compressorCode,
      "compressorModelNumber": this.certificateDataForm.value.compressorModelNumber,
      "compressorPistonDiameter": this.certificateDataForm.value.compressorPistonDiameter,
      "compressorPistonLoad":  this.certificateDataForm.value.compressorPistonLoad,
      "compressorStroke": this.certificateDataForm.value.compressorStroke,
      "compressorTransmissionType": this.certificateDataForm.value.compressorTransmissionType,
      "customerName": this.certificateDataForm.value.customerName, 
      "deliveryPlace": this.certificateDataForm.value.deliveryPlace,
      "electricalDrawing": this.certificateDataForm.value.electricalDrawing,
      "jobNumber": this.certificateDataForm.value.jobNumber,
      "flowRateRange":  this.certificateDataForm.value.flowRateRange,
      "flowRateTolerance": this.certificateDataForm.value.flowRateTolerance,
      "flowRateValue": this.certificateDataForm.value.flowRateValue,
      "inletPressureRange": this.certificateDataForm.value.inletPressureRange,
      "inletPressureTolerance": this.certificateDataForm.value.inletPressureTolerance,
      "inletPressureValue":this.certificateDataForm.value.inletPressureValue,
      "maxDeliveryPressureRange": this.certificateDataForm.value.maxDeliveryPressureRange,
      "maxDeliveryPressureTolerance": this.certificateDataForm.value.maxDeliveryPressureTolerance,
      "maxDeliveryPressureValue": this.certificateDataForm.value.maxDeliveryPressureValue,
      "powerMainMotorRange": this.certificateDataForm.value.powerMainMotorRange,
      "powerMainMotorTolerance":  this.certificateDataForm.value.powerMainMotorTolerance,
      "powerMainMotorValue": this.certificateDataForm.value.powerMainMotorValue,
      "powerAuxillariesRange": this.certificateDataForm.value.powerAuxillariesRange,
      "powerAuxillariesTolerance": this.certificateDataForm.value.powerAuxillariesTolerance,
      "powerAuxillariesValue": this.certificateDataForm.value.powerAuxillariesValue,
      "temperatureRange": this.certificateDataForm.value.temperatureRange,
      "temperatureTolerance": this.certificateDataForm.value.temperatureTolerance,
      "temperatureValue": this.certificateDataForm.value.temperatureValue,
      "oilCircuitDrawing": this.certificateDataForm.value.oilCircuitDrawing,
      "pIdDrawing": this.certificateDataForm.value.pIdDrawing,
      "purchaseOrderNo": this.certificateDataForm.value.purchaseOrderNo,
      "waterCircuitDrawing": this.certificateDataForm.value.waterCircuitDrawing,
      "fatDate":  this.mytime,
      "gasType": this.GastypeV,
      "fatTableDataViewModels": [
      {
      "paramName": "DURATION OF TEST",
      "paramUnit": "minutes",
      "test1Value": this.test1time,
      "test2Value": this.test2time,
      "test3Value": this.test3time
      },
      {
      "paramName": "AMBIENT TEMPERATURE",
      "paramUnit": this.SignalCertificateFormGroup.controls.Ambienttemp.value ? this.SignalCertificateFormGroup.controls.Ambienttemp.value : "°C",
      "test1Value": this.SignalCertificateFormGroup.controls.Ambienttemp1.value,
      "test2Value": this.SignalCertificateFormGroup.controls.Ambienttemp2.value,
      "test3Value": this.SignalCertificateFormGroup.controls.Ambienttemp3.value
      },
      {
      "paramName": "POWER SUPPLY VOLTAGE",
      "paramUnit": "V",
      "test1Value": this.PowerSupplyVoltageV1 ? this.PowerSupplyVoltageV1:"no-data",
      "test2Value": this.PowerSupplyVoltageV2 ? this.PowerSupplyVoltageV2:"no-data",
      "test3Value": this.PowerSupplyVoltageV3 ? this.PowerSupplyVoltageV3:"no-data"
      },
      {
      "paramName": "TOTAL AVG CURRENT",
      "paramUnit": "A",
      "test1Value": this.TotalAvgCurrentV1 ? this.TotalAvgCurrentV1:"no-data",
      "test2Value":  this.TotalAvgCurrentV2 ? this.TotalAvgCurrentV2:"no-data",
      "test3Value":  this.TotalAvgCurrentV3 ? this.TotalAvgCurrentV3:"no-data"
      },
      {
      "paramName": "GAS DETECTOR LEVEL",
      "paramUnit": "A",
      "test1Value":  this.GasDetectorLevelV1 ? this.GasDetectorLevelV1:"no-data",
      "test2Value":  this.GasDetectorLevelV2 ? this.GasDetectorLevelV2:"no-data",
      "test3Value":  this.GasDetectorLevelV3 ? this.GasDetectorLevelV3:"no-data"
      },
      {
      "paramName": "FLOW RATE",
      "paramUnit": "Kg/h",
      "test1Value":  this.FlowRateKghV1 ? this.FlowRateKghV1:"no-data",
      "test2Value":  this.FlowRateKghV2 ? this.FlowRateKghV2:"no-data",
      "test3Value":  this.FlowRateKghV3 ? this.FlowRateKghV3:"no-data"
      },
      {
      "paramName": "FLOW RATE",
      "paramUnit": "Sm3/h",
      "test1Value":  this.FlowRateSmhV1 ? this.FlowRateSmhV1:"no-data",
      "test2Value":  this.FlowRateSmhV2 ? this.FlowRateSmhV2:"no-data",
      "test3Value":  this.FlowRateSmhV3 ? this.FlowRateSmhV3:"no-data"
      },
      {
      "paramName": "INLET SUCTION",
      "paramUnit": "bar",
      "test1Value": this.InletSusctionV1 ? this.InletSusctionV1:"no-data",
      "test2Value": this.InletSusctionV2 ? this.InletSusctionV2:"no-data",
      "test3Value": this.InletSusctionV3 ? this.InletSusctionV3:"no-data"
      },
      {
      "paramName": "DISCHARGE PRESSURE",
      "paramUnit": "bar",
      "test1Value": this.DischargePressureV1 ? this.DischargePressureV1:"no-data",
      "test2Value": this.DischargePressureV2 ? this.DischargePressureV2:"no-data",
      "test3Value": this.DischargePressureV3 ? this.DischargePressureV3:"no-data"
      },
      {
      "paramName": "COOLING WATER PRESSURE",
      "paramUnit": "bar",
      "test1Value": this.CoolingWaterPressureV1 ? this.CoolingWaterPressureV1:"no-data",
      "test2Value": this.CoolingWaterPressureV2 ? this.CoolingWaterPressureV2:"no-data",
      "test3Value": this.CoolingWaterPressureV3 ? this.CoolingWaterPressureV3:"no-data"
      },
      {
      "paramName": "H.P REGULATOR PRESSURE",
      "paramUnit":  this.SignalCertificateFormGroup.controls.HpRegPressure.value ? this.SignalCertificateFormGroup.controls.HpRegPressure.value : "bar",
      "test1Value": this.SignalCertificateFormGroup.controls.HpRegPressure1.value,
      "test2Value": this.SignalCertificateFormGroup.controls.HpRegPressure2.value,
      "test3Value": this.SignalCertificateFormGroup.controls.HpRegPressure3.value

      },
      {
      "paramName": "L.P REGULATOR PRESSURE",
      "paramUnit": this.SignalCertificateFormGroup.controls.LpRegPressure.value ? this.SignalCertificateFormGroup.controls.LpRegPressure.value : "bar",
      "test1Value": this.SignalCertificateFormGroup.controls.LpRegPressure1.value,
      "test2Value": this.SignalCertificateFormGroup.controls.LpRegPressure2.value,
      "test3Value": this.SignalCertificateFormGroup.controls.LpRegPressure3.value
      },
      {
      "paramName": "DISCHARGE PRESSURE 1ST STAGE",
      "paramUnit": "bar",
      "test1Value": this.DischargePressure1stStageV1 ? this.DischargePressure1stStageV1:"no-data",
      "test2Value": this.DischargePressure1stStageV2 ? this.DischargePressure1stStageV2:"no-data",
      "test3Value": this.DischargePressure1stStageV3 ? this.DischargePressure1stStageV3:"no-data"
      },
      {
      "paramName": "DISCHARGE GAS TEMPERATURE",
      "paramUnit": "°C",
      "test1Value":  this.DischargeGasTempretureV1 ? this.DischargeGasTempretureV1:"no-data",
      "test2Value":  this.DischargeGasTempretureV2 ? this.DischargeGasTempretureV2:"no-data",
      "test3Value":  this.DischargeGasTempretureV3 ? this.DischargeGasTempretureV3:"no-data"
      },
      {
      "paramName": "HEAT EXCHANGER INLET GAS TEMP",
      "paramUnit":  this.SignalCertificateFormGroup.controls.HeatExWaterTemp.value ? this.SignalCertificateFormGroup.controls.HeatExWaterTemp.value : "°C",
      "test1Value": this.SignalCertificateFormGroup.controls.HeatExWaterTemp1.value,
      "test2Value": this.SignalCertificateFormGroup.controls.HeatExWaterTemp2.value,
      "test3Value": this.SignalCertificateFormGroup.controls.HeatExWaterTemp3.value
      },
      {
        "paramName": "HEAT EXCHANGER OUTLET WATER TEMP",
        "paramUnit": "°C",
        "test1Value":  this.HeatExchangerOutletWaterTempV1 ? this.HeatExchangerOutletWaterTempV1:"no-data",
        "test2Value":  this.HeatExchangerOutletWaterTempV2 ? this.HeatExchangerOutletWaterTempV2:"no-data",
        "test3Value":  this.HeatExchangerOutletWaterTempV3 ? this.HeatExchangerOutletWaterTempV3:"no-data"
        },
      {
      "paramName": "COMPRESSOR AUTO START PRESSURE",
      "paramUnit": "°C",
      "test1Value": this.CompressorAutoStartPressureV1 ? this.CompressorAutoStartPressureV1:"no-data",
      "test2Value": this.CompressorAutoStartPressureV2 ? this.CompressorAutoStartPressureV2:"no-data",
      "test3Value": this.CompressorAutoStartPressureV3 ? this.CompressorAutoStartPressureV3:"no-data",
      }
      ],
      "alarmInletPressureRange": this.certificateDataForm.value.inletPressureValue,
      "inletPressureMinAlarmSet": this.alaramformgroup.value.inletPressureMinAlarmSet,
      "inletPressureMaxAlarmSet": this.alaramformgroup.value.inletPressureMaxAlarmSet,
      "alarmMaxDeliveryPressureRange": this.certificateDataForm.value.maxDeliveryPressureValue,
      "maxDeliveryPressureAlarmSet":  this.alaramformgroup.value.maxDeliveryPressureAlarmSet,
      "mediumBankPressureRange": this.alaramformgroup.value.mediumbankpressure,
      "mediumBankPressureMaxAlarmSet": this.alaramformgroup.value.mediumBankPressureMaxAlarmSet,
      "highBankPressureRange": this.alaramformgroup.value.highbankpressure,
      "highBankPressureMinAlarmSet": this.alaramformgroup.value.highBankPressureMinAlarmSet,
      "highBankPressureMaxAlarmSet": this.alaramformgroup.value.highBankPressureMaxAlarmSet,
      "maxOilPressureLowRegulatorRange": this.alaramformgroup.value.maxOilPressureLowRegulatorRange,
      "maxOilPressureLowRegulatorValue": this.alaramformgroup.value.maxOilPressureLowRegulatorValue,
      "maxOilPressureHighRegulatorRange": this.alaramformgroup.value.maxOilPressureHighRegulatorRange,
      "maxOilPressureHighRegulatorValue": this.alaramformgroup.value.maxOilPressureHighRegulatorValue,
      "airPressureRange": this.alaramformgroup.value.airPressureRange,
      "airPressureValue": this.alaramformgroup.value.airPressureValue,
      "oilTempAlarmSetRange": this.alaramformgroup.value.oilTempAlarmSetRange,
      "oilTempAlarmSetValue": this.alaramformgroup.value.oilTempAlarmSetValue,
      "oilPressureAlarmSetRange": this.alaramformgroup.value.oilPressureAlarmSetRange,
      "oilPressureAlarmSetValue": this.alaramformgroup.value.oilPressureAlarmSetValue,
      "date": currdate,
      "place": ""
      }

      if(this.Checkboxcontrol.value?.InletStage1 == true){
        let inletStage1 = {
          "paramName": "INLET GAS TEMPERATURE 1ST STAGE",
          "paramUnit":  this.SignalCertificateFormGroup.controls.InGasTemp1St.value ? this.SignalCertificateFormGroup.controls.InGasTemp1St.value : "°C",
          "test1Value": this.SignalCertificateFormGroup.controls.InGasTemp1St1.value,
          "test2Value": this.SignalCertificateFormGroup.controls.InGasTemp1St2.value,
          "test3Value": this.SignalCertificateFormGroup.controls.InGasTemp1St3.value
          }
          pdfInput["fatTableDataViewModels"].push(inletStage1);
      }
      if(this.Checkboxcontrol.value?.InletStage2 == true){

        let inletStage2 = {
          "paramName": "INLET GAS TEMPERATURE 2ND STAGE",
          "paramUnit":  this.SignalCertificateFormGroup.controls.InGasTemp2St.value ? this.SignalCertificateFormGroup.controls.InGasTemp2St.value : "°C",
          "test1Value": this.SignalCertificateFormGroup.controls.InGasTemp2St1.value,
          "test2Value": this.SignalCertificateFormGroup.controls.InGasTemp2St2.value,
          "test3Value": this.SignalCertificateFormGroup.controls.InGasTemp2St3.value
          }
          pdfInput["fatTableDataViewModels"].push(inletStage2);
      }
      if(this.Checkboxcontrol.value?.OutletStage1 == true){
        let outletStage1 =  {
          "paramName": "OUTLET GAS TEMPERATURE 1ST STAGE",
          "paramUnit":  this.SignalCertificateFormGroup.controls.OutGasTemp1St.value ? this.SignalCertificateFormGroup.controls.OutGasTemp1St.value : "°C",
          "test1Value": this.SignalCertificateFormGroup.controls.OutGasTemp1St1.value,
          "test2Value": this.SignalCertificateFormGroup.controls.OutGasTemp1St2.value,
          "test3Value": this.SignalCertificateFormGroup.controls.OutGasTemp1St3.value
          }
          pdfInput["fatTableDataViewModels"].push(outletStage1);
      }
      if(this.Checkboxcontrol.value?.OutletStage2 == true){
        
        let outletStage2 = {
          "paramName": "OUTLET GAS TEMPERATURE 2ND STAGE",
          "paramUnit": this.SignalCertificateFormGroup.controls.OutGasTemp2St.value ? this.SignalCertificateFormGroup.controls.OutGasTemp2St.value : "°C",
          "test1Value": this.SignalCertificateFormGroup.controls.OutGasTemp2St1.value,
          "test2Value": this.SignalCertificateFormGroup.controls.OutGasTemp2St2.value,
          "test3Value": this.SignalCertificateFormGroup.controls.OutGasTemp2St3.value
          }
          pdfInput["fatTableDataViewModels"].push(outletStage2);
      }
      console.log(pdfInput,"pdfInput checking")
      this._dashboardservice.getCertificatePdfGenerationApi(pdfInput).subscribe(
        (result) => {
        const a = document.createElement('a') as HTMLAnchorElement;
        document.body.appendChild(a);
        const blob = new Blob([result], { type: 'application/pdf' });
        a.href = URL.createObjectURL(blob);
        // const date = new Date().toISOString().split('T')[0];
        a.download = "certificate.pdf";
        a.click();
        // this.reportloading = false;
        this.isLoading = false;
  
      },
      error =>{
        this.router.navigate(['dashboard/certificate']);
        this.isLoading = false;
        this.toastr.error(error?.errorMessage)
      },
      () => console.log('COMPLETE')
  
      );
  
  }
  //picking the color
  onColorPickerSelect(ev,i){
    this.isSignalDataPresnet = false;
    setTimeout(() => {
      console.log(ev,i,"after color picking values checking");
      this.nominalCharacterstics().controls[i].get("color").setValue(ev)
      this.deviceCertificateCategoriesData[i].lineWidth = 5;
      this.deviceCertificateCategoriesData[i].lineColor = this.nominalCharacterstics().controls[i].get("color").value;
      this.isSignalDataPresnet = true;
      console.log(this.deviceCertificateCategoriesData,"this.deviceCertificateCategoriesData checking")
    }, 1000);
   
  }

  //alaram certificate start
  alaramformgroup: FormGroup;

  alaramcertificatevalue() {
    this.alaramformgroup = this.formBuilder.group({
      // inletPressureValue: ['', Validators.required],
      inletPressureMaxAlarmSet: ['', Validators.required],
      inletPressureMinAlarmSet: ['', Validators.required],
      maxDeliveryPressureValue: ['', Validators.required],
      maxDeliveryPressureAlarmSet: ['', Validators.required],
      highBankPressureMinAlarmSet:['', Validators.required],
      highBankPressureMaxAlarmSet:['', Validators.required],
      mediumBankPressureMaxAlarmSet:['', Validators.required],
      maxOilPressureHighRegulatorValue:['', Validators.required],
      maxOilPressureHighRegulatorRange:['', Validators.required],
      maxOilPressureLowRegulatorValue:['', Validators.required],
      maxOilPressureLowRegulatorRange:['', Validators.required],
      inletPressureValue:['', Validators.required],
      mediumbankpressure:['', Validators.required],
      highbankpressure:['', Validators.required],

      airPressureRange: ['', Validators.required],
      airPressureValue: ['', Validators.required],
      oilTempAlarmSetRange: ['', Validators.required],
      oilTempAlarmSetValue: ['', Validators.required],
      oilPressureAlarmSetRange: ['', Validators.required],
      oilPressureAlarmSetValue:['', Validators.required],
      observationtextarea:[null]
    });
  }
  //alarm certificate end
  //signal certificate start
  ///////selected date from signal certificate/////////////////////
  fromDateChange(ev){
    this.dateofsignalCertificate = ev;
    
    let sdate = new Date(ev);
    this.dateformatter(sdate);

    }
///////////////dateformatter for signal certificate page////////////
    dateformatter(datev) {
      let date = datev;
      let year = date.getFullYear();
      let month: any = date.getMonth() + 1;
      let dt: any = date.getDate();
     
      if (dt < 10) {
        dt = '0' + dt;
      }
      if (month < 10) {
        month = '0' + month;
      }
      let formatdate = year + '-' + month + '-' + dt ;
      console.log(formatdate);
      this.mytime=formatdate;
      // return formatdate;
    }
    
           /////get Booster acceptance report data from api/////////////////
           getboosterAcceptanceReport(){

            this.fileredsignalForCertificate();
      
            // console.log(this.OutGasTemp2StV,this.OutGasTemp2StV1,this.OutGasTemp2StV2,this.OutGasTemp2StV3);
                
            console.log("get booster report");
            
            var fromtime1=this.time1;
            var Totime1=this.time2;
      
            var fromtime2=this.time3;
            var Totime2=this.time4;
      
            var fromtime3=this.time5;
            var Totime3=this.time6;
      
            let deviceid=this.deviceOneId;
           
            let test1FromDateTime;
            let test1ToDateTime
            let test2FromDateTime;
            let test2ToDateTime
            let test3FromDateTime;
            let test3ToDateTime
                       
      
            if( fromtime1 === undefined  || Totime1 === undefined)
            {
             
              test1FromDateTime =null;       
              test1ToDateTime =null;     
              this.test1time = null;             

              this.SignalCertificateFormGroup.controls["Ambienttemp1"].setErrors(null);
              this.SignalCertificateFormGroup.controls["HpRegPressure1"].setErrors(null);
              this.SignalCertificateFormGroup.controls["LpRegPressure1"].setErrors(null);
              this.SignalCertificateFormGroup.controls["HeatExWaterTemp1"].setErrors(null);
              this.test1formvalidation=false;
              

            }
            else
            {
              test1FromDateTime=this.mytime+ ' ' +fromtime1 +':'+'00';     
              test1ToDateTime=this.mytime+ ' ' +Totime1 +':'+'00';          
              this.test1time =moment.utc(moment(test1ToDateTime,"YYYY/MM/DD HH:mm:ss").diff(moment(test1FromDateTime,"YYYY/MM/DD HH:mm:ss"))).format("HH:mm:ss");      
              this.test1formvalidation=true;
             

            }

            if( fromtime2 === undefined || Totime2 === undefined)
            {

              test2FromDateTime =null;       
              test2ToDateTime =null;     
              this.test2time = null;
              this.SignalCertificateFormGroup.controls["Ambienttemp2"].setErrors(null);
              console.log(this.SignalCertificateFormGroup.controls["Ambienttemp2"].setErrors(null));
              
              this.SignalCertificateFormGroup.controls["HpRegPressure2"].setErrors(null);
              this.SignalCertificateFormGroup.controls["LpRegPressure2"].setErrors(null);
              this.SignalCertificateFormGroup.controls["HeatExWaterTemp2"].setErrors(null);
              this.test2formvalidation=false;

            }
            else
            {

              test2FromDateTime=this.mytime+ ' ' +fromtime2 +':'+'00';
              test2ToDateTime=this.mytime+ ' ' +Totime2 +':'+'00';
              this.test2time =moment.utc(moment(test2ToDateTime,"YYYY/MM/DD HH:mm:ss").diff(moment(test2FromDateTime,"YYYY/MM/DD HH:mm:ss"))).format("HH:mm:ss");   
             
              this.test2formvalidation=true;
             
         
            }

            if( fromtime3  === undefined || Totime3 === undefined)
            {
              test3FromDateTime =null;       
              test3ToDateTime =null;     
              this.test3time = null;      

              this.SignalCertificateFormGroup.controls["Ambienttemp3"].setErrors(null);
              this.SignalCertificateFormGroup.controls["HpRegPressure3"].setErrors(null);
              this.SignalCertificateFormGroup.controls["LpRegPressure3"].setErrors(null);
              this.SignalCertificateFormGroup.controls["HeatExWaterTemp3"].setErrors(null);
              this.test3formvalidation=false;  


            }
            else
            {
              test3FromDateTime=this.mytime+ ' ' +fromtime3 +':'+'00';
              test3ToDateTime=this.mytime+ ' ' +Totime3 +':'+'00';
              this.test3time =moment.utc(moment(test3ToDateTime,"YYYY/MM/DD HH:mm:ss").diff(moment(test3FromDateTime,"YYYY/MM/DD HH:mm:ss"))).format("HH:mm:ss");    
            
              this.test3formvalidation=true;  
            }
            
            this.checkbox(this.inletgastemp1,"InGasTemp1");
            this.checkbox(this.outletgastemp1,"OutGasTemp1");
            this.checkbox(this.inletgastemp2,"InGasTemp2");
            this.checkbox(this.outletgastemp2,"OutGasTemp2");
      
            console.log(this.test1time ,this.test2time,this.test3time);
            
      
      
            let data={
              "deviceId": deviceid, "signalIds": this.signalIds, "test1FromDateTime": test1FromDateTime, "test1ToDateTime": test1ToDateTime, "test2FromDateTime":test2FromDateTime, "test2ToDateTime":test2ToDateTime, "test3FromDateTime":test3FromDateTime, "test3ToDateTime":test3ToDateTime
            }
            
            // console.log(data);
            
            // console.log(JSON.stringify(data));
            
      
            this._dashboardservice.getSignalCerificateData(data).subscribe(
              (resdata) => {
                console.log(resdata,"getSignalCerificateData");
      
                resdata.forEach(element => {
                  if(element.signalId==this.PowerSupplyVoltageP){
                   this.PowerSupplyVoltageV1=element.test1Value;
                   this.PowerSupplyVoltageV2=element.test2Value;
                   this.PowerSupplyVoltageV3=element.test3Value;                                  
                  console.log(this.PowerSupplyVoltageV1,this.PowerSupplyVoltageV2,this.PowerSupplyVoltageV3 ,element.signalId);              
                  }
                  else if(element.signalId==this.TotalAvgCurrentP){
                    this.TotalAvgCurrentV1=element.test1Value;
                    this.TotalAvgCurrentV2=element.test2Value;
                    this.TotalAvgCurrentV3=element.test3Value;    
                    console.log(this.TotalAvgCurrentV1,this.TotalAvgCurrentV2,this.TotalAvgCurrentV3 ,element.signalId);              
                  }
                  else if(element.signalId==this.GasDetectorLevelP){
                    this.GasDetectorLevelV1=element.test1Value;
                    this.GasDetectorLevelV2=element.test2Value;
                    this.GasDetectorLevelV3=element.test3Value;    
                    console.log(this.GasDetectorLevelV1,this.GasDetectorLevelV2,this.GasDetectorLevelV3 ,element.signalId);              
                  }
                  else if(element.signalId==this.FlowRateKghP){
                    this.FlowRateKghV1=element.test1Value;
                    this.FlowRateKghV2=element.test2Value;
                    this.FlowRateKghV3=element.test3Value;    

                    if(this.FlowRateKghV1=="no data")
                    {
                      this.FlowRateSmhV1= "no data"

                    }
                    else{
                      this.FlowRateSmhV1= (element.test1Value*1.33);

                    }

                    if(this.FlowRateKghV2=="no data")
                    {
                      this.FlowRateSmhV2= "no data"

                    }
                    else{
                      this.FlowRateSmhV2=element.test2Value*1.33;

                    }

                    if(this.FlowRateKghV3=="no data")
                    {
                      this.FlowRateSmhV3= "no data"

                    }
                    else{
                      this.FlowRateSmhV3=element.test3Value*1.33;

                    }
                    
                    // this.FlowRateSmhV2=element.test2Value*1.33;
                    // this.FlowRateSmhV3=element.test3Value*1.33;    
                    console.log(this.FlowRateSmhV1,this.FlowRateSmhV2,this.FlowRateSmhV3 ,element.signalId); 
    
                    console.log(this.FlowRateKghV1,this.FlowRateKghV2,this.FlowRateKghV3 ,element.signalId);              
                  }
                  
                  else if(element.signalId==this.InletSusctionP){
                    this.InletSusctionV1=element.test1Value;
                    this.InletSusctionV2=element.test2Value;
                    this.InletSusctionV3=element.test3Value;    
                    console.log(this.InletSusctionV1,this.InletSusctionV2,this.InletSusctionV3 ,element.signalId);              
                  }
                  else if(element.signalId==this.DischargePressureP){
                    this.DischargePressureV1=element.test1Value;
                    this.DischargePressureV2=element.test2Value;
                    this.DischargePressureV3=element.test3Value;    
                    console.log(this.DischargePressureV1,this.DischargePressureV2,this.DischargePressureV3 ,element.signalId);              
                  }
                  else if(element.signalId==this.CoolingWaterPressureP){
                    this.CoolingWaterPressureV1=element.test1Value;
                    this.CoolingWaterPressureV2=element.test2Value;
                    this.CoolingWaterPressureV3=element.test3Value;    
                    console.log(this.CoolingWaterPressureV1,this.CoolingWaterPressureV2,this.CoolingWaterPressureV3 ,element.signalId);              
                  }
                  else if(element.signalId==this.DischargePressure1stStageP){
                    this.DischargePressure1stStageV1=element.test1Value;
                    this.DischargePressure1stStageV2=element.test2Value;
                    this.DischargePressure1stStageV3=element.test3Value;    
                    console.log(this.DischargePressure1stStageV1,this.DischargePressure1stStageV2,this.DischargePressure1stStageV3 ,element.signalId);              
                  }
                  else if(element.signalId==this.DischargeGasTempretureP){
                    this.DischargeGasTempretureV1=element.test1Value;
                    this.DischargeGasTempretureV2=element.test2Value;
                    this.DischargeGasTempretureV3=element.test3Value;    
                    console.log(this.DischargeGasTempretureV1,this.DischargeGasTempretureV2,this.DischargeGasTempretureV3 ,element.signalId);              
                  }
                  else if(element.signalId==this.HeatExchangerOutletWaterTempP){
                    this.HeatExchangerOutletWaterTempV1=element.test1Value;
                    this.HeatExchangerOutletWaterTempV2=element.test2Value;
                    this.HeatExchangerOutletWaterTempV3=element.test3Value;    
                    console.log(this.HeatExchangerOutletWaterTempV1,this.HeatExchangerOutletWaterTempV2,this.HeatExchangerOutletWaterTempV3 ,element.signalId);              
                  }
                  else if(element.signalId==this.CompressorAutoStartPressureP){
                    this.CompressorAutoStartPressureV1=element.test1Value;
                    this.CompressorAutoStartPressureV2=element.test2Value;
                    this.CompressorAutoStartPressureV3=element.test3Value;    
                    console.log(this.CompressorAutoStartPressureV1,this.CompressorAutoStartPressureV2,this.CompressorAutoStartPressureV3 ,element.signalId);              
                  }  
                  
                });  
                
              },
              error => {
                this.router.navigate(['dashboard/certificate']); 
                this.toastr.error(error?.errorMessage)     
              },
              () => console.log('COMPLETE')
              )
      
          }
         
    //signal certificate validation start
    signalcerificateval(){
      this.SignalCertificateFormGroup = this.formBuilder.group({    
       
        
        'gastype': [null, Validators.required],

        'Ambienttemp': [null],
        'Ambienttemp1': [null, Validators.required],             
        'HpRegPressure': [null],
        'HpRegPressure1': [null, Validators.required],
        
        'LpRegPressure': [null],
        'LpRegPressure1': [null, Validators.required],
       
        'HeatExWaterTemp': [null],
        'HeatExWaterTemp1': [null, Validators.required],
        
        'InGasTemp1St': [null],
        'InGasTemp1St1': [null],
        'InGasTemp1St2': [null],
        'InGasTemp1St3': [null],
        'OutGasTemp1St': [null],
        'OutGasTemp1St1': [null],
        'OutGasTemp1St2': [null],
        'OutGasTemp1St3': [null],
        'InGasTemp2St': [null],
        'InGasTemp2St1': [null],
        'InGasTemp2St2': [null],
        'InGasTemp2St3': [null],
        'OutGasTemp2St': [null],
        'OutGasTemp2St1': [null],
        'OutGasTemp2St2': [null],
        'OutGasTemp2St3': [null],

        'Ambienttemp2': [null, Validators.required],            
        'HpRegPressure2': [null, Validators.required],              
        'LpRegPressure2': [null, Validators.required],
        'HeatExWaterTemp2': [null, Validators.required],
  
        'Ambienttemp3': [null, Validators.required],            
        'HpRegPressure3': [null, Validators.required],              
        'LpRegPressure3': [null, Validators.required],
        'HeatExWaterTemp3': [null, Validators.required],
  
      });
      this.SignalCertificateTestFormGroup =this.formBuilder.group({
        'signaldate': [null, Validators.required],
        'FTime1': [null, Validators.required],
        'FTime2': [null, Validators.required],
        'FTime3': [null, Validators.required],
        'FTime4': [null, Validators.required],
        'FTime5': [null, Validators.required],
        'FTime6': [null, Validators.required],
      });           
     
    } 
    //signal certificate validation end

  //checkbox related code start here

  //////////////checkbox event//////////

  onCheckboxChange(e:any,formControlName:string) {
  
    console.log(e);
    console.log(formControlName);

    
   this.checkbox(e.checked,formControlName);
  }

  checkbox(checked:boolean,formControlName:string)
  {
    if (checked==true) {
      console.log("trueeeeeeeeee");
      if(this.test1formvalidation){        
        this.SignalCertificateFormGroup.controls[formControlName+"St1"].setValue(null);   
        this.SignalCertificateFormGroup.controls[formControlName+"St1"].setValidators(Validators.required);
      }
      if(this.test2formvalidation){
        this.SignalCertificateFormGroup.controls[formControlName+"St2"].setValue(null);   
        this.SignalCertificateFormGroup.controls[formControlName+"St2"].setValidators(Validators.required);
      }
      if(this.test3formvalidation){
        this.SignalCertificateFormGroup.controls[formControlName+"St3"].setValue(null);   
        this.SignalCertificateFormGroup.controls[formControlName+"St3"].setValidators(Validators.required);
      }
     
      
    } else {
      console.log("--false---------");
      if(this.test1formvalidation){
        this.SignalCertificateFormGroup.controls[formControlName+"St1"].setValue(null);     
        this.SignalCertificateFormGroup.controls[formControlName+"St1"].setErrors(null);   
      }      
      if(this.test2formvalidation){
        this.SignalCertificateFormGroup.controls[formControlName+"St2"].setValue(null); 
        this.SignalCertificateFormGroup.controls[formControlName+"St2"].setErrors(null);
      }    
      if(this.test3formvalidation){
        this.SignalCertificateFormGroup.controls[formControlName+"St3"].setValue(null);  
        this.SignalCertificateFormGroup.controls[formControlName+"St3"].setErrors(null);  
      }    
    }
  }


  ///////////////////
  //checkbox related code end here
      //////////////////////Filter signals required for signal certificate page//////////////////////

      fileredsignalForCertificate(){ 

        // console.log(this.signalListOne);
        this.signalIds = [];
        this.signalListOne.forEach(element => {
          if(element.plcAddress=="40065"){
                this.signalIds.push(element.signalId);
                this.PowerSupplyVoltageP=element.signalId;              
          }
          else if(element.plcAddress=="40079"){
            this.signalIds.push(element.signalId);
            this.TotalAvgCurrentP=element.signalId;
          }
          else if(element.plcAddress=="40010" && element.signalDescription=="GD-1, Gas Leakage Detected"){
            this.signalIds.push(element.signalId);
            this.GasDetectorLevelP=element.signalId;
          }
          else if(element.plcAddress=="40053"){
            this.signalIds.push(element.signalId);
            this.FlowRateKghP=element.signalId;
          }         
          else if(element.plcAddress=="40017"){
            this.signalIds.push(element.signalId);
            this.InletSusctionP=element.signalId;
          }
          else if(element.plcAddress=="40021"){
            this.signalIds.push(element.signalId);
            this.DischargePressureP=element.signalId;
          }
          else if(element.plcAddress=="40025"){
            this.signalIds.push(element.signalId);
            this.CoolingWaterPressureP=element.signalId;
          }
          else if(element.plcAddress=="40019"){
            this.signalIds.push(element.signalId);
            this.DischargePressure1stStageP=element.signalId;
          }
          else if(element.plcAddress=="40033"){
            this.signalIds.push(element.signalId);
            this.DischargeGasTempretureP=element.signalId;
          }
          else if(element.plcAddress=="40031"){
            this.signalIds.push(element.signalId);
            this.HeatExchangerOutletWaterTempP=element.signalId;
          }
          else if(element.plcAddress=="40027"){
            this.signalIds.push(element.signalId);
            this.CompressorAutoStartPressureP=element.signalId;
          }         
          
        });
        console.log(this.signalIds);

      }

      
    
  //signal certificate end
  ngOnDestroy() {
    document.removeEventListener('keydown', this.fn);
  }
}







