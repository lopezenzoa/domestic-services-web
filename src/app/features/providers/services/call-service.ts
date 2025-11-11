import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Call } from '../models/Call';

@Injectable({
  providedIn: 'root'
})
export class CallService {
  

  url = 'http://localhost:8080/api/calls';
  http = inject(HttpClient);
  router = inject(Router);

  getMyCalls(): Observable<any[]> {
    return this.http.get<any[]>(this.url + "/me");
  }

  getCalls(providerId: number) : Observable<Call[]>{
    return this.http.get<Call[]>(this.url + "/provider/" + providerId);
  }

  requestCall(callData: any) {
    return this.http.post(this.url + '/request', callData);
  }

  denyCall(callId : number, providerId: number){
    return this.http.put( this.url + `/provider/${providerId}/decline/${callId}`, {});
  }

  acceptCall(callId : number, providerId: number) {
    return this.http.put( this.url + `/provider/${providerId}/accept/${callId}`, {});
  }
  markAsFinished(callId: number, providerId: number) {
  return this.http.put(`http://localhost:8080/api/providers/${providerId}/calls/${callId}/finish`, {});
}

}
