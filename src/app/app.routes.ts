import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'seleccion-establecimiento',
    loadComponent: () =>
      import('./pages/seleccion-establecimiento/seleccion-establecimiento.page').then((m) => m.SeleccionEstablecimientoPage),
  },
  {
    path: '',
    redirectTo: '/seleccion-establecimiento',
    pathMatch: 'full',
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
];
