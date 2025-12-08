import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { UsersService } from '../../../features/users/services/users-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule,FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit{
  usersService: UsersService = inject(UsersService);
  userRole: WritableSignal<string | null> = signal(null);
  router = inject(Router);
  searchTerm: string = '';


  ngOnInit(): void {
    this.loadUserRole();
  }

  loadUserRole() {
    const savedUser = localStorage.getItem('user');
    this.userRole.set(savedUser ? JSON.parse(savedUser).role : null);
  }
  
  searchServices() {
    const term = this.searchTerm.trim();
    if (term) {
      
      this.router.navigate(['/facilities'], { queryParams: { search: term } });
    
      this.searchTerm = '';
    }
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userRole.set(null);
    this.router.navigate(['/auth/login']);
  }
}
