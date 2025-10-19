import { Routes } from '@angular/router';
import { Login } from './features/auth/pages/login/login';
import { Register} from './features/auth/pages/register/register';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      { path: 'login', component: Login },
      { path: 'register', component: Register },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  
];
