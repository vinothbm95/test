import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DashboardService } from '../../rms-services/dashboard/dashboard.service';
import { authService } from '../../rms-services/shared-services/auth.service';
import { EncryptDecrypt } from '../../rms-services/shared-services/encryptDecrypt.service';
import { MqttService } from '../../rms-services/mqtt-service/mqtt.service';
import { ToastrService } from 'ngx-toastr';
import { LogingViewResponse } from '../../rms-interfaces/dashboard/dashboard-view/LoginViewResponse';
import { CustomerResponse } from '../../rms-interfaces/dashboard/dashboard-view/customer-response';

@Component({
  selector: 'elpis-rms-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isChecked: any = false;
  AccountOlddata: any;
  showLogin:boolean;
  constructor(private formBuilder: FormBuilder, public _service: DashboardService, private router: Router, private authServ: authService,
    private dashboardSVC: DashboardService, private encrDecrService: EncryptDecrypt, private mqttService: MqttService,
    private toastr: ToastrService) { }

  dummyAccounts = [
    // {firstName : 'Sharan', email : 'sharan.g@elpis.com', contact : '9880890777', password : 'Test123', userAccountId: 1},
    // {firstName : 'Abhisekhar', email : 'abhi@elpis.com', contact : '9880890764', password : 'Test11', userAccountId: 2},
    { firstName: 'Venugopal', email: 'venu.v@elpis.com', contact: '9880890734', password: 'Elpis123', userAccountId: 3 },
    { firstName: 'Samee', email: 'samee.s@elpis.com', contact: '9880490734', password: 'Elpis121', userAccountId: 4 }
  ]

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.loginForm = this.formBuilder.group({
      // 'username': ['', Validators.required],
      'email': [null, [Validators.required, Validators.pattern(emailregex)]],
      'password': ['', Validators.required],
    });
  }

  getError(el) {
    switch (el) {
      case 'email':
        return this.loginForm.get('email').hasError('required') ? 'Field is required' :
          this.loginForm.get('email').hasError('pattern') ? 'Not a valid emailaddress' :
            this.loginForm.get('email').hasError('alreadyInUse') ? 'This emailaddress is already in use' : '';
        // if (this.loginForm.get('username').hasError('required')) {
        //   return 'Username required';
        // }
        break;
      case 'pass':
        if (this.loginForm.get('password').hasError('required')) {
          return 'Password required';
        }
        break;
      default:
        return '';
    }
  }

  getErrorEmail() {
    return this.loginForm.get('email').hasError('required') ? 'Email field is required' :
      this.loginForm.get('email').hasError('pattern') ? 'Not a valid emailaddress' :
        this.loginForm.get('email').hasError('alreadyInUse') ? 'This email address is already in use' : '';
  }

  getErrorPassword() {
    return this.loginForm.get('password').hasError('required') ? 'Password field is required ' : '';
  }

  // getErrorEmail() {
  //   return this.loginForm.get('email').hasError('required') ? 'Field is required' :
  //     this.loginForm.get('email').hasError('pattern') ? 'Not a valid emailaddress' :
  //       this.loginForm.get('email').hasError('alreadyInUse') ? 'This emailaddress is already in use' : '';
  // }

  onSubmit() {
    // this.post = post;
    //console.log(post);
    this.showLogin = true;
    // console.log(this.loginForm.value);
    let email = this.loginForm.get('email').value;
    let pwd = this.loginForm.get('password').value;
    let obj = {
      email: email,
      password: pwd
    }
    console.log(obj);
    this.dashboardSVC.getUserAunthicate(obj).subscribe(
      // this.dashboardSVC.getAllSignals(obj).subscribe(
      (data:LogingViewResponse) => {
        console.log(data,"datachecking")
       

        console.log(data,"LOGIN DATA CHECKING");
        this.showLogin = false;
        sessionStorage.setItem('dummyPwd', pwd);
        sessionStorage.setItem('dummyEmail', email)
        this.loginForm.get('email').setErrors({ 'valid': true });
        this.loginForm.get('password').setErrors({ 'valid': true });
        let jwtToken = JSON.stringify(data['jwtToken']);
        sessionStorage.setItem('jwtToken',jwtToken);
        let accountDeatils = JSON.stringify(data['userAccountModel']);
        // let accountDeatils = {
        //   customerId: data?.customerId,
        //   designation: data?.designation,
        //   email: data?.email,
        //   firstName: data?.firstName,
        //   gridLayoutId: data?.gridLayoutId,
        //   lastName: data?.lastName,
        //   phoneNo: data?.phoneNo,
        //   statusTypeId: data?.statusTypeId,
        //   userAccountId: data?.userAccountId,
        //   userPhoto: data?.userPhoto,
        //   userRoleId: data?.userRoleId,
        // }
        // console.log(accountDeatils);
        // this.showSuccess("Authorized sucessfully") 
        sessionStorage.setItem('rmsAccount',accountDeatils);
        // console.log(sessionStorage.getItem('rmsAccount'),"local storage account data")
        let licenseData = JSON.stringify(this.licenseModelParcing(data['licenseModel']));
        let encryptedData = this.encrDecrService.encryptData(licenseData);
        if (encryptedData == null) {
          this.authServ.logOut();
        }
        sessionStorage.setItem('rmsLicense', encryptedData);
        if(data?.userAccountModel?.customerId == 11 && data?.userAccountModel?.userRoleId == 1){
          this.router.navigate(['/dashboard/userDashboards']);
        }else{
          this.router.navigate(['dashboard']);
        }
        
        this.authServ.autoLogOut(); 

        // this.AccountOlddata = accountDeatils;
        // let profilephoto = this.AccountOlddata.userPhoto;
        // this._service.updateProfilePic(profilephoto)
        // console.log(profilephoto);
        // console.log(this.AccountOlddata.userPhoto);
        // let CustomerId = this.AccountOlddata.customerId;



        // this._service.updateProfilePic(profilephoto)
        // console.log(obj.password);
        
        this.mqttService.connect(obj.email, obj.password).finally(() => {
          this.mqttService.isConnected = true;
          console.log("mqtt socket is connected");
        });

      },
      error => {
        this.showLogin = false;
        console.error(error,"login error checking")
        this.showError(error?.errorMessage)
        // return this.loginForm.get('email').setErrors({ 'invalid': true }), this.loginForm.get('password').setErrors({ 'invalid': true });        
      }
    )
    //   var data = this.dummyAccounts.find( function( ele ) { 
    //     return ele.email === `${email}` && ele.password === `${pwd}` && ele.firstName && ele.userAccountId;
    // } );
    //   if(data) {
    //     this.loginForm.get('email').setErrors({'valid': true});
    //     this.loginForm.get('password').setErrors({'valid': true});
    //     let tempAccount = {email : data.email, firstName : data.firstName, contact: data.contact, password : data.password, userAccountId:data.userAccountId }
    //     sessionStorage.setItem('rmsAccount',JSON.stringify(tempAccount));
    //     this.router.navigate(['dashboard']);
    //   }else {
    //     return this.loginForm.get('email').setErrors({'invalid': true}),this.loginForm.get('password').setErrors({'invalid': true});
    //   }
    //this.router.navigate(['dashboard']);

  }
  showSuccess(message) {
    this.toastr.success(message);
  }

  showError(message:string) {
    this.toastr.error(message);
  }
  onChange($event: Event) {
    console.log($event);
    console.log("value changed");

  }


  licenseModelParcing(licenseDeatils: any) {
    let licenseData: {
      expiryDate: string
      isLicensed: boolean
      trialDuration: number
    } = licenseDeatils;

    if (licenseData.isLicensed) {
      return licenseData;
    }
    else {
      let trailExpireTime = new Date();
      trailExpireTime.setTime(trailExpireTime.getTime() + /*120000 */(licenseData.trialDuration * 3600000));
      licenseData.expiryDate = trailExpireTime.toLocaleString();
      return licenseData;

    }


  }



}
