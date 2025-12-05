import { Component, inject, signal } from '@angular/core';
import { ReviewService } from '../../service/review-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Review } from '../../models/Review';
import { ClientsService } from '../../../clients/services/clients-service';
import { ProvidersService } from '../../../providers/services/providers.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-review-form',
  imports: [ReactiveFormsModule],
  templateUrl: './review-form.html',
  styleUrl: './review-form.css',
})
export class ReviewForm {
  providerId!: number;

  // SERVICES & INJECTIONS
  fb = inject(FormBuilder);
  service = inject(ReviewService);
  serviceClient = inject(ClientsService);
  providerService = inject(ProvidersService);

  // ROUTING
  route = inject(ActivatedRoute);
  router = inject(Router);

  // DATA
  client = signal<any | null>(null);
  provider = signal<any | null>(null);

  today = new Date().toISOString().split('T')[0];

  // MODAL
  showSuccessModal = false;

  // FORM
  form = this.fb.nonNullable.group({
    description: ['', [Validators.required, Validators.minLength(5)]],
    creationDate: [this.today, Validators.required],
    client: ['', Validators.required],
    provider: ['', Validators.required],
  });

  constructor() {
  
    this.serviceClient.getClientProfile().subscribe((c) => {
      this.client.set(c);
      this.form.patchValue({
        client: this.client()!.firstName + ' ' + this.client()!.lastName,
      });
    });

    
    this.route.queryParams.subscribe((params) => {
      const providerId = params['providerId'];
      const providerName = params['providerName'];
      const date = params['date'];

      if (providerId) {
        this.providerId = providerId;
        this.form.patchValue({ provider: providerName });
      }

      if (date) {
        const formatted = date.split('T')[0];
        this.form.patchValue({ creationDate: formatted });
      }
    });

  
    if (this.providerId) {
      this.providerService.getProviderById(Number(this.providerId)).subscribe((p) => {
        this.provider.set(p);

        this.form.patchValue({
          provider: p.firstName + ' ' + p.lastName,
        });
      });
    }
  }

  
  submitForm() {
    if (this.form.valid) {
      const review = {
        id: undefined,
        description: this.form.get('description')?.value!,
        creationDate: this.form.get('creationDate')?.value!,
        client: this.client(),
        provider: { id: Number(this.providerId) }, 
      };

      this.service.createReview(review).subscribe({
        next: () => {
          this.showSuccessModal = true;
        },
        error: () => {
          alert('Hubo un error al guardar la reseña.');
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
    this.router.navigate(['/reviews']);
  }
}
