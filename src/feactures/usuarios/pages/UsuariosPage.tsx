import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../shared/components/Card";
import { Button } from "../../../shared/components/Button";
import { Input } from "../../../shared/components/Input";

import { Badge } from "../../../shared/components/Badge";
import { Avatar } from "../../../shared/components/Avatar";
import { 
  Users, 

  Search, 
  Pencil, 
  Trash, 
  Settings,
  UserPlus,
  Shield,
  Mail
} from 'lucide-react';
import { formatDate } from '../../../shared/lib/Utils';
import { ReportButton } from "../../../shared/components/ReportButton";
import { generatePDFReport } from "../../../shared/lib/reportUtils";

const UsuariosPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Datos de ejemplo para usuarios
  const usuarios = [
    {
      id: '1',
      nombre: 'Ana',
      apellido: 'García',
      email: 'ana.garcia@example.com',
      rol: 'admin',
      estado: 'activo',
      ultimoAcceso: new Date(2024, 2, 15, 14, 30),
    },
    {
      id: '2',
      nombre: 'Carlos',
      apellido: 'Martínez',
      email: 'carlos.martinez@example.com',
      rol: 'profesor',
      estado: 'activo',
      ultimoAcceso: new Date(2024, 2, 15, 10, 15),
    },
    {
      id: '3',
      nombre: 'Laura',
      apellido: 'Rodríguez',
      email: 'laura.rodriguez@example.com',
      rol: 'supervisor',
      estado: 'inactivo',
      ultimoAcceso: new Date(2024, 2, 14, 16, 45),
    },
    {
      id: '4',
      nombre: 'Miguel',
      apellido: 'López',
      email: 'miguel.lopez@example.com',
      rol: 'profesor',
      estado: 'activo',
      ultimoAcceso: new Date(2024, 2, 15, 9, 20),
    },
  ];

  const getRolBadge = (rol: string) => {
    switch (rol) {
      case 'admin':
        return <Badge variant="error">Administrador</Badge>;
      case 'supervisor':
        return <Badge variant="warning">Supervisor</Badge>;
      case 'profesor':
        return <Badge variant="primary">Profesor</Badge>;
      default:
        return <Badge>Usuario</Badge>;
    }
  };

  const getEstadoBadge = (estado: string) => {
    return estado === 'activo' 
      ? <Badge variant="success">Activo</Badge>
      : <Badge variant="secondary">Inactivo</Badge>;
  };

  const handleGenerateReport = () => {
    const headers = [
      "ID",
      "Nombre",
      "Apellido",
      "Email",
      "Rol",
      "Estado",
      "Último Acceso"
    ];

    const reportData = usuarios.map(usuario => ({
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      rol: usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1),
      estado: usuario.estado.charAt(0).toUpperCase() + usuario.estado.slice(1),
      ultimo_acceso: formatDate(usuario.ultimoAcceso, 'dd/MM/yyyy HH:mm')
    }));

    generatePDFReport({
      title: "Reporte de Usuarios",
      headers,
      data: reportData,
      filters: {
        Búsqueda: searchTerm || ''
      }
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Gestión de Usuarios</h1>
          <p className="text-secondary-600">Administración de usuarios del sistema</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <ReportButton onClick={handleGenerateReport} />
          <Button>
            <UserPlus size={16} className="mr-2" />
            Nuevo Usuario
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users size={20} className="mr-2 text-primary-600" />
            Listado de Usuarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div className="relative mb-4 md:mb-0 w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" size={18} />
              <Input
                placeholder="Buscar usuario..."
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

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary-500">Usuario</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary-500">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary-500">Rol</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary-500">Estado</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary-500">Último Acceso</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary-500">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Avatar 
                          name={usuario.nombre} 
                          surname={usuario.apellido} 
                          size="sm"
                        />
                        <span className="ml-2 font-medium">
                          {usuario.nombre} {usuario.apellido}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Mail size={16} className="text-secondary-400 mr-2" />
                        {usuario.email}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {getRolBadge(usuario.rol)}
                    </td>
                    <td className="py-3 px-4">
                      {getEstadoBadge(usuario.estado)}
                    </td>
                    <td className="py-3 px-4 text-secondary-600">
                      {formatDate(usuario.ultimoAcceso, 'dd/MM/yyyy HH:mm')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="text-primary-600">
                          <Pencil size={16} className="mr-1" />
                          Editar
                        </Button>
                        <Button variant="ghost" size="sm" className="text-error-600">
                          <Trash size={16} className="mr-1" />
                          Eliminar
                        </Button>
                        <Button variant="ghost" size="sm" className="text-secondary-600">
                          <Shield size={16} className="mr-1" />
                          Permisos
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-secondary-500">
              Mostrando {usuarios.length} de {usuarios.length} usuarios
            </div>
            <div className="flex space-x-2">
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

export default UsuariosPage;