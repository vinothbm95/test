import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSignalGroupComponent } from './add-signal-group.component';

describe('AddSignalGroupComponent', () => {
  let component: AddSignalGroupComponent;
  let fixture: ComponentFixture<AddSignalGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSignalGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSignalGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
