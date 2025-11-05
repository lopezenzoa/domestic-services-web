import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestCallForm } from './request-call-form';

describe('RequestCallForm', () => {
  let component: RequestCallForm;
  let fixture: ComponentFixture<RequestCallForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestCallForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestCallForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
