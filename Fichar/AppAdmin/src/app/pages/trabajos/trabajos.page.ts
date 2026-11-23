import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  AlertController, ToastController,
  IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent,
  IonList, IonItem, IonLabel, IonButton,
  IonFab, IonFabButton, IonIcon,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add, trash } from 'ionicons/icons';
import { Trabajo } from '../../models/models';
import { Trabajos } from '../../services/trabajos';

@Component({
  selector: 'app-trabajos',
  templateUrl: './trabajos.page.html',
  imports: [
    RouterLink,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent,
    IonList, IonItem, IonLabel, IonButton,
    IonFab, IonFabButton, IonIcon,
  ],
})
export class TrabajosPage {
  trabajos = signal<Trabajo[]>([]);

  constructor(private srv: Trabajos, private alertCtrl: AlertController, private toastCtrl: ToastController) {
    addIcons({ add, trash });
  }

  ionViewWillEnter() { this.cargar(); }

  cargar() {
    this.srv.getAll().subscribe({
      next: (d: Trabajo[]) => this.trabajos.set(d),
      error: (e: any) => this.error(e),
    });
  }

  async borrar(t: Trabajo) {
    const a = await this.alertCtrl.create({
      header: 'Borrar trabajo', message: `¿Borrar "${t.Nombre}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Borrar', role: 'destructive', handler: () => {
          this.srv.delete(t.IdTrabajo!).subscribe({ next: () => this.cargar(), error: (e: any) => this.error(e) });
        } },
      ],
    });
    await a.present();
  }

  private async error(e: any) {
    const t = await this.toastCtrl.create({
      message: e?.error?.message ?? 'Error de conexión con el servidor', duration: 3000, color: 'danger',
    });
    await t.present();
  }
}