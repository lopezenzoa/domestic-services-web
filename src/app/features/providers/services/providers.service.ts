import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Provider } from '../models/Provider';
import { Shift } from '../models/Shift';


@Injectable({
  providedIn: 'root'
})
export class ProvidersService {
  private http = inject(HttpClient)
  private baseUrl = 'http://localhost:8080/api/providers'

  updateLicense(provideId: number,licenseNumber:string):Observable<any>{
    return this.http.put(`${this.baseUrl}/${provideId}/license`,{licenseNumber})

  }

  getAllProviders(): Observable<Provider[]> {
    return this.http.get<Provider[]>(this.baseUrl + "/");
  }

  /** Deberia tener el tipado correcto (Provider) */
  getProviderById(providerId: number): Observable<Provider> {
    return this.http.get<Provider>(`${this.baseUrl}/${providerId}`);
  }

  getProviderProfile() {
    return this.http.get<Provider>(this.baseUrl + '/me');
  }

  /** Debería tener el tipado correcto (Shift) */
  getProviderShifts(providerId: number): Observable<Shift[]> {
    return this.http.get<Shift[]>(`${this.baseUrl}/shifts/${providerId}/available`);
  }
}
