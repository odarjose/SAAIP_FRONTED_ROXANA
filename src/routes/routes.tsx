import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../feactures/auth/context/AuthProvider";
import { Layout } from "../layout/Layout";
import LoginPage from "../feactures/auth/pages/LoginPage";
import Dashboard from "../feactures/dashboard/pages/DasboardPage";
import AsistenciasPage from "../feactures/asistencia/pages/AsistenciaPage";
import DocentesPage from "../feactures/docentes/pages/DocentesPage";
import TurnosPage from "../feactures/turnos/pages/TurnosPage";

import UsuariosPage from "../feactures/usuarios/pages/UsuariosPage";
import ConfiguracionPage from "../feactures/configuracion/page/ConfiguracionPage";

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
            <Route
              path="/usuarios"
              element={<UsuariosPage />}
            />
            <Route
              path="/docentes"
              element={<DocentesPage />}
            />
            <Route path="/turnos" element={<TurnosPage />} />
            <Route
              path="/reportes"
              element={<ReportesPage />}
            />
            <Route
              path="/reportes/aula-innovacion"
              element={<ReporteAulaInnovacionPage />}
            />
            <Route
              path="/configuracion"
              element={
                <ConfiguracionPage/>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
