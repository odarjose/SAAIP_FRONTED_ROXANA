export interface User {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  avatar?: string;
  rol: "admin" | "profesor" | "supervisor";
  activo: boolean;
  ultimoAcceso?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistroUsuario {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol: "admin" | "profesor" | "supervisor";
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (userData: RegistroUsuario) => Promise<void>;
}
