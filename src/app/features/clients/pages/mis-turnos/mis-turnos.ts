import { Component, inject, OnInit } from '@angular/core';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { CallService } from '../../../../shared/services/call-service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
interface Turno {
  id: number;
  state: string;
  date: string;
  provider: {
    id: number;
    firstName: string;
    lastName: string;
    facility?: { name: string };
  };
  description: string;
  address: string;
}

@Component({
  selector: 'app-mis-turnos',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, FormsModule],
  templateUrl: './mis-turnos.html',
  styleUrl: './mis-turnos.css',
})
export class MisTurnos implements OnInit {
  private callService = inject(CallService);
  private router = inject(Router);

  activeTab: string = 'pendientes';

  calls: Turno[] = [];
  pendientes: Turno[] = [];
  aceptados: Turno[] = [];
  rechazados: Turno[] = [];
  finalizados: Turno[] = [];

  filteredList: Turno[] = [];
  paginatedList: Turno[] = [];
  startDate: string | null = null;
  endDate: string | null = null;
  pageSize = 5;
  currentPage = 0;
  totalPages = 1;
  cargando = true;

  ngOnInit() {
    this.callService.getMyCalls().subscribe({
      next: (data) => {
        this.calls = data;

        this.pendientes = data.filter((t) => t.state === 'REQUESTING');
        this.aceptados = data.filter((t) => t.state === 'ACCEPTED' || t.state === 'PENDING');
        this.rechazados = data.filter((t) => t.state === 'DECLINED' || t.state === 'REJECTED');
        this.finalizados = data.filter((t) => t.state === 'FINISHED');

        this.cargando = false;

        this.applyFilters();
      },
    });
  }

  setTab(tab: string) {
    this.activeTab = tab;
    this.applyFilters();
  }

  resetFilters() {
    this.startDate = null;
    this.endDate = null;
    this.applyFilters();
  }

  applyFilters() {
    let base: Turno[] = [];

    if (this.activeTab === 'pendientes') base = this.pendientes;
    if (this.activeTab === 'aceptados') base = this.aceptados;
    if (this.activeTab === 'rechazados') base = this.rechazados;
    if (this.activeTab === 'finalizados') base = this.finalizados;

    let lista = base;

    if (this.startDate !== null && this.startDate !== '') {
      const start = new Date(this.startDate);
      lista = lista.filter((t) => new Date(t.date) >= start);
    }

    if (this.endDate !== null && this.endDate !== '') {
      const end = new Date(this.endDate);
      lista = lista.filter((t) => new Date(t.date) <= end);
    }

    this.filteredList = lista;

    this.currentPage = 0;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredList.length / this.pageSize);

    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;

    this.paginatedList = this.filteredList.slice(start, end);
  }

  nextPage() {
    if (this.currentPage + 1 < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  traducirEstado(estado: string): string {
    switch (estado) {
      case 'REQUESTING':
        return 'En espera de aprobación';
      case 'PENDING':
        return 'Aceptado';
      case 'ACCEPTED':
        return 'Aceptado';
      case 'DECLINED':
      case 'REJECTED':
        return 'Rechazado';
      case 'FINISHED':
        return 'Finalizado';
      default:
        return estado;
    }
  }

  getEstadoClass(state: string): string {
    switch (state) {
      case 'REQUESTING':
        return 'pending';
      case 'PENDING':
      case 'ACCEPTED':
        return 'accepted';
      case 'DECLINED':
      case 'REJECTED':
        return 'declined';
      case 'FINISHED':
        return 'done';
      default:
        return '';
    }
  }

  irAResenia(turno: any) {
    this.router.navigate(['/review/create'], {
      queryParams: {
        providerId: turno.provider?.id,
        providerName: `${turno.provider?.firstName} ${turno.provider?.lastName}`,
        date: turno.date,
        callId: turno.id,
      },
    });
  }

  irAlChat(turno: any) {
    this.router.navigate(['/client/chat', turno.id]);
  }
}
