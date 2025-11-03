import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from "./shared/components/navbar/navbar";
import { Register } from "./features/auth/pages/register/register";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, Navbar, Register],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
   title = 'Domestic Services';

  showNavbar = true;
  
  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      const currentRoute = this.router.url;
      this.showNavbar = !(
        currentRoute.includes('/auth/login') ||
        currentRoute.includes('/auth/register')
      );
    });
  }
}
