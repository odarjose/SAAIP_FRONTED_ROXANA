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
import { Badge } from "../../../shared/components/Badge";
import { reporteApi } from "../services/serviceReporte";
import { ReporteDTO, ReporteUsoAulaDTO } from "../types/Reporte";
import { useDocenteStore } from "../../docentes/store/StoreDocente";
import { formatDate } from "../../../shared/lib/Utils";
import {
  FileBarChart,
  Filter,
  Calendar,
  Clock,
  User,
} from "lucide-react";

const ReporteAulaInnovacionPage: React.FC = () => {
  const { profesores, fetchProfesores } = useDocenteStore();
  const [reportes, setReportes] = useState<ReporteDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState<ReporteUsoAulaDTO>({
    fecha_inicio: formatDate(new Date(), "yyyy-MM-dd"),
    fecha_fin: formatDate(new Date(), "yyyy-MM-dd"),
  });

  useEffect(() => {
    fetchProfesores();
    cargarReportes();
  }, [fetchProfesores]);

  const cargarReportes = async () => {
    try {
      const reportesList = await reporteApi.listarReportes();
      setReportes(reportesList);
    } catch (error) {
      console.error("Error al cargar reportes:", error);
    }
  };

  const handleGenerarReporte = async () => {
    try {
      setLoading(true);
      const blob = await reporteApi.generarReporteUsoAula(filtros);
      
      // Crear URL del blob y descargar
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte-aula-innovacion-${formatDate(new Date(), "yyyy-MM-dd")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Recargar la lista de reportes
      await cargarReportes();
    } catch (error) {
      console.error("Error al generar el reporte:", error);
      alert("Error al generar el reporte");
    } finally {
      setLoading(false);
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "ASISTIO":
        return <Badge variant="success">Asistió</Badge>;
      case "TARDANZA":
        return <Badge variant="warning">Tardanza</Badge>;
      case "AUSENTE":
        return <Badge variant="error">Ausente</Badge>;
      default:
        return <Badge>Desconocido</Badge>;
    }
  };

  const formatTiempoUso = (minutos: number) => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas}h ${mins}m`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            Reportes Aula de Innovación
          </h1>
          <p className="text-secondary-600">
            Generación y visualización de reportes de asistencia y uso del aula
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter size={20} className="mr-2 text-primary-600" />
            Filtros del Reporte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar size={18} className="text-secondary-400" />
              <Input
                type="date"
                label="Fecha inicio"
                value={filtros.fecha_inicio}
                onChange={(e) =>
                  setFiltros({ ...filtros, fecha_inicio: e.target.value })
                }
              />
            </div>

            <div className="flex items-center space-x-2">
              <Calendar size={18} className="text-secondary-400" />
              <Input
                type="date"
                label="Fecha fin"
                value={filtros.fecha_fin}
                onChange={(e) =>
                  setFiltros({ ...filtros, fecha_fin: e.target.value })
                }
              />
            </div>

            <Select
              label="Profesor"
              options={[
                { value: "", label: "Todos los profesores" },
                ...profesores.map((p) => ({
                  value: p.id_docente.toString(),
                  label: `${p.nombres} ${p.apellidos}`,
                })),
              ]}
              value={filtros.idDocente?.toString() || ""}
              onChange={(e) =>
                setFiltros({ ...filtros, idDocente: e.target.value ? parseInt(e.target.value) : undefined })
              }
            />
          </div>

          <div className="flex justify-end mt-4">
            <Button
              onClick={handleGenerarReporte}
              disabled={loading}
              className="flex items-center"
            >
              <FileBarChart size={16} className="mr-2" />
              {loading ? "Generando..." : "Generar Reporte"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock size={20} className="mr-2 text-primary-600" />
            Reportes Generados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-secondary-200">
                  <th className="py-3 px-4 text-left text-sm font-medium text-secondary-500">
                    ID
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-secondary-500">
                    Tipo
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-secondary-500">
                    Fecha Generación
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-secondary-500">
                    Hora
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-secondary-500">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {reportes.map((reporte) => (
                  <tr
                    key={reporte.idReporte}
                    className="border-b border-secondary-100 hover:bg-secondary-50"
                  >
                    <td className="py-3 px-4">{reporte.idReporte}</td>
                    <td className="py-3 px-4">{reporte.tipo_reporte}</td>
                    <td className="py-3 px-4">
                      {formatDate(new Date(reporte.fecha_generacion), "dd/MM/yyyy")}
                    </td>
                    <td className="py-3 px-4">{reporte.hora_generacion}</td>
                    <td className="py-3 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Implementar descarga del reporte
                        }}
                      >
                        <FileBarChart size={16} className="text-primary-600" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReporteAulaInnovacionPage; 