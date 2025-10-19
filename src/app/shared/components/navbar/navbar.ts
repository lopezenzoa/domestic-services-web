import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink,CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit{
  menuOpen = false;
  isLoggedIn = false;
  userRole: 'CLIENTE'|'PRESTADOR'|'ADMIN'| null = null;
  
  constructor(private router: Router){}

  ngOnInit() {
    const user = localStorage.getItem('user');
    if(user){
      this.isLoggedIn = true;
      this.userRole = JSON.parse(user).role;
    }
  }
  toggleMenu(){
    this.menuOpen = !this.menuOpen
  }
  logout(){
    localStorage.removeItem('user');
    this.isLoggedIn = false;
    this.userRole = null;
    this.router.navigate(['/auth/loggin'])
  }
}
