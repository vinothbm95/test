import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartCardReusableComponent } from './chart-card-reusable.component';

describe('ChartCardReusableComponent', () => {
  let component: ChartCardReusableComponent;
  let fixture: ComponentFixture<ChartCardReusableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartCardReusableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartCardReusableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
