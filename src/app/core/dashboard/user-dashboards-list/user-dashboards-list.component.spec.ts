import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDashboardsListComponent } from './user-dashboards-list.component';

describe('UserDashboardsListComponent', () => {
  let component: UserDashboardsListComponent;
  let fixture: ComponentFixture<UserDashboardsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDashboardsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDashboardsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
