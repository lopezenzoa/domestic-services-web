import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProvidersService {
  private http = inject(HttpClient)
  private baseUrl = 'http://localhost:8080/api/providers'

  updateLicense(provideId: number,licenseNumber:string):Observable<any>{
    return this.http.put(`${this.baseUrl}/${provideId}/license`,{licenseNumber})

  }
}
