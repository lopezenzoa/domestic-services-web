import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ProvidersService } from '../../services/providers.service';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from "@angular/router";
import Swal from 'sweetalert2';

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

  Swal.fire({
    title: '¿Eliminar turno?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
  }).then(result => {

    if (result.isConfirmed) {

      this.providersService.deleteShift(shiftId, this.providerId()!).subscribe({
        next: () => {

          const updated = this.availability().filter(s => s.id !== shiftId);
          this.availability.set(updated);

          Swal.fire({
            title: 'Eliminado',
            text: 'El turno fue eliminado correctamente.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });

        },
        error: () => {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el turno.',
            icon: 'error'
          });
        }
      });

    }

  });

}

}