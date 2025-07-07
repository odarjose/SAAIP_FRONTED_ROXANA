import { create } from "zustand";
import { docenteApi } from "../services/ServiceDocente";
import { DocentesState } from "../interface/InterfaceDocente";
import { toast } from "react-hot-toast";

export const useDocenteStore = create<DocentesState>((set, get) => ({
  profesores: [],
  loading: false,
  error: null,
  searchTerm: "",
  estadoFiltro: "todos",

  setSearchTerm: (term: string) => set({ searchTerm: term }),
  setEstadoFiltro: (filtro: "todos" | "activos" | "inactivos") => set({ estadoFiltro: filtro }),

  fetchProfesores: async () => {
    set({ loading: true, error: null });
    try {
      const { estadoFiltro } = get();
      console.log('🔄 Fetching teachers with filter:', estadoFiltro);
      let profesores = [];

      switch (estadoFiltro) {
        case 'activos':
          console.log('📥 Fetching active teachers...');
          profesores = await docenteApi.getProfesores();
          break;
        case 'inactivos':
          console.log('📥 Fetching inactive teachers...');
          profesores = await docenteApi.getProfesoresInactivos();
          break;
        case 'todos':
          console.log('📥 Fetching all teachers...');
          const [activos, inactivos] = await Promise.all([
            docenteApi.getProfesores(),
            docenteApi.getProfesoresInactivos()
          ]);
          profesores = [...activos, ...inactivos];
          break;
        default:
          profesores = await docenteApi.getProfesores();
      }

      console.log('✅ Final teachers list:', profesores);
      set({ profesores, loading: false });
    } catch (error) {
      console.error("❌ Error al cargar los profesores:", error);
      set({ error: "Error al cargar los profesores", loading: false });
    }
  },

  addProfesor: (profesor) => {
    set((state) => ({ profesores: [...state.profesores, profesor] }));
  },

  createProfesor: async (dto) => {
    set({ loading: true, error: null });
    try {
      await docenteApi.createDocente(dto);
      await get().fetchProfesores(); // Recargar la lista
      set({ loading: false });
    } catch (error) {
      console.error('Error al crear profesor:', error);
      set({ error: 'Error al registrar el profesor', loading: false });
      throw error;
    }
  },

  updateProfesor: async (id_docente, dto) => {
    set({ loading: true, error: null });
    try {
      const profesorActualizado = await docenteApi.updateDocente(id_docente, dto);
      // Actualizar la lista de profesores con el profesor actualizado
      set((state) => ({
        profesores: state.profesores.map((p) =>
          p.id_docente === id_docente ? profesorActualizado : p
        ),
        loading: false,
      }));
      // Recargar la lista completa para asegurar que todo esté sincronizado
      await get().fetchProfesores();
    } catch (error) {
      set({ error: "Error al actualizar el profesor", loading: false });
      throw error;
    }
  },

  toggleEstadoProfesor: async (id: number, nuevoEstado: boolean) => {
    set({ loading: true, error: null });
    try {
      console.log('Cambiando estado del profesor:', { id, nuevoEstado });
      
      // Actualizar el estado local primero
      set((state) => ({
        profesores: state.profesores.map((p) =>
          p.id_docente === id ? { ...p, estado: nuevoEstado ? "activo" : "inactivo" } : p
        )
      }));

      // Hacer la llamada al API
      const resultado = await docenteApi.toggleEstado(id, nuevoEstado);
      console.log('Resultado del cambio de estado:', resultado);

      // Recargar la lista completa
      const { estadoFiltro } = get();
      let profesores = [];
      
      if (estadoFiltro === 'activos') {
        profesores = await docenteApi.getProfesores();
      } else if (estadoFiltro === 'inactivos') {
        profesores = await docenteApi.getProfesoresInactivos();
      } else {
        const [activos, inactivos] = await Promise.all([
          docenteApi.getProfesores(),
          docenteApi.getProfesoresInactivos()
        ]);
        profesores = [...activos, ...inactivos];
      }

      set({ profesores, loading: false });
      toast.success(`Profesor ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`);
    } catch (error: any) {
      console.error('Error al cambiar estado:', error);
      // Revertir el cambio en caso de error
      set((state) => ({
        profesores: state.profesores.map((p) =>
          p.id_docente === id ? { ...p, estado: nuevoEstado ? "inactivo" : "activo" } : p
        )
      }));
      const errorMessage = error.response?.data?.detail || 'Error al cambiar el estado del profesor';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  getProfesorById: (id) => {
    return get().profesores.find((p) => p.id_docente === id);
  },
}));