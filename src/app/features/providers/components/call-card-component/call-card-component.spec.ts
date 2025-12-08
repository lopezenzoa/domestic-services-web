import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallCardComponent } from './call-card-component';

describe('CallCardComponent', () => {
  let component: CallCardComponent;
  let fixture: ComponentFixture<CallCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
