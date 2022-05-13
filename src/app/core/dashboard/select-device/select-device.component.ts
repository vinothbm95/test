import { Component, OnInit, Inject, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DashboardService } from '../../rms-services/index';
import { Subscription } from 'rxjs';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { ToastrService } from 'ngx-toastr';
import { DeviceDetails, SignalDetails } from '../../rms-interfaces/index';
import { FormControl } from '@angular/forms';
import { Console } from 'console';
import { GroupResponse } from '../../rms-interfaces/dashboard/dashboard-view/group-response';
import { UserListResponse } from '../../rms-interfaces/dashboard/dashboard-view/user-list-response';
import { UserAccountModel } from '../../rms-interfaces/dashboard/dashboard-view/userAccountModelResponse';
import { AddGroupResponse } from '../../rms-interfaces/dashboard/dashboard-view/add-group-response';
import { DeviceSignalModel } from '../../rms-interfaces/dashboard/dashboard-view/device-signal-response';
//import { error } from 'console';

@Component({
  selector: 'elpis-rms-select-device',
  templateUrl: './select-device.component.html',
  styleUrls: ['./select-device.component.scss']
})
export class SelectDeviceComponent implements OnInit {
  dropdowndata =[
    {compare:'',signal:''}
  ]
  comparatorData = ['AND',
                   'OR'
                       ];
   
  parameterData = ['S1',
                   'S2',
                   'S3'
                       ];
                    
  @ViewChild('selectedDevice') inputMessageRef: ElementRef;

  devicelist: DeviceDetails[]; // For list of devices
  groups: any = [];// For list of groups
  signalModel: any;
  signalLoading: boolean;
  isLoading: boolean = false;

  // MatPaginator Inputs filter
  lowValue: number = 0;
  highValue: number = 12;

  signalDeviceName: string;
  selectedDeviceId: any;
  selectedGroup: any;
  groupChanged: boolean = false;

  // Device detection declaration 
  watcher: Subscription;
  activeMediaQuery = '';
  isMobile: boolean;
  isTab: boolean;
  isdesktop: boolean;

  /**
   * Once back as Edit device from dashboard page, 
     collected already selected data with checkbox checked for first device too
   **/
  selectedDeviceList = [];
  allSignalsChecked: boolean;  // Check all signals list variable 
  path: string;
  rmsAct: any;               // To detect URL chunk from which option redirected. Select/Custom device
  selectedUsers: any;

  // For admin, user preference configuration starts

  users = new FormControl();
  usersList: any;
  genericId;
  params;
  userdDashboard;
  currentUser;

  gridLayout;

