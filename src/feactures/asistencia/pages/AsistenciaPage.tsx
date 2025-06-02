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
import { Badge } from "../../../shared/components/Badge";
import { Avatar } from "../../../shared/components/Avatar";
import { useAsistenciaStore } from "../store/storeAsistencia";
import { useDocenteStore } from "../../docentes/store/StoreDocente";
import { useTurnoStore } from "../../turnos/store/storeTurno";
import { RegisterAsistencia, AsistenciaResponseDTO } from "../types/Asistencia";
import {
  Calendar,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  Eye,
  XCircle,
} from "lucide-react";
import { formatDate } from "../../../shared/lib/Utils";
import { Modal } from "../../../shared/components/Modal";

const AsistenciasPage: React.FC = () => {
  const {
    asistencias,
    fetchAsistencias,
    createAsistencia,
  } = useAsistenciaStore();

  const {
    profesores,
    fetchProfesores,
  } = useDocenteStore();

  const {
    turnos,
    fetchTurnos,
  } = useTurnoStore();

  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAsistencia, setSelectedAsistencia] = useState<AsistenciaResponseDTO | null>(null);
  const [filtro, setFiltro] = useState({
    fecha: formatDate(new Date(), "yyyy-MM-dd"),
    profesor: "",
    estado: "",
  });

  const [newAsistencia, setNewAsistencia] = useState<RegisterAsistencia>({
    id_docente: 0,
    fecha: formatDate(new Date(), "yyyy-MM-dd"),
    hora_entrada: "",
    hora_salida: "",
    tiempo_uso: 0,
    estado: "REGISTRADO",
  });

  useEffect(() => {
    fetchAsistencias();
    fetchProfesores();
    fetchTurnos();
  }, [fetchAsistencias, fetchProfesores, fetchTurnos]);

  // Filtrar docentes que tienen turno activo
  const docentesConTurnoActivo = profesores.filter(docente => {
    const turnoActivo = turnos.find(turno => 
      turno.idDocente === docente.id_docente && 
      turno.estado === true
    );
    return turnoActivo !== undefined;
  });

  // Opciones de selección solo para docentes con turno activo
  const profesoresOptions: SelectOption[] = docentesConTurnoActivo.map((docente) => ({
    value: docente.id_docente.toString(),
    label: `${docente.nombres} ${docente.apellidos} - ${docente.dni}`,
  }));

  const estadosOptions: SelectOption[] = [
    { value: "", label: "Todos los estados" },
    { value: "REGISTRADO", label: "Registrado" },
    { value: "INASISTENCIA", label: "Inasistencia" }
  ];

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add validation for docente ID
    if (!newAsistencia.id_docente || newAsistencia.id_docente === 0) {
      alert("Por favor seleccione un profesor");
      return;
    }

    // Validar que el docente tenga un turno activo
    const turnoActivo = turnos.find(turno => 
      turno.idDocente === newAsistencia.id_docente && 
      turno.estado === true
    );

    if (!turnoActivo) {
      alert("El profesor seleccionado no tiene un turno activo");
      return;
    }

    try {
      // Si el estado es INASISTENCIA, establecer tiempo_uso a 0
      if (newAsistencia.estado === "INASISTENCIA") {
        newAsistencia.tiempo_uso = 0;
      } else {
        // Calcular tiempo utilizado en minutos solo si no es inasistencia
        if (newAsistencia.hora_entrada && newAsistencia.hora_salida) {
          const [entradaHora, entradaMin] = newAsistencia.hora_entrada.split(':').map(Number);
          const [salidaHora, salidaMin] = newAsistencia.hora_salida.split(':').map(Number);
          
          // Convertir a minutos totales
          const entradaTotalMin = entradaHora * 60 + entradaMin;
          const salidaTotalMin = salidaHora * 60 + salidaMin;
          
          // Calcular diferencia
          let diffMins = salidaTotalMin - entradaTotalMin;
          
          // Si la hora de salida es menor que la de entrada, asumimos que es al día siguiente
          if (diffMins < 0) {
            diffMins += 24 * 60; // Agregar 24 horas en minutos
          }
          
          newAsistencia.tiempo_uso = diffMins;
        }
      }

      await createAsistencia(newAsistencia);
      setShowRegisterForm(false);
      setNewAsistencia({
        id_docente: 0,
        fecha: formatDate(new Date(), "yyyy-MM-dd"),
        hora_entrada: "",
        hora_salida: "",
        tiempo_uso: 0,
        estado: "REGISTRADO",
      });
    } catch (error) {
      console.error("Error al registrar asistencia:", error);
    }
  };

  const getEstadoBadge = (estado: string) => {
    return estado === "REGISTRADO" ? (
      <Badge variant="success">Registrado</Badge>
    ) : (
      <Badge variant="error">Inasistencia</Badge>
    )
  }

  const handleViewDetails = (asistencia: AsistenciaResponseDTO) => {
    setSelectedAsistencia(asistencia);
    setShowDetailModal(true);
  };

  const getCurrentTurno = (docenteId: number) => {
    return turnos.find(turno => turno.idDocente === docenteId && turno.estado);
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
          <Button onClick={() => setShowRegisterForm(true)}>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              options={estadosOptions}
              value={filtro.estado}
              onChange={(e) => setFiltro({ ...filtro, estado: e.target.value })}
              label="Estado"
            />
          </div>

          <div className="flex justify-end mt-4">
            <Button variant="outline" className="mr-2" onClick={() => setFiltro({
              fecha: formatDate(new Date(), "yyyy-MM-dd"),
              profesor: "",
              estado: "",
            })}>
              Limpiar
            </Button>
            <Button onClick={() => fetchAsistencias()}>
              <Search size={16} className="mr-2" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={showRegisterForm}
        onClose={() => setShowRegisterForm(false)}
        title="Registro de Nueva Asistencia"
      >
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              options={profesoresOptions}
              value={newAsistencia.id_docente.toString()}
              onChange={(e) =>
                setNewAsistencia({
                  ...newAsistencia,
                  id_docente: parseInt(e.target.value) || 0,
                })
              }
              label="Profesor"
              required
            />
            <div className="flex items-center space-x-2">
              <Calendar size={18} className="text-secondary-400" />
              <Input
                type="date"
                value={newAsistencia.fecha}
                onChange={(e) =>
                  setNewAsistencia({
                    ...newAsistencia,
                    fecha: e.target.value,
                  })
                }
                required
              />
            </div>
            <Input
              type="time"
              value={newAsistencia.hora_entrada}
              onChange={(e) =>
                setNewAsistencia({
                  ...newAsistencia,
                  hora_entrada: e.target.value,
                })
              }
              label="Hora de Entrada"
              required
            />
            <Input
              type="time"
              value={newAsistencia.hora_salida}
              onChange={(e) =>
                setNewAsistencia({
                  ...newAsistencia,
                  hora_salida: e.target.value,
                })
              }
              label="Hora de Salida"
              required
            />
            <div className="md:col-span-2">
              <Select
                options={[
                  { value: "REGISTRADO", label: "Registrado" },
                  { value: "INASISTENCIA", label: "Inasistencia" }
                ]}
                value={newAsistencia.estado}
                onChange={(e) =>
                  setNewAsistencia({
                    ...newAsistencia,
                    estado: e.target.value,
                  })
                }
                label="Estado"
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowRegisterForm(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Registrar Asistencia</Button>
          </div>
        </form>
      </Modal>

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
                    Fecha
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-secondary-500">
                    Hora Entrada
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-secondary-500">
                    Hora Salida
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-secondary-500">
                    Tiempo Utilizado
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
                    key={`${asistencia.idDocenteTurno}-${asistencia.fecha}-${asistencia.hora_entrada}`}
                    className="border-b border-secondary-100 hover:bg-secondary-50"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <Avatar
                          src={`https://ui-avatars.com/api/?name=${asistencia.usuario_nombres}+${asistencia.usuario_apellidos}`}
                          alt={`${asistencia.usuario_nombres} ${asistencia.usuario_apellidos}`}
                        />
                        <div>
                          <div className="font-medium">
                            {asistencia.usuario_nombres} {asistencia.usuario_apellidos}
                          </div>
                          <div className="text-sm text-secondary-500">
                            {asistencia.usuario_dni}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{asistencia.fecha}</td>
                    <td className="py-3 px-4">{asistencia.hora_entrada}</td>
                    <td className="py-3 px-4">{asistencia.hora_salida}</td>
                    <td className="py-3 px-4">{asistencia.tiempo_uso}</td>
                    <td className="py-3 px-4">
                      {getEstadoBadge(asistencia.estado)}
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(asistencia)}
                      >
                        <Eye size={18} className="text-primary-600" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Detalles */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Detalles de la Asistencia"
      >
        {selectedAsistencia && (
          <div className="space-y-4">
            {/* Header con información básica */}
            <div className="flex items-center space-x-4 pb-4 border-b border-secondary-200">
              <Avatar
                src={`https://ui-avatars.com/api/?name=${selectedAsistencia.usuario_nombres}+${selectedAsistencia.usuario_apellidos}`}
                alt={`${selectedAsistencia.usuario_nombres} ${selectedAsistencia.usuario_apellidos}`}
                size="lg"
              />
              <div>
                <h3 className="text-lg font-semibold">
                  {selectedAsistencia.usuario_nombres} {selectedAsistencia.usuario_apellidos}
                </h3>
                <p className="text-sm text-secondary-500">
                  DNI: {selectedAsistencia.usuario_dni}
                </p>
              </div>
            </div>

            {/* Grid principal de 3 columnas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Columna 1: Información del Docente */}
              <div className="bg-secondary-50 p-3 rounded-lg">
                <h4 className="font-medium mb-2 text-sm text-secondary-700">Información del Docente</h4>
                <div className="space-y-1.5">
                  <p className="text-sm">
                    <span className="font-medium">Tipo de Docencia:</span>
                    <br />
                    {selectedAsistencia.docente_tipo_docencia}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Tipo de Contrato:</span>
                    <br />
                    {selectedAsistencia.docente_tipo_contrato}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Contrato:</span>
                    <br />
                    {selectedAsistencia.docente_fecha_inicio_contrato} - {selectedAsistencia.docente_fecha_fin_contrato}
                  </p>
                </div>
              </div>

              {/* Columna 2: Turno Asignado */}
              <div className="bg-secondary-50 p-3 rounded-lg">
                <h4 className="font-medium mb-2 text-sm text-secondary-700">Turno Asignado</h4>
                {(() => {
                  const currentTurno = getCurrentTurno(selectedAsistencia.idDocente);
                  return currentTurno ? (
                    <div className="space-y-1.5">
                      <p className="text-sm">
                        <span className="font-medium">Tipo:</span>
                        <br />
                        {currentTurno.tipo_turno}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Horario:</span>
                        <br />
                        {currentTurno.hora_inicio} - {currentTurno.hora_fin}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Aula:</span>
                        <br />
                        {currentTurno.grado}° {currentTurno.seccion}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Estado:</span>
                        <br />
                        <span className={`inline-flex items-center ${currentTurno.estado ? "text-green-600" : "text-red-600"}`}>
                          {currentTurno.estado ? (
                            <CheckCircle2 size={14} className="mr-1" />
                          ) : (
                            <XCircle size={14} className="mr-1" />
                          )}
                          {currentTurno.estado ? "Activo" : "Inactivo"}
                        </span>
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-secondary-500">No tiene turno asignado</p>
                  );
                })()}
              </div>

              {/* Columna 3: Detalles de Asistencia */}
              <div className="bg-secondary-50 p-3 rounded-lg">
                <h4 className="font-medium mb-2 text-sm text-secondary-700">Detalles de Asistencia</h4>
                <div className="space-y-1.5">
                  <p className="text-sm">
                    <span className="font-medium">Fecha:</span>
                    <br />
                    {selectedAsistencia.fecha}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Entrada:</span>
                    <br />
                    {selectedAsistencia.hora_entrada}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Salida:</span>
                    <br />
                    {selectedAsistencia.hora_salida}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Tiempo:</span>
                    <br />
                    {selectedAsistencia.tiempo_uso} minutos
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Estado:</span>
                    <br />
                    {getEstadoBadge(selectedAsistencia.estado)}
                  </p>
                </div>
              </div>
            </div>

            {/* Información de Contacto */}
            <div className="bg-secondary-50 p-3 rounded-lg">
              <h4 className="font-medium mb-2 text-sm text-secondary-700">Información de Contacto</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <p className="text-sm">
                  <span className="font-medium">Email:</span>
                  <br />
                  {selectedAsistencia.usuario_e_mail}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Teléfono:</span>
                  <br />
                  {selectedAsistencia.usuario_telefono}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Dirección:</span>
                  <br />
                  {selectedAsistencia.usuario_direccion}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AsistenciasPage;