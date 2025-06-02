

export interface RegisterTurno {
    idDocente:number
    fecha_asignacion:string
    estado:boolean
    tipo_turno:string
    hora_inicio:string
    hora_fin: string
    grado:string
    seccion:string
}

export interface TurnoResponseDTO {
    idDocenteTurno: number
    idDocente: number
    fecha_asignacion: string
    estado: boolean
    tipo_turno: string
    hora_inicio: string
    hora_fin: string
    grado: number
    seccion: string
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


export type PartialTurno = Partial<Omit<RegisterTurno, 'idDocenteTurno'>> & {
    id_turno?: number;
   
};

export interface TurnoState {
    turnos: TurnoResponseDTO[];
    loading: boolean;
    error: string | null;
    searchTerm: string;
    
    fetchTurnos: () => Promise<void>;
    addTurno: (turno: TurnoResponseDTO) => void;
    
    createTurno: (turno: RegisterTurno) => Promise<void>;
    updateTurno: (id_turno:number,dto:PartialTurno) => Promise<void>;
    getTurnoById: (id: number) => TurnoResponseDTO | undefined;
    setSearchTerm: (term: string) => void;
}

