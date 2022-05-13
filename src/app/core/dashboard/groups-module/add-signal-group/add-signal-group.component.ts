import { Component, OnInit, Inject, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import {Location} from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DashboardService } from '../../../rms-services/index';
import {Subscription} from 'rxjs';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import { ToastrService } from 'ngx-toastr';

import { DeviceDetails, SignalDetails } from '../../../rms-interfaces/index';

@Component({
  selector: 'elpis-rms-add-signal-group',
  templateUrl: './add-signal-group.component.html',
  styleUrls: ['./add-signal-group.component.scss']
})
export class AddSignalGroupComponent implements OnInit {

  @ViewChild('selectedDevice') inputMessageRef: ElementRef;

  devicelist: DeviceDetails[]; // For list of devices
  groups: any = [];// For list of groups
  signalModel: any;
  signalLoading:boolean;
  isLoading:boolean = false;
  groupName:string;
  groupId:number;
  groupModel:any;
  signals=[];

  // MatPaginator Inputs filter
  lowValue: number = 0;
  highValue: number = 12;

  signalDeviceName:string;
  selectedDeviceId:any;
  selectedGroup:any;
  groupChanged:boolean = false;

  // Device detection declaration 
  watcher: Subscription;
  activeMediaQuery = '';
  isMobile:boolean;
  isTab:boolean;
  isdesktop:boolean;

  /**
   * Once back as Edit device from dashboard page, 
     collected already selected data with checkbox checked for first device too
   **/ 
  selectedDeviceList=[];
  allSignalsChecked:boolean;  // Check all signals list variable 
  path:string;
  rmsAct:any;               // To detect URL chunk from which option redirected. Select/Custom device

  //pagination added
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
  itemsperpagemodel:number;
  constructor(
    private router: Router, private dialog: MatDialog,
    private dashboardSVC : DashboardService,
    private route: ActivatedRoute,
    mediaObserver: MediaObserver,
    private _location: Location,
    private toastr: ToastrService,
    ) {
      this.watcher = mediaObserver.media$.subscribe((change: MediaChange) => {
        this.activeMediaQuery = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
        console.log(change,"device")
        if ( change.mqAlias == 'xs') {
          console.log('MOBILE DEVICES');
          this.isMobile = true;
          this.isTab = false;
          this.isdesktop = false;
  
        } else if ( change.mqAlias == 'sm' ) {
          this.isTab = true;
          this.isMobile = false;
          this.isdesktop = false;
          this.dialog.getDialogById('mat-dialog-0')?.close();
        }
        else {
          console.log('DESKTOP');
          this.isdesktop = true;
          this.isTab = false;
          this.isMobile = false;
          this.dialog.getDialogById('mat-dialog-0')?.close();
        }
      });
     }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe(params => this.groupId = +params.get('id'));
    /**
     * Cast subject initialization & render devices based path
     * */
    //Fork Join Required
    this.devicelist = this.route.snapshot.data.devicelist;
    console.log(this.devicelist,"device list checking")
    //this.groups = this.route.snapshot.data.devicelist;
    let obj ={
      "email": "sharan.g@elpis.com",
      "password": "Test123"
    }
    //this.isLoading = true;
    let accountObject = sessionStorage.getItem('rmsAccount');
    this.rmsAct = JSON.parse(accountObject);
    obj.email = this.rmsAct.email;
    obj.password = this.rmsAct.password;
    // this.dashboardSVC.getAllSignals(obj).subscribe(
    //   data => {
    //     this.isLoading = false;
    //     console.log(data);
    //     let x:any;
    //     x=data;
    //     this.selectedDeviceList = Object.assign([], JSON.parse(x.userPreference));
    //   },
    //   error => {console.error(); this.isLoading = false;},
    //   () =>  console.log('All signals Complete')
    // );

    if(this.devicelist.length > 0) {
      this.dashboardSVC.getAllGroups().subscribe(data=>{
        console.log(data);
        this.groups =  data;
        if (this.groupId != undefined || this.groupId != 0 || this.groupId != null) {
          this.groups = this.groups.filter(x=>x.signalGroupId == this.groupId);
          console.log(this.groups);
          this.groupName = this.groups[0].name;
          this.groupModel = this.groups[0];
          console.log('SignalGroupModel ----> '+ this.groupModel);
      }
      });
    }

