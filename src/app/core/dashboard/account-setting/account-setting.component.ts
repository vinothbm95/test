import { Component, OnInit, Inject, ɵConsole, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DashboardService } from '../../rms-services/dashboard/dashboard.service';
import { PasswordValidator } from '../../access/password-validator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { threadId } from 'worker_threads';
import { UserListResponse } from '../../rms-interfaces/dashboard/dashboard-view/user-list-response';
import { UserRoleResponse } from '../../rms-interfaces/dashboard/dashboard-view/user-role-response';
import { UserAccountModel } from '../../rms-interfaces/dashboard/dashboard-view/userAccountModelResponse';
import { CustomerResponse } from '../../rms-interfaces/dashboard/dashboard-view/customer-response';
import { UserRoleStatusTypeDropResponse } from '../../rms-interfaces/dashboard/dashboard-view/userRole-Status-type-response';
@Component({
  selector: 'elpis-rms-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.scss']
})

export class AccountSettingComponent implements OnInit {
  @ViewChild('resetFormGroup') private resetFromGroup: NgForm;
  @ViewChild('AdduserFormGroup') private AdduserFromGroup: NgForm;
  

  selectDisabled = true;
  adminRole: boolean = false;
  CompanyRole: boolean = true;
  hide = true;
  hide1 = true;
  hide2 = true;
  hide3 = true;
  hide4 = true;
  IsNonEditable = true;
  IsNonEditableCompany = true;
  IsNonEditableUser = true;
  accountForm: FormGroup;
  companyForm: FormGroup;
  signupForm: FormGroup;
  resetformgrp: FormGroup;
   DevicePasswordForm: FormGroup;
  // DevicePasswordFormGroup: FormGroup;
  roles;
  Username: any;
  UsernameRole: any;
  base64companyphoto: any;
  companylogo: any;
  imageFormat: string = '';
  Search: any = "";
  titleAlert: string = 'This field is required';
  activeInactiveSlide: any[] = [];
  // UserRole: boolean = false;


  accountdetails = {
    email: "",
    password: ""
  }
  Editbtn = true;
  EditButton = true;
  accountObject: { FirstName: string, LastName: string, telePhone: string, email: string, designation: string };
  companyobject: { companyName: string, companyPhone: string, email: string, companyAddress: string };
  companylogobj: { customerId: number, photo: string };

  AccountOlddata: any;
  CustomerData: any;

  Account: boolean = true;
  Company: boolean = false;
  About: boolean = false;
  addUsers: boolean = false;
  userList: boolean = false;
  ResetPaswd: boolean = false;
  DevicePassword: boolean = false;
  initialResetValue: any;
  routerdat:any;

  constructor(public dialog: MatDialog, public _service: DashboardService, public dashboardservice: DashboardService, private formBuilder: FormBuilder, private _dashboardservice: DashboardService, private router: Router, private toaster: ToastrService ) {

    // this._service.profileUrl = "../../../../assets/images/profile_picture.png";
    var value=this.router.getCurrentNavigation().extras.state;
    console.log(value);

    if(value ==undefined){
      console.log("false");
      
    }
    else if(value.example=="usrlist"){
      console.log('true');     

    this.name=value.example;
    console.log(this.name);
    
    }
  }
  name = '';

  
  // url = '';

  //user list code start
  TableHeader = [];
  Header = [
    { id: 1, name: "firstName", title: "First name", order: 1, },
    { id: 2, name: "lastName", title: "Last name", order: 2, },
    { id: 3, name: "phoneNo", title: "Contact no", order: 3, },
    { id: 4, name: "email", title: "Email", order: 4, },
    { id: 5, name: "designation", title: "Designation", order: 5, },
    { id: 6, name: "userRoleId", title: "Role", order: 6, }
  ]
  allUsersData;
  getusertsdtawithrole;
  statustype="active";


  designationDropdown = ['designation 1',
    'designation 2',
    'designation 3',
    'designation 4',
    'designation 5',
    'designation 6',
    'designation 7',
    'designation 8',
    'designation 9',
    'designation 10'];
  roleDropdown = ['role 1',
    'role 2',
    'role 3',
    'role 4',
    'role 5',
    'role 6',
    'role 7',
    'role 8',
    'role 9',
    'role 10'];


  activeuserDropdown = ['All',
    'Active Users',
    'Inactive Users'

  ];
  userFilter: any = { statusTypeId: '' };
  userStatusFun(activeUser) {
    if (activeUser == "All") {
      this.userFilter.statusTypeId = "";
    }
    if (activeUser == "Active Users") {
      this.userFilter.statusTypeId = "1";
    }
    if (activeUser == "Inactive Users") {
      this.userFilter.statusTypeId = "2";
    }
  }
  //user list code end

  options: string[] = ['One', 'Two', 'Three'];
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  imageChangedEvent: any = '';
  croppedImage: any = '';
  cropCompanyImage: boolean = false;

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    console.log(this.imageChangedEvent);
    this.cropCompanyImage = true;
    const file: File = event.target.files[0];
    console.log(file);
    var pattern = "image/*";
    const fileType = file.type;

    if (!fileType.match(pattern)) {
      alert('invalid format');
      this.cropCompanyImage = false;
      return;
    }
    this.imageFormat = fileType.substr(fileType.lastIndexOf('/') + 1);
    // var reader = new FileReader();

