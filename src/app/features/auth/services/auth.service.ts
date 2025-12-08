import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  address: string;
  facility: { name: string } | null;
  licenseNumber: string | null;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phoneNumber: string;
  role: string;
  address: string;
  facility?: {
    id: number;
    name: string;
  };
}
export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user';
  constructor(private http: HttpClient) {}

  register(data: RegisterRequest) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: LoginRequest) {
    return this.http.post(`${this.apiUrl}/login`, data, {
      observe: 'response',
    });
  }

  saveSession(auth: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, auth.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(auth.user));
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  userRole() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).role : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  hasRole(expected: string | string[]): boolean {
    const role = this.userRole();
    if (!role) return false;

    if (Array.isArray(expected)) {
      return expected.includes(role);
    }
    return role === expected;
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
