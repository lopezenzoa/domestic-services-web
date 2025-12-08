import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ProvidersService } from '../../../providers/services/providers.service';
import { CommonModule } from '@angular/common';
import { ProviderCardComponent } from '../provider-card/provider-card';
import { Provider } from '../../../../shared/models/Provider';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-providers-list',
  standalone: true,
  imports: [CommonModule, ProviderCardComponent,FormsModule],
  templateUrl: './providers-list.html',
  styleUrl: './providers-list.css',
})
export class ProvidersList {
  providersService = inject(ProvidersService);
  allProviders = signal<Provider[]>([]);
  filteredAndPaginatedProviders = signal<Provider[]>([]);
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  facilityName: string | null = null; 
  searchName: string = ''; 

  pageSize: number = 10;
  currentPage = signal(1);
  totalPages = signal(1);
  isLoading = signal(true);
  private router = inject(Router);

   ngOnInit() {
  
    this.facilityName = this.activatedRoute.snapshot.queryParamMap.get("facility");
    this.loadAllProviders(); 
  }

  loadAllProviders() {
    this.isLoading.set(true);
    this.providersService.getAllProviders().subscribe({
        next: (providers) => {
            this.allProviders.set(providers);
            this.currentPage.set(1);
            this.applyFiltersAndPaginate(); 
            this.isLoading.set(false);
        },
        error: (err) => {
            console.error("Error al cargar proveedores", err);
            this.allProviders.set([]);
            this.isLoading.set(false);
        }
    });
  }

 
  applyFiltersAndPaginate() {
    const term = this.searchName.toLowerCase().trim();
    let data = this.allProviders();

    if (this.facilityName) {
        data = data.filter(p => p.facility?.name?.toLowerCase() === this.facilityName?.toLowerCase());
    }


    if (term) {
        data = data.filter(provider => {
            const matchName = provider.firstName.toLowerCase().includes(term) ||
                              provider.lastName.toLowerCase().includes(term);
            
      
            const matchDescription = (provider as any).description?.toLowerCase().includes(term); 

            return matchName || matchDescription;
        });
    }

    const total = data.length;
    const pages = Math.ceil(total / this.pageSize);
    this.totalPages.set(pages > 0 ? pages : 1);
    
    if (this.currentPage() > this.totalPages()) {
        this.currentPage.set(this.totalPages());
    }
    
    const startIndex = (this.currentPage() - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    
    this.filteredAndPaginatedProviders.set(data.slice(startIndex, endIndex));
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
        this.currentPage.update(val => val + 1);
        this.applyFiltersAndPaginate();
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
        this.currentPage.update(val => val - 1);
        this.applyFiltersAndPaginate();
    }
  }

  
  requestCall(providerId: number) {
    this.router.navigate(['/calls/request', providerId]);
  }
}
