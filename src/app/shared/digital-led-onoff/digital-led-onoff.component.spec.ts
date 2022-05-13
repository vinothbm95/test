import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalLedOnoffComponent } from './digital-led-onoff.component';

describe('DigitalLedOnoffComponent', () => {
  let component: DigitalLedOnoffComponent;
  let fixture: ComponentFixture<DigitalLedOnoffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalLedOnoffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalLedOnoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
