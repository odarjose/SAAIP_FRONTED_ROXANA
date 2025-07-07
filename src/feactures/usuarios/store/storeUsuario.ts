import { create } from 'zustand';
import { Usuario, RegisterDTO, LoginDTO,  UsuarioFiltros } from '../interface/InterfaceUsuario';
import { usuarioService } from '../services/serviceUsuario';

interface UsuarioState {
  // Estado de autenticación
  isAuthenticated: boolean;
  currentUser: any | null;
  token: string | null;
  
  // Estado de usuarios
  usuarios: Usuario[];
  usuarioSeleccionado: Usuario | null;
  loading: boolean;
  error: string | null;
  
  // Filtros
  filtros: UsuarioFiltros;
  
  // Acciones de autenticación
  login: (credentials: LoginDTO) => Promise<void>;
  register: (userData: RegisterDTO) => Promise<void>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
  
  // Acciones CRUD
  fetchUsuarios: (filtros?: UsuarioFiltros) => Promise<void>;
  fetchUsuarioById: (id: number) => Promise<void>;
  createUsuario: (userData: Omit<Usuario, 'id'>) => Promise<void>;
  updateUsuario: (id: number, userData: Partial<Usuario>) => Promise<void>;
  deleteUsuario: (id: number) => Promise<void>;
  toggleEstadoUsuario: (id: number) => Promise<void>;
  changePassword: (id: number, oldPassword: string, newPassword: string) => Promise<void>;
  
  // Acciones de estado
  setUsuarioSeleccionado: (usuario: Usuario | null) => void;
  setFiltros: (filtros: UsuarioFiltros) => void;
  clearError: () => void;
  clearUsuarios: () => void;
}

export const useUsuarioStore = create<UsuarioState>((set, get) => ({
  // Estado inicial
  isAuthenticated: usuarioService.isAuthenticated(),
  currentUser: null,
  token: usuarioService.getToken(),
  usuarios: [],
  usuarioSeleccionado: null,
  loading: false,
  error: null,
  filtros: {},

  // Autenticación
  login: async (credentials: LoginDTO) => {
    set({ loading: true, error: null });
    try {
      const tokenData = await usuarioService.login(credentials);
      set({ 
        isAuthenticated: true, 
        token: tokenData.access_token,
        loading: false 
      });
      
      // Obtener información del usuario actual
      await get().getCurrentUser();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error en el login',
        loading: false 
      });
      throw error;
    }
  },

  register: async (userData: RegisterDTO) => {
    set({ loading: true, error: null });
    try {
      await usuarioService.register(userData);
      set({ loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error en el registro',
        loading: false 
      });
      throw error;
    }
  },

  logout: () => {
    usuarioService.logout();
    set({ 
      isAuthenticated: false, 
      currentUser: null, 
      token: null,
      usuarios: [],
      usuarioSeleccionado: null 
    });
  },

  getCurrentUser: async () => {
    try {
      const userData = await usuarioService.getCurrentUser();
      set({ currentUser: userData });
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      // Si hay error, hacer logout
      get().logout();
    }
  },

  // CRUD de usuarios
  fetchUsuarios: async (filtros?: UsuarioFiltros) => {
    set({ loading: true, error: null });
    try {
      const usuarios = await usuarioService.getUsuarios(filtros);
      set({ usuarios, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error al obtener usuarios',
        loading: false 
      });
    }
  },

  fetchUsuarioById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const usuario = await usuarioService.getUsuarioById(id);
      set({ usuarioSeleccionado: usuario, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error al obtener usuario',
        loading: false 
      });
    }
  },

  createUsuario: async (userData: Omit<Usuario, 'id'>) => {
    set({ loading: true, error: null });
    try {
      const nuevoUsuario = await usuarioService.createUsuario(userData);
      set(state => ({ 
        usuarios: [...state.usuarios, nuevoUsuario],
        loading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error al crear usuario',
        loading: false 
      });
      throw error;
    }
  },

  updateUsuario: async (id: number, userData: Partial<Usuario>) => {
    set({ loading: true, error: null });
    try {
      const usuarioActualizado = await usuarioService.updateUsuario(id, userData);
      set(state => ({ 
        usuarios: state.usuarios.map(u => u.id === id ? usuarioActualizado : u),
        usuarioSeleccionado: state.usuarioSeleccionado?.id === id ? usuarioActualizado : state.usuarioSeleccionado,
        loading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error al actualizar usuario',
        loading: false 
      });
      throw error;
    }
  },

  deleteUsuario: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await usuarioService.deleteUsuario(id);
      set(state => ({ 
        usuarios: state.usuarios.filter(u => u.id !== id),
        usuarioSeleccionado: state.usuarioSeleccionado?.id === id ? null : state.usuarioSeleccionado,
        loading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error al eliminar usuario',
        loading: false 
      });
      throw error;
    }
  },

  toggleEstadoUsuario: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const usuarioActualizado = await usuarioService.toggleEstado(id);
      set(state => ({ 
        usuarios: state.usuarios.map(u => u.id === id ? usuarioActualizado : u),
        usuarioSeleccionado: state.usuarioSeleccionado?.id === id ? usuarioActualizado : state.usuarioSeleccionado,
        loading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error al cambiar estado del usuario',
        loading: false 
      });
      throw error;
    }
  },

  changePassword: async (id: number, oldPassword: string, newPassword: string) => {
    set({ loading: true, error: null });
    try {
      await usuarioService.changePassword(id, oldPassword, newPassword);
      set({ loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error al cambiar contraseña',
        loading: false 
      });
      throw error;
    }
  },

  // Acciones de estado
  setUsuarioSeleccionado: (usuario: Usuario | null) => {
    set({ usuarioSeleccionado: usuario });
  },

  setFiltros: (filtros: UsuarioFiltros) => {
    set({ filtros });
  },

  clearError: () => {
    set({ error: null });
  },

  clearUsuarios: () => {
    set({ usuarios: [], usuarioSeleccionado: null });
  },
})); 