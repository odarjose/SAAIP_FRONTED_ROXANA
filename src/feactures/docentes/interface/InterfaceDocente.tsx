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
    estado?: "activo" | "inactivo";
}
// Respuesta del backend para operaciones GET
export interface DocenteResponseDTO extends Usuario {
  id_docente: number;
  id_usuario: number;
  tipo_docencia: TipoDocencia;
  tipo_contrato: TipoContrato;
  fecha_inicio_contrato: string;
  fecha_fin_contrato: string;
  estado: "activo" | "inactivo" | undefined;
}
/** Esto es para actualizar solo se enviaran los campo donde se dectete modificacion */
export type PartialDocente = Partial<Omit<RegistrarDocente, 'id_docente'>> & {
    id_usuario?: number;
    contraseña?: string;
};

// Estado global del store Zustand
export interface DocentesState {
  profesores: DocenteResponseDTO[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  estadoFiltro: "todos" | "activos" | "inactivos";
  
  fetchProfesores: () => Promise<void>;
  addProfesor: (profesor: DocenteResponseDTO) => void;
  setSearchTerm: (term: string) => void;
  setEstadoFiltro: (filtro: "todos" | "activos" | "inactivos") => void;
  createProfesor: (dto: RegistrarDocente) => Promise<void>;
  updateProfesor: (id_docente: number, dto: PartialDocente) => Promise<void>;
  toggleEstadoProfesor: (id: number, nuevoEstado: boolean) => Promise<void>;
  getProfesorById: (id: number) => DocenteResponseDTO | undefined;
}

