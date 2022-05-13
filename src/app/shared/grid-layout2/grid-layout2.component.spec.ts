import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridLayout2Component } from './grid-layout2.component';

describe('GridLayout2Component', () => {
  let component: GridLayout2Component;
  let fixture: ComponentFixture<GridLayout2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridLayout2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridLayout2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
