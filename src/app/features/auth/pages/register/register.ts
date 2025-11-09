import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import player from 'lottie-web';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
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
    RouterLink,
    ReactiveFormsModule,
    NgIf
  ],
})
export class Register {
  options: AnimationOptions = {
    path: '/assets/animations/register-animation1.json',
  };

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
    // Limpiar "token" al registrar un nuevo usuario
    localStorage.removeItem('token');
  }

  onRoleChange(role: 'usuario' | 'prestador') {
    this.form.get("tipoCuenta")?.setValue(role);
  }

  onSubmit() {
    if (!this.form.valid) {
      this.snackBar.open('Completa todos los campos requeridos', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar'],
      });
      return;
    }

    if (this.form.get("password")?.value !== this.form.get("confirmPassword")?.value) {
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

        setTimeout(( ) => {
          this.router.navigate(["/auth/login"]); // Redirige al inicio de sesion
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
