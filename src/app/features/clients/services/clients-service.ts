import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  http: HttpClient = inject(HttpClient);
  baseUrl: string = 'http://localhost:8080/api/clients';

  getClientProfile() {
    return this.http.get(this.baseUrl + '/me');
  }
}
