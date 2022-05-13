import { Component, OnInit, Inject,ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit   } from '@angular/core';

import {MatDialog,MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../rms-services';
import { ToastrService } from 'ngx-toastr';
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
import { SignalModel } from '../../rms-interfaces/dashboard/dashboard-view/signalmodel';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'elpis-rms-signal',
  templateUrl: './signal.component.html',
  styleUrls: ['./signal.component.scss']
})
export class SignalComponent implements OnInit {
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
  constructor(private _dashboardservice:DashboardService,public dialog: MatDialog,  private toastr: ToastrService,
    private _Activatedroute:ActivatedRoute) { }

  

  Search: any = "";
  TableHeader=[];
  
  Header=[
    {id:1,isFilter:false,hideFilter:false,name:"signalId", key:"signalModel",signalModel:true,title:"Parameter ID",order:1,isHide:false},
    {id:2,isFilter:false,hideFilter:false,name:"signalName", key:"signalModel",signalModel:true,title:"Parameter Name",order:2,isHide:false},
    {id:3,isFilter:false,hideFilter:false,name:"signalDescription",key:"signalModel",signalModel:true,title:"Description",order:3,isHide:false},
    {id:4,isFilter:false,hideFilter:false,name:"signalStartRange",key:"signalModel",signalModel:true,title:"Start/Min Range",order:4,isHide:false},
    {id:5,isFilter:false,hideFilter:false,name:"signalEndRange",key:"signalModel",signalModel:true,title:"End/Max Range",order:5,isHide:false},
    {id:6,isFilter:false,hideFilter:false,name:"signalUnit",key:"signalModel",signalModel:true,title:"Unit",order:6,isHide:false},
    {id:7,isFilter:false,hideFilter:false,name:"signalModeId",key:"signalModel",signalModel:true, title:"Parameter Mode",order:7,isHide:true},
    {id:8,isFilter:false,hideFilter:false,name:"signalDataTypeId",key:"signalModel",signalModel:true,title:"Parameter data type",order:8,isHide:true},
    {id:9,isFilter:false,hideFilter:false,name:"dataDecimalPoint",key:"signalModel",signalModel:true,title:"Parameter data decimal point",order:9,isHide:true},
    {id:10,isFilter:false,hideFilter:false,name:"logOnlyNew",slidetogglekey:true, key:"signalModel", title:"LogOnlyNew",order:10,isHide:true},
    {id:11,isFilter:false,hideFilter:false,name:"defaultDisplayTypeId",key:"signalModel",signalModel:true,title:"Default display type",order:11,isHide:true},
    {id:12,isFilter:false,hideFilter:false,name:"multiplyFactor",key:"signalModel",signalModel:true,title:"Multiply Factor",order:12,isHide:true},
    {id:13,isFilter:false,hideFilter:false,name:"signalIconId", key:"signalModel", signalModel:true,title:"Parameter icon",order:13,isHide:true},
    {id:14,isFilter:false,hideFilter:false,name:"isLatLong",slidetogglekey:true,key:"signalModel",title:"IsLatLong",order:14,isHide:true},
    {id:15,isFilter:false,hideFilter:false,name:"sensorMin",key:"signalModel",signalModel:true,title:"Sensor Min",order:15,isHide:true},
    {id:16,isFilter:false,hideFilter:false,name:"sensorMax",key:"signalModel",signalModel:true,title:"Sensor Max",order:16,isHide:true},
    {id:17,isFilter:false,hideFilter:false,name:"isMappingCalculationDone",slidetogglekey:true,key:"signalModel",title:"Is mapping calculation done",order:17,isHide:true},
    // {id:17,isFilter:false,hideFilter:false,name:"signalThreshold", title:"Signal threshold",order:17,isHide:true},
    
    // {id:17,isFilter:false,hideFilter:false,name:"alertRequired",slidetogglekey:true,  key:"signalThresholdModels",title:"Aleart required",order:17,isHide:true},
    // {id:18,isFilter:false,hideFilter:false,name:"isEmail",slidetogglekey:true, key:"signalThresholdModels",title:"Email",order:18,isHide:true},
    // {id:19,isFilter:false,hideFilter:false,name:"isAudio",slidetogglekey:true, key:"signalThresholdModels",title:"Audio",order:19,isHide:true},
    // {id:20,isFilter:false,hideFilter:false,name:"isSms",slidetogglekey:true, key:"signalThresholdModels",title:"SMS",order:20,isHide:true},
  
    // {id:21,isFilter:false,hideFilter:false,name:"visualEffect", title:"Visual effect",order:21,isHide:true},
    // {id:21,isFilter:false,hideFilter:false,name:"signalDisplayType",key:"signalModel",title:"Signal display type",order:21,isHide:true},
   
    {id:18,isFilter:false,hideFilter:false,name:"noOfBitId",key:"signalModel",signalModel:true,title:"Number of bits",order:18,isHide:true},
    {id:19,isFilter:false,hideFilter:false,name:"plcAddress",key:"signalModel",signalModel:true,title:"PLC Address",order:19,isHide:true},   
    {id:20,isFilter:false,hideFilter:false,name:"plcAddressType",key:"signalModel",signalModel:true,title:"Address type",order:20,addressTypeKey:true,isHide:true},
    {id:21,isFilter:false,hideFilter:false,name:"bitId",key:"signalBitModel",bitPositionKey:true,title:"Bit position",order:21,isHide:true},
    {id:22,isFilter:false,hideFilter:false,name:"signalGroupId",key:"signalModel",signalModel:true,title:"Group type",order:22,isHide:true},
    {id:23,isFilter:false,hideFilter:false,name:"isDashboardTagged",slidetogglekey:true,key:"signalModel",title:"Is dashboard tagged",order:23,isHide:true},
    {id:24,isFilter:false,hideFilter:false,name:"isConnected",slidetogglekey:true,key:"signalModel",title:"isConnected",order:24,isHide:true},
    {id:25,isFilter:false,hideFilter:false,name:"signalType",key:"signalModel",signalModel:true,title:"Parameter type",order:25,isHide:true},
    {id:26,isFilter:false,hideFilter:false,name:"signalThresholdModels",signalThresholdModels:true,key:"signalThresholdModels",title:"ParameterThresholdModels",order:26,isHide:true},
    // {id:29,isFilter:false,hideFilter:false,name:"isAlertRange",slidetogglekey:true,key:"signalThresholdModels",title:"isAlertRange",order:29,isHide:true},
    // {id:30,isFilter:false,hideFilter:false,name:"thresholdValue",thresholdRange:true, key:"signalThresholdModels",title:"Threshold range",order:30,isHide:true},
   
    // {id:31,isFilter:false,hideFilter:false,name:"thresholdColor",thresholdRange:true, key:"signalThresholdModels",signalThresholdModels:true,title:"Threshold range",order:31 ,isHide:true},

  ]

