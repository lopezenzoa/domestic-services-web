import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Provider } from '../../../shared/models/Provider';
import { Shift } from '../../../shared/models/Shift';

@Injectable({
  providedIn: 'root'
})
export class ProvidersService {

  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/providers';

  
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  
  updateLicense(providerId: number, licenseNumber: string): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/${providerId}/license`, 
      { licenseNumber },
      { headers: this.getHeaders() } 
    );
  }

  getAllProviders(): Observable<Provider[]> {
    
    return this.http.get<Provider[]>(`${this.baseUrl}/`, { headers: this.getHeaders() });
  }

  getProviderById(providerId: number): Observable<Provider> {
    return this.http.get<Provider>(`${this.baseUrl}/${providerId}`, { headers: this.getHeaders() });
  }

  getProviderProfile(): Observable<Provider> {
    return this.http.get<Provider>(`${this.baseUrl}/me`, { headers: this.getHeaders() });
  }

  getMyProvider(): Observable<Provider> {
    return this.http.get<Provider>(`${this.baseUrl}/me`, { headers: this.getHeaders() });
  }

  getProviderShifts(providerId: number): Observable<Shift[]> {
    return this.http.get<Shift[]>(`${this.baseUrl}/shifts/${providerId}/available`, { headers: this.getHeaders() });
  }

  addShift(shiftData: any, providerId: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/shifts/${providerId}/create`, 
      shiftData,
      { headers: this.getHeaders() } 
    );
  }

  deleteShift(shiftId: number, providerId: number): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/shifts/${providerId}/delete/${shiftId}`,
      { headers: this.getHeaders() } 
    );
  }

  editShift(shiftData: any, providerId: number): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/shifts/${providerId}/update`, 
      shiftData,
      { headers: this.getHeaders() }
    );
  }
}