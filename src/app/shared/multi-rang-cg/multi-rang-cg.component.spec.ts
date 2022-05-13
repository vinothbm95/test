import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiRangCgComponent } from './multi-rang-cg.component';

describe('MultiRangCgComponent', () => {
  let component: MultiRangCgComponent;
  let fixture: ComponentFixture<MultiRangCgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiRangCgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiRangCgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
