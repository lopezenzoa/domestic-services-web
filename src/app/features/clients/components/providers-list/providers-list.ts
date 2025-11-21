import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ProvidersService } from '../../../providers/services/providers.service';
import { CommonModule } from '@angular/common';
import { ProviderCardComponent } from '../provider-card/provider-card';
import { Provider } from '../../../providers/models/Provider';
import { Facilities } from '../../../facilities/models/facilities.model';
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

  constructor() {}
   ngOnInit() {
    // 1. Obtener el parámetro de filtro de la URL (si existe)
    this.facilityName = this.activatedRoute.snapshot.queryParamMap.get("facility");
    this.loadAllProviders(); // Llamar a la carga asíncrona
  }

  loadAllProviders() {
    this.isLoading.set(true);
    this.providersService.getAllProviders().subscribe({
        next: (providers) => {
            this.allProviders.set(providers);
            this.currentPage.set(1);
            this.applyFiltersAndPaginate(); // Aplicar el filtro/paginación inicial
            this.isLoading.set(false);
        },
        error: (err) => {
            console.error("Error al cargar proveedores", err);
            this.allProviders.set([]);
            this.isLoading.set(false);
        }
    });
  }

  // FUNCIÓN CENTRAL: FILTRA POR SERVICIO, BUSCA POR NOMBRE Y LUEGO PAGINA
  applyFiltersAndPaginate() {
    const term = this.searchName.toLowerCase().trim();
    let data = this.allProviders();

    // 1. FILTRO POR SERVICIO (Basado en la URL)
    if (this.facilityName) {
        data = data.filter(p => p.facility.name.toLowerCase() === this.facilityName?.toLowerCase());
    }

    // 2. FILTRO POR BÚSQUEDA (Nombre, Apellido Y DESCRIPCIÓN)
    if (term) {
        data = data.filter(provider => {
            const matchName = provider.firstName.toLowerCase().includes(term) ||
                              provider.lastName.toLowerCase().includes(term);
            
            // Incluir descripción en la búsqueda
            const matchDescription = (provider as any).description?.toLowerCase().includes(term); 

            return matchName || matchDescription;
        });
    }
    
    // 3. PAGINACIÓN
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

  // Funciones de Paginación
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

  // Navegación a la página de solicitud de turno
  requestCall(providerId: number) {
    this.router.navigate(['/calls/request', providerId]);
  }
}
