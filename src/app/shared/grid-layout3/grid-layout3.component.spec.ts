import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridLayout3Component } from './grid-layout3.component';

describe('GridLayout3Component', () => {
  let component: GridLayout3Component;
  let fixture: ComponentFixture<GridLayout3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridLayout3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridLayout3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
