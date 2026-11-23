import { HttpInterceptorFn } from '@angular/common/http';

const API_KEY = 'clave-dism-2026';

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) =>
  next(req.clone({ setHeaders: { 'X-API-Key': API_KEY } }));