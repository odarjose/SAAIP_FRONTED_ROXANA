import { create } from "zustand";
import { docenteApi } from "../services/ServiceDocente";
import { DocentesState } from "../interface/InterfaceDocente";

export const useDocenteStore = create<DocentesState>((set, get) => ({
  profesores: [],
  loading: false,
  error: null,
  searchTerm: "",

  setSearchTerm: (term: string) => set({ searchTerm: term }),

  fetchProfesores: async () => {
    set({ loading: true, error: null });
    try {
      const profesores = await docenteApi.getProfesores();
      set({ profesores, loading: false });
    } catch (error) {
      set({ error: "Error al cargar los profesores", loading: false });
    }
  },

  addProfesor: (profesor) => {
    set((state) => ({ profesores: [...state.profesores, profesor] }));
  },

  // ✅ Opción 2: No retornar nada, solo lanzar error si falla
  createProfesor: async (dto) => {
  set({ loading: true, error: null });
  try {
    await docenteApi.createDocente(dto);
    await get().fetchProfesores(); // Recargar la lista
    set({ loading: false });
    // ✅ No retornar nada - el éxito se maneja por la ausencia de error
  } catch (error) {
    console.error('Error al crear profesor:', error);
    set({ error: 'Error al registrar el profesor', loading: false });
    throw error; // ✅ Lanzar el error para que el componente lo capture
  }
},

  updateProfesor: async (id, dto) => {
    set({ loading: true, error: null });
    try {
      const profesorActualizado = await docenteApi.updateDocente(id, dto);
      set((state) => ({
        profesores: state.profesores.map((p) =>
          p.id_docente === id ? profesorActualizado : p
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: "Error al actualizar el profesor", loading: false });
    }
  },

  toggleEstadoProfesor: async (id) => {
    set({ loading: true, error: null });
    try {
      const profesorActualizado = await docenteApi.toggleEstado(id, false);
      set((state) => ({
        profesores: state.profesores.map((p) =>
          p.id_docente === id ? profesorActualizado : p
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: "Error al cambiar el estado del profesor", loading: false });
    }
  },

  getProfesorById: (id) => {
    return get().profesores.find((p) => p.id_docente === id);
  },
}));