    this.config1 ={
      id: 'selectdevice', 
      itemsPerPage: 12,
      currentPage: 1,
      totalItems: this.devicelist.length
    };
    console.log(this.config1,"pagination config checking")
    this.itemsperpagemodel = this.config1.itemsPerPage;
  }
//pagination added
pagechange(event){
    this.config1.currentPage = event;
  }


  itemsperpage(value) {
    this.config1.currentPage = 1;
    console.log(value,"value checking");
    this.config1.itemsPerPage = value;
    this.itemsperpagemodel = value;
  } 
//pagination end
   // Used to build an array of devices relevant at any given time
   public getPaginatorData(event: PageEvent): PageEvent {
    this.lowValue = event.pageIndex * event.pageSize;
    this.highValue = this.lowValue + event.pageSize;
    return event;
  }
  /**
   * Used once user click on device, pass device data to signal list subject
   * Also check respective signals are checked initially 
   */   
  selectedIndex;
  signalData(device:any,i) {
    this.signalDeviceName = device.deviceName;
    this.signalLoading = true;
    this.selectedIndex = i;
    this.dashboardSVC.getSpecificGroupSignals(this.groupId).subscribe(data=> {
      this.signals = data;
      console.log(this.signals);
    });
    this.dashboardSVC.getDeviceSignalDetails(device.deviceId).subscribe(
      data => {
        this.signalLoading = false;
        data = data.filter(x=>x.signalModel.isLatLong != true);
        this.signalModel = data.map(x => {
          x.isSelected = this.signals.find(y=>y.signalModel.signalId == x.signalModel.signalId)?true:x.isSelected;
        return x;
        });
        this.selectedDeviceId = device.deviceId;
        this.allSignalsChecked = this.signalModel.every(x=> x.isSelected == true);
        if(this.isMobile) {
          const dialogRef = this.dialog.open(mobileSignalListDialog, 
            { data: this.signalModel, panelClass:'customModalContainer' });
          dialogRef.componentInstance.passEntry.subscribe((receivedSignals) => {
            console.log(receivedSignals);
            this.submitSignals(receivedSignals)
            })
          dialogRef.afterClosed().subscribe((value) => {
            console.log('After signal' + value);           
          });
        }
      },
      error => { 
      console.log(error);
      this.signalLoading = false;
      this.toastr.error(error?.errorMessage)
      },
      () => console.log('Complete signal call')
    )
  }

  
  onGroupSelection() {
    console.log(this.selectedGroup);
    //this.signalModel.map(x=> x.isSelected?x.signalGroupModel = this.selectedGroup:'');
    this.groupChanged = true;
  }

  /**
   *  Once user perform event check all signal options
   *  verify device id & signals list perform check opertaion   
   */
  allSignals(event) {
    event.checked?this.signalModel.map(x=> x.isSelected = true): this.signalModel.map(x=> x.isSelected = false);
    this.allSignalsChecked = this.signalModel.every(x=> x.isSelected == true);
    console.log(this.signalModel)
  }

  /**
   *  Once user perform event check particular signal option
   *  verify device id & signals list perform respective check opertaion   
   */
  signalChange(event, index) {
    this.signalModel[index].isSelected =  event.checked;
    this.allSignalsChecked = this.signalModel.every(x=> x.isSelected == true);
  }

  // On submit of apply signals collect signals data and push it to Slected devices array   
  submitSignals(signalModel) {
    console.log(signalModel)
    this.signalModel = signalModel.map(x=>{
      x.signalGroupModel = x.isSelected? this.groupModel:x.signalGroupModel;
      //x.signalModel.signalGroupId = x.isSelected && this.groupChanged ? this.selectedGroup.signalGroupId:x.signalModel.signalGroupId;
      return x;
    });
    console.log(this.signalModel);
    
    // if( this.selectedDeviceList.length > 0) {
    //   this.selectedDeviceList = this.selectedDeviceList.filter(x=>x.deviceModel.deviceId != this.selectedDeviceId);
    //   let signalTrue = JSON.parse(JSON.stringify(this.signalModel.filter(x=>x.isSelected == true)));
    //   this.selectedDeviceList = [...this.selectedDeviceList,...signalTrue];
    // }else {
    //   console.log('NEW FIRST SELECT');
    //   let selectedSignal = JSON.parse(JSON.stringify(this.signalModel.filter(x=>x.isSelected == true)));
    //   if(selectedSignal.length > 0) {
    //     this.selectedDeviceList = selectedSignal;
    //   }
    // }

    if(this.isMobile) {
      this.dialog.closeAll();
      setTimeout(() => {
        this.inputMessageRef.nativeElement.scrollIntoView({behaviour : 'smooth', block: 'start', inline: 'nearest'});        
      }, 500);
    }
    let obj = {
      "userAccountId": this.rmsAct.userAccountId,
      "groupUserPreference": JSON.stringify(this.signalModel.filter(x=>x.isSelected))
    }
    this.dashboardSVC.addSignalsToGroup(obj).subscribe(data=> {
      console.log('Added signals to group ---> '+data);
      if(data) {
        this.showSuccess('New Parameter(s) added to group!');
      }else {
        this.showWarning('Something went wrong, please try again!');
      }
    })
    
  }
  // On submit of selected devices, verify and service call update POST
  submitSelectedSignals() {
    let obj = {
      "userAccountId": this.rmsAct.userAccountId,
      "groupUserPreference": JSON.stringify(this.signalModel)
    }
    console.log(JSON.stringify(obj));
    // this.isLoading = true;
    // this.dashboardSVC.submitSignals(obj).subscribe(
    //   data => {
    //     console.log(data);
    //     this.isLoading = false;
    //     this.router.navigateByUrl('dashboard');
    //   },
    //   error => {
    //     console.error(error);
    //     this.isLoading = false;
    //   },
    //   () => console.log('COMPLETE')
    // )
  }

  // On clear remove signals from selected list & uncheck all signals
  clearSignals() {
    this.signalModel.map(x=> x.isSelected = false)
    this.allSignalsChecked = this.signalModel.every(x=> x.isSelected == true);
    console.log(this.signalModel)
  }

  backToGroups() {
    this._location.back();
  }
  
  showSuccess(title:string) {
    this.toastr.success(title);
  }

  showWarning(message:string) {
    this.toastr.warning(message);
  }
 
  ngOnDestroy() {
    this.watcher.unsubscribe();
  }

}

