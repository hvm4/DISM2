import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ToastController,
  IonContent, IonInput, IonInputPasswordToggle, IonButton, IonIcon, IonSpinner,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { personOutline, lockClosedOutline, logInOutline, briefcaseOutline } from 'ionicons/icons';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  imports: [
    ReactiveFormsModule,
    IonContent, IonInput, IonInputPasswordToggle, IonButton, IonIcon, IonSpinner,
  ],
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);

  cargando = signal(false);
  form = this.fb.nonNullable.group({
    Usuario: ['', Validators.required],
    Clave: ['', Validators.required],
  });

  constructor() {
    addIcons({ personOutline, lockClosedOutline, logInOutline, briefcaseOutline });
  } 

  entrar() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { Usuario, Clave } = this.form.getRawValue();
    this.cargando.set(true);
    this.auth.login(Usuario, Clave).subscribe({
      next: () => {
        this.cargando.set(false);
        this.router.navigate(['/home'], { replaceUrl: true });
      },
      error: (e: any) => {
        this.cargando.set(false);
        this.mostrarError(e);
      },
    });
  }

  private async mostrarError(e: any) {
    const t = await this.toastCtrl.create({
      message: e?.error?.message ?? 'Error de conexión con el servidor',
      duration: 3000,
      color: 'danger',
    });
    await t.present();
  }
}