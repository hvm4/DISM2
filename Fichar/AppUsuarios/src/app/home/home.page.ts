import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
} from '@ionic/angular';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  imports: [RouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton],
})
export class HomePage {
  auth = inject(Auth);
  private router = inject(Router);

  salir() {
    this.auth.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}