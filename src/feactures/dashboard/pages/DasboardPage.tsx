import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../shared/components/Card";
import { Button } from "../../../shared/components/Button";
import { Badge } from "../../../shared/components/Badge";
import { Avatar } from "../../../shared/components/Avatar";
import { ReportButton } from "../../../shared/components/ReportButton";
import { AttendanceChart } from "../../../shared/components/Charts/AttendanceChart";
import { useAsistenciaStore } from "../../asistencia/store/storeAsistencia";
import { useDocenteStore } from "../../docentes/store/StoreDocente";
import { useTurnoStore } from "../../turnos/store/storeTurno";
import { generatePDFReport } from "../../../shared/lib/reportUtils";

import {
  Users,
  BookOpen,
  Building2,
  AlertTriangle,
  
  CheckCircle2,
 
  FileText,
} from "lucide-react";
import { formatDate } from "../../../shared/lib/Utils";

const Dashboard: React.FC = () => {
  const { asistencias, fetchAsistencias } = useAsistenciaStore();
  const { profesores, fetchProfesores } = useDocenteStore();
  const { turnos, fetchTurnos } = useTurnoStore();

  const [attendanceStats, setAttendanceStats] = useState({
    present: 0,
    absent: 0,
    late: 0
  });

  useEffect(() => {
    fetchAsistencias();
    fetchProfesores();
    fetchTurnos();
  }, [fetchAsistencias, fetchProfesores, fetchTurnos]);

  useEffect(() => {
    // Calcular estadísticas de asistencia
    const today = formatDate(new Date(), "yyyy-MM-dd");
    console.log('Fecha actual:', today);
    console.log('Todas las asistencias:', asistencias);
    
    const todayAttendances = asistencias.filter(a => a.fecha === today);
    console.log('Asistencias de hoy:', todayAttendances);
    
    // Contar asistencias por estado
    const stats = {
      present: todayAttendances.filter(a => a.estado === "REGISTRADO").length,
      absent: todayAttendances.filter(a => a.estado === "INASISTENCIA").length,
      late: 0 // No hay tardanzas en el sistema actual
    };

    console.log('Estadísticas calculadas:', stats);
    setAttendanceStats(stats);
  }, [asistencias]);

  const handleGenerateReport = () => {
    const headers = [
      "Fecha",
      "Total Presentes",
      "Total Ausentes",
      "Total Tardanzas",
      "Porcentaje Asistencia"
    ];

    const today = formatDate(new Date(), "yyyy-MM-dd");
    const total = attendanceStats.present + attendanceStats.absent + attendanceStats.late;
    const attendancePercentage = total > 0 
      ? ((attendanceStats.present / total) * 100).toFixed(2) 
      : "0.00";

    const reportData = [{
      fecha: today,
      total_presentes: attendanceStats.present,
      total_ausentes: attendanceStats.absent,
      total_tardanzas: attendanceStats.late,
      porcentaje_asistencia: `${attendancePercentage}%`
    }];

    generatePDFReport({
      title: "Reporte de Asistencias del Día",
      headers,
      data: reportData,
      filters: {}
    });
  };

  const today = new Date();
  const todayStr = formatDate(today, "EEEE, d MMMM yyyy");

  const stats = [
    {
      title: "Profesores",
      value: profesores.length.toString(),
      icon: <BookOpen size={20} />,
      color: "bg-primary-500",
    },
    {
      title: "Turnos Activos",
      value: turnos.filter(t => t.estado).length.toString(),
      icon: <Building2 size={20} />,
      color: "bg-success-500",
    },
    {
      title: "Asistencias Hoy",
      value: (attendanceStats.present + attendanceStats.late).toString(),
      icon: <Users size={20} />,
      color: "bg-secondary-500",
    },
    {
      title: "Inasistencias",
      value: attendanceStats.absent.toString(),
      icon: <AlertTriangle size={20} />,
      color: "bg-error-500",
    },
  ];

  const asistenciasHoy = asistencias
    .filter(a => a.fecha === formatDate(new Date(), "yyyy-MM-dd"))
    .map(a => ({
      id: a.idDocenteTurno,
      profesor: {
        nombre: a.usuario_nombres,
        apellido: a.usuario_apellidos
      },
      estado: a.estado.toLowerCase(),
      aula: a.docente_tipo_docencia || "No asignada",
      hora: a.hora_entrada || "--:--",
      turno: a.docente_tipo_contrato || "No asignado"
    }));

  const getEstadoBadge = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "registrado":
        return <Badge variant="success">Presente</Badge>;
      case "inasistencia":
        return <Badge variant="warning">Inasistencia</Badge>;
      case "tardanza":
        return <Badge variant="error">Tardanza</Badge>;
      default:
        return <Badge>Pendiente</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Dashboard</h1>
          <p className="text-secondary-600">{todayStr}</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <ReportButton onClick={handleGenerateReport} />
         
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="animate-fade-in"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-500">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color} text-white`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-slide-in-left">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle2 size={20} className="mr-2 text-success-600" />
              Asistencias de hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {asistenciasHoy.map((asistencia) => (
                <div
                  key={asistencia.id}
                  className="flex items-center justify-between border-b border-secondary-100 pb-3"
                >
                  <div className="flex items-center">
                    <Avatar
                      name={asistencia.profesor.nombre}
                      surname={asistencia.profesor.apellido}
                    />
                    <div className="ml-3">
                      <p className="font-medium text-secondary-900">
                        {asistencia.profesor.nombre}{" "}
                        {asistencia.profesor.apellido}
                      </p>
                      <div className="flex items-center mt-1">
                        <Badge variant="secondary" className="mr-2">
                          {asistencia.aula}
                        </Badge>
                        <span className="text-xs text-secondary-500">
                          Turno {asistencia.turno}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    {getEstadoBadge(asistencia.estado)}
                    <span className="text-xs text-secondary-500 mt-1">
                      {asistencia.hora}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-3">
              Ver todas las asistencias
            </Button>
          </CardContent>
        </Card>

        <Card className="animate-slide-in-right">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText size={20} className="mr-2 text-primary-600" />
              Estadísticas de Asistencia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <AttendanceChart attendanceData={attendanceStats} type="bar" />
            </div>
            <div className="mt-4">
              <AttendanceChart attendanceData={attendanceStats} type="pie" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
