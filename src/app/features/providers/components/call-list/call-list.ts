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

  service = inject(CallService);
  router = inject(Router);
  
  // Propiedades de Paginación
  pageSize: number = 5; // Muestra 5 turnos por página
  currentPage = signal(1);
  totalPages = signal(1);
  

  isLoading = signal(true); 

  ngOnInit() {
    this.getMyCalls();
  }


  private sortCallsByDate(data: any[]): any[] {
 
    return data.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateA - dateB; 
    });
  }

  getMyCalls() {
    this.isLoading.set(true); 
    return this.service.getMyCalls().subscribe({
      next: (calls) => {
     
        const sortedCalls = this.sortCallsByDate(calls);
        this.calls.set(sortedCalls);
        
        
        this.currentPage.set(1);
        this.paginateCalls(); 
        this.isLoading.set(false); 
      },
      error: (err) => {
        console.error('Error al cargar visitas:', err);
        this.isLoading.set(false); 
      }
    });
  }

  
  paginateCalls(){
    const data = this.calls() || []
    let paginatedData = [...data] 


    const total = paginatedData.length;
    const pages = Math.ceil(total / this.pageSize);
    this.totalPages.set(pages > 0 ? pages : 1);
    
    
    if (this.currentPage() > this.totalPages()) {
        this.currentPage.set(1);
    }
    
    const startIndex = (this.currentPage() - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    
    this.filteredCalls.set(paginatedData.slice(startIndex, endIndex));
  }
  
  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((val) => val + 1);
      this.paginateCalls();
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update((val) => val - 1);
      this.paginateCalls();
    }
  }

  acceptCall(idCall: number, providerId: number) {
    this.service.acceptCall(idCall, providerId).subscribe({
      next: () => {
        Swal.fire({
          title: '¡Contratación aceptada!',
          text: 'La visita fue aceptada con éxito.',
          icon: 'success',
          confirmButtonColor: '#06d6a0',
        }).then(() => this.getMyCalls());
      },
      error: () => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo aceptar la contratación.',
          icon: 'error',
          confirmButtonColor: '#e63946',
        });
      },
    });
  }

  denyCall(idCall: number, providerId: number) {
    this.service.denyCall(idCall, providerId).subscribe({
      next: () => {
        Swal.fire({
          title: 'Visita rechazada',
          text: 'La visita fue rechazada correctamente.',
          icon: 'info',
          confirmButtonColor: '#457b9d',
        }).then(() => this.getMyCalls());
      },
      error: () => {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al rechazar la visita.',
          icon: 'error',
          confirmButtonColor: '#e63946',
        });
      },
    });
  }

  editCall(callId: number) {
    this.router.navigate(['/providers/shifts/edit', callId]);
  }
}