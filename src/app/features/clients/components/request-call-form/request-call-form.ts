import { Component, inject, Provider, signal, WritableSignal } from '@angular/core';
import { ClientsService } from '../../services/clients-service';
import { ProvidersService } from '../../../providers/services/providers.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CallService } from '../../../providers/services/call-service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-call-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './request-call-form.html',
  styleUrls: ['./request-call-form.css'],
})
export class RequestCallForm {
  router: Router = inject(Router);
  clientsService: ClientsService = inject(ClientsService);
  providersService: ProvidersService = inject(ProvidersService);
  callsService: CallService = inject(CallService);
  route: ActivatedRoute = inject(ActivatedRoute);

  providerIdFromRoute: number | null = Number(this.route.snapshot.paramMap.get('providerId'));
  facility: WritableSignal<string> = signal('');

  fb: FormBuilder = inject(FormBuilder);
  form: FormGroup = this.fb.group({
    date: ['', [Validators.required]],
    clientName: ['', [Validators.required]],
    providerName: ['', [Validators.required]],
    description: ['', [Validators.required]],
    address: ['', [Validators.required]],
  });

  providerId: WritableSignal<number | null> = signal(null);
  clientId: WritableSignal<number | null> = signal(null);
  providerShifts: WritableSignal<any[]> = signal([]);

  constructor() {
    this.clientsService.getClientProfile().subscribe((client: any) => {
      this.form.patchValue({ clientName: client.firstName + ' ' + client.lastName });
      this.form.patchValue({ address: client.address });
      this.clientId.set(client.id);
    });

    this.providersService.getProviderById(this.providerIdFromRoute!).subscribe((provider: any) => {
      this.form.patchValue({ providerName: provider.firstName + ' ' + provider.lastName });
      this.providerId.set(provider.id);
      this.facility.set(provider.facility.name);
    });

    this.providersService.getProviderShifts(this.providerIdFromRoute!).subscribe((shifts: any[]) => {
      const now = new Date();

      const futureShifts = shifts.filter((shift) => {
        const shiftDate = new Date(shift.dateTime);
        return shiftDate >= now;
      });

      futureShifts.sort((a, b) => {
        const dateA = new Date(a.dateTime).getTime();
        const dateB = new Date(b.dateTime).getTime();
        return dateA - dateB;
      });

      this.providerShifts.set(futureShifts);
    });
  }

  submitRequest() {
    if (this.form.valid) {
      const requestData = {
        date: this.form.get('date')?.value,
        client: { id: this.clientId() },
        provider: { id: this.providerId() },
        description: this.form.get('description')?.value,
        address: this.form.get('address')?.value,
      };

      this.callsService.requestCall(requestData).subscribe({
        next: (response) => {
          console.log('Solicitud enviada con éxito:', response);

          Swal.fire({
            title: '¡Solicitud enviada!',
            text: 'Tu visita fue solicitada con éxito.',
            icon: 'success',
            confirmButtonColor: '#00bfa5',
            confirmButtonText: 'Ir a buscar servicios',
            background: '#ffffff',
            color: '#333',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/facilities']);
            }
          });

          this.form.reset();
        },
        error: (error) => {
          console.error('Error al enviar la solicitud:', error);
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un problema al enviar la solicitud. Intenta nuevamente.',
            icon: 'error',
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Cerrar',
            background: '#ffffff',
            color: '#333',
          });
        },
      });
    } else {
      Swal.fire({
        title: 'Formulario incompleto',
        text: 'Por favor completá todos los campos obligatorios.',
        icon: 'warning',
        confirmButtonColor: '#facc15',
        confirmButtonText: 'Entendido',
        background: '#ffffff',
        color: '#333',
      });
    }
  }
}
