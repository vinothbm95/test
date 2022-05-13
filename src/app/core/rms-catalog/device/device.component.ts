import {
  Component, OnInit, ViewChild, TemplateRef, Input, Host, Self, Optional, ViewContainerRef, Renderer2, Inject,
  ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit
} from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder, Validators, NgForm } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { RmscatalogService } from '../rmscatalog.service';
import { devicedatamodel } from '../model/devicedatamodel';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import { DashboardService } from '../../rms-services/dashboard/dashboard.service';
import { error } from 'console';
import { DashboarviewResponse } from '../../rms-interfaces/dashboard/dashboard-view/dashboard-view-response';
import { DeviceResponse } from '../../rms-interfaces/dashboard/dashboard-view/device-response'; 
import { DOCUMENT } from '@angular/common';
import { ExportAsService,ExportOptions } from '../../rms-services/export-as.service';
import { DeviceModel } from '../../rms-interfaces/dashboard/dashboard-view/devicemodel';
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
  selector: 'elpis-rms-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent implements OnInit {
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
  showDevice: boolean;

  //device header start 
  deviceHeader = [];
  
  //device header end 
  TableHeader = [];
  devicedata;
  emptydata: boolean = false;
  rmsAct: any;
  constructor(
    private _dashboardservice: DashboardService, private dialog: MatDialog,
    private route: Router,
    private toastr: ToastrService,
    private exportAs: ExportAsService
  ) {

  }
  p = 1;
  SearchModal: any = "";
  paginationShow = false;

  AllDeviceIds = [];

  ngOnInit() {
    let accountObject = sessionStorage.getItem('rmsAccount');
    // let dummyPwd = sessionStorage.getItem('dummyPwd');
    // let selectedUser = sessionStorage.getItem('rmsSelectedUser');
    this.rmsAct = JSON.parse(accountObject);
    this.loaddata();
  
    if(this.rmsAct?.customerId == 11){
      this.deviceHeader = [
        { id: 1, isFilter: false, hideFilter: false, name: "deviceId", title: "Asset ID", order: 1, isHide: false },
        { id: 2, isFilter: false, hideFilter: false, name: "deviceName", title: "Asset Name", order: 2, isHide: false },
        { id: 3, isFilter: false, hideFilter: false, name: "deviceDescription", title: "Product Name", order: 3, isHide: false },
        { id: 4, isFilter: false, hideFilter: false, name: "deviceSerialNo", title: "Manufacturer Part No", order: 4, isHide: true },
        { id: 5, isFilter: false, hideFilter: false, name: "isUsed",slidetogglekey: true, title: "Is Used", order: 5, isHide: false },
        { id: 6, isFilter: false, hideFilter: false, name: "dateOfInstallation", title: "Purchase Date", order: 6, isHide: true },
        { id: 7, isFilter: false, hideFilter: false, name: "versionNo", title: "Purchase Vendor", order: 7, isHide: true },
        { id: 8, isFilter: false, hideFilter: false, name: "deviceTopicIn", title: "Product Manufacturer Name", order: 8, isHide: true },
        { id: 9, isFilter: false, hideFilter: false, name: "deviceTopicOut", title: "Date Of Comissioning, ", order: 9, isHide: true },
        { id: 10, isFilter: false, hideFilter: false, name: "deviceTypeId", title: "Category Name ", order: 10, isHide: true },
        { id: 11, isFilter: false, hideFilter: false, name: "cityOfInstallation", title: "AMC Date", order: 11, isHide: true },
        { id: 12, isFilter: false, hideFilter: false, name: "placeOfInstallation", title: "Price", order: 12, isHide: true },
        { id: 13, isFilter: false, hideFilter: false, name: "timeZone", title: "Time Zone", order: 13, isHide: true },
        { id: 14, isFilter: false, hideFilter: false, name: "dataFormatTypeId", title: "Data Format Type ", order: 14, isHide: true },
        { id: 15, isFilter: false, hideFilter: false, name: "customerId", title: "Customer ", order: 15, isHide: true },
        { id: 16, isFilter: false, hideFilter: false, name: "email", title: "Email", order: 16, isHide: true },
        { id: 17, isFilter: false, hideFilter: false, name: "useDeviceTime", slidetogglekey: true, title: "Use Device Time", order: 17, isHide: true },
        { id: 18, isFilter: false, hideFilter: false, name: "isActive", isActiveKey: true, title: "Status", order: 18, isHide: false },
        { id: 19, isFilter: false, hideFilter: false, name: "isGateway", slidetogglekey: true, title: "IsGateway", order: 19, isHide: true },
        { id: 20, isFilter: false, hideFilter: false, name: "isLatLong", slidetogglekey: true, title: "IsLatLong", order: 20, isHide: true },
    
      ]
    this.TableHeader = this.deviceHeader.filter(x => (!x.isHide));
    }
    else{
      this.deviceHeader = [
        { id: 1, isFilter: false, hideFilter: false, name: "deviceId", title: "Device ID", order: 1, isHide: false },
        // {id:2,isFilter:false,hideFilter:false,name:"deviceExternalId",title:"Device External ID",order:2,isHide:false},
        { id: 2, isFilter: false, hideFilter: false, name: "deviceName", title: "Device Name", order: 2, isHide: false },
        { id: 3, isFilter: false, hideFilter: false, name: "placeOfInstallation", title: "Place Of Installation", order: 3, isHide: false },
        { id: 4, isFilter: false, hideFilter: false, name: "cityOfInstallation", title: "City", order: 4, isHide: false },
        { id: 5, isFilter: false, hideFilter: false, name: "deviceDescription", title: "Device Description", order: 5, isHide: false },
        { id: 6, isFilter: false, hideFilter: false, name: "deviceSerialNo", title: "Device Serial No", order: 6, isHide: true },
        { id: 7, isFilter: false, hideFilter: false, name: "dateOfInstallation", title: "Date Of Installation", order: 7, isHide: true },
        { id: 8, isFilter: false, hideFilter: false, name: "versionNo", title: "Version No", order: 8, isHide: true },
        // {id:8,isFilter:false,hideFilter:false,name:"placeOfInstallation",title:"Place Of Installation",order:8,isHide:true},
        { id: 9, isFilter: false, hideFilter: false, name: "timeZone", title: "Time Zone", order: 9, isHide: true },
        { id: 10, isFilter: false, hideFilter: false, name: "dataFormatTypeId", title: "Data Format Type ", order: 10, isHide: true },
        { id: 11, isFilter: false, hideFilter: false, name: "deviceTopicIn", title: "Device Topic In", order: 11, isHide: true },
        { id: 12, isFilter: false, hideFilter: false, name: "deviceTypeId", title: "Device Type ", order: 12, isHide: true },
        { id: 13, isFilter: false, hideFilter: false, name: "deviceTopicOut", title: "Device Topic Out", order: 13, isHide: true },
        { id: 14, isFilter: false, hideFilter: false, name: "customerId", title: "Customer ", order: 14, isHide: true },
        { id: 15, isFilter: false, hideFilter: false, name: "email", title: "Email", order: 15, isHide: true },
        { id: 16, isFilter: false, hideFilter: false, name: "useDeviceTime", slidetogglekey: true, title: "Use Device Time", order: 16, isHide: true },
        { id: 17, isFilter: false, hideFilter: false, name: "isActive", isActiveKey: true, title: "Status", order: 17, isHide: false },
        { id: 18, isFilter: false, hideFilter: false, name: "isGateway", slidetogglekey: true, title: "IsGateway", order: 18, isHide: true },
        { id: 19, isFilter: false, hideFilter: false, name: "isLatLong", slidetogglekey: true, title: "IsLatLong", order: 19, isHide: true },
    
      ];
    
      this.TableHeader = this.deviceHeader.filter(x => (!x.isHide));
    }
  }


  loaddata() {
    this.emptydata = false;
    this.showDevice = true;
    this._dashboardservice.getAllDeviceData(this.rmsAct.customerId).subscribe((data:DeviceResponse) => {
      console.log(data, "device model data checking");
      if (data == null || data == undefined) {
        console.log("no records found");
        this.emptydata = true;  
      }
      this.showDevice = false;
      this.devicedata = data["deviceModels"];
      this.AllDeviceIds = data["allDeviceIds"];


      console.log(this.devicedata, "device data checking")

      this.getPaginationConfig();
    },error => {
      console.error(error);
      this.showDevice = false;
       this.toastr.error(error?.errorMessage)
    },
    () => console.log('COMPLETE')

    )

    console.log("inactive data call");
    this._dashboardservice.getInactiveDeviceDataApi(this.rmsAct.customerId).subscribe(data => {
      console.log(data, "inactive data on upload");
      this._dashboardservice.inactiveDeviceData = data;
    },
    error => {
      console.error(error);
       this.showDevice = false;
       this.toastr.error(error?.errorMessage)
    },
    () => console.log('COMPLETE')

    )

  }
  async getPaginationConfig() {
    this.paginationShow = true;
    this.config = {
      id: "deviceCustom",
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.devicedata?.length
    };

  }

  pageChanged(event) {
    this.config.currentPage = event;
  }


  itemsperpage(value) {
    this.config.currentPage = 1;
    console.log(value, "value checking");
    this.config.itemsPerPage = value;
  }
  //export to csv
  exportTo(format: string): void {
    const rows: any[] = [];
    const columns: any[] = [];

    for (let i = 0; i < this.devicedata?.length;i++) {
      console.log(this.devicedata[i],"device dfata checking")
      rows.push(this.devicedata[i]);
    console.log(rows,"rows checking")
  }
  for(let j = 0; j < this.deviceHeader?.length;j++){
    columns.push({ name: this.deviceHeader[j]["title"], field: this.deviceHeader[j]["name"]})
  }
  console.log(rows,columns,"rows,columns checking")
    const options: ExportOptions = {
      columns: columns,
      rows: rows,
      fileName: 'Device-data',
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
  //add,edit,details and delete device code start
  AddNewDevice() {

    let dialogRef = this.dialog.open(DeviceInfoDialog,
      {
        width: '1000px',
        height: '475px',

      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result?.event == "addDevice") {
        this.loaddata();
      }
      else {

      }
    });


  }

  deviceDetailspopup(item) {
    this.dialog.open(DeviceDetailsComponent,
      {
        width: '1000px',
        height: '475px',
        panelClass: 'custom-device-class',
        data: [item, this.deviceHeader]

      });
  }

  deviceEditpopup(item) {
    let dialogRef = this.dialog.open(DeviceEditComponent,
      {
        width: '1000px',
        height: '475px',
        panelClass: 'custom-device-class',
        data: [item, this.deviceHeader]
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result?.event == "editDevice") {
        this.loaddata();
      }
      else {

      }

    });
  }
  deviceDeletepopup(item, i, header) {
    console.log(item, header, "signal check")
    let dialogRef = this.dialog.open(DeviceDeletePopup,
      {
        width: '400px',
        data: [this.devicedata, item, i, header]

      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result?.event == "deleteDevice") {
        this.loaddata();
      }
      else {
      }
    });
  }


  CloneDevice(item) {
    let oldDeviceId = item.deviceId;
    let customerId = item.customerId;
    let existingDeviceCount = this.devicedata.length;
    let deviceType = item.deviceTypeId;
    let InstallationPlace = item.placeOfInstallation;
    let City = item.cityOfInstallation;
    let devicenme=item.deviceName;
    let devicedesc=item.deviceDescription;

    let dialogRef = this.dialog.open(DeviceClonePopup,
      {
        width: '550px',
        panelClass: 'custom-device-class',
        data: [oldDeviceId, customerId, existingDeviceCount, deviceType, this.AllDeviceIds, InstallationPlace, City,devicenme,devicedesc]
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result?.event == "cloned") {
        this.loaddata();
      }
    });
  }
}

