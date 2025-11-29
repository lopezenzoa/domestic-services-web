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
  // Obtener el ID del proveedor desde la ruta
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
      this.facility.set(provider.facility.name);
    });

    // Cargar solo turnos FUTUROS del proveedor y ordenarlos por fecha/hora
    this.providersService
      .getProviderShifts(this.providerIdFromRoute!)
      .subscribe((shifts: any[]) => {
        const now = new Date();

        // Filtrar turnos futuros
        const futureShifts = shifts.filter((shift) => {
          const shiftDate = new Date(shift.dateTime);
          return shiftDate >= now;
        });

        // Ordenar turnos futuros
        futureShifts.sort((a, b) => {
          const dateA = new Date(a.dateTime).getTime();
          const dateB = new Date(b.dateTime).getTime();
          return dateA - dateB; // orden ascendente
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
              this.router.navigate(['/facilities']); // 🔹 Cambiá la ruta según tu proyecto
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
