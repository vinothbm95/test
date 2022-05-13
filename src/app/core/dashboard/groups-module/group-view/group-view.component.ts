import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
// import { DashboardService } from '../../rms-services/index';
import { DashboardService } from 'src/app/core/rms-services/index';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { MqttService } from 'src/app/core/rms-services/mqtt-service/mqtt.service';
import { GroupResponse } from 'src/app/core/rms-interfaces/dashboard/dashboard-view/group-response';
interface device {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'elpis-rms-group-view',
  templateUrl: './group-view.component.html',
  styleUrls: ['./group-view.component.scss']
})
export class GroupViewComponent implements OnInit, OnDestroy {

  signalGroupId: number;
  signalGroupName: string;
  SignalGrpList: boolean = true;
  rmsAccount;
  //signals:any;
  // dasboard declarations copy Blind starts
  moredrop: boolean = false;
  isChecked: boolean;
  inlinedevice = "";
  devicelist: device[] = [
    { value: 'Custom', viewValue: 'Custom' },
    { value: 'Bar', viewValue: 'Bar' },
    { value: 'Ruler', viewValue: 'Ruler' },
    { value: 'Gauge', viewValue: 'Gauge' }
  ];
  data;
  dashboardLoading: boolean;
  signals: any[];
  rulerseries;
  gaugeseries;
  showDelete: boolean;
  socket;
  socketSignalLive;

  // dasboard declarations copy Blind ends
  rmsAct: any;
  gridLayout;
  acountDeatils: any;
  groupPreferanceData: any;
  subscription: Subscription;
  groupTopic: any = "";
  params: any;
  userdGroupDashboard: boolean;
  returnRouteLink: any;
  selectedUser: any;
  constructor(private route: ActivatedRoute,
    private dashboardSVC: DashboardService,
    private toastr: ToastrService,
    private dialog: MatDialog, private _mqttService: MqttService) {
    this.params = route.snapshot;

    this.userdGroupDashboard = this.params._routerState.url.split('/')[2] == 'users' ? true : false;
  }

  ngOnInit(): void {

    this.acountDeatils = JSON.parse(sessionStorage.getItem("rmsAccount"))
    this.selectedUser = JSON.parse(sessionStorage.getItem("rmsSelectedUser"))
    this.SignalGrpList = (this.acountDeatils.userRoleId == 1 || this.acountDeatils.userRoleId == 2 || this.acountDeatils.userRoleId == 3) ? true : false;
    console.log(this.SignalGrpList);

    this.route.paramMap
      .subscribe(params => this.signalGroupId = +params.get('id'));
    console.log(this.signalGroupId);

    if (this.signalGroupId != undefined || this.signalGroupId != 0 || this.signalGroupId != null) {
      this.getLiveSignals(this.signalGroupId);

    }

    // this.socket = io(environment.SOCKET_ENDPOINT);
    // this.socket.on('groupsUpdate', (data: any) => {
    //   console.log(data);
    //   // var str = String.fromCharCode.apply(String, data);
    //   var str = new TextDecoder("utf-8").decode(data);
    //   console.log(str);
    //   this.socketSignalLive = JSON.parse(str);
    //   this.signals.map(x => {
    //     let result = this.socketSignalLive.filter(y => y.deviceId == x.deviceModel.deviceId && y.signalId == x.signalModel.signalId);
    //     if (result.length > 0) {
    //       x.signalDataModels[0]['dataValue'] = result[0].dataValue;
    //       x.deviceModel.dateOfInstallation = result[0].dateOfInstallation;
    //     }
    //     return x;
    //   })
    // });
  }


  subscribeMqttTopic(groupId: any, userAccountId: any) {

    this.subscription = this._mqttService.observe(d => this.onRecived(d));

    if (this.userdGroupDashboard) {
      this.groupTopic = "rms/admin/group/" + groupId + "​/user/" + userAccountId;
    }
    else {

      this.groupTopic = "rms/group/" + groupId + "/user/" + userAccountId;
    }
    this._mqttService.subscribe(this.groupTopic).finally(() => {
      console.log("from group list subscribed to topic: " + this.groupTopic);
    });
    console.log(this.groupTopic);

  }

