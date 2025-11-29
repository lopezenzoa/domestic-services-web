import { NgFor, NgIf } from '@angular/common';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import {
  FormGroup,
  FormRecord,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormsModule,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; // lo puse para que redirija al futuro ver listas
import { ProvidersService } from '../../services/providers.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-shift-form',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DatePipe,
    NgIf,
    
  ],
  templateUrl: './add-shift-form.html',
  styleUrl: './add-shift-form.css',
})
export class AddShiftForm {
  today = new Date();
  fb: FormBuilder = inject(FormBuilder);
  form: FormGroup = this.fb.group({
    date: [null, Validators.required],
    startTime: ['', Validators.required],
  });

  success = false;

  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  providersService: ProvidersService = inject(ProvidersService);
  provider: WritableSignal<any | null> = signal(null);

  shiftId: WritableSignal<string | null> = signal(null);

  constructor() {
    this.activatedRoute.params.subscribe((params) => {
      this.shiftId.set(params['shiftId']);

      // Buscar el turno existente si shiftId no es nulo
      if (this.shiftId()) {
        this.providersService.getMyProvider().subscribe((providerData) => {
          this.provider.set(providerData);

          const existingShift = providerData.shifts.find(
            (shift: any) => shift.id == this.shiftId()!
          );
          if (existingShift) {
            // Separar la fecha y hora del dateTime
            const [date, time] = existingShift.dateTime.split('T');
            this.form.get('date')?.setValue(new Date(date));
            this.form.get('startTime')?.setValue(time.substring(0, 5)); // Formato HH:mm
          }
        });
      }
    });
  }

  agregarTurno() {
    if (this.form.valid) {
      // Formatear fecha y hora
      const year = this.form.get('date')?.value.getFullYear();
      const month = String(this.form.get('date')?.value.getMonth() + 1).padStart(2, '0');
      const day = String(this.form.get('date')?.value.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      const formattedTime = this.formatTime(this.form.get('startTime')?.value);

      const shiftData = {
        id: null,
        dateTime: `${formattedDate}T${formattedTime}:00`,
        available: true,
      };

      // Obtener el proveedor actual
          this.providersService.getMyProvider().subscribe({
        next: (providerData) => {
          this.provider.set(providerData);

          this.providersService.addShift(shiftData, this.provider().id).subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: '¡Turno agregado!',
                text: 'Tu turno fue registrado correctamente.',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#00bfa5',
                customClass: {
                  popup: 'rounded-modal',
                },
              }).then(() => {
                this.router.navigate(['/providers/shifts']);
              });
            },
            error: (err) => {
              console.error('Error al agregar turno:', err);

              if (err.status === 400) {
                Swal.fire({
                  icon: 'warning',
                  title: 'Turno duplicado',
                  text: 'Este turno ya fue agregado previamente.',
                  confirmButtonText: 'Entendido',
                  confirmButtonColor: '#1c77b5',
                  customClass: {
                    popup: 'rounded-modal',
                  },
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Error inesperado',
                  text: 'Ocurrió un error al intentar agregar el turno. Intentalo nuevamente.',
                  confirmButtonText: 'Cerrar',
                  confirmButtonColor: '#e53935',
                  customClass: {
                    popup: 'rounded-modal',
                  },
                });
              }
            },
          });
        },
      });
    }
  }


    

  private formatTime(time: string): string {
    const [hour, minute] = time.split(':');
    return `${hour}:${minute}`;
  }

  actualizarTurno() {
    if (this.form.valid && this.shiftId()) {
      this.success = true;

      // Formatear la fecha y hora en el formato adecuado
      // YYYY-MM-DDTHH:mm:ss
      const year = this.form.get('date')?.value.getFullYear();
      const month = String(this.form.get('date')?.value.getMonth() + 1).padStart(2, '0');
      const day = String(this.form.get('date')?.value.getDate()).padStart(2, '0');

      const capitalizedDate = `${year}-${month}-${day}`;

      const shiftData = {
        id: this.shiftId(),
        dateTime: `${capitalizedDate}T${this.form.get('startTime')?.value}:00`,
        available: true,
      };

      // Obtener el perfil del proveedor actual
      this.providersService.getMyProvider().subscribe((providerData) => {
        this.provider.set(providerData);

        //Llamar al servicio para agregar el turno
        this.providersService.editShift(shiftData, this.provider().id).subscribe((response) => {
          // Mostrar mensaje unos segundos antes de redirigir
          setTimeout(() => {
            this.success = false;
            this.router.navigate(['/providers/shifts']); //Redirige al listado de turnos
          }, 1500);
        });
      });
    }
  }
}
