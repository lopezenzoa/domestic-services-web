import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../models/User';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/users';

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  getUserProfile(): Observable<User> {
    return this.http.get<User>(
      `${this.baseUrl}/me`,
      this.getAuthHeaders()
    );
  }
}
