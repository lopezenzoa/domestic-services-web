import { Component, inject, signal } from '@angular/core';
import { ReviewService } from '../../service/review-service';
import { Review } from '../../models/Review';

@Component({
  selector: 'app-review-list',
  imports: [],
  templateUrl: './review-list.html',
  styleUrl: './review-list.css'
})
export class ReviewList {
  service = inject(ReviewService);
  reviews = signal<Review []>([]);


  constructor (){
    this.service.getMyReviews().subscribe(r => {

      const parsed = r.map(review => ({
      ...review,
      creationDate: new Date(review.creationDate).toISOString().split('T')[0]
    }));

      this.reviews.set(parsed);
    });
  }

}
