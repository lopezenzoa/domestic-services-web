import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  AbstractControl, // Importado para el validador
  ValidationErrors, // Importado para tipado del validador
  ValidatorFn, // Importado para tipado del validador
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
import Swal from 'sweetalert2';

export function playerFactory() {
  return player;
}

// 1. FUNCIÓN VALIDADORA PERSONALIZADA DE SEGURIDAD (8+ chars, 1 mayúscula, 1 número)
function passwordSecurityValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';
    
    if (!value) {
      return null; 
    }
    const minLength = value.length >= 8; 
    const hasNumber = /[0-9]/.test(value); 
    const hasUpperCase = /[A-Z]/.test(value); 

    const valid = minLength && hasNumber && hasUpperCase;

    return valid ? null : { 'strongPassword': true };
  };
}


// FUNCIÓN VALIDADORA DE COINCIDENCIA (Validador a nivel de FormGroup)
function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const passwordControl = group.get('password');
  const confirmPasswordControl = group.get('confirmPassword');
  
  if (!passwordControl || !confirmPasswordControl) {
    return null;
  }
  
  // Si confirmPasswordControl ya tiene un error de required, no hacemos nada.
  if (confirmPasswordControl.errors && confirmPasswordControl.hasError('required')) {
    return null;
  }
  
  // Marcar error en confirmPassword si no coinciden
  if (passwordControl.value !== confirmPasswordControl.value) {
    confirmPasswordControl.setErrors({ mustMatch: true });
    return { 'passwordMismatch': true }; // Error a nivel de FormGroup
  } else {
    // Si coinciden, quitar el error mustMatch (si existía)
    if (confirmPasswordControl.hasError('mustMatch')) {
      confirmPasswordControl.setErrors(null);
    }
    return null;
  }
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

  
  tipoCuenta: 'usuario' | 'prestador' = 'usuario';

  fb: FormBuilder = inject(FormBuilder);
  

  form: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', Validators.required],
    
    // Contraseña: Aplicar validador de seguridad
    password: ['', [Validators.required, passwordSecurityValidator()]], 
    
    // Confirmar Contraseña: Aplicar solo 'required'
    confirmPassword: ['', Validators.required], 
    
    facility: this.fb.group({
      name: [''],
    }), // Servicio que brinda el prestador, es necesario que sea un objeto
    tipoCuenta: ['usuario', Validators.required],
    address: ['', Validators.required],
    licenseNumber: [null], 
  }, {
    validators: passwordMatchValidator 
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
      
      this.snackBar.open('Completa todos los campos correctamente. Verifica las contraseñas.', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar'],
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
       
        Swal.fire({
          title: '¡Registro Exitoso!',
          text: 'Tu cuenta ha sido creada. Serás redirigido al inicio de sesión.',
          icon: 'success',
          confirmButtonColor: '#06d6a0',
        }).then(() => {
          this.router.navigate(['/auth/login']);
        });
      },
      error: (err) => {
        console.error('Error en el registro: ', err);
   
        Swal.fire({
          title: 'Error de Registro',
          text: 'Hubo un problema al registrar el usuario. Intenta nuevamente.',
          icon: 'error',
          confirmButtonColor: '#e63946',
        });
      },
    });
  }
}