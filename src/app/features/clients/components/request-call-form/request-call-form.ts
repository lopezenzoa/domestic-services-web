import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ClientsService } from '../../services/clients-service';
import { ProvidersService } from '../../../providers/services/providers.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CallService } from '../../../providers/services/call-service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-request-call-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './request-call-form.html',
  styleUrls: ['./request-call-form.css'],
})
export class RequestCallForm {

  router = inject(Router);
  clientsService = inject(ClientsService);
  providersService = inject(ProvidersService);
  callsService = inject(CallService);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);

  providerIdFromRoute: number | null = null;

  facility: WritableSignal<string> = signal('');
  providerId: WritableSignal<number | null> = signal(null);
  clientId: WritableSignal<number | null> = signal(null);
  providerShifts: WritableSignal<any[]> = signal([]);

  form: FormGroup = this.fb.group({
    date: ['', Validators.required],
    clientName: ['', Validators.required],
    providerName: ['', Validators.required],
    description: ['', Validators.required],
    address: ['', Validators.required],
  });

  constructor() {
    // VALIDAMOS Y OBTENEMOS providerId
    const id = this.route.snapshot.paramMap.get('providerId');
    this.providerIdFromRoute = id ? Number(id) : null;
  }

  ngOnInit() {
    this.loadClientData();
    this.loadProviderData();
    this.loadShifts();
  }

  private loadClientData() {
    this.clientsService.getClientProfile().subscribe((client: any) => {

      this.form.patchValue({
        clientName: client.firstName + ' ' + client.lastName,
        address: client.address
      });
      this.clientId.set(client.id);
    });
  }

  private loadProviderData() {
    if (!this.providerIdFromRoute) return;

    this.providersService.getProviderById(this.providerIdFromRoute).subscribe(provider => {
      this.form.patchValue({
        providerName: provider.firstName + ' ' + provider.lastName,
      });
      this.providerId.set(provider.id);
      this.facility.set(provider.facility.name);
    });
  }

  private loadShifts() {
    if (!this.providerIdFromRoute) return;

    this.providersService.getProviderShifts(this.providerIdFromRoute).subscribe(shifts => {
      const now = new Date();
      const future = shifts
        .filter(s => new Date(s.dateTime) >= now)
        .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

      this.providerShifts.set(future);
    });
  }

  submitRequest() {
    if (this.form.invalid) {
      Swal.fire({
        title: 'Formulario incompleto',
        text: 'Por favor completá todos los campos obligatorios.',
        icon: 'warning',
        confirmButtonColor: '#facc15',
      });
      return;
    }

    const requestData = {
      date: this.form.get('date')?.value,
      client: { id: this.clientId() },
      provider: { id: this.providerId() },
      description: this.form.get('description')?.value,
      address: this.form.get('address')?.value,
    };

    this.callsService.requestCall(requestData).subscribe({
      next: () => {
        Swal.fire({
          title: '¡Solicitud enviada!',
          text: 'Tu visita fue solicitada con éxito.',
          icon: 'success',
          confirmButtonColor: '#00bfa5',
          confirmButtonText: 'Ir a buscar servicios',
        }).then(result => {
          if (result.isConfirmed) {
            this.router.navigate(['/facilities']);
          }
        });

        this.form.reset();
      },
      error: () => {
        Swal.fire({
          title: 'Error',
          text: 'Ocurrió un problema al enviar la solicitud.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
        });
      },
    });
  }
}