@Component({
  selector: 'confirmation-dialog',
  templateUrl: './confirmation-dialog.html',
  styleUrls: ['./add-signal-group.component.scss']
})
export class ConfirmationDialog {
  //height:"200px"
  //width:"400px"
  message: string = "Are you sure?"
  confirmButtonText = "Yes"
  cancelButtonText = "Cancel"
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ConfirmationDialog>) {
      if(data){
    this.message = data.message || this.message;
    if (data.buttonText) {
      this.confirmButtonText = data.buttonText.ok || this.confirmButtonText;
      this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
    }
      }
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }

}

@Component({
  selector: 'mobile-signal-list-dialog',
  templateUrl: './mobile-signal-list-dialog.html',
  styleUrls: ['./add-signal-group.component.scss']
})
export class mobileSignalListDialog {
  message: string = "Are you sure?"
  confirmButtonText = "Yes"
  cancelButtonText = "Cancel"
  signalModel:any;
  signalDeviceName;
  allSignalsChecked:boolean;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ConfirmationDialog>) {
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log(this.data);
    this.signalModel = this.data;
    this.signalDeviceName = this.signalModel[0].deviceModel.deviceName;
    this.allSignalsChecked = this.signalModel.every(x=> x.isSelected == true);
    
  }

  submitSignals() {
    console.log(this.signalModel);
    this.passEntry.emit(this.signalModel);
    //this.dialogRef.close(true);
  }

  // On clear remove signals from selected list & uncheck all signals
  clearSignals() {
    this.signalModel.map(x=> x.isSelected = false)
    this.allSignalsChecked = this.signalModel.every(x=> x.isSelected == true);
    console.log(this.signalModel)
  }

  signalChange(event, index) {
    this.signalModel[index].isSelected =  event.checked;
    this.allSignalsChecked = this.signalModel.every(x=> x.isSelected == true);
    console.log(this.signalModel)
  }

  allSignals(event) {
    event.checked?this.signalModel.map(x=> x.isSelected = true): this.signalModel.map(x=> x.isSelected = false);
    this.allSignalsChecked = this.signalModel.every(x=> x.isSelected == true);
    console.log(this.signalModel);
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }

}
