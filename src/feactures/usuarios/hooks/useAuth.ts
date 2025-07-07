import { useEffect } from 'react';
import { useUsuarioStore } from '../store/storeUsuario';

export const useAuth = () => {
  const {
    isAuthenticated,
    currentUser,
    token,
    loading,
    error,
    login,
    register,
    logout,
    getCurrentUser,
    clearError
  } = useUsuarioStore();

  // Verificar autenticación al montar el componente
  useEffect(() => {
    if (isAuthenticated && !currentUser) {
      getCurrentUser();
    }
  }, [isAuthenticated, currentUser, getCurrentUser]);

  return {
    // Estado
    isAuthenticated,
    currentUser,
    token,
    loading,
    error,
    
    // Métodos
    login,
    register,
    logout,
    getCurrentUser,
    clearError,
    
    // Utilidades
    isAdmin: currentUser?.rol === 'admin',
    isSupervisor: currentUser?.rol === 'supervisor',
    isProfesor: currentUser?.rol === 'profesor',
    hasRole: (role: string) => currentUser?.rol === role,
    hasAnyRole: (roles: string[]) => roles.includes(currentUser?.rol || ''),
  };
}; 