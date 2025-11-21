import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Facilities } from '../models/facilities.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FacilitiesService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/facilities';

  addFacility(body: Facilities): Observable<Facilities> {
    return this.http.post<Facilities>(`${this.baseUrl}/create`, body);
  }

  getAll(searchTerm?: string): Observable<Facilities[]> {
    let params = new HttpParams();
    
    // Si hay un término de búsqueda, lo añade como parámetro 'query'
    if (searchTerm) {
      params = params.set('query', searchTerm);
    }
    
    return this.http.get<Facilities[]>(this.baseUrl + '/', { params: params });
  }

  getById(id: number): Observable<Facilities> {
    return this.http.get<Facilities>(this.baseUrl + '/' + id);
  }

  updateFacility(dto: Facilities): Observable<Facilities> {
    return this.http.put<Facilities>(this.baseUrl + '/update', dto);
  }

  deleteFacility(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}
