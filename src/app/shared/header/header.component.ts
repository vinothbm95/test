
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { DashboardService } from 'src/app/core/rms-services/dashboard/dashboard.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { authService } from '../../core/rms-services/shared-services/auth.service';
import { clearTimeout, Time } from 'highcharts';
import { EncryptDecrypt } from '../../core/rms-services/shared-services/encryptDecrypt.service';
import { NotificationService } from '../notification-services/notification.service';
import { CustomerResponse } from 'src/app/core/rms-interfaces/dashboard/dashboard-view/customer-response';

@Component({
  selector: 'elpis-rms-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() toggleheader: EventEmitter<any> = new EventEmitter();
  watcher: Subscription;
  activeMediaQuery = '';
  AccountOlddata: any;
  compnylogoupdate: any;
  emergencystop: any;
  headertrue: boolean = true;
  sidenavshowmobile: boolean = true;
  rmsAct: any;
  inactiveDeviceData;
  licenseAct: {
    expiryDate: string
    isLicensed: boolean
    trialDuration: number
  };
  trailDownCount: string;
  counDownTimer: any;
  private notifySubscription: Subscription;
  constructor(mediaObserver: MediaObserver, private notifyService: NotificationService,private toastr: ToastrService, public dashboardservice: DashboardService, private router: Router, private toaster: ToastrService, private authServ: authService, private encrDecrService: EncryptDecrypt) {
    this.watcher = mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
      console.log(change, "device")
      if (change.mqAlias == 'xs') {
        this.sidenavshowmobile = true;

      }
      else {
        this.sidenavshowmobile = false;
      }
    });
  }

  ngOnInit(): void {
    let accountObject: any = sessionStorage.getItem('rmsAccount');
    this.rmsAct = JSON.parse(accountObject);
    // console.log(this.rmsAct,"this.rmsAct eader")     
    this.AccountOlddata = JSON.parse(accountObject);
    this.dashboardservice.getCustomerDetails(this.rmsAct.customerId).subscribe((data1:CustomerResponse) => {
        console.log(data1,"-----company data--------"); 
        this.dashboardservice.updateCompanylogo(data1?.photo);
        sessionStorage.setItem('rmsCompanyAccount', JSON.stringify(data1))
     
    },
      error => {
      console.error(error);
       this.toastr.error(error?.errorMessage)
    },
    () => console.log('COMPLETE')

    )

    let profilephoto = this.AccountOlddata?.userPhoto;
    console.log(profilephoto);
    this.dashboardservice.updateProfilePic(profilephoto);
    this.rmsAct = JSON.parse(accountObject);
    console.log(this.rmsAct,"this.rmsAct eader")
    try {
      this.licenseAct = JSON.parse(this.encrDecrService.decryptData(sessionStorage.getItem('rmsLicense')));
    } catch (e) {
      this.authServ.logOut();
      return;
    }
    if (this.licenseAct == null) {
      this.authServ.logOut();
      return;
    }
   
    if (!this.licenseAct.isLicensed) {
      this.checkInterval();

    }
    this.getInactiveDeviceData();
    this.notifySubscription = this.notifyService.observe(signal => this.onNotify(signal));

    this.notifyService.initialize();
    // let notification =JSON.parse(accountObject);
    // const userconfi:any[]=JSON.parse(notification.userPreference);
    // const item = userconfi.find(sig => sig.signalModel.signalId===289);
    // if(item) {
    //   this.headertrue=false;
    //   const dataValues:any[] = item.signalDataModels;

    //   const isEmpergency = dataValues.find(data => data.dataValue == '1');
    //   this.emergencystop=isEmpergency;
    //   console.log(isEmpergency?'Empergency' :'Not Empergency');
    // }
    // console.log(userconfi);

   
  }


  // sleep(milliseconds) {
    
  //   var start = new Date().getTime();
  //   for (var i = 0; i < 1e7; i++) {
  //     if ((new Date().getTime() - start) > milliseconds){
  //       break;
  //     }
  //   }
  // }
  getInactiveDeviceData(){
    this.dashboardservice.getInactiveDeviceDataApi(this.rmsAct.customerId).subscribe(data => {
      console.log(data);
      this.dashboardservice.inactiveDeviceData = data;
      
      console.log(this.inactiveDeviceData,"inactiveDeviceData data checking")
      
    }
    ,
     error => {
      console.error(error);
       this.toastr.error(error?.errorMessage)
    },
    () => console.log('COMPLETE')
    )  
  }
  onNotify(signal: any) {
    console.log("emergency stop-------------");    
    console.log(signal.dataValue);
    this.emergencystop = signal.dataValue == '1' || signal.dataValue === 1;
    console.log(this.emergencystop);
    
  }

  sidenavmenu() {
    this.toggleheader.emit();
  }

  logoutRms() {
    this.dashboardservice.getUserLogout(this.rmsAct.userAccountId).subscribe( data => {
        console.log(data, "logout user checking");
      },
      error => {
         console.error(error);
         this.toastr.error(error?.errorMessage)
      },
      () => console.log('COMPLETE')
    );
    this.authServ.logOut();
    if (this.counDownTimer) {
      clearTimeout(this.counDownTimer);
    }
  }

  ngOnDestroy() {
    this.watcher.unsubscribe();
    if(this.notifySubscription){
      this.notifySubscription.unsubscribe();
    }
  }

  checkInterval() {
    let dateTime = new Date().getTime();
    let expireDate = new Date(this.licenseAct.expiryDate).getTime();

    let timeDuration = expireDate - dateTime;
    let totalSeconds = timeDuration / 1000;
    let totalMinutes = totalSeconds / 60;
    let totalHours = totalMinutes / 60;

    let seconds = Math.floor(totalSeconds) % 60;
    let minutes = Math.floor(totalMinutes) % 60;
    let hours = Math.floor(totalHours) % 60;
    if ((hours > 0 && seconds > 0 && minutes > 0)) {
      this.trailDownCount = hours + ':' + minutes + ':' + seconds;
      // console.log('in header duration left:' + this.trailDownCount);
    }
    else if (hours == 0 && seconds > 0) {
      this.trailDownCount = hours + ':' + minutes + ':' + seconds;
    }

    else if (hours == 0 && minutes == 0 && seconds == 0) {
      clearTimeout(this.counDownTimer);
      return;
    }
    this.counDownTimer = setTimeout(() => {
      this.checkInterval();
    }, 1000);
  }




}
