import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PasswordValidator } from '../../core/access/password-validator';
import {CdkDragDrop, moveItemInArray, transferArrayItem,CdkDrag } from '@angular/cdk/drag-drop';
import {MatDialog,MatDialogRef,MatDialogConfig,MAT_DIALOG_DATA} from '@angular/material/dialog';
// import { DashboardService } from 'src/app/core/rms-services';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DashboardService } from 'src/app/core/rms-services/dashboard/dashboard.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'elpis-rms-custom-size-layout',
  templateUrl: './custom-size-layout.component.html',
  styleUrls: ['./custom-size-layout.component.scss']
})
export class CustomSizeLayoutComponent implements OnInit {
  @Input() devicedata;
  @Input() isCheckbox:boolean;
  @Input() groupSelected;
  @Output() checkboxEvent = new EventEmitter();
  // dialog: any;
  constructor(public _dashboardservice: DashboardService,private toastr: ToastrService,
    public dialog: MatDialog) { }
  TankLevelData;
  rmsAct;
  ngOnInit(): void {
    let accountObject = sessionStorage.getItem('rmsAccount');
    this.rmsAct = JSON.parse(accountObject);
    console.log(this.devicedata,"devicedata checking child")
  }
 //card style popup start
 cardBackgroundColorpopup(item,i){
  var myDivObj = document.getElementById(`device-card${i}`); 
let bgColor = window.getComputedStyle(myDivObj).backgroundColor;
let fontColor = window.getComputedStyle(myDivObj).color;
console.log(bgColor,fontColor,"colors checking");

  let dialogRef = this.dialog.open(CardStylePopup,
    {
      width:'700px',
      height:'355px',
      panelClass: 'customcardstyle',
        data:[item,i,bgColor,fontColor]
    }); 

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result?.event}`); 
      if(result?.event == "save"){
       
      console.log(result,"result checking")
      this.devicedata[ result?.data?.index].cardBackgroundColor = result?.data?.bgcode;
      this.devicedata[ result?.data?.index].cardFontColor = result?.data?.fontcolor; 
      // document.getElementById(`device-card${i}`).style.backgroundColor = result?.data?.bgcode;
      // document.getElementById(`device-card${i}`).style.color = result?.data?.fontcolor;
      }
      else{
  
      }
     
    })
    
 }
 //card style popup end
ngOnChanges(changes: SimpleChanges): void {
  let accountObject = sessionStorage.getItem('rmsAccount');
    this.rmsAct = JSON.parse(accountObject);
  
}
  onDrop(event: CdkDragDrop<any>) {   
    console.log(event,"drag drop event checking") 
    this.devicedata[event.previousContainer.data.index]={...event.container.data.item}
    this.devicedata[event.container.data.index]={...event.previousContainer.data.item}
    event.currentIndex=0;
    console.log(event.previousContainer.data,'-->',event.container.data);
    // console.log('cur -> '+event.currentIndex, 'pre -> '+event.previousIndex)
    // moveItemInArray(this.devicedata, event.previousIndex, event.currentIndex);
  }     
  validateDelete() {  
    this.checkboxEvent.emit();
  } 
  //on off start
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
    console.log(e,state,"pump click data checking")
    if(!state.disabled && confirm(`Confirm ${state.checked?'Stop':'Start'}`)){
      return;
    }else {
      e.preventDefault();
    }
  }
 
  pumpSlide(ob: MatSlideToggleChange,item) {
    ob.source.setDisabledState(true);
      this.togglePumpState(item?.signalModel?.signalId,item?.deviceModel?.deviceId, ob.checked ? 1 : 0).then((res) => {
        this.toastr.success(`${item.signalModel?.signalName} ${ob.checked?'Starting':'Stopping'}`);
      }).catch(_ => {
        this.toastr.error(`${item.signalModel?.signalName} failed to ${ob.checked?'Start':'Stop'}`);
        ob.source.toggle();
      }).finally(() => {
        ob.source.setDisabledState(false);
      });
  }

  pumpBSlide(ob: MatSlideToggleChange) {
    ob.source.setDisabledState(true);
      this.togglePumpState('PD00001s6','PD_00001', ob.checked ? 1 : 0).then((res) => {
        this.toastr.success(`O2 ${ob.checked?'Starting':'Stopping'}`);
      }).catch(_ => {
        this.toastr.error(`O2 failed to ${ob.checked?'Start':'Stop'}`);
        ob.source.toggle();
      }).finally(() => {
        ob.source.setDisabledState(false);
      });
  }

  Device1(item){
   
    item.widgetTypeModel.bar = true;
    item.widgetTypeModel.rule = false;
    item.widgetTypeModel.gauge = false;
    item.widgetTypeModel.solidGauge = false;
    item.widgetTypeModel.needlePointer = false;
    item.widgetTypeModel.rangeCustom = false;
    item.widgetTypeModel.pointerAnimation = false;
    item.widgetTypeModel.dialOn = false;
    item.widgetTypeModel.ledOn = false;
    item.widgetTypeModel.numberVal = false;
}
Device2(item){  

      item.widgetTypeModel.bar = false;
      item.widgetTypeModel.rule = true;
      item.widgetTypeModel.gauge = false;
      item.widgetTypeModel.solidGauge = false;
      item.widgetTypeModel.needlePointer = false;
      item.widgetTypeModel.rangeCustom = false;
      item.widgetTypeModel.pointerAnimation = false;
      item.widgetTypeModel.dialOn = false;
      item.widgetTypeModel.ledOn = false;
      item.widgetTypeModel.numberVal = false;
} 
Device3(item){

    item.widgetTypeModel.bar = false;
    item.widgetTypeModel.rule = false;
    item.widgetTypeModel.gauge = true;
    item.widgetTypeModel.solidGauge = false;
    item.widgetTypeModel.needlePointer = false;
    item.widgetTypeModel.rangeCustom = false;
    item.widgetTypeModel.pointerAnimation = false;
    item.widgetTypeModel.dialOn = false;
    item.widgetTypeModel.ledOn = false;
    item.widgetTypeModel.numberVal = false;
}

Device4(item){

  item.widgetTypeModel.bar = false;
  item.widgetTypeModel.rule = false;
  item.widgetTypeModel.gauge = false;
  item.widgetTypeModel.solidGauge = true;
  item.widgetTypeModel.needlePointer = false;
  item.widgetTypeModel.rangeCustom = false;
  item.widgetTypeModel.pointerAnimation = false;
  item.widgetTypeModel.dialOn = false;
  item.widgetTypeModel.ledOn = false;
  item.widgetTypeModel.numberVal = false;
}
Device5(item){

  item.widgetTypeModel.bar = false;
  item.widgetTypeModel.rule = false;
  item.widgetTypeModel.gauge = false;
  item.widgetTypeModel.solidGauge = false;
  item.widgetTypeModel.needlePointer = true;
  item.widgetTypeModel.rangeCustom = false;
  item.widgetTypeModel.pointerAnimation = false;
  item.widgetTypeModel.dialOn = false;
  item.widgetTypeModel.ledOn = false;
  item.widgetTypeModel.numberVal = false;
}
Device6(item){
item.widgetTypeModel.bar = false;
item.widgetTypeModel.rule = false;
item.widgetTypeModel.gauge = false;
item.widgetTypeModel.solidGauge = false;
item.widgetTypeModel.needlePointer = false;
item.widgetTypeModel.rangeCustom = true;
item.widgetTypeModel.pointerAnimation = false;
item.widgetTypeModel.dialOn = false;
item.widgetTypeModel.ledOn = false;
item.widgetTypeModel.numberVal = false;
}
Device7(item){
  item.widgetTypeModel.bar = false;
  item.widgetTypeModel.rule = false;
  item.widgetTypeModel.gauge = false;
  item.widgetTypeModel.solidGauge = false;
  item.widgetTypeModel.needlePointer = false;
  item.widgetTypeModel.rangeCustom = false;
  item.widgetTypeModel.pointerAnimation = true;
  item.widgetTypeModel.dialOn = false;
  item.widgetTypeModel.ledOn = false;
  item.widgetTypeModel.numberVal = false;
  }
  Device8(item){
    item.widgetTypeModel.bar = false;
    item.widgetTypeModel.rule = false;
    item.widgetTypeModel.gauge = false;
    item.widgetTypeModel.solidGauge = false;
    item.widgetTypeModel.needlePointer = false;
    item.widgetTypeModel.rangeCustom = false;
    item.widgetTypeModel.pointerAnimation = false;
    item.widgetTypeModel.dialOn = true;
    item.widgetTypeModel.ledOn = false;
    item.widgetTypeModel.numberVal = false;
    }
    Device9(item){
      item.widgetTypeModel.bar = false;
      item.widgetTypeModel.rule = false; 
      item.widgetTypeModel.gauge = false;
      item.widgetTypeModel.solidGauge = false;
      item.widgetTypeModel.needlePointer = false;
      item.widgetTypeModel.rangeCustom = false;
      item.widgetTypeModel.pointerAnimation = false;
      item.widgetTypeModel.dialOn = false;
      item.widgetTypeModel.ledOn = true;
      item.widgetTypeModel.numberVal = false;
      }
      Device10(item){
        item.widgetTypeModel.bar = false;
        item.widgetTypeModel.rule = false; 
        item.widgetTypeModel.gauge = false;
        item.widgetTypeModel.solidGauge = false;
        item.widgetTypeModel.needlePointer = false;
        item.widgetTypeModel.rangeCustom = false;
        item.widgetTypeModel.pointerAnimation = false; 
        item.widgetTypeModel.dialOn = false;
        item.widgetTypeModel.ledOn = false;
        item.widgetTypeModel.numberVal = true;
        } 
        colorcode = "#000000";
        onColorPickerSelect(ev,i){ 
          console.log(ev,i,"color checking")
        }
  deviceglobalchange(device){
    console.log(device,"device global checking");
    if(device.value == "Bar"){
      console.log("bar")
      for(let i = 0; i < this.devicedata.length; i++) {
        this.devicedata[i].widgetTypeModel.bar = true;
        this.devicedata[i].widgetTypeModel.rule = false;
        this.devicedata[i].widgetTypeModel.gauge = false;
      }
    }  
    if(device.value == "Ruler"){
      for(let i = 0; i < this.devicedata.length; i++) {
        this.devicedata[i].widgetTypeModel.bar = false;
        this.devicedata[i].widgetTypeModel.rule = true;
        this.devicedata[i].widgetTypeModel.gauge = false; 
      }
      console.log("Ruler")
    } 
    if(device.value == "Gauge"){ 
      for(let i = 0; i < this.devicedata.length; i++) {
        this.devicedata[i].widgetTypeModel.bar = false;
        this.devicedata[i].widgetTypeModel.rule = false;
        this.devicedata[i].widgetTypeModel.gauge = true;
      }
      console.log("Gauge")
    }
}
coursesPercentage;
datasize;
getProgressBarDataSize(item){
  return this.coursesPercentage = (item?.signalDataModels[0].dataValue / item?.signalModel?.signalEndRange) * 100;
 
}

getProgressBarDataPer(item){
  this.coursesPercentage = (item?.signalDataModels[0].dataValue / item?.signalModel?.signalEndRange) * 100;
  return this.datasize = this.coursesPercentage + '%';
}
//edit data value popup funcation start
editDataValuePopup(item) {
 
  // console.log(item, header, "signal check")
  let dialogRef = this.dialog.open(EditDataValuePopup,
    {
      width: '600px',
      data: item

    });

  // dialogRef.afterClosed().subscribe(result => {
  //   console.log(`Dialog result: ${result}`);
  //   if (result?.event == "deleteDevice") {
  //     this.loaddata();
  //   }
  //   else {
  //   }
  // });
}

//edit data value data funcation end

}

//card style popup start

@Component({
  selector: 'card-style-popup',
  templateUrl: './card-style-popup.html',
  styleUrls: ['./custom-size-layout.component.scss']
})
export class CardStylePopup implements OnInit {

  constructor(public dialogRef: MatDialogRef<CardStylePopup>,
     dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: any,
     private _dashboardservice:DashboardService ) { }
   currentdata;
  index;
  colorcode = "#ffffff";
  colorcode1 = "#000000";
  bgcolor = "#ffffff";
  ngOnInit(): void {
    this.currentdata = this.data[0];
    this.index = this.data[1];
    this.colorcode = this.data[2];
    this.colorcode1 = this.data[3]
   
  }
 
  onColorPickerSelect(ev: any){ 
    console.log(ev,"color checking")
    this.bgcolor = ev;
  }
  Device1(item){
   
    item.widgetTypeModel.bar = true;
    item.widgetTypeModel.rule = false;
    item.widgetTypeModel.gauge = false;
    item.widgetTypeModel.solidGauge = false;
    item.widgetTypeModel.needlePointer = false;
    item.widgetTypeModel.rangeCustom = false;
    item.widgetTypeModel.pointerAnimation = false;
    item.widgetTypeModel.dialOn = false;
    item.widgetTypeModel.ledOn = false;
    item.widgetTypeModel.numberVal = false;
}
Device2(item){  

      item.widgetTypeModel.bar = false;
      item.widgetTypeModel.rule = true;
      item.widgetTypeModel.gauge = false;
      item.widgetTypeModel.solidGauge = false;
      item.widgetTypeModel.needlePointer = false;
      item.widgetTypeModel.rangeCustom = false;
      item.widgetTypeModel.pointerAnimation = false;
      item.widgetTypeModel.dialOn = false;
      item.widgetTypeModel.ledOn = false;
      item.widgetTypeModel.numberVal = false;
} 
Device3(item){

    item.widgetTypeModel.bar = false;
    item.widgetTypeModel.rule = false;
    item.widgetTypeModel.gauge = true;
    item.widgetTypeModel.solidGauge = false;
    item.widgetTypeModel.needlePointer = false;
    item.widgetTypeModel.rangeCustom = false;
    item.widgetTypeModel.pointerAnimation = false;
    item.widgetTypeModel.dialOn = false;
    item.widgetTypeModel.ledOn = false;
    item.widgetTypeModel.numberVal = false;
}

Device4(item){

  item.widgetTypeModel.bar = false;
  item.widgetTypeModel.rule = false;
  item.widgetTypeModel.gauge = false;
  item.widgetTypeModel.solidGauge = true;
  item.widgetTypeModel.needlePointer = false;
  item.widgetTypeModel.rangeCustom = false;
  item.widgetTypeModel.pointerAnimation = false;
  item.widgetTypeModel.dialOn = false;
  item.widgetTypeModel.ledOn = false;
  item.widgetTypeModel.numberVal = false;
}
Device5(item){

  item.widgetTypeModel.bar = false;
  item.widgetTypeModel.rule = false;
  item.widgetTypeModel.gauge = false;
  item.widgetTypeModel.solidGauge = false;
  item.widgetTypeModel.needlePointer = true;
  item.widgetTypeModel.rangeCustom = false;
  item.widgetTypeModel.pointerAnimation = false;
  item.widgetTypeModel.dialOn = false;
  item.widgetTypeModel.ledOn = false;
  item.widgetTypeModel.numberVal = false;
}
Device6(item){
item.widgetTypeModel.bar = false;
item.widgetTypeModel.rule = false;
item.widgetTypeModel.gauge = false;
item.widgetTypeModel.solidGauge = false;
item.widgetTypeModel.needlePointer = false;
item.widgetTypeModel.rangeCustom = true;
item.widgetTypeModel.pointerAnimation = false;
item.widgetTypeModel.dialOn = false;
item.widgetTypeModel.ledOn = false;
item.widgetTypeModel.numberVal = false;
}
Device7(item){
  item.widgetTypeModel.bar = false;
  item.widgetTypeModel.rule = false;
  item.widgetTypeModel.gauge = false;
  item.widgetTypeModel.solidGauge = false;
  item.widgetTypeModel.needlePointer = false;
  item.widgetTypeModel.rangeCustom = false;
  item.widgetTypeModel.pointerAnimation = true;
  item.widgetTypeModel.dialOn = false;
  item.widgetTypeModel.ledOn = false;
  item.widgetTypeModel.numberVal = false;
  }
  Device8(item){
    item.widgetTypeModel.bar = false;
    item.widgetTypeModel.rule = false;
    item.widgetTypeModel.gauge = false;
    item.widgetTypeModel.solidGauge = false;
    item.widgetTypeModel.needlePointer = false;
    item.widgetTypeModel.rangeCustom = false;
    item.widgetTypeModel.pointerAnimation = false;
    item.widgetTypeModel.dialOn = true;
    item.widgetTypeModel.ledOn = false;
    item.widgetTypeModel.numberVal = false;
    }
    Device9(item){
      item.widgetTypeModel.bar = false;
      item.widgetTypeModel.rule = false; 
      item.widgetTypeModel.gauge = false;
      item.widgetTypeModel.solidGauge = false;
      item.widgetTypeModel.needlePointer = false;
      item.widgetTypeModel.rangeCustom = false;
      item.widgetTypeModel.pointerAnimation = false;
      item.widgetTypeModel.dialOn = false;
      item.widgetTypeModel.ledOn = true;
      item.widgetTypeModel.numberVal = false;
      }
      Device10(item){
        item.widgetTypeModel.bar = false;
        item.widgetTypeModel.rule = false; 
        item.widgetTypeModel.gauge = false;
        item.widgetTypeModel.solidGauge = false;
        item.widgetTypeModel.needlePointer = false;
        item.widgetTypeModel.rangeCustom = false;
        item.widgetTypeModel.pointerAnimation = false; 
        item.widgetTypeModel.dialOn = false;
        item.widgetTypeModel.ledOn = false;
        item.widgetTypeModel.numberVal = true;
        } 

        saveStyleColors(){
          this.dialogRef.close({event: "save",data:{currentdata:this.currentdata,bgcode: this.colorcode,fontcolor:this.colorcode1,index:this.index}})
        }

}

//card style popup end

//edit data value popup start

@Component({
  selector: 'edit-data-value-popup',
  templateUrl: './edit-data-value-popup.html',
  styleUrls: ['./custom-size-layout.component.scss']
})
export class EditDataValuePopup implements OnInit {
  rmsAct;
  editDatavalForm: FormGroup;
  editDatapasswordForm: FormGroup;
  signalDataTypes;
  signalDatatypeVal;
  hide4 = true;
  writeShow:boolean = false;
  constructor(public dialogRef: MatDialogRef<EditDataValuePopup>, private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any,
    private _dashboardservice: DashboardService, private formBuilder: FormBuilder, private toastr: ToastrService,
     ) { }
 
 
  ngOnInit(): void {
    let accountObject = sessionStorage.getItem('rmsAccount');
    this.rmsAct = JSON.parse(accountObject);
    console.log(this.rmsAct,this.data,"data checking");
    // this.getSignalWriteValidate();
    this.editDataValFormVal();
    this.editDatavalForm.get("dataValue").setValue(this.data?.signalDataModels[0]?.dataValue);
    this.getSignalDropdownAllData();
   
    // this.currentdata = this.data[1];
    // this.index = this.data[2];
    // this.tabledata = this.data[0]
    // console.log(this.data, "popup data checking")
  }
  getSignalWriteValidate(){
    // this.rmsAct?.userAccountId 35
    let obj= {
        userAccountId: this.rmsAct?.userAccountId,
        toWritePassword: this.editDatapasswordForm.value.confirmPassword
    }
    console.log(obj,"obj checking")
    this._dashboardservice.signalWriteValidateApi(obj).subscribe(res=>{
      console.log(res,"validation res checking");
      this.writeShow = true;
    }, error => {
      this.writeShow = false;
      console.error(error,"login error checking")
      this.toastr.error(error?.errorMessage);
      // return this.loginForm.get('email').setErrors({ 'invalid': true }), this.loginForm.get('password').setErrors({ 'invalid': true });        
    }
    )
  }
  getSignalDropdownAllData(){
    
    this._dashboardservice.getSignalDropdownApi().subscribe(
      (data) => {  
        // this.showSignal = false;
      console.log(data,"Parameter dropdown data checking");
      this.signalDataTypes = data?.signalDataTypes;
      this.signalDataTypes?.find(item =>{
        if(item.signalDataTypeId == this.data?.signalModel?.signalDataTypeId){
          this.signalDatatypeVal = item;
        }
        else{
          return ""
        }
      });
      // this.devicesData = data?.devices;
   
                // this.setEditDetails();
      },
      error => { 
        
        console.error(error);
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
  editdataSubmit(){

  }
  // 'dataValue': [null, Validators.compose([Validators.required, this.minMax])],
  editDataValFormVal() {
    // let mobNumberPattern: RegExp = /^((\\+91-?)|0)?[0-9]$/
    // , Validators.pattern(mobNumberPattern)
    this.editDatapasswordForm = this.formBuilder.group({
        'confirmPassword': ['', Validators.required],
     
    }
  
    );
    this.editDatavalForm = this.formBuilder.group({
      'dataValue': [null,[Validators.required, Validators.min(this.data?.signalModel?.signalStartRange),
        Validators.max(this.data?.signalModel?.signalEndRange)]]
      
      
    }
    // ,{ 
    //   validator: PasswordValidator.MatchPassword
    // }
    );
  }
  get dataValue() { 
    return this.editDatavalForm.get('dataValue') as FormControl
  }
  get confirmPassword() {
    return this.editDatapasswordForm.get('confirmPassword') as FormControl
  }
  checkPassword(control) {
    let enteredPassword = control.value
    let passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    return (!passwordCheck.test(enteredPassword) && enteredPassword) ? { 'requirements': true } : null;
  }

  getErrorDataval() {
    return this.editDatavalForm.get('dataValue').hasError('required') ? 'dataValue field is required' :
      // this.editDatavalForm.get('dataValue').hasError('pattern') ? 'datavalue only enter number' :
        this.editDatavalForm.get('dataValue').hasError('min') ? 'Please enter the value within specified range' : 
        this.editDatavalForm.get('dataValue').hasError('max') ? 'Please enter the value within specified range' : '';
  }
  minMax(control: FormControl) {
    return parseInt(control.value) >= this.data?.signalModel?.signalStartRange && parseInt(control.value) <= this.data?.signalModel?.signalEndRange ? null : {
      minMax: true
    }
}
  pumpSlide(item) {
    // ob.source.setDisabledState(true);
      this.togglePumpState(item?.signalModel?.signalId,item?.signalModel?.deviceId,this.editDatavalForm.value.dataValue).then((res) => {
        this.toastr.success(`${item?.signalModel?.signalName} ${this.editDatavalForm.value.dataValue == 1 ?'Starting':'Stopping'}`);
      }).catch(_ => {
        this.toastr.error(`${item?.signalModel?.signalName} to ${this.editDatavalForm.value.dataValue == 1 ?'Start':'Stop'}`);
        // ob.source.toggle();
      }).finally(() => {
        // ob.source.setDisabledState(false);
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
          this.toastr.success();
          this.dialogRef.close({ event: ''});
        }, error => {
          reject(error);
          this.dialogRef.close({ event: ''});
        });
      }
    });
  }

}
//edit data value popup end

