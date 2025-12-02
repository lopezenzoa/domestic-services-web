import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Call } from '../models/Call';

@Injectable({
  providedIn: 'root',
})
export class CallService {
  private url = 'http://localhost:8080/api/calls';
  private http = inject(HttpClient);
  private router = inject(Router);

  /** Método reutilizable para agregar el token a los headers */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  /**  Usa el endpoint /me con autenticación */
  getMyCalls(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/me`, { headers: this.getHeaders() });
  }

  getCalls(providerId: number): Observable<Call[]> {
    return this.http.get<Call[]>(`${this.url}/provider/${providerId}`, {
      headers: this.getHeaders(),
    });
  }

  requestCall(callData: any) {
    return this.http.post(`${this.url}/request`, callData, {
      headers: this.getHeaders(),
    });
  }

  denyCall(callId: number, providerId: number) {
    return this.http.put(
      `${this.url}/provider/${providerId}/decline/${callId}`,
      {},
      {
        headers: this.getHeaders(),
      }
    );
  }

  acceptCall(callId: number, providerId: number) {
    return this.http.put(
      `${this.url}/provider/${providerId}/accept/${callId}`,
      {},
      {
        headers: this.getHeaders(),
      }
    );
  }

  markAsFinished(callId: number, providerId: number) {
    return this.http.put(
      `${this.url}/provider/${providerId}/finish/${callId}`,
      {},
      { headers: this.getHeaders() }
    );
  }

  getCallsByClient(clientId: number) {
    return this.http.get<any[]>(`${this.url}/client/${clientId}`, {
      headers: this.getHeaders(),
    });
  }
  getCallById(callId: number) {
    return this.http.get<any>(`${this.url}/client/call/${callId}`, {
      headers: this.getHeaders(),
    });
  }

 getProviderCallDetail(providerId: number, callId: number) {
  return this.http.get<any>(
    `${this.url}/provider/${providerId}/detail/${callId}`
  );
}

 getMyChats() {
   return this.http.get<any[]>(`${this.url}/chats`);
}


  getHistoryPaginated(providerId: number, page: number, size: number) {
    return this.http.get<any>(`${this.url}/provider/${providerId}/history`, {
      params: {
        page: page.toString(),
        size: size.toString(),
      },
      headers: this.getHeaders(),
    });
  }
  getCallDetailForClient(callId: number) {
  return this.http.get<any>(`${this.url}/client/call/${callId}`);
}

  /** Obtiene TODOS los llamados del usuario logueado (cliente o proveedor) */
  getAllMyChats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/me`, { headers: this.getHeaders() });
  }

  getCallsHistory(params: any) {
    return this.http.get<any[]>(`${this.url}/provider/history`, { params });
  }
}
