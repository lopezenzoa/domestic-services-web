import { Routes } from '@angular/router';
import { Login } from './features/auth/pages/login/login';
import { Register} from './features/auth/pages/register/register';
import { EditarLicencia } from './features/auth/pages/editar-licencia/editar-licencia/editar-licencia';
import { CallList } from './features/providers/components/call-list/call-list';

export const routes: Routes = [
 {
  path: 'auth',
  children: [
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'editar-licencia', component: EditarLicencia },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
  ]
},
{ path: 'providers/calls', component: CallList },
{ path: 'editar-licencia', component: EditarLicencia },
{ path: '**', redirectTo: '/auth/login', pathMatch: 'full' },
];
