import { Component, inject, OnInit, signal } from '@angular/core';
import { CallService } from '../../services/call-service';
import { Router } from '@angular/router';
import { Call } from '../../models/Call';

@Component({
  selector: 'app-call-list',
  imports: [],
  templateUrl: './call-list.html',
  styleUrl: './call-list.css',
})
export class CallList implements OnInit {
  calls = signal<Call[] | undefined>(undefined);
  service = inject(CallService);
  router = inject(Router);

  ngOnInit() {
    // this.getCalls();

    if (this.calls.length === 0) {
      this.calls.set([
        {
          id: 1,
          description: 'Reparación de cañería rota en baño principal',
          date: '2025-11-04T09:30:00',
          address: 'Av. Colón 1234, Mar del Plata',
          state: 'En curso',
          clientId: 101,
          providerId: 501,
        },
        {
          id: 2,
          description: 'Instalación de aire acondicionado en oficina',
          date: '2025-11-03T14:00:00',
          address: 'Calle San Martín 222, Buenos Aires',
          state: 'Completado',
          clientId: 102,
          providerId: 502,
        },
        {
          id: 3,
          description: 'Revisión eléctrica en cocina',
          date: '2025-11-02T10:15:00',
          address: 'Av. Libertad 456, Córdoba',
          state: 'Pendiente',
          clientId: 103,
          providerId: 503,
        },
        {
          id: 4,
          description: 'Limpieza de tanque de agua',
          date: '2025-10-31T08:00:00',
          address: 'Calle Mitre 987, Rosario',
          state: 'Cancelado',
          clientId: 104,
          providerId: 504,
        },
        {
          id: 5,
          description: 'Pintura de fachada exterior',
          date: '2025-11-01T11:45:00',
          address: 'Av. Independencia 321, La Plata',
          state: 'En curso',
          clientId: 105,
          providerId: 505,
        },
      ]);
    }
  }

  getCalls() {
    return this.service.getCalls(3).subscribe((calls) => {
      this.calls.set(calls);

      console.log(calls);
    });
  }
}
