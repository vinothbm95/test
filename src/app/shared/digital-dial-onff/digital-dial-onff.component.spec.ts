import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalDialOnffComponent } from './digital-dial-onff.component';

describe('DigitalRotationOnffComponent', () => {
  let component: DigitalDialOnffComponent;
  let fixture: ComponentFixture<DigitalDialOnffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalDialOnffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalDialOnffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
