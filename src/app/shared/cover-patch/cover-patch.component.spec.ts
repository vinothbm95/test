import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverPatchComponent } from './cover-patch.component';

describe('CoverPatchComponent', () => {
  let component: CoverPatchComponent;
  let fixture: ComponentFixture<CoverPatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoverPatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverPatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
