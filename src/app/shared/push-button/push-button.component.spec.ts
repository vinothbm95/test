import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PushButtonComponent } from './push-button.component';

describe('PushButtonComponent', () => {
  let component: PushButtonComponent;
  let fixture: ComponentFixture<PushButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PushButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PushButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
