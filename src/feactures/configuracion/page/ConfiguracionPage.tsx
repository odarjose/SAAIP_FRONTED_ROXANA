import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../shared/components/Card";
import { Button } from "../../../shared/components/Button";
import { Input } from "../../../shared/components/Input";

import { 
  Settings,
  Save,
  Clock,
  Bell,
  
  Calendar,
  RefreshCw
} from 'lucide-react';

const ConfiguracionPage: React.FC = () => {
  const [config, setConfig] = useState({
    tiempoMaximoSesion: 60,
    diasLaborales: [1, 2, 3, 4, 5], // Lunes a Viernes
    notificacionesInconsistencias: true,
    toleranciaEntrada: 15,
    toleranciaSalida: 15,
    correoNotificaciones: 'notificaciones@example.com',
  });

  const diasSemana = [
    { value: '0', label: 'Domingo' },
    { value: '1', label: 'Lunes' },
    { value: '2', label: 'Martes' },
    { value: '3', label: 'Miércoles' },
    { value: '4', label: 'Jueves' },
    { value: '5', label: 'Viernes' },
    { value: '6', label: 'Sábado' },
  ];

  const handleSave = () => {
    // Aquí iría la lógica para guardar la configuración
    console.log('Guardando configuración:', config);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Configuración del Sistema</h1>
          <p className="text-secondary-600">Ajustes generales y preferencias</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={handleSave}>
            <Save size={16} className="mr-2" />
            Guardar cambios
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock size={20} className="mr-2 text-primary-600" />
              Configuración de Sesión y Horarios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                type="number"
                label="Tiempo máximo de sesión (minutos)"
                value={config.tiempoMaximoSesion}
                onChange={(e) => setConfig({ ...config, tiempoMaximoSesion: parseInt(e.target.value) })}
              />
            </div>
            
            <div>
              <Input
                type="number"
                label="Tolerancia para entrada (minutos)"
                value={config.toleranciaEntrada}
                onChange={(e) => setConfig({ ...config, toleranciaEntrada: parseInt(e.target.value) })}
              />
            </div>
            
            <div>
              <Input
                type="number"
                label="Tolerancia para salida (minutos)"
                value={config.toleranciaSalida}
                onChange={(e) => setConfig({ ...config, toleranciaSalida: parseInt(e.target.value) })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar size={20} className="mr-2 text-primary-600" />
              Días Laborales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {diasSemana.map((dia) => (
                <label key={dia.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={config.diasLaborales.includes(parseInt(dia.value))}
                    onChange={(e) => {
                      const value = parseInt(dia.value);
                      setConfig({
                        ...config,
                        diasLaborales: e.target.checked
                          ? [...config.diasLaborales, value]
                          : config.diasLaborales.filter(d => d !== value)
                      });
                    }}
                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-secondary-700">{dia.label}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell size={20} className="mr-2 text-primary-600" />
              Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={config.notificacionesInconsistencias}
                  onChange={(e) => setConfig({ ...config, notificacionesInconsistencias: e.target.checked })}
                  className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-secondary-700">Notificar inconsistencias</span>
              </label>
            </div>
            
            <div>
              <Input
                type="email"
                label="Correo para notificaciones"
                value={config.correoNotificaciones}
                onChange={(e) => setConfig({ ...config, correoNotificaciones: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <RefreshCw size={20} className="mr-2 text-primary-600" />
              Acciones del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <RefreshCw size={16} className="mr-2" />
              Sincronizar datos
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Settings size={16} className="mr-2" />
              Restablecer configuración
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConfiguracionPage;