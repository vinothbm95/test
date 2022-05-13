import { Component, OnInit, Inject,ViewChild } from '@angular/core';
import { FormControl, FormGroup,FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialog, MatDialogModule,MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ThemePalette } from '@angular/material/core';
import { DashboardService } from '../../rms-services';
import * as XLSX from 'xlsx';
import { ExportAsService, ExportOptions } from '../../rms-services/export-as.service';
import { DateTimeChartComponent } from 'src/app/shared/datetime-chart/datetime-chart.component';
import { stringify } from '@amcharts/amcharts4/.internal/core/utils/Utils';
import { error } from 'console';
import { ActivatedRoute, Router } from '@angular/router';
import { parse } from 'querystring';
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
import { object, string } from '@amcharts/amcharts4/core';
import { ParameterResponse } from '../../rms-interfaces/dashboard/dashboard-view/parameter-response';
import { SignalModel } from '../../rms-interfaces/dashboard/dashboard-view/signalmodel';
import { LogSheetParametersResponse } from '../../rms-interfaces/dashboard/dashboard-view/logsheet-parameters-response';
import { DeviceModel } from '../../rms-interfaces/dashboard/dashboard-view/devicemodel';
import { LogsheetThresholdResponse } from '../../rms-interfaces/dashboard/dashboard-view/logSheet-threshold-response';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { ToastrService } from 'ngx-toastr';

export interface PeriodicElement {
  stvalues: string;
  SPressure: number;
  Stage1: number;
  Stage2: number;
  lowoil: number;
  highoil: number;
  mediumbnk: number;
  highbank: number;
  water: number;
  air: number;
  oil: number;
  water1: number;
  oil1: number;
  water2: number;
  RPhase: number;
  YPhase: number;
  BPhase: number;
  AverageLineN: number;
  RYPhase: number;
  YBPhase: number;
  BRPhase: number;
  AverageLineL: number;
  TotalKW: number;
  hmr: number;
  inflow: number;
  itotalizer: number;
  outflow: number;
  ototalizer: number;

}
const ELEMENT_DATA: PeriodicElement[] = [
  { stvalues: '7/13/2221, 12:14 PM', SPressure: 1, Stage1: 27, Stage2: 1.0079, lowoil: 12, highoil: 313, mediumbnk: 32, highbank: 98, water: 837, air: 987, oil: 1.0079, water1: 12, oil1: 313, water2: 32, RPhase: 32, YPhase: 98, BPhase: 313, AverageLineN: 32, RYPhase: 32, YBPhase: 98, BRPhase: 837, AverageLineL: 987, TotalKW: 32, hmr: 837, inflow: 987, itotalizer: 388, outflow: 32, ototalizer: 766 },
  { stvalues: '7/13/2021, 12:14 PM', SPressure: 1, Stage1: 2, Stage2: 4.0026, lowoil: 12, highoil: 313, mediumbnk: 32, highbank: 98, water: 837, air: 987, oil: 1.0079, water1: 12, oil1: 313, water2: 32, RPhase: 32, YPhase: 98, BPhase: 313, AverageLineN: 32, RYPhase: 32, YBPhase: 98, BRPhase: 837, AverageLineL: 987, TotalKW: 32, hmr: 837, inflow: 987, itotalizer: 388, outflow: 32, ototalizer: 766 },
  { stvalues: '7/13/2021, 12:14 PM', SPressure: 1, Stage1: 332, Stage2: 6.941, lowoil: 12, highoil: 313, mediumbnk: 32, highbank: 98, water: 837, air: 987, oil: 1.0079, water1: 12, oil1: 313, water2: 32, RPhase: 32, YPhase: 98, BPhase: 313, AverageLineN: 32, RYPhase: 32, YBPhase: 98, BRPhase: 837, AverageLineL: 987, TotalKW: 32, hmr: 837, inflow: 987, itotalizer: 388, outflow: 32, ototalizer: 766 },
  { stvalues: '7/13/2021, 12:14 PM', SPressure: 1, Stage1: 334, Stage2: 9.0122, lowoil: 12, highoil: 313, mediumbnk: 32, highbank: 98, water: 837, air: 987, oil: 1.0079, water1: 12, oil1: 313, water2: 32, RPhase: 32, YPhase: 98, BPhase: 313, AverageLineN: 32, RYPhase: 32, YBPhase: 98, BRPhase: 837, AverageLineL: 987, TotalKW: 32, hmr: 837, inflow: 987, itotalizer: 388, outflow: 32, ototalizer: 766 },
  { stvalues: '7/13/2021, 12:14 PM', SPressure: 1, Stage1: 432, Stage2: 10.811, lowoil: 12, highoil: 313, mediumbnk: 32, highbank: 98, water: 837, air: 987, oil: 1.0079, water1: 12, oil1: 313, water2: 32, RPhase: 32, YPhase: 98, BPhase: 313, AverageLineN: 32, RYPhase: 32, YBPhase: 98, BRPhase: 837, AverageLineL: 987, TotalKW: 32, hmr: 837, inflow: 987, itotalizer: 388, outflow: 32, ototalizer: 766 },
  { stvalues: '7/13/2021, 12:14 PM', SPressure: 1, Stage1: 52, Stage2: 12.0107, lowoil: 12, highoil: 313, mediumbnk: 32, highbank: 98, water: 837, air: 987, oil: 1.0079, water1: 12, oil1: 313, water2: 32, RPhase: 32, YPhase: 98, BPhase: 313, AverageLineN: 32, RYPhase: 32, YBPhase: 98, BRPhase: 837, AverageLineL: 987, TotalKW: 32, hmr: 837, inflow: 987, itotalizer: 388, outflow: 32, ototalizer: 766 },
  { stvalues: '7/13/2021, 12:14 PM', SPressure: 1, Stage1: 13, Stage2: 14.0067, lowoil: 12, highoil: 313, mediumbnk: 32, highbank: 98, water: 837, air: 987, oil: 1.0079, water1: 12, oil1: 313, water2: 32, RPhase: 32, YPhase: 98, BPhase: 313, AverageLineN: 32, RYPhase: 32, YBPhase: 98, BRPhase: 837, AverageLineL: 987, TotalKW: 32, hmr: 837, inflow: 987, itotalizer: 388, outflow: 32, ototalizer: 766 },
  { stvalues: '7/13/2021, 12:14 PM', SPressure: 1, Stage1: 124, Stage2: 15.9994, lowoil: 12, highoil: 313, mediumbnk: 32, highbank: 98, water: 837, air: 987, oil: 1.0079, water1: 12, oil1: 313, water2: 32, RPhase: 32, YPhase: 98, BPhase: 313, AverageLineN: 32, RYPhase: 32, YBPhase: 98, BRPhase: 837, AverageLineL: 987, TotalKW: 32, hmr: 837, inflow: 987, itotalizer: 388, outflow: 32, ototalizer: 766 },
  { stvalues: '7/13/2021, 12:14 PM', SPressure: 1, Stage1: 56, Stage2: 18.9984, lowoil: 12, highoil: 313, mediumbnk: 32, highbank: 98, water: 837, air: 987, oil: 1.0079, water1: 12, oil1: 313, water2: 32, RPhase: 32, YPhase: 98, BPhase: 313, AverageLineN: 32, RYPhase: 32, YBPhase: 98, BRPhase: 837, AverageLineL: 987, TotalKW: 32, hmr: 837, inflow: 987, itotalizer: 388, outflow: 32, ototalizer: 766 },
  { stvalues: '7/13/2021, 12:14 PM', SPressure: 1, Stage1: 64, Stage2: 20.1797, lowoil: 12, highoil: 313, mediumbnk: 32, highbank: 98, water: 837, air: 987, oil: 1.0079, water1: 12, oil1: 313, water2: 32, RPhase: 32, YPhase: 98, BPhase: 313, AverageLineN: 32, RYPhase: 32, YBPhase: 98, BRPhase: 837, AverageLineL: 987, TotalKW: 32, hmr: 837, inflow: 987, itotalizer: 388, outflow: 32, ototalizer: 766 },
];


