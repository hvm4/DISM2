import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Trabajo } from '../models/models';

@Injectable({ providedIn: 'root' })
export class Trabajos {
  private url = `${environment.apiUrl}/trabajos`;
  constructor(private http: HttpClient) {}

  getAll()            { return this.http.get<Trabajo[]>(this.url); }
  getById(id: number) { return this.http.get<Trabajo>(`${this.url}/${id}`); }
  add(t: Trabajo)     { return this.http.post<Trabajo>(this.url, t); }
  update(t: Trabajo)  { return this.http.put<Trabajo>(this.url, t); }
  delete(id: number)  { return this.http.delete<{ message: string }>(`${this.url}/${id}`); }
}