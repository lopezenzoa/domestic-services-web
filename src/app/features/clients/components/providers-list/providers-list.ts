import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ProvidersService } from '../../../providers/services/providers.service';
import { CommonModule } from '@angular/common';
import { ProviderCardComponent } from '../provider-card/provider-card';
import { Provider } from '../../../providers/models/Provider';
import { Facilities } from '../../../facilities/models/facilities.model';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-providers-list',
  standalone:true,
  imports: [CommonModule, ProviderCardComponent],
  templateUrl: './providers-list.html',
  styleUrl: './providers-list.css',
})
export class ProvidersList {
  providersService = inject(ProvidersService);
  providersList = signal<Provider[]>([]);
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  facilityName = this.activatedRoute.snapshot.queryParamMap.get("facility");

  constructor() {
    this.providersService.getAllProviders().subscribe((providers) => {
      // Filtro los proveedores si hay en la ruta un parametro
      if (this.facilityName) {
        this.providersList.set(providers.filter((p) => p.facility.name.toLowerCase() === this.facilityName?.toLowerCase()));
      } else {
        this.providersList.set(providers);
      }
    });
  }
}
