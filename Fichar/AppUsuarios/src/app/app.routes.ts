import { Routes } from '@angular/router';
import { authGuard } from './auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'registrar',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/registrar/registrar.page').then((m) => m.RegistrarPage),
  },
  {
    path: 'consulta',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/consulta/consulta.page').then((m) => m.ConsultaPage),
  },
];