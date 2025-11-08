import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { Auth } from '../../services/auth';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../../users/services/users-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LottieComponent, RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  options: AnimationOptions = {
    path: 'assets/animations/login-animations.json'
  }
  animations: any;

  /* Servicio de autenticación para login */
  authService: Auth = inject(Auth);
  router: Router = inject(Router);
  users: UsersService = inject(UsersService);

  /* Manejo del formulario reactivo (Login) */
  fb: FormBuilder = inject(FormBuilder);
  form: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
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
    if (this.form.valid) {
      const loginData = this.form.value;

      this.authService.login(loginData).subscribe({
        next: (response) => {
          const token = response.headers.get('Authorization');

          if (token) {

            localStorage.setItem('token', `${token}`);


            /* Obtener perfil de usuario para redireccionar */
            this.users.getUserProfile().subscribe({
              next: (user) => {
                if (user.role === 'CLIENT') {
                  this.router.navigate(['/providers']); // Redirigir a la página de lista de proveedores
                } else if (user.role === 'PROVIDER') {
                  this.router.navigate(['/providers/calls']); // Redirigir a la página de lista de contrataciones
                } else {
                  this.router.navigate(['/facilities']); // Redirigir a la página de servicios generales
                }
              },
              error: (err) => {
                console.error('Error al obtener el perfil de usuario:', err);
              }
            });
          }
        },
        error: (err) => {
          console.error('Error en el login:', err.error);
        }
      });
    }
  }
}

