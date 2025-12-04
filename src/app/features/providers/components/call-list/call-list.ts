import { Component, inject, OnInit, signal } from '@angular/core';
import { CallService } from '../../services/call-service';
import { Router } from '@angular/router';
import { Call } from '../../models/Call';
import { NgClass, DatePipe, NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-call-list',
  standalone: true,
  imports: [NgClass, DatePipe, NgIf, FormsModule],
  templateUrl: './call-list.html',
  styleUrl: './call-list.css',
})
export class CallList implements OnInit {
  calls = signal<any[] | undefined>(undefined);
  filteredCalls = signal<any[] | undefined>(undefined);

  callService = inject(CallService);
  router = inject(Router);

  selectedState: string = '';
  startDate: string = '';
  endDate: string = '';

  pageSize: number = 5;
  currentPage = signal(1);
  totalPages = signal(1);
  totalElements = signal(0);

  isLoading = signal(true);
  providerId: number = 0;

  ngOnInit() {
    const raw = localStorage.getItem('user');

    if (raw) {
      const user = JSON.parse(raw);

      if (user.role === 'PROVIDER') {
        this.providerId = user.id;
      }
    }
    this.loadPage(0);
  }

  loadPage(page: number) {
    this.isLoading.set(true);

   this.callService.getHistoryPaginated(this.providerId, page, this.pageSize).subscribe({
      next: (data) => {
        this.filteredCalls.set(data.content);
        this.calls.set(data.content);
        this.totalPages.set(data.totalPages);
        this.totalElements.set(data.totalElements);
        this.currentPage.set(page);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando historial paginado:', err);
        this.isLoading.set(false);
      },
    });

  }

  nextPage() {
    if (this.currentPage() + 1 < this.totalPages()) {
      this.loadPage(this.currentPage() + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 0) {
      this.loadPage(this.currentPage() - 1);
    }
  }

  acceptCall(idCall: number, providerId: number) {
    this.callService.acceptCall(idCall, providerId).subscribe({
      next: () => {
        Swal.fire({ title: '¡Contratación aceptada!', icon: 'success' }).then(() =>
          this.loadPage(this.currentPage())
        );
      },
    });
  }

  denyCall(idCall: number, providerId: number) {
    this.callService.denyCall(idCall, providerId).subscribe({
      next: () => {
        Swal.fire({ title: 'Visita rechazada', icon: 'info' }).then(() =>
          this.loadPage(this.currentPage())
        );
      },
    });
  }

  finishCall(callId: number) {
    if (!this.providerId) return;

    this.callService.markAsFinished(callId, this.providerId).subscribe({
      next: () => {
        Swal.fire({
          title: '¡Visita finalizada!',
          text: 'La visita fue marcada como finalizada.',
          icon: 'success',
        }).then(() => this.loadPage(this.currentPage()));
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          title: 'Error',
          text: 'Ocurrió un problema.',
          icon: 'error',
        });
      },
    });
  }
  

  filterCalls() {
    const params: any = {
      providerId: this.providerId,
    };

    if (this.selectedState) params.state = this.selectedState;
    if (this.startDate) params.start = this.startDate;
    if (this.endDate) params.end = this.endDate;

    this.callService.getCallsHistory(params).subscribe({
      next: (data) => {
        this.filteredCalls.set(data);
      },
      error: (err) => {
        console.error('Error al filtrar:', err);
      },
    });
  }

  editCall(callId: number) {
    this.router.navigate(['/providers/shifts/edit', callId]);
  }
  openChat(callId: number) {
    this.router.navigate(['/providers/chat', callId]);
  }
}
