import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DashboardService } from 'src/app/core/rms-services';
@Component({
  selector: 'elpis-rms-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {

  sidenavWidth = 4;
  showdrop: boolean = false
  watcher: Subscription;
  activeMediaQuery = '';
  sidenavshow: boolean = true;
  adminRole: boolean = false;
  UserRoleBase: boolean = true;
  AdminRoleBase: boolean = false;
  signalCompareShow:boolean = false;
  dashboardShow:boolean = true;
  constructor(mediaObserver: MediaObserver, public dialog: MatDialog,private _service:DashboardService) {
    this.watcher = mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
      console.log(change, "device")
      if (change.mqAlias == 'xs') {
        this.sidenavshow = false;

      }
      else {
        this.sidenavshow = true;

      }
    });
  }
  UsersRoleData;
  ngOnInit(): void {
    this.UsersRoleData = JSON.parse(sessionStorage.getItem("rmsAccount"));
    console.log(this.UsersRoleData,"------------------- user role");
    if (this.UsersRoleData != null) {
      this.UserRoleBase = (this.UsersRoleData.userRoleId == 1 || this.UsersRoleData.userRoleId == 2 || this.UsersRoleData.userRoleId == 3 ) ? true : false;
      console.log(this.UserRoleBase);
      if (this.UsersRoleData.customerId == 11 && this.UsersRoleData.userRoleId == 1 ) {
        this.dashboardShow = false;
      }
      if (this.UsersRoleData.userRoleId == 1 ) {
        this.AdminRoleBase = true;
      }
      if (this.UsersRoleData.userRoleId == 4) {
        this.signalCompareShow = true;
      }
     
    }




  }
  
  isExpanded = false;
  element: HTMLElement;
  sideNavExpand(){
    this.isExpanded = !this.isExpanded;
    this._service.petronashEmergencyClass = !this._service.petronashEmergencyClass;
  }
  toggleActive(event: any) {

    event.preventDefault();
    if (this.element !== undefined) {
      this.element.style.borderLeft = "0px solid #43425d";
      this.element.style.color = "#f5f6fa";
    }
    var target = event.currentTarget;
    target.style.backgroundColor = "#3c3b54";
    target.style.borderLeft = "6.5px solid #a3a0fb";
    target.style.color = "#a3a0fb";
    this.element = target;
  }
  toggleActiveMobile(event: any) {

    event.preventDefault();
    if (this.element !== undefined) {
      this.element.style.borderLeft = "0px solid #43425d";
      this.element.style.color = "";
      this.element.style.backgroundColor = "#43425D";
    }
    var target1 = event.currentTarget;
    target1.style.backgroundColor = "#3c3b54";
    target1.style.borderLeft = "6.5px solid #a3a0fb";
    target1.style.color = "#a3a0fb";
    this.element = target1;
    document.getElementById("mySidenav").style.width = "0";
  }
  show() {
    this.showdrop = !this.showdrop
  }

  processStatus(){
    this._service.process = true;
    this._service.pumpStatus = false;
    this._service.mangagement = false;
  }
  pumpStatus(){
    this._service.process = false;
    this._service.pumpStatus = true;
    this._service.mangagement = false;
  }
  managementStatus(){
    this._service.process = false;
    this._service.pumpStatus = false;
    this._service.mangagement = true;
  }

  //sidenav popup for mobile
  sidenavpopup() {
    const dialogRef = this.dialog.open(SidenavComponentMobile, {
      width: '90%',

      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
  }


  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }
  sidenavclosemobile() {
    alert("outsidessss")
    document.getElementById("mySidenav").style.width = "0";
  }
  clearUser() {
    let x = sessionStorage.getItem('rmsSelectedUser');
    console.log(x);
    if (x) {
      sessionStorage.removeItem('rmsSelectedUser');
    } else {
      console.log('Local not present')
    }
  }
  ngOnDestroy() {
    this.watcher.unsubscribe();
  }
}


@Component({
  selector: 'elpis-rms-sidenav-mobile',
  templateUrl: './sidenav.component-mobile.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponentMobile implements OnInit {
  isExpanded = false;
  element: HTMLElement;
  watcher: Subscription;
  activeMediaQuery = '';
  constructor(
    public dialogRef: MatDialogRef<SidenavComponentMobile>,
    mediaObserver: MediaObserver,private _service:DashboardService
  ) {
    this.watcher = mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
      console.log(change, "device")
      if (change.mqAlias != 'xs') {
        this.onNoClick();
      }
      else {

      }
    });
  }
  UsersRoleData;
  ngOnInit() {
    this.UsersRoleData = JSON.parse(sessionStorage.getItem("rmsAccount"));
    console.log(this.UsersRoleData,"-------------------");
  }
  onNoClick() {
    this.dialogRef.close(); 
  }
  

}
