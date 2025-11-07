import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFacilities } from './create-facilities';

describe('CreateFacilities', () => {
  let component: CreateFacilities;
  let fixture: ComponentFixture<CreateFacilities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateFacilities]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateFacilities);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
