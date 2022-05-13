import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreasplineChartComponent } from './areaspline-chart.component';

describe('AreasplineChartComponent', () => {
  let component: AreasplineChartComponent;
  let fixture: ComponentFixture<AreasplineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreasplineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreasplineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
