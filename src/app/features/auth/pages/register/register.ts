import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FacilitiesService } from '../../../facilities/services/facilities-service';
import { Facility } from '../../../facilities/models/facilities.model';
import Swal from 'sweetalert2';

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

    return valid ? null : { strongPassword: true };
  };
}

function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const passwordControl = group.get('password');
  const confirmPasswordControl = group.get('confirmPassword');

  if (!passwordControl || !confirmPasswordControl) {
    return null;
  }

  if (confirmPasswordControl.errors && confirmPasswordControl.hasError('required')) {
    return null;
  }

  if (passwordControl.value !== confirmPasswordControl.value) {
    confirmPasswordControl.setErrors({ mustMatch: true });
    return { passwordMismatch: true };
  } else {
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
  facilitiesService: FacilitiesService = inject(FacilitiesService);
  facilitiesList: Facility[] = [];

  tipoCuenta: 'usuario' | 'prestador' = 'usuario';

  fb: FormBuilder = inject(FormBuilder);

  form: FormGroup = this.fb.group(
    {
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],

      password: ['', [Validators.required, passwordSecurityValidator()]],

      confirmPassword: ['', Validators.required],

      facility: this.fb.group({
        name: [''],
      }),
      tipoCuenta: ['usuario', Validators.required],
      address: ['', Validators.required],
      licenseNumber: [null],
      description: [''],
    },
    {
      validators: passwordMatchValidator,
    }
  );

  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  constructor(private snackBar: MatSnackBar) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.facilitiesService.getAll().subscribe({
      next: (res) => {
        this.facilitiesList = res;
      },
      error: (err) => {
        console.error('Error cargando servicios', err);
      },
    });
  }

  onRoleChange(role: 'usuario' | 'prestador') {
    this.tipoCuenta = role;
    this.form.get('tipoCuenta')?.setValue(role);

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
      this.snackBar.open(
        'Completa todos los campos correctamente. Verifica las contraseñas.',
        'Cerrar',
        {
          duration: 3000,
          panelClass: ['warning-snackbar'],
        }
      );
      return;
    }

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
      description: this.form.get('description')?.value,
    };

    this.authService.register(data).subscribe({
      next: () => {
        Swal.fire({
          title: 'Registro exitoso',
          text: 'Serás redirigido al inicio de sesión.',
          icon: 'success',
        }).then(() => {
          this.router.navigate(['/auth/login']);
        });
      },
      error: () => {
        Swal.fire({
          title: 'Error en el registro',
          text: 'Intenta nuevamente.',
          icon: 'error',
        });
      },
    });
  }
}
