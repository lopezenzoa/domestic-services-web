import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';

export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  const expectedRole = route.data['role'];
  const user = auth.getUser();

  if (!user) {
    router.navigate(['/auth/login']);
    return false;
  }

  // TU ROL REAL VIENE COMO "CLIENT", NO COMO "USER"
  const role = user.role;

  if (role === expectedRole) {
    return true;
  }

  // ❗ Importante: si el rol no coincide, que NO vuelva al login.
  // Mandalo a una página 403 o a un lugar neutral.
  router.navigate(['/']);
  return false;
};
