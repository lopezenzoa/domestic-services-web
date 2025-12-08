import { DatePipe, NgIf } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProvidersService } from '../../services/providers.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-shift-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgIf,DatePipe,
  ],
  templateUrl: './add-shift-form.html',
  styleUrl: './add-shift-form.css',
})
export class AddShiftForm {

  private fb = inject(FormBuilder);
  private providerService = inject(ProvidersService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form!: FormGroup;

  provider = signal<any | null>(null);
  shiftId = signal<number | null>(null);

  title = signal('Agregar nuevo turno');
  today = new Date();
  success = signal(false);

  ngOnInit() {
    this.initForm();

    this.route.params.subscribe(params => {
      const id = params['shiftId'];
      if (id) this.shiftId.set(Number(id));
    });

    this.loadProvider();
  }

  private initForm() {
    this.form = this.fb.group({
      date: [null, Validators.required],
      startTime: ['', Validators.required],
    });
  }

  private loadProvider() {
    this.providerService.getMyProvider().subscribe(provider => {
      this.provider.set(provider);

      if (this.shiftId()) {
        this.title.set('Editar turno');
        const existing = provider.shifts?.find((s: any) => s.id === this.shiftId());

        if (existing) {
          const [date, time] = existing.dateTime.split('T');
          this.form.patchValue({
            date: new Date(date),
            startTime: time.substring(0, 5),
          });
        }
      }
    });
  }

  private buildShiftData() {
    const dateObj = this.form.get('date')?.value;

    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');

    return {
      id: this.shiftId(),
      dateTime: `${y}-${m}-${d}T${this.form.value.startTime}:00`,
      available: true,
    };
  }

  submit() {
    if (this.form.invalid || !this.provider()) return;

    const shiftData = this.buildShiftData();

    const request$ = this.shiftId()
      ? this.providerService.editShift(shiftData, this.provider().id)
      : this.providerService.addShift(shiftData, this.provider().id);

    request$.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: this.shiftId() ? 'Turno actualizado' : 'Turno agregado',
          confirmButtonColor: '#00bfa5'
        }).then(() => this.router.navigate(['/providers/shifts']));
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.status === 400
            ? 'Ya existe un turno en ese horario.'
            : 'Ocurrió un error inesperado.'
        });
      },
    });
  }
}