  signalData = [];
  showSignal = true;
  rmsAct:any;
  p=1;
  customerIdVal;
  AddSignalShow:boolean = false;
  sub
  ngOnInit(): void {
    
    let accountObject = sessionStorage.getItem('rmsAccount');
    // let dummyPwd = sessionStorage.getItem('dummyPwd');
    // let selectedUser = sessionStorage.getItem('rmsSelectedUser');
    this.rmsAct = JSON.parse(accountObject);
    this.showSignal = true;
    this.sub=this._Activatedroute.paramMap.subscribe(params => { 
      console.log(params);
      if(params?.get('deviceId') != ""){
        console.log("from device obse")
        this.AddSignalShow = true;
        this.getSignalFromDevice();
      }else{
        console.log("from signal obser");
        this.AddSignalShow = false;
        this.getAllSignals();
      }
   }, 
    error => {
    console.error(error);
    this.showSignal = false;
     this.toastr.error(error?.errorMessage)
  },
  () => console.log('COMPLETE')
   );
    // if(this._Activatedroute.snapshot.paramMap.get("deviceId")) {
    //   console.log("coming from device");
    //   console.log('From Device screen ' + this._Activatedroute.snapshot.paramMap.get("deviceId"))

    //   const deviceidfromdevice=this._Activatedroute.snapshot.paramMap.get("deviceId");
    //   this.AddSignalSow = true;
    //   this.getSignalFromDevice();
    // }else{
    //   console.log("coming from signal");
    //   this.AddSignalSow = false;
    //   this.getAllSignals();
    // }
    
    this.TableHeader = this.Header.filter(x => (!x.isHide));
    console.log(this.Header,"orginal header checking")
    console.log(this.TableHeader,"copy header data checking")

    // this.getAllSignals();
  }
  ///////////////get all signals data////////////////////
  getAllSignals(){
    this.showSignal = true;
   
    this._dashboardservice.getSignalData(this.rmsAct.customerId).subscribe((data:SignalModel[]) => {
      console.log(data, "All Signal data");
      this.showSignal = false;
      this.signalData = data;
      
      console.log(this.signalData,"signal data checking")
      this.getPaginationConfig();
    },
    error => {
      console.error(error);
      this.showSignal = false;
       this.toastr.error(error?.errorMessage)
    },
    () => console.log('COMPLETE')
    )
  }
  /////////////////////get signals specific to deviceid/////////////
  getSignalFromDevice(){
    this.showSignal = true;
    console.log("*********");
    
   console.log(this._Activatedroute.snapshot.paramMap.get("deviceId"));
   
    this._dashboardservice.getDeviceSignaldata(this._Activatedroute.snapshot.paramMap.get("deviceId")).subscribe((data:SignalModel[]) => {
      console.log(data, "get signal from device");
      this.showSignal = false;
      this.signalData = data;
      
      console.log(this.signalData,"signal data checking")
      this.getPaginationConfig();
    },
    error => { 
      console.error(error);
      this.showSignal = false;
       this.toastr.error(error?.errorMessage)
    },
    () => console.log('COMPLETE')
    )
  }
  getPaginationConfig(){
    this.config ={
      id: 'signal',
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.signalData?.length
    };
  }
  pageChanged(event){
    this.config.currentPage = event;
  }


  itemsperpage(value) {
    this.config.currentPage = 1;
    console.log(value,"value checking");
    this.config.itemsPerPage = value;
  } 

