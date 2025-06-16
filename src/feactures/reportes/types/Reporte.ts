export interface Reporte {
  id: string;
  titulo: string;
  tipo: "asistencia" | "aula" | "estadistica";
  parametros: ReporteParametros;
  fechaGeneracion: Date;
  generadoPor: string;
  formato: "pdf" | "excel" | "csv";
  url?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReporteParametros {
  fechaInicio?: Date;
  fechaFin?: Date;
  profesorId?: string;
  aulaId?: string;
  turnoId?: string;
  agruparPor?: "profesor" | "aula" | "turno" | "dia" | "mes";
  mostrarInconsistencias?: boolean;
  mostrarAusencias?: boolean;
}

export interface GenerarReporte {
  titulo: string;
  tipo: "asistencia" | "aula" | "estadistica";
  parametros: ReporteParametros;
  formato: "pdf" | "excel";
}

export interface ReporteDTO {
  idReporte?: number;
  idUsuario: number;
  tipo_reporte: string;
  fecha_generacion: string;
  hora_generacion: string;
  parametros: Record<string, any>;
}

export interface ReporteAsistenciaDTO {
  fecha_inicio: string;
  fecha_fin: string;
  idAula?: number;
  idDocente?: number;
}

export interface ReporteUsoAulaDTO {
  fecha_inicio: string;
  fecha_fin: string;
  idAula?: number;
}

export interface ReporteEstadisticoDTO {
  fecha_inicio: string;
  fecha_fin: string;
  tipo_estadistica: 'asistencia' | 'uso_aula' | 'tardanzas';
}

export interface ReporteAulaInnovacion {
  id: string;
  fecha: string;
  profesor: {
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
  };
  horaEntrada: string;
  horaSalida: string;
  tiempoUso: number;
  estado: "ASISTIO" | "TARDANZA" | "AUSENTE";
  aula: string;
  observaciones?: string;
}

export interface FiltroReporteAulaInnovacion {
  fecha_inicio: string;
  fecha_fin: string;
  idAula?: number;
  idDocente?: number;
  formato: "pdf" | "excel" | "csv";
} 