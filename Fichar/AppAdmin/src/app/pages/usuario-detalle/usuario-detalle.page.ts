import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ToastController,
  IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonMenuButton,
  IonContent, IonCard, IonInput, IonInputPasswordToggle, IonButton, IonIcon,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  fingerPrintOutline, personOutline, atOutline, lockClosedOutline, closeOutline, saveOutline,
} from 'ionicons/icons';
import { Usuario } from '../../models/models';
import { Usuarios } from '../../services/usuarios';

@Component({
  selector: 'app-usuario-detalle',
  templateUrl: './usuario-detalle.page.html',
  imports: [
    ReactiveFormsModule, RouterLink,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonMenuButton,
    IonContent, IonCard, IonInput, IonInputPasswordToggle, IonButton, IonIcon,
  ],
})
export class UsuarioDetallePage implements OnInit {
  id: number | null = null; // null = alta nueva
  form = this.fb.nonNullable.group({
    Nombre: ['', [Validators.required, Validators.maxLength(100)]],
    Usuario: ['', Validators.maxLength(50)],
    Clave: ['', Validators.maxLength(50)],
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private srv: Usuarios,
    private toastCtrl: ToastController,
  ) {
    addIcons({
      fingerPrintOutline, personOutline, atOutline, lockClosedOutline, closeOutline, saveOutline,
    });
  }

  ngOnInit() {
    const param = this.route.snapshot.paramMap.get('id');
    if (param && param !== 'nuevo') {
      this.id = Number(param);
      this.srv.getById(this.id).subscribe({
        next: (u: Usuario) => this.form.patchValue({
          Nombre: u.Nombre, Usuario: u.Usuario ?? '', Clave: u.Clave ?? '',
        }),
        error: (e: any) => this.error(e),
      });
    }
  }

  guardar() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const datos = this.form.getRawValue() as Usuario;
    const peticion = this.id === null
      ? this.srv.add(datos)
      : this.srv.update({ ...datos, IdUsuario: this.id });
    peticion.subscribe({
      next: () => this.router.navigate(['/usuarios']),
      error: (e: any) => this.error(e),
    });
  }

  private async error(e: any) {
    const t = await this.toastCtrl.create({
      message: e?.error?.message ?? 'Error de conexión con el servidor', duration: 3000, color: 'danger',
    });
    await t.present();
  }
}