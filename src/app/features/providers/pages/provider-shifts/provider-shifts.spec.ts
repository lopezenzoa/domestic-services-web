import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderShifts } from './provider-shifts';

describe('ProviderShifts', () => {
  let component: ProviderShifts;
  let fixture: ComponentFixture<ProviderShifts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderShifts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderShifts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
