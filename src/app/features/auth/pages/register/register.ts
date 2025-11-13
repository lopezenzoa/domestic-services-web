import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import player from 'lottie-web';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { FacilitiesService } from '../../../facilities/services/facilities-service';
import { Facilities } from '../../../facilities/models/facilities.model';

export function playerFactory() {
  return player;
}

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [FormsModule, CommonModule, MatSnackBarModule, RouterLink, ReactiveFormsModule, NgIf],
})
export class Register {
  options: AnimationOptions = {
    path: '/assets/animations/register-animation1.json',
  };
  facilitiesService: FacilitiesService = inject(FacilitiesService);
  facilitiesList: Facilities[] = [];

  // Esta variable ayuda a determinar el tipo de cuenta que se esta creando
  tipoCuenta: 'usuario' | 'prestador' = 'usuario';

  fb: FormBuilder = inject(FormBuilder);
  form: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
    facility: this.fb.group({
      name: [''],
    }), // Servicio que brinda el prestador, es necesario que sea un objeto
    tipoCuenta: ['usuario', Validators.required],
    address: ['', Validators.required],
    licenseNumber: [null], // La API verifica que la licencia sea null o no para decidir si tiene que crear un prestador o un cliente
  });

  authService: Auth = inject(Auth);
  router: Router = inject(Router);

  constructor(private snackBar: MatSnackBar) {
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  this.facilitiesService.getAll().subscribe({
    next: (res) => {
      this.facilitiesList = res;
    },
    error: (err) => {
      console.error("Error cargando servicios", err);
    }
  });
}


 onRoleChange(role: 'usuario' | 'prestador') {
  this.form.get("tipoCuenta")?.setValue(role);

  if (role === 'prestador') {
    this.form.get('facility.name')?.setValidators([Validators.required]);
    this.form.get('licenseNumber')?.setValidators([Validators.required]);
  } else {
    this.form.get('facility.name')?.clearValidators();
    this.form.get('licenseNumber')?.clearValidators();
  }

  this.form.get('facility.name')?.updateValueAndValidity();
  this.form.get('licenseNumber')?.updateValueAndValidity();
}

  onSubmit() {
    if (!this.form.valid) {
      this.snackBar.open('Completa todos los campos requeridos', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar'],
      });
      return;
    }

    if (this.form.get('password')?.value !== this.form.get('confirmPassword')?.value) {
      this.snackBar.open('Las contraseñas no coinciden', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    // Preparar los datos para el registro, excluyendo confirmPassword
    const data = {
      firstName: this.form.get('firstName')?.value,
      lastName: this.form.get('lastName')?.value,
      username: this.form.get('username')?.value,
      email: this.form.get('email')?.value,
      phoneNumber: this.form.get('phoneNumber')?.value,
      password: this.form.get('password')?.value,
      address: this.form.get('address')?.value,
      facility: this.form.get('facility')?.value,
      licenseNumber: this.form.get('licenseNumber')?.value,
    };

    this.authService.register(data).subscribe({
      next: () => {
        this.snackBar.open('Registro exitoso', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        }),
          setTimeout(() => {
            this.router.navigate(['/auth/login']); // Redirige al inicio de sesion
          }, 2500);
      },
      error: (err) => {
        console.error('Error en el registro: ', err);
        this.snackBar.open('Error al registrar el usuario', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }
}
