import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSizeLayoutComponent } from './custom-size-layout.component';

describe('CustomSizeLayoutComponent', () => {
  let component: CustomSizeLayoutComponent;
  let fixture: ComponentFixture<CustomSizeLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomSizeLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomSizeLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