@Component({
  selector: 'elpis-rms-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})


export class ReportComponent implements OnInit {
  @ViewChild('select') select: MatSelect;

  myControl = new FormControl();
  toppings = new FormControl();
  deviseslist: string[] = ['Device One', 'Device Two', ' Device Three'];
  SignalList: Object[];
  SignalDetails: any[];
  signalalarmlist: any[];
  devicelist: { devicedetails: string; }[];
  SignalReportdetails: { SignalReport: string; }[];
  TableHeader = [];
  public show: boolean = false;
  public buttonName: any = 'Show';
  displayedColumns: string[] = ['stvalues', 'SPressure', 'Stage1', 'Stage2', 'lowoil', 'highoil', 'mediumbnk', 'highbank', 'water', 'air', 'oil', 'water1', 'oil1', 'water2', 'RPhase', 'YPhase', 'BPhase', 'AverageLineN', 'RYPhase', 'YBPhase', 'BRPhase', 'AverageLineL', 'TotalKW', 'hmr', 'inflow', 'itotalizer', 'outflow', 'ototalizer'];


  dataSource = ELEMENT_DATA;

  private td1 = "td12"

  deviceCard: boolean = true;
  signalsCard: boolean = true;
  alaramCard: boolean = true;
  isCustomReport: boolean = true;
  isLogsheet: boolean = true;
  isStatusReport:boolean=true;
  isLogsheetpage: boolean = true;
  isbargraph:boolean=true;
  ispiechart:boolean=false;

  inputDataPresnet: boolean = false;
  reports: boolean = false;
  Search: any = "";
  customeReportDeviceList: string[] = ['Device 1', 'Device 2', 'Device 3', 'Device 4', 'Device 5', 'Device 6'];
  customeReportDevice = new FormControl();
  customeReportSignalList: string[] = ['Parameter 1', 'Parameter 2', 'Parameter 3', 'Parameter 4', 'Parameter 5', 'Parameter 6'];
  customeReportSignal = new FormControl();


  rmsAct: any;
  accountdetails = {
    email: "",
    password: ""
  }
  Devicedata: any = [];
  Cngdevicedata: any = [];
  CngPrintData:Cngprintdata;
  Cngdevice: any = [];
  Cngdevicename: any;
  petrodeviceid: any;
  selecteddevicename: any;
  seldevicename: any;
  selectedcngdevice: any;
  selectedsignalname: any;
  selectedStatusDeviceName:any;
  chartimage: any;
  // petronashsignals:any;
  DeviceTimereceived:any =[];
  petronashsignals: any = [];
  Statusdata:any=[];
  stardateTime: any;
  enddateTime: any;
  stardateTime1: any;
  enddateTime1: any;
  datepicker: any;
  // Sdate: any;
  // Edate: any;
  logSheetSignalsData = [];
  CngSdate:any;
  CngEdate:any;
  Startdate: any;
  Enddate: any;
  reportdata: any;
  statusreportdata:any=[];
  graphstatusreportdata:any;
  customReporpage: boolean = true;
  CustomeReportForm: FormGroup;
  isStatusReportForm:FormGroup;
  cng: FormGroup;
  fileName = 'ExcelSheet.xlsx';
  exceldata: any;
  reportloading: boolean;
  isLoading = false;
  allSignalsChecked:boolean;
  allSelected=false;
  StatusModel: any[];
  deviceInfoModels:any[];
  StatusOutputModel:any[];
  config: any;
  itemVal = 10;
  paginationShow:boolean = false;
  public pieseries:any;
  statusreportpage:boolean=false;





  constructor(public dialog: MatDialog,private toaster: ToastrService, private _dashboardservice: DashboardService, private exportAs: ExportAsService, private router: Router,
     
    private route: ActivatedRoute) {
   


    this.CustomeReportForm = new FormGroup(
      {
        // from: new FormControl(null, Validators.required),
        // to: new FormControl(null, Validators.required),
        devicelform: new FormControl(null, Validators.required),
        signalform: new FormControl(null, Validators.required),
        fromToDate: new FormControl(null, Validators.required)
      },
      // [Validators.required, this.dateRangeValidator]
    );

    this.isStatusReportForm = new FormGroup(
      {
      
        deviceform: new FormControl(null, Validators.required),
        fromToDate: new FormControl(null, Validators.required)
      }
    );

    this.cng = new FormGroup(
      {
        // from1: new FormControl(null, Validators.required),
        // to1: new FormControl(null, Validators.required),
        devicelform1: new FormControl(null, Validators.required),
        fromToDate: new FormControl(null, Validators.required),

        // cngdate :new FormControl(null,Validators.required) 
      },
      // [Validators.required, this.dateRangeValidator1]
    );
  }


  Header1 = [
    { id: 1, name: "deviceId", title: "Parameter Name", order: 1, },
    { id: 2, name: "deviceId-1", title: "Parameter1", order: 1, },
    { id: 2, name: "devic", title: "Parameter-1", order: 1, },
    { id: 2, name: "devc1", title: "Parameter1", order: 1, },
    { id: 2, name: "deviceId-1", title: "Parameter1", order: 1, },
    { id: 2, name: "devic", title: "Parameter-1", order: 1, },
    { id: 2, name: "devc1", title: "Parameter1", order: 1, },
    { id: 2, name: "deviceId-1", title: "Parameter", order: 1, },
    { id: 2, name: "devic", title: "Parameter-1", order: 1, },
    { id: 2, name: "devc1", title: "Parameter1", order: 1, },
    { id: 2, name: "deviceId-1", title: "Parameter", order: 1, },
    { id: 2, name: "devic", title: "Parameter-1", order: 1, },
    { id: 2, name: "devc1", title: "Parameter1", order: 1, },
  ]

  Object = Object;

  Header2 = [
    { Aamediumbnk: '7/13/2221, 12:14 PM', SPressure: 1, Stage1: 27, Stage2: 1.0079, lowoil: 12, highoil: 313, mediumbnk1: 3211, highbank: 98, water: 837, air: 987, oil: 1.0079, water1: 12, oil1: 313, water2: 3255, RPhase: 3211, YPhase: 98, BPhase: 313, baverageLineN: 321, RYPhase: 32, YBPhase: 98, BRPhase: 837, averageLineL: 987, TotalKW: 32, hmr: 837, inflow: 987, itotalizer: 388, outflow: 32, ototalizer: 766 },
    { Aamediumbnk: '7/13/2021, 12:14 PM', SPressure: 1, Stage1: 2, Stage2: 4.0026, lowoil: 12, highoil: 313, mediumbnk1: 32, highbank: 98, water: 837, air: 987, oil: 1.0079, water1: 12, oil1: 313, water2: 32, RPhase: 32, YPhase: 98, BPhase: 313, baverageLineN: 32, RYPhase: 32, YBPhase: 98, BRPhase: 837, averageLineL: 987, TotalKW: 32, hmr: 837, inflow: 987, itotalizer: 388, outflow: 32, ototalizer: 766 },
    { Aamediumbnk: '7/13/2021, 12:14 PM', SPressure: 1, Stage1: 332, Stage2: 6.941, lowoil: 12, highoil: 313, mediumbnk1: 32, highbank: 98, water: 837, air: 987, oil: 1.0079, water1: 12, oil1: 313, water2: 32, RPhase: 32, YPhase: 98, BPhase: 313, baverageLineN: 32, RYPhase: 32, YBPhase: 98, BRPhase: 837, averageLineL: 987, TotalKW: 32, hmr: 837, inflow: 987, itotalizer: 388, outflow: 32, ototalizer: 766 },
    { Aamediumbnk: '7/13/2021, 12:14 PM', SPressure: 1, Stage1: 334, Stage2: 9.0122, lowoil: 12, highoil: 313, mediumbnk1: 32, highbank: 98, water: 837, air: 987, oil: 1.0079, water1: 12, oil1: 313, water2: 32, RPhase: 32, YPhase: 98, BPhase: 313, baverageLineN: 32, RYPhase: 32, YBPhase: 98, BRPhase: 837, averageLineL: 987, TotalKW: 32, hmr: 837, inflow: 987, itotalizer: 388, outflow: 32, ototalizer: 766 },
    { Aamediumbnk: '7/13/2021, 12:14 PM', SPressure: 1, Stage1: 432, Stage2: 10.811, lowoil: 12, highoil: 313, mediumbnk1: 32, highbank: 98, water: 837, air: 987, oil: 1.0079, water1: 12, oil1: 313, water2: 32, RPhase: 32, YPhase: 98, BPhase: 313, baverageLineN: 32, RYPhase: 32, YBPhase: 98, BRPhase: 837, averageLineL: 987, TotalKW: 32, hmr: 837, inflow: 987, itotalizer: 388, outflow: 32, ototalizer: 766 },
    { Aamediumbnk: '7/13/2021, 12:14 PM', SPressure: 1, Stage1: 52, Stage2: 12.0107, lowoil: 12, highoil: 313, mediumbnk1: 32, highbank: 98, water: 837, air: 987, oil: 1.0079, water1: 12, oil1: 313, water2: 32, RPhase: 32, YPhase: 98, BPhase: 313, baverageLineN: 32, RYPhase: 32, YBPhase: 98, BRPhase: 837, averageLineL: 987, TotalKW: 32, hmr: 837, inflow: 987, itotalizer: 388, outflow: 32, ototalizer: 766 },
    { Aamediumbnk: '7/13/2021, 12:14 PM', SPressure: 1, Stage1: 13, Stage2: 14.0067, lowoil: 12, highoil: 313, mediumbnk1: 32, highbank: 98, water: 837, air: 987, oil: 1.0079, water1: 12, oil1: 313, water2: 32, RPhase: 32, YPhase: 98, BPhase: 313, baverageLineN: 32, RYPhase: 32, YBPhase: 98, BRPhase: 837, averageLineL: 987, TotalKW: 32, hmr: 837, inflow: 987, itotalizer: 388, outflow: 32, ototalizer: 766 },
    { Aamediumbnk: '7/13/2021, 12:14 PM', SPressure: 1, Stage1: 124, Stage2: 15.9994, lowoil: 12, highoil: 313, mediumbnk1: 32, highbank: 98, water: 837, air: 987, oil: 1.0079, water1: 12, oil1: 313, water2: 32, RPhase: 32, YPhase: 98, BPhase: 313, baverageLineN: 32, RYPhase: 32, YBPhase: 98, BRPhase: 837, averageLineL: 987, TotalKW: 32, hmr: 837, inflow: 987, itotalizer: 388, outflow: 32, ototalizer: 766 },
    { Aamediumbnk: '7/13/2021, 12:14 PM', SPressure: 1, Stage1: 56, Stage2: 18.9984, lowoil: 12, highoil: 313, mediumbnk1: 32, highbank: 98, water: 837, air: 987, oil: 1.0079, water1: 12, oil1: 313, water2: 32, RPhase: 32, YPhase: 98, BPhase: 313, baverageLineN: 32, RYPhase: 32, YBPhase: 98, BRPhase: 837, averageLineL: 987, TotalKW: 32, hmr: 837, inflow: 987, itotalizer: 388, outflow: 32, ototalizer: 766 },
    { Aamediumbnk: '7/13/2021, 12:14 PM', SPressure: 1, Stage1: 64, Stage2: 20.1797, lowoil: 12, highoil: 313, mediumbnk1: 32, highbank: 98, water: 837, air: 987, oil: 1.0079, water1: 12, oil1: 313, water2: 32, RPhase: 32, YPhase: 98, BPhase: 313, baverageLineN: 32, RYPhase: 32, YBPhase: 98, BRPhase: 837, averageLineL: 987, TotalKW: 32, hmr: 837, inflow: 987, itotalizer: 388, outflow: 32, ototalizer: 766 },
    { Aamediumbnk: '7/13/2021, 12:14 PM', SPressure: 1, Stage1: 64, Stage2: 20.1797, lowoil: 12, highoil: 313, mediumbnk1: 32, highbank: 98, water: 837, air: 987, oil: 1.0079, water1: 12, oil1: 313, water2: 32, RPhase: 32, YPhase: 98, BPhase: 313, baverageLineN: 32, RYPhase: 32, YBPhase: 98, BRPhase: 837, averageLineL: 987, TotalKW: 32, hmr: 837, inflow: 987, itotalizer: 388, outflow: 32, ototalizer: 766 },
    { Aamediumbnk: '7/13/2021, 12:14 PM', SPressure: 1, Stage1: 64, Stage2: 20.1797, lowoil: 12, highoil: 313, mediumbnk1: 32, highbank: 98, water: 837, air: 987, oil: 1.0079, water1: 12, oil1: 313, water2: 32, RPhase: 32, YPhase: 98, BPhase: 313, baverageLineN: 32, RYPhase: 32, YBPhase: 98, BRPhase: 837, averageLineL: 987, TotalKW: 32, hmr: 837, inflow: 987, itotalizer: 388, outflow: 32, ototalizer: 766 },
    { Aamediumbnk: '7/13/2021, 12:14 PM', SPressure: 1, Stage1: 64, Stage2: 20.1797, lowoil: 12, highoil: 313, mediumbnk1: 32, highbank: 98, water: 837, air: 987, oil: 1.0079, water1: 12, oil1: 313, water2: 32, RPhase: 32, YPhase: 98, BPhase: 313, baverageLineN: 32, RYPhase: 32, YBPhase: 98, BRPhase: 837, averageLineL: 987, TotalKW: 32, hmr: 837, inflow: 987, itotalizer: 388, outflow: 32, ototalizer: 766 },
    { Aamediumbnk: '7/13/2021, 12:14 PM', SPressure: 1, Stage1: 64, Stage2: 20.1797, lowoil: 12, highoil: 313, mediumbnk1: 32, highbank: 98, water: 837, air: 987, oil: 1.0079, water1: 12, oil1: 313, water2: 32, RPhase: 32, YPhase: 98, BPhase: 313, baverageLineN: 32, RYPhase: 32, YBPhase: 98, BRPhase: 837, averageLineL: 987, TotalKW: 32, hmr: 837, inflow: 987, itotalizer: 388, outflow: 32, ototalizer: 766 },

  ]


  private dateRangeValidator: ValidatorFn = (): {
    [key: string]: any;
  } | null => {
    let invalid = false;
    const from = this.CustomeReportForm && this.CustomeReportForm.get("from").value;
    const to = this.CustomeReportForm && this.CustomeReportForm.get("to").value;
    if (from && to) {
      invalid = new Date(from).valueOf() > new Date(to).valueOf();
    }
    return invalid ? { invalidRange: { from, to } } : null;
  };

  private dateRangeValidator1: ValidatorFn = (): {
    [key: string]: any;
  } | null => {
    let invalid = false;
    const from1 = this.cng && this.cng.get("from1").value;
    const to1 = this.cng && this.cng.get("to1").value;
    if (from1 && to1) {
      invalid = new Date(from1).valueOf() > new Date(to1).valueOf();
    }
    return invalid ? { invalidRange: { from1, to1 } } : null;
  };
  Header = [
    // { name: "deviceId", title: "Device Id" },
    { name: "signalName", title: "Parameter Name" },
    { name: "signalUnit", title: "Parameter Unit" },
    // { name: "signalId", title: "Signal Id" },
    { name: "signalDescription", title: "Parameter Description" },
    // { name: "signalModeId", title: "Signal Model Id" },
    // {  name: "signalModelId", title: "Signal Model Id" },

  ]
  tableHeaderData = [];


  customdate(stDate: any) {
    // console.log(stDate[0]);
    this.Startdate = stDate[0];
    this.Enddate = stDate[1];
    this.CngSdate =stDate[0];
    this.CngEdate=stDate[1];

    console.log(this.Startdate, this.Enddate);
  }
  customReportData = [

    {
      deviceId: 'Device 99',
      deviceName: 'Device Name 10',
      deviceDescription: 'Device description',
      email: 'abc@elpis.com',
      dataFormatType: 'Parameter Type',
      deviceType: "DAQ",
    },
    {
      deviceId: 'Device 2',
      deviceName: 'Device Name 2',
      deviceDescription: 'Device description',
      email: 'abc@elpis.com',
      dataFormatType: 'Parameter Type',
      deviceType: "DAQ",
    },
    {
      deviceId: 'Device 3',
      deviceName: 'Device Name 3',
      deviceDescription: 'Device description',
      email: 'abc@elpis.com',
      dataFormatType: 'Parameter Type',
      deviceType: "DAQ",
    },
    {
      deviceId: 'Device 10',
      deviceName: 'Device Name 10',
      deviceDescription: 'Device description',
      email: 'abc@elpis.com',
      dataFormatType: 'Parameter Type',
      deviceType: "DAQ",
    }

  ]

  exportexcel(data: any): void {
    console.log(data);

    const options: ExportOptions = {
      columns: [
        { name: 'Data Value ', field: 'dataValue' },
        { name: 'Time ', field: 'timeReceived', width: 25 },
      ],
      rows: data.signalDataModels,
      fileName: data.signalModel.signalName,
      dateFormat: 'MM/dd/yyyy H:m:ss'
    };
    this.exportAs.exportAsXlsx(options);
  }

  exportcng(): void {

    for (const mainKey of object.keys(this.Cngdevicedata)) {
      for (const subKey of object.keys(this.Cngdevicedata[mainKey])) {
        this.Cngdevicedata[mainKey][subKey]=this.Cngdevicedata[mainKey][subKey].split(';')[0]
        // console.log(this.Cngdevicedata[mainKey][subKey]);
        
      }
    }

    const options: ExportOptions = {
      columns: [
        { name: 'Time  ', field: 'timeReceived', width: 25 },
        { name: 'suctionPressure ', field: 'suctionPressure' },
        { name: 'stage1 ', field: 'stage1' },
        { name: 'stage2 ', field: 'stage2' },
        { name: 'pressureLowOil ', field: 'pressureLowOil' },
        { name: 'pressureHighOil ', field: 'pressureHighOil' },
        { name: 'pressureMediumBank ', field: 'pressureMediumBank' },
        { name: 'pressureHighBank  ', field: 'pressureHighBank' },
        { name: 'pressureWater ', field: 'pressureWater' },
        { name: 'pressureAir ', field: 'pressureAir' },
        { name: 'temperatureOil ', field: 'temperatureOil' },
        { name: 'temperatureWater ', field: 'temperatureWater' },
        { name: 'levelOil ', field: 'levelOil' },
        { name: 'levelWater ', field: 'levelWater' },
        { name: 'rPhaseVolt ', field: 'rPhaseVolt' },
        { name: 'yPhaseVolt ', field: 'yPhaseVolt' },
        { name: 'bPhaseVolt ', field: 'bPhaseVolt' },
        { name: 'avgLineNeutralVolt ', field: 'avgLineNeutralVolt' },
        { name: 'ryPhaseVolt ', field: 'ryPhaseVolt' },
        { name: 'ybPhaseVolt ', field: 'ybPhaseVolt' },
        { name: 'brPhaseVolt ', field: 'brPhaseVolt' },
        { name: 'avgLineToLineVolt ', field: 'avgLineToLineVolt' },
        { name: 'totalKw ', field: 'totalKw' },
        { name: 'hourMinSecRun ', field: 'hourMinSecRun' },
        { name: 'inletFlow ', field: 'inletFlow' },
        { name: 'inletTotal ', field: 'inletTotal' },
        { name: 'outletFlow ', field: 'outletFlow' },
        { name: 'outletTotal ', field: 'outletTotal' },


      ],
      rows: this.Cngdevicedata,
      fileName: this.Cngdevicename,
      dateFormat: 'MM/dd/yyyy H:m:ss'
    };
    this.exportAs.exportAsXlsx(options);
  }

  async exportTopdf(data: any, reportChart: DateTimeChartComponent) {
    console.log(data);
    // console.log(await reportChart.toImage());
    // this.reportloading = true; 
    this.isLoading = true;

    let firstname = JSON.parse(sessionStorage.getItem('rmsAccount')).firstName;
    let lastname = JSON.parse(sessionStorage.getItem('rmsAccount')).lastName;
    let companylogo = JSON.parse(sessionStorage.getItem('rmsCompanyAccount')).photo;
    // console.log(companylogo);

    let signalname = data.signalModel.signalName;
    let signalunit = data.signalModel.signalUnit;
    let date = new Date();
    let timereceived = this.dateformatter(date);

    let username = firstname + " " + lastname;

    // console.log(username);
    console.log(signalname, signalunit, username, timereceived);

    const filtered = data.signalDataModels.map(e => { return { value: e.dataValue, timeReceived: e.timeReceived } });

    // console.log(filtered);
    let graphimage = await reportChart.toImage();
    let companyAddress = "SunPower Gen FZCO, Plot Number: TP030605 - National Industries Park, Tel: 048862800 Fax No: 048862801,P.O.Box 2828,Dubai,United Arab Emirates,Mail id: qhse@supower.ae" ;
    let companyWebsite = "www.sunpower.ae";
    this._dashboardservice.getreport({ signalName: signalname, signalUnit: signalunit, userFullName: username, reportDate: timereceived, signalData: filtered, companyLogo: companylogo, graph: graphimage,companyAddress :companyAddress , companyWebsite:companyWebsite}).subscribe(
      (result) => {
        console.log(result,"export to pdf checking")
      const a = document.createElement('a') as HTMLAnchorElement;
      document.body.appendChild(a);
      const blob = new Blob([result], { type: 'application/pdf' });
      a.href = URL.createObjectURL(blob);
      const date = new Date().toISOString().split('T')[0];
      a.download = `${signalname}${date}.pdf`;
      a.click();
      // this.reportloading = false;
      this.isLoading = false;

    },
    error =>{
      this.router.navigate(['dashboard/report']);
      this.isLoading = false;
      this.toaster.error(error?.errorMessage)
    },
    () => console.log('COMPLETE')
    );


  }

  // exportTopdf(data: any): void {
  //   const options: ExportOptions = {
  //     columns: [
  //       { name: 'Data Value ', field: 'dataValue' },
  //       { name: 'Time ', field: 'timeReceived', width: 25 },   
  //     ],
  //     rows: data.signalDataModels,
  //     fileName: data.signalModel.signalName,
  //     dateFormat: 'MM/dd/yyyy H:m:ss'
  //   };
  //   this.exportAs.exportaspdf(options);
  // }




  // exportTo(): void {
  //   const first: any[] = this.signalOneDataTable;
  //   const second: any[] = this.signalTwoDataTable;
  //   type SignalExport = {
  //     value1?: string,
  //     time1?: Date,
  //     value2?: string,
  //     time2?: Date
  //   };
  //   const rows: SignalExport[] = [];
  //   const count = Math.max(first.length, second.length);
  //   for (let index = 0; index < count; index++) {
  //     const item: SignalExport = {};
  //     if (index < first.length) {
  //       item.value1 = first[index].dataValue;
  //       item.time1 = new Date(first[index].timeReceived);
  //     }
  //     if (index < second.length) {
  //       item.value2 = second[index].dataValue;
  //       item.time2 = new Date(second[index].timeReceived);
  //     }
  //     rows.push(item);
  //   }
  //   const options: ExportOptions = {
  //     columns: [
  //       { name: 'Value 1', field: 'value1' },
  //       { name: 'Time 1', field: 'time1', width: 25 },
  //       { name: 'Value 2', field: 'value2' },
  //       { name: 'Time 2', field: 'time2' , width: 25}
  //     ],
  //     rows: rows,
  //     fileName: 'SignalCompare',
  //     dateFormat: 'MM/dd/yyyy H:m:ss'
  //   };
  //   // if (format === 'csv') {
  //     this.exportAs.exportAsCsv(options);
  //     // this.exportAs.exportAsXlsx(options);

  //     // return;
  //   // }
  //   }

  toggleAllSelection() {
    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());      
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
    }
  }

  optionClick() {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelected = newStatus;
  }
  exportcngpdfreport() {

    this.isLoading = true;
    let compressorModel : string;
    let location :string;
    let compressorSerialNo : string;
    let date = new Date();

    compressorModel = this.selectedcngdevice.deviceSerialNo;
    location = this.selectedcngdevice.placeOfInstallation;
    compressorSerialNo = this.selectedcngdevice.versionNo;
    let reportDate = this.dateformatter(date);
    console.log(compressorModel, location, compressorSerialNo, reportDate);
    console.log(this.Cngdevicedata);

    
   
// object.keys(this.Cngdevicedata).forEach(element => {
//   console.log(this.Cngdevicedata[element]);
  
// });
 ////// split subkey values from the array of data/////'
for (const mainKey of object.keys(this.Cngdevicedata)) {
  for (const subKey of object.keys(this.Cngdevicedata[mainKey])) {
    this.Cngdevicedata[mainKey][subKey]=this.Cngdevicedata[mainKey][subKey].split(';')[0]
    // console.log(this.Cngdevicedata[mainKey][subKey]);
    
  }
}

// for (let i = 0; i < this.Cngdevicedata.length; i++) {
//   for (const iterator of object.keys(this.Cngdevicedata[i]) ){
//     this.Cngdevicedata[i][iterator]=this.Cngdevicedata[i][iterator].split(';')[0]
//   }
  
// }
 

   console.log(this.Cngdevicedata);


    // this._dashboardservice.getcngreport({ compressorModel: compressorModel==null?"any":compressorModel, location: location==null?"any":location, compressorSerialNo: compressorSerialNo==null?"any":compressorSerialNo, reportDate: reportDate, logSheetDataList: this.Cngdevicedata }).subscribe( 

    this._dashboardservice.getcngreport({ compressorModel: compressorModel, location: location, compressorSerialNo: compressorSerialNo, reportDate: reportDate, logSheetDataList: this.Cngdevicedata }).subscribe( 
      (pdffile) => {
      const a = document.createElement('a') as HTMLAnchorElement;
      document.body.appendChild(a);
      const blob = new Blob([pdffile], { type: 'application/pdf' });
      a.href = URL.createObjectURL(blob);
      const date = new Date().toISOString().split('T')[0];
      a.download = `${this.Cngdevicename}${date}.pdf`;
      a.click();
      this.isLoading = false;

    },
    error =>{
      this.router.navigate(['dashboard/report']);
      this.isLoading = false;
      this.toaster.error(error?.errorMessage)
    },
    () => console.log('COMPLETE')
    );


  }

  openDialog() {
    this.dialog.open(SelectSignalsDetailsDialog, {
      height: '600px',
      width: '80%',
    });
  }
logsheetPopupData;
  //logsheet threshold popup start
  logsheetThresholdConfigPopup() {

    let dialogRef = this.dialog.open(logsheetThresholdConfigPopup,
      {
        width: '1000px',
        // height:'500px',
        data:this.selectedcngdevice
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log("logsheet data after close",result); 
        if(result?.events == 'submit'){
           
        }
        // this.logsheetPopupData = result;
        // this.logsheetreport();
      
      });

  }
  //logsheet threshold popup end
  getLogSheetData(data){
    let str = data.split(';');
    return str[0]
  }
  getLogSheetBg(data){
    let str = data.split(';');
    if(str[1] !== null){
      return str[1];
    }else{
      return "";
    }
  }
  parameterspopup() {

    // this.Sdate = this.dateformatter(this.stardateTime);
    // this.Edate = this.dateformatter(this.enddateTime);
    // console.log(this.Sdate);
    // console.log(this.Edate);
    console.log(this.selectedsignalname);
    const autoSelect: (headers: any, key: string) => void = (headers, key) => {
      headers[key].required = true;
      headers[key].selected = true;
    }
    this.selectedsignalname.forEach(element => {
      if (!element.headers) {
        const headers = {};
        Object.getOwnPropertyNames(element).forEach(p => {
          headers[p] = { name: p, required: false, selected: false };
        });
        // autoSelect(headers, 'signalId');
        autoSelect(headers, 'signalName');
        // autoSelect(headers, 'deviceId');
        autoSelect(headers, 'signalUnit');
        autoSelect(headers, 'signalDescription');
        element.headers = headers;
      }
    });

    const dialogRef = this.dialog.open(parametercomponenetdialog,
      {
        width: '800px',
        // height: '450px',
        data: this.selectedsignalname
      });

    dialogRef.afterClosed().subscribe(res => {

      console.log(res);
      const filtered = [];
      
      if (res) {
        res.forEach(element => {
          console.log(element);
          
          this.reportloading = true;
          this.reportdata = [];

          const headers = element.headers;
          const filteredHeaders = Object.getOwnPropertyNames(headers).filter(h => headers[h].selected);
          // console.log(filteredHeaders);
       

          delete element["headers"];
          console.log(element);        
          
          filtered.push({ signalModel: element, params: filteredHeaders });
         
        });

        console.log(this.selecteddevicename);
        
        console.log({deviceId: this.selecteddevicename, signalParamViewModels: filtered, fromDate: this.Startdate, toDate: this.Enddate });
        this._dashboardservice.getparametersdata({ deviceId: this.selecteddevicename, signalParamViewModels: filtered, fromDate: this.Startdate, toDate: this.Enddate }).subscribe(
          (resdata:ParameterResponse[]) => {
            console.log(resdata,"getparametersdata checking");
            this.inputDataPresnet = true;
            this.reportdata = resdata;
            console.log(this.reportdata);
            resdata.forEach(data => {
              const series: any[] = data['signalDataModels'].map(value => [Date.parse(value.timeReceived), Number.parseFloat(value.dataValue)])
              data.chartSeries = [{
                name: data.signalModel.signalName,
                // title:data.signalModel.signalName,          
                type: 'areaspline',
                data: series
              }]
            }
            )
            // this.customReporpage = false;
            this.reportloading = false;
          },
          error => {
            this.router.navigate(['dashboard/report']);
            // this.toaster.error('Report sheet signals are not present');
            this.isCustomReport = true;
            this.reportloading = false;
            this.toaster.error(error?.errorMessage)
          },
          () => console.log('COMPLETE')
          )
      }
    });

  }

  //////////////////////bar graph///////////////////////////////

bargraph(ststusmodeldata:any){
  // console.log(ststusmodeldata,"ststusmodeldata checking")
  ststusmodeldata.allData[0].graphModel.isLineChart = true;
  ststusmodeldata.allData[0].graphModel.isPieChart = false;
  
  // console.log(this.StatusModel.find(e=>e["allData"][0].deviceId==ststusmodeldata.deviceId));
  // this.StatusModel.find(e=>e["allData"][0].deviceId==ststusmodeldata.deviceId)["ChartState"].IsPieChart=false;
  }
 
  //////////////////////////// devicestatus model pagination////////////////////
  
  // async getPaginationConfig(item) {
  //   alert("test")
  //   console.log(item,"pagination data");
    
  //   // this.paginationShow = true;
  //   this.config = {
  //     id: "CompareCustom",
  //     itemsPerPage: 100,
  //     currentPage: 1,
  //     totalItems: this.StatusOutputModel.length
  //   };
  
  // }
  getPaginate(item,i) {
    // console.log(item,i,"paginate checking");
     this.config = {
          id: `report-${i}`,
          itemsPerPage: 5,
          currentPage: 1,
          totalItems: item?.allData[0].deviceStatusDataModels?.length
        };
      return this.config;
  }
  
  pageChanged(event) {
    // alert("report")
    console.log(event,"page changed checking")
    this.config.currentPage = event;
  }
  
  
  itemsperpage(id,event) { 
    let element =document.getElementById(id)
    console.log(element);
    
    
    this.config.currentPage = 1;
    // this.config.currentPage = 1;
    console.log(element.innerText, "value checking");
    this.config.itemsPerPage = element.innerText;
   
  }
  
    /////////////get StatusGeport data///////////////////
  
    GetStatusGeport(){
      this.paginationShow = false;
      this.isbargraph=false;
      this.ispiechart=false;
      this.deviceInfoModels=[];
      // console.log(this.selectedStatusDeviceName);
      this.selectedStatusDeviceName.forEach(element => {      
      this.deviceInfoModels.push({deviceId:element.deviceId,devicename:element.deviceName}); });    
      console.log(this.deviceInfoModels);   
      console.log({deviceInfoModels:this.deviceInfoModels,fromDate:this.Startdate,toDate:this.Enddate});    
      this._dashboardservice.getRmsStatusReportData({deviceInfoModels:this.deviceInfoModels,fromDate:this.Startdate,toDate:this.Enddate}).subscribe( resulttdata =>{
        console.log(resulttdata,"report data checking");
        this.statusreportdata=  resulttdata;
      // console.log(this.statusreportdata);      
        this.StatusModel=[];
        this.statusreportdata.forEach((e) => {
          this.Statusdata=[];
          this.DeviceTimereceived = [];
          var items=[];
          this.StatusOutputModel= e.deviceStatusDataModels;
          // console.log(this.StatusOutputModel);  
          e.deviceStatusDataModels.forEach(a=>{  
            a["isActive"]=a["isActive"]==true?"Active":"InActive";
            this.DeviceTimereceived.push(a["timeReceived"])
            items.push(a["isActive"]=="Active"?1:0);         
          })  
          this.Statusdata =[{
            data:items,
            step: e["deviceName"],
            name: e["deviceName"]+' 0-Off 1-On'
        }]
           this.StatusModel.push({"allData":[e,this.DeviceTimereceived,this.Statusdata]});     
        });
        console.log(this.StatusModel,"status model checking");   
        this.config = {
          currentPage: 1,
          itemsPerPage: 2
    };
  
    this.route.queryParamMap
            .map(params => params.get('page'))
            .subscribe(page => this.config.currentPage = page);
        // this.piechart(this.StatusOutputModel);  
        // this.getPaginationConfig(this.StatusModel);
        this.paginationShow = true;
      }) ,
      error =>{
        console.log("api binding failed");    
        this.toaster.error(error?.errorMessage);
      },
      () => console.log('COMPLETE')    
   }
  
   /////StatusModel.allData[0] 
   piechart(ststusmodeldata:any){    
     console.log(ststusmodeldata, "pie chart output");
  
    console.log(ststusmodeldata.allData[0].deviceStatusDataModels.length);
    
    if(ststusmodeldata.allData[0].deviceStatusDataModels.length > 0 )
    {
console.log("new api call");

    this.isbargraph=true;    
      var statusmodeldata=[];
      statusmodeldata.push(ststusmodeldata.allData[0].deviceStatusDataModels);    
       console.log(ststusmodeldata.allData[0].deviceId);     
    
      var statusapidata=[];
      ststusmodeldata.allData[0].deviceStatusDataModels.forEach(element => {   
        statusapidata.push({isActive:element["isActive"]=="Active"?true:false,timeReceived:element["timeReceived"]});         
      });         
      console.log(statusapidata);       
  
    console.log(this.Startdate,this.Enddate,statusmodeldata);
      this._dashboardservice.getPieChartData(this.Startdate,this.Enddate,statusapidata).subscribe( Hoursdata =>{
    
        this.pieseries=[{    
          data: [{
              name: "Active",
              y: Hoursdata.activeDuration,
              color: '#62e650',      
     
          },
          {
            name: "InActive",
            y: Hoursdata.inactiveDuration,
            color: '#ff7171',      
        }]
      }]
      // console.log(this.StatusModel.find(e=>e["allData"][0].deviceId==ststusmodeldata.deviceId));
      // this.StatusModel.find(e=>e["allData"][0].deviceId==ststusmodeldata.deviceId)["ChartState"].IsPieChart=true;
      
      
      console.log();
      
      console.log(this.pieseries);
      
        console.log(Hoursdata);    
        ststusmodeldata.allData[0].graphModel.isLineChart = false;
        ststusmodeldata.allData[0].graphModel.isPieChart = true;
        
      }      
      
      ) ,
      error =>{
        console.log("api binding failed");   
        this.toaster.error(error?.errorMessage);     
      },
      () => console.log('COMPLETE')
    } 
    
    }
  
  

  //getting the logsheet signals only based on deviceid
  getLogsheetSignals(device){
    this.logSheetSignalsData = [];
    console.log(device,"device checking")
    this._dashboardservice.getDeviceLogSheetSignaldata(device?.deviceId).subscribe((data:SignalModel[]) => {
      console.log(data,"getting logsheet Parameters")
      this.logSheetSignalsData = data;
    }) 
  }
  logsheetreport() {
    this.reportloading = true;
    // let Sdate = this.dateformatter(this.stardateTime1);
    // let Edate = this.dateformatter(this.enddateTime1);


    // console.log(Sdate);
    // console.log(Edate);
    // console.log(this.selectedcngdevice); Startdate, this.Enddate
    this.Cngdevicename = this.selectedcngdevice.deviceName;
    console.log(this.selectedcngdevice.deviceId, this.Startdate, this.Enddate);
    if(this.logSheetSignalsData?.length == 0){
      this.toaster.info("No Parameters there!");
      this.isLogsheetpage = true;
      this.reportloading = false;
    }else{
      let log = {deviceId:this.selectedcngdevice.deviceId,signals:this.logSheetSignalsData,fromDate:this.Startdate,toDate:this.Enddate}
      this._dashboardservice.getcngdevicedata(log).subscribe((data:LogSheetParametersResponse[]) => {
        this.isLogsheetpage = false;
        this.reportloading = false;
        console.log(data,"selected logsheet Parameters");
        this.Cngdevicedata = data;
        if (!data.length) {
          this.toaster.info("No data present!");
          this.isLogsheetpage = true;
  
        }
      },
        error => {
          console.log("api error");
          this.router.navigate(['dashboard/report']);
          // this.toaster.error('Log sheet signals are not present');
          this.Cngdevicedata = [];
          this.isLogsheetpage = true;
          this.reportloading = false;
          this.toaster.error(error?.errorMessage)
        },
        () => console.log('COMPLETE')
      );
    }
    

  }
  openreportmodel(item: any) {
    const dialogRef = this.dialog.open(reportdatadialog,
      {
        width: '800px',
        // height: '450px',
        data: item
      });
  }
  dateformatter(datev) {
    let date = new Date(datev);
    let year = date.getFullYear();
    let month: any = date.getMonth() + 1;
    let dt: any = date.getDate();
    let hours = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();
    if (dt < 10) {
      dt = '0' + dt;
    }
    if (month < 10) {
      month = '0' + month;
    }
    let formatdate = year + '-' + month + '-' + dt + ' ' + hours + ':' + min + ':' + sec;
    // console.log(this.Sdate);
    return formatdate;
  }
  deviceDetails = [
    {
      deviceId: "1",
      deviceName: "device name 1",
      deviceDescription: "device 1 added",
      enableEmail: "abhi@elpis.com",
      isBaseStation: "device 1 added",
      isalarm: true,
      addAlaram: false,
      signalList: [
        { signalid: "01", signalName: "PT-1" },
        { signalid: "01", signalName: "PT-1" },
        { signalid: "01", signalName: "PT-1" },
        { signalid: "01", signalName: "PT-1" }
      ],
      alarmlist: [

        { last30days: "01", last60days: "5", dateRange: "20", OfflineDevicetime: "Wed, 30 Jan 2019 15 :27:46" },
        { last30days: "01", last60days: "5", dateRange: "20", OfflineDevicetime: "Wed, 30 Jan 2019 15 :27:46" },
        { last30days: "01", last60days: "5", dateRange: "20", OfflineDevicetime: "Wed, 30 Jan 2019 15 :27:46" },
        { last30days: "01", last60days: "5", dateRange: "20", OfflineDevicetime: "Wed, 30 Jan 2019 15 :27:46" },
        { last30days: "01", last60days: "5", dateRange: "20", OfflineDevicetime: "Wed, 30 Jan 2019 15 :27:46" },
        { last30days: "01", last60days: "5", dateRange: "20", OfflineDevicetime: "Wed, 30 Jan 2019 15 :27:46" }
      ]
    },
    {
      deviceId: "2",
      deviceName: "device name 2",
      deviceDescription: "device 2 added",
      enableEmail: "abhi@elpis.com",
      isBaseStation: "device 2 added",
      isalarm: true,
      addAlaram: false,
      signalList: [
        { signalid: "02", signalName: "PT-2" },
        { signalid: "02", signalName: "PT-2" },
        { signalid: "02", signalName: "PT-2" },
        { signalid: "02", signalName: "PT-2" },
        { signalid: "02", signalName: "PT-2" },
        { signalid: "02", signalName: "PT-2" },
        { signalid: "02", signalName: "PT-2" },
        { signalid: "02", signalName: "PT-2" },
        { signalid: "02", signalName: "PT-2" },
        { signalid: "02", signalName: "PT-2" },
        { signalid: "02", signalName: "PT-2" },
        { signalid: "02", signalName: "PT-2" },
        { signalid: "02", signalName: "PT-2" },
        { signalid: "02", signalName: "PT-2" },
        { signalid: "02", signalName: "PT-2" },
        { signalid: "02", signalName: "PT-2" }
      ],
      alarmlist: [

        { last30days: "02", last60days: "5", dateRange: "20", OfflineDevicetime: "Wed, 30 Jan 2029 25 :27:46" },
        { last30days: "02", last60days: "5", dateRange: "20", OfflineDevicetime: "Wed, 30 Jan 2029 25 :27:46" },
        { last30days: "02", last60days: "5", dateRange: "20", OfflineDevicetime: "Wed, 30 Jan 2029 25 :27:46" },
        { last30days: "02", last60days: "5", dateRange: "20", OfflineDevicetime: "Wed, 30 Jan 2029 25 :27:46" },
        { last30days: "02", last60days: "5", dateRange: "20", OfflineDevicetime: "Wed, 30 Jan 2029 25 :27:46" },
        { last30days: "02", last60days: "5", dateRange: "20", OfflineDevicetime: "Wed, 30 Jan 2029 25 :27:46" },
        { last30days: "02", last60days: "5", dateRange: "20", OfflineDevicetime: "Wed, 30 Jan 2029 25 :27:46" },
        { last30days: "02", last60days: "5", dateRange: "20", OfflineDevicetime: "Wed, 30 Jan 2029 25 :27:46" },
        { last30days: "02", last60days: "5", dateRange: "20", OfflineDevicetime: "Wed, 30 Jan 2029 25 :27:46" }
      ]
    }
  ]

  // headerData:[
  //   {id:1,name:"signalsId",title:"Signal id",isHide:false},
  //   {}
  // ]
  SignalReport = [
    {
      deviceId: "1",
      deviceName: "Ewon",
      deviceDescription: "device 1 added",
      enableEmail: "abhisheaka.abhi@gmail.com",
      isBaseStation: "device 1 added",

      SignalDetails: [
        {
          signalsId: "01",
          signalName: "PT-1",
          signalDescription: "SP-40FCMRDL-V01-1",
          startRange: "PT-1",
          endRange: "PT-1",
          Unit: "iso",
          Signaldatadecimalpoint: "iso",
          sigAddAlaram: false,
          signalalarm: true,


          signalalarmlist: [
            { devicename: "03", signalname: "5", whenalarmtriggered: "30", realvalue: "20", signalvalue: "30", resettime: "Wed, 30 Jan 3029 25 :27:46" },
            { devicename: "03", signalname: "5", whenalarmtriggered: "30", realvalue: "20", signalvalue: "30", resettime: "Wed, 30 Jan 3029 25 :27:46" },
            { devicename: "03", signalname: "5", whenalarmtriggered: "30", realvalue: "20", signalvalue: "30", resettime: "Wed, 30 Jan 3029 25 :27:46" }
          ]
        }
      ]
    },

    {
      deviceId: "1",
      deviceName: "Ewon",
      deviceDescription: "device 1 added",
      enableEmail: "abhisheaka.abhi@gmail.com",
      isBaseStation: "device 1 added",

      SignalDetails: [
        {
          signalsId: "01",
          signalName: "PT-1",
          signalDescription: "SP-40FCMRDL-V01-1",
          startRange: "PT-1",
          endRange: "PT-1",
          Unit: "iso",
          Signaldatadecimalpoint: "iso",
          sigAddAlaram: false,
          signalalarm: true,


          signalalarmlist: [
            { devicename: "03", signalname: "5", whenalarmtriggered: "30", realvalue: "20", signalvalue: "30", resettime: "Wed, 30 Jan 3029 25 :27:46" },
            { devicename: "03", signalname: "5", whenalarmtriggered: "30", realvalue: "20", signalvalue: "30", resettime: "Wed, 30 Jan 3029 25 :27:46" },
            { devicename: "03", signalname: "5", whenalarmtriggered: "30", realvalue: "20", signalvalue: "30", resettime: "Wed, 30 Jan 3029 25 :27:46" }
          ]
        },
        {
          signalsId: "01",
          signalName: "PT-1",
          signalDescription: "SP-40FCMRDL-V01-1",
          startRange: "PT-1",
          endRange: "PT-1",
          Unit: "iso",
          Signaldatadecimalpoint: "iso",
          sigAddAlaram: false,
          signalalarm: true,


          signalalarmlist: [
            { devicename: "03", signalname: "5", whenalarmtriggered: "30", realvalue: "20", signalvalue: "30", resettime: "Wed, 30 Jan 3029 25 :27:46" },
            { devicename: "03", signalname: "5", whenalarmtriggered: "30", realvalue: "20", signalvalue: "30", resettime: "Wed, 30 Jan 3029 25 :27:46" },
            { devicename: "03", signalname: "5", whenalarmtriggered: "30", realvalue: "20", signalvalue: "30", resettime: "Wed, 30 Jan 3029 25 :27:46" }
          ]
        },
        {
          signalsId: "01",
          signalName: "PT-1",
          signalDescription: "SP-40FCMRDL-V01-1",
          startRange: "PT-1",
          endRange: "PT-1",
          Unit: "iso",
          Signaldatadecimalpoint: "iso",
          sigAddAlaram: false,
          signalalarm: true,


          signalalarmlist: [
            { devicename: "03", signalname: "5", whenalarmtriggered: "30", realvalue: "20", signalvalue: "30", resettime: "Wed, 30 Jan 3029 25 :27:46" },
            { devicename: "03", signalname: "5", whenalarmtriggered: "30", realvalue: "20", signalvalue: "30", resettime: "Wed, 30 Jan 3029 25 :27:46" },
            { devicename: "03", signalname: "5", whenalarmtriggered: "30", realvalue: "20", signalvalue: "30", resettime: "Wed, 30 Jan 3029 25 :27:46" }
          ]
        }
      ]
    }
  ]




  accountObject: { SignalName: string, DateTime: string, value: number, Description: string, unit: string };
  ngOnInit() {

    let accountObject = sessionStorage.getItem('rmsAccount');
    this.rmsAct = JSON.parse(accountObject);
    console.log(this.cng);
    
    this.loaddata();

    
    // this.dashboardservice.getPetronashAllSignals(this.accountdetails).subscribe(data => {
    //   console.log("--------report page--------------");
    //   console.log(data);
    //   let x: any = data['userAccountModel'];
    //   let petronashModel = JSON.parse(x.userPreference);
    // let pname=petronashModel[0].deviceModel.deviceName;
    // console.log(pname);
    // console.log("--------report page-  end-------------");
    // })
  }
  loaddata() {
    let accountObject = sessionStorage.getItem('rmsAccount');
    this._dashboardservice.getDeviceData(this.rmsAct.customerId).subscribe((data:DeviceModel[]) => {
      console.log("++++user id++" + this.rmsAct.customerId);
      console.log(data,"getDeviceData checking");
      this.Devicedata = data;
      console.log(this.Devicedata);
      // for (let i = 0; i < this.Devicedata.length; i++) {
      //   this.Cngdevice.push(this.Devicedata[i].deviceName)
      // }     
      const copyItems = []

      this.Devicedata.forEach(element => {

        if (stringify(element.deviceName).substring(1, 4) === "CNG") {
          copyItems.push(element)
        }
      })
      this.Cngdevice = copyItems;
      console.log(this.Cngdevice);



    })
  }
  loadsignal(event) {
    // console.log(event.value);
    // console.log(this.selecteddevicename);

    this.loadsignals();
  }

  //   let x: any = data['userAccountModel'];
  //   let petronashModel = JSON.parse(x.userPreference);
  // let pname=petronashModel[0].deviceModel.deviceName;
  // console.log(pname);
  // console.log("--------report page-  end-------------");
  loadsignals() {
    this._dashboardservice.getDeviceSignaldata(this.selecteddevicename).subscribe((signals: SignalModel[]) => {
      console.log(signals,"Parameters checking");
      let psignals: any = signals;
      console.log(psignals);
      this.petronashsignals = psignals;
      // let sname=JSON.parse(psignals);
      // console.log(sname);

      // this.petronashsignals=psignals[];
      console.log("_______________________");
      console.log(this.petronashsignals);

    })
  }
  addAlaramList(item) {
    item.isalarm = false;
    item.addAlaram = true;
  }
  removeAlaramList(item) {
    item.isalarm = true;
    item.addAlaram = false;
  }

  signalAddAlaram(item1) {
    item1.signalalarm = false;
    item1.sigAddAlaram = true;
  }
  signalRemoveAlaramList(item1) {
    item1.signalalarm = true;
    item1.sigAddAlaram = false;
  }
  customReportView() {
    this.isCustomReport = false;
    this.reports = true;
    this.deviceCard = true;
    this.signalsCard = true;
    this.alaramCard = true;
    this.isLogsheet = true;
    this.isLogsheetpage = true;
    this.isStatusReport=true;

  }
  devicesReport() {
    this.isCustomReport = true;
    this.reports = true;
    this.deviceCard = false;
    this.signalsCard = true;
    this.alaramCard = true;
    this.isLogsheet = true;
    this.isLogsheetpage = true;
    this.isStatusReport=true;

  }
  signalReport() {
    this.isCustomReport = true;
    this.reports = true;
    this.deviceCard = true;
    this.signalsCard = false;
    this.alaramCard = true;
    this.isLogsheet = true;
    this.isLogsheetpage = true;
    this.isStatusReport=true;

  }
  alaramReport() {
    this.isCustomReport = true;
    this.reports = true;
    this.deviceCard = true;
    this.signalsCard = true;
    this.alaramCard = false;
    this.isLogsheet = true;
    this.isLogsheetpage = true;
    this.isStatusReport=true;

  }
  LogReport() {
    this.isCustomReport = true;
    this.reports = true;
    this.deviceCard = true;
    this.signalsCard = true;
    this.alaramCard = true;
    this.isLogsheet = false;
    this.isStatusReport=true;

  }
  DeviceStatusReport()
  {
    this.isCustomReport = true;
    this.reports = true;
    this.deviceCard = true;
    this.signalsCard = true;
    this.alaramCard = true;
    this.isLogsheet = true;
    this.isLogsheetpage = true;
    this.isStatusReport=false;
  }

}
export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}
@Component({
  selector: 'select-signals-details-dialog',
  templateUrl: 'select-signals-details-dialog.html',
  styleUrls: ['report.component.scss']
})
export class SelectSignalsDetailsDialog {

