import { Routes } from '@angular/router';
import { Login } from './features/auth/pages/login/login';
import { Register } from './features/auth/pages/register/register';
import { EditarLicencia } from './features/auth/pages/editar-licencia/editar-licencia/editar-licencia';
import { CallList } from './features/providers/components/call-list/call-list';
import { RequestCallForm } from './features/clients/components/request-call-form/request-call-form';
import { CreateFacilities } from './features/facilities/pages/create-facilities/create-facilities';
import { FacilitiesList } from './features/facilities/pages/facilities-list/facilities-list';
import { ProvidersList } from './features/clients/components/providers-list/providers-list';
import { AddShiftForm } from './features/providers/pages/add-shift-form/add-shift-form';
import { ProviderShifts } from './features/providers/pages/provider-shifts/provider-shifts';
import { NotFoundComponent } from './features/errors/not-found-component/not-found-component';
import { MisTurnos } from './features/clients/pages/mis-turnos/mis-turnos';
import { authGuard } from './features/auth/guards/auth-guard';
import { roleGuard } from './features/auth/guards/role-guard-guard';
import { ReviewForm } from './features/review/component/review-form/review-form';
import { ReviewList } from './features/review/component/review-list/review-list';


export const routes: Routes = [
  {
    path: 'auth',
    children: [
      { path: 'login', component: Login },
      { path: 'register', component: Register },
      { path: 'editar-licencia', component: EditarLicencia },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  //RUTAS ESPECÍFICAS DEL PRESTADOR (PRIMERO)
  { path: 'providers/shifts', component: ProviderShifts, canActivate: [authGuard, roleGuard], data: { role: 'PROVIDER' } },
  { path: 'providers/shifts/add', component: AddShiftForm, canActivate: [authGuard, roleGuard], data: { role: 'PROVIDER' }  },
  { path: 'providers/shifts/edit/:shiftId', component: AddShiftForm, canActivate: [authGuard, roleGuard], data: { role: 'PROVIDER' }  },
  { path: 'providers/calls', component: CallList , canActivate: [authGuard, roleGuard], data: { role: 'PROVIDER' } },

  // CLIENTE (BÚSQUEDA DE PRESTADORES)
  { path: 'providers/:facilityId', component: ProvidersList,  canActivate: [authGuard, roleGuard],data: { role: 'CLIENT' } },
  { path: 'providers', component: ProvidersList,  canActivate: [authGuard, roleGuard],data: { role: 'CLIENT' } },

  //  TURNOS Y SERVICIOS
  { path: 'calls/request/:providerId', component: RequestCallForm, canActivate: [authGuard, roleGuard],data: { role: 'CLIENT' } },
  { path: 'mis-turnos', component: MisTurnos, canActivate: [authGuard, roleGuard],data: { role: 'CLIENT' } },
  { path: 'facilities', component: FacilitiesList, canActivate: [authGuard]},
  { path: 'facilities/edit/:facilityId', component: CreateFacilities, canActivate: [authGuard, roleGuard],data: { role: 'ADMIN' } },
  { path: 'facilities/create', component: CreateFacilities , canActivate: [authGuard, roleGuard],data: { role: 'ADMIN' }},

  // REVIEW
  { path: 'review/create/:providerId', component: ReviewForm},
  { path: 'reviews', component: ReviewList },
  
  // OTROS
  { path: 'editar-licencia', component: EditarLicencia },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];
