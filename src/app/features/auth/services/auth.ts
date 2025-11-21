import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: any) {
    return this.http.post(`${this.apiUrl}/login`, data, { observe: 'response' });
  }
  getUser() {
    //método para obtener el usuario logueado
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  userRole() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).role : null;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