  task: Task = {
    name: 'ALL',
    completed: false,
    color: 'primary',
    subtasks: [
      { name: '1', completed: false, color: 'primary' },
      { name: '2', completed: false, color: 'primary' },
      { name: '3', completed: false, color: 'primary' },
      { name: '1', completed: false, color: 'primary' },
      { name: '2', completed: false, color: 'primary' },
      { name: '3', completed: false, color: 'primary' },
      { name: '1', completed: false, color: 'primary' },
      { name: '2', completed: false, color: 'primary' },
      { name: '3', completed: false, color: 'primary' },
      { name: '1', completed: false, color: 'primary' },
      { name: '2', completed: false, color: 'primary' },
      { name: '3', completed: false, color: 'primary' },

      { name: '4', completed: false, color: 'primary' }
    ]
  };

  allComplete: boolean = false;

  updateAllComplete() {
    this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
  }

  someComplete(): boolean {
    if (this.task.subtasks == null) {
      return false;
    }
    return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach(t => t.completed = completed);
  }
}

@Component({
  selector: 'parameter-componenet-dialog',
  templateUrl: 'parameter.componenet.html',
  styleUrls: ['report.component.scss']
})
export class parametercomponenetdialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dashboardservice: DashboardService, private toaster: ToastrService,) {

  }

  ngOnInit() {

    console.log("pppppppppppppppp");

    console.log(this.data);
    // getparametersdata(parametrsdata)

  }
  accountObject: { SignalName: string, DateTime: string, value: number, Description: string, unit: string };

  Header = [
    { id: 1, name: "deviceId", title: "Parameter Name", order: 1, },
    { id: 2, name: "deviceId-1", title: "Parameter1", order: 1, },
    { id: 2, name: "devic", title: "Parameter Name-1", order: 1, },
    { id: 2, name: "devc1", title: "Parameter1", order: 1, },
    { id: 2, name: "deviceId-1", title: "Parameter1", order: 1, },
    { id: 2, name: "devic", title: "Parameter Name-1", order: 1, },
    { id: 2, name: "devc1", title: "Parameter1", order: 1, },
    { id: 2, name: "deviceId-1", title: "Parameter1", order: 1, },
    { id: 2, name: "devic", title: "Parameter Name-1", order: 1, },
    { id: 2, name: "devc1", title: "Parameter1", order: 1, },
    { id: 2, name: "deviceId-1", title: "Parameter1", order: 1, },
    { id: 2, name: "devic", title: "Parameter Name-1", order: 1, },
    { id: 2, name: "devc1", title: "Parameter1", order: 1, },
  ]
  tableHeaderData = [];
  customReportData = [

    {
      deviceId: 'Device 99',
      deviceName: 'Device Name 10',
      deviceDescription: 'Device description',
      email: 'abc@elpis.com',
      dataFormatType: 'Parameter Type',
      deviceType: "DAQ",
    },
    {
      deviceId: 'Device 2',
      deviceName: 'Device Name 2',
      deviceDescription: 'Device description',
      email: 'abc@elpis.com',
      dataFormatType: 'Parameter Type',
      deviceType: "DAQ",
    },
    {
      deviceId: 'Device 3',
      deviceName: 'Device Name 3',
      deviceDescription: 'Device description',
      email: 'abc@elpis.com',
      dataFormatType: 'Parameter Type',
      deviceType: "DAQ",
    },
    {
      deviceId: 'Device 4',
      deviceName: 'Device Name 4',
      deviceDescription: 'Device description',
      email: 'abc@elpis.com',
      dataFormatType: 'Parameter Type',
      deviceType: "DAQ",
    },
    {
      deviceId: 'Device 5',
      deviceName: 'Device Name 5',
      deviceDescription: 'Device description',
      email: 'abc@elpis.com',
      dataFormatType: 'Parameter Type',
      deviceType: "DAQ",
    },
    {
      deviceId: 'Device 6',
      deviceName: 'Device Name 6',
      deviceDescription: 'Device description',
      email: 'abc@elpis.com',
      dataFormatType: 'Parameter Type',
      deviceType: "DAQ",
    },
    {
      deviceId: 'Device 7',
      deviceName: 'Device Name 7',
      deviceDescription: 'Device description',
      email: 'abc@elpis.com',
      dataFormatType: 'Parameter Type',
      deviceType: "DAQ",
    },
    {
      deviceId: 'Device 8',
      deviceName: 'Device Name 8',
      deviceDescription: 'Device description',
      email: 'abc@elpis.com',
      dataFormatType: 'Parameter Type',
      deviceType: "DAQ",
    },
    {
      deviceId: 'Device 9',
      deviceName: 'Device Name 9',
      deviceDescription: 'Device description',
      email: 'abc@elpis.com',
      dataFormatType: 'Parameter Type',
      deviceType: "DAQ",
    },
    {
      deviceId: 'Device 10',
      deviceName: 'Device Name 10',
      deviceDescription: 'Device description',
      email: 'abc@elpis.com',
      dataFormatType: 'Parameter Type',
      deviceType: "DAQ",
    }

  ]

  myButton() {
    console.log("my button was clicked!");
  }
}


