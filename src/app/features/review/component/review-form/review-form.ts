import { Component, inject, signal } from '@angular/core';
import { ReviewService } from '../../service/review-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Review } from '../../models/Review';
import { ClientsService } from '../../../clients/services/clients-service';
import { ActivatedRoute } from '@angular/router';

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
  client = signal<any>({});
  route = inject(ActivatedRoute);

  form = this.fb.nonNullable.group({
    description: ['', [Validators.required, Validators.minLength(5)]],
    creationDate: ['', Validators.required],
    client: ['', Validators.required],
    provider: ['', Validators.required],
  });

  constructor() {
    this.serviceClient.getClientProfile().subscribe((c) => {
      this.client.set(c);
      this.form.patchValue({
        client: this.client().firstName + ' ' + this.client().lastName,
      });
    });
    this.route.queryParams.subscribe((params) => {
      const providerId = params['providerId'];
      const providerName = params['providerName'];
      const date = params['date'];

      //cargar el provedor
      if (providerId) {
        this.form.patchValue({ provider: providerName });
        this.providerId = providerId;
      }
      if (date) {
        const formatted = date.split('T')[0];
        this.form.patchValue({ creationDate: formatted });
      }
    });
  }

  submitForm() {
    if (this.form.valid) {
      const review = {
        id: undefined,
        description: this.form.get('description')?.value!,
        creationDate: this.form.value.creationDate!, // ya vino del turno
        client: this.client(), // cliente real
        provider: { id: Number(this.providerId) },
      };

      this.service.createReview(review);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
