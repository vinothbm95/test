import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, tap, startWith } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import * as Highcharts from 'highcharts';
declare var require: any;
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/solid-gauge')(Highcharts);
require('highcharts/modules/heatmap')(Highcharts);
require('highcharts/modules/treemap')(Highcharts);
require('highcharts/modules/funnel')(Highcharts);


/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

import { DashboardService } from '../../rms-services/index';
import { ExportAsService, ExportOptions } from '../../rms-services/export-as.service';
import { error } from 'protractor';
import { SignalModel } from '../../rms-interfaces/dashboard/dashboard-view/signalmodel';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'elpis-rms-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss']
})
export class CompareComponent implements OnInit {
  //pagination code start

  config: any;
  config1: any;
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
  itemVal = 10;
  paginationShow:boolean = false;
  //pagination code end
  chartSeries: Highcharts.SeriesOptionsType[] = [];

  signalDataPresent = false;
  showContent = false;
  selectSignalName = "";
  selectSignalTwoName = "";
  loader: boolean;

  // selectedValue: string;
  compareForm: FormGroup;
  // myControl = new FormControl();
  filteredDeviceOne: Observable<string[]>;
  filteredDeviceTwo: Observable<string[]>;
  filteredSignalOne: Observable<string[]>;
  filteredSignalTwo: Observable<string[]>;
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
  count;
  devicelist = [];
  signalListOne = [];
  signalListTwo = [];
  firstDeviceSelected: any;
  deviceOneId;
  deviceTwoId;
  signalOneId;
  signalTwoId;
  signalOneName;
  signalTwoName;
  mainTableData;
  signalOneDataTable;
  signalTwoDataTable;
  fn: any;
  value: any;
  DateTimeArray: any[];
  allTimeRecieved: any[];
  Startdate:any;
  Enddate:any;


  constructor(private dashboardSVC: DashboardService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private exportAs: ExportAsService,
    private datePipe: DatePipe) {

  }

