import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../shared/components/Card";
import { Button } from "../../../shared/components/Button";
import { Input } from "../../../shared/components/Input";
import {
  Calendar,
  Plus,
  Search,
  Pencil,
  Eye,
  Clock,
  User,
  FileText,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { ReportButton } from "../../../shared/components/ReportButton";
import { generatePDFReport } from "../../../shared/lib/reportUtils";

import { useTurnoStore } from "../store/storeTurno";
import { TurnoFormModal } from "./TurnoFormPage";
import {
  TurnoResponseDTO,
  RegisterTurno,
  PartialTurno,
} from "../interface/InterfaceTurnos";

const TurnosPage: React.FC = () => {
  const {
    turnos,
    fetchTurnos,
    createTurno,
    updateTurno,
    setSearchTerm,
    searchTerm,
  } = useTurnoStore();

  useEffect(() => {
    fetchTurnos();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editandoTurno, setEditandoTurno] = useState<TurnoResponseDTO | null>(
    null
  );
  const [selectedTurno, setSelectedTurno] = useState<TurnoResponseDTO | null>(
    null
  );

  // Filtrado por nombre
  const turnosFiltrados = turnos.filter((turno) =>
    turno.tipo_turno.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Asignar color de franja según el nombre del turno
  const getTurnoColor = (tipo_turno: string) => {
    if (tipo_turno.toLowerCase().includes("mañana")) return "bg-blue-500";
    if (tipo_turno.toLowerCase().includes("tarde")) return "bg-yellow-500";
    return "bg-primary-500";
  };

  const handleOpenNuevo = () => {
    setEditandoTurno(null);
    setIsModalOpen(true);
  };

  const handleEditar = (turno: TurnoResponseDTO) => {
    setEditandoTurno(turno);
    setIsModalOpen(true);
  };

  const handleViewDetails = (turno: TurnoResponseDTO) => {
    setSelectedTurno(turno);
    setIsDetailsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditandoTurno(null);
    setIsModalOpen(false);
  };

  const handleCloseDetailsModal = () => {
    setSelectedTurno(null);
    setIsDetailsModalOpen(false);
  };

  const handleSubmitTurno = async (
    data: RegisterTurno | PartialTurno,
    isEdit?: boolean
  ) => {
    try {
      if (isEdit && editandoTurno) {
        await updateTurno(editandoTurno.idDocenteTurno, data as PartialTurno);
        setIsModalOpen(false);
        return { success: true };
      } else {
        await createTurno(data as RegisterTurno);
        setIsModalOpen(false);
        return { success: true };
      }
    } catch (error) {
      return { success: false, error: "Error al guardar el turno" };
    }
  };

  const handleGenerateReport = () => {
    const headers = [
      "ID",
      "Profesor",
      "Tipo Docencia",
      "Tipo Turno",
      "Hora Inicio",
      "Hora Fin",
      "Grado",
      "Sección",
      "Estado"
    ];

    const reportData = turnosFiltrados.map(turno => ({
      id: turno.idDocenteTurno,
      profesor: `${turno.usuario_nombres} ${turno.usuario_apellidos}`,
      tipo_docencia: turno.docente_tipo_docencia,
      tipo_turno: turno.tipo_turno,
      hora_inicio: turno.hora_inicio,
      hora_fin: turno.hora_fin,
      grado: turno.grado,
      seccion: turno.seccion,
      estado: turno.estado ? 'Activo' : 'Inactivo'
    }));

    generatePDFReport({
      title: "Reporte de Turnos",
      headers,
      data: reportData,
      filters: {
        Búsqueda: searchTerm || ''
      }
    });
  };

  console.log(selectedTurno)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            Gestión de Turnos
          </h1>
          <p className="text-secondary-600">
            Administración de horarios y turnos
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <ReportButton onClick={handleGenerateReport} />
          <Button onClick={handleOpenNuevo}>
            <Plus size={16} className="mr-2" />
            Nuevo Turno
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar size={20} className="mr-2 text-primary-600" />
            Listado de Turnos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div className="relative mb-4 md:mb-0 w-full md:w-64">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"
                size={18}
              />
              <Input
                placeholder="Buscar turno..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {turnosFiltrados.map((turno) => (
              <Card
                key={`turno-${turno.idDocenteTurno}`}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <div
                  className={`h-2 w-full ${getTurnoColor(turno.tipo_turno)}`}
                />
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {turno.usuario_nombres} {turno.usuario_apellidos}
                      </h3>
                      <p className="text-sm text-secondary-600">
                        {turno.docente_tipo_docencia}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-secondary-600">
                      <Clock size={14} className="mr-2" />
                      <span>
                        {turno.tipo_turno} ({turno.hora_inicio} -{" "}
                        {turno.hora_fin})
                      </span>
                    </div>
                    <div className="flex items-center text-secondary-600">
                      <User size={14} className="mr-2" />
                      <span>
                        {turno.grado}° - {turno.seccion}
                      </span>
                    </div>
                    <div className="flex items-center text-secondary-600">
                      {turno.estado ? (
                        <CheckCircle2
                          size={14}
                          className="mr-2 text-green-500"
                        />
                      ) : (
                        <XCircle size={14} className="mr-2 text-red-500" />
                      )}
                      <span>{turno.estado ? "Activo" : "Inactivo"}</span>
                    </div>
                  </div>
                  <div className="flex justify-between mt-4 pt-3 border-t border-secondary-200 gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary-600"
                      onClick={() => handleViewDetails(turno)}
                    >
                      <Eye size={14} className="mr-1" />
                      Ver detalles
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary-600"
                      onClick={() => handleEditar(turno)}
                    >
                      <Pencil size={14} className="mr-1" />
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <TurnoFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTurno}
        turno={editandoTurno}
      />

      {/* Modal de Detalles */}
      {selectedTurno && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center ${
            isDetailsModalOpen ? "block" : "hidden"
          }`}
        >
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-secondary-900">
                Detalles del Turno
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseDetailsModal}
              >
                <XCircle size={20} />
              </Button>
            </div>

            <div className="space-y-6">
              <div className="bg-secondary-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <User size={20} className="mr-2 text-primary-600" />
                  Información Personal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Nombre completo:</span>
                      <br />
                      {selectedTurno.usuario_nombres}{" "}
                      {selectedTurno.usuario_apellidos}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">DNI:</span>
                      <br />
                      {selectedTurno.usuario_dni}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Fecha de nacimiento:</span>
                      <br />
                      {selectedTurno.usuario_fecha_nacimiento}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Email:</span>
                      <br />
                      {selectedTurno.usuario_e_mail}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Teléfono:</span>
                      <br />
                      {selectedTurno.usuario_telefono}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Dirección:</span>
                      <br />
                      {selectedTurno.usuario_direccion}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-secondary-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FileText size={20} className="mr-2 text-primary-600" />
                  Información Profesional
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Tipo de docencia:</span>
                      <br />
                      {selectedTurno.docente_tipo_docencia}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Tipo de contrato:</span>
                      <br />
                      {selectedTurno.docente_tipo_contrato}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Estado del docente:</span>
                      <br />
                      <span
                        className={`inline-flex items-center ${
                          selectedTurno.docente_estado
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {selectedTurno.docente_estado ? (
                          <CheckCircle2 size={16} className="mr-1" />
                        ) : (
                          <XCircle size={16} className="mr-1" />
                        )}
                        {selectedTurno.docente_estado ? "Activo" : "Inactivo"}
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">
                        Fecha inicio contrato:
                      </span>
                      <br />
                      {selectedTurno.docente_fecha_inicio_contrato}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Fecha fin contrato:</span>
                      <br />
                      {selectedTurno.docente_fecha_fin_contrato}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Grado:</span>
                      <br />
                      {selectedTurno.grado}°
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Sección:</span>
                      <br />
                      {selectedTurno.seccion}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-secondary-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Clock size={20} className="mr-2 text-primary-600" />
                  Información del Turno
                </h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Tipo de turno:</span>
                    <br />
                    {selectedTurno.tipo_turno}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Horario:</span>
                    <br />
                    {selectedTurno.hora_inicio} - {selectedTurno.hora_fin}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Fecha de asignación:</span>
                    <br />
                    {selectedTurno.fecha_asignacion}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Estado del turno:</span>
                    <br />
                    <span
                      className={`inline-flex items-center ${
                        selectedTurno.estado ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {selectedTurno.estado ? (
                        <CheckCircle2 size={16} className="mr-1" />
                      ) : (
                        <XCircle size={16} className="mr-1" />
                      )}
                      {selectedTurno.estado ? "Activo" : "Inactivo"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TurnosPage;
