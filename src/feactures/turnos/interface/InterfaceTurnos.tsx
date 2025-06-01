export interface RegisterTurno {
    nombre:string
    hora_inicio:string
    hora_fin: string
    grado:string
    seccion:string
}

export interface TurnoResponseDTO {
    id_turno:number
    nombre:string
    hora_inicio:string
    hora_fin: string
    grado:string
    seccion:string
}


export type PartialTurno = Partial<Omit<RegisterTurno, 'id_turno'>> & {
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

