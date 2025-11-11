import { Component, inject, OnInit, signal } from '@angular/core';
import { CallService } from '../../services/call-service';
import { Router } from '@angular/router';
import { Call } from '../../models/Call';
import {  NgClass, DatePipe, NgIf } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-call-list',
  standalone:true,
  imports: [NgClass, DatePipe, NgIf],
  templateUrl: './call-list.html',
  styleUrl: './call-list.css',
})
export class CallList implements OnInit {
  calls = signal<any[] | undefined>(undefined);
  service = inject(CallService);
  router = inject(Router);

  ngOnInit() {
    this.getMyCalls();
  }

  getMyCalls() {
    return this.service.getMyCalls().subscribe((calls) => {
      this.calls.set(calls);
    });
  }


  acceptCall(idCall: number, providerId: number) {
  this.service.acceptCall(idCall, providerId).subscribe({
    next: () => {
      Swal.fire({
        title: '¡Contratación aceptada!',
        text: 'La visita fue aceptada con éxito.',
        icon: 'success',
        confirmButtonColor: '#06d6a0',
      }).then(() => this.getMyCalls());
    },
    error: () => {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo aceptar la contratación.',
        icon: 'error',
        confirmButtonColor: '#e63946',
      });
    },
  });
}


  denyCall(idCall: number, providerId: number) {
  this.service.denyCall(idCall, providerId).subscribe({
    next: () => {
      Swal.fire({
        title: 'Visita rechazada',
        text: 'La visita fue rechazada correctamente.',
        icon: 'info',
        confirmButtonColor: '#457b9d',
      }).then(() => this.getMyCalls());
    },
    error: () => {
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al rechazar la visita.',
        icon: 'error',
        confirmButtonColor: '#e63946',
      });
    },
  });
}

   editCall(callId: number) {
    this.router.navigate(['/providers/shifts/edit', callId]);
  }

  
}
