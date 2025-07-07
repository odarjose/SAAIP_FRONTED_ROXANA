import { Usuario, RegisterDTO, LoginDTO, TokenResponse, UserResponse, UsuarioFiltros } from '../interface/InterfaceUsuario';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class UsuarioService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Autenticación
  async register(userData: RegisterDTO): Promise<Usuario> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al registrar usuario');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en register:', error);
      throw error;
    }
  }

  async login(credentials: LoginDTO): Promise<TokenResponse> {
    try {
      // Usar FormData para OAuth2PasswordRequestForm
      const formData = new FormData();
      formData.append('username', credentials.e_mail);
      formData.append('password', credentials.contraseña);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          // No incluir Content-Type para FormData
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Credenciales inválidas');
      }

      const tokenData = await response.json();
      
      // Guardar token en localStorage
      localStorage.setItem('access_token', tokenData.access_token);
      
      return tokenData;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<UserResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al obtener información del usuario');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en getCurrentUser:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    localStorage.removeItem('access_token');
  }

  // CRUD de Usuarios
  async getUsuarios(filtros?: UsuarioFiltros): Promise<Usuario[]> {
    try {
      let url = `${API_BASE_URL}/usuarios`;
      
      // Si se filtra por estado activo, usar el endpoint específico
      if (filtros?.estado === 'activo') {
        url = `${API_BASE_URL}/usuarios/activos`;
      } else {
        // Para otros filtros, usar el endpoint general
        const params = new URLSearchParams();
        if (filtros?.search) params.append('search', filtros.search);
        if (filtros?.estado) params.append('estado', filtros.estado);
        if (filtros?.rol) params.append('rol', filtros.rol);
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al obtener usuarios');
      }

      const usuarios = await response.json();
      
      // Mapear los datos de la BD al formato del frontend
      return usuarios.map((usuario: any) => ({
        id: usuario.idUsuario,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        dni: usuario.dni,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        fecha_nacimiento: usuario.fecha_nacimiento,
        contraseña: '', // No enviar contraseña
        e_mail: usuario.e_mail,
        estado: usuario.estado ? 'activo' : 'inactivo',
        rol: 'usuario' // Por defecto, puedes ajustar según tu lógica
      }));
    } catch (error) {
      console.error('Error en getUsuarios:', error);
      throw error;
    }
  }

  async getUsuarioById(id: number): Promise<Usuario> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al obtener usuario');
      }

      const usuario = await response.json();
      
      // Mapear los datos de la BD al formato del frontend
      return {
        id: usuario.idUsuario,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        dni: usuario.dni,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        fecha_nacimiento: usuario.fecha_nacimiento,
        contraseña: '', // No enviar contraseña
        e_mail: usuario.e_mail,
        estado: usuario.estado ? 'activo' : 'inactivo',
        rol: 'usuario' // Por defecto, puedes ajustar según tu lógica
      };
    } catch (error) {
      console.error('Error en getUsuarioById:', error);
      throw error;
    }
  }

  async getUsuarioByEmail(email: string): Promise<Usuario> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/email/${email}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al obtener usuario por email');
      }

      const usuario = await response.json();
      
      // Mapear la respuesta al formato del frontend
      return {
        id: usuario.idUsuario,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        dni: usuario.dni,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        fecha_nacimiento: usuario.fecha_nacimiento,
        contraseña: '', // No enviar contraseña
        e_mail: usuario.e_mail,
        estado: usuario.estado ? 'activo' : 'inactivo',
        rol: 'usuario' // Por defecto, puedes ajustar según tu lógica
      };
    } catch (error) {
      console.error('Error en getUsuarioByEmail:', error);
      throw error;
    }
  }

  async createUsuario(userData: Omit<Usuario, 'id'>): Promise<Usuario> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al crear usuario');
      }

      const usuario = await response.json();
      
      // Mapear la respuesta al formato del frontend
      return {
        id: usuario.idUsuario,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        dni: usuario.dni,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        fecha_nacimiento: usuario.fecha_nacimiento,
        contraseña: '', // No enviar contraseña
        e_mail: usuario.e_mail,
        estado: usuario.estado ? 'activo' : 'inactivo',
        rol: 'usuario' // Por defecto, puedes ajustar según tu lógica
      };
    } catch (error) {
      console.error('Error en createUsuario:', error);
      throw error;
    }
  }

  async updateUsuario(id: number, userData: Partial<Usuario>): Promise<Usuario> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al actualizar usuario');
      }

      const usuario = await response.json();
      
      // Mapear la respuesta al formato del frontend
      return {
        id: usuario.idUsuario,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        dni: usuario.dni,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        fecha_nacimiento: usuario.fecha_nacimiento,
        contraseña: '', // No enviar contraseña
        e_mail: usuario.e_mail,
        estado: usuario.estado ? 'activo' : 'inactivo',
        rol: 'usuario' // Por defecto, puedes ajustar según tu lógica
      };
    } catch (error) {
      console.error('Error en updateUsuario:', error);
      throw error;
    }
  }

  async deleteUsuario(_id: number): Promise<void> {
    // TODO: Implementar cuando tengas el endpoint DELETE /usuarios/{id} en el backend
    console.warn('Endpoint DELETE /usuarios/{id} no implementado en el backend');
    throw new Error('Endpoint no implementado');
  }

  async changePassword(_id: number, _oldPassword: string, _newPassword: string): Promise<void> {
    // TODO: Implementar cuando tengas el endpoint POST /usuarios/{id}/change-password en el backend
    console.warn('Endpoint POST /usuarios/{id}/change-password no implementado en el backend');
    throw new Error('Endpoint no implementado');
  }

  async toggleEstado(_id: number): Promise<Usuario> {
    // TODO: Implementar cuando tengas el endpoint PATCH /usuarios/{id}/toggle-estado en el backend
    console.warn('Endpoint PATCH /usuarios/{id}/toggle-estado no implementado en el backend');
    throw new Error('Endpoint no implementado');
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  // Obtener token actual
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
}

export const usuarioService = new UsuarioService(); 