  signalDetailsPopup(item,header){
    console.log(item,header,"signal check")
    this.dialog.open(SignalDetailsPopup,
        {
          width:'1000px',
         // height:'400px',
         panelClass: 'custom-device-class',
            data:[item,this.Header]
        });    
}

signalEditPopup(item,header){
 let dialogRef = this.dialog.open(SignalEditPopup,
      {
        width:'1000px',
        // height:'400px',
        panelClass: 'custom-device-class',
          data:[item,this.Header]
      });   
      
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result?.event}`); 
        if(result?.event == "editSignal"){
          // this.getAllSignals();
          if(this._Activatedroute.snapshot.paramMap.get("deviceId")) {
            console.log("coming from device");
            console.log('From Device screen ' + this._Activatedroute.snapshot.paramMap.get("deviceId"))
      
            const deviceidfromdevice=this._Activatedroute.snapshot.paramMap.get("deviceId");
            this.AddSignalShow = true;
            this.getSignalFromDevice();
          }else{
            console.log("coming from signal");
            this.AddSignalShow = false;
            this.getAllSignals();
          }
        }
        else{
    
        }
       
      });
}

signalDeletePopup(item,i,header){
      let dialogRef = this.dialog.open(SignalDeletePopup,
        {
          width:'400px',
          data:[item]
           
        }); 
    
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result?.event}`); 
          if(result?.event == "deleteSignal"){
            // this.getAllSignals();
            if(this._Activatedroute.snapshot.paramMap.get("deviceId")) {
              console.log("coming from device");
              console.log('From Device screen ' + this._Activatedroute.snapshot.paramMap.get("deviceId"))
        
              const deviceidfromdevice=this._Activatedroute.snapshot.paramMap.get("deviceId");
              this.AddSignalShow = true;
              this.getSignalFromDevice();
            }else{
              console.log("coming from signal");
              this.AddSignalShow = false;
              this.getAllSignals();
            }
          }
          else{
      
          }
        });
    
}
AddSignalPopup(){
  let dialogRef = this.dialog.open(AddSignalPopup,
    {
      width:'1000px',
      height:'500px',
      data:this._Activatedroute.snapshot.paramMap.get("deviceId")
       
    }); 
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result?.event}`); 
     
      if(result?.event == "addSignal"){
        // this.getAllSignals();
        if(this._Activatedroute.snapshot.paramMap.get("deviceId")) {
          console.log("coming from device");
          console.log('From Device screen ' + this._Activatedroute.snapshot.paramMap.get("deviceId"))
    
          const deviceidfromdevice=this._Activatedroute.snapshot.paramMap.get("deviceId");
          this.AddSignalShow = true;
          this.getSignalFromDevice();
        }else{
          console.log("coming from signal");
          this.AddSignalShow = false;
          this.getAllSignals();
        }
      }
      else{
  
      }
   
    });
}
  
}


//signal details popup start here

@Component({
  selector: 'signal-details-popup',
  templateUrl: './signal-details-popup.html',
  styleUrls: ['./signal.component.scss']
})

export class SignalDetailsPopup implements OnInit {
  noOfBitsData: any;
  signalDataTypesData: any;
  signalGroupsData: any;
  signalIconsData: any;
  signalModesData: any;
  defaultDisplayTypeData: any;
  addressTypeDropdown: any;
  constructor(private _dashboardservice:DashboardService, private toastr: ToastrService,
    public dialogRef: MatDialogRef<SignalDetailsPopup>, 
    dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: any) { }
  headerdata;
  tabledataPopup;
  tabledata;
  showSignal = true;
  signalThresholdModels = [];
  // signalThresholdModels= [
  //   {
  //     thresholdId: 0,
  //     thresholdValue: 0.0,
  //     thresholdColor: null,
  //     alertRequired: false,
  //     isEmail: false,
  //     isAudio: false,
  //     isSms: false,
  //     signalId: 0,
  //     isActive: false,
  //     isAlertRange: false
  //   },
  //   {
  //     thresholdId: 0,
  //     thresholdValue: 300,
  //     thresholdColor: "red",
  //     alertRequired: false,
  //     isEmail: false,
  //     isAudio: false,
  //     isSms: false,
  //     signalId: 0,
  //     isActive: false,
  //     isAlertRange: false
  //   }
  // ]
  ngOnInit(): void {

    this.headerdata = this.data[1];
    this.tabledataPopup = this.data[0];
    // this.tabledata = this.data[0];
      console.log(this.data,"popup data checking")
      this.getsignalData();
      this. getSignalDropdownAllData();
      
  }
  getsignalData(){
    this.showSignal = true;
    
    this._dashboardservice.getSignalById(this.tabledataPopup?.signalId).subscribe(data => {
      console.log(data,"details data checking");
     
      this.tabledata = data;

    },
    error => { 
      console.error(error);
      this.showSignal = false;
       this.toastr.error(error?.errorMessage)
    },
    () => console.log('COMPLETE')
    )
  }
  getSignalDropdownAllData(){
    
    this._dashboardservice.getSignalDropdownApi().subscribe(
      (data) => {  
        this.showSignal = false;
      console.log(data,"signal dropdown data checking");
      // this.devicesData = data?.devices;
      this.noOfBitsData = data?.noOfBits;
      this.signalDataTypesData = data?.signalDataTypes;
      this.signalGroupsData = data?.signalGroups;
      this.signalIconsData = data?.signalIcons;
      this.signalModesData = data?.signalModes;
      this.defaultDisplayTypeData = data?.defaultDisplayType;

      
                let noOfBitsVal;
                this.noOfBitsData?.find(item =>{
                  if(item.noOfBitId == this.tabledata?.signalModel?.noOfBitId){
                    noOfBitsVal = item;
                    console.log(noOfBitsVal,"dataFormatTypeID INLINE checking");
                  }
                  else{
                    return ""
                  }
                });
                // this.addSignalForm.get('noOfBitId').setValue(noOfBitsVal);
               this.tabledata["signalModel"]["noOfBitId"] = noOfBitsVal?.noOfBit;
               
                let signalDataTypesDataVal;
                this.signalDataTypesData?.find(item =>{
                  if(item.signalDataTypeId == this.tabledata?.signalModel?.signalDataTypeId){
                    signalDataTypesDataVal = item;
                    console.log(signalDataTypesDataVal,"dataFormatTypeID INLINE checking");
                  }
                  else{
                    return ""
                  }
                });
                // this.addSignalForm.get('signalDataTypeId').setValue(signalDataTypesDataVal);
                this.tabledata["signalModel"]["signalDataTypeId"] = signalDataTypesDataVal?.signalDataTypeName;
                let signalGroupsDataval;
                this.signalGroupsData?.find(item =>{
                  if(item.signalGroupId == this.tabledata?.signalModel?.signalGroupId){
                    signalGroupsDataval = item;
                    console.log(signalGroupsDataval,"dataFormatTypeID INLINE checking");
                  }
                  else{
                    return ""
                  }
                });
                // this.addSignalForm.get('signalGroupId').setValue(signalGroupsDataval);
                this.tabledata["signalModel"]["signalGroupId"] = signalGroupsDataval?.name;
                let signalIconsDataVal;
                this.signalIconsData?.find(item =>{
                  if(item.signalIconId == this.tabledata?.signalModel?.signalIconId){
                    signalIconsDataVal = item;
                    console.log(signalIconsDataVal,"dataFormatTypeID INLINE checking");
                  }
                  else{
                    return ""
                  }
                });
                // this.addSignalForm.get('signalIconId').setValue(signalIconsDataVal);
                this.tabledata["signalModel"]["signalIconId"] = signalIconsDataVal?.signalIconName;
                let signalModesDataVal;
                this.signalModesData?.find(item =>{
                  if(item.signalModeId == this.tabledata?.signalModel?.signalModeId){
                    signalModesDataVal = item;
                    console.log(signalModesDataVal,"dataFormatTypeID INLINE checking");
                  }
                  else{
                    return ""
                  }
                });
                // this.addSignalForm.get('signalModeId').setValue(signalModesDataVal);
                this.tabledata["signalModel"]["signalModeId"] = signalModesDataVal?.signalModeName;
                let defaultDisplayTypeDataVal;
                this.defaultDisplayTypeData?.find(item =>{
                  if(item.defaultDisplayTypeId == this.tabledata?.signalModel?.defaultDisplayTypeId){
                    defaultDisplayTypeDataVal = item;
                    console.log(defaultDisplayTypeDataVal,"dataFormatTypeID INLINE checking");
                  }
                  else{
                    return ""
                  }
                });
                // this.addSignalForm.get('defaultDisplayTypeId').setValue(defaultDisplayTypeDataVal);
                this.tabledata["signalModel"]["defaultDisplayTypeId"] = defaultDisplayTypeDataVal?.defaultDisplayTypeName;
                let addressTypeDropdownVal;
                this.addressTypeDropdown?.find(item =>{
                  if(item == this.tabledata?.signalModel?.plcAddressType){
                    addressTypeDropdownVal = item;
                    console.log(addressTypeDropdownVal,"dataFormatTypeID INLINE checking");
                  }
                  else{
                    return ""
                  }
                });
                // this.addSignalForm.get('plcAddressType').setValue(addressTypeDropdownVal);
                
                // this.setEditDetails();


      }, error => {
        console.error(error);
        this.showSignal = false;
         this.toastr.error(error?.errorMessage)
      },
      () => console.log('COMPLETE')
    )
    // this.filteredCustomerId = this.customerId.valueChanges 
    // .pipe(
    //   startWith(''),
    //   map(value => typeof value === 'string' ? value : value.Customer),
    //   map(Customer => Customer ? this._filterCustomerId(Customer) : this.customerIdData?.slice())
    // );
  }
 
}


//signal details popup end here

//signal edit popup start here

@Component({
  selector: 'signal-edit-popup',
  templateUrl: './signal-edit-popup.html',
  styleUrls: ['./signal.component.scss']
})

export class SignalEditPopup implements OnInit {
  headerdata;
  tabledataPopup;
  tabledata;
  showSignal = true;
  logOnlyNewSlideToggle =false ;
  isLatLong1 = false ;
  isMappingCalculationDone1 = false;
  alertRequired1 = false;
  email = false;
  audio = false;  
  sms = false;
  isDashboardTagged1 = true;
  isConnectedSlider = true;
  isAlertRangeSlider = false;
  
  addressTypeDropdown = ['Analog','Digital']; 
//dropdown data start here
show;
devicesData;
signalModesData;
signalDataTypesData;
signalIconsData;
noOfBitsData;
signalGroupsData;
defaultDisplayTypeData;
signalTypeData = ["Read","Write","Read & Write","Pulse"];
//dropdown data end here


  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<SignalEditPopup>, dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: any,
  private _dashboardservice:DashboardService,private toastr: ToastrService) { 
   
  }

  ngOnInit(): void {
    this.headerdata = this.data[1];
    this.tabledataPopup = this.data[0];
    console.log(this.tabledataPopup,"edit data checking")
    this.getsignalData();
    this.getSignalDropdownAllData();
    this.addSignalFormVal();
  
   
  }
  getsignalData(){
    this.showSignal = true;
    
    this._dashboardservice.getSignalById(this.tabledataPopup?.signalId).subscribe(data => {
      console.log(data,"details data checking");
      this.showSignal = false;
      this.tabledata = data;
      
      // console.log(this.tabledata,"signal data checking")
     
    },
    error => {
      console.error(error);
      this.showSignal = true;
       this.toastr.error(error?.errorMessage)
    },
    () => console.log('COMPLETE')
    )
  }
   addSignalForm: FormGroup;
  signalThreshold: FormGroup;
  maxLength = 5;
  titleAlert: string = 'This field is required';
  getMaxlength(val){
    return val;
  }
  
  addSignalFormVal() {
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.addSignalForm = this.formBuilder.group({
      'signalId'           : [null, Validators.required],
      'signalName'           : [null, Validators.required],
      'signalDescription' : [null],
      'signalModeId' : [null, Validators.required],
      'signalDataTypeId' : [null, Validators.required],
      'dataDecimalPoint' : [null, Validators.required],
      'logOnlyNew' : [null, Validators.required],
      'defaultDisplayTypeId' : [null, Validators.required],
      'multiplyFactor' : [1, [Validators.required,Validators.pattern( /^-{0,1}\d*\.{0,1}\d+$/)]],
      'signalStartRange' : [null, Validators.required],
      'signalEndRange' : [null, Validators.required],
      'signalUnit' : [null],
      'signalIconId' : [null],
      'sensorMin' : [null],
      'sensorMax' : [null],
      'isMappingCalculationDone' : [null, Validators.required],
      'isLatLong' : [null, Validators.required],
      'noOfBitId' : [null, Validators.required],
      'plcAddress' : [null],
      'plcAddressType' : [null],
      'signalBitModel': [null],
      'signalGroupId': [null],
      'isDashboardTagged': [null, Validators.required],
      'isConnected': [null, Validators.required],
      'signalType': [null, Validators.required],
      'quantities': this.formBuilder.array([
      
      ]),
      
      
    });
   
  //  setTimeout(()=>{ 
  //   this.thresholdrangeAdd();
  //  },100)

  }  
 
  quantities() : FormArray {
    return this.addSignalForm.get('quantities') as FormArray
  }
   
   
  newQuantity(): FormGroup {
    return this.formBuilder.group({
      'thresholdValue':[null],
      'thresholdColor':['#0000ff'],
      'alertRequired':[false],
      'isEmail':[false],
      'isAudio':[false],
      'isSms': [false],
      'isAlertRange':[false],
      'alertMessage': [null]
    })
    this.quantities().controls[0].get('isEmail').setValue(false);
        this.quantities().controls[0].get('isAudio').setValue(false);
        this.quantities().controls[0].get('isSms').setValue(false);
        this.quantities().controls[0].get('isAlertRange').setValue(false);
        this.quantities().controls[0].get('alertMessage').setValue(null);
  }
  addQuantity() {
    this.quantities().push(this.newQuantity()); 
  }
  removeQuantity(i:number) {
    this.quantities().removeAt(i);
  }


  getSignalDropdownAllData(){
    this.showSignal = true;
    this._dashboardservice.getSignalDropdownApi().subscribe(
      (data) => {  
      console.log(data,"signal dropdown data checking");
      // this.devicesData = data?.devices;
      this.noOfBitsData = data?.noOfBits;
      this.signalDataTypesData = data?.signalDataTypes;
      this.signalGroupsData = data?.signalGroups;
      this.signalIconsData = data?.signalIcons;
      this.signalModesData = data?.signalModes;
      this.defaultDisplayTypeData = data?.defaultDisplayType;

      
                let noOfBitsVal;
                this.noOfBitsData.find(item =>{
                  if(item.noOfBitId == this.tabledata?.signalModel?.noOfBitId){
                    noOfBitsVal = item;
                    console.log(noOfBitsVal,"dataFormatTypeID INLINE checking");
                  }
                  else{
                    return ""
                  }
                });
                this.addSignalForm.get('noOfBitId').setValue(noOfBitsVal);

               
                let signalDataTypesDataVal;
                this.signalDataTypesData.find(item =>{
                  if(item.signalDataTypeId == this.tabledata?.signalModel?.signalDataTypeId){
                    signalDataTypesDataVal = item;
                    console.log(signalDataTypesDataVal,"dataFormatTypeID INLINE checking");
                  }
                  else{
                    return ""
                  }
                });
                this.addSignalForm.get('signalDataTypeId').setValue(signalDataTypesDataVal);

                let signalGroupsDataval;
                this.signalGroupsData.find(item =>{
                  if(item.signalGroupId == this.tabledata?.signalModel?.signalGroupId){
                    signalGroupsDataval = item;
                    console.log(signalGroupsDataval,"dataFormatTypeID INLINE checking");
                  }
                  else{
                    return ""
                  }
                });
                this.addSignalForm.get('signalGroupId').setValue(signalGroupsDataval);

                let signalIconsDataVal;
                this.signalIconsData.find(item =>{
                  if(item.signalIconId == this.tabledata?.signalModel?.signalIconId){
                    signalIconsDataVal = item;
                    console.log(signalIconsDataVal,"dataFormatTypeID INLINE checking");
                  }
                  else{
                    return ""
                  }
                });
                this.addSignalForm.get('signalIconId').setValue(signalIconsDataVal);

                let signalModesDataVal;
                this.signalModesData.find(item =>{
                  if(item.signalModeId == this.tabledata?.signalModel?.signalModeId){
                    signalModesDataVal = item;
                    console.log(signalModesDataVal,"dataFormatTypeID INLINE checking");
                  }
                  else{
                    return ""
                  }
                });
                this.addSignalForm.get('signalModeId').setValue(signalModesDataVal);

                let defaultDisplayTypeDataVal;
                this.defaultDisplayTypeData.find(item =>{
                  if(item.defaultDisplayTypeId == this.tabledata?.signalModel?.defaultDisplayTypeId){
                    defaultDisplayTypeDataVal = item;
                    console.log(defaultDisplayTypeDataVal,"dataFormatTypeID INLINE checking");
                  }
                  else{
                    return ""
                  }
                });
                this.addSignalForm.get('defaultDisplayTypeId').setValue(defaultDisplayTypeDataVal);

                let addressTypeDropdownVal;
                this.addressTypeDropdown.find(item =>{
                  if(item == this.tabledata?.signalModel?.plcAddressType){
                    addressTypeDropdownVal = item;
                    console.log(addressTypeDropdownVal,"dataFormatTypeID INLINE checking");
                  }
                  else{
                    return ""
                  }
                });
                this.addSignalForm.get('plcAddressType').setValue(addressTypeDropdownVal);
                
                this.setEditDetails();
                this.showSignal = false;

      },
      error => {
        console.error(error);
        this.showSignal = true;
         this.toastr.error(error?.errorMessage)
      },
      () => console.log('COMPLETE')
    )
    // this.filteredCustomerId = this.customerId.valueChanges 
    // .pipe(
    //   startWith(''),
    //   map(value => typeof value === 'string' ? value : value.Customer),
    //   map(Customer => Customer ? this._filterCustomerId(Customer) : this.customerIdData?.slice())
    // );
  }
  // signalThresholdModels() : FormArray {
  //   return this.addSignalForm.get("signalThresholdModels") as FormArray
   
  // }  
  getCololor;
  onColorPickerSelect(color,i) {
    console.log(color,i,"color picker checki")
    this.quantities().controls[i].get('thresholdColor').setValue(color);
  }
  setEditDetails(){
    this.addSignalForm.get("signalId").setValue(this.tabledata?.signalModel?.signalId);
    this.addSignalForm.get("signalName").setValue(this.tabledata?.signalModel?.signalName);
    this.addSignalForm.get("signalDescription").setValue(this.tabledata?.signalModel?.signalDescription);
    this.addSignalForm.get("dataDecimalPoint").setValue(this.tabledata?.signalModel?.dataDecimalPoint);
    this.addSignalForm.get("logOnlyNew").setValue(this.tabledata?.signalModel?.logOnlyNew);
    this.addSignalForm.get("multiplyFactor").setValue(this.tabledata?.signalModel?.multiplyFactor == null ? 1 : this.tabledata?.signalModel?.multiplyFactor);
    this.addSignalForm.get("signalStartRange").setValue(this.tabledata?.signalModel?.signalStartRange);
    this.addSignalForm.get("signalEndRange").setValue(this.tabledata?.signalModel?.signalEndRange);
    this.addSignalForm.get("signalUnit").setValue(this.tabledata?.signalModel?.signalUnit);
    this.addSignalForm.get("sensorMin").setValue(this.tabledata?.signalModel?.sensorMin);
    this.addSignalForm.get("sensorMax").setValue(this.tabledata?.signalModel?.sensorMax);
    this.addSignalForm.get("isMappingCalculationDone").setValue(this.tabledata?.signalModel?.isMappingCalculationDone);
    this.addSignalForm.get("isLatLong").setValue(this.tabledata?.signalModel?.isLatLong);
    this.addSignalForm.get("plcAddress").setValue(this.tabledata?.signalModel?.plcAddress);
    this.addSignalForm.get("isConnected").setValue(this.tabledata?.signalModel?.isConnected);
    this.addSignalForm.get("signalType").setValue(this.tabledata?.signalModel?.signalType);
    this.addSignalForm.get("isDashboardTagged").setValue(this.tabledata?.signalModel?.isDashboardTagged);
    if(this.tabledata?.signalModel?.plcAddressType == 'Analog'){
      this.addressTypeShow = false;
      
    }else{
      this.addressTypeShow = true;
      this.addSignalForm.get("signalBitModel").setValidators(Validators.required);
      this.addSignalForm.get("signalBitModel").setValue(this.tabledata?.signalBitModel?.bitId);
    }
    // this.addSignalForm.get("quantities").setValue(this.tabledata?.signalThresholdModels);
    console.log( this.tabledata?.signalThresholdModels.length,"threshold length cheking")
    if(this.tabledata?.signalThresholdModels.length > 0){
    for(let i = 0; i < this.tabledata?.signalThresholdModels.length; i++){
    this.quantities().push(this.newQuantity());
    } 
      setTimeout(()=>{
    for(let i = 0; i < this.tabledata?.signalThresholdModels.length; i++){
    //   // if(this.quantities().controls[i].get('alertRequired').value == false){
      // document.getElementById(`thresholdColor${i}`).style.backgroundColor = this.tabledata?.signalThresholdModels[i]['thresholdColor'];
        this.quantities().controls[i].get('thresholdValue').setValue(this.tabledata?.signalThresholdModels[i]['thresholdValue']);
        this.quantities().controls[i].get('thresholdColor').setValue(this.tabledata?.signalThresholdModels[i]['thresholdColor']);
        this.quantities().controls[i].get('alertRequired').setValue(this.tabledata?.signalThresholdModels[i]['alertRequired']);
        this.quantities().controls[i].get('isEmail').setValue(this.tabledata?.signalThresholdModels[i]['isEmail']);
        this.quantities().controls[i].get('isAudio').setValue(this.tabledata?.signalThresholdModels[i]['isAudio']);
        this.quantities().controls[i].get('isSms').setValue(this.tabledata?.signalThresholdModels[i]['isSms']);
        this.quantities().controls[i].get('isAlertRange').setValue(this.tabledata?.signalThresholdModels[i]['isAlertRange']);
        this.quantities().controls[i].get('alertMessage').setValue(this.tabledata?.signalThresholdModels[i]['alertMessage']);
    //     // this.quantities().controls[i].get('isAudio') = false;
    //     // this.quantities().controls[i].get('isSms') = false;
    //   // }
    }
  },1000)
    }else{
      this.quantities().push(this.newQuantity());
    }

  }
  get signalId() {  
    return this.addSignalForm.get('signalId') as FormControl
  }
  get signalName() {  
    return this.addSignalForm.get('signalName') as FormControl
  }
  get signalDescription() {
    return this.addSignalForm.get('signalDescription') as FormControl
  }
  get signalModeId() {
    return this.addSignalForm.get('signalModeId') as FormControl
  }
  get signalDataTypeId() {
    return this.addSignalForm.get('signalDataTypeId') as FormControl
  }
  get dataDecimalPoint() {
    return this.addSignalForm.get('dataDecimalPoint') as FormControl 
  }
  get logOnlyNew() {  
    return this.addSignalForm.get('logOnlyNew') as FormControl
  } 
  get defaultDisplayTypeId() {
    return this.addSignalForm.get('defaultDisplayTypeId') as FormControl
  }
  get multiplyFactor() {
    return this.addSignalForm.get('multiplyFactor') as FormControl
  }
  get signalStartRange() {
    return this.addSignalForm.get('signalStartRange') as FormControl
  }
  get signalEndRange() {
    return this.addSignalForm.get('signalEndRange') as FormControl
  }
  get signalUnit() {
    return this.addSignalForm.get('signalUnit') as FormControl
  }
  get signalIconId() {
    return this.addSignalForm.get('signalIconId') as FormControl
  }
  get sensorMin() {
    return this.addSignalForm.get('sensorMin') as FormControl
  }
  get sensorMax() {
    return this.addSignalForm.get('sensorMax') as FormControl
  }
  get isMappingCalculationDone() {
    return this.addSignalForm.get('isMappingCalculationDone') as FormControl
  }
  get isLatLong() {
    return this.addSignalForm.get('isLatLong') as FormControl
  }
  get noOfBitId() {
    return this.addSignalForm.get('noOfBitId') as FormControl
  }
  get plcAddress() {
    return this.addSignalForm.get('plcAddress') as FormControl
  }
  get plcAddressType() {
    return this.addSignalForm.get('plcAddressType') as FormControl
  }
  get signalBitModel() {
    return this.addSignalForm.get('signalBitModel') as FormControl
  }
  get signalGroupId() {
    return this.addSignalForm.get('signalGroupId') as FormControl
  }
  get isDashboardTagged() {
    return this.addSignalForm.get('isDashboardTagged') as FormControl
  }
  get isConnected() {
    return this.addSignalForm.get('isConnected') as FormControl
  }
  get signalType() {
    return this.addSignalForm.get('signalType') as FormControl
  }

  
  get thresholdValue() {
    return this.addSignalForm.get('quantities').get('thresholdValue') as FormControl
  }
  get thresholdColor() {
    return this.addSignalForm.get('thresholdColor') as FormControl
  }
  get alertRequired() {
    return this.addSignalForm.get('alertRequired') as FormControl
  }
  get isEmail() {
    return this.addSignalForm.get('isEmail') as FormControl
  }
  get isAudio() {
    return this.addSignalForm.get('isAudio') as FormControl
  }
  get isSms() {
    return this.addSignalForm.get('isSms') as FormControl
  }
  get isAlertRange() {
    return this.addSignalForm.get('isAlertRange') as FormControl
  }
  getDecimalvalError() {
    return this.addSignalForm.get('multiplyFactor').hasError('required') ? 'multiplyFactor field is required' :
      this.addSignalForm.get('multiplyFactor').hasError('pattern') ? 'multiplyFactor only enter decimal' : '';
  }
  signalNameModel ="";
  signalDescriptionModel ="";
  signalIdModel ="";
  plcAddressModel= "";
  bitPositionModel = ""; 
  signalTopicModel = "";
  addressTypeShow = false;
  addressTypefun(signal){
    console.log(signal,"checking")
    if(signal == 'Analog'){
      this.addressTypeShow = false;
      this.addSignalForm.get("signalBitModel").setValue(null);   
      // this.addSignalForm.get("signalBitModel").setErrors(null);
      this.addSignalForm.get("signalBitModel").setValidators(null);
    }else{
      this.addressTypeShow = true;
      this.addSignalForm.get("signalBitModel").setValue(null);   
      this.addSignalForm.get("signalBitModel").setValidators(Validators.required);
    }
   
  }
  onSubmit(){
  
  }
  onSubmit1(){
  
  }
  addSignal(){
    // deviceId:this.tabledata?.signalModel?.deviceId,
   
    console.log(this.addSignalForm.value,"edit this.addSignalForm.value")
    let range = [];
    let rangval = {};
    // setTimeout(()=>{
      if(this.addSignalForm.value.quantities[0]["thresholdValue"] != null){
    for(let i = 0; i < this.addSignalForm.value.quantities.length;i++){
      if(this.addSignalForm.value.quantities[i]["thresholdValue"] != ''){
        if(this.tabledata?.signalThresholdModels[i]?.thresholdId != null || this.tabledata?.signalThresholdModels[i]?.thresholdId != undefined){
      rangval ={
      
       thresholdValue: this.addSignalForm.value.quantities[i]["thresholdValue"] ? parseInt(this.addSignalForm.value.quantities[i]["thresholdValue"]) : null,
       thresholdColor: this.addSignalForm.value.quantities[i]["thresholdColor"],
       alertRequired: this.addSignalForm.value.quantities[i]["alertRequired"],
       isEmail: this.addSignalForm.value.quantities[i]["isEmail"],
       isAudio: this.addSignalForm.value.quantities[i]["isAudio"],
       isSms: this.addSignalForm.value.quantities[i]["isSms"],
       signalId: this.tabledata?.signalModel?.signalId,
       isActive: true,
       isAlertRange: this.addSignalForm.value.quantities[i]["isAlertRange"],
       alertMessage: this.addSignalForm.value.quantities[i]["alertMessage"],
       thresholdId: this.tabledata?.signalThresholdModels[i]["thresholdId"]
     }
    }else{ 
      rangval ={
      
        thresholdValue: this.addSignalForm.value.quantities[i]["thresholdValue"] ? parseInt(this.addSignalForm.value.quantities[i]["thresholdValue"]) : null,
        thresholdColor: this.addSignalForm.value.quantities[i]["thresholdColor"],
        alertRequired: this.addSignalForm.value.quantities[i]["alertRequired"],
        isEmail: this.addSignalForm.value.quantities[i]["isEmail"],
        isAudio: this.addSignalForm.value.quantities[i]["isAudio"],
        isSms: this.addSignalForm.value.quantities[i]["isSms"],
        signalId: this.tabledata?.signalModel?.signalId,
        isActive: true,
        isAlertRange: this.addSignalForm.value.quantities[i]["isAlertRange"],
        alertMessage: this.addSignalForm.value.quantities[i]["alertMessage"]
      }
    }
     console.log(rangval,"rangval checking")
     range.push(rangval)
      }
    }
    }else{
      range = [];
    }
    // },1000)
    // deviceId:this._Activatedroute.snapshot.paramMap.get("deviceId"),
   let addSignal = {
    signalModel:{
      deviceId:this.tabledata?.signalModel?.deviceId,
      dataDecimalPoint:this.addSignalForm.value.dataDecimalPoint != undefined ? parseInt(this.addSignalForm.value.dataDecimalPoint):null,
      defaultDisplayTypeId:this.addSignalForm.value.defaultDisplayTypeId?.defaultDisplayTypeId,
      isConnected:this.addSignalForm.value.isConnected,
      isDashboardTagged:this.addSignalForm.value.isDashboardTagged,
      isLatLong:this.addSignalForm.value.isLatLong,
      isMappingCalculationDone:this.addSignalForm.value.isMappingCalculationDone,
      logOnlyNew:this.addSignalForm.value.logOnlyNew,
      noOfBitId:this.addSignalForm.value.noOfBitId?.noOfBitId,
      plcAddress:this.addSignalForm.value.plcAddress,
      plcAddressType:this.addSignalForm.value.plcAddressType ? this.addSignalForm.value.plcAddressType:null,
      sensorMax:this.addSignalForm.value.sensorMax != undefined ? parseInt(this.addSignalForm.value.sensorMax):null,
      sensorMin:this.addSignalForm.value.sensorMin != undefined ? parseInt(this.addSignalForm.value.sensorMin):null,
      signalDataTypeId:this.addSignalForm.value.signalDataTypeId?.signalDataTypeId,
      signalId:this.addSignalForm.value.signalId,
      signalDescription:this.addSignalForm.value.signalDescription,
      signalEndRange:this.addSignalForm.value.signalEndRange != undefined ? parseInt(this.addSignalForm.value.signalEndRange):null,
      signalGroupId:this.addSignalForm.value.signalGroupId?.signalGroupId != undefined ? this.addSignalForm.value.signalGroupId?.signalGroupId:null,
      signalIconId:this.addSignalForm.value.signalIconId?.signalIconId != undefined ? this.addSignalForm.value.signalIconId?.signalIconId:null,
      signalModeId:this.addSignalForm.value.signalModeId?.signalModeId,
      signalName:this.addSignalForm.value.signalName,
      multiplyFactor:this.addSignalForm.value.multiplyFactor != undefined ? parseFloat(this.addSignalForm.value.multiplyFactor):1,
      signalStartRange:this.addSignalForm.value.signalStartRange != undefined ? parseInt(this.addSignalForm.value.signalStartRange):null,
      signalType:this.addSignalForm.value.signalType,
      signalUnit:this.addSignalForm.value.signalUnit,
      tolerance:null,
      visualEffectId:null,
      // tolerance:this.addSignalForm.value.tolerance,
      // visualEffectId:this.addSignalForm.value.visualEffectId,
     
    }, 
    signalThresholdModels:range,
    signalBitModel: (this.addSignalForm.value.signalBitModel == null || this.addSignalForm.value.signalBitModel == undefined) ? null : {
      bitId: parseInt(this.addSignalForm.value.signalBitModel)
    }
    
   }

  //  JSON.stringify(
   console.log(addSignal,"edit Signal data checking")
  //  setTimeout(()=>{  
      this._dashboardservice.editSignal(this.tabledata?.signalModel?.signalId,addSignal).subscribe(
    data => {
      console.log(data,"after registered api data checking");
      this.dialogRef.close({ event: 'editSignal'});
      this.showSuccess("Parameter edit  sucessfully")   
    
    },
    error => {
      console.error(error);
      this.showError("Parameter changes are not added");
    },
    () => console.log('COMPLETE')
  )
  // },1000)
 
  }
  showSuccess(message) {
    this.toastr.success(message);
  }

  showError(message:string) {
    this.toastr.error(message);
  }
  thresholdrangeAdd(){
    let obj = {
      thresholdValue:"",
      thresholdColor:"",
      alertRequired:null,
      isEmail:null,
      isAudio:null,
      isSms: null,
      isAlertRange: null,
     }
    // this.signalThresholdModels.push(obj);
    
  }
  rangInput(ev){  
console.log(ev,"rang checking");
  }


   thresholdrangeRemove(i){
    // this.signalThresholdModels.splice(i,1);
   }
   alertrequired(){
 
    console.log(this.quantities().controls,"alert required");
    for(let i = 0; i < this.quantities().controls.length; i++){
      if(this.quantities().controls[i].get('alertRequired').value == false){
       
        this.quantities().controls[i].get('isEmail').setValue(false);
        this.quantities().controls[i].get('isAudio').setValue(false);
        this.quantities().controls[i].get('isSms').setValue(false);
        // this.quantities().controls[i].get('isAudio') = false;
        // this.quantities().controls[i].get('isSms') = false;
      }
    }
  
  }

  alertisEmail(){
    for(let i = 0; i < this.quantities().controls.length; i++){
      if(this.quantities().controls[i].get('alertRequired').value == false){
       
        this.quantities().controls[i].get('isEmail').setValue(false);
     
      }
    }
  }
 
  
  alertisAudio(){
    for(let i = 0; i < this.quantities().controls.length; i++){
      if(this.quantities().controls[i].get('alertRequired').value == false){
       
        this.quantities().controls[i].get('isAudio').setValue(false);
       
      }
    }
  }

  
  alertisSms(){
    for(let i = 0; i < this.quantities().controls.length; i++){
      if(this.quantities().controls[i].get('alertRequired').value == false){
       
        this.quantities().controls[i].get('isSms').setValue(false);
      }
    }
  }
 
}


//signal edit popup end here

//signal delete popup start here

@Component({
  selector: 'signal-delete-popup',
  templateUrl: './signal-delete-popup.html',
  styleUrls: ['./signal.component.scss']
})

export class SignalDeletePopup implements OnInit {
  constructor(private _dashboardservice:DashboardService,
    public dialogRef: MatDialogRef<SignalDeletePopup>, 
   private dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,private router: Router,public route:ActivatedRoute,
    @Inject(DOCUMENT) private document: Document) { }
  headerdata;
  currentdata;
  tabledata;
  index;
  sub;
  ngOnInit(): void {

    this.currentdata = this.data[0];
   
    console.log(this.data,"popup data checking")
      
  }
  
  deleteSignal(){
    this._dashboardservice.deleteSignalId(this.currentdata?.signalId,true).subscribe(
      data => {
        console.log(data,"after registered api data checking");
        this.dialogRef.close({ event: 'deleteSignal'});
      this.showSuccess("Parameter deleted  sucessfully")   
      },
      error => {
        console.error(error);
        this.dialogRef.close({ event: ''});
        // this.showError("Opps! Signal delete failed ")
        // && error?.errorMessage == this._dashboardservice?.errorMsg?.deviceMsg
        if(error?.errorCode == 400 && error?.errorMessage == this._dashboardservice?.errorMsg?.signalMsg){
          let dialogRef = this.dialog.open(SignalsDeleteAlarmPopup,
            {
              width: '500px',
              // width: '1000px',
              // height: '500px',
              data:[error,this.currentdata?.signalId]
      
            });
      
          dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: result`);
            if (result?.event == "deleteSignalsDevice") {
              window.location.reload();
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

  showError(message:string) {
    this.toastr.error(message);
  }


}

