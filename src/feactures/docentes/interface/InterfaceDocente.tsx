import { Usuario } from "../../usuarios/interface/InterfaceUsuario";

// Enums compartidos con el backend
export enum TipoDocencia {
  UNIDOCENCIA = 'UNIDOCENCIA',
  POLIDOCENCIA = 'POLIDOCENCIA'
}

export enum TipoContrato {
  NOMBRAMIENTO = 'NOMBRAMIENTO',
  TEMPORAL = 'TEMPORAL',
  PROYECTO = 'PROYECTO'
}

// DTO para registrar un docente (incluye datos de usuario)
export interface RegistrarDocente extends Usuario {
    tipo_docencia: TipoDocencia;
    tipo_contrato: TipoContrato;
    fecha_inicio_contrato: string; // formato ISO
    fecha_fin_contrato: string; // formato ISO
    estado?: boolean;
}
// Respuesta del backend para operaciones GET
export interface DocenteResponseDTO extends Usuario {
  id_docente: number;
  tipo_docencia: TipoDocencia;
  tipo_contrato: TipoContrato;
  fecha_inicio_contrato: string;
  fecha_fin_contrato: string;
  estado: boolean;
}
/** Esto es para actualizar solo se enviaran los campo donde se dectete modificacion */
export type PartialDocente = Partial<Omit<RegistrarDocente, 'id_docente'>>;

// Estado global del store Zustand
export interface DocentesState {
  profesores: DocenteResponseDTO[];
  loading: boolean;
  error: string | null;
  
  fetchProfesores: () => Promise<void>;
  addProfesor: (profesor: DocenteResponseDTO) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  createProfesor: (dto: RegistrarDocente) => Promise<void>; // No retorna nada, solo lanza error si falla
  updateProfesor: (id: number, dto: PartialDocente) => Promise<void>;
  toggleEstadoProfesor: (id: number) => Promise<void>;
  getProfesorById: (id: number) => DocenteResponseDTO | undefined;

}

