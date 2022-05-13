import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepLineChartComponent } from './step-line-chart.component';

describe('StepLineChartComponent', () => {
  let component: StepLineChartComponent;
  let fixture: ComponentFixture<StepLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
