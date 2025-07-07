import { asistenciaApi } from "../../asistencia/services/serviceAsistencia";
import { docenteApi } from "../../docentes/services/ServiceDocente";
import { turnoApi } from "../../turnos/service/serviceTurno";
import { 
  ReporteCompleto, 
  FiltrosReporte, 
  EstadisticasAsistencia, 
  EstadisticasPorDocente, 
  EstadisticasPorTurno, 
  EstadisticasPorFecha,
  DatosGrafica 
} from "../types/Reportes";
import { AsistenciaResponseDTO } from "../../asistencia/types/Asistencia";
import { DocenteResponseDTO } from "../../docentes/interface/InterfaceDocente";
import { TurnoResponseDTO } from "../../turnos/interface/InterfaceTurnos";

export const reportesApi = {
  generarReporte: async (filtros: FiltrosReporte): Promise<ReporteCompleto> => {
    try {
      // Obtener todos los datos necesarios
      const [asistencias, docentes, turnos] = await Promise.all([
        asistenciaApi.getAsistencias(),
        docenteApi.getProfesores(),
        turnoApi.getTurnos()
      ]);

      // Filtrar asistencias por fecha y docente (pero NO por estado)
      const asistenciasFiltradasPorFecha = asistencias.filter(asistencia => {
        // Filtro por rango de fechas
        if (filtros.fechaInicio && asistencia.fecha < filtros.fechaInicio) return false;
        if (filtros.fechaFin && asistencia.fecha > filtros.fechaFin) return false;
        
        // Filtro por docente
        if (filtros.id_docente && asistencia.idDocente !== filtros.id_docente) return false;
        
        return true;
      });

      // Si hay filtro por estado, filtrar las asistencias por estado
      const asistenciasFiltradas = filtros.estado 
        ? asistenciasFiltradasPorFecha.filter(asistencia => asistencia.estado === filtros.estado)
        : asistenciasFiltradasPorFecha;

      console.log('🔍 Filtros aplicados:', filtros);
      console.log('📊 Total asistencias originales:', asistencias.length);
      console.log('📊 Asistencias filtradas por fecha:', asistenciasFiltradasPorFecha.length);
      console.log('📊 Asistencias filtradas por estado:', asistenciasFiltradas.length);
      console.log('📊 Docentes totales:', docentes.length);

      // Generar estadísticas generales
      const estadisticasGenerales = generarEstadisticasGenerales(asistenciasFiltradas);
      
      // Generar estadísticas por docente (usando asistencias filtradas por fecha pero mostrando todos los docentes)
      const estadisticasPorDocente = generarEstadisticasPorDocente(asistenciasFiltradas, docentes, filtros.estado);
      
      // Generar estadísticas por turno
      const estadisticasPorTurno = generarEstadisticasPorTurno(asistenciasFiltradas, turnos);
      
      // Generar estadísticas por fecha
      const estadisticasPorFecha = generarEstadisticasPorFecha(asistenciasFiltradas);
      
      // Generar datos para gráficas
      const datosGraficaAsistencia = generarDatosGraficaAsistencia(estadisticasGenerales);
      const datosGraficaPorDocente = generarDatosGraficaPorDocente(estadisticasPorDocente);
      const datosGraficaPorTurno = generarDatosGraficaPorTurno(estadisticasPorTurno);
      const datosGraficaTemporal = generarDatosGraficaTemporal(estadisticasPorFecha);

      return {
        estadisticasGenerales,
        estadisticasPorDocente,
        estadisticasPorTurno,
        estadisticasPorFecha,
        datosGraficaAsistencia,
        datosGraficaPorDocente,
        datosGraficaPorTurno,
        datosGraficaTemporal
      };
    } catch (error) {
      console.error("Error generando reporte:", error);
      throw error;
    }
  }
};

// Funciones auxiliares para generar estadísticas
function generarEstadisticasGenerales(asistencias: AsistenciaResponseDTO[]): EstadisticasAsistencia {
  const totalAsistencias = asistencias.length;
  const totalRegistrados = asistencias.filter(a => a.estado === "REGISTRADO").length;
  const totalInasistencias = asistencias.filter(a => a.estado === "INASISTENCIA").length;
  const porcentajeAsistencia = totalAsistencias > 0 ? (totalRegistrados / totalAsistencias) * 100 : 0;
  
  const tiemposUso = asistencias
    .filter(a => a.estado === "REGISTRADO" && a.tiempo_uso > 0)
    .map(a => a.tiempo_uso);
  
  const promedioTiempoUso = tiemposUso.length > 0 
    ? tiemposUso.reduce((sum, tiempo) => sum + tiempo, 0) / tiemposUso.length 
    : 0;

  return {
    totalAsistencias,
    totalRegistrados,
    totalInasistencias,
    porcentajeAsistencia: Math.round(porcentajeAsistencia * 100) / 100,
    promedioTiempoUso: Math.round(promedioTiempoUso * 100) / 100
  };
}

