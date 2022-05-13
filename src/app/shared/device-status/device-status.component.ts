import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from 'src/app/core/rms-services';

@Component({
  selector: 'elpis-rms-device-status',
  templateUrl: './device-status.component.html',
  styleUrls: ['./device-status.component.scss']
})
export class DeviceStatusComponent implements OnInit {
  rmsAct: any;
  deviceStatusData;
  loading:boolean = false;
  constructor(public _dashboardservice: DashboardService,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loading = true;
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date+' '+time;
    console.log(dateTime, "current date time")
    let accountObject = sessionStorage.getItem('rmsAccount');
    this.rmsAct = JSON.parse(accountObject);
    this._dashboardservice.getDeviceStatusApi(this.rmsAct.customerId,dateTime).subscribe(res =>{
      console.log(res,"device staus cheking");
      this.deviceStatusData = res;
      this.loading = false;
    },
    error => {
     console.error(error);
      this.toastr.error(error?.errorMessage)
   },
   () => console.log('COMPLETE')
    )
    
  }

}
