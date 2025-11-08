import { NgFor, NgIf } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormGroup,FormRecord, ReactiveFormsModule,FormBuilder, Validators, FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { DatePipe } from '@angular/common'; 
import { Router } from '@angular/router'; // lo puse para que redirija al futuro ver listas 
@Component({
  selector: 'app-add-shift-form',
   imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,DatePipe,NgIf
  ],
  templateUrl: './add-shift-form.html',
  styleUrl: './add-shift-form.css'
})
export class AddShiftForm {
   selectedDate: Date | null = null;
  startTime: string = '';
  endTime: string = '';
  success = false;

   router = inject(Router);
  
    agregarTurno() {
    if (this.selectedDate && this.startTime && this.endTime) {
      this.success = true;

        //Formatear fecha en español
      const formattedDate = this.selectedDate.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
       const capitalizedDate =
        formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
      
        //Formatear horas
      const startFormatted = this.formatTime(this.startTime);
      const endFormatted = this.formatTime(this.endTime);  
      // Mostrar mensaje unos segundos antes de redirigir
      setTimeout(() => {
        this.success = false;
        this.router.navigate(['/providers/shifts']); //Redirige al listado de turnos
      }, 1500);
    }
  }
   private formatTime(time: string): string {
    const [hour, minute] = time.split(':');
    return `${hour}:${minute}`;
  }
}