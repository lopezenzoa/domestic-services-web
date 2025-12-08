import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../models/Message';

@Injectable({
  providedIn: 'root',
})
export class MessageService {

  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/messages';

  
  messages = signal<Message[]>([]);

 
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }


  getMessages(callId: number): Observable<Message[]> {
    return this.http.get<Message[]>(
      `${this.baseUrl}/call/${callId}`,
      { headers: this.getAuthHeaders() }
    );
  }


  sendMessage(msg: Message): Observable<Message> {
    return this.http.post<Message>(
      `${this.baseUrl}`,
      msg,
      { headers: this.getAuthHeaders() }
    );
  }


  markAsSeen(callId: number, userId: number): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/seen/${callId}/${userId}`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }
}