  ngOnInit(): void {
    this.createCompareForm();
    this.devicelist = this.route.snapshot.data.devicelist;

    this.filteredDeviceOne = this.firstDevice.valueChanges
      .pipe(
        startWith(''),
        map(device => this._filterDeviceOne(device)),
        tap(value => this.value = value)
      );

    this.fn = (evt: KeyboardEvent) => {
      if (evt.key === "ArrowDown" || evt.key === "ArrowUp") {
        if (this.value.length === 1 && this.value[0].deviceName === 'No device found !' ||
          this.value.length === 1 && this.value[0].signalModel.signalName === 'No Parameter found !') {
          evt.stopPropagation();
        }
      }
    }

    document.addEventListener('keydown', this.fn, true);

    this.filteredDeviceTwo = this.secondDevice.valueChanges
      .pipe(
        startWith(''),
        map(device => this._filterDeviceTwo(device)),
        tap(value => this.value = value)
      );


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
        "income2": 100,

      }, {
        "month": "Wed, 2 Jan 2019 15 :27:46",
        "income": 100,
        "income2": 0,
      }, {
        "year": "Wed, 3 Jan 2019 15 :27:46",
        "income": 0,
        "income2": 100,
      }, {
        "month": "Wed, 4 Jan 2019 15 :27:46",
        "income": 0,
        "income2": 100,
      }, {
        "month": "Wed, 5 Jan 2019 15 :27:46",
        "income": 100,
        "income2": 0,
      }, {
        "month": "Wed, 6 Jan 2019 15 :27:46",
        "income": 0,
        "income2": 100,
      }];

      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "category";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.ticks.template.disabled = true;
      categoryAxis.renderer.line.opacity = 0;
      categoryAxis.renderer.grid.template.disabled = true;
      categoryAxis.renderer.minGridDistance = 40;
      categoryAxis.dataFields.category = "month";
      // categoryAxis.dataFields.category = "month2";
      categoryAxis.startLocation = 0.4;
      categoryAxis.endLocation = 0.6;
      categoryAxis.fontSize = 10;

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.line.opacity = 0;
      valueAxis.renderer.ticks.template.disabled = true;
      valueAxis.min = 0;
      valueAxis.max = 250;

      let lineSeries = chart.series.push(new am4charts.LineSeries());
      lineSeries.dataFields.categoryX = "month";
      // lineSeries.dataFields.categoryX = "month2";
      lineSeries.dataFields.valueY = "income";
      lineSeries.tooltipText = "income: {valueY.value}";
      lineSeries.fillOpacity = 0.5;
      lineSeries.strokeWidth = 1;

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

      let lineSeries2 = chart.series.push(new am4charts.LineSeries());
      lineSeries2.dataFields.categoryX = "month";
      // lineSeries2.dataFields.categoryX = "month2";
      lineSeries2.dataFields.valueY = "income2";
      lineSeries2.tooltipText = "income: {valueY.value}";
      lineSeries2.fillOpacity = 0.5;
      lineSeries2.strokeWidth = 1;

      let gradient2 = new am4core.LinearGradient();
      gradient2.addColor(am4core.color("#A3A0FB"));
      gradient2.addColor(am4core.color("#FFF"));
      gradient2.rotation = 90;
      lineSeries2.fill = gradient2;

      // let bullet = series.bullets.create(am4charts.CircleBullet);
      let bullet2 = lineSeries2.bullets.push(new am4charts.CircleBullet());
      bullet2.circle.radius = 3;
      bullet2.circle.fill = am4core.color("#A582B4");
      bullet2.circle.strokeWidth = 5;

      chart.cursor = new am4charts.XYCursor();
      chart.cursor.behavior = "panX";
      chart.cursor.lineX.opacity = 0;
      chart.cursor.lineY.opacity = 0;
      // chart.scrollbarX.parent = chart.bottomAxesContainer;

    }, 300);

  }

  /////////////////datepicket from and to date ///////////////////////
  customdate(stDate: any) {
    this.Startdate = stDate[0];
    this.Enddate = stDate[1];
    console.log(this.Startdate, this.Enddate);
  }
  createCompareForm() {
    this.compareForm = this.formBuilder.group({
      'firstDevice': [null, Validators.required],
      'firstSignal': [null, Validators.required],
      'secondDevice': [null, Validators.required],
      'secondSignal': [null, Validators.required],
      // 'fromDate': [null, Validators.required],
      // 'toDate': [null, Validators.required]
      'fromToDate': [null, Validators.required]

    });
    this.compareForm.get('firstSignal').disable();
    this.compareForm.get('secondSignal').disable();
  }

  get firstDevice() {
    return this.compareForm.get('firstDevice') as FormControl
  }

  get firstSignal() {
    return this.compareForm.get('firstSignal') as FormControl
  }
  get secondDevice() {
    return this.compareForm.get('secondDevice') as FormControl
  }
  get secondSignal() {
    return this.compareForm.get('secondSignal') as FormControl
  }
  get fromDate() {
    return this.compareForm.get('fromDate') as FormControl
  }
  get toDate() {
    return this.compareForm.get('toDate') as FormControl
  }

  onSubmit() {
    console.log(this.compareForm.value);
    this.loader = true;

    let compareObj = {
      "deviceOneId": this.deviceOneId,
      "signalOneId": this.signalOneId,
      "deviceTwoId": this.deviceTwoId,
      "signalTwoId": this.signalTwoId,
      "fromDate": this.Startdate,
      "ToDate": this.Enddate
    }
    this.mainTableData = [];
    this.signalOneDataTable = [];
    this.signalTwoDataTable = []
    console.log('FormFinal value --------> ' + JSON.stringify(compareObj));
    this.dashboardSVC.getCompareSignalsData(compareObj).subscribe(
      (data) => {
        console.log(data,"data checking")
      this.signalDataPresent = true;
      this.showContent = true;
      this.mainTableData = data;
      this.signalOneDataTable = data[0];
      this.signalTwoDataTable = data[1];
      console.log("==================")
      let count1 = Math.max(this.signalOneDataTable?.length,this.signalTwoDataTable?.length);
      this.count = count1;
      console.log(count1,"count checking")
      let table2len1 = count1 / 2;
      let table2len2 = Math.ceil(table2len1);
      console.log(table2len2,"table2len2 checking")
     
      console.log(this.signalOneDataTable,this.signalTwoDataTable,"data checking")
      this.paginationShow = true;
      this.getPaginationConfig();
      let chartData = [];
      let signalName;
      let chartData1 = [];
      let signalName1;
      const series: Highcharts.SeriesOptionsType[] = [];
      this.chartSeries = [];
      for (let i = 0; i < table2len2; i++) {
       if(this.signalOneDataTable[i] !== undefined){
        signalName = this.signalOneDataTable[i]["signalId"] == this.signalOneId ? this.signalOneName : this.signalTwoName;
          chartData.push([Date.parse(this.signalOneDataTable[i]?.timeReceived), Number.parseFloat(this.signalOneDataTable[i]?.dataValue)]); 
       }
       if(this.signalTwoDataTable[i] !== undefined){
        signalName1 = this.signalTwoDataTable[i]["signalId"] == this.signalTwoId ? this.signalTwoName :  this.signalOneName ;
          chartData1.push([Date.parse(this.signalTwoDataTable[i]?.timeReceived), Number.parseFloat(this.signalTwoDataTable[i]?.dataValue)]); 
       }
          // });
      //   // Date.parse(
       
      // }
     
      }
      this.chartSeries =[{ 
        name: signalName,
        type: 'areaspline',
        data: chartData
      },
      {
      name: signalName1,
      type: 'areaspline',
      data: chartData1
    }]
    console.log(this.chartSeries,"this. this.chartSeries checking")
    document.addEventListener("scroll", function(e) {
      e.preventDefault(); // does nothing since the listener is passive
      // e.stopPropagation();
    }, {
      passive: false
    });
      // this.chartSeries = series;
    
      setTimeout(()=>{
        for (let i = table2len2; i <= this.count; i++) {
          if(this.signalOneDataTable[i] !== undefined){
           signalName = this.signalOneDataTable[i]["signalId"] == this.signalOneId ? this.signalOneName : this.signalTwoName;
             chartData.push([Date.parse(this.signalOneDataTable[i]?.timeReceived), Number.parseFloat(this.signalOneDataTable[i]?.dataValue)]); 
          }
          if(this.signalTwoDataTable[i] !== undefined){
           signalName1 = this.signalTwoDataTable[i]["signalId"] == this.signalTwoId ? this.signalTwoName :  this.signalOneName ;
             chartData1.push([Date.parse(this.signalTwoDataTable[i]?.timeReceived), Number.parseFloat(this.signalTwoDataTable[i]?.dataValue)]); 
          }
             // });
         //   // Date.parse(
          
         // }
        
         }
         this.chartSeries = [{ 
           name: signalName,
           type: 'areaspline',
           data: chartData
         },
         {
         name: signalName1,
         type: 'areaspline',
         data: chartData1
       }]
         
   
         this.chartSeries = series;
        
      },100)
      console.log(this.chartSeries,"this. this.chartSeries checking1")
      document.addEventListener("scroll", function(e) {
        e.preventDefault(); // does nothing since the listener is passive
        // e.stopPropagation();
      }, {
        passive: false
      });
      this.loader=false;

    },
    error =>{
      this.router.navigate(['dashboard/compare']);
      this.loader = false;
      this.toastr.error(error?.errorMessage)
    },
    () => console.log('COMPLETE')
    );
  }

  deviceSelection(device, controlName, event, id) {
    console.log(id);

    if (id === 1) {
      this.selectSignalName = "";
    }
    if (id === 2) {
      this.selectSignalTwoName = "";
    }
    if (event.isUserInput) {
      console.log(device);
      this.firstDeviceSelected = device;
      this.dashboardSVC.getDeviceSignaldata(device.deviceId).subscribe((x:SignalModel[]) => {
        console.log(x)
        if (controlName === 'firstDevice') {
          this.signalListOne = [];
          this.signalListOne = x;
          this.deviceOneId = device.deviceId;
          console.log('Device One Id--------> ' + this.deviceOneId);
          if (this.signalListOne.length > 0) {
            this.compareForm.get('firstSignal').enable();
            this.filteredSignalOne = this.firstSignal.valueChanges
              .pipe(
                startWith(''),
                map(signal => this._filterSignalOne(signal)),
                tap(value => this.value = value)
              );
          }
        } else {
          this.signalListTwo = [];
          this.signalListTwo = x;
          this.deviceTwoId = device.deviceId;
          console.log('Device Two Id--------> ' + this.deviceTwoId);
          if (this.signalListTwo.length > 0) {
            this.compareForm.get('secondSignal').enable();
            this.filteredSignalTwo = this.secondSignal.valueChanges
              .pipe(
                startWith(''),
                map(signal => this._filterSignalTwo(signal)),
                tap(value => this.value = value)
              );
          }
        }
      });
    }
  }
  /////////////////////////////////////////////pagination start////////////////////
  async getPaginationConfig() {
    // this.paginationShow = true;
    this.config = {
      id: "CompareCustom",
      itemsPerPage: 100,
      currentPage: 1,
      totalItems: this.signalOneDataTable?.length
    };
    this.config1 = {
      id: "CompareCustom1",
      itemsPerPage: 100,
      currentPage: 1,
      totalItems: this.signalTwoDataTable?.length
    };

  }

  pageChanged(event) {
    this.config.currentPage = event;
  }
  pageChanged1(event) {
    this.config1.currentPage = event;
  }



  itemsperpage(value,event) { 
    this.config.currentPage = 1;
    // this.config.currentPage = 1;
    console.log(value, "value checking");
    this.config.itemsPerPage = value;
   
  }
  itemsperpage1(value,event) { 
    this.config1.currentPage = 1;
    // this.config.currentPage = 1;
    console.log(value, "value checking");
    this.config1.itemsPerPage = value;
    
  }
  /////////////////////////////////////////////pagination end////////////////////

  signalSelection(signal, controlName, event) {

    if (event.isUserInput) {
      console.log(signal);
      if (controlName === 'firstSignal') {
        this.signalOneId = signal.signalId;
        this.signalOneName = signal?.signalName;
        console.log('Signal One Id--------> ' + this.signalOneId);
      } else {
        this.signalTwoId = signal.signalId;
        this.signalTwoName = signal?.signalName;
        console.log('Signal Two Id--------> ' + this.signalTwoId);
      }
    }
  }

  private _filterDeviceOne(value: string): any[] {
    const filterValue = value.toLowerCase();
    const results = this.devicelist.filter(device => device.deviceName.toLowerCase().includes(filterValue));
    return results.length ? results : [{ deviceName: 'No device found !' }];
  }

  private _filterDeviceTwo(value: string): any[] {
    const filterValue = value.toLowerCase();
    const results = this.devicelist.filter(device => device.deviceName.toLowerCase().includes(filterValue));
    return results.length ? results : [{ deviceName: 'No device found !' }];
  }

  private _filterSignalOne(value: string): any[] {
    const filterValue = value.toLowerCase();
    const results = this.signalListOne.filter(signal => signal.signalName.toLowerCase().includes(filterValue));
    return results.length ? results : [{ signal: { signalName: 'No Parameter found !' } }];
  }

  private _filterSignalTwo(value: string): any[] {
    const filterValue = value.toLowerCase();
    const results = this.signalListTwo.filter(signal => signal.signalName.toLowerCase().includes(filterValue));
    return results.length ? results : [{ signal: { signalName: 'No Parameter found !' } }];
  }

  _deviceSelection(option: string): { [className: string]: boolean } {
    return {
      'no-data': option === 'No device found !',
    }
  }

  _signalSelection(option: string): { [className: string]: boolean } {
    return {
      'no-data': option === 'No Parameter found !',
    }
  }

  exportTo(format: string): void {
    const first: any[] = this.signalOneDataTable;
    const second: any[] = this.signalTwoDataTable;
    type SignalExport = {
      value1?: string,
      time1?: Date,
      value2?: string,
      time2?: Date
    };
    const rows: SignalExport[] = [];
    const count = Math.max(first.length, second.length);
    for (let index = 0; index < count; index++) {
      const item: SignalExport = {};
      if (index < first.length) {
        item.value1 = first[index].dataValue;
        item.time1 = new Date(first[index].timeReceived);
      }
      if (index < second.length) {
        item.value2 = second[index].dataValue;
        item.time2 = new Date(second[index].timeReceived);
      }
      rows.push(item);
    }
    const options: ExportOptions = {
      columns: [
        { name: 'Value 1', field: 'value1' },
        { name: 'Time 1', field: 'time1', width: 25 },
        { name: 'Value 2', field: 'value2' },
        { name: 'Time 2', field: 'time2' , width: 25}
      ],
      rows: rows,
      fileName: 'SignalCompare',
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

  ngOnDestroy() {
    document.removeEventListener('keydown', this.fn);
  }

}
