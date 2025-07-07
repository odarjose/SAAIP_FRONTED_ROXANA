import { create } from "zustand";
import { asistenciaApi } from "../services/serviceAsistencia";
import { AsistenciaResponseDTO, AsistenciaState } from "../types/Asistencia";
import { Docente } from "../services/serviceAsistencia";

interface FiltrosAsistencia {
  fecha: string;
  id_docente: number | null;
  estado: string;
}

interface ExtendedAsistenciaState extends AsistenciaState {
  docentes: Docente[];
  filtros: FiltrosAsistencia;
  fetchDocentes: () => Promise<void>;
  setFiltros: (filtros: Partial<FiltrosAsistencia>) => void;
  fetchAsistenciasFiltradas: (filtros: FiltrosAsistencia) => Promise<void>;
  limpiarFiltros: () => void;
}

export const useAsistenciaStore = create<ExtendedAsistenciaState>((set, get) => ({
  asistencias: [],
  docentes: [],
  loading: false,
  error: null,
  searchTerm: "",
  filtros: {
    fecha: "", // Inicializar vacío para que no filtre por defecto
    id_docente: null,
    estado: "",
  },

  setSearchTerm: (term: string) => set({ searchTerm: term }),

  setFiltros: (nuevosFiltros: Partial<FiltrosAsistencia>) => {
    set((state) => ({
      filtros: { ...state.filtros, ...nuevosFiltros }
    }));
  },

  limpiarFiltros: () => {
    set({
      filtros: {
        fecha: "", // Limpiar fecha también
        id_docente: null,
        estado: "",
      }
    });
  },

  fetchAsistencias: async () => {
    set({ loading: true, error: null });
    try {
      const asistencias = await asistenciaApi.getAsistencias();
      
      set({ asistencias, loading: false });
    } catch (error) {
      console.error("❌ Error al cargar las asistencias:", error);
      set({ error: "Error al cargar las asistencias", loading: false });
    }
  },

  fetchAsistenciasFiltradas: async (filtros: FiltrosAsistencia) => {
    set({ loading: true, error: null });
    try {
      console.log('🚀 Iniciando filtrado con:', filtros);
      
      // Siempre usar filtrado del lado del cliente por ahora
      const todasLasAsistencias = await asistenciaApi.getAsistencias();
      
      console.log('📊 Total de asistencias cargadas:', todasLasAsistencias.length);
      console.log('🔍 Muestra de datos:', todasLasAsistencias.slice(0, 2));
      
      const asistenciasFiltradas = todasLasAsistencias.filter(asistencia => {
        let pasaFiltros = true;
        
        // Filtro por fecha
        if (filtros.fecha && filtros.fecha.trim() !== '') {
          if (asistencia.fecha !== filtros.fecha) {
            console.log(`❌ Filtro fecha: ${asistencia.fecha} !== ${filtros.fecha}`);
            pasaFiltros = false;
          }
        }
        
        // Filtro por docente
        if (filtros.id_docente && filtros.id_docente !== null) {
          if (asistencia.idDocente !== filtros.id_docente) {
            console.log(`❌ Filtro docente: ${asistencia.idDocente} !== ${filtros.id_docente}`);
            pasaFiltros = false;
          }
        }
        
        // Filtro por estado
        if (filtros.estado && filtros.estado.trim() !== '') {
          if (asistencia.estado !== filtros.estado) {
            console.log(`❌ Filtro estado: ${asistencia.estado} !== ${filtros.estado}`);
            pasaFiltros = false;
          }
        }
        
        if (pasaFiltros) {
          console.log(`✅ Asistencia ${asistencia.idDocenteTurno} pasa todos los filtros`);
        }
        
        return pasaFiltros;
      });
      
      console.log('📊 Total de asistencias después del filtro:', asistenciasFiltradas.length);
      
      set({ asistencias: asistenciasFiltradas, loading: false });
    } catch (error) {
      console.error("❌ Error al cargar las asistencias filtradas:", error);
      set({ error: "Error al cargar las asistencias filtradas", loading: false });
    }
  },

  fetchDocentes: async () => {
    set({ loading: true, error: null });
    try {
      const docentes = await asistenciaApi.getDocentes();
      set({ docentes, loading: false });
    } catch (error) {
      console.error("❌ Error al cargar los docentes:", error);
      set({ error: "Error al cargar los docentes", loading: false });
    }
  },

  addAsistencia: (asistencia: AsistenciaResponseDTO) => {
    set((state) => ({ asistencias: [...state.asistencias, asistencia] }));
  },

  createAsistencia: async (dto) => {
    set({ loading: true, error: null });
    try {
      await asistenciaApi.createAsistencia(dto);
      await get().fetchAsistencias(); // Recargar la lista
      set({ loading: false });
    } catch (error) {
      console.error('Error al crear turno:', error);
      set({ error: 'Error al registrar el turno', loading: false });
      throw error;
    }
  },

  updateAsistencia: async (id_asistencia, dto) => {
    set({ loading: true, error: null });
    try {
      const asistenciaActualizada = await  asistenciaApi.updateAsistencia(id_asistencia, dto);
      // Actualizar la lista de turnos con el turno actualizado
      set((state) => ({
        asistencias: state.asistencias.map((p) =>
          p.docente_idDocente === id_asistencia ? asistenciaActualizada : p
        ),
        loading: false,
      }));
      // Recargar la lista completa para asegurar que todo esté sincronizado
      await get().fetchAsistencias();
    } catch (error) {
      set({ error: "Error al actualizar la asistencia", loading: false });
      throw error;
    }
  },

  getAsistenciaById: (id: number) => {
    return get().asistencias.find((p) => p.docente_idDocente === id);
  },
}));