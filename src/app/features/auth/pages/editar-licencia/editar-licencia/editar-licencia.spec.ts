import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarLicencia } from './editar-licencia';

describe('EditarLicencia', () => {
  let component: EditarLicencia;
  let fixture: ComponentFixture<EditarLicencia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarLicencia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarLicencia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
