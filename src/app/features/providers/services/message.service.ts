import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Message } from '../models/Message';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class MessageService {
  private http = inject(HttpClient);
    private baseUrl = 'http://localhost:8080/api/messages';
  getMessages(callId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/call/${callId}`);
  }
  //almacena mensajes
  messages = signal<Message[]>([]);

  


sendMessage(msg: any) {
  const token = localStorage.getItem('token');

  const headers: any = {
    'Content-Type': 'application/json'
  };

  // Solo agrego Authorization si hay token
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

 return this.http.post<any>(`${this.baseUrl}`, msg, {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});


}}