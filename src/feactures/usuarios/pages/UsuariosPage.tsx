import React, { useState, useEffect } from 'react';
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
  Users, 
  Search, 
  Pencil, 

  UserPlus,

  Mail,
  Phone,

  RefreshCw,
  Filter
} from 'lucide-react';
import { formatDate } from '../../../shared/lib/Utils';
import { ReportButton } from "../../../shared/components/ReportButton";
import { generatePDFReport } from "../../../shared/lib/reportUtils";
import { useUsuarioStore } from '../store/storeUsuario';
import { Usuario } from '../interface/InterfaceUsuario';
import UsuarioForm from '../components/UsuarioForm';
// TODO: Implementar cuando tengas el endpoint de cambiar contraseña
// import ChangePasswordForm from '../components/ChangePasswordForm';

const UsuariosPage: React.FC = () => {
  const {
    usuarios,
    loading,
    error,
    filtros,
    fetchUsuarios,
    // TODO: Implementar cuando tengas los endpoints correspondientes
    // deleteUsuario,
    // toggleEstadoUsuario,
    setFiltros,
    clearError
  } = useUsuarioStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [usuarioToEdit, setUsuarioToEdit] = useState<Usuario | null>(null);
  // TODO: Implementar cuando tengas los endpoints correspondientes
  // const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  // const [showPasswordForm, setShowPasswordForm] = useState<{id: number, name: string} | null>(null);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  // Filtrar usuarios localmente
  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = !searchTerm || 
      usuario.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.e_mail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.dni.includes(searchTerm);
    
    const matchesEstado = !filtros.estado || usuario.estado === filtros.estado;
    const matchesRol = !filtros.rol || usuario.rol === filtros.rol;

    return matchesSearch && matchesEstado && matchesRol;
  });

  const rolesOptions: SelectOption[] = [
    { value: '', label: 'Todos los roles' },
    { value: 'admin', label: 'Administrador' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'profesor', label: 'Profesor' },
    { value: 'usuario', label: 'Usuario' }
  ];

  const estadosOptions: SelectOption[] = [
    { value: '', label: 'Todos los estados' },
    { value: 'activo', label: 'Activo' },
    { value: 'inactivo', label: 'Inactivo' }
  ];

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleFiltroChange = (campo: keyof typeof filtros, valor: string) => {
    setFiltros({ ...filtros, [campo]: valor || undefined });
  };

  const handleGenerarReporte = () => {
    const headers = [
      "ID",
      "Nombres",
      "Apellidos",
      "DNI",
      "Email",
      "Teléfono",
      "Dirección",
      "Fecha Nacimiento",
      "Estado",
      "Rol"
    ];

    const reportData = filteredUsuarios.map(usuario => ({
      id: usuario.id?.toString() || '',
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      dni: usuario.dni,
      email: usuario.e_mail,
      telefono: usuario.telefono,
      direccion: usuario.direccion,
      fecha_nacimiento: formatDate(new Date(usuario.fecha_nacimiento), 'dd/MM/yyyy'),
      estado: usuario.estado ? usuario.estado.charAt(0).toUpperCase() + usuario.estado.slice(1) : 'N/A',
      rol: usuario.rol ? usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1) : 'N/A'
    }));

    generatePDFReport({
      title: "Reporte de Usuarios",
      headers,
      data: reportData,
      filters: {
        Búsqueda: searchTerm || '',
        Estado: filtros.estado || '',
        Rol: filtros.rol || ''
      }
    });
  };

  const handleEdit = (usuario: Usuario) => {
    setUsuarioToEdit(usuario);
    setShowForm(true);
  };

  // TODO: Implementar cuando tengas el endpoint de eliminar
  // const handleDelete = async (id: number) => {
  //   try {
  //     await deleteUsuario(id);
  //     setShowDeleteConfirm(null);
  //   } catch (error) {
  //     console.error('Error al eliminar usuario:', error);
  //   }
  // };

  // TODO: Implementar cuando tengas el endpoint de toggle estado
  // const handleToggleEstado = async (id: number) => {
  //   try {
  //     await toggleEstadoUsuario(id);
  //   } catch (error) {
  //     console.error('Error al cambiar estado:', error);
  //   }
  // };

  const handleFormSuccess = () => {
    fetchUsuarios();
    setUsuarioToEdit(null);
  };

  const getRolBadge = (rol?: string) => {
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

  const getEstadoBadge = (estado?: string) => {
    return estado === 'activo' 
      ? <Badge variant="success">Activo</Badge>
      : <Badge variant="secondary">Inactivo</Badge>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Gestión de Usuarios</h1>
          <p className="text-secondary-600">Administración de usuarios del sistema</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <ReportButton onClick={handleGenerarReporte} />
          <Button onClick={() => setShowForm(true)}>
            <UserPlus size={16} className="mr-2" />
            Nuevo Usuario
          </Button>
        </div>
      </div>

     
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter size={20} className="mr-2 text-secondary-600" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" size={18} />
              <Input
                placeholder="Buscar usuario..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <Select
              options={estadosOptions}
              value={filtros.estado || ''}
              onChange={(e) => handleFiltroChange('estado', e.target.value)}
            />
            <Select
              options={rolesOptions}
              value={filtros.rol || ''}
              onChange={(e) => handleFiltroChange('rol', e.target.value)}
            />
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setFiltros({});
              }}
            >
              <RefreshCw size={16} className="mr-2" />
              Limpiar
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
              <Button variant="outline" size="sm" onClick={clearError} className="mt-2">
                Cerrar
              </Button>
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
              <span className="ml-2 text-secondary-600">Cargando usuarios...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Usuarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Users size={20} className="mr-2 text-primary-600" />
              Listado de Usuarios
            </span>
            <span className="text-sm text-secondary-500">
              {filteredUsuarios.length} de {usuarios.length} usuarios
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary-500">Usuario</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary-500">Contacto</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary-500">Rol</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary-500">Estado</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary-500">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsuarios.map((usuario) => (
                  <tr key={usuario.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Avatar 
                          name={usuario.nombres} 
                          surname={usuario.apellidos} 
                          size="sm"
                        />
                        <div className="ml-3">
                          <div className="font-medium">
                            {usuario.nombres} {usuario.apellidos}
                          </div>
                          <div className="text-sm text-secondary-500">
                            DNI: {usuario.dni}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail size={14} className="text-secondary-400 mr-2" />
                          {usuario.e_mail}
                        </div>
                        <div className="flex items-center text-sm text-secondary-500">
                          <Phone size={14} className="text-secondary-400 mr-2" />
                          {usuario.telefono}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {getRolBadge(usuario.rol)}
                    </td>
                    <td className="py-3 px-4">
                      {getEstadoBadge(usuario.estado)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-primary-600"
                          onClick={() => handleEdit(usuario)}
                        >
                          <Pencil size={16} className="mr-1" />
                          Editar
                        </Button>
                        
                          
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsuarios.length === 0 && !loading && (
            <div className="text-center py-8">
              <Users size={48} className="mx-auto mb-4 text-secondary-400" />
              <h3 className="text-lg font-medium mb-2 text-secondary-500">No se encontraron usuarios</h3>
              <p className="text-secondary-400">
                {searchTerm || Object.keys(filtros).some(key => filtros[key as keyof typeof filtros]) 
                  ? 'Intenta ajustar los filtros de búsqueda' 
                  : 'No hay usuarios registrados en el sistema'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Formulario Modal */}
      {showForm && (
        <UsuarioForm
          usuario={usuarioToEdit}
          onClose={() => {
            setShowForm(false);
            setUsuarioToEdit(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* TODO: Implementar cuando tengas los endpoints correspondientes */}
      {/* 
      {/* Formulario de Cambio de Contraseña */}
      {/* {showPasswordForm && (
        <ChangePasswordForm
          userId={showPasswordForm.id}
          userName={showPasswordForm.name}
          onClose={() => setShowPasswordForm(null)}
          onSuccess={() => {
            // Opcional: mostrar mensaje de éxito
            console.log('Contraseña cambiada exitosamente');
          }}
        />
      )}

      {/* Confirmación de Eliminación */}
      {/* {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-error-600">Confirmar Eliminación</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                ¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="error"
                  onClick={() => handleDelete(showDeleteConfirm)}
                  disabled={loading}
                >
                  {loading ? (
                    <RefreshCw size={16} className="animate-spin mr-2" />
                  ) : (
                    <Trash size={16} className="mr-2" />
                  )}
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )} */}
    </div>
  );
};

export default UsuariosPage;