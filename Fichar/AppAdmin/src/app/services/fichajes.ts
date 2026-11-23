import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Fichaje } from '../models/models';

@Injectable({ providedIn: 'root' })
export class Fichajes {
  private url = `${environment.apiUrl}/fichajes`;
  constructor(private http: HttpClient) {}

  getAll(f: { idUsuario?: number; fechaDesde?: string; fechaHasta?: string; soloAbierto?: boolean } = {}) {
    let params = new HttpParams();
    Object.entries(f).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params = params.set(k, String(v));
    });
    return this.http.get<Fichaje[]>(this.url, { params });
  }
  add(f: { IdTrabajo: number; IdUsuario: number; GeolocalizacionLatitud?: number; GeolocalizacionLongitud?: number }) {
    return this.http.post<Fichaje>(this.url, f);
  }
  cerrar(id: number) { return this.http.put<Fichaje>(`${this.url}/${id}/salida`, {}); }
}