import { Component, inject, signal } from '@angular/core';
import { ReviewService } from '../../service/review-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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

  fb = inject(FormBuilder);
  service = inject(ReviewService);
  serviceClient = inject(ClientsService);
  providerService = inject(ProvidersService);

  route = inject(ActivatedRoute);
  router = inject(Router);

  client = signal<any | null>(null);
  provider = signal<any | null>(null);

  today = new Date().toISOString().split('T')[0];

  showSuccessModal = false;

  form = this.fb.nonNullable.group({
    description: ['', [Validators.required, Validators.minLength(5)]],
    creationDate: [this.today, Validators.required],
    client: ['', Validators.required],
    provider: ['', Validators.required],
  });

  ngOnInit() {
    this.loadClient();
    this.loadQueryParams();
  }

  private loadClient() {
    this.serviceClient.getClientProfile().subscribe((c) => {
      this.client.set(c);

      this.form.patchValue({
        client: `${c.firstName} ${c.lastName}`,
      });
    });
  }

  private loadQueryParams() {
    this.route.queryParams.subscribe((params) => {
      this.providerId = Number(params['providerId']);
      const providerName = params['providerName'];
      const date = params['date'];

      if (providerName) {
        this.form.patchValue({ provider: providerName });
      }

      if (date) {
        this.form.patchValue({
          creationDate: date.split('T')[0],
        });
      }

      if (this.providerId) {
        this.fetchProvider();
      }
    });
  }

  private fetchProvider() {
    this.providerService.getProviderById(this.providerId).subscribe((p) => {
      this.provider.set(p);
      this.form.patchValue({
        provider: `${p.firstName} ${p.lastName}`,
      });
    });
  }

  submitForm() {
     if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
      const review = {
        id: undefined,
        description: this.form.get('description')?.value!,
        creationDate: this.form.get('creationDate')?.value!,
        client: this.client(),
        provider: { id: Number(this.providerId) },
      };

      this.service.createReview(review).subscribe({
      next: () => (this.showSuccessModal = true),
      error: () => alert('Hubo un error al guardar la reseña.'),
    });
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
    this.router.navigate(['/reviews']);
  }
}
