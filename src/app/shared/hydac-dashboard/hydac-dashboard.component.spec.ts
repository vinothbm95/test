import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HydacDashboardComponent } from './hydac-dashboard.component';

describe('HydacDashboardComponent', () => {
  let component: HydacDashboardComponent;
  let fixture: ComponentFixture<HydacDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HydacDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HydacDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
