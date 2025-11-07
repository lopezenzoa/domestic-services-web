import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ProvidersService } from '../../../providers/services/providers.service';
import { CommonModule } from '@angular/common';
import { ProviderCardComponent } from '../provider-card/provider-card';
import { Provider } from '../../../providers/models/Provider';
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

  constructor() {
    this.providersService.getAllProviders().subscribe((providers) => {
      this.providersList.set(providers);
    });
  }
}
