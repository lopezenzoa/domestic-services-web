import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../../users/services/users-service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, NgIf, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  options: AnimationOptions = {
    path: 'assets/animations/login-animations.json',
  };
  animations: any;
  errorMessage: string = '';

  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  users: UsersService = inject(UsersService);

  fb: FormBuilder = inject(FormBuilder);
  form: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  onAnimate(anim: any) {
    this.animations = anim;
  }
  play() {
    this.animations?.play();
  }
  pause() {
    this.animations?.pause();
  }

 login() {
  // Si el formulario es inválido, mostramos mensaje
  if (this.form.invalid) {
    this.errorMessage = 'Todos los campos son obligatorios';
    this.form.markAllAsTouched(); // fuerza mostrar errores
    return;
  }

  this.errorMessage = ''; // limpiamos cualquier error previo

  const loginData = this.form.value;

  this.authService.login(loginData).subscribe({
    next: (response) => {
      const token = response?.headers?.get('Authorization');
      if (!token) {
        this.errorMessage = 'No se pudo verificar la sesión. Inténtalo nuevamente.';
        return;
      }

      localStorage.setItem('token', token);

      this.users.getUserProfile().subscribe({
        next: (user) => {
          localStorage.setItem('user', JSON.stringify(user));

          if (user.role === 'CLIENT') this.router.navigate(['/facilities']);
          else if (user.role === 'PROVIDER') this.router.navigate(['/providers/calls']);
          else if (user.role === 'ADMIN') this.router.navigate(['/facilities']);
          else this.router.navigate(['/auth/login']);
        },
        error: () => {
          this.errorMessage = 'Error obteniendo perfil de usuario';
        }
      });
    },

    error: (err) => {
      this.errorMessage = 'Usuario o contraseña incorrectos';
    }
  });
}


}
