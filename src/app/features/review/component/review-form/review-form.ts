import { Component, inject, signal } from '@angular/core';
import { ReviewService } from '../../service/review-service';
import { FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { Review } from '../../models/Review';
import { ClientsService } from '../../../clients/services/clients-service';
import { ProvidersService } from '../../../providers/services/providers.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-review-form',
  imports: [ReactiveFormsModule],
  templateUrl: './review-form.html',
  styleUrl: './review-form.css'
})
export class ReviewForm {

  fb = inject(FormBuilder);
  service = inject(ReviewService);
  serviceClient = inject(ClientsService);
  providerService = inject(ProvidersService);
  client = signal<any> ({});
  provider= signal<any>({});
  route = inject(ActivatedRoute);
  router = inject(Router);
  providerId = this.route.snapshot.paramMap.get('providerId');
  today = new Date().toISOString().split('T')[0];

  showSuccessModal = false;

  form= this.fb.nonNullable.group({
      description: ['', [Validators.required, Validators.minLength(5)]],
      creationDate: [this.today, Validators.required],
      client: ['', Validators.required],
      provider: ['', Validators.required]
  })

  constructor(){
    this.serviceClient.getClientProfile().subscribe( c => {
      this.client.set(c);
      this.form.patchValue({ client: this.client().firstName + ' ' + this.client().lastName });
    });
    this.providerService.getProviderById(parseInt(this.providerId!)).subscribe(p => {
      this.provider.set(p);
      this.form.patchValue({provider: this.provider().firstName + ' ' + this.provider().lastName})
    })
  }

  submitForm() {
    if (this.form.valid) {
      const review = {
        description : this.form.get('description')?.value!,
        creationDate: this.form.get('creationDate')?.value!,
        client : this.client(),
        provider: this.provider(),
      }

      this.service.createReview(review).subscribe({
        next : () => {
          this.showSuccessModal = true;
        },

        error: () => {
          alert("Hubo un error al guardar la reseña.");
        }
      
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