function generarEstadisticasPorDocente(
  asistencias: AsistenciaResponseDTO[], 
  docentes: DocenteResponseDTO[],
  filtroEstado?: string
): EstadisticasPorDocente[] {
  const estadisticasPorDocente = new Map<number, EstadisticasPorDocente>();

  // Inicializar estadísticas para cada docente
  docentes.forEach(docente => {
    estadisticasPorDocente.set(docente.id_docente, {
      id_docente: docente.id_docente,
      nombres: docente.nombres,
      apellidos: docente.apellidos,
      dni: docente.dni,
      totalAsistencias: 0,
      totalRegistrados: 0,
      totalInasistencias: 0,
      porcentajeAsistencia: 0,
      promedioTiempoUso: 0
    });
  });

  // Calcular estadísticas
  asistencias.forEach(asistencia => {
    const estadistica = estadisticasPorDocente.get(asistencia.idDocente);
    if (estadistica) {
      estadistica.totalAsistencias++;
      if (asistencia.estado === "REGISTRADO") {
        estadistica.totalRegistrados++;
      } else if (asistencia.estado === "INASISTENCIA") {
        estadistica.totalInasistencias++;
      }
    }
  });

  // Si hay filtro por estado, ajustar los totales para mostrar solo las asistencias del estado seleccionado
  if (filtroEstado) {
    console.log(`🔍 Aplicando filtro por estado: ${filtroEstado}`);
    estadisticasPorDocente.forEach(estadistica => {
      if (filtroEstado === "REGISTRADO") {
        estadistica.totalAsistencias = estadistica.totalRegistrados;
        estadistica.totalInasistencias = 0;
      } else if (filtroEstado === "INASISTENCIA") {
        estadistica.totalAsistencias = estadistica.totalInasistencias;
        estadistica.totalRegistrados = 0;
      }
    });
  }

  // Calcular porcentajes y promedios
  estadisticasPorDocente.forEach(estadistica => {
    if (filtroEstado) {
      // Si hay filtro por estado, el porcentaje es 100% para los que tienen asistencias del tipo seleccionado
      estadistica.porcentajeAsistencia = estadistica.totalAsistencias > 0 ? 100 : 0;
    } else {
      // Sin filtro por estado, calcular porcentaje normal
      estadistica.porcentajeAsistencia = estadistica.totalAsistencias > 0 
        ? Math.round((estadistica.totalRegistrados / estadistica.totalAsistencias) * 100 * 100) / 100
        : 0;
    }
    
    // Calcular tiempo promedio solo para registros (no aplica para inasistencias)
    const tiemposUso = asistencias
      .filter(a => a.idDocente === estadistica.id_docente && a.estado === "REGISTRADO" && a.tiempo_uso > 0)
      .map(a => a.tiempo_uso);
    
    estadistica.promedioTiempoUso = tiemposUso.length > 0 
      ? Math.round((tiemposUso.reduce((sum, tiempo) => sum + tiempo, 0) / tiemposUso.length) * 100) / 100
      : 0;
  });

  const resultado = Array.from(estadisticasPorDocente.values())
    .sort((a, b) => b.totalAsistencias - a.totalAsistencias);
  
  console.log(`📊 Docentes con asistencias: ${resultado.filter(est => est.totalAsistencias > 0).length}`);
  console.log(`📊 Docentes sin asistencias: ${resultado.filter(est => est.totalAsistencias === 0).length}`);
  
  return resultado;
}

function generarEstadisticasPorTurno(
  asistencias: AsistenciaResponseDTO[], 
  turnos: TurnoResponseDTO[]
): EstadisticasPorTurno[] {
  const estadisticasPorTurno = new Map<string, EstadisticasPorTurno>();

  // Agrupar asistencias por turno
  asistencias.forEach(asistencia => {
    const turno = turnos.find(t => t.idDocente === asistencia.idDocente);
    if (turno) {
      const tipoTurno = turno.tipo_turno;
      
      if (!estadisticasPorTurno.has(tipoTurno)) {
        estadisticasPorTurno.set(tipoTurno, {
          tipo_turno: tipoTurno,
          totalAsistencias: 0,
          totalRegistrados: 0,
          totalInasistencias: 0,
          porcentajeAsistencia: 0
        });
      }
      
      const estadistica = estadisticasPorTurno.get(tipoTurno)!;
      estadistica.totalAsistencias++;
      
      if (asistencia.estado === "REGISTRADO") {
        estadistica.totalRegistrados++;
      } else if (asistencia.estado === "INASISTENCIA") {
        estadistica.totalInasistencias++;
      }
    }
  });

  // Calcular porcentajes
  estadisticasPorTurno.forEach(estadistica => {
    estadistica.porcentajeAsistencia = estadistica.totalAsistencias > 0 
      ? Math.round((estadistica.totalRegistrados / estadistica.totalAsistencias) * 100 * 100) / 100
      : 0;
  });

  return Array.from(estadisticasPorTurno.values())
    .sort((a, b) => b.totalAsistencias - a.totalAsistencias);
}

