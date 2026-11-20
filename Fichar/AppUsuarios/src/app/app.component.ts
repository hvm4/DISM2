import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  IonApp, IonRouterOutlet, IonSplitPane, IonMenu, IonHeader, IonToolbar, IonTitle,
  IonContent, IonList, IonMenuToggle, IonItem, IonLabel, IonIcon,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { home, time, list, logOut } from 'ionicons/icons';
import { Auth } from './services/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    RouterModule, IonApp, IonRouterOutlet, IonSplitPane, IonMenu, IonHeader, IonToolbar,
    IonTitle, IonContent, IonList, IonMenuToggle, IonItem, IonLabel, IonIcon,
  ],
})
export class AppComponent {
  auth = inject(Auth);
  private router = inject(Router);

  constructor() {
    addIcons({ home, time, list, logOut });
  }

  salir() {
    this.auth.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}