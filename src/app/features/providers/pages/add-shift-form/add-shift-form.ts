import { NgFor, NgIf } from '@angular/common';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormGroup, FormRecord, ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router'; // lo puse para que redirija al futuro ver listas 
import { ProvidersService } from '../../services/providers.service';
@Component({
  selector: 'app-add-shift-form',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule, DatePipe, NgIf
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
  providersService: ProvidersService = inject(ProvidersService);
  provider: WritableSignal<any | null> = signal(null);

  agregarTurno() {
    if (this.selectedDate && this.startTime && this.endTime) {
      this.success = true;

      // Formatear la fecha y hora en el formato adecuado
      // YYYY-MM-DDTHH:mm:ss
      const year = this.selectedDate.getFullYear();
      const month = String(this.selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(this.selectedDate.getDate()).padStart(2, '0');

      const capitalizedDate = `${year}-${month}-${day}`;

      const shiftData = {
        id: null,
        dateTime: `${capitalizedDate}T${this.startTime}:00`,
        available: true
      };

      // Obtener el perfil del proveedor actual
      this.providersService.getMyProvider().subscribe((providerData) => {
        this.provider.set(providerData);

        //Llamar al servicio para agregar el turno
        this.providersService.addShift(shiftData, this.provider().id).subscribe((response) => {
          // Mostrar mensaje unos segundos antes de redirigir
          setTimeout(() => {
            this.success = false;
            this.router.navigate(['/providers/shifts']); //Redirige al listado de turnos
          }, 1500);
        });
      });
      //Formatear horas
      const startFormatted = this.formatTime(this.startTime);
      const endFormatted = this.formatTime(this.endTime);
    }
  }
  private formatTime(time: string): string {
    const [hour, minute] = time.split(':');
    return `${hour}:${minute}`;
  }
}