import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadComponent: () =>
          import('../pages/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'tab2',
        loadComponent: () =>
          import('../pages/catalog/catalog.page').then((m) => m.CatalogPage),
      },
      {
        path: 'tab2/comment',
        loadComponent: () =>
          import('../pages/comment/comment.page').then((m) => m.CommentPage),
      },
      {
        path: 'tab2/:id',
        loadComponent: () =>
          import('../pages/catalog/catalog.page').then((m) => m.CatalogPage),
      },
      {
        path: 'tab3',
        loadComponent: () =>
          import('../tab3/tab3.page').then((m) => m.Tab3Page),
      },
      {
        path: 'tab4',
        loadComponent: () =>
          import('../pages/carrito/carrito.page').then((m) => m.CarritoPage),
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full',
  },
];
