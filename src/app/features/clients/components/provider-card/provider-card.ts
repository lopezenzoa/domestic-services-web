import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-provider-card', // Este es el tag que usamos en el @for
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./provider-card.html",
  styleUrl: "./provider-card.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProviderCardComponent {
  // 1. Define un Input para recibir el objeto 'provider'
  // Es mejor pasar el objeto completo que solo el ID,
  // así el componente hijo tiene toda la info que necesita.
  @Input() provider: any;
}