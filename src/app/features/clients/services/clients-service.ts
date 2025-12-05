import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ClientProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phoneNumber?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ClientsService {

  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/clients';

  getClientProfile(): Observable<ClientProfile> {
    return this.http.get<ClientProfile>(`${this.baseUrl}/me`);
  }
}
