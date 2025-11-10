import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ProvidersService } from '../../services/providers.service';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-provider-shifts',
  imports: [NgIf, NgFor, RouterLink],
  templateUrl: './provider-shifts.html',
  styleUrl: './provider-shifts.css'
})
export class ProviderShifts {
  private providersService = inject(ProvidersService)

  availability = signal<any[]>([])
  loading = signal(true)
  error=signal('');

  providerId: WritableSignal<number | null> = signal(null);

  ngOnInit(){
    /*
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
    */

    // Esto es para cuando ya tengamos datos cargados desde el back  
   this.providersService.getMyProvider().subscribe({
     next: (provider) => {
    
        this.availability.set(provider.shifts || []);
        this.loading.set(false);
        this.providerId.set(provider.id);
      },
      error: () => {
        this.error.set('No se pudieron cargar los horarios.');
        this.loading.set(false);
      }
    });
  }

  eliminarTurno(shiftId: number) {
    // Simulamos la eliminación del turno en el backend
    this.providersService.deleteShift(shiftId, this.providerId()!).subscribe({
      next: () => {
        // Actualizamos la lista de turnos disponibles
        const updatedShifts = this.availability().filter(shift => shift.id !== shiftId);
        this.availability.set(updatedShifts);
      },
      error: () => {
        this.error.set('No se pudo eliminar el turno.');
      }
    });
  }
}