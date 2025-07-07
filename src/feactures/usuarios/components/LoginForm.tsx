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
import { LoginDTO } from "../interface/InterfaceUsuario";
import { 
 
  LogIn, 
  Eye,
  EyeOff,
  User,
  AlertCircle
} from 'lucide-react';

interface LoginFormProps {
  onSuccess?: () => void;
  onRegisterClick?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  onSuccess, 
  onRegisterClick 
}) => {
  const { login, loading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState<LoginDTO>({
    e_mail: '',
    contraseña: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.e_mail.trim()) {
      newErrors.e_mail = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.e_mail)) {
      newErrors.e_mail = 'El email no es válido';
    }

    if (!formData.contraseña) {
      newErrors.contraseña = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof LoginDTO, value: string) => {
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
      await login(formData);
      onSuccess?.();
    } catch (error) {
      console.error('Error en login:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <User size={32} className="text-primary-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-secondary-900">
            Iniciar Sesión
          </CardTitle>
          <p className="text-secondary-600 mt-2">
            Ingresa tus credenciales para acceder al sistema
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                placeholder="Ingrese su email"
                value={formData.e_mail}
                onChange={(e) => handleInputChange('e_mail', e.target.value)}
                error={errors.e_mail}
                autoComplete="email"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ingrese su contraseña"
                  value={formData.contraseña}
                  onChange={(e) => handleInputChange('contraseña', e.target.value)}
                  error={errors.contraseña}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
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

            {/* Botón de Login */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              ) : (
                <LogIn size={16} className="mr-2" />
              )}
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>

            {/* Enlaces adicionales */}
            <div className="text-center space-y-2">
              <button
                type="button"
                className="text-sm text-primary-600 hover:text-primary-700 underline"
                onClick={() => {
                  // Aquí podrías implementar recuperación de contraseña
                  console.log('Recuperar contraseña');
                }}
              >
                ¿Olvidaste tu contraseña?
              </button>
              
              {onRegisterClick && (
                <div className="text-sm text-secondary-600">
                  ¿No tienes cuenta?{' '}
                  <button
                    type="button"
                    className="text-primary-600 hover:text-primary-700 underline"
                    onClick={onRegisterClick}
                  >
                    Regístrate aquí
                  </button>
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm; 