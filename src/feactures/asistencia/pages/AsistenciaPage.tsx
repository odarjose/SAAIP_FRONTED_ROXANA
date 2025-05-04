import React, { useState } from "react";
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
import { Badge } from "../../../shared/components/Badge";
import { Avatar } from "../../../shared/components/Avatar";

import {
  Calendar,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";

import { formatDate } from "../../../shared/lib/Utils";

const AsistenciasPage: React.FC = () => {
  const [filtro, setFiltro] = useState({
    fecha: formatDate(new Date(), "yyyy-MM-dd"),
    profesor: "",
    aula: "",
    turno: "",
    estado: "",
  });

  // Opciones de selección
  const profesoresOptions: SelectOption[] = [
    { value: "", label: "Todos los profesores" },
    { value: "1", label: "Ana García" },
    { value: "2", label: "Carlos Martínez" },
    { value: "3", label: "Laura Rodríguez" },
    { value: "4", label: "Miguel López" },
  ];

  const aulasOptions: SelectOption[] = [
    { value: "", label: "Todas las aulas" },
    { value: "A-101", label: "A-101" },
    { value: "B-203", label: "B-203" },
    { value: "C-105", label: "C-105" },
    { value: "D-302", label: "D-302" },
  ];

  const turnosOptions: SelectOption[] = [
    { value: "", label: "Todos los turnos" },
    { value: "mañana", label: "Mañana" },
    { value: "tarde", label: "Tarde" },
    { value: "noche", label: "Noche" },
  ];

  const estadosOptions: SelectOption[] = [
    { value: "", label: "Todos los estados" },
    { value: "a_tiempo", label: "A tiempo" },
    { value: "tarde", label: "Tarde" },
    { value: "ausente", label: "Ausente" },
    { value: "pendiente", label: "Pendiente" },
  ];

  // Datos de ejemplo para asistencias
  const asistencias = [
    {
      id: "1",
      profesor: { id: "1", nombre: "Ana", apellido: "García" },
      turno: { nombre: "Mañana", horaInicio: "08:00", horaFin: "12:00" },
      aula: "A-101",
      estadoEntrada: "a_tiempo",
      estadoSalida: "a_tiempo",
      horaEntrada: "07:55",
      horaSalida: "12:05",
      tieneInconsistencia: false,
    },
    {
      id: "2",
      profesor: { id: "2", nombre: "Carlos", apellido: "Martínez" },
      turno: { nombre: "Mañana", horaInicio: "08:30", horaFin: "12:30" },
      aula: "B-203",
      estadoEntrada: "a_tiempo",
      estadoSalida: "pendiente",
      horaEntrada: "08:20",
      horaSalida: null,
      tieneInconsistencia: false,
    },
    {
      id: "3",
      profesor: { id: "3", nombre: "Laura", apellido: "Rodríguez" },
      turno: { nombre: "Mañana", horaInicio: "08:30", horaFin: "12:30" },
      aula: "C-105",
      estadoEntrada: "tarde",
      estadoSalida: "pendiente",
      horaEntrada: "09:10",
      horaSalida: null,
      tieneInconsistencia: true,
    },
    {
      id: "4",
      profesor: { id: "4", nombre: "Miguel", apellido: "López" },
      turno: { nombre: "Mañana", horaInicio: "08:00", horaFin: "12:00" },
      aula: "D-302",
      estadoEntrada: "ausente",
      estadoSalida: "ausente",
      horaEntrada: null,
      horaSalida: null,
      tieneInconsistencia: true,
    },
  ];

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "a_tiempo":
        return <Badge variant="success">A tiempo</Badge>;
      case "tarde":
        return <Badge variant="warning">Tarde</Badge>;
      case "temprano":
        return <Badge variant="warning">Temprano</Badge>;
      case "ausente":
        return <Badge variant="error">Ausente</Badge>;
      case "pendiente":
        return <Badge>Pendiente</Badge>;
      default:
        return <Badge>Pendiente</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            Gestión de Asistencias
          </h1>
          <p className="text-secondary-600">
            Control diario de asistencias de profesores
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button>
            <CheckCircle2 size={16} className="mr-2" />
            Registro de asistencia
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter size={20} className="mr-2 text-secondary-600" />
            Filtros de búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar size={18} className="text-secondary-400" />
              <Input
                type="date"
                value={filtro.fecha}
                onChange={(e) =>
                  setFiltro({ ...filtro, fecha: e.target.value })
                }
              />
            </div>

            <Select
              options={profesoresOptions}
              value={filtro.profesor}
              onChange={(e) =>
                setFiltro({ ...filtro, profesor: e.target.value })
              }
              label="Profesor"
            />

            <Select
              options={aulasOptions}
              value={filtro.aula}
              onChange={(e) => setFiltro({ ...filtro, aula: e.target.value })}
              label="Aula"
            />

            <Select
              options={turnosOptions}
              value={filtro.turno}
              onChange={(e) => setFiltro({ ...filtro, turno: e.target.value })}
              label="Turno"
            />

            <Select
              options={estadosOptions}
              value={filtro.estado}
              onChange={(e) => setFiltro({ ...filtro, estado: e.target.value })}
              label="Estado"
            />
          </div>

          <div className="flex justify-end mt-4">
            <Button variant="outline" className="mr-2">
              Limpiar
            </Button>
            <Button>
              <Search size={16} className="mr-2" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock size={20} className="mr-2 text-primary-600" />
              Registro de asistencias
            </div>
            <div className="text-sm font-normal text-secondary-500">
              {formatDate(new Date(), "EEEE, d MMMM yyyy")}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-secondary-200">
                  <th className="py-3 px-4 text-left text-sm font-medium text-secondary-500">
                    Profesor
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-secondary-500">
                    Turno
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-secondary-500">
                    Aula
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-secondary-500">
                    Entrada
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-secondary-500">
                    Salida
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-secondary-500">
                    Estado
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-secondary-500">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {asistencias.map((asistencia) => (
                  <tr
                    key={asistencia.id}
                    className="border-b border-secondary-100 hover:bg-secondary-50"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Avatar
                          name={asistencia.profesor.nombre}
                          surname={asistencia.profesor.apellido}
                          size="sm"
                        />
                        <span className="ml-2 font-medium">
                          {asistencia.profesor.nombre}{" "}
                          {asistencia.profesor.apellido}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">
                          {asistencia.turno.nombre}
                        </div>
                        <div className="text-xs text-secondary-500">
                          {asistencia.turno.horaInicio} -{" "}
                          {asistencia.turno.horaFin}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary">{asistencia.aula}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {getEstadoBadge(asistencia.estadoEntrada)}
                        <span className="ml-2 text-secondary-700">
                          {asistencia.horaEntrada ?? "--:--"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {getEstadoBadge(asistencia.estadoSalida)}
                        <span className="ml-2 text-secondary-700">
                          {asistencia.horaSalida ?? "--:--"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {asistencia.tieneInconsistencia ? (
                        <div className="flex items-center text-error-600">
                          <AlertTriangle size={16} className="mr-1" />
                          <span>Inconsistencia</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-success-600">
                          <CheckCircle2 size={16} className="mr-1" />
                          <span>Correcto</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary-600 hover:text-primary-700"
                        >
                          Editar
                        </Button>
                        {asistencia.estadoEntrada === "pendiente" && (
                          <Button size="sm" variant="success">
                            Entrada
                          </Button>
                        )}
                        {asistencia.estadoEntrada !== "pendiente" &&
                          asistencia.estadoSalida === "pendiente" && (
                            <Button size="sm" variant="warning">
                              Salida
                            </Button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-secondary-500">
              Mostrando 4 de 4 registros
            </div>
            <div className="flex space-x-1">
              <Button variant="outline" size="sm" disabled>
                Anterior
              </Button>
              <Button variant="outline" size="sm" disabled>
                Siguiente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AsistenciasPage;