@Component({
  selector: 'DeviceInfo-Dialog',
  templateUrl: 'DeviceInfo-Dialog.html',
  styleUrls: ['./DeviceInfo-Dialog.scss'],
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
export class DeviceInfoDialog {
  selectLabData = ['PLC',
  '  IPC',
  '  Hydraulic',
  '  Robotic'
  ]; 
  timezoneData;
  DataFormatTypeIdData;
  deviceTypeIdData;
  customerIdData;
  filteredCustomerId;
  useDeviceTimeSlideToggle = true;
  isActiveSlideToggle = true;
  isGatewayToggle = false;
  isLatLongToggle = false;
  rmsAct: any;
  mainPlaceholder;
placeholderData={
  deviceId: "Device ID",
  deviceName: "Device name",
  deviceDescription: "Device Description",
  deviceSerialNo: "Device serial no",
  dateOfInstallation: "Date of installation",
  versionNo: "Version no",
  placeOfInstallation: "Place of installation",
  cityOfInstallation: "City",
  timeZone: "Time zone",
  dataFormatTypeId: "Data format type",
  deviceTopicIn: "Device topic in",
  deviceTypeId: "Device type ",
  deviceTopicOut: "Device topic out",
  email: "Email",
  useDeviceTime: "Use device time",
  isGateway: "isGateway",
  isLatLong: "IsLatLong"
}
placeholderDataHydac={
  deviceId: "Asset Id",
  deviceName: "Asset Name",
  deviceDescription: "Product Name",
  deviceSerialNo: "Manufacturer Part No",
  dateOfInstallation: "Purchase Date",
  versionNo: "Purchase Vendor",
  deviceTopicIn: "Product Manufacturer Name",
  deviceTopicOut: "Date Of Comissioning",
  cityOfInstallation: "AMC Date",
  deviceTypeId: "Category Name",

  placeOfInstallation: "Price",
  timeZone: "Time zone",
  dataFormatTypeId: "Data format type",
  email: "Email",
  useDeviceTime: "Use device time",
  isGateway: "isGateway",
  isLatLong: "IsLatLong"
}
  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<DeviceInfoDialog>, dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any,
    private _adapter: DateAdapter<any>, private _dashboardservice: DashboardService, private route: Router, private toastr: ToastrService) {

    this._adapter.setLocale('your locale');

  }
  show: boolean = true;

  ngOnInit(): void {
    let accountObject = sessionStorage.getItem('rmsAccount');
    this.rmsAct = JSON.parse(accountObject);
    console.log(this.rmsAct,"this.rmsAct checking");
    if(this.rmsAct?.customerId == 11){
      this.mainPlaceholder = this.placeholderDataHydac;
    
    }else{
      this.mainPlaceholder = this.placeholderData;
    }
    this.addSignalFormVal();
    this.getTimezoneData();
  }

  getTimezoneData() {
    this.show = true;
    this._dashboardservice.getTimeZoneApi().subscribe(
      (data) => {

        // this.customerIdData = data?.customers;
        this.DataFormatTypeIdData = data?.deviceDataFormatTypes;
        console.log(this.DataFormatTypeIdData,"dropdown c")
        this.deviceTypeIdData = data?.deviceTypes;
        this.timezoneData = data?.timeZones;
        this.show = false;
      },
      error => {
        this.show = false;
        console.error(error);
        this.toastr.error(error?.errorMessage);
      },
      () => console.log('COMPLETE')
    )
    // this.filteredCustomerId = this.customerId.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => typeof value === 'string' ? value : value.Customer),
    //     map(Customer => Customer ? this._filterCustomerId(Customer) : this.customerIdData?.slice())
    //   );
  }
  // displayFn(user) {
  //   return user && user.customerName ? user.customerName : '';
  // }
  // private _filterCustomerId(name: any) {
  //   const filterValue = name.toLowerCase();
  //   return this.customerIdData.filter(option => option.customerName.toLowerCase().includes(filterValue));
  // }
  addSignalForm: FormGroup;
  maxLength = 5;
  titleAlert: string = 'This field is required';
  getMaxlength(val) {
    return val;
  }
  addSignalFormVal() {
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.addSignalForm = this.formBuilder.group({
      'deviceId': [null, Validators.required],
      'deviceName': [null, Validators.required],
      'deviceDescription': [null],
      'deviceSerialNo': [null],
      'dateOfInstallation': [null, Validators.required],
      'versionNo': [null],
      'placeOfInstallation': [null],
      'cityOfInstallation': [null],
      'timeZone': [null],
      'dataFormatTypeId': [null, Validators.required],
      'deviceTopicIn': [null, Validators.required],
      'deviceTypeId': [null, Validators.required],
      'deviceTopicOut': [null, Validators.required],
      'customerId': [null],
      'email': [null, [Validators.pattern(emailregex)]],
      'useDeviceTime': [null, Validators.required],
      'isActive': [false],
      'isGateway': [null, Validators.required],
      'isLatLong': [null, Validators.required],

    });

    if(this.rmsAct?.customerId == 11) {
      this.addSignalForm.get('isLatLong').clearValidators();
      this.addSignalForm.get('isGateway').clearValidators();
      this.addSignalForm.get('useDeviceTime').clearValidators();
      this.addSignalForm.get('email').clearValidators();
    
      this.addSignalForm.get('deviceTopicOut').clearValidators();
      this.addSignalForm.get('deviceTypeId').clearValidators();
      this.addSignalForm.get('deviceTopicIn').clearValidators();
      this.addSignalForm.get('dataFormatTypeId').clearValidators();
     
     
      this.addSignalForm.get('dateOfInstallation').clearValidators();
      this.addSignalForm.get('deviceName').clearValidators();
     
    } else {
     
    }

  }

  getErrorEmail() {
    return this.addSignalForm.get('email').hasError('required') ? 'Email field is required' :
      this.addSignalForm.get('email').hasError('pattern') ? 'Not a valid email address' :
        this.addSignalForm.get('email').hasError('alreadyInUse') ? 'This email address is already in use' : '';
  }
  get email() {
    return this.addSignalForm.get('email') as FormControl
  }
  get deviceId() {
    return this.addSignalForm.get('deviceId') as FormControl
  }
  get deviceName() {
    return this.addSignalForm.get('deviceName') as FormControl
  }
  get dateOfInstallation() {
    return this.addSignalForm.get('dateOfInstallation') as FormControl
  }
  get useDeviceTime() {
    return this.addSignalForm.get('useDeviceTime') as FormControl
  }
  get dataFormatTypeId() {
    return this.addSignalForm.get('dataFormatTypeId') as FormControl
  }
  get isActive() {
    return this.addSignalForm.get('isActive') as FormControl
  }
  get deviceTopicIn() {
    return this.addSignalForm.get('deviceTopicIn') as FormControl
  }
  get deviceTypeId() {
    return this.addSignalForm.get('deviceTypeId') as FormControl
  }
  get isGateway() {
    return this.addSignalForm.get('isGateway') as FormControl
  }
  get deviceTopicOut() {
    return this.addSignalForm.get('deviceTopicOut') as FormControl
  }
  // get customerId() {
  //   return this.addSignalForm.get('customerId') as FormControl
  // }
  get isLatLong() {
    return this.addSignalForm.get('isLatLong') as FormControl
  }

  deviceIdModal = "";
  deviceNameModel = "";
  dateOfInstallationModel = "";
  deviceTopicInModel = "";
  deviceTopicOutModel = "";
  customerIdModel = "";
  dateofInstall;
  customerIdval;
  devicedata;
  commDate;
  amcdate;
  fromDateChange(ev) {
    this.dateofInstall = ev;
  }
  fromDateChangeComm(ev) {
    console.log(ev,"ev ")
   this.commDate = ev;
  }
  fromDateChangeAmc(ev) {
    this.amcdate = ev;
  }
  // getcustomerOptionData(option) {
  //   this.customerIdval = option.customerId;
  // }
  onSubmit() {

  }
  addSignal() {
    if(this.rmsAct?.customerId == 11) {
      // for(let i=0; i < this.DataFormatTypeIdData?.length;i++){
      //   if(this.DataFormatTypeIdData[i]?.dataFormatTypeName == "Signal Type"){
      //     this.addSignalForm.value.dataFormatTypeId = this.DataFormatTypeIdData[i]?.dataFormatTypeId;
      //   }
      // }
      this.addSignalForm.value.dateOfInstallation = this.dateofInstall;
      this.addSignalForm.value.deviceTopicOut =  this.commDate;
      this.addSignalForm.value.cityOfInstallation = this.amcdate;
      this.addSignalForm.value.customerId = this.rmsAct?.customerId;
    }else{
    this.addSignalForm.value.dateOfInstallation = this.dateofInstall;
    this.addSignalForm.value.customerId = this.rmsAct?.customerId;
    
    }
    console.log(this.addSignalForm.value, "add device popup checking")
    JSON.stringify(this.addSignalForm.value)
    this._dashboardservice.addDevice(this.addSignalForm.value).subscribe(
      data => {
        console.log(data);
        this.dialogRef.close({ event: 'addDevice' });
        if(this.rmsAct?.customerId == 11) {
        this.showSuccess("asset added sucessfully")
        }else{
          this.showSuccess("device added sucessfully")
        }
      },
      error => {
        this.dialogRef.close({ event: '' });
        this.route.navigate(['dashboard/device'])
        console.log(error);
        if(this.rmsAct?.customerId == 11) {
        this.showError("asset is not added")
        }else{
          this.showError("device is not added")
        }
      },
      () => console.log('COMPLETE')
    )
  }

  showSuccess(message) {
    this.toastr.success(message);
  }

  showError(message: string) {
    this.toastr.error(message);
  }

}


//device details popup start here
@Component({
  selector: 'elpis-rms-device-details',
  templateUrl: './device-detailscomponent.html',
  styleUrls: ['./DeviceInfo-Dialog.scss']
})
export class DeviceDetailsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeviceDetailsComponent>,  private toastr: ToastrService,
    dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any,
    private _dashboardservice: DashboardService) { }
  headerdata;
  tabledata;
  timezoneData;
  DataFormatTypeIdData;
  deviceTypeIdData;
  customerIdData;
  show: boolean;
  ngOnInit(): void {
    console.log(this.data, "details data checking")
    this.headerdata = this.data[1];
    this.tabledata = this.data[0];
    this.getTimezoneData()
  }

  getTimezoneData() {
    this.show = true;
    this._dashboardservice.getTimeZoneApi().subscribe(
      (data) => {
        this.customerIdData = data?.customers;
        this.DataFormatTypeIdData = data?.deviceDataFormatTypes;
        this.deviceTypeIdData = data?.deviceTypes;
        // setTimeout(()=>{
        let dataFormatType;
        this.DataFormatTypeIdData.find(item => {
          if (item.dataFormatTypeId == this.tabledata?.dataFormatTypeId) {
            this.tabledata.dataFormatTypeId = item?.dataFormatTypeName;

          }
          else {
            return ""
          }
        });
        // this.addSignalForm.get('dataFormatTypeId').setValue(dataFormatType);
        // },600)
        // setTimeout(()=>{
        let deviceTypeId;
        this.deviceTypeIdData.find(item => {
          if (item.deviceTypeId == this.tabledata?.deviceTypeId) {
            console.log(item, "device type id checking")
            this.tabledata.deviceTypeId = item?.deviceTypeName;
          } else {
            return "";
          }
        });
        // this.addSignalForm.get('deviceTypeId').setValue(deviceTypeId);
        // },600)

        // setTimeout(()=>{
        let customerId;
        this.customerIdData.find(item => {
          if (item.customerId == this.tabledata?.customerId) {
            console.log(item, "customer checking")
            this.tabledata.customerId = item?.customerName;
          } else {
            return "";
          }
        });
        // this.addSignalForm.get('customerId').setValue(customerId);
        // },600)
        this.show = false;


      },
      error => {
        this.show = false;
        console.error(error);
        this.toastr.error(error?.errorMessage);
      },
      () => console.log('COMPLETE')
    )



  }

}


