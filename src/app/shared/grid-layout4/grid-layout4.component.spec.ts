import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridLayout4Component } from './grid-layout4.component';

describe('GridLayout4Component', () => {
  let component: GridLayout4Component;
  let fixture: ComponentFixture<GridLayout4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridLayout4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridLayout4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
