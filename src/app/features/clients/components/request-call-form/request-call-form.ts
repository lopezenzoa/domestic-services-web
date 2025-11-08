import { Component, inject, Provider, signal, WritableSignal } from '@angular/core';
import { ClientsService } from '../../services/clients-service';
import { ProvidersService } from '../../../providers/services/providers.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CallService } from '../../../providers/services/call-service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-request-call-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './request-call-form.html',
  styleUrls: ['./request-call-form.css']
})
export class RequestCallForm {
  clientsService: ClientsService = inject(ClientsService);
  providersService: ProvidersService = inject(ProvidersService);
  callsService: CallService = inject(CallService);
  route: ActivatedRoute = inject(ActivatedRoute);
  // Obtener el ID del proveedor desde la ruta
  providerIdFromRoute: number | null = Number(this.route.snapshot.paramMap.get('providerId'));

  fb: FormBuilder = inject(FormBuilder);
  form: FormGroup = this.fb.group({
    date: ['', [Validators.required]],
    clientName: ['', [Validators.required]],
    providerName: ['', [Validators.required]],
    description: ['', [Validators.required]],
    address: ['', [Validators.required]]
  });

  providerId: WritableSignal<number | null> = signal(null);
  clientId: WritableSignal<number | null> = signal(null);
  providerShifts: WritableSignal<any[]> = signal([]);

  constructor() {
    /*
    // Datos de ejemplo para estilos de formulario
    this.form.patchValue({ clientName: 'Juan Pérez' });
    this.form.patchValue({ providerName: 'María Gómez' });
    this.form.patchValue({ address: 'Calle Falsa 123' });

    // Datos de ejemplo para estilos de turnos
    //Simulamos los turnos disponibles (como si vinieran del backend)
    setTimeout(() => {
  this.providerShifts.set([
    { id: 1, dateTime: 'Lunes 09:00 - 10:00' },
    { id: 2, dateTime: 'Martes 10:00 - 11:00' },
    { id: 3, dateTime: 'Miércoles 11:00 - 12:00' },
    { id: 4, dateTime: 'Jueves 14:00 - 15:00' },
    { id: 5, dateTime: 'Viernes 16:00 - 17:00' }
  ]);

  console.log(' Turnos cargados:', this.providerShifts());
}, 1000);
// simulamos una “carga” como si fuese un fetch
    */


    // Inicializar el formulario con datos del cliente y proveedor

    // Buscar el perfil del cliente para autocompletar el nombre
    this.clientsService.getClientProfile().subscribe((client: any) => {
      this.form.patchValue({ clientName: client.firstName + ' ' + client.lastName });
      this.form.patchValue({ address: client.address });
      this.clientId.set(client.id); // Asignar el ID del cliente a la data de la solicitud
    });

    // Buscar el perfil del proveedor para autocompletar el nombre
    this.providersService.getProviderById(this.providerIdFromRoute!).subscribe((provider: any) => {
      this.form.patchValue({ providerName: provider.firstName + ' ' + provider.lastName });
      this.providerId.set(provider.id);
    });

    // Cargar los turnos del proveedor (opcional)
    this.providersService.getProviderShifts(this.providerIdFromRoute!).subscribe((shifts: any[]) => {
      this.providerShifts.set(shifts);
    });
  }

  submitRequest() {
    if (this.form.valid) {
      // Esta es la data que se enviará al backend
      const requestData = {
        date: this.form.get('date')?.value,
        client: { id: this.clientId() },
        provider: { id: this.providerId() },
        description: this.form.get('description')?.value,
        address: this.form.get('address')?.value
      };

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