function generarEstadisticasPorFecha(asistencias: AsistenciaResponseDTO[]): EstadisticasPorFecha[] {
  const estadisticasPorFecha = new Map<string, EstadisticasPorFecha>();

  // Agrupar asistencias por fecha
  asistencias.forEach(asistencia => {
    if (!estadisticasPorFecha.has(asistencia.fecha)) {
      estadisticasPorFecha.set(asistencia.fecha, {
        fecha: asistencia.fecha,
        totalAsistencias: 0,
        totalRegistrados: 0,
        totalInasistencias: 0,
        porcentajeAsistencia: 0
      });
    }
    
    const estadistica = estadisticasPorFecha.get(asistencia.fecha)!;
    estadistica.totalAsistencias++;
    
    if (asistencia.estado === "REGISTRADO") {
      estadistica.totalRegistrados++;
    } else if (asistencia.estado === "INASISTENCIA") {
      estadistica.totalInasistencias++;
    }
  });

  // Calcular porcentajes
  estadisticasPorFecha.forEach(estadistica => {
    estadistica.porcentajeAsistencia = estadistica.totalAsistencias > 0 
      ? Math.round((estadistica.totalRegistrados / estadistica.totalAsistencias) * 100 * 100) / 100
      : 0;
  });

  return Array.from(estadisticasPorFecha.values())
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
}

// Funciones para generar datos de gráficas
function generarDatosGraficaAsistencia(estadisticas: EstadisticasAsistencia): DatosGrafica {
  return {
    labels: ['Registrados', 'Inasistencias'],
    datasets: [{
      label: 'Asistencias',
      data: [estadisticas.totalRegistrados, estadisticas.totalInasistencias],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderColor: [
        'rgb(34, 197, 94)',
        'rgb(239, 68, 68)'
      ],
      borderWidth: 1
    }]
  };
}

function generarDatosGraficaPorDocente(estadisticas: EstadisticasPorDocente[]): DatosGrafica {
  const top5 = estadisticas.slice(0, 5);
  
  return {
    labels: top5.map(est => `${est.nombres} ${est.apellidos}`),
    datasets: [{
      label: 'Porcentaje de Asistencia (%)',
      data: top5.map(est => est.porcentajeAsistencia),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(139, 92, 246, 0.8)'
      ],
      borderColor: [
        'rgb(59, 130, 246)',
        'rgb(16, 185, 129)',
        'rgb(245, 158, 11)',
        'rgb(239, 68, 68)',
        'rgb(139, 92, 246)'
      ],
      borderWidth: 1
    }]
  };
}

function generarDatosGraficaPorTurno(estadisticas: EstadisticasPorTurno[]): DatosGrafica {
  return {
    labels: estadisticas.map(est => est.tipo_turno),
    datasets: [{
      label: 'Total de Asistencias',
      data: estadisticas.map(est => est.totalAsistencias),
      backgroundColor: estadisticas.map((_, index) => 
        `hsl(${index * 60}, 70%, 60%)`
      ),
      borderColor: estadisticas.map((_, index) => 
        `hsl(${index * 60}, 70%, 50%)`
      ),
      borderWidth: 1
    }]
  };
}

function generarDatosGraficaTemporal(estadisticas: EstadisticasPorFecha[]): DatosGrafica {
  const ultimas10Fechas = estadisticas.slice(-10);
  
  return {
    labels: ultimas10Fechas.map(est => {
      const fecha = new Date(est.fecha);
      return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
    }),
    datasets: [
      {
        label: 'Registrados',
        data: ultimas10Fechas.map(est => est.totalRegistrados),
        backgroundColor: ['rgba(34, 197, 94, 0.8)'],
        borderColor: ['rgb(34, 197, 94)'],
        borderWidth: 2
      },
      {
        label: 'Inasistencias',
        data: ultimas10Fechas.map(est => est.totalInasistencias),
        backgroundColor: ['rgba(239, 68, 68, 0.8)'],
        borderColor: ['rgb(239, 68, 68)'],
        borderWidth: 2
      }
    ]
  };
} 