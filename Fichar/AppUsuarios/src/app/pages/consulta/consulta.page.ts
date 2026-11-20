import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import {
  ToastController,
  IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent,
  IonList, IonItem, IonLabel, IonInput, IonButton,
} from '@ionic/angular';

import { Fichaje } from '../../models/models';
import { Auth } from '../../services/auth';
import { Fichajes } from '../../services/fichajes';

// Fecha de hoy como YYYY-MM-DD en hora local (toISOString usaría UTC y podría dar el día anterior)
function hoy(): string {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.page.html',
  imports: [
    DecimalPipe,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent,
    IonList, IonItem, IonLabel, IonInput, IonButton,
  ],
})
export class ConsultaPage {
  private auth = inject(Auth);
  private fichajesSrv = inject(Fichajes);
  private toastCtrl = inject(ToastController);

  desde = signal(hoy());
  hasta = signal(hoy());
  fichajes = signal<Fichaje[]>([]);

  ionViewWillEnter() {
    this.cargar();
  }

  cargar() {
    const desde = this.desde();
    const hasta = this.hasta();
    if (desde && hasta && desde > hasta) {
      this.fichajes.set([]);
      this.aviso('La fecha "Desde" no puede ser posterior a "Hasta"', 'warning');
      return;
    }
    this.fichajesSrv.getAll({
      idUsuario: this.auth.usuario()!.IdUsuario,
      fechaDesde: desde,
      fechaHasta: hasta,
    }).subscribe({
      next: (lista: Fichaje[]) => this.fichajes.set(lista),
      error: (e: any) => this.aviso(e?.error?.message ?? 'Error de conexión con el servidor', 'danger'),
    });
  }

  cambiarDesde(ev: any) { this.desde.set(ev.detail.value ?? ''); this.cargar(); }
  cambiarHasta(ev: any) { this.hasta.set(ev.detail.value ?? ''); this.cargar(); }

  verHoy() {
    this.desde.set(hoy());
    this.hasta.set(hoy());
    this.cargar();
  }

  enlaceMapa(f: Fichaje): string {
    const lat = f.GeolocalizacionLatitud;
    const lng = f.GeolocalizacionLongitud;
    return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`;
  }

  private async aviso(message: string, color: string) {
    const t = await this.toastCtrl.create({ message, duration: 3000, color });
    await t.present();
  }
}