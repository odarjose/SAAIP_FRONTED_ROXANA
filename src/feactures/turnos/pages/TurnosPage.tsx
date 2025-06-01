import React, { useEffect, useState } from 'react';
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
  
  Clock} from 'lucide-react';

import { useTurnoStore } from '../store/storeTurno';
import { TurnoFormModal } from './TurnoFormPage';
import { TurnoResponseDTO, RegisterTurno, PartialTurno } from '../interface/InterfaceTurnos';

const TurnosPage: React.FC = () => {
  const {
    turnos,
    fetchTurnos,
    createTurno,
    updateTurno,
    setSearchTerm,
    searchTerm
  } = useTurnoStore();

  useEffect(() => {
    fetchTurnos();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editandoTurno, setEditandoTurno] = useState<TurnoResponseDTO | null>(null);

  // Filtrado por nombre
  const turnosFiltrados = turnos.filter((turno) =>
    turno.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Asignar color de franja según el nombre del turno
  const getTurnoColor = (nombre: string) => {
    if (nombre.toLowerCase().includes('mañana')) return 'bg-blue-500';
    if (nombre.toLowerCase().includes('tarde')) return 'bg-yellow-500';
    if (nombre.toLowerCase().includes('noche')) return 'bg-gray-700';
    return 'bg-primary-500';
  };

  const handleOpenNuevo = () => {
    setEditandoTurno(null);
    setIsModalOpen(true);
  };
  const handleEditar = (turno: TurnoResponseDTO) => {
    setEditandoTurno(turno);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setEditandoTurno(null);
    setIsModalOpen(false);
  };
  const handleSubmitTurno = async (data: RegisterTurno | PartialTurno, isEdit?: boolean) => {
    try {
      if (isEdit && editandoTurno) {
        await updateTurno(editandoTurno.id_turno, data as PartialTurno);
        setIsModalOpen(false);
        return { success: true };
      } else {
        await createTurno(data as RegisterTurno);
        setIsModalOpen(false);
        return { success: true };
      }
    } catch (error) {
      return { success: false, error: 'Error al guardar el turno' };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Gestión de Turnos</h1>
          <p className="text-secondary-600">Administración de horarios y turnos</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" size={18} />
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
              <Card key={`turno-${turno.id_turno}`} className="overflow-hidden hover:shadow-lg transition-shadow card-hover">
                <div className={`h-2 w-full ${getTurnoColor(turno.nombre)}`} />
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{turno.nombre}</h3>
                      <div className="flex items-center text-sm text-secondary-600">
                        <Clock size={16} className="mr-2" />
                        {turno.hora_inicio} - {turno.hora_fin}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-medium text-secondary-500">Grado: </span>
                      <span className="text-secondary-700">{turno.grado}</span>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-secondary-500">Sección: </span>
                      <span className="text-secondary-700">{turno.seccion}</span>
                    </div>
                  </div>
                  <div className="flex justify-between mt-4 pt-3 border-t border-secondary-200">
                    <Button variant="ghost" size="sm" className="text-primary-600" onClick={() => handleEditar(turno)}>
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
    </div>
  );
};

export default TurnosPage;