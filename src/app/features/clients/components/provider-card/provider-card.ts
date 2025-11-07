import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-provider-card', // Este es el tag que usamos en el @for
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- 
      Usamos 'provider' que recibimos del @Input.
      El '?' (optional chaining) es una buena práctica por si 
      el objeto llega a ser nulo o indefinido temporalmente.
    -->
    <div class="card">
      <h4>{{ provider?.firstName | uppercase }}</h4>  
      <p>Servicio: {{ provider?.facility.name }}</p>
      <p>Licencia: {{ provider?.licenseNumber }}</p>
      <p>Mail: {{ provider?.email }}</p>
      <p>Telefono: {{ provider?.phoneNumber }}</p>
      <p>Horarios disponibles: {{ provider?.shifts}} </p>
      <button [routerLink]="['/calls/request', provider?.id]" class="action-button">
      Reservar
    </button>
    </div>
  `,
  styles: [`
    .card {
      background-color: #f9f9f9;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 10px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    h4 {
      margin: 0 0 10px 0;
      color: #333;
    }
    p {
      margin: 4px 0;
      font-size: 0.9em;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProviderCardComponent {
  // 1. Define un Input para recibir el objeto 'provider'
  // Es mejor pasar el objeto completo que solo el ID,
  // así el componente hijo tiene toda la info que necesita.
  @Input() provider: any;
  
  // Si *realmente* solo quisieras pasar el ID, harías:
  // @Input() providerId: string | number;
  // Y en el padre: [providerId]="provider.id"
}