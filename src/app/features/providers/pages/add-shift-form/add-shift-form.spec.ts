import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShiftForm } from './add-shift-form';

describe('AddShiftForm', () => {
  let component: AddShiftForm;
  let fixture: ComponentFixture<AddShiftForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddShiftForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddShiftForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
