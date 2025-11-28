import { Component, inject, signal } from '@angular/core';
import { ReviewService } from '../../service/review-service';
import { FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { Review } from '../../models/Review';
import { ClientsService } from '../../../clients/services/clients-service';

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
  client = signal<any> ({});

  form= this.fb.nonNullable.group({
      description: ['', [Validators.required, Validators.minLength(5)]],
      creationDate: ['', Validators.required],
      client: ['', Validators.required],
      provider: ['', Validators.required]
  })

  constructor(){
    this.serviceClient.getClientProfile().subscribe( c => {
      this.client.set(c);
      this.form.patchValue({ client: this.client().firstName + ' ' + this.client().lastName });
    });
  }

  submitForm() {
    if (this.form.valid) {
      const review = {
        id : undefined,
        description : this.form.get('description')?.value!,
        creationDate: this.form.get('creationDate')?.value!,
        client : this.client(),
        provider: {},
      }

      this.service.createReview(review)
    } else {
      this.form.markAllAsTouched();
    }
  }


}