//delete signal alarm popup start 

@Component({
  selector: 'delete-signal-alarm-popup',
  templateUrl: './delete-signal-alarm.html',
  styleUrls: ['./signal.component.scss']
})
export class SignalsDeleteAlarmPopup implements OnInit {
  constructor(public dialogRef: MatDialogRef<SignalsDeleteAlarmPopup>, dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any,
  private _dashboardservice: DashboardService, private toastr: ToastrService,private route: Router) { }
  currData;
  ngOnInit(): void {
      console.log(this.data,"error msg")
      this.currData = this.data[0];
  }
  
  deleteSignalAlarm(){
    this.dialogRef.close({ event: 'deleteSignalsDevice' });
    this._dashboardservice.deleteSignalId(this.data[1],false).subscribe(
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

//delete signal alarm end


//signal details popup end here


//AddSignalPopup popup start here

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'add-signal-popup',
  templateUrl: './add-signal-popup.html',
  styleUrls: ['./signal.component.scss']
})

export class AddSignalPopup implements OnInit {
 
  color = "#0000ff";
  signalModeDropdown = ['Signal Mode 1',
                'Signal Mode 2',
                'Signal Mode 3',
                'Signal Mode 4',
                'Signal Mode 5',
                'Signal Mode 6',
                'Signal Mode 7',
                'Signal Mode 8',
                'Signal Mode 9',
                'Signal Mode 10'];
  
signalDataTypeIdDropdown = ['Signal Data Type 1',
'Signal Data Type 2',
'Signal Data Type 3',
'Signal Data Type 4',
'Signal Data Type 5',
'Signal Data Type 6',
'Signal Data Type 7',
'Signal Data Type 8',
'Signal Data Type 9',
'Signal Data Type 10'];      


defaultDisplayTypeIdDropdown = ['Default Display Type 1',
'Default Display Type 2',
'Default Display Type 3',
'Default Display Type 4',
'Default Display Type 5',
'Default Display Type 6',
'Default Display Type 7',
'Default Display Type 8',
'Default Display Type 9',
'Default Display Type 10'];        
  
signalIconIdDropdown = ['Signal Icon 1',
                'Signal Icon 2',
                'Signal Icon 3',
                'Signal Icon 4',
                'Signal Icon 5',
                'Signal Icon 6',
                'Signal Icon 7',
                'Signal Icon 8',
                'Signal Icon 9',
                'Signal Icon 10'];

    






  
  visualEffectdrop = ['Visual Effect 1',
                  'Visual Effect 2',
                  'Visual Effect 3',
                  'Visual Effect 4',
                  'Visual Effect 5',
                  'Visual Effect 6',
                  'Visual Effect 7',
                  'Visual Effect 8',
                  'Visual Effect 9',
                  'Visual Effect 10'];
   

