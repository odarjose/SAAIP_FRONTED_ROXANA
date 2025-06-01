import { create } from "zustand";
import { aulaApi } from "../services/serviceAulas";
import { toast } from "react-hot-toast";
import { AulaState, EstadoAula } from "../types/interfaceAulas";


export const useAulaStore = create<AulaState>((set, get) => ({
  aulas: [],
  loading: false,
  error: null,
  searchTerm: "",
  estadoFiltro: "todas",

  setSearchTerm: (term: string) => set({ searchTerm: term }),
  setEstadoFiltro: (filtro: "todas" | "disponibles" | "ocupados") => set({ estadoFiltro: filtro }),

  fetchAulas: async () => {
    set({ loading: true, error: null });
    try {
      const { estadoFiltro } = get();
      console.log('🔄 Fetching teachers with filter:', estadoFiltro);
      let aulas = [];

      switch (estadoFiltro) {
        case 'disponibles':
          console.log('📥 Fetching active teachers...');
          aulas = await aulaApi.getAulas();
          break;
        case 'ocupados':
          console.log('📥 Fetching inactive teachers...');
          aulas = await aulaApi.getAulasOcupadas();
          break;
        case 'todas':
          console.log('📥 Fetching all teachers...');
          const [disponibles, ocupados] = await Promise.all([
            aulaApi.getAulas(),
            aulaApi.getAulasOcupadas()
          ]);
          aulas = [...disponibles, ...ocupados];
          break;
        default:
          aulas = await aulaApi.getAulas();
      }

      console.log('✅ Final teachers list:', aulas);
      set({ aulas, loading: false });
    } catch (error) {
      console.error("❌ Error al cargar los aulas:", error);
      set({ error: "Error al cargar los aulas", loading: false });
    }
  },


  addAula: (aula) => {
    set((state) => ({ aulas: [...state.aulas, aula] }));
  },

  createAula: async (dto) => {
    set({ loading: true, error: null });
    try {
      await aulaApi.createAula(dto);
      await get().fetchAulas(); // Recargar la lista
      set({ loading: false });
    } catch (error) {
      console.error('Error al crear aula:', error);
      set({ error: 'Error al registrar la aula', loading: false });
      throw error;
    }
  },

  updateAula: async (id_aula, dto) => {
    set({ loading: true, error: null });
    try {
      const aulaActualizada = await aulaApi.updateAula(id_aula, dto);
      // Actualizar la lista de aulas con la aula actualizada
      set((state) => ({
        aulas: state.aulas.map((p) =>
          p.id_aula === id_aula ? aulaActualizada : p
        ),
        loading: false,
      }));
      // Recargar la lista completa para asegurar que todo esté sincronizado
      await get().fetchAulas();
    } catch (error) {
      set({ error: "Error al actualizar la aula", loading: false });
      throw error;
    }
  },

  toggleEstadoAula: async (id: number, nuevoEstado: boolean) => {
    set({ loading: true, error: null });
    try {
      console.log('Cambiando estado de la aula:', { id, nuevoEstado });
      
      // Actualizar el estado local primero
      set((state) => ({
        aulas: state.aulas.map((p) =>
          p.id_aula === id ? { ...p, estado: nuevoEstado ? EstadoAula.DISPONIBLE : EstadoAula.OCUPADO } : p
        )
      }));

      // Hacer la llamada al API
      const resultado = await aulaApi.toggleEstadoAula(id, nuevoEstado);
      console.log('Resultado del cambio de estado:', resultado);

      // Recargar la lista completa
      const { estadoFiltro } = get();
      let aulas = [];
      
      if (estadoFiltro === 'todas') {
        aulas = await aulaApi.getAulas();
      } else if (estadoFiltro === 'ocupados') {
        aulas = await aulaApi.getAulasOcupadas();
      } else {
        const [disponibles, ocupados] = await Promise.all([
          aulaApi.getAulas(),
          aulaApi.getAulasOcupadas()
        ]);
        aulas = [...disponibles, ...ocupados];
      }

      set({ aulas, loading: false });
      toast.success(`Aula ${nuevoEstado ? 'disponible' : 'ocupada'} correctamente`);
    } catch (error: any) {
      console.error('Error al cambiar estado:', error);
      // Revertir el cambio en caso de error
      set((state: { aulas: any[]; }) => ({
        aulas: state.aulas.map((p: any) =>
          p.id_aula === id ? { ...p, estado: !nuevoEstado } : p
        )
      }));
      const errorMessage = error.response?.data?.detail || 'Error al cambiar el estado de la aula';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  getAulaById: (id: number) => {
    return get().aulas.find((p) => p.id_aula === id);
  },
}));