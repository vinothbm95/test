import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordComponent } from './reset-password.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule 
      ],
      declarations: [ ResetPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('[Email] - should check users email address is invalid', () => {
    let email = component.formGroup.controls['email'];
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

  it('[Email] - should check users email address is valid', () => {
    let email = component.formGroup.controls['email'];
    email.setValue('abc@gmail.com');
    expect(email.errors).toBeNull();
  });
  
});