  signalDisplayType = ['Signal Display Type 1',
                       'Signal Display Type 2',
                       'Signal Display Type 3',
                       'Signal Display Type 4',
                       'Signal Display Type 5',
                       'Signal Display Type 6',
                       'Signal Display Type 7',
                       'Signal Display Type 8',
                       'Signal Display Type 9',
                       'Signal Display Type 10'];


  numberoffBits = ['16',
                   '32'];
   

  GroupType = ['Group Type 1',
               'Group Type 2',
               'Group Type 3',
               'Group Type 4',
               'Group Type 5',
               'Group Type 6',
               'Group Type 7',
               'Group Type 8',
               'Group Type 9',
               'Group Type 10'];

addressTypeDropdown = ['Analog','Digital'];           
    
  
    
  favoriteSeason: string ;
  seasons = [
    {
      key: 'Yes',
      checked: false
    },
    {
      key: 'No',
      checked: true
    }
  ];
  seasons2 = [
    {
      key: 'Yes',
      checked: true
    },
    {
      key: 'No',
      checked: false
    }
  ];
  seasons3 = [
    {
      key: 'Yes',
      checked: false
    },
    {
      key: 'No',
      checked: true
    }
  ];
  seasons4 = [
    {
      key: 'Yes',
      checked: false
    },
    {
      key: 'No',
      checked: true
    }
  ];

