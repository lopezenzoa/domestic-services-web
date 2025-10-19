import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CommonModule],
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
