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
