import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ProvidersService } from '../../services/providers.service';
import { NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { ShiftItemComponent } from '../../components/shift-item/shift-item-component';


@Component({
  selector: 'app-provider-shifts',
  imports: [NgIf, NgFor, RouterLink, ShiftItemComponent],
  templateUrl: './provider-shifts.html',
  styleUrl: './provider-shifts.css'
})
export class ProviderShifts {

  private providersService = inject(ProvidersService)
  router = inject(Router);

  availability = signal<any[]>([]);
  loading = signal(true);
  error = signal('');
  providerId: WritableSignal<number | null> = signal(null);

  ngOnInit(){
    this.providersService.getMyProvider().subscribe({
      next: (provider) => {
        this.availability.set(provider.shifts || []);
        this.providerId.set(provider.id);
        this.loading.set(false);
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
            this.availability.set(
              this.availability().filter(s => s.id !== shiftId)
            );

            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              timer: 1500,
              showConfirmButton: false
            });
          },
          error: () => {
            Swal.fire({ icon: 'error', title: 'Error al eliminar' });
          }
        });
      }
    });
  }
}
