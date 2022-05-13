import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import * as Highcharts from 'highcharts';
declare var require: any;
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/solid-gauge')(Highcharts);
require('highcharts/modules/heatmap')(Highcharts);
require('highcharts/modules/treemap')(Highcharts);
require('highcharts/modules/funnel')(Highcharts);


import HC_exporting from 'highcharts/modules/exporting';

/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { DashboardService } from '../../rms-services/dashboard/dashboard.service';
import { SignalDateRangeData } from '../model/signalDateRangeData.model';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import { AreasplineChartComponent } from 'src/app/shared/areaspline-chart/areaspline-chart.component';
import { ExportAsService, ExportOptions } from '../../rms-services/export-as.service';
import { error } from 'protractor';
import { ceil } from '@amcharts/amcharts4/.internal/core/utils/Math';
import { DeviceModel } from '../../rms-interfaces/dashboard/dashboard-view/devicemodel';
import { SignalModel } from '../../rms-interfaces/dashboard/dashboard-view/signalmodel';
import { signalResponse } from '../../rms-interfaces/dashboard/dashboard-view/signal-response';
import { SignalDataModel } from '../../rms-interfaces/dashboard/dashboard-view/signal-data-model';
import { ToastrService } from 'ngx-toastr';
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
@Component({
  selector: 'elpis-rms-signal-data',
  templateUrl: './signal-data.component.html',
  styleUrls: ['./signal-data.component.scss'],
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
export class SignalDataComponent implements OnInit, OnDestroy {
  //pagination code start

config: any;
public maxSize: number = 7;
public directionLinks: boolean = true;
public autoHide: boolean = false;
public responsive: boolean = true;
public labels: any = {
  previousLabel: '<--',
  nextLabel: '-->',
  screenReaderPaginationLabel: 'Pagination',
  screenReaderPageLabel: 'page',
  screenReaderCurrentLabel: `You're on page`
};
itemVal = 5;
paginationShow:boolean = false;
//pagination code end

  @ViewChild(AreasplineChartComponent)
  chart: AreasplineChartComponent;

  categories = [
    // 'Monday',
    // 'Tuesday',
    // 'wednsday'
  ];
  
  data = [
    //   {
    //   name: 'Abhishekar',
    //   data: [5,10,20]
    // },
    // {
    // name: 'Sharan',
    // data: [2,4,2,5,1,5,10]
    // }
  ]

  date = new FormControl(moment());
  filteredOptions1;
  filteredOptions2;
  selectedSignalId;

  showContent = false;

  signalDateRangeData;

  options: string[] = ['One', 'Two', 'Three'];
  startrange = [
    { text: "Start range", value: 0 },
    { text: "End Range", value: 250 },
    { text: "Type", value: "Analog" },
    { text: "Unit", value: "bar" },
    { text: "Display Type", value: "Gauge" },
    { text: "Group", value: "" }
  ]

  threshold = [
    { valuen: 160, color: "circle_dot" },
    { valuen: 180, color: "circle_dot1" },
    { valuen: 150, color: "circle_dot2" },




  ]
  ListOfData = [
    { value1: 5, datetime: "Wed, 30 Jan 2019 15 :27:46" },
    { value1: 45, datetime: "Wed, 30 Jan 2019 15 :27:46" },
    { value1: 3, datetime: "Wed, 30 Jan 2019 15 :27:46" },
    { value1: 280, datetime: "Wed, 30 Jan 2019 15 :27:46" },
    { value1: 250, datetime: "Wed, 30 Jan 2019 15 :27:46" },
    { value1: 5, datetime: "Wed, 30 Jan 2019 15 :27:46" },
    { value1: 30, datetime: "Wed, 30 Jan 2019 15 :27:46" },
    { value1: 40, datetime: "Wed, 30 Jan 2019 15 :27:46" }
  ]
  deviceId;
  devicedata;
  signalDataModels;
  devicename: any[] = [];
  signaldata;
  signalname = [];
  signalDataForm: FormGroup;
  signalDateForm: FormGroup;
  selectDeviceName = "";
  selectSignalName = "";
  selectFromDate;
  selectToDate;
  signalDetails;
  isSignalDataPresnet: boolean;
  rmsAct:any;
  Startdate: any;
  Enddate: any;
  loader:boolean;
  constructor(private _dashboardservice: DashboardService,  private toastr: ToastrService, private formBuilder: FormBuilder, private _adapter: DateAdapter<any>,
    private exportAs: ExportAsService) {
    this._adapter.setLocale('your locale');
    console.log(this._adapter, "checking date formats")


  }

  ngOnInit(): void {


    let accountObject = sessionStorage.getItem('rmsAccount');
    // let dummyPwd = sessionStorage.getItem('dummyPwd');
    // let selectedUser = sessionStorage.getItem('rmsSelectedUser');
    this.rmsAct = JSON.parse(accountObject);
    this._dashboardservice.getDeviceData(this.rmsAct.customerId).subscribe(
      (data:DeviceModel[]) => {
        console.log(data,"device model checking")
        // let x:any = data;
        this.devicedata = data;
        this.devicename = this.devicedata.map(function (a) { return a["deviceName"]; });
        this.deviceName.setValue('');
        console.log(this.devicedata, "device data checking")
        console.log(this.devicename, "device name checking")
      },
      error => {
        console.error(error);
        this.toastr.error(error?.errorMessage)
      },
      () => console.log('COMPLETE')
    )

    this.signalDataFormVal();
    this.signalDateFormVal();
    setTimeout(function () {


      // Themes begin
      am4core.useTheme(am4themes_animated);
      // Themes end

      let chart = am4core.create("chartdiv", am4charts.XYChart);
      chart.exporting.menu = new am4core.ExportMenu();
      // chart.exporting.menu.items = [{
      //   "label": "...",
      //   "menu": [
      //     { "type": "png", "label": "PNG" },
      //     { "type": "json", "label": "JSON" },
      //     { "label": "Print", "type": "print" }
      //   ]
      // }];
      let data = [];

      chart.data = [{
        "month": "Wed, 1 Jan 2019 15 :27:46",
        "income": 0,


      }, {
        "month": "Wed, 2 Jan 2019 15 :27:46",
        "income": 150,

      }, {
        "year": "Wed, 3 Jan 2019 15 :27:46",
        "income": 200,

      }, {
        "month": "Wed, 4 Jan 2019 15 :27:46",
        "income": 100,

      }, {
        "month": "Wed, 5 Jan 2019 15 :27:46",
        "income": 60,

      }, {
        "month": "Wed, 6 Jan 2019 15 :27:46",
        "income": 250,

      }];


      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "category";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.ticks.template.disabled = true;
      categoryAxis.renderer.line.opacity = 0;
      categoryAxis.renderer.grid.template.disabled = true;
      categoryAxis.renderer.minGridDistance = 40;
      categoryAxis.dataFields.category = "month";
      categoryAxis.startLocation = 0.4;
      categoryAxis.endLocation = 0.6;


      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.line.opacity = 0;
      valueAxis.renderer.ticks.template.disabled = true;
      valueAxis.min = 0;
      valueAxis.min = 0;
      valueAxis.max = 250;

      let lineSeries = chart.series.push(new am4charts.LineSeries());
      lineSeries.dataFields.categoryX = "month";
      lineSeries.dataFields.valueY = "income";
      lineSeries.tooltipText = "income: {valueY.value}";
      lineSeries.fillOpacity = 0.5;
      lineSeries.strokeWidth = 1;

      let lineSeries1 = chart.series.push(new am4charts.ColumnSeries());
      lineSeries1.dataFields.categoryX = "month";
      lineSeries1.dataFields.valueY = "income";
      lineSeries1.fillOpacity = 0.5;
      lineSeries1.strokeWidth = 1;
      lineSeries1.columns.template.width = 0.1;
      lineSeries1.tooltip.pointerOrientation = "horizontal";


      let gradient = new am4core.LinearGradient();
      gradient.addColor(am4core.color("#54D8FF"));
      gradient.addColor(am4core.color("#FFF"));
      gradient.rotation = 90;
      lineSeries.fill = gradient;

      // let bullet = series.bullets.create(am4charts.CircleBullet);
      let bullet = lineSeries.bullets.push(new am4charts.CircleBullet());
      bullet.circle.radius = 3;
      bullet.circle.fill = am4core.color("#A582B4");
      bullet.circle.strokeWidth = 5;

      chart.cursor = new am4charts.XYCursor();
      chart.cursor.behavior = "panX";
      chart.cursor.lineX.opacity = 0;
      chart.cursor.lineY.opacity = 0;

      // chart.scrollbarX.parent = chart.bottomAxesContainer;



    }, 300);

    this.filteredOptions1 = this.deviceName.valueChanges.pipe(
      startWith(''),
      map(value => this._filterdevicename(value))
    );
    this.filteredOptions2 = this.signalName.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

  }
  signalDataFormVal() {
    this.signalDataForm = this.formBuilder.group({
      'deviceName': [null, Validators.required],
      'signalName': [null, Validators.required],
      // 'fromDate' : [null, Validators.required],
      // 'toDate' : [null, Validators.required],
    });
  }
  signalDateFormVal() {
    this.signalDateForm = this.formBuilder.group({
      // 'fromDate': [null, Validators.required],
      // 'toDate': [null, Validators.required]
      'fromToDate': [null, Validators.required]
    });
  }
/////////////////datepicket from and to date ///////////////////////
  customdate(stDate: any) {
    this.Startdate = stDate[0];
    this.Enddate = stDate[1];
    console.log(this.Startdate, this.Enddate);
  }

  get deviceName() {
    return this.signalDataForm.get('deviceName') as FormControl
  }
  get signalName() {
    return this.signalDataForm.get('signalName') as FormControl
  }
  get fromDate() {
    return this.signalDateForm.get('fromDate') as FormControl
  }
  get toDate() {
    return this.signalDateForm.get('toDate') as FormControl
  }
  signalDataSubmit() {

  }
  signalDateSubmit() {

  }
  deviceNameval;
  getDeviceName() {
    this.signalname = [];
    this.selectSignalName = "";
    console.log(this.deviceName.value)
    let deviceDetails = this.devicedata.filter(x => x.deviceName === this.deviceName.value);

    this.deviceId = deviceDetails[0]?.deviceId;
    this.deviceNameval = deviceDetails[0]?.deviceName;
    console.log(deviceDetails, "device details")
    console.log( this.deviceId, "device id")

    this._dashboardservice.getDeviceSignaldata( this.deviceId).
      subscribe(
        (res:SignalModel[]) => {
          console.log(res,"res checking")
          this.signaldata = res;
          console.log(this.signaldata, "Parameter data cjhhh")
          this.signalname = this.signaldata?.map(function (a) {
            return a["signalName"];
          });
          this.signalName.setValue('');

          console.log(this.signaldata, "Parameter data checking")
          console.log(this.signalname, "Parameter name checking")
        }, error => {
          console.error(error);
           this.toastr.error(error?.errorMessage)
        },
        () => console.log('COMPLETE')
  
      )

  }
  
  getSignalName() {
    this.loader = true;
    let Details = this.signaldata.filter(x => x?.signalName === this.selectSignalName);
    console.log(Details,"details checking")
   let signalId = Details[0]?.signalId;
   console.log(signalId, "Parameter id checking")
   this.selectedSignalId = signalId;
   this._dashboardservice.getSignalById(signalId).
   subscribe(
     (res:signalResponse[]) => {
       console.log(res,"Parameter full Data")
       this.signalDetails = res;
       this.loader=false;
     },
     error =>{
      console.error(error);
       this.loader=false;
       this.toastr.error(error?.errorMessage)
     },
     () => console.log('COMPLETE')
   );
  }
  
  signalDataApply() {
    this.showContent = true;
    this.loader=true;
    // console.log(this.selectDeviceName,this.selectSignalName,"device name and signal name checking")
    // signalMode signalName
    let Details = this.signaldata.filter(x => x?.signalName === this.selectSignalName);
     console.log(Details,"details checking")
    let signalId = Details[0]?.signalId;
    console.log(signalId, "Parameter id checking")
    this.selectedSignalId = signalId;

    this._dashboardservice.getSignalDataViewSignalApi(this.deviceId,signalId).
      subscribe(
        (res:SignalDataModel[]) => {
          console.log(res,"device Data")
          this.signalDataModels = res[0];
          this.signalDateRangeData = res;
          this.isSignalDataPresnet = true;
          this.paginationShow = true;
          this.getPaginationConfig();
          this.categories = []
          this.signalDateRangeData.forEach((signalDataModel) => {
            this.categories.push(signalDataModel.timeReceived);
          })

          const items = this.signalDateRangeData.map(item => Number.parseFloat(item.dataValue));

          this.data = [{
            name: this.signalDetails?.signalModel?.signalName,
            data: items
          }]

          console.log(this.data)
          this.loader=false;
        },
        error =>{
          console.error(error);
          this.loader=false;
          this.toastr.error(error?.errorMessage)
        },
        () => console.log('COMPLETE')
  
      );
  }
  signalDateApply() {

    const fromdDate=this.Startdate;
    const EnddDate=this.Enddate;
        this.loader=true;
        // window.scrollTo({ top: 0, behavior: 'smooth' });
    // this.Enddate = stDate[1];


    // console.log(fromDate, toDate, "signal date apply checking")

    this._dashboardservice.getSignalDateRangeData(this.deviceId,this.selectedSignalId, fromdDate, EnddDate).subscribe(
      (res:SignalDataModel[]) => {
        console.log(res,"----");
        this.loader = false;
        this.isSignalDataPresnet = true;
        this.signalDateRangeData = res;
       
        this.paginationShow = true;
        this.getPaginationConfig();
        this.categories = []
        let items = []
        if(res){
          let len1 = this.signalDateRangeData?.length;
          let len2 = len1/2;
          let len3 = ceil(len2);
          console.log(len1,"len1 check")
          console.log(len2,"len2 checking")
          for(let i = 0; i < len3;i++){
            this.categories.push( this.signalDateRangeData[i].timeReceived);
            items.push(Number.parseFloat( this.signalDateRangeData[i].dataValue))
          }
          // this.signalDateRangeData.forEach((signalDataModel) => {
          //   this.categories.push(signalDataModel.timeReceived);
          //   items.push(Number.parseFloat(signalDataModel.dataValue))
          // })
          //  items = this.signalDateRangeData.map(item => Number.parseFloat(item.dataValue));
           this.data = [{
            name:this.signalDetails?.signalModel?.signalName,
            data: items
          }]
          document.addEventListener("scroll", function(e) {
            e.preventDefault(); // does nothing since the listener is passive
            // e.stopPropagation();
          }, {
            passive: false
          });
          // document.addEventListener("wheel", function(e) {
          //   e.preventDefault(); // does nothing since the listener is passive
          //   // e.stopPropagation();
          // }
          // // , {
          // //   passive: false
          // // }
          // );
          setTimeout(()=>{
            for(let i = len3; i < this.signalDateRangeData?.length;i++){
              this.categories.push( this.signalDateRangeData[i].timeReceived);
              items.push(Number.parseFloat( this.signalDateRangeData[i].dataValue))
            }
            // this.signalDateRangeData.forEach((signalDataModel) => {
            //   this.categories.push(signalDataModel.timeReceived);
            //   items.push(Number.parseFloat(signalDataModel.dataValue))
            // })
            //  items = this.signalDateRangeData.map(item => Number.parseFloat(item.dataValue));
             this.data = [{
              name:this.signalDetails?.signalModel?.signalName,
              data: items
            }]
          },100)
         
          document.addEventListener("scroll", function(e) {
            e.preventDefault(); // does nothing since the listener is passive
            // e.stopPropagation();
          }, 
          {
            passive: false
          }
          );
         
       
        }

      },
      (error) => {
        console.log(error);
        this.loader=false;
        this.toastr.error(error?.errorMessage);
      },
      () => console.log('COMPLETE')

    );
    // console.log(this.selectSignalName,this.selectFromDate,this.selectToDate,"signal data all")
  }
  async getPaginationConfig() {
    // this.paginationShow = true;
    this.config = {
      id: "SignalDataCustom",
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.signalDateRangeData?.length
    };

  }

  pageChanged(event) {
    this.config.currentPage = event;
  }


  itemsperpage(value,event) { 
    this.config.currentPage = 1;
    console.log(value, "value checking");
    this.config.itemsPerPage = value;
    document.addEventListener("wheel", function(e) {
      e.preventDefault(); // does nothing since the listener is passive
    }, {
      passive: true
    });
  }
  fromDateChange(event: any) {
    // alert("date change")
    console.log(event, "date ");
    // this.getData(newDate);
  }

  toDateChange(event: any) {
    // alert("date change")
    console.log(event, "date ");
    // this.getData(newDate);
  }



  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    const filters = this.signalname.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
    return filters.length ? filters : ['No Parameter'];
  }
  private _filterdevicename(value: string) {
    const filterValue1 = value.toLowerCase();

    const filters = this.devicename.filter(option => option?.toLowerCase().indexOf(filterValue1) === 0);
    return filters.length ? filters : ['No device'];
  }

  exportTo(format: string): void {
   
    type SignalExport = {
      value?: string,
      time?: Date,
      
    };
    const rows: SignalExport[] = [];
   
    for (let i = 0; i < this.signalDateRangeData?.length;i++) {
      const item: SignalExport = {};
  
        item.value = this.signalDateRangeData[i]?.dataValue;
        item.time = new Date(this.signalDateRangeData[i]?.timeReceived);
      rows.push(item);
    }
    const options: ExportOptions = {
      columns: [
        { name: 'Value', field: 'value' },
        { name: 'Time', field: 'time', width: 25 },
      ],
      rows: rows,
      fileName: 'Parameter-dataview',
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
  }
  ngOnDestroy(): void {

  }

}
