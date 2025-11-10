import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { UsersService } from '../../../features/users/services/users-service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule,CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar  {
  usersService: UsersService = inject(UsersService);
  userRole: WritableSignal<string | null> = signal(null);

  constructor() {
    // Obtener el rol del usuario desde el servicio
    this.usersService.getUserProfile().subscribe(profile => {
      this.userRole.set(profile.role);
    });
  }
}
