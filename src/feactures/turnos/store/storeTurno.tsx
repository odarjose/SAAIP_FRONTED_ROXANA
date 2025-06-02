import { create } from "zustand";
import { turnoApi } from "../service/serviceTurno";
import { TurnoResponseDTO, TurnoState } from "../interface/InterfaceTurnos";

export const useTurnoStore = create<TurnoState>((set, get) => ({
  turnos: [],
  loading: false,
  error: null,
  searchTerm: "",
 

  setSearchTerm: (term: string) => set({ searchTerm: term }),
  

  fetchTurnos: async () => {
    set({ loading: true, error: null });
    try {
      const turnos = await turnoApi.getTurnos();
      
      set({ turnos, loading: false });
    } catch (error) {
      console.error("❌ Error al cargar los turnos:", error);
      set({ error: "Error al cargar los turnos", loading: false });
    }
  },


  addTurno: (turno: TurnoResponseDTO) => {
    set((state) => ({ turnos: [...state.turnos, turno] }));
  },

  createTurno: async (dto) => {
    set({ loading: true, error: null });
    try {
      await turnoApi.createTurno(dto);
      await get().fetchTurnos(); // Recargar la lista
      set({ loading: false });
    } catch (error) {
      console.error('Error al crear turno:', error);
      set({ error: 'Error al registrar el turno', loading: false });
      throw error;
    }
  },

  updateTurno: async (id_turno, dto) => {
    set({ loading: true, error: null });
    try {
      const turnoActualizado = await turnoApi.updateTurno(id_turno, dto);
      // Actualizar la lista de turnos con el turno actualizado
      set((state) => ({
        turnos: state.turnos.map((p) =>
          p.idDocenteTurno === id_turno ? turnoActualizado : p
        ),
        loading: false,
      }));
      // Recargar la lista completa para asegurar que todo esté sincronizado
      await get().fetchTurnos();
    } catch (error) {
      set({ error: "Error al actualizar el turno", loading: false });
      throw error;
    }
  },

  

  getTurnoById: (id: number) => {
    return get().turnos.find((p) => p.idDocenteTurno === id);
  },
}));