  onRecived(data: any) {
    console.log(data);
    var decodeData: any = new TextDecoder('utf-8').decode(data.message);
    const messages: any = JSON.parse(decodeData);
    console.log(messages);
    console.log(this.signals);
    this.signals.forEach(x => {
      let result = messages.filter(y => y.deviceId == x.deviceModel.deviceId && y.signalId == x.signalModel.signalId);
      if (result.length > 0) {
        x.signalDataModels[0]['dataValue'] = result[0].dataValue;
        x.signalDataModels[0]['timeReceived'] = result[0].timeReceived;
      }
    })
    console.log(this.signals);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    console.log(this.subscription);

    if (this.subscription) {
      this.subscription.unsubscribe();

    }
    console.log(this.groupTopic);

    if (this.groupTopic) {
      this._mqttService.unsubcribe(this.groupTopic).finally(() => console.log("Unsubscribed topic is: " + this.groupTopic));
    }
  }



  getLiveSignals(groupId) {
    if (this.userdGroupDashboard) {
      this.dashboardLoading = true;
      this.returnRouteLink = "/dashboard/users/md/groups"
      this.dashboardSVC.getGroupPreference(this.selectedUser.userAccountId).subscribe((data:GroupResponse) => {
        this.dashboardLoading = false;
        let groupDetails = data;
        console.log(groupDetails);

        this.gridLayout = groupDetails.gridLayoutId;
        let gData = JSON.parse(groupDetails.groupUserPreference);
        gData = gData != null ? gData : [];
        this.signals = gData.filter(x => x.signalModel.signalGroupId == groupId);
        console.log(this.gridLayout);
        console.log(this.signals);
        this.signalGroupName = this.signals?.length > 0 ? this.signals[0].signalGroupModel.name : 'NA';
        this.subscribeMqttTopic(groupId, this.selectedUser.userAccountId);
      }, err => {
        console.error(err);
      })
    }
    else {
      this.dashboardLoading = true;
      this.returnRouteLink = "/dashboard/md/groups";
      this.dashboardSVC.getGroupPreference(this.acountDeatils.userAccountId).subscribe((data:GroupResponse) => {
        this.dashboardLoading = false;
        let groupDetails = data;
        this.gridLayout = groupDetails.gridLayoutId;
        let gData = JSON.parse(groupDetails.groupUserPreference);
        gData = gData != null ? gData : [];
        this.signals = gData.filter(x => x.signalModel.signalGroupId == groupId);
        console.log(this.gridLayout);
        console.log(this.signals);
        this.signalGroupName = this.signals?.length > 0 ? this.signals[0].signalGroupModel.name : 'NA';
        this.subscribeMqttTopic(groupId, this.acountDeatils.userAccountId);

      }, error => {
        console.error(error);
        this.dashboardLoading = false;
        this.toastr.error(error?.errorMessage)
      })
    }




    // this.dashboardSVC.getSpecificGroupSignals(groupId).subscribe(data => {
    //   console.log(data,"live data checking")
    //   this.dashboardLoading = false;
    //   this.signals = data?.map(x=>{x.isChecked = false;return x});
    //   this.signalGroupName = this.signals?.length > 0 ? this.signals[0].signalGroupModel.name : 'NA';
    //   console.log(this.signals);
    // },
    //   error => {
    //     console.error(error);
    //   },
    //   () => console.log('COMPLETE')
    // )
  }

  opensnack(text: string): void {
    console.log(text);
  }


  deviceglobalchange(device) {
    console.log(device, "device global checking");
    if (device.value == "Bar") {
      console.log("bar")
      for (let i = 0; i < this.signals.length; i++) {
        this.signals[i].widgetTypeModel.bar = true;
        this.signals[i].widgetTypeModel.rule = false;
        this.signals[i].widgetTypeModel.gauge = false;
      }
    }
    if (device.value == "Ruler") {
      for (let i = 0; i < this.signals.length; i++) {
        this.signals[i].widgetTypeModel.bar = false;
        this.signals[i].widgetTypeModel.rule = true;
        this.signals[i].widgetTypeModel.gauge = false;
      }
      console.log("Ruler")
    }
    if (device.value == "Gauge") {
      for (let i = 0; i < this.signals.length; i++) {
        this.signals[i].widgetTypeModel.bar = false;
        this.signals[i].widgetTypeModel.rule = false;
        this.signals[i].widgetTypeModel.gauge = true;
      }
      console.log("Gauge")
    }
  }

