import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import player from 'lottie-web';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

export function playerFactory() {
  return player;
}

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [
    FormsModule,
    CommonModule,
    MatSnackBarModule,
    LottieComponent,
    RouterLink
  ],
})
export class Register {
  options: AnimationOptions = {
    path: '/assets/animations/register-animation1.json',
  };

  tipoCuenta: 'usuario' | 'prestador' = 'usuario';
  firstName = '';
  lastName = '';
  username = '';
  email = '';
  phoneNumber = '';
  password = '';
  confirmPassword = '';
  facility = '';
  description = '';
  address = '';
  recovery = '';
  licenseNumber = null; // La API verifica que la licencia sea null o no para decidir si tiene que crear un prestador o un cliente

  authService: Auth = inject(Auth);

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  onRoleChange(role: 'usuario' | 'prestador') {
    this.tipoCuenta = role;
  }

  onSubmit(form: any) {
    if (!form.valid) {
      this.snackBar.open('Completa todos los campos requeridos', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar'],
      });
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.snackBar.open('Las contraseñas no coinciden', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    const data = {
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      email: this.email,
      phoneNumber: this.phoneNumber,
      password: this.password,
      facility: {name: this.facility}, // La API maneja la facility como un objeto
      address: this.address,
      licenseNumber:this.licenseNumber,
    };

    this.authService.register(data).subscribe({
      next: () =>
        this.snackBar.open('Registro exitoso', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        }),
      error: (err) => {
        console.error('Error en el registro: ', err.error.message);
        this.snackBar.open('Error al registrar el usuario', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }
}
