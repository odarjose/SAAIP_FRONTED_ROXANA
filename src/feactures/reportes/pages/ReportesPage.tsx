import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../shared/components/Card";
import { Button } from "../../../shared/components/Button";
import { Input } from "../../../shared/components/Input";
import { Select } from "../../../shared/components/Select";
import { SelectOption } from "../../../shared/interface/Interfaces";
import { useReportesStore } from "../store/storeReportes";
import { useDocenteStore } from "../../docentes/store/StoreDocente";
import { useTurnoStore } from "../../turnos/store/storeTurno";
import { StatCard } from "../components/StatCard";
import { StatsTable } from "../components/StatsTable";
import { AttendanceChart } from "../../../shared/components/Charts/AttendanceChart";
import { LineChart } from "../../../shared/components/Charts/LineChart";
import {
  BarChart3,
  Calendar,
  Filter,
  Search,
  Users,
  Clock,
  TrendingUp,
  FileBarChart,
  RefreshCw,
  Download,
} from "lucide-react";

import { generateAsistenciaPDFReport } from "../../../shared/lib/reportUtils";

const ReportesPage: React.FC = () => {
  const {
    reporte,
    loading,
    error,
    filtros,
    generarReporte,
    setFiltros,
    limpiarFiltros,
  } = useReportesStore();

  const {
    profesores,
    fetchProfesores,
  } = useDocenteStore();

  const {
    turnos,
    fetchTurnos,
  } = useTurnoStore();

  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  const [mostrarTodosLosDocentes, setMostrarTodosLosDocentes] = useState(true);
  const [exportandoPDF, setExportandoPDF] = useState(false);

  useEffect(() => {
    fetchProfesores();
    fetchTurnos();
  }, [fetchProfesores, fetchTurnos]);

  // Opciones para los filtros
  const profesoresOptions: SelectOption[] = [
    { value: "", label: "Todos los profesores" },
    ...profesores.map((docente) => ({
      value: docente.id_docente.toString(),
      label: `${docente.nombres} ${docente.apellidos} - ${docente.dni}`,
    })),
  ];

  const estadosOptions: SelectOption[] = [
    { value: "", label: "Todos los estados" },
    { value: "REGISTRADO", label: "Registrado" },
    { value: "INASISTENCIA", label: "Inasistencia" },
  ];

  const turnosOptions: SelectOption[] = [
    { value: "", label: "Todos los turnos" },
    ...Array.from(new Set(turnos.map(t => t.tipo_turno))).map(tipo => ({
      value: tipo,
      label: tipo
    }))
  ];

  const docenciaOptions: SelectOption[] = [
    { value: "", label: "Todos los tipos" },
    { value: "UNIDOCENCIA", label: "Unidocencia" },
    { value: "PLURIDOCENCIA", label: "Pluridocencia" },
  ];

  const handleFiltroChange = (campo: keyof typeof filtros, valor: string | number | null) => {
    setFiltros({ [campo]: valor });
  };

  const handleGenerarReporte = () => {
    generarReporte(filtros);
  };

  const handleLimpiarFiltros = () => {
    limpiarFiltros();
  };

  const handleExportarPDF = async () => {
    if (!reporte) return;

    setExportandoPDF(true);
    console.log('📄 Iniciando exportación a PDF...');
    console.log('📊 Datos del reporte:', reporte);

    // Preparar filtros para el PDF
    const filtrosPDF: Record<string, string> = {};
    
    if (filtros.fechaInicio) {
      filtrosPDF["Fecha Inicio"] = filtros.fechaInicio;
    }
    if (filtros.fechaFin) {
      filtrosPDF["Fecha Fin"] = filtros.fechaFin;
    }
    if (filtros.id_docente) {
      const profesorLabel = profesoresOptions.find(p => p.value === filtros.id_docente?.toString())?.label;
      if (profesorLabel) {
        filtrosPDF["Profesor"] = profesorLabel;
      }
    }
    if (filtros.estado) {
      const estadoLabel = estadosOptions.find(e => e.value === filtros.estado)?.label;
      if (estadoLabel) {
        filtrosPDF["Estado"] = estadoLabel;
      }
    }
    if (filtros.tipo_turno) {
      filtrosPDF["Tipo de Turno"] = filtros.tipo_turno;
    }
    if (filtros.tipo_docencia) {
      filtrosPDF["Tipo de Docencia"] = filtros.tipo_docencia;
    }

    try {
      generateAsistenciaPDFReport({
        estadisticasGenerales: reporte.estadisticasGenerales,
        estadisticasPorDocente: reporte.estadisticasPorDocente,
        estadisticasPorTurno: reporte.estadisticasPorTurno,
        filtros: filtrosPDF
      });
      
      console.log('✅ PDF exportado exitosamente');
    } catch (error) {
      console.error('❌ Error al exportar PDF:', error);
      alert('Error al generar el PDF. Por favor, inténtalo de nuevo.');
    } finally {
      setExportandoPDF(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            Reportes y Estadísticas
          </h1>
          <p className="text-secondary-600">
            Análisis detallado de asistencias y métricas de rendimiento
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button
            variant="outline"
            onClick={handleExportarPDF}
            disabled={!reporte || exportandoPDF}
          >
            {exportandoPDF ? (
              <RefreshCw size={16} className="mr-2 animate-spin" />
            ) : (
              <Download size={16} className="mr-2" />
            )}
            {exportandoPDF ? 'Generando PDF...' : 'Exportar PDF'}
          </Button>
          <Button onClick={handleGenerarReporte} disabled={loading}>
            {loading ? (
              <RefreshCw size={16} className="mr-2 animate-spin" />
            ) : (
              <FileBarChart size={16} className="mr-2" />
            )}
            Generar Reporte
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter size={20} className="mr-2 text-secondary-600" />
            Filtros de Reporte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar size={18} className="text-secondary-400" />
              <Input
                type="date"
                value={filtros.fechaInicio}
                onChange={(e) =>
                  handleFiltroChange('fechaInicio', e.target.value)
                }
                label="Fecha Inicio"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Calendar size={18} className="text-secondary-400" />
              <Input
                type="date"
                value={filtros.fechaFin}
                onChange={(e) =>
                  handleFiltroChange('fechaFin', e.target.value)
                }
                label="Fecha Fin"
              />
            </div>

            <Select
              options={profesoresOptions}
              value={filtros.id_docente?.toString() || ""}
              onChange={(e) =>
                handleFiltroChange('id_docente', e.target.value ? parseInt(e.target.value) : null)
              }
              label="Profesor"
            />

            <Select
              options={estadosOptions}
              value={filtros.estado}
              onChange={(e) => handleFiltroChange('estado', e.target.value)}
              label="Estado"
            />

            <Select
              options={turnosOptions}
              value={filtros.tipo_turno}
              onChange={(e) => handleFiltroChange('tipo_turno', e.target.value)}
              label="Tipo de Turno"
            />

            <Select
              options={docenciaOptions}
              value={filtros.tipo_docencia}
              onChange={(e) => handleFiltroChange('tipo_docencia', e.target.value)}
              label="Tipo de Docencia"
            />
          </div>

          <div className="flex items-center justify-between mt-4 p-3 bg-secondary-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="mostrarTodos"
                checked={mostrarTodosLosDocentes}
                onChange={(e) => setMostrarTodosLosDocentes(e.target.checked)}
                className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="mostrarTodos" className="text-sm font-medium text-secondary-700">
                Mostrar todos los docentes (incluso sin asistencias en el período)
              </label>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button variant="outline" className="mr-2" onClick={handleLimpiarFiltros}>
              Limpiar
            </Button>
            <Button onClick={handleGenerarReporte} disabled={loading}>
              <Search size={16} className="mr-2" />
              Generar Reporte
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Card>
          <CardContent className="p-4">
            <div className="text-center text-error-600">
              <p>Error: {error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      {loading && (
        <Card>
          <CardContent className="p-8">
            <div className="flex justify-center items-center">
              <RefreshCw size={32} className="animate-spin text-primary-600" />
              <span className="ml-2 text-secondary-600">Generando reporte...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contenido del Reporte */}
      {reporte && !loading && (
        <>
          {/* Estadísticas Generales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Asistencias"
              value={reporte.estadisticasGenerales.totalAsistencias}
              icon={BarChart3}
              color="primary"
            />
            <StatCard
              title="Registrados"
              value={reporte.estadisticasGenerales.totalRegistrados}
              icon={Users}
              color="success"
            />
            <StatCard
              title="Inasistencias"
              value={reporte.estadisticasGenerales.totalInasistencias}
              icon={Clock}
              color="error"
            />
            <StatCard
              title="% Asistencia"
              value={`${reporte.estadisticasGenerales.porcentajeAsistencia}%`}
              icon={TrendingUp}
              color="info"
            />
          </div>

          {/* Gráficas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfica de Asistencias */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Distribución de Asistencias</span>
                  <div className="flex space-x-2">
                    <Button
                      variant={chartType === 'bar' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setChartType('bar')}
                    >
                      Barras
                    </Button>
                    <Button
                      variant={chartType === 'pie' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setChartType('pie')}
                    >
                      Circular
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AttendanceChart
                  attendanceData={{
                    present: reporte.estadisticasGenerales.totalRegistrados,
                    absent: reporte.estadisticasGenerales.totalInasistencias,
                    late: 0
                  }}
                  type={chartType}
                />
              </CardContent>
            </Card>

            {/* Gráfica Temporal */}
            <Card>
              <CardHeader>
                <CardTitle>Tendencia Temporal</CardTitle>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={{
                    ...reporte.datosGraficaTemporal,
                    datasets: reporte.datosGraficaTemporal.datasets.map(ds => ({
                      ...ds,
                      backgroundColor: Array.isArray(ds.backgroundColor) ? ds.backgroundColor[0] : ds.backgroundColor,
                      borderColor: Array.isArray(ds.borderColor) ? ds.borderColor[0] : ds.borderColor,
                    }))
                  }}
                  title="Asistencias por Fecha"
                />
              </CardContent>
            </Card>
          </div>

          {/* Tablas de Estadísticas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Estadísticas por Docente */}
            <div className="space-y-4">
              {mostrarTodosLosDocentes && (
                <div className="bg-info-50 border border-info-200 rounded-lg p-3">
                  <p className="text-sm text-info-700">
                    <strong>Nota:</strong> Se muestran todos los docentes registrados en el sistema. 
                    Los docentes sin asistencias en el período seleccionado aparecen con valores en cero.
                  </p>
                </div>
              )}
              <StatsTable
                title={`Estadísticas por Docente ${
                  filtros.estado ? `(${filtros.estado})` : ''
                } ${!mostrarTodosLosDocentes ? '(solo con asistencias)' : '(todos los docentes)'}`}
                data={reporte.estadisticasPorDocente
                  .filter(est => mostrarTodosLosDocentes || est.totalAsistencias > 0)
                  .map(est => ({
                    id: est.id_docente,
                    name: `${est.nombres} ${est.apellidos}`,
                    totalAsistencias: est.totalAsistencias,
                    totalRegistrados: est.totalRegistrados,
                    totalInasistencias: est.totalInasistencias,
                    porcentajeAsistencia: est.porcentajeAsistencia,
                    promedioTiempoUso: est.promedioTiempoUso
                  }))}
                showTimeUsage={true}
              />
            </div>

            {/* Estadísticas por Turno */}
            <StatsTable
              title="Estadísticas por Turno"
              data={reporte.estadisticasPorTurno.map(est => ({
                id: est.tipo_turno,
                name: est.tipo_turno,
                totalAsistencias: est.totalAsistencias,
                totalRegistrados: est.totalRegistrados,
                totalInasistencias: est.totalInasistencias,
                porcentajeAsistencia: est.porcentajeAsistencia
              }))}
            />
          </div>

          {/* Gráfica de Turnos */}
          <Card>
            <CardHeader>
              <CardTitle>Asistencias por Tipo de Turno</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <AttendanceChart
                  attendanceData={{
                    present: reporte.estadisticasPorTurno.reduce((sum, t) => sum + t.totalRegistrados, 0),
                    absent: reporte.estadisticasPorTurno.reduce((sum, t) => sum + t.totalInasistencias, 0),
                    late: 0
                  }}
                  type="bar"
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Estado inicial */}
      {!reporte && !loading && !error && (
        <Card>
          <CardContent className="p-8">
            <div className="text-center text-secondary-500">
              <FileBarChart size={48} className="mx-auto mb-4 text-secondary-400" />
              <h3 className="text-lg font-medium mb-2">No hay reporte generado</h3>
              <p>Configura los filtros y haz clic en "Generar Reporte" para ver las estadísticas.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportesPage; 