import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from '../../rms-services/dashboard/dashboard.service';

@Component({
  selector: 'elpis-rms-user-dashboards-list',
  templateUrl: './user-dashboards-list.component.html',
  styleUrls: ['./user-dashboards-list.component.scss']
})
export class UserDashboardsListComponent implements OnInit {
  StudentProjectListTableData = []
  showDevice:boolean = false;
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
  showAlarm:boolean = false;
  itemVal = 5;
  SearchModal = "";
  // showDevice: boolean;
  paginationShow = false;

//experiment data table header start
StudentProjectListTableHeader = [
  { id: 1, isFilter: false, hideFilter: false, name: "userDashboardId", title: "ID", order: 1, isHide: false },
  { id: 2, isFilter: false, hideFilter: false, name: "userAccountId", title: "Student USN", order: 2, isHide: false },
  { id: 3, isFilter: false, hideFilter: false, name: "firstName", title: "Student Name", order: 3, isHide: false },
  { id: 4, isFilter: false, hideFilter: false, name: "dashboardName", title: "Project Name", order: 4, isHide: false },
  { id: 5, isFilter: false, hideFilter: false, name: "deviceId", title: "Device ID", order: 5, isHide: false },
  { id: 6, isFilter: false, hideFilter: false, name: "isUsed", deviceStatusKey: true , title: "Device Status", order: 6, isHide: false },
]
 
  rmsAct: any;
//experiment data table header end
  constructor(private dashboardService:DashboardService,private router:Router, private toastr: ToastrService,) { }

  ngOnInit(): void {
    let accountObject = sessionStorage.getItem('rmsAccount');
    this.rmsAct = JSON.parse(accountObject);
    console.log(this.rmsAct, "RMS Checking")
    this.getHydacUserDashboardsData();
   
    
  }
  getHydacUserDashboardsData(){
    this.showAlarm = true;
    this.dashboardService.getHydacUserDashboardsApi(this.rmsAct?.customerId).subscribe(res=>{
      console.log(res,"USER DASHBOARD res checking")
      this.StudentProjectListTableData = res;
      this.showAlarm = false;
      if(res){
        this.getPaginationConfig();
      }
      
    },
    error =>{
      console.error(error);
      console.log('ERROR!! Fetch user Parameters failed');
      this.showAlarm = true;
      this.toastr.error(error?.errorMessage)
    } ,
    () => console.log('COMPLETE'))
  }
  async getPaginationConfig() {
    this.paginationShow = true;
    this.config = {
      id: "userDashboard",
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.StudentProjectListTableData?.length
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

  studentView(item){
    sessionStorage.setItem('selectedId',item);
    this.router.navigateByUrl("/dashboard/users")
  }

 

}
