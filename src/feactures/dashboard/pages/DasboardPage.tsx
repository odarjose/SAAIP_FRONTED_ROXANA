import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../shared/components/Card";
import { Button } from "../../../shared/components/Button";
import { Badge } from "../../../shared/components/Badge";
import { Avatar } from "../../../shared/components/Avatar";

import {
  Users,
  BookOpen,
  Building2,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { formatDate } from "../../../shared/lib/Utils";

const Dashboard: React.FC = () => {
  // Datos de ejemplo para el dashboard
  const today = new Date();
  const todayStr = formatDate(today, "EEEE, d MMMM yyyy");

  const stats = [
    {
      title: "Profesores",
      value: "42",
      icon: <BookOpen size={20} />,
      color: "bg-primary-500",
    },
    {
      title: "Aulas",
      value: "18",
      icon: <Building2 size={20} />,
      color: "bg-success-500",
    },
    {
      title: "Usuarios",
      value: "63",
      icon: <Users size={20} />,
      color: "bg-secondary-500",
    },
    {
      title: "Inconsistencias",
      value: "3",
      icon: <AlertTriangle size={20} />,
      color: "bg-error-500",
    },
  ];

  const asistenciasHoy = [
    {
      id: "1",
      profesor: { nombre: "Ana", apellido: "García" },
      estado: "a_tiempo",
      aula: "A-101",
      hora: "08:15",
      turno: "Mañana",
    },
    {
      id: "2",
      profesor: { nombre: "Carlos", apellido: "Martínez" },
      estado: "a_tiempo",
      aula: "B-203",
      hora: "08:30",
      turno: "Mañana",
    },
    {
      id: "3",
      profesor: { nombre: "Laura", apellido: "Rodríguez" },
      estado: "tarde",
      aula: "C-105",
      hora: "09:10",
      turno: "Mañana",
    },
    {
      id: "4",
      profesor: { nombre: "Miguel", apellido: "López" },
      estado: "ausente",
      aula: "D-302",
      hora: "--:--",
      turno: "Mañana",
    },
  ];

  const proximosTurnos = [
    {
      id: "1",
      profesor: { nombre: "José", apellido: "Fernández" },
      hora: "14:00",
      aula: "A-201",
      turno: "Tarde",
    },
    {
      id: "2",
      profesor: { nombre: "María", apellido: "González" },
      hora: "14:30",
      aula: "B-102",
      turno: "Tarde",
    },
    {
      id: "3",
      profesor: { nombre: "Pedro", apellido: "Sánchez" },
      hora: "15:00",
      aula: "C-304",
      turno: "Tarde",
    },
  ];

  const inconsistencias = [
    {
      id: "1",
      profesor: { nombre: "Laura", apellido: "Rodríguez" },
      tipo: "Entrada tardía",
      hora: "09:10",
      detalles: "40 minutos tarde",
    },
    {
      id: "2",
      profesor: { nombre: "Miguel", apellido: "López" },
      tipo: "Ausencia",
      hora: "--:--",
      detalles: "Sin justificación",
    },
    {
      id: "3",
      profesor: { nombre: "Elena", apellido: "Díaz" },
      tipo: "Salida temprana",
      hora: "12:30",
      detalles: "30 minutos antes",
    },
  ];

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "a_tiempo":
        return <Badge variant="success">A tiempo</Badge>;
      case "tarde":
        return <Badge variant="warning">Tarde</Badge>;
      case "ausente":
        return <Badge variant="error">Ausente</Badge>;
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
          <Button variant="outline" size="sm">
            <Calendar size={16} className="mr-2" />
            Programar
          </Button>
          <Button size="sm">
            <CheckCircle2 size={16} className="mr-2" />
            Registro rápido
          </Button>
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
              <AlertTriangle size={20} className="mr-2 text-error-600" />
              Inconsistencias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inconsistencias.map((inconsistencia) => (
                <div
                  key={inconsistencia.id}
                  className="flex items-center justify-between border-b border-secondary-100 pb-3"
                >
                  <div className="flex items-center">
                    <Avatar
                      name={inconsistencia.profesor.nombre}
                      surname={inconsistencia.profesor.apellido}
                    />
                    <div className="ml-3">
                      <p className="font-medium text-secondary-900">
                        {inconsistencia.profesor.nombre}{" "}
                        {inconsistencia.profesor.apellido}
                      </p>
                      <div className="flex items-center mt-1">
                        <Badge variant="error" className="mr-2">
                          {inconsistencia.tipo}
                        </Badge>
                        <span className="text-xs text-secondary-500">
                          {inconsistencia.detalles}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-error-600 hover:text-error-700"
                    >
                      <XCircle size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-success-600 hover:text-success-700"
                    >
                      <CheckCircle2 size={18} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-3">
              Ver todas las inconsistencias
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="animate-fade-in" style={{ animationDelay: "300ms" }}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock size={20} className="mr-2 text-primary-600" />
            Próximos turnos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {proximosTurnos.map((turno) => (
              <div
                key={turno.id}
                className="border border-secondary-200 rounded-md p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Avatar
                      name={turno.profesor.nombre}
                      surname={turno.profesor.apellido}
                      size="sm"
                    />
                    <span className="ml-2 font-medium">
                      {turno.profesor.nombre} {turno.profesor.apellido}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="flex flex-col">
                    <span className="text-secondary-500">Aula</span>
                    <span className="font-medium">{turno.aula}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-secondary-500">Hora</span>
                    <span className="font-medium">{turno.hora}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-secondary-500">Turno</span>
                    <span className="font-medium">{turno.turno}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
