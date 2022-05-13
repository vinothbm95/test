import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { LoginComponent } from './login.component';
import { DashboardViewComponent } from '../../dashboard/dashboard-view/dashboard-view.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule.withRoutes(
          [{path: 'dashboard', component: DashboardViewComponent}]
        )
      ],
      declarations: [ LoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(async() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('[Email] - should check users login email address is invalid', () => {
    let email = component.loginForm.controls['email'];
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
    let email = component.loginForm.controls['email'];
    email.setValue('abc@gmail.com');
    expect(email.errors).toBeNull();
  });

  it('[password] should check password errors', () => {
    let password = component.loginForm.controls['password'];
    expect(password.errors['required']).toBeTruthy();
  });

  it('[password] should check password validity', () => {
    let password = component.loginForm.controls['password'];
    password.setValue('abc')
    expect(password.errors).toBeNull();
    expect(password.valid).toBeTruthy();
  });

  it('[form-check] should check form is valid or not, if values are not entered', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('[form-check] should check form is valid or not, if values are entered', () => {
    component.loginForm.controls['email'].setValue('abc@gmail.com');
    component.loginForm.controls['password'].setValue('abc');
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('[form-submit] should check form is submitted', () => {
    expect(component.loginForm.invalid).toBeTruthy();
    let btn = fixture.debugElement.query(By.css('button[type=submit]'));
    //check btn is disabled
    expect(btn.nativeElement.disabled).toBeTruthy();

    component.loginForm.controls['email'].setValue('abc@gmail.com');
    component.loginForm.controls['password'].setValue('abc');
    fixture.detectChanges();
    expect(btn.nativeElement.disabled).toBeFalsy();
    component.onSubmit();
    fixture.detectChanges();
  });

});
