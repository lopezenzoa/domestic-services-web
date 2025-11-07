import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup,ReactiveFormsModule, Validators } from '@angular/forms';
import { FacilitiesService } from '../../services/facilities-service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-create-facilities',
  imports: [ReactiveFormsModule,NgIf],
  templateUrl: './create-facilities.html',
  styleUrl: './create-facilities.css'
})
export class CreateFacilities {
 
  private fb = inject(FormBuilder);
  private facilitiesService = inject(FacilitiesService);
  private router = inject(Router);

  loading = signal(false);
  success = signal('');
  error = signal('');


  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', Validators.required],
  });

  submit() {
    if (this.form.invalid) {
      this.error.set('Completá nombre y descripción.');
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.success.set('');

    this.facilitiesService.addFacility(this.form.value).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set('Servicio creado ');

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1200);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('No se pudo crear el servicio ❌');
      }
    });
  }
}