import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../feactures/auth/context/AuthProvider";
import { Layout } from "../layout/Layout";
import LoginPage from "../feactures/auth/pages/LoginPage";
import Dashboard from "../feactures/dashboard/pages/DasboardPage";
import AsistenciasPage from "../feactures/asistencia/pages/AsistenciaPage";
import AulasPage from "../feactures/aula/pages/AulaPages";

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/" element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/asistencias" element={<AsistenciasPage />} />
            <Route path="/aulas" element={<AulasPage />} />

            {/* Rutas adicionales */}
            <Route
              path="/usuarios"
              element={
                <div className="p-4">Página de Usuarios (en desarrollo)</div>
              }
            />
            <Route
              path="/profesores"
              element={
                <div className="p-4">Página de Profesores (en desarrollo)</div>
              }
            />
            <Route
              path="/turnos"
              element={
                <div className="p-4">Página de Turnos (en desarrollo)</div>
              }
            />
            <Route
              path="/reportes"
              element={
                <div className="p-4">Página de Reportes (en desarrollo)</div>
              }
            />
            <Route
              path="/configuracion"
              element={
                <div className="p-4">
                  Página de Configuración (en desarrollo)
                </div>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
