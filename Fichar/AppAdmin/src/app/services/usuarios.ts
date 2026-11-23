import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/models';

@Injectable({ providedIn: 'root' })
export class Usuarios {
  private url = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  getAll()            { return this.http.get<Usuario[]>(this.url); }
  getById(id: number) { return this.http.get<Usuario>(`${this.url}/${id}`); }
  add(u: Usuario)     { return this.http.post<Usuario>(this.url, u); }
  update(u: Usuario)  { return this.http.put<Usuario>(this.url, u); }
  delete(id: number)  { return this.http.delete<{ message: string }>(`${this.url}/${id}`); }
}