  // User preference configuration ends

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
  itemsperpagemodel: number;
  groupList: boolean;
  returnRoute: string;
  MainTitle: string;
  bodyObj: any;
  userdGroupDashboard: boolean;
  oldGroupPreferenace = [];
  userSelected: any;
  selectedSignalShow:boolean;
  dashboardName;
  constructor(

    private router: Router, private dialog: MatDialog,
    private dashboardSVC: DashboardService,
    private route: ActivatedRoute,
    mediaObserver: MediaObserver,
    private toastr: ToastrService,
  ) {
    this.watcher = mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
      console.log(change, "device")
      if (change.mqAlias == 'xs') {
        console.log('MOBILE DEVICES');
        this.isMobile = true;
        this.isTab = false;
        this.isdesktop = false;

      } else if (change.mqAlias == 'sm') {
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

    this.params = route.snapshot;
    this.userdDashboard = this.params.url[0]?.path == 'user' ? true : false;
    this.groupList = this.params._routerState.url.split('/')[3] == 'groups' ? true : false;
    console.log(this.params._routerState.url);

    this.userdGroupDashboard = ((this.params._routerState.url.split('/')[2] == 'users') && (this.params._routerState.url.split('/')[4] == 'groups')) ? true : false;
    console.log(this.userdGroupDashboard);

  }

  ngOnInit(): void {
    /**
     * Cast subject initialization & render devices based path
     * */
    //Fork Join Required
    this.isLoading = true;
  
    let accountObject = sessionStorage.getItem('rmsAccount');
    this.rmsAct = JSON.parse(accountObject);
    console.log(this.rmsAct,"this.rmsAct select device checking");
    if(this.rmsAct?.customerId == 11){
      this.dashboardSVC.getSelectDeviceHydacApi(this.rmsAct?.customerId).subscribe(
        (data) => { 
          console.log(data,"select device data");
          this.devicelist = data;
        },
        error =>{ 
          console.log('ERROR!! Fetch user Parameters failed');
          this.toastr.error(error?.errorMessage);
          this.isLoading = false;
      } ,
      () => console.log('COMPLETE')
      );
    }else {
      this.devicelist = this.route.snapshot.data.devicelist;
    }
    
    this.isLoading = false;
    let dName = sessionStorage.getItem('dashboardName');
    this.dashboardName = dName;
    console.log(this.dashboardName,"slect device dashboard name checking");
    console.log(this.devicelist, "device list checking");

    this.route.paramMap
      .subscribe(params => this.genericId = +params.get('id'));

    if (this.userdDashboard) {
      console.log("userdDashboard checking");
      let x = sessionStorage.getItem('rmsSelectedUser');
      x = JSON.parse(x);
      console.log(x);
      this.currentUser = x;
      this.isLoading = true;
      this.returnRoute = '/dashboard/users';
      this.MainTitle = `Manage Dashboard For ${this.currentUser.firstName}`;
      this.dashboardSVC.getUserPreferenceAdmin(this.genericId).subscribe(
        (data:UserAccountModel) => {
          console.log(data,"getUserPreferenceAdmin")
          let x: any = data;
          this.isLoading = false;
          this.selectedDeviceList = JSON.parse(x.userPreference);
          this.layoutsfun(x.gridLayoutId);
        },
        error =>{ 
          console.log('ERROR!! Fetch user Parameters failed');
          this.toastr.error(error?.errorMessage);
          this.isLoading = false;
      } ,
      () => console.log('COMPLETE')
      );
      //this.getLiveSignals(this.signalGroupId);
    }
    else if (this.groupList) {
      console.log("groupList checking")
      this.isLoading = true;
      this.returnRoute = `/dashboard/md/groups/group/${this.genericId}`; //here genericId Means group Id
      this.dashboardSVC.getAllGroups().subscribe((data:AddGroupResponse[]) => {
        console.log(data,"get all groups")
        this.groups = data.filter(x => x.signalGroupId == this.genericId);
        this.MainTitle = `Manage Group Dashboard For ${this.groups[0].name}`;
        console.log(this.groups);
      }, error => {
        console.error(error);
        this.isLoading = false;
        this.toastr.error(error?.errorMessage);
      },
      () => console.log('COMPLETE')
      );
      this.dashboardSVC.getGroupPreference(this.rmsAct.userAccountId).subscribe((data:GroupResponse) => {
        this.isLoading = false;
        let groupDetails = data;
        let gData = JSON.parse(groupDetails.groupUserPreference);
        this.oldGroupPreferenace = gData != null ? gData : [];
        this.selectedDeviceList = this.oldGroupPreferenace.filter(x => x.signalModel.signalGroupId == this.genericId);
        this.layoutsfun(groupDetails.gridLayoutId);
      }, error => {
        console.error(error);
        this.isLoading = false;
        this.toastr.error(error?.errorMessage);
      },
      () => console.log('COMPLETE')
      )
      this.dashboardSVC.getUserList(this.rmsAct.customerId).subscribe(
        (data:UserListResponse[]) => {
          console.log(data)
          this.usersList = data;
        },
        error => {
          console.log('ERROR');
          this.isLoading = false;
          this.toastr.error(error?.errorMessage);
        },
        () => console.log('COMPLETE')
      );


    }

    else if (this.userdGroupDashboard) {
      console.log("userdGroupDashboard checking")
      this.userSelected = sessionStorage.getItem('rmsSelectedUser');
      this.userSelected = JSON.parse(this.userSelected);
      console.log(this.userSelected);
      this.currentUser = this.userSelected;
      this.isLoading = true;
      this.returnRoute = `/dashboard/users/md/groups/group/${this.genericId}`;
      this.dashboardSVC.getAllGroups().subscribe((data:AddGroupResponse[]) => {
        this.groups = data.filter(x => x.signalGroupId == this.genericId);
        this.MainTitle = `Manage  ${this.groups[0].name} Group Dashboard For ${this.currentUser.firstName}`;
        console.log(this.groups);
      }, error => {
        console.log('ERROR');
        this.isLoading = false;
        this.toastr.error(error?.errorMessage);
      },
      () => console.log('COMPLETE')
      );
      this.dashboardSVC.getGroupPreference(this.userSelected.userAccountId).subscribe((data:GroupResponse) => {
        this.isLoading = false;
        let groupDetails = data;
        let gData = JSON.parse(groupDetails.groupUserPreference);
        this.oldGroupPreferenace = gData != null ? gData : [];
        this.selectedDeviceList = this.oldGroupPreferenace.filter(x => x.signalModel.signalGroupId == this.genericId);
        this.layoutsfun(groupDetails.gridLayoutId);
      }, error => {
        console.log('ERROR');
        this.isLoading = false;
        this.toastr.error(error?.errorMessage);
      },
      () => console.log('COMPLETE'))
    }
    else {
      console.log("else checking")
      // userPrefrenceData
      let userPrefernce = sessionStorage.getItem('userPrefrenceData');
      console.log(userPrefernce,"userPrefernceData checking locl");
      let userPrefernceData = JSON.parse(userPrefernce);
      console.log(userPrefernceData,"userPrefernceData check")
      this.selectedSignalShow = true;
      let obj = {
        "email": "",
        "password": ""
      }
      // this.isLoading = true;
      let dummyPwd = sessionStorage.getItem('dummyPwd');
      obj.email = this.rmsAct.email;
      obj.password = dummyPwd;
      this.returnRoute = '/dashboard';
      this.MainTitle = `Manage Dashboard`;
      // .getDashboard(this.rmsAct.userAccountId)
      // this.dashboardSVC.getAllSignals(obj).subscribe(
        // this.dashboardSVC.getDashboard(this.rmsAct.userAccountId).subscribe(
        // (data) => {
        //   console.log(data,"get dashboard checking");
        //   let x: any;
        //   x = data['userAccountModel'];
          this.selectedDeviceList = Object.assign([], userPrefernceData);
          // this.layoutsfun(JSON.parse(data?.gridLayoutId));
          this.gridLayout = this.rmsAct.gridLayoutId;
          this.selectedSignalShow = false;
      //   },
      //   error => { console.error(); this.isLoading = false; },
      //   () => console.log('All signals Complete')
      // )

      // if(this.devicelist.length > 0) {
      //   this.dashboardSVC.getAllGroups().subscribe(data=>{
      //     console.log(data);
      //     this.groups =  data;
      //   });
      // }
      this.dashboardSVC.getUserList(this.rmsAct.customerId).subscribe(
        (data:UserListResponse[]) => {
          console.log(data,"user list data checking")
          this.usersList = data;
        },
        error => {
          console.log('ERROR');
          this.isLoading = false;
          this.toastr.error(error?.errorMessage);
        },
        () => console.log('COMPLETE')
      );

    }
    //this.groups = this.route.snapshot.data.devicelist;
    this.config1 = {
      id: 'selectdevice',
      itemsPerPage: 12,
      currentPage: 1,
      totalItems: this.devicelist?.length
    };
    console.log(this.config1, "pagination config checking")
    this.itemsperpagemodel = this.config1.itemsPerPage;
  }

  //pagination added
  pagechange(event) {
    this.config1.currentPage = event;
  }

  addData(){
    this.dropdowndata.push({compare:'',signal:''})
  }
  removeData(i) {
    this.dropdowndata.splice(i,1)
  }
  itemsperpage(value) {
    this.config1.currentPage = 1;
    console.log(value, "value checking");
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
  signalData(device: any, i) {
    this.signalDeviceName = device.deviceName;
    this.signalLoading = true;
    this.selectedIndex = i;
    this.dashboardSVC.getDeviceSignalDetails(device.deviceId).subscribe(
      (data:DeviceSignalModel[]) => {
        console.log(data,"getDeviceSignalDetails")
        this.signalLoading = false;
        data = data?.filter(x => x.signalModel.isLatLong != true);
        this.signalModel = data?.map(x => {
          x.isSelected = this.selectedDeviceList?.find(y => y.signalModel.signalId == x.signalModel['signalId']) ? true : x.isSelected;
          return x;
        });
        this.selectedDeviceId = device.deviceId;
        this.allSignalsChecked = this.signalModel?.length > 0 ? this.signalModel?.every(x => x.isSelected == true) : false;
        if (this.isMobile) {
          const dialogRef = this.dialog.open(mobileSignalListDialog,
            { data: this.signalModel, panelClass: 'customModalContainer' });
          dialogRef.componentInstance.passEntry.subscribe((receivedSignals) => {
            console.log(receivedSignals);
            this.submitSignals(receivedSignals)
          })
          dialogRef.afterClosed().subscribe((value) => {
            console.log('After signal' + value);
          });
        }
      },
      error => console.log(error),
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
    event.checked ? this.signalModel.map(x => x.isSelected = true) : this.signalModel.map(x => x.isSelected = false);
    this.allSignalsChecked = this.signalModel.every(x => x.isSelected == true);
    console.log(this.signalModel)
  }

  /**
   *  Once user perform event check particular signal option
   *  verify device id & signals list perform respective check opertaion   
   */
  signalChange(event, index) {
    this.signalModel[index].isSelected = event.checked;
    this.allSignalsChecked = this.signalModel.every(x => x.isSelected == true);
  }




  // On submit of apply signals collect signals data and push it to Slected devices array   
  submitSignals(signalModel) {
    console.log(signalModel)
    this.signalModel = signalModel.map(x => {
      x.signalGroupModel = x.isSelected && (this.groupList || this.userdGroupDashboard) ? this.groups[0] : x.signalGroupModel;
      x.signalModel.signalGroupId = x.isSelected && (this.groupList || this.userdGroupDashboard) ? this.groups[0].signalGroupId : x.signalModel.signalGroupId;
      return x;
    });
    console.log(this.signalModel);
    if (this.selectedDeviceList != null) {
      this.selectedDeviceList = this.selectedDeviceList.filter(x => x.deviceModel.deviceId != this.selectedDeviceId);
      let signalTrue = JSON.parse(JSON.stringify(this.signalModel.filter(x => x.isSelected == true)));
      this.selectedDeviceList = [...this.selectedDeviceList, ...signalTrue];
    } else {
      console.log('NEW FIRST SELECT');
      let selectedSignal = JSON.parse(JSON.stringify(this.signalModel.filter(x => x.isSelected == true)));
      if (selectedSignal.length > 0) {
        this.selectedDeviceList = selectedSignal;
      }
    }

    if (this.isMobile) {
      this.dialog.closeAll();
      setTimeout(() => {
        this.inputMessageRef.nativeElement.scrollIntoView({ behaviour: 'smooth', block: 'start', inline: 'nearest' });
      }, 500);
    }
    this.showSuccess('Parameter(s) added for configuratrion !!');
  }
  // On submit of selected devices, verify and service call update POST
  submitSelectedSignals() {
    console.log(this.selectedDeviceList);

    if (!(this.groupList || this.userdGroupDashboard)) {
      this.bodyObj = {
        "userAccountId": [],
        "userPreference": JSON.stringify(this.selectedDeviceList),
        "dashboardName": this.rmsAct?.customerId == 1 || this.rmsAct?.customerId == 11? this.dashboardName : null,
      }
    }
    else {
      console.log(this.oldGroupPreferenace);

      console.log(this.selectedDeviceList);

      const signal1IDs = new Set(this.oldGroupPreferenace.map((data) => {
        if (data.signalModel.signalGroupId == this.genericId) {
          return data.signalModel.signalId;
        }
      }));
      const combined = [
        ...this.selectedDeviceList,
        ...this.oldGroupPreferenace.filter((data) => !signal1IDs.has(data.signalModel.signalId))
      ];
      console.log(combined);

      this.bodyObj = {
        "userAccountId": [],
        "groupUserPreference": JSON.stringify(combined)
      }
    }
    if (this.selectedUsers?.length > 0 && this.rmsAct.userRoleId == 1) {
      console.log('THIS IS FOR ASSIGN ADMIN');
      let result = this.usersList.filter((person) => (this.selectedUsers.includes(person.firstName)));
      let ids = result.map(x => x.userAccountId);
      this.bodyObj.userAccountId = ids;
      console.log(ids)
    } else {
      let x = []
      if (this.userdDashboard && this.rmsAct.userRoleId == 1) {
        console.log('USERS SPECIFIC SUBMIT FROM USER DASBOARD');
        x.push(this.genericId);  //here genericId indicated UserAccountId
        this.bodyObj.userAccountId = x;

      }
      else if (this.userSelected && this.userdGroupDashboard && this.rmsAct.userRoleId == 1) {
        console.log('USERS SPECIFIC SUBMIT FROM USER GROUP DASBOARD');
        x.push(this.userSelected.userAccountId);
        this.bodyObj.userAccountId = x;
      }
      else {
        x.push(this.rmsAct.userAccountId);
        this.bodyObj.userAccountId = x;

      }
    }
    console.log(JSON.stringify(this.bodyObj));
    this.isLoading = true;


    if (this.groupList || this.userdGroupDashboard) {
      this.dashboardSVC.submitGroupSignals(this.bodyObj).subscribe(
        (data:GroupResponse[]) => {
          console.log(data,"submitGroupSignals");
          this.isLoading = false;
         if(this.userdGroupDashboard)
         {
          this.router.navigateByUrl(this.returnRoute);
         }
         else
         {
          if (this.bodyObj.userAccountId.includes(this.rmsAct.userAccountId)) {
            this.router.navigateByUrl(this.returnRoute);
          }
          else{
            this.returnRoute = `/dashboard/md/groups`;
            this.router.navigateByUrl(this.returnRoute)
          }
         }
        },
        error => {
          console.error(error);
          this.isLoading = false;
          this.toastr.error(error?.errorMessage)
        },
        () => console.log('group COMPLETE')
      );
    }
    else {
      this.dashboardSVC.submitSignals(this.bodyObj).subscribe(
        (data:GroupResponse[]) => {
          console.log(data,"submitSignals");
          this.isLoading = false;
          this.router.navigateByUrl(this.returnRoute);
        },
        error => {
          console.error(error);
          this.isLoading = false;
          this.toastr.error(error?.errorMessage)
        },
        () => console.log('COMPLETE')
      );
    }
  }

  // On clear remove signals from selected list & uncheck all signals
  clearSignals() {
    this.signalModel.map(x => x.isSelected = false);
    this.allSignalsChecked = this.signalModel.every(x => x.isSelected == true);
    console.log(this.signalModel);
    this.showSuccess('cleared Parameter(s), click add to configure changes !!');
  }

  cancelSignalDialog() {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      height: "200px",
      width: "400px",
      data: {
        message: 'Are you sure, want to cancel configured Parameters ?',
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      },
      panelClass: 'customModalContainer'
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.selectedDeviceList = [];
        this.showSuccess('Cleared all Parameters success, click submit to commit changes !!');

      }
    });
  }


