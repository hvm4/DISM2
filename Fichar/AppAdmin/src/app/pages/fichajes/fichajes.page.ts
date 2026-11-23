import { Component, computed, signal } from '@angular/core';
import {
  ToastController,
  IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent,
  IonSearchbar, IonInput, IonItem, IonList, IonLabel, IonButton, IonIcon, IonModal,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { map } from 'ionicons/icons';
import * as L from 'leaflet';
import { Fichaje } from '../../models/models';
import { Fichajes } from '../../services/fichajes';

@Component({
  selector: 'app-fichajes',
  templateUrl: './fichajes.page.html',
  imports: [
    IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent,
    IonSearchbar, IonInput, IonItem, IonList, IonLabel, IonButton, IonIcon, IonModal,
  ],
})
export class FichajesPage {
  fichajes = signal<Fichaje[]>([]);
  texto = signal('');
  desde = signal('');
  hasta = signal('');
  mapaAbierto = signal(false);
  seleccionado: Fichaje | null = null;
  private mapa?: L.Map;

  // Filtro por nombre de usuario (searchbar), sobre lo que ya devolvió la API por fechas
  filtrados = computed(() => {
    const t = this.texto().trim().toLowerCase();
    return t ? this.fichajes().filter(f => (f.NombreUsuario ?? '').toLowerCase().includes(t)) : this.fichajes();
  });

  constructor(private srv: Fichajes, private toastCtrl: ToastController) {
    addIcons({ map });
  }

  ionViewWillEnter() { this.cargar(); }

  cargar() {
    this.srv.getAll({ fechaDesde: this.desde(), fechaHasta: this.hasta() }).subscribe({
      next: (d: Fichaje[]) => this.fichajes.set(d),
      error: (e: any) => this.error(e),
    });
  }

  cambiarDesde(ev: any) { this.desde.set(ev.detail.value ?? ''); this.cargar(); }
  cambiarHasta(ev: any) { this.hasta.set(ev.detail.value ?? ''); this.cargar(); }
  buscar(ev: any)       { this.texto.set(ev.target.value ?? ''); }

  verMapa(f: Fichaje) { this.seleccionado = f; this.mapaAbierto.set(true); }

  pintarMapa() {
    const f = this.seleccionado;
    if (!f) return;
    const pos: L.LatLngExpression = [f.GeolocalizacionLatitud!, f.GeolocalizacionLongitud!];
    this.mapa = L.map('mapa').setView(pos, 16);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(this.mapa);
    L.circleMarker(pos, { radius: 10 }).addTo(this.mapa).bindPopup(f.NombreUsuario ?? 'Fichaje').openPopup();
    setTimeout(() => this.mapa?.invalidateSize(), 100);
  }

  cerrarMapa() {
    this.mapa?.remove();
    this.mapa = undefined;
    this.mapaAbierto.set(false);
  }

  private async error(e: any) {
    const t = await this.toastCtrl.create({
      message: e?.error?.message ?? 'Error de conexión con el servidor', duration: 3000, color: 'danger',
    });
    await t.present();
  }
}