//device details popup end here

//device edit popup start here

@Component({
  selector: 'elpis-rms-device-edit',
  templateUrl: './device-edit-component.html',
  styleUrls: ['./DeviceInfo-Dialog.scss'],
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
export class DeviceEditComponent implements OnInit {
  selectLabData = ['PLC',
  '  IPC',
  '  Hydraulic',
  '  Robotic'
  ]; 
  headerdata;
  tabledata;
  show: boolean = true;
  timezoneData;
  DataFormatTypeIdData;
  deviceTypeIdData;
  customerIdData;
  filteredCustomerId;
  useDeviceTimeSlideToggle = true;
  isActiveSlideToggle = true;
  isGatewayToggle = false;
  isLatLongToggle = false;
  rmsAct: any;
  mainPlaceholder;
  placeholderData={
    deviceId: "Device ID",
    deviceName: "Device name",
    deviceDescription: "Device Description",
    deviceSerialNo: "Device serial no",
    dateOfInstallation: "Date of installation",
    versionNo: "Version no",
    placeOfInstallation: "Place of installation",
    cityOfInstallation: "City",
    timeZone: "Time zone",
    dataFormatTypeId: "Data format type",
    deviceTopicIn: "Device topic in",
    deviceTypeId: "Device type ",
    deviceTopicOut: "Device topic out",
    email: "Email",
    useDeviceTime: "Use device time",
    isGateway: "isGateway",
    isLatLong: "IsLatLong",
    isUsed:"isUsed"
  }
  placeholderDataHydac={
    deviceId: "Asset Id",
    deviceName: "Asset Name",
    deviceDescription: "Product Name",
    deviceSerialNo: "Manufacturer Part No",
    dateOfInstallation: "Purchase Date",
    versionNo: "Purchase Vendor",
    deviceTopicIn: "Product Manufacturer Name",
    deviceTopicOut: "Date Of Comissioning",
    cityOfInstallation: "AMC Date",
    deviceTypeId: "Category Name",
  
    placeOfInstallation: "Price",
    timeZone: "Time zone",
    dataFormatTypeId: "Data format type",
    email: "Email",
    useDeviceTime: "Use device time",
    isGateway: "isGateway",
    isLatLong: "IsLatLong",
    isUsed:"isUsed"
  
  
  }

  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<DeviceEditComponent>,
    dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any,
    private _adapter: DateAdapter<any>, private _dashboardservice: DashboardService, private route: Router,
    private toastr: ToastrService) {
    this._adapter.setLocale('your locale');
  }

  ngOnInit(): void {
    let accountObject = sessionStorage.getItem('rmsAccount');
    this.rmsAct = JSON.parse(accountObject);
    if(this.rmsAct?.customerId == 11){
      this.mainPlaceholder = this.placeholderDataHydac;
    
    }else{
      this.mainPlaceholder = this.placeholderData;
    }  
    console.log(this.rmsAct,"this.rmsAct checking");
    console.log(this.data,"edit data checking")
    this.headerdata = this.data[1];
    this.tabledata = this.data[0];
    this.getTimezoneData();
    this.addSignalFormVal();
    

  }
  getTimezoneData() {
    this.show = true;
    this._dashboardservice.getTimeZoneApi().subscribe(
      (data) => {
        // this.customerIdData = data?.customers;
        console.log(data,"edit device drop data checking")
        this.DataFormatTypeIdData = data?.deviceDataFormatTypes;
        this.deviceTypeIdData = data?.deviceTypes;
        this.timezoneData = data?.timeZones;
        // setTimeout(()=>{
        let timeZone = this.timezoneData?.find(item => item.timeZone == this.tabledata?.timeZone);
        this.addSignalForm.get('timeZone').setValue(timeZone);
        // },200)
        // setTimeout(()=>{
        let dataFormatType;
        this.DataFormatTypeIdData.find(item => {
          if (item.dataFormatTypeId == this.tabledata?.dataFormatTypeId) {
            dataFormatType = item;
            console.log(dataFormatType, "dataFormatTypeID INLINE checking");
          }
          else {
            return ""
          }
        });
        this.addSignalForm.get('dataFormatTypeId').setValue(dataFormatType);
        // },600)
        // setTimeout(()=>{
        let deviceTypeId;
        this.deviceTypeIdData.find(item => {
          if (item.deviceTypeId == this.tabledata?.deviceTypeId) {
            deviceTypeId = item;
          } else {
            return "";
          }
        });
        this.addSignalForm.get('deviceTypeId').setValue(deviceTypeId);
        // },600)

        // setTimeout(()=>{
        // let customerId;
        // this.customerIdData.find(item => {
        //   if (item.customerId == this.tabledata?.customerId) {
        //     customerId = item?.customerName;
        //   } else {
        //     return "";
        //   }
        // });
        // this.addSignalForm.get('customerId').setValue(customerId);
        // },600)
        this.show = false;
        this.setEditdetails();

      },
      error => {
        this.show = false;
        console.error(error);
        this.toastr.error(error?.errorMessage);
      },
      () => console.log('COMPLETE')
    )

    // this.filteredCustomerId = this.customerId.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => typeof value === 'string' ? value : value.Customer),
    //     map(Customer => Customer ? this._filterCustomerId(Customer) : this.customerIdData?.slice())
    //   );
  }

  // displayFn(user) {
  //   return user && user.customerName ? user.customerName : '';
  // }

  // private _filterCustomerId(name: any) {
  //   if (typeof name === 'string') {
  //     const filterValue = name.toLowerCase();
  //     return this.customerIdData.filter(option => option.customerName.toLowerCase().includes(filterValue));
  //   }
  // }

  addSignalForm: FormGroup;
  maxLength = 5;
  titleAlert: string = 'This field is required';
  getMaxlength(val) {
    return val;
  }
  addSignalFormVal() {
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.addSignalForm = this.formBuilder.group({
      'deviceId': [null, Validators.required],
      'deviceName': [null, Validators.required],
      'deviceDescription': [null],
      'deviceSerialNo': [null],
      'dateOfInstallation': [null, Validators.required],
      'versionNo': [null],
      'placeOfInstallation': [null],
      'cityOfInstallation': [null],
      'timeZone': [null],
      'dataFormatTypeId': [null, Validators.required],
      'deviceTopicIn': [null, Validators.required],
      'deviceTypeId': [null, Validators.required],
      'deviceTopicOut': [null, Validators.required],
      'customerId': [null],
      'email': [null, [Validators.pattern(emailregex)]],
      'useDeviceTime': [null, Validators.required],
      'isActive': [false],
      'isGateway': [null, Validators.required],
      'isLatLong': [null, Validators.required],
      'isUsed':[false],

    });
    if(this.rmsAct?.customerId == 11) {
      this.addSignalForm.get('isLatLong').clearValidators();
      this.addSignalForm.get('isGateway').clearValidators();
      this.addSignalForm.get('useDeviceTime').clearValidators();
      this.addSignalForm.get('email').clearValidators();
    
      this.addSignalForm.get('deviceTopicOut').clearValidators();
      this.addSignalForm.get('deviceTypeId').clearValidators();
      this.addSignalForm.get('deviceTopicIn').clearValidators();
      this.addSignalForm.get('dataFormatTypeId').clearValidators();
     
     
      this.addSignalForm.get('dateOfInstallation').clearValidators();
      this.addSignalForm.get('deviceName').clearValidators();
     
    } else {
     
    }

  }

  getErrorEmail() {
    return this.addSignalForm.get('email').hasError('required') ? 'Email field is required' :
      this.addSignalForm.get('email').hasError('pattern') ? 'Not a valid email address' :
        this.addSignalForm.get('email').hasError('alreadyInUse') ? 'This email address is already in use' : '';
  }
  get email() {
    return this.addSignalForm.get('email') as FormControl
  }
  get deviceId() {
    return this.addSignalForm.get('deviceId') as FormControl
  }
  get deviceName() {
    return this.addSignalForm.get('deviceName') as FormControl
  }
  get dateOfInstallation() {
    return this.addSignalForm.get('dateOfInstallation') as FormControl
  }
  get useDeviceTime() {
    return this.addSignalForm.get('useDeviceTime') as FormControl
  }
  get dataFormatTypeId() {
    return this.addSignalForm.get('dataFormatTypeId') as FormControl
  }
  get isActive() {
    return this.addSignalForm.get('isActive') as FormControl
  }
  get deviceTopicIn() {
    return this.addSignalForm.get('deviceTopicIn') as FormControl
  }
  get deviceTypeId() {
    return this.addSignalForm.get('deviceTypeId') as FormControl
  }
  get isGateway() {
    return this.addSignalForm.get('isGateway') as FormControl
  }
  get deviceTopicOut() {
    return this.addSignalForm.get('deviceTopicOut') as FormControl
  }
  // get customerId() {
  //   return this.addSignalForm.get('customerId') as FormControl
  // }
  get isLatLong() {
    return this.addSignalForm.get('isLatLong') as FormControl
  }

  deviceIdModal = "";
  deviceNameModel = "";
  dateOfInstallationModel = "";
  deviceTopicInModel = "";
  deviceTopicOutModel = "";
  customerIdModel = "";
  dateofInstall;
  customerIdval;
  devicedata;
  commDate;
  amcdate;
  fromDateChange(ev) {
    this.dateofInstall = ev;
  }
  fromDateChangeComm(ev) {
    console.log(ev,"ev ")
   this.commDate = ev;
  }
  fromDateChangeAmc(ev) {
    this.amcdate = ev;
  }
  // getcustomerOptionData(option) {
  //   this.customerIdval = option.customerId;
  // }
  onSubmit() {

  }
  showSuccess(message) {
    this.toastr.success(message);
  }

  showError(message: string) {
    this.toastr.error(message);
  }

  setEditdetails() {
    let dateofinstall = this.tabledata?.dateOfInstallation.split("T");

    this.addSignalForm.get("deviceId").setValue(this.tabledata?.deviceId);
    this.addSignalForm.get("deviceName").setValue(this.tabledata?.deviceName);
    this.addSignalForm.get("deviceDescription").setValue(this.tabledata?.deviceDescription);
    this.addSignalForm.get("deviceSerialNo").setValue(this.tabledata?.deviceSerialNo);
    this.addSignalForm.get("dateOfInstallation").setValue(dateofinstall[0]);
    this.addSignalForm.get("versionNo").setValue(this.tabledata?.versionNo);
    this.addSignalForm.get("placeOfInstallation").setValue(this.tabledata?.placeOfInstallation);
    this.addSignalForm.get("cityOfInstallation").setValue(this.tabledata?.cityOfInstallation);
    this.addSignalForm.get("deviceTopicIn").setValue(this.tabledata?.deviceTopicIn);
    this.addSignalForm.get("deviceTopicOut").setValue(this.tabledata?.deviceTopicOut);
    this.addSignalForm.get("email").setValue(this.tabledata?.email);
    this.addSignalForm.get("useDeviceTime").setValue(this.tabledata?.useDeviceTime);
    this.addSignalForm.get("isActive").setValue(this.tabledata?.isActive);
    this.addSignalForm.get("isGateway").setValue(this.tabledata?.isGateway);
    this.addSignalForm.get("isLatLong").setValue(this.tabledata?.isLatLong);
    this.addSignalForm.get("isUsed").setValue(this.tabledata?.isUsed);


  }

  addSignal() {
    if(this.rmsAct?.customerId == 11) {
      this.addSignalForm.value.dateOfInstallation = this.dateofInstall;
      this.addSignalForm.value.deviceTopicOut =  this.commDate;
      this.addSignalForm.value.cityOfInstallation = this.amcdate;
    
    }
    // let customerid;
    // this.customerIdData.find(item => {
    //   if (item.customerName == this.addSignalForm.value.customerId) {
    //     customerid = item?.customerId;
     
    //     console.log(customerid, "customerId register checxking")
    //   } else {
    //     return "";
    //   }
    // });
    this.addSignalForm.get('customerId').setValue(this.rmsAct?.customerId);
    this.addSignalForm.get('dataFormatTypeId').setValue(this.addSignalForm.value.dataFormatTypeId?.dataFormatTypeId);
    this.addSignalForm.get('deviceTypeId').setValue(this.addSignalForm.value.deviceTypeId?.deviceTypeId);
    this.addSignalForm.get('timeZone').setValue(this.addSignalForm.value.timeZone?.timeZone);
    this.addSignalForm.get('email').setValue(this.addSignalForm.value.email ? this.addSignalForm.value.email : null);
    
    JSON.stringify(this.addSignalForm.value)
    this._dashboardservice.editDevice(this.tabledata?.deviceId, this.addSignalForm.value).subscribe(
      data => {
        console.log(data, "after registered api data checking");
        this.dialogRef.close({ event: 'editDevice' });
        this.showSuccess("Device edit  sucessfully")
      },
      error => {
        this.dialogRef.close({ event: '' });
        this.route.navigate(['dashboard/device'])
        console.error(error.error.errorMessage);
        this.showError("Device changes are not added")
      },
      () => console.log('COMPLETE')
    )

  }

}
//device edit popup end here

//device delete popup start here

@Component({
  selector: 'elpis-rms-device-delete',
  templateUrl: './device-delete-component.html',
  styleUrls: ['./DeviceInfo-Dialog.scss']
})
export class DeviceDeletePopup implements OnInit {
  constructor(public dialogRef: MatDialogRef<DeviceDeletePopup>, private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any,
    private _dashboardservice: DashboardService, private toastr: ToastrService,private router: Router,private route:ActivatedRoute,
    @Inject(DOCUMENT) private document: Document ) { }
  headerdata;
  currentdata;
  tabledata;
  index;
 
  ngOnInit(): void {
    this.currentdata = this.data[1];
    this.index = this.data[2];
    this.tabledata = this.data[0]
    console.log(this.data, "popup data checking")
  }
  deleteDevice() {
    this._dashboardservice.deleteDeviceId(this.currentdata?.deviceId,true).subscribe(
      data => {
        console.log(data, "after registered api data checking");
        this.dialogRef.close({ event: 'deleteDevice' });
        this.showSuccess("Device deleted  sucessfully")
      },
      error => {
        console.error(error);
        this.dialogRef.close({ event: 'deleteDevice' });
        if(error?.errorCode == 400 && error?.errorMessage == this._dashboardservice?.errorMsg?.deviceMsg){
         
          let dialogRef = this.dialog.open(DeviceSignalsDeletePopup,
            {
              width: '500px',
              // width: '1000px',
              // height: '500px',
              data:[error,this.currentdata?.deviceId]
      
            });
      
          dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: result`);
            if (result?.event == "deleteSignalsDevice") {
           
              this.router.navigate(['dashboard/device'])
              .then(() => {
              window.location.reload();
              });
            }
            else {
      
            }
          });
        }else{
        this.dialogRef.close({ event: '' });
        // this.showError("Opps! Device delete failed ") 
        }
      },
      () => console.log('COMPLETE')
    )

  }
  showSuccess(message) {
    this.toastr.success(message);
  }

  showError(message: string) {
    this.toastr.error(message);
  }
}
@Component({
  selector: 'elpis-rms-device-signals-delete',
  templateUrl: './device-signals-delete-component.html',
  styleUrls: ['./DeviceInfo-Dialog.scss']
})
export class DeviceSignalsDeletePopup implements OnInit {
  constructor(public dialogRef: MatDialogRef<DeviceSignalsDeletePopup>, dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any,
  private _dashboardservice: DashboardService, private toastr: ToastrService,private route: Router) { }
  currData;
  ngOnInit(): void {
      console.log(this.data,"error msg")
      this.currData = this.data[0];
  }
  deleteDevice(){
    this.dialogRef.close({ event: 'deleteSignalsDevice' });
    this._dashboardservice.deleteDeviceId(this.data[1],false).subscribe(
      data => {
        console.log(data, "after registered api data checking");
        this.dialogRef.close({ event: 'deleteSignalsDevice' });
        
      },
      error => {
        console.error(error);
         this.toastr.error(error?.errorMessage)
      },
      () => console.log('COMPLETE')
    )
  }
}
@Component({
  selector: 'elpis-rms-device-clone',
  templateUrl: './device-clone-component.html',
  styleUrls: ['./DeviceInfo-Dialog.scss']
})

export class DeviceClonePopup implements OnInit {
  constructor(public dialogRef: MatDialogRef<DeviceClonePopup>, dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any,
    private _dashboardservice: DashboardService, private toastr: ToastrService, private formBuilder: FormBuilder, private Checkerror: ChangeDetectorRef) { }

  oldDeviceId: any;
  newDeviceId: any;
  customerId: any
  existingDeviceCount: any;
  deviceType: any;
  CloneModal: any;
  showloader: boolean;
  AllDeviceIdslists: any;
  CloneDeviceFormgroup: FormGroup;
  InstallationPlace: any;
  InstallationCity: any
  DeviceNameC:any;
  DeviceDescriptionC:any;
  ispresent:any;
  
  ngOnInit(): void {
    console.log("-----clone popup");
    this.cloneformvalidation();
    this.oldDeviceId = this.data[0];
    //  this.newDeviceId = this.CloneModal;
    this.customerId = this.data[1];
    this.existingDeviceCount = this.data[2];
    this.deviceType = this.data[3];
    this.AllDeviceIdslists = this.data[4];
    this.InstallationPlace = this.data[5];
    this.InstallationCity = this.data[6];
    this.DeviceNameC=this.data[7];
    this.DeviceDescriptionC=this.data[8];
    console.log(this.data);
    
  }

  ngAfterContentChecked(): void {
    this.Checkerror.detectChanges();
  }

  /////////////// validate device id and check with the existing device id///////////////////////
  valuechange(newValue) {
    this.ispresent=newValue;
    if (newValue) {
      for (var i = 0, len = this.AllDeviceIdslists.length; i < len; i++) {
        if (this.AllDeviceIdslists[i] === newValue) {
          console.log('already present Loop is going to break.');
          this.CloneDeviceFormgroup.controls["NewDeviceIdFormgroup"].setErrors({ 'incorrect': true });
          this.CloneDeviceFormgroup.controls["NewDeviceIdFormgroup"].markAllAsTouched();
          break;
        }
        else {
          this.CloneDeviceFormgroup.controls["NewDeviceIdFormgroup"].setErrors(null);
          this.CloneDeviceFormgroup.controls["NewDeviceIdFormgroup"].markAllAsTouched();
        }
      }
    }   
  }

  cloneformvalidation() {
    this.CloneDeviceFormgroup = this.formBuilder.group({
      'NewDeviceIdFormgroup': ['', Validators.required],
      'InstallationLocation': [null, Validators.required],
      'InstallationCityLocation': [null, Validators.required],
      'C_deviceName': [null, Validators.required],
      'C_devicedesc': [],

    });
  }
  /////////////////cloning of new devices with current device reference//////////////

  CloneDevice() {
    console.log(this.oldDeviceId, this.CloneModal, this.customerId, this.existingDeviceCount, this.deviceType);
    this.showloader = true;
    this._dashboardservice.CloneNewDevice({ "oldDeviceId": this.oldDeviceId, "newDeviceId": this.CloneModal, "customerId": this.customerId, "existingDeviceCount": this.existingDeviceCount, "deviceType": this.deviceType,"placeOfInstallation": this.InstallationPlace ,"cityOfInstallation": this.InstallationCity,"deviceName":this.DeviceNameC,"deviceDescription":this.DeviceDescriptionC}).subscribe(
      data => {
        console.log(data, "aftering cloning new device");
        this.dialogRef.close({ event: 'cloned' });
        this.showSuccess("cloned  sucessfully");
        this.showloader = false;
      },
      error => {
        console.error(error);
        this.dialogRef.close({ event: '' });
        this.showError("Opps! cloning failed ")
        this.showloader = false;
      },
      () => console.log('COMPLETE')
    )

  }
  showSuccess(message) {
    this.toastr.success(message);
  }

  showError(message: string) {
    this.toastr.error(message);
  }
}
//device delete popup end here device-clone-component.html