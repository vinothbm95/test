import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { By } from '@angular/platform-browser';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
        MatCheckboxModule
      ],
      declarations: [ RegisterComponent ],
      providers:[
        { provide: ComponentFixtureAutoDetect, useValue : true}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create register form instance', () => {
    expect(component).toBeTruthy();
  });

  it('[First name]-should check user first name is invalid', () => {
    let firstname = component.signupForm.controls['firstname'];
    expect(firstname.valid).toBeFalsy();
    expect(firstname.pristine).toBeTruthy();
    expect(firstname.errors).toBeTruthy();
    firstname.setValue('');    
    expect(firstname.errors['required']).toBeTruthy();
  });

  it('[First name]-should check user first name is valid', () => {
    let firstname = component.signupForm.controls['firstname'];
    firstname.setValue('abc');
    expect(firstname.errors).toBeNull();
    expect(firstname.valid).toBeTruthy();
    
  });

  it('[Last name]-should check user last name is invalid', () => {
    let lastname = component.signupForm.controls['lastname'];
    expect(lastname.valid).toBeFalsy();
    expect(lastname.pristine).toBeTruthy();
    expect(lastname.errors).toBeTruthy();
    lastname.setValue('');    
    expect(lastname.errors['required']).toBeTruthy();
  });

  it('[Last name]-should check user last name is valid', () => {
    let lastname = component.signupForm.controls['lastname'];
    lastname.setValue('abc@gmail.com');
    expect(lastname.errors).toBeNull();
    expect(lastname.valid).toBeTruthy();
    
  });

  it('[Email] - should check users login email address is invalid', () => {
    let email = component.signupForm.controls['email'];
    expect(email.valid).toBeFalsy();
    expect(email.pristine).toBeTruthy();
    expect(email.errors).toBeTruthy();
    email.setValue('');    
    expect(email.errors['required']).toBeTruthy();
    email.setValue('abc');    
    expect(email.errors['pattern']).toBeTruthy();
    email.setValue('abc@gmai');    
    expect(email.errors['pattern']).toBeTruthy();
    email.setValue('abc@gmai.c');    
    expect(email.errors['pattern']).toBeTruthy();
  });

  it('[Email] - should check users login email address is valid', () => {
    let email = component.signupForm.controls['email'];
    email.setValue('abc@gmail.com');
    expect(email.errors).toBeNull();
  });

  it('[password] should check password errors', () => {
    let password = component.signupForm.controls['password'];
    password.setValue('');
    expect(password.errors['required']).toBeTruthy();
  });

  it('[password] should check password validity', () => {
    let password = component.signupForm.controls['password'];
    password.setValue('abc');
    expect(password.errors).toBeTruthy();
    password.setValue('abcAB')
    expect(password.errors).toBeTruthy();
    password.setValue('abcAB12')
    expect(password.errors).toBeTruthy();
    password.setValue('abcAB123');
    expect(password.errors).toBeNull();
    expect(password.valid).toBeTruthy();
  });

  // it('[confirm password] should invalidate two fields that do not match', () => {
  //   let field1 = component.signupForm['password'];
  //   let field2 = component.signupForm['confirmPassword'];
  //   field1 = '12345678901234';
  //   field2 = '12345678999999';
  //   //let confirmPassword = component.signupForm.controls['confirmPassword'];
  //   fixture.detectChanges();
  //   fixture.whenStable().then(() => {
  //     fixture.detectChanges();
  //     let confirmPassword = fixture.debugElement.query(By.css('input[formControlName=password]')).references['confirmPassword'];
  //     expect(confirmPassword.valid).toBe(false);
  //   });
    
  // });

  it('[form-check] should check form is valid or not, if values are not entered', () => {
    expect(component.signupForm.valid).toBeFalsy();
  });

  it('[form-check] should check form is valid or not, if values are entered', () => {
    component.signupForm.controls['firstname'].setValue('abc');
    component.signupForm.controls['lastname'].setValue('pqr');
    component.signupForm.controls['email'].setValue('abc@gmail.com');
    component.signupForm.controls['password'].setValue('abcAB123');
    component.signupForm.controls['confirmPassword'].setValue('abcAB123');
    component.signupForm.controls['validate'].setValue(true);
    expect(component.signupForm.errors).toBeNull();
  });

  it('[form-submit] should check form is submitted', () => {
    expect(component.signupForm.invalid).toBeTruthy();
    let btn = fixture.debugElement.query(By.css('button[type=submit]'));
    expect(btn.nativeElement.disabled).toBeTruthy();
    component.signupForm.controls['firstname'].setValue('abc');
    component.signupForm.controls['lastname'].setValue('pqr');
    component.signupForm.controls['email'].setValue('abc@gmail.com');
    component.signupForm.controls['password'].setValue('abcAB123');
    component.signupForm.controls['confirmPassword'].setValue('abcAB123');
    component.signupForm.controls['validate'].setValue(true);
    fixture.detectChanges();
    //expect(component.signupForm.valid).toBeFalsy();
    expect(btn.nativeElement.disabled).toBeTruthy();
    fixture.detectChanges();
  });


});
