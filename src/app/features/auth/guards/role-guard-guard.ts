import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  
  const expectedRole = route.data['role'] as string | string[];

  // Si no está logueado
  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/auth/login']);
  }

 
  if (!auth.hasRole(expectedRole)) {
   return router.createUrlTree(['/auth/login']);

  }

  return true;
};