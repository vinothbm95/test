import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HydacComponent } from './hydac.component';

describe('HydacComponent', () => {
  let component: HydacComponent;
  let fixture: ComponentFixture<HydacComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HydacComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HydacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
