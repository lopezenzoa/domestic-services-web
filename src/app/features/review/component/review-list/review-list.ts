import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../service/review-service';
import { Review } from '../../models/Review';
import { UsersService } from '../../../users/services/users-service';
import { User } from '../../../users/models/User';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-list.html',
  styleUrl: './review-list.css',
})
export class ReviewList implements OnInit {

  reviewService = inject(ReviewService);
  userService = inject(UsersService);

  reviews = signal<Review[]>([]);
  user = signal<User | undefined>(undefined);

  currentPage = signal(0);
  totalPages = signal(1);
  pageSize = 5;

  ngOnInit(): void {
    this.loadUser();
  }

  private loadUser() {
    this.userService.getUserProfile().subscribe({
      next: (u) => {
        this.user.set(u);
        this.loadReviews(0);
      },
      error: () => {
        console.error("No se pudo cargar el usuario.");
      }
    });
  }

  loadReviews(page: number = 0) {
    const role = this.user()?.role;
    if (!role) return;

    const handler = (res: any) => {
      const parsed = res.content.map((review: any) => ({
        ...review,
        creationDate: new Date(review.creationDate).toLocaleDateString('es-AR'),
      }));

      this.reviews.set(parsed);
      this.totalPages.set(res.totalPages);
      this.currentPage.set(page);
    };

    const req = role === 'ADMIN'
      ? this.reviewService.getAllReviewsPaged(page, this.pageSize)
      : this.reviewService.getMyReviewsPaged(page, this.pageSize);

    req.subscribe({
      next: handler,
      error: () => console.error("Error al cargar reseñas.")
    });
  }


  confirmDeleteSweet(id: number) {
    Swal.fire({
      title: '¿Eliminar reseña?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteReview(id);
      }
    });
  }

  
  private deleteReview(id: number) {
    this.reviewService.deleteReview(id).subscribe({
      next: () => {
        this.reviews.set(this.reviews().filter(r => r.id !== id));

        Swal.fire({
          title: 'Eliminada',
          text: 'La reseña fue eliminada correctamente.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
        });
      },
      error: () => {
        Swal.fire('Error', 'No se pudo eliminar la reseña.', 'error');
      },
    });
  }


  trackByIndex(index: number) {
    return index;
  }
}
