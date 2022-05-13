import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { SignalDataComponent } from './signal-data.component';

describe('SignalDataComponent', () => {
  let component: SignalDataComponent;
  let fixture: ComponentFixture<SignalDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignalDataComponent ],
      imports: [
        MatAutocompleteModule        
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
