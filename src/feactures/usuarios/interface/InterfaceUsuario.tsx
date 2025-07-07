export interface Usuario {
    id?: number;
    nombres: string;
    apellidos: string;
    dni: string;
    telefono: string;
    direccion: string;
    fecha_nacimiento: string;
    contraseña: string;
    e_mail: string;
    estado?: 'activo' | 'inactivo';
    ultimo_acceso?: string;
    rol?: string;
}

export interface RegisterDTO {
    nombres: string;
    apellidos: string;
    dni: string;
    telefono: string;
    direccion: string;
    fecha_nacimiento: string;
    contraseña: string;
    e_mail: string;
}

export interface LoginDTO {
    e_mail: string;
    contraseña: string;
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
}

export interface UserResponse {
    message: string;
}

export interface UsuarioFiltros {
    search?: string;
    estado?: 'activo' | 'inactivo';
    rol?: string;
}