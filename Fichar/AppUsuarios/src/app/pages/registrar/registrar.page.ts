import { Component, inject, signal } from '@angular/core';
import {
  ToastController,
  IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent,
  IonSpinner, IonList, IonItem, IonSelect, IonSelectOption, IonButton,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
} from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';

import { Fichaje, Trabajo } from '../../models/models';
import { Auth } from '../../services/auth';
import { Trabajos } from '../../services/trabajos';
import { Fichajes } from '../../services/fichajes';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  imports: [
    IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent,
    IonSpinner, IonList, IonItem, IonSelect, IonSelectOption, IonButton,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  ],
})
export class RegistrarPage {
  private auth = inject(Auth);
  private trabajosSrv = inject(Trabajos);
  private fichajesSrv = inject(Fichajes);
  private toastCtrl = inject(ToastController);

  // 'nuevo' = sin fichaje en las últimas 12 h; 'abierto' = hay uno que se va a finalizar
  estado = signal<'cargando' | 'nuevo' | 'abierto'>('cargando');
  trabajos = signal<Trabajo[]>([]);
  abierto = signal<Fichaje | null>(null);
  trabajoSel = signal<number | null>(null);
  guardando = signal(false);

  ionViewWillEnter() {
    this.cargar();
  }

  // Pregunta al servidor si el usuario tiene un fichaje abierto en las últimas 12 horas
  cargar() {
    this.estado.set('cargando');
    const idUsuario = this.auth.usuario()!.IdUsuario;
    this.fichajesSrv.getAll({ idUsuario, soloAbierto: true }).subscribe({
      next: (lista: Fichaje[]) => {
        if (lista.length > 0) {
          this.abierto.set(lista[0]);   // el más reciente
          this.estado.set('abierto');
        } else {
          this.abierto.set(null);
          this.cargarTrabajos();
        }
      },
      error: (e: any) => this.mostrarError(e),
    });
  }

  private cargarTrabajos() {
    this.trabajosSrv.getAll().subscribe({
      next: (t: Trabajo[]) => {
        this.trabajos.set(t);
        this.trabajoSel.set(null);
        this.estado.set('nuevo');
      },
      error: (e: any) => this.mostrarError(e),
    });
  }

  // Abre un fichaje nuevo con el trabajo elegido y la ubicación actual
  async iniciar() {
    const idTrabajo = this.trabajoSel();
    if (idTrabajo === null) return;
    this.guardando.set(true);

    const pos = await this.obtenerPosicion();
    this.fichajesSrv.add({
      IdTrabajo: idTrabajo,
      IdUsuario: this.auth.usuario()!.IdUsuario,
      GeolocalizacionLatitud: pos?.lat,
      GeolocalizacionLongitud: pos?.lng,
    }).subscribe({
      next: () => {
        this.guardando.set(false);
        this.aviso('Fichaje iniciado', 'success');
        this.cargar();
      },
      error: (e: any) => {
        this.guardando.set(false);
        this.mostrarError(e);
      },
    });
  }

  // Cierra el fichaje abierto (el servidor pone la salida y las horas trabajadas)
  finalizar() {
    const f = this.abierto();
    if (!f) return;
    this.guardando.set(true);
    this.fichajesSrv.cerrar(f.IdFichaje!).subscribe({
      next: () => {
        this.guardando.set(false);
        this.aviso('Fichaje finalizado', 'success');
        this.cargar();
      },
      error: (e: any) => {
        this.guardando.set(false);
        this.mostrarError(e);
      },
    });
  }

  // Si no se puede obtener la ubicación (permiso denegado, sin señal…), se ficha sin ella
  private async obtenerPosicion(): Promise<{ lat: number; lng: number } | null> {
    try {
      const p = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000 });
      return { lat: p.coords.latitude, lng: p.coords.longitude };
    } catch {
      await this.aviso('No se pudo obtener la ubicación: el fichaje se registrará sin ella', 'warning');
      return null;
    }
  }

  private mostrarError(e: any) {
    return this.aviso(e?.error?.message ?? 'Error de conexión con el servidor', 'danger');
  }

  private async aviso(message: string, color: string) {
    const t = await this.toastCtrl.create({ message, duration: 3000, color });
    await t.present();
  }
}