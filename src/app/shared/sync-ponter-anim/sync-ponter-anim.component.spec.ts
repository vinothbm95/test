import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncPonterAnimComponent } from './sync-ponter-anim.component';

describe('SyncPonterAnimComponent', () => {
  let component: SyncPonterAnimComponent;
  let fixture: ComponentFixture<SyncPonterAnimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SyncPonterAnimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SyncPonterAnimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
