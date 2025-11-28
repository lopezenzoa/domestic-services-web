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

  // Propiedades de Paginación
  pageSize: number = 5; // Muestra 5 turnos por página
  currentPage = signal(1);
  totalPages = signal(1);
  totalElements = signal(0);

  isLoading = signal(true);

  providerId: number = 0; // Se obtiene del usuario logueado

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
        Swal.fire({
          title: '¡Contratación aceptada!',
          icon: 'success',
        }).then(() => this.loadPage(this.currentPage()));
      },
    });
  }

  denyCall(idCall: number, providerId: number) {
    this.callService.denyCall(idCall, providerId).subscribe({
      next: () => {
        Swal.fire({
          title: 'Visita rechazada',
          icon: 'info',
        }).then(() => this.loadPage(this.currentPage()));
      },
    });
  }
  finishCall(callId: number) {
  if (!this.providerId) return;

  this.callService.markAsFinished(callId, this.providerId).subscribe({
    next: () => {
      Swal.fire({
        title: "¡Visita finalizada!",
        text: "La visita fue marcada como finalizada con éxito.",
        icon: "success",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#3085d6",
        background: "#fff",
        color: "#333",
      }).then(() => {
        this.loadPage(this.currentPage());
      });
    },

    error: (err) => {
      console.error(err);

      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al finalizar la visita.",
        icon: "error",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#d33",
      });
    },
  });
}


  editCall(callId: number) {
    this.router.navigate(['/providers/shifts/edit', callId]);
  }
}
