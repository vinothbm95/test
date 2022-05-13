import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DaterngePickerComponent } from './daternge-picker.component';

describe('DaterngePickerComponent', () => {
  let component: DaterngePickerComponent;
  let fixture: ComponentFixture<DaterngePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DaterngePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaterngePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