    // reader.onloadend = this.handleInputChange.bind(this);
    // reader.readAsDataURL(file);
  }

  // handleInputChange(files) {
  //   console.log(files);
  //   let reader = files.target;
  //   this.base64companyphoto = reader.result;
  //   console.log("__________________________________________________");

  //   console.log(this.base64companyphoto);

  // }
  onFileDropped($event) {
    // this.prepareFilesList($event);
    this.cropCompanyImage = true;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    console.log(this.croppedImage);
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  // onSelectFile(event) {
  //   if (event.target.files && event.target.files[0]) {
  //     var reader = new FileReader();

  //     reader.readAsDataURL(event.target.files[0]); // read file as data url

  //     reader.onload = (event) => { // called once readAsDataURL is completed
  //       this.url = event.target.result;
  //     }
  //   }
  // }


  ngOnInit(): void {
    this.accountFormVal();
    this.companyFormVal();
    this.createForm();
    this.ResetFormVal();

    let accountDeatils = sessionStorage.getItem('rmsAccount');
    let companyformdetails = sessionStorage.getItem('rmsCompanyAccount');
    console.log(JSON.parse(accountDeatils));
    

    this.AccountOlddata = JSON.parse(accountDeatils);

    this.CustomerData = JSON.parse(companyformdetails);

    this._service.getRoles().subscribe((data:UserRoleResponse[]) => {
      console.log(data,"get role data checking")
      this.roles = data;
    })

    // let x: any = sessionStorage.getItem('rmsAccount');
    // dat = JSON.parse(dat);
    console.log(this.AccountOlddata);

    console.log(this.AccountOlddata.customerId);
    console.log(this.AccountOlddata.firstName);

    this.Username = this.AccountOlddata.firstName;

    console.log(this.AccountOlddata.userRoleId);

    if(this.AccountOlddata?.customerId == 11){
      if (this.AccountOlddata.userRoleId === 1) {
        this.UsernameRole = "Super admin"
        console.log("admin");
  
      }
      else if (this.AccountOlddata.userRoleId === 2) {
        this.UsernameRole = "Manager"
      }
      else if (this.AccountOlddata.userRoleId === 3) {
        this.UsernameRole = "Admin"
      }
      else if (this.AccountOlddata.userRoleId == 4) {
        this.UsernameRole = "Student"
      }
    }else{
    if (this.AccountOlddata.userRoleId === 1) {
      this.UsernameRole = "Admin"
      console.log("admin");

    }
    else if (this.AccountOlddata.userRoleId === 2) {
      this.UsernameRole = "Manager"
    }
    else if (this.AccountOlddata.userRoleId === 3) {
      this.UsernameRole = "Management"
    }
    else if (this.AccountOlddata.userRoleId == 4) {
      this.UsernameRole = "Operator"
    }
  }
    if (this.AccountOlddata.userRoleId == 1) {
      this.adminRole = true;
      console.log("Role ==>" + this.adminRole);

    }
    if (this.AccountOlddata.userRoleId == 4) {
      this.CompanyRole = false;
      console.log("Role ==>" + this.CompanyRole);
    }

    this.AccountFunction();
  

  
  if(this.name=="usrlist")
    {
      this.UserList();
    }


  }
  getRoleName(name) { 
    if(this.AccountOlddata?.customerId == 11){
      if(name == "admin"){
        return "Super admin"
      }
      if(name == "Manager"){
        return "Manager"
      }
      if(name == "Management"){
        return "Admin"
      }
      if(name == "Operator"){
        return "Student"
      }
    }else{
      return name;
    }
  }
  getDisableRole(item){
    console.log(this.AccountOlddata,"rmsact")
    console.log(item,"item");
    if(this.AccountOlddata?.customerId === 11){
        if(item?.userRoleName === 'Management' || item?.userRoleName === 'Manager'){
          return true;
        }else{
          return false;
        }
    }else{
      return false;
    }
  
  }
  accountFormVal() {
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    let mobNumberPattern: RegExp = /^((\\+91-?)|0)?[0-9]{10}$/
    this.accountForm = this.formBuilder.group({
      'FirstName': [null, Validators.required],
      'LastName': [null, Validators.required],
      'telePhone': [null, [Validators.required, Validators.pattern(mobNumberPattern)]],
      'email': [null, [Validators.required, Validators.pattern(emailregex)], this.checkInUseEmail],
      'designation': [null, Validators.required],
      // 'oldPassword': [null, Validators.required],
      // 'password': [null, [Validators.required, this.checkPassword]],
      // 'confirmPassword': [null, Validators.required]
    }
      //  {
      //   validator: PasswordValidator.MatchPassword
      // }
    );

  }

  editAccountDeatils() {

    this.IsNonEditable = false;
    this.Editbtn = false;

  }

  AccountFunction() {
    this.IsNonEditable = true;
    this.Editbtn = true;
    this.Account = true;
    this.Company = false;
    this.About = false
    this.addUsers = false;
    this.userList = false;
    this.ResetPaswd = false;
    this.DevicePassword = false;

    let accountDeatils = sessionStorage.getItem('rmsAccount');
    let AccountOlddata1 = JSON.parse(accountDeatils);

    this.accountObject = {
      FirstName: AccountOlddata1["firstName"],
      LastName: AccountOlddata1["lastName"],
      telePhone: AccountOlddata1["phoneNo"],
      email: AccountOlddata1["email"],
      designation: AccountOlddata1["designation"],
    }

    this.accountForm.setValue(this.accountObject)
  }

  CompanyFunction() {
    this.cropCompanyImage = false;
    this.IsNonEditableCompany = true;
    this.EditButton = true;
    this.Company = true;
    this.Account = false;
    this.About = false;
    this.addUsers = false;
    this.userList = false;
    this.ResetPaswd = false;
    this.DevicePassword = false;

    // document.getElementsByClassName('uploadlabel').style.transform = 'translate(-50%, -100%) rotate(" + s*6 + "deg)';

    let data1 = sessionStorage.getItem('rmsCompanyAccount');
    let CustomerData1 = JSON.parse(data1);
    // this.CustomerData=CustomerData1;
    // console.log(this.CustomerData);

    this.companyobject = {
      companyName: CustomerData1["customerName"],
      companyPhone: CustomerData1["phoneNo"],
      email: CustomerData1["email"],
      companyAddress: CustomerData1["customerAddress"]
    }
    this.companyForm.setValue(this.companyobject);
  }

  SubmitAccountDeatils() {

    this.Editbtn = true;
    let AccountUpdate: any = {
      firstName: this.accountForm.value["FirstName"],
      lastName: this.accountForm.value["LastName"],
      phoneNo: this.accountForm.value["telePhone"],
      designation: this.accountForm.value["designation"],
      email: this.accountForm.value["email"],
      customerId: this.AccountOlddata["customerId"],
      userRoleId: this.AccountOlddata["userRoleId"],
      gridLayoutId: this.AccountOlddata["gridLayoutId"],
      statusTypeId: this.AccountOlddata["statusTypeId"],

    }
    console.log("-----AccountUpdate----");

    console.log(AccountUpdate);
    this._service.UpdateAccountSettings(this.AccountOlddata["userAccountId"], AccountUpdate).subscribe((data:UserAccountModel) => {
      console.log(data,"submitted account details");
      sessionStorage.setItem('rmsAccount', JSON.stringify(data));
      this.toaster.success('Account settings Updated Succesfully');

    }, err => {
      console.log(err);
      this.toaster.error('Account settings Update Failed');
      this.router.navigate(['dashboard/accountsetting']);
    },
    () => console.log('COMPLETE')
    )


  }

  applyheader() {
    console.log(this.CustomerData);
    if (this.cropCompanyImage) {
      this.companylogo = this.croppedImage;
      // console.log(this.companylogo);   
    }
    else {
      this.companylogo = this.CustomerData.photo
      console.log("+++++++++else+++++");
      console.log(this.companylogo);
    }
    let CompanyAccountUpdate: any = {
      customerId: this.CustomerData["customerId"],
      customerName: this.companyForm.value["companyName"],
      phoneNo: this.companyForm.value["companyPhone"],
      email: this.companyForm.value["email"],
      password: this.CustomerData["password"],
      customerTopic: this.CustomerData["customerTopic"],
      isActive: this.CustomerData["isActive"],
      photo: this.companylogo,
      aboutCustomer: "",
      customerAddress: this.companyForm.value["companyAddress"]
    }
    console.log(CompanyAccountUpdate);
    this._service.UpdateCompanySettings(this.CustomerData["customerId"], CompanyAccountUpdate).subscribe((data:CustomerResponse) => {
      console.log(data,"update company setting");

      sessionStorage.setItem('rmsCompanyAccount', JSON.stringify(data));
      console.log(data);
      this.cropCompanyImage = false;
      this.dashboardservice.headerurl = this.companylogo;
      this.toaster.success('Company settings Updated Succesfully');
    }, err => {
      this.cropCompanyImage = false;
      console.log(err);
      this.router.navigate(['dashboard/accountsetting']);
      this.toaster.error('Company settings Update failed');
    },
    () => console.log('COMPLETE'))

    // this._service.headerurl = this.croppedImage;
    // console.log(this._service.profileUrl, "profile setting");
  }
  editCompanyDeatils() {
    this.IsNonEditableCompany = false;
    this.EditButton = false;
  }


  companyFormVal() {
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    let mobNumberPattern: RegExp = /^((\\+91-?)|0)?[0-9]{10}$/
    this.companyForm = this.formBuilder.group({
      'companyName': [null, Validators.required],
      'companyPhone': [null, [Validators.required, Validators.pattern(mobNumberPattern)]],
      'email': [null, [Validators.required, Validators.pattern(emailregex)], this.checkInUseEmail],
      'companyAddress': [null, Validators.required]
    });
  }

  ResetFormVal() {
    this.resetformgrp = this.formBuilder.group({
      'oldPassword': [null, Validators.required],
      'password': [null, [Validators.required, this.checkPassword]],
      'confirmPassword': [null, Validators.required]
    }, {
      validator: PasswordValidator.MatchPassword
    });
    this.initialResetValue = this.resetformgrp.value;
  }

   DevicePasswordFormVal() {
    this.DevicePasswordForm = this.formBuilder.group({
      'password': [null, [Validators.required, this.checkPassword]],
      'confirmPassword': [null, Validators.required]
    }, {
      validator: PasswordValidator.MatchPassword
    });
    this.initialResetValue = this.resetformgrp.value;
  }

  get oldPasswordRP() {
    return this.resetformgrp.get('oldPassword') as FormControl
  }
  get passwordRP() {
    return this.resetformgrp.get('password') as FormControl
  }
  get confirmPasswordRP() {
    return this.resetformgrp.get('confirmPassword') as FormControl
  }

  get FirstName() {
    return this.accountForm.get('firstName') as FormControl
  }

  get LastName() {
    return this.accountForm.get('lastname') as FormControl
  }
  get telePhone() {
    return this.accountForm.get('telePhone') as FormControl
  }
  get designation() {
    return this.accountForm.get('designation') as FormControl
  }
  get oldPassword() {
    return this.accountForm.get('oldPassword') as FormControl
  }

  get companyName() {
    return this.companyForm.get('companyName') as FormControl
  }
  get companyPhone() {
    return this.companyForm.get('companyPhone') as FormControl
  }
  get companyAddress() {
    return this.companyForm.get('companyAddress') as FormControl
  }
  getErrorCompanyEmail() {
    return this.companyForm.get('email').hasError('required') ? 'Email is required' :
      this.companyForm.get('email').hasError('pattern') ? 'Not a valid emailaddress' :
        this.companyForm.get('email').hasError('alreadyInUse') ? 'This emailaddress is already in use' : '';
  }
  checkPassword(control) {
    let enteredPassword = control.value
    let passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    return (!passwordCheck.test(enteredPassword) && enteredPassword) ? { 'requirements': true } : null;
  }



  //TODO: we have to ask for validation ?
  checkInUseEmail(control) {
    // mimic http database access
    let db = ['tony@gmail.com'];
    return new Observable(observer => {
      setTimeout(() => {
        let result = (db.indexOf(control.value) !== -1) ? { 'alreadyInUse': true } : null;
        observer.next(result);
        observer.complete();
      }, 1000)
    })
  }

  getErrorEmail() {
    return this.accountForm.get('email').hasError('required') ? 'Email is required' :
      this.accountForm.get('email').hasError('pattern') ? 'Not a valid emailaddress' :
        this.accountForm.get('email').hasError('alreadyInUse') ? 'This emailaddress is already in use' : '';
  }

  getErrorPassword() {
    return this.accountForm.get('password').hasError('required') ? 'password is required (at least eight characters, one uppercase letter and one number)' :
      this.accountForm.get('password').hasError('requirements') ? 'Password needs to be at least eight characters, one uppercase letter and one number' : '';
  }

  onSubmit() {

    this.Editbtn = true;
    this.IsNonEditable = true;

  }
  NewUserSubmit() {

  }

  onNewUserSubmit() {

    console.log(this.signupForm.value);
    let rmsAct: any = JSON.parse(sessionStorage.getItem('rmsAccount'));

    console.log(rmsAct.customerId)
    let obj = {
      'firstName': this.signupForm.get('firstname').value,
      'lastName': this.signupForm.get('lastname').value,
      'phoneNo': this.signupForm.get('phoneNo').value,
      'email': this.signupForm.get('email').value,
      'password': this.signupForm.get('password').value,
      'customerId': rmsAct.customerId,
      'userRoleId': this.signupForm.get('role').value,
      'designation': this.signupForm.get('userDesignation').value,
      'statusTypeId': 1

    }
    console.log(obj);

    this._service.addNewUser(obj).subscribe(
      (data:UserAccountModel) => {
        console.log(data,'New user added SUCESS');
        this.toaster.success('New User Added Sucessfully')
        this.AdduserFromGroup.resetForm();

      },
      error => {
        console.log("failed to add user");
        this.router.navigate(['dashboard/accountsetting']);
        this.toaster.error('Failed to add user');
        this.AdduserFromGroup.resetForm();
      },
      () => console.log('COMPLETE')
    )
  }


 

  ResetPasswordField() {

    let resetpwd = {
      'oldPassword': this.resetformgrp.get('oldPassword').value,
      'newPassword': this.resetformgrp.get('confirmPassword').value
    }
    console.log(JSON.stringify(resetpwd));
    this._service.updateAccountPassword(this.AccountOlddata.userAccountId, resetpwd).subscribe(
      (data:UserAccountModel) => {
        console.log(data,"new password updated");
        this.toaster.success('New Password Updated Succesfully');
        this.resetFromGroup.resetForm();

      },
      error => {
        console.log("error in update password");
        this.router.navigate(['dashboard/accountsetting']);
        this.toaster.error('Error in Update Password ');
        this.resetFromGroup.resetForm()
      },
      () => console.log('COMPLETE')
    )    

  }

  onResetPassSubmit() {


  } 



  companySubmit() {

    this.EditButton = true;     
    this.IsNonEditableCompany = true;

  }



  AboutFunction() {
    this.About = true;
    this.Company = false;
    this.Account = false;
    this.addUsers = false;
    this.userList = false;
    this.ResetPaswd = false;
    this.DevicePassword = false;

  }
  DevicePasswordFunction(){
     this.About = false;
    this.Company = false;
    this.Account = false;
    this.addUsers = false;
    this.userList = false;
    this.ResetPaswd = false;
    this.DevicePassword = true;
    this.DevicePasswordFormVal();
  }
  onResetDevicePassSubmit(){

  }
  ResetDevicePasswordField(){

  }
  setDevicePassword(){
    console.log(this.DevicePasswordForm.value,"password che")
    let obj = {
      userAccountId: this.AccountOlddata["userAccountId"],
      toWritePassword: this.DevicePasswordForm.value.password
      }
      
      
    this.dashboardservice.getWriteDevicePassword(obj).subscribe(res=>{
      console.log(res,"password res checking");
      this.toaster.success(' Password Created Succesfully');
        
    },
    error =>{
      this.toaster.error(error?.errorMessage);
    },
    () => console.log('COMPLETE')
    )
  }

  cameraimagepopup() {
    this.dialog.open(CameraImagePopup,
      {

        data: this._service.profileUrl,
         panelClass: 'customcamerimagepopup'
      });
  }
  // Add new users starts 

  addUser() {
    this.addUsers = true;
    this.userList = false;
    this.About = false;
    this.Company = false;
    this.Account = false;
    this.ResetPaswd = false;
    this.signupForm.reset();
     this.DevicePassword = false;
  }

  // user list start
  show: boolean;
  UserList() {
    // this.show = true;
    this.userList = true;
    this.addUsers = false;
    this.About = false;
    this.Company = false;
    this.Account = false;
    this.ResetPaswd = false;
    this.DevicePassword = false;
    this.TableHeader = this.Header;
    this.signupForm.reset();
    this.getAllUsers();
 

  }

  getAllUsers() {
    this.show = true;
    let rmsAct: any = JSON.parse(sessionStorage.getItem('rmsAccount'));
    this._service.getUserList(rmsAct?.customerId).subscribe(
      (data:UserListResponse[]) => {
        this.show = false;
        console.log(data, "get all users data from api ");
        this.allUsersData = data;
        this.getusertsdtawithrole=data;
        var admin="admin";
        var Management="Management";
        var Manager="Manager";
        var Operator="Operator";
        this.getusertsdtawithrole.forEach(userrole => {
          if(userrole.userRoleId==1){
            userrole.userRoleId=admin;
          }
          if(userrole.userRoleId==2){
            userrole.userRoleId=Manager;
          }
          if(userrole.userRoleId==3){
            userrole.userRoleId=Management;
          }
          if(userrole.userRoleId==4){
            userrole.userRoleId=Operator;
          }
        });
       
        console.log(this.getusertsdtawithrole);
        

        this.allUsersData.forEach(element => {
          this.activeInactiveSlide[element.userAccountId] = element.statusTypeId == 1 ? true : false;
         
        });

      },
      error => {
        console.error(error);
        this.show = false;
        this.toaster.error(error?.errorMessage);
      },
      () => console.log('COMPLETE')
    )

    console.log(rmsAct, "rms act checking")
  }
  editUserPopup(item, i) {
    let dialogRef = this.dialog.open(EditUserPopup,
      {
        width: '800px',
        // height:'400px',
        data: [item, i]
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result, "result checking")
      if (result?.events == 'editUser') {
        this.getAllUsers();
        // this.allUsersData = [];
        // setTimeout(() => {
        //   let rmsAct: any = JSON.parse(sessionStorage.getItem('rmsAccount'));
        //   this._service.getUserList(rmsAct?.customerId).subscribe(
        //     data => {
        //       console.log(data, "all users data check");
        //       this.allUsersData = data;
        //       this.getusertsdtawithrole = data;

        //     },
        //     err => {


        //     }
        //   )

        // }, 1000)
      }
    });
  }
  inactiveUserPopup(item, i) {
    console.log(this.activeInactiveSlide[item.userAccountId]);
    console.log(item, i);
    
    let dialogRef = this.dialog.open(InactiveUserPopup,
      {
        width: '400px',
        // height:'400px',
        data: [item, i]
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);    
      
      // console.log(this.getusertsdtawithrole[i].statusTypeId);   
      
      if (!result.data) {
        console.log(this.activeInactiveSlide[item.userAccountId]);
        this.activeInactiveSlide[item.userAccountId] = !this.activeInactiveSlide[item.userAccountId];
        console.log(this.activeInactiveSlide[item.userAccountId]);
        // this.toaster.error('Failed to Update User status ');

      }
      else{
        // console.log(this.getusertsdtawithrole);
        this.getusertsdtawithrole[i].statusTypeId=result.data.statusTypeId;
        this.getusertsdtawithrole.forEach(userroleid => {
          if(userroleid.userRoleId==1){
            userroleid.userRoleId="admin";
          }
          if(userroleid.userRoleId==2){
            userroleid.userRoleId="Manager";
          }
          if(userroleid.userRoleId==3){
            userroleid.userRoleId="Management";
          }
          if(userroleid.userRoleId==4){
            userroleid.userRoleId="Operator";
          }
        });
        
        this.toaster.success('User Status Updated Sucessfully')
        // console.log(this.getusertsdtawithrole);
        
        console.log("---------eeeeeeeeeese");
        
      }

    });
  }

  //user list code end
  ResetPassword() {
    this.ResetPaswd = true;
    this.addUsers = false;
    this.userList = false;
    this.About = false;
    this.Company = false;
    this.DevicePassword = false;
    this.Account = false
    this.resetformgrp.reset();
  }

  createForm() {
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    let mobNumberPattern: RegExp = /^((\\+91-?)|0)?[0-9]{10}$/

    this.signupForm = this.formBuilder.group({
      'firstname': [null, Validators.required],
      'lastname': [null, Validators.required],
      'email': [null, [Validators.required, Validators.pattern(emailregex)], this.checkInUseEmail],
      'phoneNo': [null, [Validators.required, Validators.pattern(mobNumberPattern)]],
      'role': [null, Validators.required],
      'userDesignation': [null, Validators.nullValidator],
      // 'username': [null, Validators.required],
      'password': [null, [Validators.required, this.checkPassword]],
      'confirmPassword': ['', Validators.required],
      //'validate': ['', Validators.requiredTrue]
    }, {
      validator: PasswordValidator.MatchPassword
    });
  }

  // get username() {
  //   return this.signupForm.get('username') as FormControl
  // }
  get firstname() {
    return this.signupForm.get('firstname') as FormControl
  }
  get lastname() {
    return this.signupForm.get('lastname') as FormControl
  }
  get role() {
    return this.signupForm.get('role') as FormControl
  }
  get phoneNo() {
    return this.signupForm.get('telePhone') as FormControl
  }
  get userDesignation() {
    return this.signupForm.get('designation') as FormControl
  }

  // checkPassword(control) {
  //   let enteredPassword = control.value
  //   let passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
  //   return (!passwordCheck.test(enteredPassword) && enteredPassword) ? { 'requirements': true } : null;
  // }

  // checkInUseEmail(control) {
  //   // mimic http database access
  //   let db = ['tony@gmail.com'];
  //   return new Observable(observer => {
  //     setTimeout(() => {
  //       let result = (db.indexOf(control.value) !== -1) ? { 'alreadyInUse': true } : null;
  //       observer.next(result);
  //       observer.complete();
  //     }, 4000)
  //   })
  // }
  // getErrorEmail() {
  //   return this.signupForm.get('email').hasError('required') ? 'Field is required' :
  //     this.signupForm.get('email').hasError('pattern') ? 'Not a valid emailaddress' :
  //       this.signupForm.get('email').hasError('alreadyInUse') ? 'This emailaddress is already in use' : '';
  // }

  // getErrorPassword() {
  //   return this.signupForm.get('password').hasError('required') ? 'Field is required (at least eight characters, one uppercase letter and one number)' :
  //     this.signupForm.get('password').hasError('requirements') ? 'Password needs to be at least eight characters, one uppercase letter and one number' : '';
  // }
  // Add new user ends

}


