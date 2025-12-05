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

 
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  
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
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  return this.http.get<any[]>(`${this.url}/chats`, { headers });
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

  getAllMyChats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/me`, { headers: this.getHeaders() });
  }

  getCallsHistory(params: any) {
    return this.http.get<any[]>(`${this.url}/provider/history`, { params });
  }
  markMessagesAsSeen(callId: number, userId: number) {
  return this.http.put(`http://localhost:8080/api/messages/mark-seen/${callId}/${userId}`, {});
}

}
