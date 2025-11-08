import { Component, inject, signal } from '@angular/core';
import { ProvidersService } from '../../../auth/services/providers.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-provider-shifts',
  imports: [NgIf,NgFor],
  templateUrl: './provider-shifts.html',
  styleUrl: './provider-shifts.css'
})
export class ProviderShifts {
  private providersService = inject(ProvidersService)

  availability = signal<any[]>([])
  loading = signal(true)
  error=signal('');

  ngOnInit(){
    //Simulamos un "delay" de carga para que parezca una request real
    setTimeout(() => {
      try {
        //Datos falsos (mock)
        const mockProvider = {
          id: 1,
          firstName: 'Agus',
          lastName: 'Marini',
          role: 'PROVIDER',
          facility: {
            id: 2,
            name: 'Electricidad',
            description: 'Reparaciones y mantenimiento'
          },
          shifts: [
            { id: 1, dateTime: '2025-11-09T09:00:00', available: true },
            { id: 2, dateTime: '2025-11-09T11:00:00', available: false },
            { id: 3, dateTime: '2025-11-09T15:30:00', available: true },
            { id: 4, dateTime: '2025-11-09T17:00:00', available: true }
          ]
        };

        this.availability.set(mockProvider.shifts);
        this.loading.set(false);
      } catch {
        this.error.set('Error al cargar los turnos de prueba.');
        this.loading.set(false);
      }
    }, 700); 
  }

   /*
   //Esto es para cuadno ya tengamos datos cargados desde el back  
   this.providersService.getMyProvider().subscribe({
     next: (provider) => {
    
        this.availability.set(provider.shifts || []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los horarios.');
        this.loading.set(false);
      }
    });
  }*/
}