@Component({
  selector: 'camera-image-popup',
  templateUrl: './camera-image-popup.html',
  styleUrls: ['./account-setting.component.scss']
})

export class CameraImagePopup implements OnInit {
  constructor(public dialogRef: MatDialogRef<CameraImagePopup>, dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, public _service: DashboardService, private router: Router, private toaster: ToastrService) { }
  imageChangedEvent: any = '';
  croppedImage: any = '';
  AccountOlddata: any;
  base64profilephoto: any;
  imageFormat: string = '';

  profilephotoobj: { userAccountId: number, userPhoto: string };
  ngOnInit(): void {

    console.log(this.data, "popup data checking");
    let accountDeatils = sessionStorage.getItem('rmsAccount');
    console.log(JSON.parse(accountDeatils));
    this.AccountOlddata = JSON.parse(accountDeatils);
    console.log(this.AccountOlddata.userAccountId);
  }

  cropImage: boolean = false;
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.cropImage = true;
    const file: File = event.target.files[0];
    console.log(file);
    var pattern = "image/*";
    var reader = new FileReader();
    const fileType = file.type;
    if (!file.type.match(pattern)) {
      alert('invalid format');
      this.cropImage = false;
      return;
    }
    this.imageFormat = fileType.substr(fileType.lastIndexOf('/') + 1);
  }

  onFileDropped($event) {
    // this.prepareFilesList($event);
    this.cropImage = true;
  }

  imageCropped(event: ImageCroppedEvent) {
    // console.debug("*****************");

    // console.debug(file);

    this.croppedImage = event.base64;
    console.debug(this.croppedImage);
    // this.base64profilephoto= this.croppedImage.split(',')[1];
    // console.debug(this.base64profilephoto);    
    // console.debug(event, "image check");
  }


  imageLoaded() {
    // show cropper

  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
  apply() {
    if (this.croppedImage != "") {
      console.log(this._service.profileUrl, "profile setting");

      this.profilephotoobj = {
        userAccountId: this.AccountOlddata["userAccountId"],
        userPhoto: this.croppedImage
      }

      console.log(this.profilephotoobj);

      this._service.setprofilephoto(this.profilephotoobj).subscribe(
        (data:UserAccountModel) => {
          console.log(data,"set profile ")
          sessionStorage.setItem('rmsAccount', JSON.stringify(data));
          this.toaster.success('Profile Photo updated Sucessfully')
          this._service.profileUrl = this.croppedImage;

        },
        error => {
          this.toaster.error('Failed to Update profile Photo ');
          this.router.navigate(['dashboard/accountsetting']);
        },
        () => console.log('COMPLETE')
      )
      this.dialogRef.close();

    }

    else {
      this.dialogRef.close();
    }
    this.cropImage = false;
  }
}



