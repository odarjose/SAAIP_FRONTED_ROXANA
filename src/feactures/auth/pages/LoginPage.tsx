import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../../shared/components/Button";
import { Input } from "../../../shared/components/Input";
import { Lock, Mail, BookOpen } from "lucide-react";

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simulación de login
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirigir a dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      setError(
        `Credenciales inválidas. Por favor intente nuevamente: ${String(error)}`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-primary-600 text-white p-3 rounded-full">
            <BookOpen size={32} />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-secondary-900">
          Sistema de Administración AIP
        </h2>
        <p className="mt-2 text-center text-sm text-secondary-600">
          Control de Asistencia de Profesores
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 animate-fade-in">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-error-50 border border-error-200 text-error-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <Input
                label="Correo electrónico"
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                required
                placeholder="ejemplo@correo.com"
                value={formData.email}
                onChange={handleChange}
                className="pl-10"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-secondary-400" />
              </div>
            </div>

            <div className="relative">
              <Input
                label="Contraseña"
                type="password"
                name="password"
                id="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="pl-10"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-secondary-400" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                />
                <label
                  htmlFor="remember_me"
                  className="ml-2 block text-sm text-secondary-700"
                >
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/recuperar-password"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  ¿Olvidó su contraseña?
                </Link>
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full" isLoading={loading}>
                Iniciar sesión
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