  validateDeleteParent(ev) {
    console.log(ev, "delet items checking");
    this.showDelete = this.signals.some(x => x.isChecked == true);
  }

  deleteSignal() {
    let tempDelete = this.signals.filter(x => x.isChecked != true);
    const dialogRef = this.dialog.open(DeleteSignalDialog, { data: tempDelete });
    dialogRef.afterClosed().subscribe((signals) => {
      console.log('After del confirm ' + signals);
      if (signals != null || undefined) {
        let accountObject = sessionStorage.getItem('rmsAccount');
        this.rmsAccount = JSON.parse(accountObject);
        let obj = {
          "userAccountId": this.rmsAccount.userAccountId,
          "groupUserPreference": JSON.stringify(tempDelete)
        }
        this.dashboardSVC.deleteSignals(obj).subscribe(
          data => {
            this.signals = this.signals.filter(x => x.isChecked != true);
            this.showSuccess('Delete Parameter(s) successfull');
          },
          error => {
            this.showWarning('Oops..! Deleted Parameter(s) failed, try again!');
          },
          () => {
            console.log('Delete Parameter working fine')
          });
      }
    });

    // this.dashboardSVC.deleteSignals(tempDelete);
    // this.signals = this.signals.filter(x => x.isSelected != true);
    // this.dashboardSVC.deleteSignals(tempDelete).subscribe(data => {
    //   if (data) {
    //     this.signals = this.signals.filter(x => x.isSelected != true);
    //   }
    // });

  }

  // addSignals() {
  //   const dialogRef = this.dialog.open(AddSignalDialog, {
  //     data:this.signals
  //   });
  //   dialogRef.afterClosed().subscribe(() => {
  //       this.getLiveSignals(this.signalGroupId);
  //   });
  // }


  //grid layout  ts start
  layoutsfun(layout) {
    this.dashboardLoading = true;
    this.rmsAct = JSON.parse(sessionStorage.getItem("rmsAccount"))
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
      data => {
        this.dashboardLoading = false;
        console.log(data, "grid layout checking")
        let gridData = data;
        //this.signals = data["groupUserPreference"];
        this.gridLayout = gridData["gridLayoutId"];
      
        document.getElementById('sidebarMenu').style.transform = "translateX(350px)";
      },

      error => {
        console.log('ERROR!! Fetch user Parameters failed');
        this.dashboardLoading = false;
        this.toastr.error(error?.errorMessage)
      },
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

}

@Component({
  selector: 'delete-signal-dialog',
  templateUrl: './delete-signal-dialog.html',
  styleUrls: ['./group-view.component.scss']
})
export class DeleteSignalDialog {
  toDelete = []
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<DeleteSignalDialog>) {
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.toDelete = this.data;
  }

  deleteSignal() {
    this.dialogRef.close(this.toDelete);
  }

}

// @Component({
//   selector: 'add-signal-dialog',
//   templateUrl: './add-signal-dialog.html',
//   styleUrls: ['./group-view.component.scss']
// })
// export class AddSignalDialog {
//   deviceList = [];
//   toDelete = [];
//   selectedDeviceList=[]
//   signalModel:any;
//   signalDeviceName;
//   allSignalsChecked:boolean;
//   signalLoading:boolean;
//   selectedIndex;
//   selectedDeviceId;
//   currentGroupModel;
//   rmsAct:any;

//   constructor(
//     @Inject(MAT_DIALOG_DATA) private data: any,
//     private dialogRef: MatDialogRef<DeleteSignalDialog>,
//     private dashboardSVC : DashboardService) {
//   }
//   ngOnInit(): void {
//     //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
//     //Add 'implements OnInit' to the class.
//     this.selectedDeviceList = this.data;
//     this.currentGroupModel = this.selectedDeviceList[0].signalGroupModel;
//     this.dashboardSVC.getAllDevices().subscribe(x=> {
//       this.deviceList = x;
//       console.log(this.deviceList);
//     });

//     let accountObject = sessionStorage.getItem('rmsAccount');
//     this.rmsAct = JSON.parse(accountObject);
//   }

