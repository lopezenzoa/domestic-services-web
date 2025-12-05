import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Facility } from '../models/facilities.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FacilitiesService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/facilities';

  addFacility(body: Facility): Observable<Facility> {
    return this.http.post<Facility>(`${this.baseUrl}/create`, body);
  }

  getAll(searchTerm?: string): Observable<Facility[]> {
    let params = new HttpParams();
    
    if (searchTerm) {
      params = params.set('query', searchTerm);
    }
    
    return this.http.get<Facility[]>(this.baseUrl + '/', { params: params });
  }

  getById(id: number): Observable<Facility> {
    return this.http.get<Facility>(this.baseUrl + '/' + id);
  }

  updateFacility(dto: Facility): Observable<Facility> {
    return this.http.put<Facility>(this.baseUrl + '/update', dto);
  }

  deleteFacility(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}
