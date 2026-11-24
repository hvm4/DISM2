import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton, IonButton,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonIcon,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { peopleOutline, briefcaseOutline, timeOutline, logOutOutline } from 'ionicons/icons';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  imports: [
    RouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton, IonButton,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonIcon,
  ],
})
export class HomePage {
  auth = inject(Auth);
  private router = inject(Router);

  constructor() {
    addIcons({ peopleOutline, briefcaseOutline, timeOutline, logOutOutline });
  }

  salir() {
    this.auth.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}