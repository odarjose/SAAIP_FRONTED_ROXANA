import { create } from "zustand";
import { reportesApi } from "../services/serviceReportes";
import { ReporteState, FiltrosReporte } from "../types/Reportes";

export const useReportesStore = create<ReporteState>((set) => ({
  reporte: null,
  loading: false,
  error: null,
  filtros: {
    fechaInicio: "",
    fechaFin: "",
    id_docente: null,
    estado: "",
    tipo_turno: "",
    tipo_docencia: "",
  },

  generarReporte: async (filtros: FiltrosReporte) => {
    set({ loading: true, error: null });
    try {
      console.log("🚀 Generando reporte con filtros:", filtros);
      const reporte = await reportesApi.generarReporte(filtros);
      set({ reporte, loading: false });
      console.log("✅ Reporte generado exitosamente:", reporte);
    } catch (error) {
      console.error("❌ Error generando reporte:", error);
      set({ 
        error: error instanceof Error ? error.message : "Error generando reporte", 
        loading: false 
      });
    }
  },

  setFiltros: (nuevosFiltros: Partial<FiltrosReporte>) => {
    set((state) => ({
      filtros: { ...state.filtros, ...nuevosFiltros }
    }));
  },

  limpiarFiltros: () => {
    set({
      filtros: {
        fechaInicio: "",
        fechaFin: "",
        id_docente: null,
        estado: "",
        tipo_turno: "",
        tipo_docencia: "",
      }
    });
  },
})); 