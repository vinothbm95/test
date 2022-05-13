import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeCustomCgComponent } from './range-custom-cg.component';

describe('RangeCustomCgComponent', () => {
  let component: RangeCustomCgComponent;
  let fixture: ComponentFixture<RangeCustomCgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RangeCustomCgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeCustomCgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
