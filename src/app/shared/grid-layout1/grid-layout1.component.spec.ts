import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridLayout1Component } from './grid-layout1.component';

describe('GridLayout1Component', () => {
  let component: GridLayout1Component;
  let fixture: ComponentFixture<GridLayout1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridLayout1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridLayout1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