  logOnlyNewSlideToggle =false ;
  isLatLong1 = false ;
  isMappingCalculationDone1 = false;
  alertRequired1 = false;
  email = false;
  audio = false;  
  sms = false;
  isDashboardTagged1 = true;
  isConnectedSlider = true;
  isAlertRangeSlider = false;
  
  
//dropdown data start here
showSignal = false;
devicesData;
signalModesData;
signalDataTypesData;
signalIconsData;
noOfBitsData;
signalGroupsData;
defaultDisplayTypeData;
signalTypeData = ["Read","Write","Read & Write","Pulse"];
//dropdown data end here


  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<AddSignalPopup>, dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: any,
  private _dashboardservice:DashboardService, private toastr: ToastrService, private _Activatedroute:ActivatedRoute) { 
    this.favoriteSeason= 'Yes'
  }

  ngOnInit(): void {
    console.log(this.data,"data checking")
    this.getSignalDropdownAllData();
    this.addSignalFormVal();
    
  }
  addSignalForm: FormGroup;
  signalThreshold: FormGroup;
  maxLength = 5;
  titleAlert: string = 'This field is required';
  getMaxlength(val){
    return val;
  }
  
  addSignalFormVal() {
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.addSignalForm = this.formBuilder.group({
      'signalId'           : [null],
      'signalName'           : [null, Validators.required],
      'signalDescription' : [null],
      'signalModeId' : [null, Validators.required],
      'signalDataTypeId' : [null, Validators.required],
      'dataDecimalPoint' : [null, Validators.required],
      'logOnlyNew' : [false, Validators.required],
      'defaultDisplayTypeId' : [null, Validators.required],
      'multiplyFactor' : [1, [Validators.required,Validators.pattern( /^-{0,1}\d*\.{0,1}\d+$/)]],
      'signalStartRange' : [null, Validators.required],
      'signalEndRange' : [null, Validators.required],
      'signalUnit' : [null],
      'signalIconId' : [null],
      'sensorMin' : [null],
      'sensorMax' : [null],
      'isMappingCalculationDone' : [false, Validators.required],
      'isLatLong' : [false, Validators.required],
      'noOfBitId' : [null, Validators.required],
      'plcAddress' : [null],
      'plcAddressType' : [null],
      'signalBitModel': [null],
      'signalGroupId': [null],
      'isDashboardTagged': [false, Validators.required],
      'isConnected': [false, Validators.required],
      'signalType': [null,Validators.required],
      'quantities': this.formBuilder.array([
      
      ]),
      
    });

    this.quantities().push(this.newQuantity());
 
  //  setTimeout(()=>{ 
  //   this.thresholdrangeAdd();
  //  },100)

  }  
 
