import { Component, inject, OnInit, signal } from '@angular/core';
import { CallService } from '../../../../shared/services/call-service';
import { Router } from '@angular/router';
import { Call } from '../../../../shared/models/Call';
import { NgIf, CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../components/pagination-component/pagination-component';
import { CallCardComponent } from '../../components/call-card-component/call-card-component';

@Component({
  selector: 'app-call-list',
  standalone: true,
  imports: [NgIf, FormsModule, CallCardComponent, PaginationComponent, CommonModule],
  templateUrl: './call-list.html',
  styleUrl: './call-list.css',
})
export class CallList implements OnInit {

  // Signals
  filteredCalls = signal<Call[]>([]); 
  // Nota: Ya no necesitamos 'calls' separado, usamos filteredCalls para todo.
  
  currentPage = signal(0);
  totalPages = signal(1);
  totalElements = signal(0);
  isLoading = signal(true);

  // Servicios
  callService = inject(CallService);
  router = inject(Router);

  // Filtros
  selectedState: string = '';
  startDate: string = '';
  endDate: string = '';
  pageSize: number = 5;
  providerId: number = 0;

  ngOnInit() {
    const raw = localStorage.getItem('user');
    if (raw) {
      const user = JSON.parse(raw);
      if (user.role === 'PROVIDER') {
        this.providerId = user.id;
      }
    }

    // Estado inicial por defecto
    this.selectedState = 'REQUESTING';
    
    // Llamada inicial (sin duplicar llamadas)
    this.filterCalls();
  }

  // Este método se usa tanto al filtrar como al cambiar página
  loadData(page: number) {
    this.isLoading.set(true);

    const filterObj = {
      providerId: this.providerId,
      state: this.selectedState || undefined, // Si está vacío manda undefined
      start: this.startDate || undefined,
      end: this.endDate || undefined,
      page: page,
      size: this.pageSize,
    };

    console.log('Enviando filtro:', filterObj); // Para depurar

    this.callService.getCallsHistory(filterObj).subscribe({
      next: (data) => {
        this.filteredCalls.set(data.content);
        this.totalPages.set(data.totalPages);
        this.totalElements.set(data.totalElements);
        this.currentPage.set(page);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando datos:', err);
        this.isLoading.set(false);
      },
    });
  }

  // Al hacer click en "Filtrar", volvemos a página 0
  filterCalls() {
    this.loadData(0);
  }

  // Al cambiar de página desde el paginador
  loadPage(page: number) {
    this.loadData(page);
  }

  acceptCall(idCall: number, providerId: number) {
    this.callService.acceptCall(idCall, providerId).subscribe(() => {
      Swal.fire({ title: '¡Contratación aceptada!', icon: 'success' })
        .then(() => this.loadData(this.currentPage()));
    });
  }

  denyCall(idCall: number, providerId: number) {
    this.callService.denyCall(idCall, providerId).subscribe(() => {
      Swal.fire({ title: 'Visita rechazada', icon: 'info' })
        .then(() => this.loadData(this.currentPage()));
    });
  }

  finishCall(callId: number) {
    this.callService.markAsFinished(callId, this.providerId).subscribe(() => {
      Swal.fire({ title: '¡Visita finalizada!', icon: 'success' })
        .then(() => this.loadData(this.currentPage()));
    });
  }

  openChat(callId: number) {
    this.router.navigate(['/providers/chat', callId]);
  }
}