  //grid layout  ts start
  layoutsfun(layout) {

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
    this.dashboardSVC.setGridLayout(this.rmsAct.userAccountId, gridObj).subscribe(
      (data:UserAccountModel) => {
        console.log(data, "grid layout checking")
        let gridData = data;
        this.gridLayout = gridData["gridLayoutId"];
        document.getElementById('sidebarMenu').style.transform = "translateX(350px)";
      },

      error =>{
        console.error(error);
        console.log('ERROR!! Fetch user Parameters failed');
        this.toastr.error(error?.errorMessage)
      } ,
      () => console.log('COMPLETE')


    )

    // this.gridLayout = layout;
    console.log(layout, "layout checking")
  }
  gridMenu() {
    document.getElementById('sidebarMenu').style.transform = "translateX(0px)";
  }
  closeGrid() {
    document.getElementById('sidebarMenu').style.transform = "translateX(350px)";
  }
  //grid layout ts end

  showSuccess(message: string) {
    this.toastr.success(message);
  }

  showWarning(message: string) {
    this.toastr.warning(message);   
  }

  ngOnDestroy() {
    this.watcher.unsubscribe();
  }


}

@Component({
  selector: 'confirmation-dialog',
  templateUrl: './confirmation-dialog.html',
  styleUrls: ['./select-device.component.scss']
})
export class ConfirmationDialog {
  height: "200px"
  width: "400px"
  message: string = "Are you sure?"
  confirmButtonText = "Yes"
  cancelButtonText = "Cancel"
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ConfirmationDialog>) {
    if (data) {
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
  styleUrls: ['./select-device.component.scss']
})
export class mobileSignalListDialog {
  message: string = "Are you sure?"
  confirmButtonText = "Yes"
  cancelButtonText = "Cancel"
  signalModel: any;
  signalDeviceName;
  allSignalsChecked: boolean;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<ConfirmationDialog>) {
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log(this.data);
    this.signalModel = this.data;
    this.signalDeviceName = this.signalModel[0].deviceModel.deviceName;
    this.allSignalsChecked = this.signalModel.every(x => x.isSelected == true);

  }

  submitSignals() {
    console.log(this.signalModel);
    this.passEntry.emit(this.signalModel);
    //this.dialogRef.close(true);
  }

  // On clear remove signals from selected list & uncheck all signals
  clearSignals() {
    this.signalModel.map(x => x.isSelected = false);
    this.allSignalsChecked = this.signalModel.every(x => x.isSelected == true);
    this.showSuccess('cleared Parameter(s), click add to configure changes !!');
    console.log(this.signalModel)
  }

  signalChange(event, index) {
    this.signalModel[index].isSelected = event.checked;
    this.allSignalsChecked = this.signalModel.every(x => x.isSelected == true);
    console.log(this.signalModel)
  }

  allSignals(event) {
    event.checked ? this.signalModel.map(x => x.isSelected = true) : this.signalModel.map(x => x.isSelected = false);
    this.allSignalsChecked = this.signalModel.every(x => x.isSelected == true);
    console.log(this.signalModel);
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }

  showSuccess(message: string) {
    this.toastr.success(message);
  }

}
