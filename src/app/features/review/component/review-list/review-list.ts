import { Component, inject, signal } from '@angular/core';
import { ReviewService } from '../../service/review-service';
import { Review } from '../../models/Review';
import { UsersService } from '../../../users/services/users-service';
import { User } from '../../../users/models/User';

@Component({
  selector: 'app-review-list',
  imports: [],
  templateUrl: './review-list.html',
  styleUrl: './review-list.css'
})
export class ReviewList {
  service = inject(ReviewService);
  serviceUser = inject(UsersService);
  reviews = signal<Review []>([]);
  user = signal<User | undefined>(undefined);

  selectedReviewId: number | null = null;
  showConfirmModal = false;
  showSuccessModal = false;


  constructor (){
    this.serviceUser.getUserProfile().subscribe(u => {
      this.user.set(u);
    });

    if(this.user()?.role === 'ADMIN'){
      this.service.getAllReviews().subscribe(r => {

        const parsed = r.map(review => ({
        ...review,
        creationDate: new Date(review.creationDate).toISOString().split('T')[0]
      }));

        this.reviews.set(parsed);});
    } else {
      this.service.getMyReviews().subscribe(r => {

      const parsed = r.map(review => ({
      ...review,
      creationDate: new Date(review.creationDate).toISOString().split('T')[0]
    }));

      this.reviews.set(parsed);
    });

    }
  }

  deleteReview (id: number){
    this.service.deleteReview(id).subscribe(() => {
      const updatedReviews = this.reviews().filter(review => review.id !== id);
      this.reviews.set(updatedReviews);
    }); 
  }

  openConfirmModal(id: number) {
  this.selectedReviewId = id;
  this.showConfirmModal = true;
}

confirmDelete() {
  if (this.selectedReviewId == null) return;

  this.service.deleteReview(this.selectedReviewId).subscribe(() => {

    const updated = this.reviews().filter(r => r.id !== this.selectedReviewId);
    this.reviews.set(updated);

    this.showConfirmModal = false;
    this.showSuccessModal = true;
  });
}

closeSuccessModal() {
  this.showSuccessModal = false;
}

}
