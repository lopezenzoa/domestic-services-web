import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token && token.split('.').length === 3) {
    return true;
  }

  // Si no hay token (para autenticar las peticiones), redirigir al componente de login
  // Si no hay token, entonces el usuario no inicio sesion
  router.navigate(['/login']);
  return false;
};