  quantities() : FormArray {
    return this.addSignalForm.get('quantities') as FormArray
  }
   
   
  newQuantity(): FormGroup {
    return this.formBuilder.group({
      'thresholdValue':[null],
      'thresholdColor':[null],
      'alertRequired':[false],
      'isEmail':[false],
      'isAudio':[false],
      'isSms': [false],
      'isAlertRange':[false],
      'alertMessage':[null]
    })
    this.quantities().controls[0].get('thresholdValue').setValue(0);
    this.quantities().controls[0].get('isEmail').setValue(false);
        this.quantities().controls[0].get('isAudio').setValue(false);
        this.quantities().controls[0].get('isSms').setValue(false);
        this.quantities().controls[0].get('isAlertRange').setValue(false);
        this.quantities().controls[0].get('alertMessage').setValue(null);
  }
  addQuantity() {
    this.quantities().push(this.newQuantity()); 
  }
  removeQuantity(i:number) {
    this.quantities().removeAt(i);
  }


  getSignalDropdownAllData(){
    this._dashboardservice.getSignalDropdownApi().subscribe(
      data => {   
      console.log(data,"signal dropdown data checking");
      this.devicesData = data?.devices;
      this.noOfBitsData = data?.noOfBits;
      this.signalDataTypesData = data?.signalDataTypes;
      this.signalGroupsData = data?.signalGroups;
      this.signalIconsData = data?.signalIcons;
      this.signalModesData = data?.signalModes;
      this.defaultDisplayTypeData = data?.defaultDisplayType;
      
      },
      error => { 
        console.error(error);
        this.toastr.error(error?.errorMessage)
      },
      () => console.log('COMPLETE')
    )
    // this.filteredCustomerId = this.customerId.valueChanges
    // .pipe(
    //   startWith(''),
    //   map(value => typeof value === 'string' ? value : value.Customer),
    //   map(Customer => Customer ? this._filterCustomerId(Customer) : this.customerIdData?.slice())
    // );
  }
  // signalThresholdModels() : FormArray {
  //   return this.addSignalForm.get("signalThresholdModels") as FormArray
   
  // }
  
