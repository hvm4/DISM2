export interface Usuario { IdUsuario?: number; Nombre: string; Usuario?: string; Clave?: string; }
export interface Trabajo { IdTrabajo?: number; Nombre: string; }
export interface Fichaje {
  IdFichaje?: number; FechaHoraEntrada: string; FechaHoraSalida?: string | null;
  HorasTrabajadas?: number | null; IdTrabajo: number; IdUsuario: number;
  GeolocalizacionLatitud?: number; GeolocalizacionLongitud?: number;
  NombreUsuario?: string; NombreTrabajo?: string;
}