@Component({
  selector: 'report-data-dialog',
  templateUrl: 'reportdata.component.html',
  styleUrls: ['report.component.scss']
})
export class reportdatadialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,  private toaster: ToastrService,) {

  }

  ngOnInit() {
    console.log("report dialog");
    console.log(this.data);
  }

}


//logsheet threshold popup start

@Component({
  selector: 'logsheet-threshold-config-popup',
  templateUrl: 'logsheet-threshold-config-popup.html',
  styleUrls: ['report.component.scss']
})

export class logsheetThresholdConfigPopup implements OnInit {
  logSheetShow:boolean = false;
  listOfSignals;
  signalIds;
  logSheetSignals;
  data1 = [
    {name:"avgLineNeutralVolt",val:null,title:"Average Line-Neutral Volts (Power Details)"},
    {name:"avgLineToLineVolt",val:null,title:"Average Line-Line Volts  (Power Details)"},
    {name:"bPhaseVolt",val:null,title:"B Phase Volts (Power Details)"},
    {name:"brPhaseVolt",val:null,title:"B-R Phase Volts (Power Details)"},
    {name:"hourMinSecRun",val:null,title:"Hour/Minute/Second Run"},
    {name:"inletFlow",val:null,title:"Flow (Inlet Flow Meter Reading, Flow Meter Reading)"},
    {name:"inletTotal",val:null,title:"Totalizer (Flow Meter Reading, Flow Meter Reading)"},
    {name:"levelOil",val:null,title:" Oil (Level)"},
    {name:"levelWater",val:null,title:"Water (Level)"},
    {name:"outletFlow",val:null,title:"Flow (Outlet Flow Meter Reading, Flow Meter Reading)"},
    {name:"outletTotal",val:null,title:"Totalizer (Outlet Flow Meter Reading, Flow Meter Reading)"},
    {name:"pressureAir",val:null,title:"Air (Pressure)"},
    {name:"pressureHighBank",val:null,title:"High Bank (Pressure)"},
    {name:"pressureHighOil",val:null,title:"High Oil (Pressure)	"},
    {name:"pressureLowOil",val:null,title:"Low  Oil (Pressure)"},
    {name:"pressureMediumBank",val:null,title:"Medium Bank (Pressure)"},
    {name:"pressureWater",val:null,title:"Water (Pressure)"},
    {name:"rPhaseVolt",val:null,title:"R Phase Volts (Power Details)"},
    {name:"ryPhaseVolt",val:null,title:"R-Y Phase Volts (Power Details)"},
    {name:"stage1",val:null,title:"stage 1 (Pressure)"},
    {name:"stage2",val:null,title:"stage 2 (Pressure)"},
    {name:"suctionPressure",val:null,title:"Suction (Pressure)"},
    {name:"temperatureOil",val:null,title:"Oil (Temperature)"},
    {name:"temperatureWater",val:null,title:"Water (Temperature)"},
    {name:"timeReceived",val:null,title:"Time (Hrs) Suction"},
    {name:"totalKw",val:null,title:"Total KW (KW) (Power Details) "},
    {name:"yPhaseVolt",val:null,title:"Y Phase Volts (Power Details)"},
    {name:"ybPhaseVolt",val:null,title:"Y-B Phase Volts (Power Details)"}
   
  ]
constructor(public _dashboardservice: DashboardService,  private toaster: ToastrService,
  private formBuilder: FormBuilder, public dialogRef: MatDialogRef<logsheetThresholdConfigPopup>,
  dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any,) {

  }

