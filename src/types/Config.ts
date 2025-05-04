export interface ConfiguracionSistema {
  id: string;
  tiempoMaximoSesion: number; // en minutos
  diasLaborales: number[]; // 0 = Domingo, 1 = Lunes, etc.
  notificacionesInconsistencias: boolean;
  toleranciaEntrada: number; // en minutos
  toleranciaSalida: number; // en minutos
  correoNotificaciones: string;
  updatedAt: Date;
}
