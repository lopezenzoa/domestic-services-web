import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FacilitiesService } from '../../services/facilities-service';
import { Facility } from '../../models/facilities.model';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UsersService } from '../../../users/services/users-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-facilities-list',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './facilities-list.html',
  styleUrls: ['./facilities-list.css'],
})
export class FacilitiesList implements OnInit {

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private service = inject(FacilitiesService);
  private usersService = inject(UsersService);

  // Signals
  facilities = signal<Facility[]>([]);
  searchTerm = signal('');
  userRole = signal<'ADMIN' | 'CLIENT' | 'PROVIDER' | null>(null);

  // Filtrado automático
  filteredFacilities = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();

    return this.facilities().filter(f =>
      f.name.toLowerCase().includes(term) ||
      (f.description?.toLowerCase().includes(term))
    );
  });

  ngOnInit() {
    // Rol del usuario
    this.usersService.getUserProfile().subscribe(user => {
      this.userRole.set(user.role);
    });

    // Parámetro de búsqueda inicial
    const initialSearch = this.activatedRoute.snapshot.queryParamMap.get('search') || '';
    this.searchTerm.set(initialSearch);

    this.loadFacilities();

    // Escuchar cambios en query params
    this.activatedRoute.queryParams.subscribe(params => {
      const newTerm = params['search'] || '';
      if (newTerm !== this.searchTerm()) {
        this.searchTerm.set(newTerm);
      }
    });
  }

  loadFacilities() {
    this.service.getAll(this.searchTerm()).subscribe({
      next: res => this.facilities.set(res),
      error: (err) => {
        console.error('Error al cargar servicios:', err);
        Swal.fire('Error', 'No se pudieron cargar los servicios.', 'error');
      }
    });
  }

  fetchFacilities() {
    // Actualiza query params (queda lindo para compartir URL)
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { search: this.searchTerm() },
      queryParamsHandling: 'merge'
    });
  }

  verPrestadores(facilityName: string) {
    if (this.userRole() === 'CLIENT') {
      this.router.navigate(['/providers'], {
        queryParams: { facility: facilityName.toLowerCase() },
      });
    }
  }

  // 👇 Tu deleteFacility integrado tal cual, solo cambiando this.service
  deleteFacility(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e63946',
      cancelButtonColor: '#457b9d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteFacility(id).subscribe({
          next: () => {
            Swal.fire('Eliminado!', 'El servicio ha sido eliminado.', 'success');
            this.loadFacilities();
          },
          error: (err) => {
            console.error('Error al eliminar servicio:', err);
            Swal.fire('Error', 'Error al intentar eliminar el servicio.', 'error');
          },
        });
      }
    });
  }

  trackByFacility(index: number, item: Facility): number {
    return item.id;
  }
}
