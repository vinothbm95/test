import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCustomViewComponent } from './dashboard-custom-view.component';

describe('DashboardCustomViewComponent', () => {
  let component: DashboardCustomViewComponent;
  let fixture: ComponentFixture<DashboardCustomViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardCustomViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardCustomViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
