import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { CallService } from '../../../providers/services/call-service';
import { Auth } from '../../../auth/services/auth';

@Component({
  selector: 'app-mis-turnos',
  imports: [CommonModule, NgFor, NgIf],
  templateUrl: './mis-turnos.html',
  styleUrl: './mis-turnos.css',
})
export class MisTurnos implements OnInit {
  private callService = inject(CallService);
  private auth = inject(Auth);
  calls: any[] = [];
  cargando = true;

 ngOnInit() {
  this.callService.getMyCalls().subscribe({
    next: (data) => {
      console.log('Turnos recibidos:', data);
      this.calls = data;
      this.cargando = false;
    },
    error: (err) => {
      console.error('Error al obtener los turnos:', err);
      this.cargando = false;
    },
  });
}



  traducirEstado(estado: string): string {
  switch (estado) {
    case 'PENDING':
      return 'Aceptado (pendiente de realizar)';
    case 'REQUESTING':
      return 'En espera de aprobación';
    case 'DECLINED':
      return 'Rechazado';
    case 'ACCEPTED':
      return 'Aceptado';
    default:
      return estado;
  }
}

getEstadoClass(estado: string): string {
  switch (estado) {
    case 'ACCEPTED':
      return 'accepted';
    case 'DECLINED':
      return 'declined';
    case 'PENDING':
      return 'accepted';   // 👈 AGREGAMOS ESTO
    case 'REQUESTING':
      return 'pending';
    default:
      return '';
  }
}

}
