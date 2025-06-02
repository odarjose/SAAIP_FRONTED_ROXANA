import { create } from "zustand";
import { asistenciaApi } from "../services/serviceAsistencia";
import { AsistenciaResponseDTO, AsistenciaState } from "../types/Asistencia";
import { Docente } from "../services/serviceAsistencia";

interface ExtendedAsistenciaState extends AsistenciaState {
  docentes: Docente[];
  fetchDocentes: () => Promise<void>;
}

export const useAsistenciaStore = create<ExtendedAsistenciaState>((set, get) => ({
  asistencias: [],
  docentes: [],
  loading: false,
  error: null,
  searchTerm: "",
 

  setSearchTerm: (term: string) => set({ searchTerm: term }),
  

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