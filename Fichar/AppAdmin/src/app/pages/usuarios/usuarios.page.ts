import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  AlertController,
  ToastController,
  IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent,
  IonList, IonItem, IonLabel, IonItemSliding, IonItemOptions, IonItemOption,
  IonFab, IonFabButton, IonIcon, IonMenuButton,IonButton
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add, trash } from 'ionicons/icons';


import { Usuario } from '../../models/models';
import { Usuarios as UsuariosService } from '../../services/usuarios';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  standalone: true,
  imports: [
    RouterLink,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent,
    IonList, IonItem, IonLabel, IonItemSliding, IonItemOptions, IonItemOption,
    IonFab, IonFabButton, IonIcon, IonButton
  ],
})
export class UsuariosPage {
  usuarios = signal<Usuario[]>([]);

  constructor(
    private srv: UsuariosService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
  ) {
    addIcons({ add, trash});
  }

  ionViewWillEnter() {
    this.cargar();
  }

  cargar() {
    this.srv.getAll().subscribe({
      next: (datos: Usuario[]) => this.usuarios.set(datos),
      error: (e: any) => this.mostrarError(e),
    });
  }

  async borrar(u: Usuario) {
    const alert = await this.alertCtrl.create({
      header: 'Borrar usuario',
      message: `¿Seguro que quieres borrar a ${u.Nombre}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Borrar',
          role: 'destructive',
          handler: () => {
            this.srv.delete(u.IdUsuario!).subscribe({
              next: () => this.cargar(),
              error: (e: any) => this.mostrarError(e),
            });
          },
        },
      ],
    });
    await alert.present();
  }

  private async mostrarError(e: any) {
    const toast = await this.toastCtrl.create({
      message: e?.error?.message ?? 'Error de conexión con el servidor',
      duration: 3000,
      color: 'danger',
    });
    await toast.present();
  }
}