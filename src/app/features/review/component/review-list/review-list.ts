import { Component, inject, signal } from '@angular/core';
import { ReviewService } from '../../service/review-service';
import { Review } from '../../models/Review';
import { UsersService } from '../../../users/services/users-service';
import { User } from '../../../users/models/User';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review-list',
  imports: [CommonModule],
  templateUrl: './review-list.html',
  styleUrl: './review-list.css',
})
export class ReviewList {
  service = inject(ReviewService);
  serviceUser = inject(UsersService);
  reviews = signal<Review[]>([]);
  user = signal<User | undefined>(undefined);
  currentPage = signal(0);
  totalPages = signal(1);
  pageSize = 5;

  selectedReviewId: number | null = null;
  showConfirmModal = false;
  showSuccessModal = false;

  constructor() {
  this.serviceUser.getUserProfile().subscribe((u) => {
    this.user.set(u);
    this.loadReviews(0); 
  });
}


  deleteReview(id: number) {
    this.service.deleteReview(id).subscribe(() => {
      const updatedReviews = this.reviews().filter((review) => review.id !== id);
      this.reviews.set(updatedReviews);
    });
  }
openConfirmModal(id: number) {
  console.log("ABRIENDO MODAL PARA:", id);  
  this.selectedReviewId = id;
  this.showConfirmModal = true;
}

  confirmDelete() {
    if (this.selectedReviewId == null) return;

    this.service.deleteReview(this.selectedReviewId).subscribe(() => {
      const updated = this.reviews().filter((r) => r.id !== this.selectedReviewId);
      this.reviews.set(updated);

      this.showConfirmModal = false;
      this.showSuccessModal = true;
    });
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }
loadReviews(page: number = 0) {
  const role = this.user()?.role;

  const handler = (res: any) => {
    const parsed = res.content.map((review: any) => ({
      ...review,
      creationDate: new Date(review.creationDate)
        .toLocaleDateString('es-AR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
    }));

    this.reviews.set(parsed);
    this.totalPages.set(res.totalPages);
    this.currentPage.set(page);
  };

  if (role === 'ADMIN') {
    this.service.getAllReviewsPaged(page, this.pageSize)
      .subscribe(handler);
  } else {
    this.service.getMyReviewsPaged(page, this.pageSize)
      .subscribe(handler);
  }
}

}
