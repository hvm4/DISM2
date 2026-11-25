import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonMenuButton,
  IonCard, IonIcon,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  personCircleOutline, timeOutline, listOutline, chevronForwardOutline, logOutOutline,
} from 'ionicons/icons';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  imports: [
    RouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonMenuButton,
    IonCard, IonIcon,
  ],
})
export class HomePage {
  auth = inject(Auth);
  private router = inject(Router);
  fecha = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

  constructor() {
    addIcons({
      personCircleOutline, timeOutline, listOutline, chevronForwardOutline, logOutOutline,
    });
  }

  salir() {
    this.auth.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}