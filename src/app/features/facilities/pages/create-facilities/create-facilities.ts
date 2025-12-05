import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FacilitiesService } from '../../services/facilities-service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-create-facilities',
  imports: [ReactiveFormsModule, NgIf, RouterLink],
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

  route: ActivatedRoute = inject(ActivatedRoute);

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', Validators.required],
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('facilityId');

    if (id) {
      
      this.loadFacility(Number(id));
    }

  }

  loadFacility(id: number): void {
  this.loading.set(true);

  this.facilitiesService.getById(id).subscribe({
    next: (data) => {
      this.form.patchValue(data);
      this.loading.set(false);
    },
    error: () => {
      this.loading.set(false);
      this.error.set('No se pudo cargar el servicio');
    }
  });
}

  submit() {
    if (this.form.invalid) {
      this.error.set('Completá nombre y descripción.');
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.success.set('');

    const id = this.route.snapshot.paramMap.get('facilityId');

    if (id) {
      const data = {
        id: Number(id),
        ...this.form.value
      }

   
    this.facilitiesService.updateFacility(data).subscribe({
  next: () => {
    this.loading.set(false);
    this.success.set('Servicio editado');

  
    setTimeout(() => {
      this.success.set('');
      this.error.set('');
    }, 3000);

   
    setTimeout(() => {
      this.router.navigate(['/facilities/']);
    }, 1200);
  },
  error: () => {
    this.loading.set(false);
    this.error.set('No se pudo editar el servicio');

    setTimeout(() => {
      this.error.set('');
    }, 3000);
  }
});

    } else {
     
     this.facilitiesService.addFacility(this.form.value).subscribe({
  next: () => {
    this.loading.set(false);
    this.success.set('Servicio creado');

    setTimeout(() => {
      this.success.set('');
      this.error.set('');
    }, 3000);

    setTimeout(() => {
      this.router.navigate(['/facilities/']);
    }, 1200);
  },
  error: () => {
    this.loading.set(false);
    this.error.set('No se pudo crear el servicio');

    setTimeout(() => {
      this.error.set('');
    }, 3000);
  }
});

    }


  }
  
  
}