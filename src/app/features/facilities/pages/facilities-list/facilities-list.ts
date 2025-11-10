import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FacilitiesService } from '../../services/facilities-service';
import { Facilities } from '../../models/facilities.model';
import { RouterLink } from "@angular/router";
import { UsersService } from '../../../users/services/users-service';

@Component({
  selector: 'app-facilities-list',
  imports: [RouterLink],
  templateUrl: './facilities-list.html',
  styleUrl: './facilities-list.css'
})
export class FacilitiesList {
  service: FacilitiesService = inject(FacilitiesService);
  facilitiesList: WritableSignal<Facilities[]> = signal([]);
  usersService: UsersService = inject(UsersService);
  userRole: string | null = null;

  constructor() {
    // Obtener perfil del usuario al cargar el componente
    this.usersService.getUserProfile().subscribe((user) => {
      this.userRole = user.role;
    });

    this.service.getAll().subscribe((res: Facilities[]) => {
      this.facilitiesList.set(res);
    });
  }
}
