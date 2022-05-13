import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempProgressBarComponent } from './temp-progress-bar.component';

describe('TempProgressBarComponent', () => {
  let component: TempProgressBarComponent;
  let fixture: ComponentFixture<TempProgressBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TempProgressBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
