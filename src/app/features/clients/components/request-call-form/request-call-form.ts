import { Component, inject, Provider, signal, WritableSignal } from '@angular/core';
import { ClientsService } from '../../services/clients-service';
import { ProvidersService } from '../../../auth/services/providers.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CallService } from '../../../providers/services/call-service';

@Component({
  selector: 'app-request-call-form',
  imports: [ReactiveFormsModule],
  templateUrl: './request-call-form.html',
  styleUrl: './request-call-form.css'
})
export class RequestCallForm {
  clientsService: ClientsService = inject(ClientsService);
  providersService: ProvidersService = inject(ProvidersService);
  callsService: CallService = inject(CallService);

  fb: FormBuilder = inject(FormBuilder);
  form: FormGroup = this.fb.group({
    date: ['', [Validators.required]],
    clientName: ['', [Validators.required]],
    providerName: ['', [Validators.required]],
    description: ['', [Validators.required]],
    address: ['', [Validators.required]]
  });

  providerId: WritableSignal<number | null> = signal(null);
  providerShifts: WritableSignal<any[]> = signal([]);

  constructor() {
    // Datos de ejemplo para estilos de formulario
    this.form.patchValue({ clientName: 'Juan Pérez' });
    this.form.patchValue({ providerName: 'María Gómez' });
    this.form.patchValue({ address: 'Calle Falsa 123' });

    // Datos de ejemplo para estilos de turnos
    this.providerShifts.set([
      { id: 1, dateTime: '09:00 - 10:00' },
      { id: 2, dateTime: '10:00 - 11:00' },
      { id: 3, dateTime: '11:00 - 12:00' }
    ]);

    /*
    Inicializar el formulario con datos del cliente y proveedor

    // Buscar el perfil del cliente para autocompletar el nombre
    this.clientsService.getClientProfile().subscribe((client: any) => {
      this.form.patchValue({ clientName: client.firstName + ' ' + client.lastName });
      this.form.patchValue({ address: client.address });
    });

    // Buscar el perfil del proveedor para autocompletar el nombre
    this.providersService.getProviderById(10).subscribe((provider: any) => {
      this.form.patchValue({ providerName: provider.firstName + ' ' + provider.lastName });
      this.providerId.set(provider.id);
    });

    // Cargar los turnos del proveedor (opcional)
    this.providersService.getProviderShifts(10).subscribe((shifts: any[]) => {
      this.providerShifts.set(shifts);
    });
    */
  }

  submitRequest() {
    if (this.form.valid) {
      const requestData = this.form.value;
      this.callsService.requestCall(requestData).subscribe({
        next: (response) => {
          console.log('Solicitud enviada con éxito:', response);
        },
        error: (error) => {
          console.error('Error al enviar la solicitud:', error);
        }
      });
    } else {
      console.log('Formulario inválido');
    }
  }
}
