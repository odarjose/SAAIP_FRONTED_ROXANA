import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../shared/components/Card";
import { Button } from "../../../shared/components/Button";
import { Input } from "../../../shared/components/Input";
import { useAuth } from "../hooks/useAuth";
import { RegisterDTO } from "../interface/InterfaceUsuario";
import { 

  Eye,
  EyeOff,
  UserPlus,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

interface RegisterFormProps {
  onSuccess?: () => void;
  onLoginClick?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ 
  onSuccess, 
  onLoginClick 
}) => {
  const { register, loading, error, clearError } = useAuth();
  
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

    if (!formData.contraseña) {
      newErrors.contraseña = 'La contraseña es requerida';
    } else if (formData.contraseña.length < 6) {
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
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    try {
      await register(formData);
      onSuccess?.();
    } catch (error) {
      console.error('Error en registro:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <UserPlus size={32} className="text-primary-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-secondary-900">
            Registro de Usuario
          </CardTitle>
          <p className="text-secondary-600 mt-2">
            Completa el formulario para crear tu cuenta
          </p>
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
                autoComplete="email"
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
                Contraseña *
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ingrese la contraseña"
                  value={formData.contraseña}
                  onChange={(e) => handleInputChange('contraseña', e.target.value)}
                  error={errors.contraseña}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-xs text-secondary-500 mt-1">
                Mínimo 6 caracteres
              </p>
            </div>

            {/* Error general */}
            {error && (
              <div className="bg-error-50 border border-error-200 rounded-lg p-3">
                <div className="flex items-center">
                  <AlertCircle size={16} className="text-error-600 mr-2" />
                  <p className="text-sm text-error-700">{error}</p>
                </div>
              </div>
            )}

            {/* Botones */}
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
              {onLoginClick && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onLoginClick}
                  className="w-full sm:w-auto"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Volver al Login
                </Button>
              )}
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={loading}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                ) : (
                  <UserPlus size={16} className="mr-2" />
                )}
                {loading ? 'Registrando...' : 'Registrarse'}
              </Button>
            </div>

            {/* Información adicional */}
            <div className="text-center">
              <p className="text-xs text-secondary-500">
                Al registrarte, aceptas nuestros términos y condiciones de uso.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterForm; 