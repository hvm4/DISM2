import { Routes } from '@angular/router';
import { authGuard } from './auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./pages/usuarios/usuarios.page').then((m) => m.UsuariosPage),
      },
      {
        path: 'usuarios/:id',
        loadComponent: () =>
          import('./pages/usuario-detalle/usuario-detalle.page').then((m) => m.UsuarioDetallePage),
      },
      {
        path: 'trabajos',
        loadComponent: () => import('./pages/trabajos/trabajos.page').then((m) => m.TrabajosPage),
      },
      {
        path: 'trabajos/:id',
        loadComponent: () =>
          import('./pages/trabajo-detalle/trabajo-detalle.page').then((m) => m.TrabajoDetallePage),
      },
      {
        path: 'fichajes',
        loadComponent: () => import('./pages/fichajes/fichajes.page').then((m) => m.FichajesPage),
      },
    ],
  },
];