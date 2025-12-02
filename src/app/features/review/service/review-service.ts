import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Review } from '../models/Review';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/reviews';

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  createReview(body: Review): Observable<Review> {
    return this.http.post<Review>(
      `${this.baseUrl}/create`,
      body,
      this.getAuthHeaders()
    );
  }

  getMyReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(
      `${this.baseUrl}/me`,
      this.getAuthHeaders()
    );
  }

  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/delete/${id}`,
      this.getAuthHeaders()
    );
  }

  getAllReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(
      `${this.baseUrl}/`,
      this.getAuthHeaders()
    );
  }

  getMyReviewsPaged(page: number, size: number) {
    return this.http.get<any>(
      `${this.baseUrl}/my-reviews?page=${page}&size=${size}`,
      this.getAuthHeaders()
    );
  }

  getAllReviewsPaged(page: number, size: number) {
    return this.http.get<any>(
      `${this.baseUrl}/all?page=${page}&size=${size}`,
      this.getAuthHeaders()
    );
  }
}

  