//edit user popup start
@Component({
  selector: 'edit-user-popup',
  templateUrl: './edit-user-popup.html',
  styleUrls: ['./account-setting.component.scss']
})

export class EditUserPopup implements OnInit {
  designationDropdown = ['designation 1',
    'designation 2',
    'designation 3',
    'designation 4',
    'designation 5',
    'designation 6',
    'designation 7',
    'designation 8',
    'designation 9',
    'designation 10'];
  roleDropdown;
  userEditData;
  userEditIndex;
  show: boolean;
  userListEditForm: FormGroup;
  rmsAct:any;
  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<EditUserPopup>, dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any,
    private _dashboardservice: DashboardService, private toastr: ToastrService) {

  }

  ngOnInit(): void {
    let accountDeatils = sessionStorage.getItem('rmsAccount');
    this.rmsAct = JSON.parse(accountDeatils);
    this.userEditData = this.data[0];
    this.userEditIndex = this.data[1];
    this.userListEditFormVal();
    this.getUserRole();
    // this.setUserEditDetails();
    console.log(this.userEditData,"this.userEditData checking")

  }
  getRoleName(name) { 
    if(this.userEditData?.customerId == 11){
      if(name == "admin"){
        return "Super admin"
      }
      if(name == "Manager"){
        return "Manager"
      }
      if(name == "Management"){
        return "Admin"
      }
      if(name == "Operator"){
        return "Student"
      }
    }else{
      return name;
    }
  }
  getDisableRole(item){
    console.log(this.rmsAct,"rmsact")
    console.log(item,"item");
    if(this.rmsAct?.customerId === 11){
        if(item?.userRoleName === 'Management' || item?.userRoleName === 'Manager'){
          return true;
        }else{
          return false;
        }
    }else{
      return false;
    }
  
  }
  userListEditFormVal() {
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    let mobNumberPattern: RegExp = /^((\\+91-?)|0)?[0-9]{10}$/
    this.userListEditForm = this.formBuilder.group({
      'firstName': [null, Validators.required],
      'lastName': [null, Validators.required],
      'phoneNo': [null, [Validators.required, Validators.pattern(mobNumberPattern)]],
      'email': [null, [Validators.required, Validators.pattern(emailregex)], this.checkInUseEmail],
      'designation': [null, Validators.required],
      'userRoleId': [null, Validators.required]

    }
    );

  }
  getUserRole() {

    this.show = true;
    this._dashboardservice.getUserRoleApi().subscribe(
      (data:UserRoleStatusTypeDropResponse) => {
        this.show = false;
        console.log(data, "role checking api")
        this.roleDropdown = data?.userRoles;
        this.setUserEditDetails();
      },
      error => {
        console.error(error);
        this.show = false;
        this.toastr.error(error?.errorMessage)
      },
      () => console.log('COMPLETE')
    )


  }
  get firstName() {
    return this.userListEditForm.get('firstName') as FormControl
  }
  get lastName() {
    return this.userListEditForm.get('lastName') as FormControl
  }
  get userRoleId() {
    return this.userListEditForm.get('userRoleId') as FormControl
  }
  get phoneNo() {
    return this.userListEditForm.get('phoneNo') as FormControl
  }
  get designation() {
    return this.userListEditForm.get('designation') as FormControl
  }

  //TODO: we have to ask for validation ?
  checkInUseEmail(control) {
    // mimic http database access
    let db = ['tony@gmail.com'];
    return new Observable(observer => {
      setTimeout(() => {
        let result = (db.indexOf(control.value) !== -1) ? { 'alreadyInUse': true } : null;
        observer.next(result);
        observer.complete();
      }, 1000)
    })
  }

  getErrorEmail() {
    return this.userListEditForm.get('email').hasError('required') ? 'Email is required' :
      this.userListEditForm.get('email').hasError('pattern') ? 'Not a valid emailaddress' :
        this.userListEditForm.get('email').hasError('alreadyInUse') ? 'This emailaddress is already in use' : '';
  }

  getErrorPassword() {
    return this.userListEditForm.get('password').hasError('required') ? 'password is required (at least eight characters, one uppercase letter and one number)' :
      this.userListEditForm.get('password').hasError('requirements') ? 'Password needs to be at least eight characters, one uppercase letter and one number' : '';
  }
  setUserEditDetails() {
    this.userListEditForm.get("firstName").setValue(this.userEditData?.firstName);
    this.userListEditForm.get("lastName").setValue(this.userEditData?.lastName);
    this.userListEditForm.get("phoneNo").setValue(this.userEditData?.phoneNo);
    this.userListEditForm.get("designation").setValue(this.userEditData?.designation);
    this.userListEditForm.get("email").setValue(this.userEditData?.email);
    // this.userListEditForm.get("userRoleId").setValue(this.userEditData?.userRoleId);
    // // setTimeout(()=>{
    let userRolename;
    this.roleDropdown.find(item => {
      console.log(item,this.userEditData,"item checking")
      if (item.userRoleName == this.userEditData?.userRoleId) {
        userRolename = item;
      } else {
        return "";
      }
    });
    console.log(userRolename)
    this.userListEditForm.get('userRoleId').setValue(userRolename);
    // },600)
  }
  updateEditUser() {
    console.log(this.userListEditForm.value, "update user data checking");
    let updateUserData = {
      userAccountId: this.userEditData?.userAccountId,
      statusTypeId: this.userEditData?.statusTypeId,
      designation: this.userListEditForm.value?.designation,
      email: this.userListEditForm.value?.email,
      firstName: this.userListEditForm.value?.firstName,
      lastName: this.userListEditForm.value?.lastName,
      phoneNo: this.userListEditForm.value?.phoneNo,
      userRoleId: this.userListEditForm.value?.userRoleId?.userRoleId,
      customerId: this.userEditData?.customerId,
      gridLayoutId: this.userEditData?.gridLayoutId,
    }


    console.log(updateUserData, "update UserData checking");

    this._dashboardservice.editUserListApi(this.userEditData?.userAccountId, updateUserData).subscribe(
      (data:UserAccountModel) => {
        console.log(data, "updated user list checking checking");
        this.dialogRef.close({ events: 'editUser' })

      },
      error => {
        console.error(error);
        this.toastr.error(error?.errorMessage)
      },
      () => console.log('COMPLETE')
    )
  }

}


