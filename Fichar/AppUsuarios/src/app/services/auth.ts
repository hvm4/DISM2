import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Sesion {
  IdUsuario: number;
  Nombre: string;
}

const CLAVE_SESION = 'sesion';

@Injectable({ providedIn: 'root' })
export class Auth {
  private url = `${environment.apiUrl}/login`;
  private _usuario = signal<Sesion | null>(this.leer());
  usuario = this._usuario.asReadonly();

  constructor(private http: HttpClient) {}

  login(usuario: string, clave: string) {
    return this.http.post<Sesion>(this.url, { Usuario: usuario, Clave: clave }).pipe(
      tap((u) => {
        this._usuario.set(u);
        this.guardar(u);
      }),
    );
  }

  logout() {
    this._usuario.set(null);
    this.guardar(null);
  }

  private leer(): Sesion | null {
    try {
      const s = sessionStorage.getItem(CLAVE_SESION);
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  }

  private guardar(s: Sesion | null) {
    try {
      if (s) sessionStorage.setItem(CLAVE_SESION, JSON.stringify(s));
      else sessionStorage.removeItem(CLAVE_SESION);
    } catch {
      /* sin almacenamiento: la sesión solo vive en memoria */
    }
  }
}