  ngOnInit(): void {
    console.log(this.data,"popup data checking");
this.logSheetShow = true;

this._dashboardservice.getDeviceLogSheetSignaldata(this.data?.deviceId).subscribe((data:SignalModel[]) =>{
  console.log(data,"getDeviceLogSheetSignaldata list of signal data checking");
  this.listOfSignals = data;
  this.signalIds = this.listOfSignals.map(function (a) { return a["signalId"]; });
  console.log(this.signalIds,"this.signalIds cheking")
  let logbody = {
    "deviceId": this.data?.deviceId,
    "signalIds": this.signalIds
  }
  this._dashboardservice.getLogSheetSignalThreshold(logbody).subscribe((data:LogsheetThresholdResponse[]) =>{
      console.log(data,"getLogSheetSignalThreshold data checking");
      this.logSheetSignals = data;
      console.log(this.logSheetSignals,"this.logSheetSignals checking")
      this.logSheetShow = false;
    },
    error => {
      this.logSheetShow = false;
      console.error(error,"login error checking");
      // return this.loginForm.get('email').setErrors({ 'invalid': true }), this.loginForm.get('password').setErrors({ 'invalid': true });
      this.toaster.error(error?.errorMessage);
    },
    () => console.log('COMPLETE')
    )
},
error => {
  this.logSheetShow = false;
  console.error(error,"login error checking")
  // return this.loginForm.get('email').setErrors({ 'invalid': true }), this.loginForm.get('password').setErrors({ 'invalid': true });
  this.toaster.error(error?.errorMessage);
},
() => console.log('COMPLETE')
)
    
  }
  getDescription(item){
    // this.listOfSignals.map(x=>{
    //   console.log(x,"data check")
    //   if(x.signalId == item.signalId) {
    //     return x.signalDescription;
    //   }
    // }) 
    for(let i = 0; i < this.listOfSignals?.length; i++){
      if(this.listOfSignals[i]?.signalId == item.signalId){
        return this.listOfSignals[i]?.signalDescription
        // console.log(this.listOfSignals[i],"this.listOfSignals[i] checking")
        
      }
    }
  }
  // onFocusOut(val){
  //   let x = parseInt(val?.threshold);
  //   console.log(typeof x,"checking")
  //   val.threshold = x;
  // }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  onFocusOut(item){
   
    if(item?.threshold == '') {
      item["threshold"] = null;
      return item;
    }
  }
  popupSubmit(){
    this.logSheetShow = true;
      this._dashboardservice.editLogsheetThresholdApi(this.logSheetSignals).subscribe(data =>{
        console.log(data,"submitted threshold values");
        this.logSheetShow = false;
        this.dialogRef.close({events:'submit',data:this.logSheetSignals});
      });
    
  }


}

//logsheer threshold popup end


export class Cngprintdata
{
  avgLineNeutralVolt:string;

}