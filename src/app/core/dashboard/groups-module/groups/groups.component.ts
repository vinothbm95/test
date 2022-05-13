import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { DashboardService } from '../../rms-services/index';
import { DashboardService } from 'src/app/core/rms-services/index';
import { ToastrService } from 'ngx-toastr';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { MqttService } from 'src/app/core/rms-services/mqtt-service/mqtt.service';
import { ActivatedRoute } from '@angular/router';
import { GroupResponse } from 'src/app/core/rms-interfaces/dashboard/dashboard-view/group-response';
import { AddGroupResponse } from 'src/app/core/rms-interfaces/dashboard/dashboard-view/add-group-response';
import { UserListResponse } from 'src/app/core/rms-interfaces/dashboard/dashboard-view/user-list-response';

@Component({
  selector: 'elpis-rms-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {

  groupList = []
  users = [];
  dashboardList = [{ dashboardId: 0, DashbordName: "User Dashboard", routeLink: "/dashboard/users" }, { dashboardId: 1, DashbordName: "Group Dashboard", routeLink: "/dashboard/users/md/groups" }]
  selectedUser: any;
  groupsLoading: boolean;
  isSelected: boolean;
  showDelete: boolean;
  // Device detection declaration 
  watcher: Subscription;
  activeMediaQuery = '';
  isMobile: boolean;
  isTab: boolean;
  isdesktop: boolean;
  SignalGroupList: boolean = true;
  userdGroupDashboard: boolean;
  params: any;
  subscription: any;
  groupdashboardtopic: any;
  rmsAct: any;
  selectedDashboard: any;
  selectedUserGroup: any;
  constructor(
    private dashboardSVC: DashboardService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    mediaObserver: MediaObserver,
    private _mqttService: MqttService,
    private activatedRoute: ActivatedRoute,
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
      }
      else {
        console.log('DESKTOP');
        this.isdesktop = true;
        this.isTab = false;
        this.isMobile = false;
      }
    });
    this.params = activatedRoute.snapshot;

    this.userdGroupDashboard = this.params._routerState.url.split('/')[2] == 'users' ? true : false;
  }

  ngOnInit(): void {
    this.rmsAct = JSON.parse(sessionStorage.getItem("rmsAccount"))
    let selectedUser:any = sessionStorage.getItem('rmsSelectedUser');
    if (this.userdGroupDashboard) {
      this.groupsLoading = true;
      this.selectedDashboard = 1;
      this.dashboardSVC.getUserList(this.rmsAct.customerId).subscribe(
        (data:UserListResponse[]) => {
          this.users = data;
          console.log(selectedUser,"data checking");
          console.log(data,"data")
          
          
          if (selectedUser && this.users.length > 0) {
          
            let temp = JSON.parse(selectedUser)
            const toSelect = this.users.find(x => x.userAccountId == temp.userAccountId);
            this.selectedUser = toSelect.userAccountId;
            this.groupsLoading = false;

          }

        },
        error => {
          console.log('ERROR!! Fetch users list failed'); 
          this.groupsLoading = false;
          this.toastr.error(error?.errorMessage)
        },
        () => console.log('COMPLETE')
      );

      this.groupsLoading = true;
      // console.log(JSON.parse(selectedUser).userAccountId);
      
    if(selectedUser)
    {
      this.dashboardSVC.getGroupPreference(JSON.parse(selectedUser).userAccountId).subscribe((data:GroupResponse) => {
        console.log(data,"getGroupPreference")
        let groupDetails = data;
        let gData=JSON.parse(groupDetails.groupUserPreference);
        gData = gData!=null?gData:[];
        let signalGroups = gData.map(x => { return x.signalGroupModel });
        console.log(signalGroups);
        var filterSignalGroupArray = signalGroups.reduce((accumalator, current) => {
          if (!accumalator.some(item => item.signalGroupId === current.signalGroupId && item.name === current.name)) {
            accumalator.push(current);
          }
          return accumalator;
        }, []);
        console.log(filterSignalGroupArray);

        this.groupList = filterSignalGroupArray;
        this.groupsLoading =false;
      });
    }
    this.groupsLoading=false;

    }
    else {
      let usersignalerole: any = this.rmsAct;
      // console.log("5555555555555");
      let SignalGroupList = usersignalerole.userRoleId;
      console.log(usersignalerole.userRoleId);
      this.SignalGroupList = (usersignalerole.userRoleId == 1 || usersignalerole.userRoleId == 2 || usersignalerole.userRoleId == 3) ? true : false;
      this.groupsLoading = true;
      this.dashboardSVC.getGroupPreference(this.rmsAct.userAccountId).subscribe((data:GroupResponse) => {
        let groupDetails = data;
        console.log(groupDetails,"getGroupPreference");
        
        let gData=JSON.parse(groupDetails.groupUserPreference);
        gData = gData!=null?gData:[];
        let signalGroups = gData.map(x => { return x.signalGroupModel });
        console.log(signalGroups);
        var filterSignalGroupArray = signalGroups.reduce((accumalator, current) => {
          if (!accumalator.some(item => item.signalGroupId === current.signalGroupId && item.name === current.name)) {
            accumalator.push(current);
          }
          return accumalator;
        }, []);
        console.log(filterSignalGroupArray);

        this.groupList = filterSignalGroupArray;
        this.groupsLoading =false;
      });


    }
  }
  

  creatGroup() {
    const dialogRef = this.dialog.open(GroupDialog,
      { width:'400px',
        data: this.groupList
      });

    dialogRef.afterClosed().subscribe((group) => {
      console.log('After Sub ' + group);
      let newGroup = {
        "name": group
      }
      if (newGroup.name != null || newGroup.name != undefined) {
        if (newGroup.name.length != 0) {
          console.log(newGroup.name);
          this.dashboardSVC.addGroup(newGroup).subscribe((data:AddGroupResponse) => {
            console.log(data,"add group");
            this.groupList.push(data);
            this.showSuccess('New group created successfully!', newGroup.name);
          })
        } else {
          console.log('Empty group name')
        }
      }
    });

  }
  validateDelete() {
    this.showDelete = this.groupList.some(x => x.isSelected == true)
  }

  deleteGroup() {
    let userId:any;
    if(this.userdGroupDashboard)
    {
      console.log(this.selectedUser);
      
      userId=this.selectedUser;
    }
    else{
      userId=this.rmsAct.userAccountId;
    }
    //this.groupList = this.groupList.filter(x => x.isSelected != true);
    let tempDelete = this.groupList.filter(x => x.isSelected == true);
    const dialogRef = this.dialog.open(DeleteGroupDialog, { data: tempDelete });
    dialogRef.afterClosed().subscribe((groups) => {
      console.log('After del confirm ' + groups);
      if (groups?.length > 0 && groups != null || undefined) {
        this.dashboardSVC.deleteGroup(tempDelete,userId).subscribe((data:GroupResponse[]) => {
          console.log(data,"delete group");
        })
        this.groupList = this.groupList.filter(x => x.isSelected != true);
        this.showWarning('Deleted Group(s)!')
      }
    });
    // this.dashboardSVC.deleteGroup(tempDelete).subscribe(data => {
    //   if (data) {
    //     this.groupList = this.groupList.filter(x => x.isSelected != true);
    //   }
    // });

  }

  onUserSelection() {
    console.log(this.selectedUser);
    console.log(this.users);
    let selectedObj = this.users.find(x => x.userAccountId == this.selectedUser);
    console.log(selectedObj);
    let temp = {
      'firstName': selectedObj.firstName,
      'userAccountId': selectedObj.userAccountId,
      'userRole': selectedObj.userRoleId
    }
    sessionStorage.setItem('rmsSelectedUser', JSON.stringify(temp));
    //this.dashboardLoading = true;
    this.groupsLoading = true;
    this.dashboardSVC.getGroupPreference(temp.userAccountId).subscribe((data:GroupResponse) => {
      let groupDetails = data;
      console.log(data);
      
      let gData=JSON.parse(groupDetails.groupUserPreference);
      gData = gData!=null?gData:[];
      console.log(gData);
      
      let signalGroups = gData.map(x => { return x.signalGroupModel });
      console.log(signalGroups);
      var filterSignalGroupArray = signalGroups.reduce((accumalator, current) => {
        if (!accumalator.some(item => item.signalGroupId === current.signalGroupId && item.name === current.name)) {
          accumalator.push(current);
        }
        return accumalator;
      }, []);
      console.log(filterSignalGroupArray);

      this.groupList = filterSignalGroupArray;
      this.groupsLoading =false;
    });
  }


  onDashboardSelection() {

  }




  showSuccess(title: string, message: string) {
    this.toastr.success(title, message);
  }

  showWarning(message: string) {
    this.toastr.warning(message);
  }

  ngOnDestroy() {
    this.watcher.unsubscribe();
  }

}

@Component({
  selector: 'group-dialog',
  templateUrl: './group-dialog.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupDialog {
  groupName: string = "";
  names;
  groupNameExists: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<GroupDialog>) {
    data = JSON.parse(JSON.stringify(data));
    this.names = data.map(x => {
      return x['name'].toLowerCase();
    })
    console.log(this.names);
  }

  onGroupSubmit(): void {
    this.groupNameExists = this.names.some(value => value == this.groupName.toLowerCase());
    if (!this.groupNameExists && this.groupName.length > 0) {
      this.dialogRef.close(this.groupName);
    }
  }

}

@Component({
  selector: 'delete-group-dialog',
  templateUrl: './delete-group-dialog.html',
  styleUrls: ['./groups.component.scss']
})
export class DeleteGroupDialog {
  toDelete = []
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<DeleteGroupDialog>) {
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.toDelete = this.data;
  }

  deleteGroup() {
    this.dialogRef.close(this.toDelete);
  }

}
