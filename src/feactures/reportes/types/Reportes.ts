export interface FiltrosReporte {
  fechaInicio: string;
  fechaFin: string;
  id_docente: number | null;
  estado: string;
  tipo_turno: string;
  tipo_docencia: string;
}

export interface EstadisticasAsistencia {
  totalAsistencias: number;
  totalRegistrados: number;
  totalInasistencias: number;
  porcentajeAsistencia: number;
  promedioTiempoUso: number;
}

export interface EstadisticasPorDocente {
  id_docente: number;
  nombres: string;
  apellidos: string;
  dni: string;
  totalAsistencias: number;
  totalRegistrados: number;
  totalInasistencias: number;
  porcentajeAsistencia: number;
  promedioTiempoUso: number;
}

export interface EstadisticasPorTurno {
  tipo_turno: string;
  totalAsistencias: number;
  totalRegistrados: number;
  totalInasistencias: number;
  porcentajeAsistencia: number;
}

export interface EstadisticasPorFecha {
  fecha: string;
  totalAsistencias: number;
  totalRegistrados: number;
  totalInasistencias: number;
  porcentajeAsistencia: number;
}

export interface DatosGrafica {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}

export interface ReporteCompleto {
  estadisticasGenerales: EstadisticasAsistencia;
  estadisticasPorDocente: EstadisticasPorDocente[];
  estadisticasPorTurno: EstadisticasPorTurno[];
  estadisticasPorFecha: EstadisticasPorFecha[];
  datosGraficaAsistencia: DatosGrafica;
  datosGraficaPorDocente: DatosGrafica;
  datosGraficaPorTurno: DatosGrafica;
  datosGraficaTemporal: DatosGrafica;
}

export interface ReporteState {
  reporte: ReporteCompleto | null;
  loading: boolean;
  error: string | null;
  filtros: FiltrosReporte;
  
  generarReporte: (filtros: FiltrosReporte) => Promise<void>;
  setFiltros: (filtros: Partial<FiltrosReporte>) => void;
  limpiarFiltros: () => void;
} 