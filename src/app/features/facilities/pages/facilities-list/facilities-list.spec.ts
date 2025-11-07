import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilitiesList } from './facilities-list';

describe('FacilitiesList', () => {
  let component: FacilitiesList;
  let fixture: ComponentFixture<FacilitiesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacilitiesList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacilitiesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
