import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from "./shared/components/navbar/navbar";
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet, CommonModule, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
   title = 'Domestic Services';

  showNavbar = true;
  
  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const currentRoute = event.urlAfterRedirects;
        // Oculta el navbar solo en login y register
        this.showNavbar = !(
          currentRoute.includes('/auth/login') ||
          currentRoute.includes('/auth/register')
        );
      });
  }
}