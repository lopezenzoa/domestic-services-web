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

  activeTab: string = 'pendientes';

  calls: any[] = [];
  pendientes: any[] = [];
  aceptados: any[] = [];
  rechazados: any[] = [];
  realizados: any[] = [];

  cargando = true;

  ngOnInit() {
    this.callService.getMyCalls().subscribe({
      next: (data) => {
        console.log('Turnos recibidos:', data);
        this.calls = data;
        this.pendientes = data.filter((t) =>  t.state === 'REQUESTING');
        this.aceptados = data.filter((t) => t.state === 'ACCEPTED' || t.state === 'PENDING');
        this.rechazados = data.filter((t) => t.state === 'DECLINED' || t.state === 'REJECTED');
        this.realizados = data.filter((t) => t.state === 'DONE');
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener los turnos:', err);
        this.cargando = false;
      },
    });
  }
  setTab(tab: string) {
    this.activeTab = tab;
  }

  traducirEstado(estado: string): string {
    switch (estado) {
      case 'PENDING':
        return 'Aceptado (pendiente de realizar)';
      case 'REQUESTING':
        return 'En espera de aprobación';
      case 'DECLINED':
      case 'REJECTED':
        return 'Rechazado';
      case 'ACCEPTED':
        return 'Aceptado';
      case 'DONE':
        return 'Finalizado';
      default:
        return estado;
    }
  }

  // getEstadoClass (Debe estar así)
getEstadoClass(estado: string): string {
  switch (estado) {
    case 'ACCEPTED':
    case 'PENDING': // VERDE (Aceptados)
      return 'accepted'; 
    case 'DECLINED':
    case 'REJECTED':
      return 'declined'; 
    case 'REQUESTING': // AMARILLO/NARANJA (Pendientes)
      return 'pending'; 
    case 'DONE':
      return 'done'; 
    default:
      return '';
  }
}
}