//edit user popup end



//Inactive user popup start
@Component({
  selector: 'inactive-user-popup',
  templateUrl: './inactive-user-popup.html',
  styleUrls: ['./account-setting.component.scss']
})

export class InactiveUserPopup implements OnInit {


  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<InactiveUserPopup>, dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any,
    private _dashboardservice: DashboardService, private toastr: ToastrService) {

  }
  userInactiveData;
  userInactivewithrole;

  userEditIndex;
  StatusContext;
  firstname;
  lastname;
  ngOnInit(): void {

         
    this.userInactiveData = this.data[0];
    this.userEditIndex = this.data[1];    
    
    console.log(this.userInactiveData, "userInactiveData checking")

    this.StatusContext = this.userInactiveData?.statusTypeId;
    this.firstname=this.userInactiveData.firstName;
    this.lastname=this.userInactiveData.lastName;
    console.log(this.firstname,this.lastname);
    


    console.log(this.StatusContext );
    

    this.userInactivewithrole=this.userInactiveData;
    console.log(this.userInactivewithrole);
    
    // if(this.userInactivewithrole.userRoleId=="admin"){
    //   this.userInactivewithrole.userRoleId=1;      }
    // else if(this.userInactivewithrole.userRoleId=="Manager"){
    //   this.userInactivewithrole.userRoleId=2;      }
    // else if(this.userInactivewithrole.userRoleId=="Management"){
    //   this.userInactivewithrole.userRoleId=3;      }
    // else if(this.userInactivewithrole.userRoleId=="Operator"){
    //   this.userInactivewithrole.userRoleId=4;
    // }
    // console.log(this.userInactivewithrole);

  }
  activeuser() {


     if(this.userInactivewithrole.userRoleId=="admin"){
      this.userInactivewithrole.userRoleId=1;      }
    else if(this.userInactivewithrole.userRoleId=="Manager"){
      this.userInactivewithrole.userRoleId=2;      }
    else if(this.userInactivewithrole.userRoleId=="Management"){
      this.userInactivewithrole.userRoleId=3;      }
    else if(this.userInactivewithrole.userRoleId=="Operator"){
      this.userInactivewithrole.userRoleId=4;
    }

    console.log(this.userInactivewithrole);
    
    if (this.StatusContext == 1) {
      console.log("--------1-----");
      
      // this.StatusContext = 2;
      let updateUserData = {
        userAccountId: this.userInactiveData?.userAccountId,
        statusTypeId: 2,
        designation: this.userInactiveData?.designation,
        email: this.userInactiveData?.email,
        firstName: this.userInactiveData?.firstName,
        lastName: this.userInactiveData?.lastName,
        phoneNo: this.userInactiveData?.phoneNo,
        userRoleId: this.userInactiveData?.userRoleId,
        customerId: this.userInactiveData?.customerId,
        // gridLayoutId: this.userInactiveData?.gridLayoutId,
      }

      console.log(updateUserData, "update UserData checking for inactive");
      
      this.activerusersapi(updateUserData);


    }
    if (this.StatusContext == 2) {
      // this.StatusContext = 1;
      console.log("--------2-----");

      let updateUserData = {
        userAccountId: this.userInactiveData?.userAccountId,
        statusTypeId: 1,
        designation: this.userInactiveData?.designation,
        email: this.userInactiveData?.email,
        firstName: this.userInactiveData?.firstName,
        lastName: this.userInactiveData?.lastName,
        phoneNo: this.userInactiveData?.phoneNo,
        userRoleId: this.userInactiveData?.userRoleId,
        customerId: this.userInactiveData?.customerId,
        gridLayoutId: this.userInactiveData?.gridLayoutId,
      }

      console.log(updateUserData, "update UserData checking for active");
     
      this.activerusersapi(updateUserData);
    }
  }

  activerusersapi(updateUserData){
    this._dashboardservice.editUserListApi(this.userInactiveData?.userAccountId, updateUserData).subscribe(
      (responceData:UserAccountModel) => {
    
        console.log(responceData, "reponce")
        
        this.dialogRef.close({
          data:responceData
        })
      },
      error => {
        console.error(error);
        this.dialogRef.close({
          data:false
        })
      },
      () => console.log('COMPLETE')
    )
  }
} 
//Inactive user popup end
