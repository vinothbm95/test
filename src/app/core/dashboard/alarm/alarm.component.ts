// import { Component, OnInit } from '@angular/core';
import { Component, OnInit, Inject,ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit   } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import {MatDialog,MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../rms-services';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { AlaramResponse } from '../../rms-interfaces/dashboard/dashboard-view/alarm-response';
import { AlaramTableResponse } from '../../rms-interfaces/dashboard/dashboard-view/alarm-table-response';
import { SignalModel } from '../../rms-interfaces/dashboard/dashboard-view/signalmodel';
import { DeviceModel } from '../../rms-interfaces/dashboard/dashboard-view/devicemodel';
import { signalResponse } from '../../rms-interfaces/dashboard/dashboard-view/signal-response';
@Component({
  selector: 'elpis-rms-alarm',
  templateUrl: './alarm.component.html',
  styleUrls: ['./alarm.component.scss']
})
export class AlarmComponent implements OnInit {
  rmsAct:any;
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
  p=1;
  SearchModal: any = "";
  paginationShow = false;
  showAlarm:boolean;
  // selected: {start: Dayjs, end: Dayjs};
  myForm: FormGroup
  constructor(public dialog: MatDialog,private fb: FormBuilder,
    private _Activatedroute:ActivatedRoute,private _dashboardservice:DashboardService) {
      
     }



  Search: any = "";
  TableHeader=[];
  Header=[
    {id:1,isFilter:false,hideFilter:false,name:"alarmName", key:"alarmModel",title:"Alarm name",order:1,isHide:false},
    {id:2,isFilter:false,hideFilter:false,name:"deviceName", key:"deviceModel",title:"Device name",order:2,isHide:false},
    {id:3,isFilter:false,hideFilter:false,name:"signalName", key:"signalModel",title:"Parameter name",order:3,isHide:false},
    {id:4,isFilter:false,hideFilter:false,name:"signalDescription", key:"signalModel",title:"Parameter description",order:4,isHide:false},
    {id:5,isFilter:false,hideFilter:false,name:"signalStartRange", key:"signalModel",title:"Start/Min Range",order:5,isHide:false},
    {id:6,isFilter:false,hideFilter:false,name:"signalEndRange", key:"signalModel",title:"End/Max Range",order:6,isHide:false},

  ]
  alarmData;

  ngOnInit(): void {
    if(this._Activatedroute.snapshot.paramMap.get("deviceId")) {
      console.log('From Device screen ' + this._Activatedroute.snapshot.paramMap.get("deviceId"))
    }
    // getAlarmDataApi
    this.addformval();
    this.TableHeader = this.Header;
    this.getAlarmData();
    
  }
  addformval(){
    this.myForm = this.fb.group({
      fromToDate: ['', Validators.required]
    });
  }
  onSubmit(){
    console.log(this.myForm.value,"form value checking");
  }
  displayDateRangeFormat(ev){
    console.log(ev,"parent data checking")
    console.log(this.myForm.value,"form value checking");
    // this.addformval()
  }
  getAlarmData(){
    let accountObject = sessionStorage.getItem('rmsAccount');
    // let dummyPwd = sessionStorage.getItem('dummyPwd');
    // let selectedUser = sessionStorage.getItem('rmsSelectedUser');
    this.rmsAct = JSON.parse(accountObject);
    this.showAlarm = true;
   
    this._dashboardservice.getAlarmDataApi(this.rmsAct.customerId).subscribe((data:AlaramTableResponse[]) => {
      console.log(data,"alaram data checking");
      this.showAlarm = false;
      this.alarmData = data;
      
      console.log(this.alarmData,"alarmData data checking")
      this.getPaginationConfig();
    })
  }
  async getPaginationConfig(){
    this.paginationShow = true;
    this.config ={
      id: "alaramCustom",
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.alarmData?.length
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

copyrow:any;
  copyRow(item){
  let obj = new Object();
  let obj1 = new Object();
  obj["alarmDescription"] = item.alarmWithEmailPhoneViewModel.alarmDescription;
  obj["alarmId"] = item.alarmWithEmailPhoneViewModel.alarmId;
  obj["alarmName"] = item.alarmWithEmailPhoneViewModel.alarmName+" copy" ;
  obj["deviceId"] = item.alarmWithEmailPhoneViewModel.deviceId;
  obj["emailAlarms"] = item.alarmWithEmailPhoneViewModel.emailAlarms;
  obj["isActive"] = item.alarmWithEmailPhoneViewModel.isActive;
  obj["phoneAlarms"] = item.alarmWithEmailPhoneViewModel.phoneAlarms;
  obj["signalId"] = item.alarmWithEmailPhoneViewModel.signalId;
 obj1["alarmWithEmailPhoneViewModel"] = obj;
 obj1["deviceModel"] = item.deviceModel;
 obj1["signalModel"] = item.signalModel;
  
    console.log(obj,"obj changed copy checking")
    console.log(obj1,"obj1 changed")
    this.alarmData.push(obj1)
  }
  

AlarmDeletePopup(item,i){
  console.log(item,"signal check")
  let dialogRef = this.dialog.open(AlarmDeletePopup,
      {
        width:'400px',
       // height:'400px',
       data:[item,i]
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result,"result confi close")
        if(result?.event == "delete"){
          this.getAlarmData();
        }
        else{
   
        }
   
      });
}


AlarmDetailsPopup(item){
  console.log(item,"signal check")
  this.dialog.open(AlarmDetailsPopup,
      {
        width:'1000px',
       // height:'400px',
          data:[item]
      });
}
AddAlarmPopup(status,data){
  let dialogRef = this.dialog.open(AddAlarmPopup,
    {
      width:'1300PX',
      height:'500px',
      data:[status,data]
    });
    dialogRef.afterClosed().subscribe(result => {
     console.log(result,"result confi close")
     if(result?.event == "add"){
      this.getAlarmData();
    }
    else{

    }

   });
}

}








//Alarm Delete popup start here

@Component({
  selector: 'alarm-delete-popup',
  templateUrl: './alarm-delete-popup.html',
  styleUrls: ['./alarm.component.scss']
})

export class AlarmDeletePopup implements OnInit {
  constructor(private _dashboardservice:DashboardService, private toastr: ToastrService, public dialogRef: MatDialogRef<AlarmDeletePopup>, dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: any) { }
  headerdata;
  currentdata;
  tabledata;
  index;
  showAlarm:boolean;
  ngOnInit(): void {
    this.currentdata = this.data[0];
    console.log(this.currentdata?.alarmModel?.alarmId,this.data,"popup data checking")
   
  }
  
  deleteSignal(){
    this._dashboardservice.deleteAlarmApi(this.currentdata?.alarmModel?.alarmId).subscribe(
      (data:AlaramResponse) => {
        console.log(data,"add alarm api data checking")
        this.dialogRef.close({ event: 'delete'});
        this. showSuccess("alarm deleted sucessfully!")
      },
      error => {
        console.error(error,"error checking")
        this.showError(error?.errorMessage)
        // return this.loginForm.get('email').setErrors({ 'invalid': true }), this.loginForm.get('password').setErrors({ 'invalid': true });        
      });
  }
  showSuccess(message) {
    this.toastr.success(message);
  }

  showError(message: string) {
    this.toastr.error(message);
  }

}


//Alarm Delete popup end here

//signal details popup start here

@Component({
  selector: 'alarm-details-popup',
  templateUrl: './alarm-details-popup.html',
  styleUrls: ['./alarm.component.scss']
})

export class AlarmDetailsPopup implements OnInit {

  
constructor(private _dashboardservice:DashboardService,
    public dialogRef: MatDialogRef<AlarmDetailsPopup>,
    dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: any) { }
tabledataPopup;
showSignal = true;
currentdata;
showAlarm:boolean;
ngOnInit(): void { 
    console.log(this.data,"details data checking")
    this.currentdata = this.data[0]; 
   this.getEmailPhoneData();
    // this.emailData = JSON.parse(this.tabledataPopupalarmModel?.emailThreshold)
    // console.log(this.emailData,"this.emailData checking")
}
getEmailPhoneData(){
    this.showAlarm = true;
    this._dashboardservice.getEmailPhoneDataApi(this.currentdata?.alarmModel?.alarmId).subscribe(
      (data:AlaramResponse) => {
        this.showAlarm = false;
        console.log(data,"alarm phone email data checking")
        this.tabledataPopup = data;
      })
  }

}


//signal details popup end here
//AddAlarmPopup popup start here

@Component({
  // changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'add-alarm-popup',
  templateUrl: './add-alarm-popup.html',
  styleUrls: ['./alarm.component.scss']
})

export class AddAlarmPopup implements OnInit {
  addAlarmForm: FormGroup;
  filteredDeviceOne: Observable<string[]>;
  filteredSignalOne: Observable<string[]>;
  fiteredSignalEmailThreshold;
  fiteredSignalPhoneThreshold;
  devicelist;
  signalListOne = [];
  firstDeviceSelected: any;
  deviceOneId;
  signalOneId;
  signalOneDataTable;
  fn: any;
  value: any;
  rmsAct:any;
  showAlarm:boolean;
  signalThreshold;
  emailData;
  phoneData;
  signalDetails;
  alarmDetails;
  symbolsarr = ['=','<','<=','>','>='];
  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<AddAlarmPopup >, dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: any,
  private _dashboardservice:DashboardService, private toastr: ToastrService,  private route: ActivatedRoute,private router: Router) {
   
  }
tabledata;
statusVal = "";
  ngOnInit() {
    this.statusVal = this.data[0];
    this.tabledata = this.data[1]; 
   if(this.statusVal == 'add'){
    this.getAlaramAllData();
    this.addAlarmFormVal();
    
   }
   if(this.statusVal == 'edit'){
    this._dashboardservice.getSignalById(this.tabledata?.signalModel?.signalId).subscribe(
      (data:signalResponse[]) => {
        console.log(data,"signal data checking")
        this.signalDetails = data;
      }
    )
    this.getEmailPhoneData();
    this.addAlarmFormVal();
   

    
  }

   
    
  }

  getEmailPhoneData(){
    this.showAlarm = true;
    this._dashboardservice.getEmailPhoneDataApi(this.tabledata?.alarmModel?.alarmId).subscribe(
      (data:AlaramResponse) => {
        this.showAlarm = false;
        this.emailData = data?.emailAlarmModels;
        this.phoneData = data?.phoneAlarmModels;
        console.log(data,"alarm phone email data checking")
        console.log(this.emailData,"this.emailData checking")
        this.setEditAlarmDetails();
      })
  }
  getAlaramAllData(){
    this.showAlarm = true;
   
    let accountObject = sessionStorage.getItem('rmsAccount');
    this.rmsAct = JSON.parse(accountObject);
    this._dashboardservice.getDeviceData(this.rmsAct.customerId).subscribe(
      (data: DeviceModel[]) => {
        this.showAlarm = false;
        this.devicelist = data;
        console.log(this.devicelist, "device data checking");
        this.filteredDeviceOne = this.deviceName.valueChanges
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
   if(this.devicelist > 0){
   
   }
  }
  setEditAlarmDetails(){
    console.log(this.tabledata,"this.tabledata checking")
    
    this.deviceOneId = this.tabledata?.deviceModel?.deviceId;
    this.signalOneId = this.tabledata?.signalModel?.signalId;
    this.addAlarmForm.get("alarmName").setValue(this.tabledata?.alarmModel?.alarmName);
    this.addAlarmForm.get("alarmDescription").setValue(this.tabledata?.alarmModel?.alarmDescription);
    this.addAlarmForm.get("deviceName").setValue(this.tabledata?.deviceModel?.deviceName);
    this.addAlarmForm.get("signalName").setValue(this.tabledata?.signalModel?.signalName);
    this.addAlarmForm.get("deviceName").disable();
    this.addAlarmForm.get("signalName").disable();
    this.alarmDetails = true;
  
    console.log( this.emailData,"threshold length cheking")
    if(this.emailData?.length > 0){
    for(let i = 0; i < this.emailData?.length; i++){
    this.emailThreshold().push(this.newEmailThreshold());
    } 
      setTimeout(()=>{
    for(let i = 0; i < this.emailData?.length; i++){
    //   // if(this.quantities().controls[i].get('alertRequired').value == false){
      // document.getElementById(`thresholdColor${i}`).style.backgroundColor = this.tabledata?.signalThresholdModels[i]['thresholdColor'];
        this.emailThreshold().controls[i].get('emailId').setValue(this.emailData[i]['emailId']);
        this.emailThreshold().controls[i].get('threshold').setValue(this.emailData[i]['threshold']);
        this.emailThreshold().controls[i].get('alertMessage').setValue(this.emailData[i]['alertMessage']);
        let comp = this.symbolsarr?.find(item => item == this.emailData[i]["comparer"]);
        this.emailThreshold().controls[i].get('comparer').setValue(comp);
    }
  },100)
    }else{
      this.emailThreshold().push(this.newEmailThreshold());
    }
    if(this.phoneData?.length > 0){
      for(let i = 0; i < this.phoneData?.length; i++){
      this.phoneThreshold().push(this.newPhoneThreshold());
      } 
        setTimeout(()=>{
      for(let i = 0; i < this.phoneData?.length; i++){
      //   // if(this.quantities().controls[i].get('alertRequired').value == false){
        // document.getElementById(`thresholdColor${i}`).style.backgroundColor = this.tabledata?.signalThresholdModels[i]['thresholdColor'];
          this.phoneThreshold().controls[i].get('phoneNo').setValue(this.phoneData[i]['phoneNo']);
          this.phoneThreshold().controls[i].get('threshold').setValue(this.phoneData[i]['threshold']);
          this.phoneThreshold().controls[i].get('alertMessage').setValue(this.phoneData[i]['alertMessage']);
          let comp1 = this.symbolsarr?.find(item => item == this.phoneData[i]["comparer"]);
          this.phoneThreshold().controls[i].get('comparer').setValue(comp1);
      }
    },1000)
      }else{
        this.phoneThreshold().push(this.newPhoneThreshold());
      }
      // this.getAlaramAllData();
      this.getAlaramAllData();
  }
  addAlarmFormVal() {
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.addAlarmForm = this.formBuilder.group({
      'alarmName': [null, Validators.required],
      'alarmDescription': [null, Validators.required],
      'deviceName': [null,Validators.required],
      'signalName' : [null, Validators.required],
      'emailThreshold': this.formBuilder.array([
      ]),
      'phoneThreshold': this.formBuilder.array([
      
      ]),
      
      
    });
    if(this.statusVal == 'add'){
      this.emailThreshold().push(this.newEmailThreshold());
      this.phoneThreshold().push(this.newPhoneThreshold());
    }
    if(this.statusVal == 'edit'){
    }
 
  //  setTimeout(()=>{ 
  //   this.thresholdrangeAdd();
  //  },100)

  }  
  get alarmName() {
    return this.addAlarmForm.get('alarmName') as FormControl
  }
  get alarmDescription() {
    return this.addAlarmForm.get('alarmDescription') as FormControl
  }
  get deviceName() {
    return this.addAlarmForm.get('deviceName') as FormControl
  }
  get signalName() {
    return this.addAlarmForm.get('signalName') as FormControl
  }
  emailThreshold() : FormArray {
    return this.addAlarmForm.get('emailThreshold') as FormArray
  }
 
   
  newEmailThreshold(): FormGroup {
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    
    return this.formBuilder.group({
      // 'emailId':[null,Validators.required],
      'emailId': [null, [Validators.required, Validators.pattern(emailregex)]],
      'threshold':[null,Validators.required],
      'alertMessage':[null,Validators.required],
      'comparer':[null,Validators.required]
    })
    this.emailThreshold().controls[0].get('emailId').setValue('');
    this.emailThreshold().controls[0].get('threshold').setValue(null);
    this.emailThreshold().controls[0].get('alertMessage').setValue(null);
    this.emailThreshold().controls[0].get('comparer').setValue(null);
  }
  AddemailThreshold() {
    this.emailThreshold().push(this.newEmailThreshold()); 
  }
  removeEmail(i:number) {
    this.emailThreshold().removeAt(i);
  }

  phoneThreshold() : FormArray {
    return this.addAlarmForm.get('phoneThreshold') as FormArray
  }
   
   
  newPhoneThreshold(): FormGroup {
    let mobNumberPattern: RegExp = /^((\\+91-?)|0)?[0-9]{10}$/

    return this.formBuilder.group({
      'phoneNo':[null, [Validators.required, Validators.pattern(mobNumberPattern)]],
      'threshold':[null,Validators.required],
      'alertMessage':[null,Validators.required],
      'comparer':[null,Validators.required]
    })
    this.phoneThreshold().controls[0].get('phoneThreshold').setValue('');
    this.phoneThreshold().controls[0].get('threshold').setValue(null);
    this.phoneThreshold().controls[0].get('alertMessage').setValue(null);
    this.phoneThreshold().controls[0].get('comparer').setValue(null);
  }
  AddPhoneThreshold() {
    this.phoneThreshold().push(this.newPhoneThreshold()); 
  }
  removePhone(i:number) {
    this.phoneThreshold().removeAt(i);
  }

  

  onSubmit(){

  }
  deviceSelection(device, controlName, event, id) {
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
      this._dashboardservice.getDeviceSignaldata(device.deviceId).subscribe((x:SignalModel[]) => {
        console.log(x)
        if (controlName === 'deviceName') {
          this.signalListOne = [];
          this.signalListOne = x;
          console.log(this.signalListOne,"this.signalListOne")
          console.log('Device One Id--------> ' + this.deviceOneId);
          if (this.signalListOne.length > 0) {
            this.filteredSignalOne = this.signalName.valueChanges
              .pipe(
                startWith(''),
                map(signal => this._filterSignalOne(signal)),
                tap(value => this.value = value)
              );
          }
        } else {
         
        }
      });
    }
  }

signalSelection(signal, controlName, event) {
    if (event.isUserInput) {
      console.log(signal);
      
      if (controlName === 'signalName') {
        this.showAlarm = true;
        this.signalOneId = signal?.signalId;
         this._dashboardservice.getSignalById(signal?.signalId).subscribe((res:signalResponse[]) =>{
         console.log(res,"res checking")
           this.signalDetails = res;
           console.log(this.signalDetails,"this.signalDetails checking")
           this.showAlarm = false;
           this.alarmDetails = true;
           console.log('Signal One Id--------> ' + this.signalOneId);
       })
    
   
      } else {
      }
    }
  }
  emailFilter(i){
    console.log(i,"index checking")
    this.fiteredSignalEmailThreshold = this.emailThreshold().controls[i].get('threshold').valueChanges
    .pipe(
      startWith(''),
      map(signal => this._filterSignalEmailThreshold(signal)),
      tap(value => this.value = value)
    );
  }
  phoneFilter(i){
    console.log(i,"index checking")
    
    this.fiteredSignalPhoneThreshold = this.phoneThreshold().controls[i].get('threshold').valueChanges
    .pipe(
      startWith(''),
      map(signal => this._filterSignalPhoneThreshold(signal)),
      tap(value => this.value = value)
    );
  }

  private _filterDeviceOne(value: string): any[] {
    const filterValue = value.toLowerCase();
    const results = this.devicelist.filter(device => device.deviceName.toLowerCase().includes(filterValue));
    return results.length ? results : [{ deviceName: 'No device found !' }];
  }

  private _filterSignalOne(value: string): any[] {
    const filterValue = value.toLowerCase();
    const results = this.signalListOne.filter(signal => signal.signalName.toLowerCase().includes(filterValue));
    return results.length ? results : [{ signalName: 'No signal found !' }];
  }
  _filterSignalEmailThreshold(value) { 
   
    const filterValue = value;
    const results = this.signalDetails?.signalThresholdModels.filter(signal => signal.isEmail == true && signal.thresholdValue.toString().includes(filterValue));
    return results.length ? results : [{ thresholdValue: 'No Threshold found !' }];
  }
  _filterSignalPhoneThreshold(value) {
   
    const filterValue = value;
    const results = this.signalDetails.signalThresholdModels.filter(signal => signal.isSms == true && signal.thresholdValue.toString().includes(filterValue));
    return results.length ? results : [{ thresholdValue: 'No Threshold found !' }];
  }

  _deviceSelection(option: string): { [className: string]: boolean } {
    return {
      'no-data': option === 'No device found !',
    }
  }

  _signalSelection(option: string): { [className: string]: boolean } {
    return {
      'no-data': option === 'No signal found !',
    }
  }
  _signalEmailThresoldSelection(option: any): { [className: string]: boolean } {
    return {
      'no-data': option === 'No thrshold found !',
    }
  }
  alarmSubmit(){

 if(this.statusVal == 'add'){
    let emailrange = [];
    let emailrangval = {};
    let addAlarm;
    if(this.addAlarmForm.value.emailThreshold[0]["emailId"] != undefined ){
      for(let i = 0; i < this.addAlarmForm.value.emailThreshold.length;i++){
        emailrangval ={
          emailId: this.addAlarmForm.value.emailThreshold[i]["emailId"],
          threshold:  parseInt(this.addAlarmForm.value.emailThreshold[i]["threshold"]),
          alertMessage: this.addAlarmForm.value.emailThreshold[i]["alertMessage"],
          comparer: this.addAlarmForm.value.emailThreshold[i]["comparer"]
       }
       console.log(emailrangval,"rangval checking")
       emailrange.push(emailrangval)
        }
      }else{
        emailrange = [];
      }
        console.log(emailrange,"email range checking")
        let phonerange = [];
        let phonerangval = {};
        // setTimeout(()=>{
          if(this.addAlarmForm.value.phoneThreshold[0]["phoneNo"] != undefined ){
        for(let i = 0; i < this.addAlarmForm.value.phoneThreshold.length;i++){
          phonerangval ={
            phoneNo: this.addAlarmForm.value.phoneThreshold[i]["phoneNo"],
            threshold:  parseInt(this.addAlarmForm.value.phoneThreshold[i]["threshold"]),
            alertMessage: this.addAlarmForm.value.phoneThreshold[i]["alertMessage"],
            comparer: this.addAlarmForm.value.phoneThreshold[i]["comparer"]
         }
         console.log(phonerangval,"phone rangval checking")
         phonerange.push(phonerangval)
          }
        }else{
          phonerange = []
        }
          console.log(emailrange,"range checking")
          addAlarm = {
            alarmModel: {
              alarmName: this.addAlarmForm.value.alarmName,
              alarmDescription: this.addAlarmForm.value.alarmDescription,
              deviceId: this.deviceOneId,
              signalId: this.signalOneId,
            },
            emailAlarmModels: emailrange,
            phoneAlarmModels: phonerange
          }
          console.log(addAlarm,"submit alarm checking")
          this._dashboardservice.addAlarmApi(addAlarm).subscribe(
            (data:AlaramResponse) => {
              console.log(data,"add alarm api data checking")
              this.dialogRef.close({ event: 'add'});
              this.showSuccess("alarm added Sucessfully!")
            },
            error => {
              console.error(error,"error checking")
              this.showError(error?.errorMessage)
              // return this.loginForm.get('email').setErrors({ 'invalid': true }), this.loginForm.get('password').setErrors({ 'invalid': true });        
            },
            () => console.log('COMPLETE')
      
            );
          
 }

    
    
    // setTimeout(()=>{
    
      if(this.statusVal == 'edit'){
        let addAlarm;
        let emailrange = [];
        let emailrangval = {};
        if(this.addAlarmForm.value.emailThreshold[0]["emailId"] != undefined ){
          for(let i = 0; i < this.addAlarmForm.value.emailThreshold.length;i++){
            emailrangval ={
              emailAlarmId: this.emailData[i]['emailAlarmId'],
              alarmId: this.emailData[i]['alarmId'],
              emailId: this.addAlarmForm.value.emailThreshold[i]["emailId"],
              threshold:  parseInt(this.addAlarmForm.value.emailThreshold[i]["threshold"]),
              alertMessage: this.addAlarmForm.value.emailThreshold[i]["alertMessage"],
              comparer: this.addAlarmForm.value.emailThreshold[i]["comparer"]
           }
           console.log(emailrangval,"rangval checking")
           emailrange.push(emailrangval)
            }
          }else{
            emailrange = [];
          }
            console.log(emailrange,"email range checking")
            let phonerange = [];
            let phonerangval = {};
            // setTimeout(()=>{
              if(this.addAlarmForm.value.phoneThreshold[0]["phoneNo"] != undefined ){
            for(let i = 0; i < this.addAlarmForm.value.phoneThreshold.length;i++){
              phonerangval ={
                phoneAlarmId: this.phoneData[i]['phoneAlarmId'],
                alarmId: this.phoneData[i]['alarmId'],
                phoneNo: this.addAlarmForm.value.phoneThreshold[i]["phoneNo"],
                threshold:  parseInt(this.addAlarmForm.value.phoneThreshold[i]["threshold"]),
                alertMessage: this.addAlarmForm.value.phoneThreshold[i]["alertMessage"],
                comparer: this.addAlarmForm.value.phoneThreshold[i]["comparer"]
             }
             console.log(phonerangval,"phone rangval checking")
             phonerange.push(phonerangval)
              }
            }else{
              phonerange = []
            }
              console.log(emailrange,"range checking")
        addAlarm = {
          alarmModel: {
            alarmId: this.tabledata?.alarmModel?.alarmId,
            alarmName: this.addAlarmForm.value.alarmName,
            alarmDescription: this.addAlarmForm.value.alarmDescription,
            deviceId: this.deviceOneId,
            signalId: this.signalOneId,
          },
          emailAlarmModels: emailrange,
          phoneAlarmModels: phonerange
        }
        this._dashboardservice.editAlarmApi(this.tabledata?.alarmModel?.alarmId,addAlarm).subscribe(
          (data:AlaramResponse) => {
            console.log(data,"add alarm api data checking")
            this.dialogRef.close({ event: 'add'});
            this.showSuccess("alarm updated Sucessfully!");
          },
          error => {
            console.error(error,"error checking")
            this.showError(error?.errorMessage)
            // return this.loginForm.get('email').setErrors({ 'invalid': true }), this.loginForm.get('password').setErrors({ 'invalid': true });        
          },
          () => console.log('COMPLETE')    
          );
      }
   
   
   
     
  }
  showSuccess(message) {
    this.toastr.success(message);
  }

  showError(message: string) {
    this.toastr.error(message);
  }
  //alaram code end here
 
}

     
//AddSignalPopup popup end here