//   signalData(device:any,i) {
//     this.signalDeviceName = device.deviceName;
//     this.signalLoading = true;
//     this.selectedIndex = i;
//     this.dashboardSVC.getDeviceSignalDetails(device.deviceId).subscribe(
//       data => {
//         this.signalLoading = false;
//         data = data.filter(x=>x.signalModel.isLatLong != true);
//         this.signalModel = data.map(x => {
//           x.isSelected = this.selectedDeviceList.find(y=>y.signalModel.signalId == x.signalModel['signalId'])?true:x.isSelected;
//         return x;
//         });
//         this.selectedDeviceId = device.deviceId;
//         this.allSignalsChecked = this.signalModel.every(x=> x.isSelected == true);
//         console.log(this.signalModel)
//         // if(this.isMobile) {
//         //   const dialogRef = this.dialog.open(mobileSignalListDialog, { data: this.signalModel });
//         //   dialogRef.componentInstance.passEntry.subscribe((receivedSignals) => {
//         //     console.log(receivedSignals);
//         //     this.submitSignals(receivedSignals)
//         //     })
//         //   dialogRef.afterClosed().subscribe((value) => {
//         //     console.log('After signal' + value);
//         //   });
//         // }
//       },
//       error => console.log(error),
//       () => console.log('Complete signal call')
//     )
//   }

//    /**
//    *  Once user perform event check all signal options
//    *  verify device id & signals list perform check opertaion
//    */
//   allSignals(event) {
//     event.checked?this.signalModel.map(x=> x.isSelected = true): this.signalModel.map(x=> x.isSelected = false);
//     this.allSignalsChecked = this.signalModel.every(x=> x.isSelected == true);
//     console.log(this.signalModel)
//   }

//   /**
//    *  Once user perform event check particular signal option
//    *  verify device id & signals list perform respective check opertaion
//    */
//   signalChange(event, index) {
//     this.signalModel[index].isSelected =  event.checked;
//     this.allSignalsChecked = this.signalModel.every(x=> x.isSelected == true);
//     console.log(this.signalModel[index])
//   }

//     // On submit of selected devices, verify and service call update POST
//     submitSelectedSignals() {
//       // let obj = {
//       //   "userExternalId": this.rmsAct.userExternalId,
//       //   "userPreference": JSON.stringify(this.selectedDeviceList)
//       // }
//       // console.log(JSON.stringify(obj));
//       // //this.isLoading = true;
//       // this.dashboardSVC.submitSignals(obj).subscribe(
//       //   data => {
//       //     console.log(data);
//       //     this.isLoading = false;
//       //     this.router.navigateByUrl('dashboard');
//       //   },
//       //   error => {
//       //     console.error(error);
//       //     this.isLoading = false;
//       //   },
//       //   () => console.log('COMPLETE')
//       // )
//     }

//     // On clear remove signals from selected list & uncheck all signals
//     clearSignals() {
//       this.signalModel.map(x=> x.isSelected = false)
//       this.allSignalsChecked = this.signalModel.every(x=> x.isSelected == true);
//       console.log(this.signalModel)
//     }


//   submitSignals(signalModel) {
//     console.log(signalModel);
//     this.signalModel = signalModel.map(x=>{
//       x.signalGroupModel = x.isSelected? this.currentGroupModel:x.signalGroupModel;
//       //x.signalModel.signalGroupId = x.isSelected && this.groupChanged ? this.selectedGroup.signalGroupId:x.signalModel.signalGroupId;
//       return x;
//     });
//     console.log(signalModel)
//     let obj = {
//       "userAccountId": this.rmsAct.userAccountId,
//       "userPreference": JSON.stringify(this.signalModel)
//     }
//     console.log(JSON.stringify(obj));
//     //this.isLoading = true;
//     this.dashboardSVC.submitSignals(obj).subscribe(
//       data => {
//         console.log(data);
//         this.dialogRef.close(this.currentGroupModel.signalGroupId);
//         //this.isLoading = false;
//         //this.router.navigateByUrl('dashboard');
//       },
//       error => {
//         console.error(error); 
//         //this.isLoading = false;
//       },
//       () => console.log('COMPLETE')
//     )
//   }




//   deleteSignal() {
//     this.dialogRef.close(this.toDelete);
//   }

// }
