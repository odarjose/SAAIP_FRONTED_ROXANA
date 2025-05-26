import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../shared/components/Card";
import { Button } from "../../../shared/components/Button";
import { Input } from "../../../shared/components/Input";
import { Badge } from "../../../shared/components/Badge";
import { 
  Calendar,
  Plus,
  Search,
  Pencil,
  Trash,
  Settings,
  Clock,
  Users
} from 'lucide-react';
import { getDiasSemanaString } from '../../../shared/lib/Utils';

const TurnosPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Datos de ejemplo para turnos
  const turnos = [
    {
      id: '1',
      nombre: 'Mañana',
      horaInicio: '08:00',
      horaFin: '12:00',
      diasSemana: [1, 2, 3, 4, 5], // Lunes a Viernes
      color: '#3B82F6', // primary-500
      profesoresAsignados: 12,
      estado: 'activo',
    },
    {
      id: '2',
      nombre: 'Tarde',
      horaInicio: '14:00',
      horaFin: '18:00',
      diasSemana: [1, 2, 3, 4, 5],
      color: '#10B981', // success-500
      profesoresAsignados: 8,
      estado: 'activo',
    },
    {
      id: '3',
      nombre: 'Noche',
      horaInicio: '18:30',
      horaFin: '22:30',
      diasSemana: [1, 2, 3, 4, 5],
      color: '#6B7280', // secondary-500
      profesoresAsignados: 6,
      estado: 'activo',
    },
    {
      id: '4',
      nombre: 'Fin de Semana',
      horaInicio: '09:00',
      horaFin: '13:00',
      diasSemana: [6], // Sábado
      color: '#F59E0B', // warning-500
      profesoresAsignados: 4,
      estado: 'inactivo',
    },
  ];

  const getEstadoBadge = (estado: string) => {
    return estado === 'activo' 
      ? <Badge variant="success">Activo</Badge>
      : <Badge variant="secondary">Inactivo</Badge>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Gestión de Turnos</h1>
          <p className="text-secondary-600">Administración de horarios y turnos</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button>
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
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Settings size={16} className="mr-1" />
                Filtrar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {turnos.map((turno) => (
              <Card key={turno.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-2 w-full" style={{ backgroundColor: turno.color }} />
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{turno.nombre}</h3>
                      <div className="flex items-center text-sm text-secondary-600">
                        <Clock size={16} className="mr-2" />
                        {turno.horaInicio} - {turno.horaFin}
                      </div>
                    </div>
                    {getEstadoBadge(turno.estado)}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-secondary-500 mb-1">Días:</p>
                      <div className="flex items-center text-sm text-secondary-700">
                        <Calendar size={16} className="mr-2" />
                        {getDiasSemanaString(turno.diasSemana)}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-secondary-500 mb-1">Profesores asignados:</p>
                      <div className="flex items-center text-sm text-secondary-700">
                        <Users size={16} className="mr-2" />
                        {turno.profesoresAsignados} profesores
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-4 pt-3 border-t border-secondary-200">
                    <Button variant="ghost" size="sm" className="text-primary-600">
                      <Pencil size={14} className="mr-1" />
                      Editar
                    </Button>
                    <Button variant="ghost" size="sm" className="text-error-600">
                      <Trash size={14} className="mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TurnosPage;