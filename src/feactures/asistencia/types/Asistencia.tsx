export interface RegisterAsistencia {
    id_docente: number
    fecha: string
    hora_entrada: string
    hora_salida: string
    tiempo_uso: number
    estado: string
}

export interface AsistenciaResponseDTO {
    idDocenteTurno: number
    idDocente: number
    fecha: string
    hora_entrada: string
    hora_salida: string
    tiempo_uso: number
    estado: string
   
    docente_idDocente: number
    docente_idUsuario: number
    docente_tipo_docencia: string
    docente_tipo_contrato: string
    docente_fecha_inicio_contrato: string
    docente_fecha_fin_contrato: string
    docente_estado: boolean
    usuario_idUsuario: number
    usuario_nombres: string
    usuario_apellidos: string
    usuario_dni: string
    usuario_telefono: string
    usuario_direccion: string
    usuario_fecha_nacimiento: string
    usuario_e_mail: string
    usuario_estado: boolean
}


export type PartialAsistencia = Partial<Omit<RegisterAsistencia, 'idDocenteTurno'>> & {
    id_asistencia?: number;
   
};

export interface AsistenciaState {
    asistencias: AsistenciaResponseDTO[];
    loading: boolean;
    error: string | null;
    searchTerm: string;
    
    fetchAsistencias: () => Promise<void>;
    addAsistencia: (asistencia: AsistenciaResponseDTO) => void;
    
    createAsistencia: (asistencia: RegisterAsistencia) => Promise<void>;
    updateAsistencia: (id_asistencia:number,dto:PartialAsistencia) => Promise<void>;
    getAsistenciaById: (id: number) => AsistenciaResponseDTO | undefined;
    setSearchTerm: (term: string) => void;
}

