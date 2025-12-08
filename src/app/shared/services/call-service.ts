import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Call } from '../models/Call';
import { CallRequest } from '../models/CallRequest';

export interface PaginatedCallsResponse {
  content: Call[];
  totalPages: number;
  totalElements: number;
}

@Injectable({
  providedIn: 'root',
})
export class CallService {
  private url = 'http://localhost:8080/api/calls'; 
  private http = inject(HttpClient);

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getMyCalls(): Observable<Call[]> {
    return this.http.get<Call[]>(`${this.url}/me`, { headers: this.getHeaders() });
  }
  getCallsByClient(clientId: number): Observable<Call[]> {
    return this.http.get<Call[]>(`${this.url}/client/${clientId}`, { headers: this.getHeaders() });
  }
  getCalls(providerId: number): Observable<Call[]> {
    return this.http.get<Call[]>(`${this.url}/provider/${providerId}`, {
      headers: this.getHeaders(),
    });
  }
  getRequestedCallsByProvider(providerId: number): Observable<Call[]> {
    return this.http.get<Call[]>(`${this.url}/provider/${providerId}/requested`, {
      headers: this.getHeaders(),
    });
  }

  requestCall(body: CallRequest) {
    return this.http.post(`${this.url}/request`, body, { headers: this.getHeaders() });
  }
  denyCall(callId: number, providerId: number): Observable<void> {
    return this.http.put<void>(
      `${this.url}/provider/${providerId}/decline/${callId}`,
      {},
      { headers: this.getHeaders() }
    );
  }
  acceptCall(callId: number, providerId: number): Observable<void> {
    return this.http.put<void>(
      `${this.url}/provider/${providerId}/accept/${callId}`,
      {},
      { headers: this.getHeaders() }
    );
  }
  markAsFinished(callId: number, providerId: number): Observable<void> {
    return this.http.put<void>(
      `${this.url}/provider/${providerId}/finish/${callId}`,
      {},
      { headers: this.getHeaders() }
    );
  }
  deleteCall(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/delete/${id}`, { headers: this.getHeaders() });
  }
  getProviderCallDetail(providerId: number, callId: number): Observable<Call> {
    return this.http.get<Call>(`${this.url}/provider/${providerId}/detail/${callId}`, {
      headers: this.getHeaders(),
    });
  }
  getCallById(callId: number): Observable<Call> {
    return this.getCallDetailForClient(callId);
  }
  getCallDetailForClient(callId: number): Observable<Call> {
    return this.http.get<Call>(`${this.url}/client/call/${callId}`, { headers: this.getHeaders() });
  }
  getMyChats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/chats`, { headers: this.getHeaders() });
  }
  getAllMyChats(): Observable<Call[]> {
    return this.getMyCalls();
  }
  markMessagesAsSeen(callId: number, userId: number): Observable<void> {
    return this.http.put<void>(
      `http://localhost:8080/api/messages/mark-seen/${callId}/${userId}`,
      {},
      { headers: this.getHeaders() }
    );
  }
getCallsHistory(filters: any) {

  let params = new HttpParams()
    .set('page', filters.page)
    .set('size', filters.size);

  if (filters.providerId) params = params.set('providerId', filters.providerId);
  if (filters.state) params = params.set('state', filters.state);
  if (filters.start) params = params.set('start', filters.start);
  if (filters.end) params = params.set('end', filters.end);

  return this.http.get<PaginatedCallsResponse>(
    `${this.url}/history`,
    { params, headers: this.getHeaders() }
  );
}





}
