import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalRotationOnffComponent } from './digital-rotation-onff.component';

describe('DigitalRotationOnffComponent', () => {
  let component: DigitalRotationOnffComponent;
  let fixture: ComponentFixture<DigitalRotationOnffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalRotationOnffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalRotationOnffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
