import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Observable }  from 'rxjs';
import { PasswordValidator } from '../password-validator'

@Component({
  selector: 'elpis-rms-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  signupForm: FormGroup;
  titleAlert: string = 'This field is required';
  post: any = '';

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.createForm();
    //this.setChangeValidate();
  }

  createForm() {
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.signupForm = this.formBuilder.group({
      'firstname' : [null, Validators.required],
      'lastname' : [null, Validators.required],
      'email': [null, [Validators.required, Validators.pattern(emailregex)], this.checkInUseEmail],
      // 'username': [null, Validators.required],
      'password': [null, [Validators.required, this.checkPassword]],
      'confirmPassword': ['', Validators.required],
      'validate': ['', Validators.requiredTrue]
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

  checkPassword(control) {
    let enteredPassword = control.value
    let passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    return (!passwordCheck.test(enteredPassword) && enteredPassword) ? { 'requirements': true } : null;
  }

  checkInUseEmail(control) {
    // mimic http database access
    let db = ['tony@gmail.com'];
    return new Observable(observer => {
      setTimeout(() => {
        let result = (db.indexOf(control.value) !== -1) ? { 'alreadyInUse': true } : null;
        observer.next(result);
        observer.complete();
      }, 4000)
    })
  }

  getErrorEmail() {
    return this.signupForm.get('email').hasError('required') ? 'Field is required' :
      this.signupForm.get('email').hasError('pattern') ? 'Not a valid emailaddress' :
        this.signupForm.get('email').hasError('alreadyInUse') ? 'This emailaddress is already in use' : '';
  }

  getErrorPassword() {
    return this.signupForm.get('password').hasError('required') ? 'Field is required (at least eight characters, one uppercase letter and one number)' :
      this.signupForm.get('password').hasError('requirements') ? 'Password needs to be at least eight characters, one uppercase letter and one number' : '';
  }

  onSubmit() {
    //this.post = post;
    console.log(this.signupForm.value)
  }

}
