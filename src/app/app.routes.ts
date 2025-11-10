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
  { path: 'providers', component: ProvidersList },
  { path: 'providers/calls', component: CallList },
  { path: 'calls/request/:providerId', component: RequestCallForm }, // El :providerId es un parámetro de ruta que se manda cuando se navega a este componente
  { path: 'facilities', component: FacilitiesList },
  { path: 'facilities/edit/:facilityId', component: CreateFacilities },
  { path: 'facilities/create', component: CreateFacilities },
  { path: 'providers/shifts', component: ProviderShifts },
  { path: 'providers/shifts/add', component: AddShiftForm },
  { path: 'providers/shifts/edit/:shiftId', component: AddShiftForm },
  { path: 'editar-licencia', component: EditarLicencia },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];
