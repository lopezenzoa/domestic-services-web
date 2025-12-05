import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FacilitiesService } from '../../services/facilities-service';
import { Facility } from '../../models/facilities.model';
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
  
  allFacilities: WritableSignal<Facility[]> = signal([]);
  filteredFacilities: WritableSignal<Facility[]> = signal([]);
  
  usersService: UsersService = inject(UsersService);
  userRole: 'ADMIN' | 'CLIENT' | 'PROVIDER' | null = null;
  searchTerm: string = ''; 

  constructor() {}
  
  ngOnInit() {
    this.usersService.getUserProfile().subscribe((user) => {
      this.userRole = user.role;
    });


    this.searchTerm = this.activatedRoute.snapshot.queryParamMap.get('search') || '';

    this.loadFacilities();
    this.subscribeToRouteChanges();
  }


  loadFacilities() {

    this.service.getAll(this.searchTerm).subscribe((res: Facility[]) => {
      this.allFacilities.set(res);
   
      this.filteredFacilities.set(res);
    });
  }

  subscribeToRouteChanges() {
    this.activatedRoute.queryParams.subscribe(params => {
      const newTerm = params['search'] || ''; 
      
  
      if (newTerm !== this.searchTerm) {
          this.searchTerm = newTerm;
         
          this.loadFacilities(); 
      }
    });
  }


  fetchFacilities() {
   
      this.loadFacilities(); 
  }
  
 
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