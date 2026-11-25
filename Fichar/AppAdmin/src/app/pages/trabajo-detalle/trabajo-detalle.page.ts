import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ToastController,
  IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonMenuButton,
  IonContent, IonCard, IonInput, IonButton, IonIcon,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { fingerPrintOutline, briefcaseOutline, closeOutline, saveOutline } from 'ionicons/icons';
import { Trabajo } from '../../models/models';
import { Trabajos } from '../../services/trabajos';

@Component({
  selector: 'app-trabajo-detalle',
  templateUrl: './trabajo-detalle.page.html',
  imports: [
    ReactiveFormsModule, RouterLink,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonMenuButton,
    IonContent, IonCard, IonInput, IonButton, IonIcon,
  ],
})
export class TrabajoDetallePage implements OnInit {
  id: number | null = null; // null = alta nueva
  form = this.fb.nonNullable.group({
    Nombre: ['', [Validators.required, Validators.maxLength(200)]],
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private srv: Trabajos,
    private toastCtrl: ToastController,
  ) {
    addIcons({ fingerPrintOutline, briefcaseOutline, closeOutline, saveOutline });
  }

  ngOnInit() {
    const param = this.route.snapshot.paramMap.get('id');
    if (param && param !== 'nuevo') {
      this.id = Number(param);
      this.srv.getById(this.id).subscribe({
        next: (t: Trabajo) => this.form.patchValue({ Nombre: t.Nombre }),
        error: (e: any) => this.error(e),
      });
    }
  }

  guardar() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const datos = this.form.getRawValue() as Trabajo;
    const peticion = this.id === null
      ? this.srv.add(datos)
      : this.srv.update({ ...datos, IdTrabajo: this.id });
    peticion.subscribe({
      next: () => this.router.navigate(['/trabajos']),
      error: (e: any) => this.error(e),
    });
  }

  private async error(e: any) {
    const t = await this.toastCtrl.create({
      message: e?.error?.message ?? 'Error de conexión con el servidor',
      duration: 3000,
      color: 'danger',
    });
    await t.present();
  }
}