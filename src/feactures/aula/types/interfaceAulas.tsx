export enum TipoAula {
  AULA_DE_CLASE = 'AULA DE CLASE',
  AULA_DE_INNOVACION = 'AULA DE INNOVACION'
}

export enum EstadoAula {
  DISPONIBLE = 'DISPONIBLE',
  OCUPADO = 'OCUPADO',
  
}

export interface RegistrarAula {
  nombre:string
  capacidad:number
  equipos:string
  descripcion:string
  tipo:TipoAula
  estado:EstadoAula
}
  
export interface AulaResponseDTO {
  id_aula:number
  nombre:string
  capacidad:number
  equipos:string
  descripcion:string
  tipo:TipoAula
  estado:EstadoAula
}

export type PartialAula = Partial<Omit<RegistrarAula, 'id_aula'>> & {
    id_aula?: number;
   
};

export interface AulaState {
  aulas: AulaResponseDTO[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  estadoFiltro: "todas" | "disponibles" | "ocupados";

  fetchAulas: () => Promise<void>;
  addAula: (aula: AulaResponseDTO) => void;
  setSearchTerm: (term: string) => void;
  setEstadoFiltro: (filtro: "todas" | "disponibles" | "ocupados") => void;
  createAula: (dto: RegistrarAula) => Promise<void>;
  updateAula: (id_aula: number, dto: PartialAula) => Promise<void>;
  toggleEstadoAula: (id: number, nuevoEstado: boolean) => Promise<void>;
  getAulaById: (id: number) => AulaResponseDTO | undefined;
}
