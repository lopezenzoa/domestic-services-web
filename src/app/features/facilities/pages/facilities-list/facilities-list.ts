import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FacilitiesService } from '../../services/facilities-service';
import { Facilities } from '../../models/facilities.model';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
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
  service: FacilitiesService = inject(FacilitiesService);
  
  allFacilities: WritableSignal<Facilities[]> = signal([]);
  filteredFacilities: WritableSignal<Facilities[]> = signal([]);
  
  usersService: UsersService = inject(UsersService);
  userRole: 'ADMIN' | 'CLIENT' | 'PROVIDER' | null = null;
  searchTerm: string = ''; 

  constructor() {}
  
  ngOnInit() {
    this.usersService.getUserProfile().subscribe((user) => {
      this.userRole = user.role;
    });

    //  Leer el parámetro inicial de la URL 
    this.searchTerm = this.activatedRoute.snapshot.queryParamMap.get('search') || '';
    
    //  Cargar los datos filtrados con el término inicial (Llama al backend)
    this.loadFacilities();
    
    //Suscribirse a cambios futuros en la URL (si el usuario busca desde el Navbar)
    this.subscribeToRouteChanges();
  }

  //  Llama al backend con el filtro 
  loadFacilities() {
    // Si la búsqueda está activa, el servicio enviará el parámetro 'query' al backend
    this.service.getAll(this.searchTerm).subscribe((res: Facilities[]) => {
      this.allFacilities.set(res);
      // Tras recibir los datos del backend (ya filtrados), los asignamos a la lista visible
      this.filteredFacilities.set(res);
    });
  }

  subscribeToRouteChanges() {
    this.activatedRoute.queryParams.subscribe(params => {
      const newTerm = params['search'] || ''; 
      
      // Si el término realmente cambió (ej. el usuario buscó en el navbar)
      if (newTerm !== this.searchTerm) {
          this.searchTerm = newTerm;
          //  Cargar la lista nuevamente desde el backend con el nuevo filtro ❗
          this.loadFacilities(); 
      }
    });
  }

  // Este método es solo para la búsqueda en el input local (si existiera)
  fetchFacilities() {
      // Como el filtro ahora es del backend, llamamos a loadFacilities()
      this.loadFacilities(); 
  }
  
  // Navegar a la lista de prestadores del servicio
  verPrestadores(facilityName: string) {
    if (this.userRole === 'CLIENT') {
      this.router.navigate(['/providers'], {
        queryParams: { facility: facilityName.toLowerCase() },
      });
    }
  }

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
            // Recargar la lista de servicios filtrada después de la eliminación
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
}