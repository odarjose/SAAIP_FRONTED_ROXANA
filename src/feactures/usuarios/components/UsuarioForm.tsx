import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../shared/components/Card";
import { Button } from "../../../shared/components/Button";
import { Input } from "../../../shared/components/Input";


import { Usuario, RegisterDTO } from "../interface/InterfaceUsuario";
import { useUsuarioStore } from "../store/storeUsuario";
import { 
 
  Save, 
  X, 
  UserPlus,
  Edit
} from 'lucide-react';

interface UsuarioFormProps {
  usuario?: Usuario | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const UsuarioForm: React.FC<UsuarioFormProps> = ({ 
  usuario, 
  onClose, 
  onSuccess 
}) => {
  const { createUsuario, updateUsuario, loading, error, clearError } = useUsuarioStore();
  
  const [formData, setFormData] = useState<RegisterDTO>({
    nombres: '',
    apellidos: '',
    dni: '',
    telefono: '',
    direccion: '',
    fecha_nacimiento: '',
    contraseña: '',
    e_mail: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);




  useEffect(() => {
    if (usuario) {
      setFormData({
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        dni: usuario.dni,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        fecha_nacimiento: usuario.fecha_nacimiento,
        contraseña: '', // No mostrar contraseña actual
        e_mail: usuario.e_mail
      });
    }
  }, [usuario]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombres.trim()) {
      newErrors.nombres = 'Los nombres son requeridos';
    }

    if (!formData.apellidos.trim()) {
      newErrors.apellidos = 'Los apellidos son requeridos';
    }

    if (!formData.dni.trim()) {
      newErrors.dni = 'El DNI es requerido';
    } else if (formData.dni.length < 8) {
      newErrors.dni = 'El DNI debe tener al menos 8 caracteres';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    }

    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida';
    }

    if (!formData.fecha_nacimiento) {
      newErrors.fecha_nacimiento = 'La fecha de nacimiento es requerida';
    }

    if (!usuario && !formData.contraseña) {
      newErrors.contraseña = 'La contraseña es requerida';
    } else if (formData.contraseña && formData.contraseña.length < 6) {
      newErrors.contraseña = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.e_mail.trim()) {
      newErrors.e_mail = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.e_mail)) {
      newErrors.e_mail = 'El email no es válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof RegisterDTO, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    try {
      if (usuario) {
        // Actualizar usuario (sin contraseña si está vacía)
        const updateData = { ...formData };
        if (!updateData.contraseña) {
          const { contraseña, ...dataWithoutPassword } = updateData;
          await updateUsuario(usuario.id!, dataWithoutPassword);
        } else {
          await updateUsuario(usuario.id!, updateData);
        }
      } else {
        // Crear nuevo usuario
        await createUsuario(formData);
      }
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
    }
  };

  const handleCancel = () => {
    clearError();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            {usuario ? (
              <>
                <Edit size={20} className="mr-2 text-primary-600" />
                Editar Usuario
              </>
            ) : (
              <>
                <UserPlus size={20} className="mr-2 text-primary-600" />
                Nuevo Usuario
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombres y Apellidos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Nombres *
                </label>
                <Input
                  
                  placeholder="Ingrese los nombres"
                  value={formData.nombres}
                  onChange={(e) => handleInputChange('nombres', e.target.value)}
                  error={errors.nombres}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Apellidos *
                </label>
                <Input
                  
                  placeholder="Ingrese los apellidos"
                  value={formData.apellidos}
                  onChange={(e) => handleInputChange('apellidos', e.target.value)}
                  error={errors.apellidos}
                />
              </div>
            </div>

            {/* DNI y Teléfono */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  DNI *
                </label>
                <Input
                  placeholder="Ingrese el DNI"
                  value={formData.dni}
                  onChange={(e) => handleInputChange('dni', e.target.value)}
                  error={errors.dni}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Teléfono *
                </label>
                <Input
                  
                  placeholder="Ingrese el teléfono"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange('telefono', e.target.value)}
                  error={errors.telefono}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Email *
              </label>
              <Input
                
                type="email"
                placeholder="Ingrese el email"
                value={formData.e_mail}
                onChange={(e) => handleInputChange('e_mail', e.target.value)}
                error={errors.e_mail}
              />
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Dirección *
              </label>
              <Input
                
                placeholder="Ingrese la dirección"
                value={formData.direccion}
                onChange={(e) => handleInputChange('direccion', e.target.value)}
                error={errors.direccion}
              />
            </div>

            {/* Fecha de Nacimiento */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Fecha de Nacimiento *
              </label>
              <Input
                
                type="date"
                value={formData.fecha_nacimiento}
                onChange={(e) => handleInputChange('fecha_nacimiento', e.target.value)}
                error={errors.fecha_nacimiento}
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Contraseña {!usuario && '*'}
              </label>
              <div className="relative">
                <Input

                  type={showPassword ? 'text' : 'password'}
                  placeholder={usuario ? 'Dejar vacío para mantener la actual' : 'Ingrese la contraseña'}
                  value={formData.contraseña}
                  onChange={(e) => handleInputChange('contraseña', e.target.value)}
                  error={errors.contraseña}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {usuario && (
                <p className="text-xs text-secondary-500 mt-1">
                  Deja vacío para mantener la contraseña actual
                </p>
              )}
            </div>

            {/* Error general */}
            {error && (
              <div className="bg-error-50 border border-error-200 rounded-lg p-3">
                <p className="text-sm text-error-700">{error}</p>
              </div>
            )}

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                <X size={16} className="mr-2" />
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                ) : (
                  <Save size={16} className="mr-2" />
                )}
                {usuario ? 'Actualizar' : 'Crear'} Usuario
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsuarioForm; 