  // newsignalThresholdModels(): FormGroup {
  //   return this.formBuilder.group({
  //     'thresholdValue': ['', Validators.required],
  //     'thresholdColor': ['', Validators.required],
  //     'alertRequired': ['', Validators.required],
  //     'isEmail': ['', Validators.required],
  //     'isAudio': ['', Validators.required],
  //     'isSms': ['', Validators.required],
  //     'isAlertRange': [' ', Validators.required],
  //   })
  // }
  // 'thresholdValue': [null, Validators.required],
  // 'thresholdColor': [null, Validators.required],
  // 'alertRequired': [null, Validators.required],
  // 'isEmail': [null, Validators.required],
  // 'isAudio': [null, Validators.required],
  // 'isSms': [null, Validators.required],
  // 'isAlertRange': [null, Validators.required],
  get signalId() {
    return this.addSignalForm.get('signalId') as FormControl
  }
  get signalName() {
    return this.addSignalForm.get('signalName') as FormControl
  }
  get signalDescription() {
    return this.addSignalForm.get('signalDescription') as FormControl
  }
  get signalModeId() {
    return this.addSignalForm.get('signalModeId') as FormControl
  }
  get signalDataTypeId() {
    return this.addSignalForm.get('signalDataTypeId') as FormControl
  }
  get dataDecimalPoint() {
    return this.addSignalForm.get('dataDecimalPoint') as FormControl
  }
  get logOnlyNew() {
    return this.addSignalForm.get('logOnlyNew') as FormControl
  }
  get defaultDisplayTypeId() {
    return this.addSignalForm.get('defaultDisplayTypeId') as FormControl
  }
  get multiplyFactor() {
    return this.addSignalForm.get('multiplyFactor') as FormControl
  }
  get signalStartRange() {
    return this.addSignalForm.get('signalStartRange') as FormControl
  }
  get signalEndRange() {
    return this.addSignalForm.get('signalEndRange') as FormControl
  }
  get signalUnit() {
    return this.addSignalForm.get('signalUnit') as FormControl
  }
  get signalIconId() {
    return this.addSignalForm.get('signalIconId') as FormControl
  }
  get sensorMin() {
    return this.addSignalForm.get('sensorMin') as FormControl
  }
  get sensorMax() {
    return this.addSignalForm.get('sensorMax') as FormControl
  }
  get isMappingCalculationDone() {
    return this.addSignalForm.get('isMappingCalculationDone') as FormControl
  }
  get isLatLong() {
    return this.addSignalForm.get('isLatLong') as FormControl
  }
  get noOfBitId() {
    return this.addSignalForm.get('noOfBitId') as FormControl
  }
  get plcAddress() {
    return this.addSignalForm.get('plcAddress') as FormControl
  }
  get plcAddressType() {
    return this.addSignalForm.get('plcAddressType') as FormControl
  }
  get signalBitModel() {
    return this.addSignalForm.get('signalBitModel') as FormControl
  }
  get signalGroupId() {
    return this.addSignalForm.get('signalGroupId') as FormControl
  }
  get isDashboardTagged() {
    return this.addSignalForm.get('isDashboardTagged') as FormControl
  }
  get isConnected() {
    return this.addSignalForm.get('isConnected') as FormControl
  }
  get signalType() {
    return this.addSignalForm.get('signalType') as FormControl
  }

  
  get thresholdValue() {
    return this.addSignalForm.get('quantities').get('thresholdValue') as FormControl
  }
  get thresholdColor() {
    return this.addSignalForm.get('thresholdColor') as FormControl
  }
  get alertRequired() {
    return this.addSignalForm.get('alertRequired') as FormControl
  }
  get isEmail() {
    return this.addSignalForm.get('isEmail') as FormControl
  }
  get isAudio() {
    return this.addSignalForm.get('isAudio') as FormControl
  }
  get isSms() {
    return this.addSignalForm.get('isSms') as FormControl
  }
  get isAlertRange() {
    return this.addSignalForm.get('isAlertRange') as FormControl
  }
  getDecimalvalError() {
    return this.addSignalForm.get('multiplyFactor').hasError('required') ? 'multiplyFactor field is required' :
      this.addSignalForm.get('multiplyFactor').hasError('pattern') ? 'multiplyFactor only enter decimal' : '';
  }
  signalNameModel ="";
  signalIdModel ="";
  signalDescriptionModel ="";
  plcAddressModel= "";
  bitPositionModel = ""; 
  signalTopicModel = "";
  addressTypeShow = false;
  addressTypefun(signal){
    console.log(signal,"checking")
    if(signal == 'Analog'){
      this.addressTypeShow = false;
      this.addSignalForm.get("signalBitModel").setValue(null);   
      this.addSignalForm.get("signalBitModel").setErrors(null);
    }else{
      this.addressTypeShow = true;
      this.addSignalForm.get("signalBitModel").setValue(null);   
      this.addSignalForm.get("signalBitModel").setValidators(Validators.required);
    }
   
  }
  onSubmit(){
  
  }
  onSubmit1(){
  
  }
  addSignal(){
    console.log(this.addSignalForm.value,"threeshold range")
    let range = [];
    let rangval = {};
    if(this.addSignalForm.value.quantities[0]["thresholdValue"] !== null){
    for(let i = 0; i < this.addSignalForm.value.quantities.length;i++){
      if(this.addSignalForm.value.quantities[i]["thresholdValue"] !== null) {
      rangval ={
      
       thresholdValue: parseInt(this.addSignalForm.value.quantities[i]["thresholdValue"]),
       thresholdColor: this.addSignalForm.value.quantities[i]["thresholdColor"],
       alertRequired: this.addSignalForm.value.quantities[i]["alertRequired"],
       isEmail: this.addSignalForm.value.quantities[i]["isEmail"],
       isAudio: this.addSignalForm.value.quantities[i]["isAudio"],
       isSms: this.addSignalForm.value.quantities[i]["isSms"],
       // signalId: this.addSignalForm.value.quantities.,
       isActive: true,
       isAlertRange: this.addSignalForm.value.quantities[i]["isAlertRange"],
       alertMessage: this.addSignalForm.value.quantities[i]["alertMessage"]
     }
     range.push(rangval)
    }
      }
    }else{
      range = [];
    }
    // deviceId:this._Activatedroute.snapshot.paramMap.get("deviceId"),
   let addSignal = {
    signalModel:{
      deviceId:this.data,
      dataDecimalPoint:this.addSignalForm.value.dataDecimalPoint ? parseInt(this.addSignalForm.value.dataDecimalPoint):null,
      defaultDisplayTypeId:this.addSignalForm.value.defaultDisplayTypeId?.defaultDisplayTypeId,
      isConnected:this.addSignalForm.value.isConnected,
      isDashboardTagged:this.addSignalForm.value.isDashboardTagged,
      isLatLong:this.addSignalForm.value.isLatLong,
      isMappingCalculationDone:this.addSignalForm.value.isMappingCalculationDone,
      logOnlyNew:this.addSignalForm.value.logOnlyNew,
      noOfBitId:this.addSignalForm.value.noOfBitId?.noOfBitId,
      plcAddress:this.addSignalForm.value.plcAddress,
      plcAddressType:this.addSignalForm.value.plcAddressType,
      sensorMax:this.addSignalForm.value.sensorMax ? parseInt(this.addSignalForm.value.sensorMax):null,
      sensorMin:this.addSignalForm.value.sensorMin ? parseInt(this.addSignalForm.value.sensorMin):null,
      signalDataTypeId:this.addSignalForm.value.signalDataTypeId?.signalDataTypeId,
      signalDescription:this.addSignalForm.value.signalDescription,
      signalId:null,
      signalEndRange:this.addSignalForm.value.signalEndRange ? parseInt(this.addSignalForm.value.signalEndRange):null ,
      signalGroupId:this.addSignalForm.value.signalGroupId?.signalGroupId ? this.addSignalForm.value.signalGroupId?.signalGroupId:null,
      signalIconId:this.addSignalForm.value.signalIconId?.signalIconId ? this.addSignalForm.value.signalIconId?.signalIconId:null,
      signalModeId:this.addSignalForm.value.signalModeId?.signalModeId,
      signalName:this.addSignalForm.value.signalName,
      multiplyFactor:this.addSignalForm.value.multiplyFactor ? parseFloat(this.addSignalForm.value.multiplyFactor):1,
      signalStartRange:this.addSignalForm.value.signalStartRange ? parseInt(this.addSignalForm.value.signalStartRange):null,
      signalType:this.addSignalForm.value.signalType,
      signalUnit:this.addSignalForm.value.signalUnit,
      tolerance:null,
      visualEffectId:null,
      // tolerance:this.addSignalForm.value.tolerance,
      // visualEffectId:this.addSignalForm.value.visualEffectId,
     
    },
    signalThresholdModels:range,
    signalBitModel: this.addSignalForm.value.signalBitModel == null ? null : {
      bitId: parseInt(this.addSignalForm.value.signalBitModel)
    }
    
   }


   console.log(range,"range values checking")
   console.log(addSignal,"addSignal data checking") 
    this._dashboardservice.addSignal(addSignal).subscribe(
    data => {
      console.log(data,"Signal API response checking");
      this.dialogRef.close({ event: 'addSignal'});
    this.showSuccess("Parameter added sucessfully") 
    },
    error => {
      console.error(error);
      this.dialogRef.close({ event: ''});
      this.showError("Parameter is not added")
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
  thresholdrangeAdd(){
    let obj = {
      thresholdValue:"",
      thresholdColor:"",
      alertRequired:null,
      isEmail:null,
      isAudio:null,
      isSms: null,
      isAlertRange: null,
     }
    // this.signalThresholdModels.push(obj);
    
  }
  rangInput(ev){  
console.log(ev,"rang checking");
  }


   thresholdrangeRemove(i){
    // this.signalThresholdModels.splice(i,1);
   }
   alertrequired(){
 
    console.log(this.quantities().controls,"alert required");
    for(let i = 0; i < this.quantities().controls.length; i++){
      if(this.quantities().controls[i].get('alertRequired').value == false){
       
        this.quantities().controls[i].get('isEmail').setValue(false);
        this.quantities().controls[i].get('isAudio').setValue(false);
        this.quantities().controls[i].get('isSms').setValue(false);
        // this.quantities().controls[i].get('isAudio') = false;
        // this.quantities().controls[i].get('isSms') = false;
      }
    }
  
  }

  alertisEmail(){
    for(let i = 0; i < this.quantities().controls.length; i++){
      if(this.quantities().controls[i].get('alertRequired').value == false){
       
        this.quantities().controls[i].get('isEmail').setValue(false);
     
      }
    }
  }
 
  
  alertisAudio(){
    for(let i = 0; i < this.quantities().controls.length; i++){
      if(this.quantities().controls[i].get('alertRequired').value == false){
       
        this.quantities().controls[i].get('isAudio').setValue(false);
       
      }
    }
  }

  
  alertisSms(){
    for(let i = 0; i < this.quantities().controls.length; i++){
      if(this.quantities().controls[i].get('alertRequired').value == false){
       
        this.quantities().controls[i].get('isSms').setValue(false);
      }
    }
  }

}    


//AddSignalPopup popup end here