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
  const token = localStorage.getItem('token');
  if (!token) {
    this.userRole.set(null);
    return; 
  }

  this.usersService.getUserProfile().subscribe({
    next: (profile) => this.userRole.set(profile.role),
    error: () => this.userRole.set(null)
  });
}

}
