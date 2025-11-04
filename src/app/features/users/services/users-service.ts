import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../models/User';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  http: HttpClient = inject(HttpClient);
  baseUrl: string = 'http://localhost:8080/api/users';

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`);
  }
}
