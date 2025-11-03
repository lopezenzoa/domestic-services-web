import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { Auth } from '../../services/auth';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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
            localStorage.setItem('token', `Bearer ${token}`);
            this.router.navigate(['/providers']);
          }
        },
        error: (error) => {
          console.error('Error en el login:', error);
        }
      });
    }
  }
}

