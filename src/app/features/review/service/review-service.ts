import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Review } from '../models/Review';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/reviews'
  
  createReview (body: Review): Observable<Review> {
    return this.http.post<Review>(`${this.baseUrl}/create`, body);
  }
  
}
