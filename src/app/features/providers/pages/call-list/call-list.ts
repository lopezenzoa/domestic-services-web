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

  filteredCalls = signal<Call[]>([]); 
 
  
  currentPage = signal(0);
  totalPages = signal(1);
  totalElements = signal(0);
  isLoading = signal(true);

  callService = inject(CallService);
  router = inject(Router);

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

 
    this.selectedState = 'REQUESTING';
    
  
    this.filterCalls();
  }

  loadData(page: number) {
    this.isLoading.set(true);

    const filterObj = {
      providerId: this.providerId,
      state: this.selectedState || undefined, 
      start: this.startDate || undefined,
      end: this.endDate || undefined,
      page: page,
      size: this.pageSize,
    };

    

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

 
  filterCalls() {
    this.loadData(0);
  }

  
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