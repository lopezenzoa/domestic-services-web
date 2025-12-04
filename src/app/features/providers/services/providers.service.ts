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

  getMyProvider(): Observable<any> { //obtener los datos del prestador que está actualmente logueado
  return this.http.get<any>(`${this.baseUrl}/me`);
  } 

  /** Debería tener el tipado correcto (Shift) */
  getProviderShifts(providerId: number): Observable<Shift[]> {
    return this.http.get<Shift[]>(`${this.baseUrl}/shifts/${providerId}/available`);
  }

  // Agregar un nuevo turno para el prestador
  addShift(shiftData: any, providerId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/shifts/${providerId}/create`, shiftData);
  }

  // Borrar un turno existente del prestador
  deleteShift(shiftId: number, providerId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/shifts/${providerId}/delete/${shiftId}`);
  }

    // Agregar un nuevo turno para el prestador
  editShift(shiftData: any, providerId: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/shifts/${providerId}/update`, shiftData);
  }
}
