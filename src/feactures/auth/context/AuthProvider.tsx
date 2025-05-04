import React, { useEffect, useState } from "react";

import { AuthState, LoginCredentials, User } from "../types/Auth";
import { AuthContext } from "./AuthContext";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Verificar si hay un usuario en localStorage al cargar la aplicación
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
          setAuthState({
            user: JSON.parse(storedUser),
            token: storedToken,
            loading: false,
            error: null,
          });
        } else {
          setAuthState({
            user: null,
            token: null,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        setAuthState({
          user: null,
          token: null,
          loading: false,
          error: `Error al recuperar la sesión: ${String(error)}`,
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setAuthState({ ...authState, loading: true, error: null });

    try {
      // Simulación de login exitoso
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUser: User = {
        id: "1",
        nombre: "Admin",
        apellido: "User",
        email: credentials.email,
        rol: "admin",
        activo: true,
        ultimoAcceso: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockToken = "mock-jwt-token";

      // Guardar en localStorage
      localStorage.setItem("user", JSON.stringify(mockUser));
      localStorage.setItem("token", mockToken);

      setAuthState({
        user: mockUser,
        token: mockToken,
        loading: false,
        error: null,
      });
    } catch (error) {
      setAuthState({
        ...authState,
        loading: false,
        error: `Credenciales inválidas: : ${String(error)}`,
      });
    }
  };

  const logout = () => {
    // Limpiar localStorage y state
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setAuthState({
      user: null,
      token: null,
      loading: false,
      error: null,
    });
  };

  interface RegistroUsuario {
    email: string;
    password: string;
  }

  const register = async (userData: RegistroUsuario) => {
    setAuthState({ ...authState, loading: true, error: null });

    try {
      // Simulación de registro
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Registering user:", userData);

      setAuthState({
        ...authState,
        loading: false,
        error: null,
      });
    } catch (error) {
      setAuthState({
        ...authState,
        loading: false,
        error: `Error al registrar usuario: ${String(error)}`,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
