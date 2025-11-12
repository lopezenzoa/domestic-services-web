import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FacilitiesService } from '../../services/facilities-service';
import { Facilities } from '../../models/facilities.model';
import { RouterLink, Router } from '@angular/router';
import { UsersService } from '../../../users/services/users-service';

@Component({
  selector: 'app-facilities-list',
  imports: [RouterLink],
  templateUrl: './facilities-list.html',
  styleUrls: ['./facilities-list.css'],
})
export class FacilitiesList {
  private router = inject(Router);
  service: FacilitiesService = inject(FacilitiesService);
  facilitiesList: WritableSignal<Facilities[]> = signal([]);
  usersService: UsersService = inject(UsersService);
  userRole: 'ADMIN' | 'CLIENT' | 'PROVIDER' | null = null;

  constructor() {
    // Obtener perfil del usuario al cargar el componente
    this.usersService.getUserProfile().subscribe((user) => {
      this.userRole = user.role;
    });

    this.service.getAll().subscribe((res: Facilities[]) => {
      this.facilitiesList.set(res);
    });
  }
  // Navegar a la lista de prestadores del servicio
  verPrestadores(facilityName: string) {
    // si querés permitir también a PROVIDER, agregalo en la condición
    if (this.userRole === 'CLIENT') {
      this.router.navigate(['/providers'], {
        queryParams: { facility: facilityName.toLowerCase() },
      });
    }
  }

  deleteFacility(id: number): void {
    const confirmed = confirm('¿Seguro que deseas eliminar este servicio?');
    if (confirmed) {
      this.service.deleteFacility(id).subscribe({
        next: () => {
          alert(' Servicio eliminado correctamente');
          // Filtra la lista local para que desaparezca sin recargar todo
          this.facilitiesList.update((list) => list.filter((f) => f.id !== id));
        },
        error: (err) => {
          console.error('Error al eliminar servicio:', err);
          alert(' Error al intentar eliminar el servicio.');
        },
      });
    }
  }
}
