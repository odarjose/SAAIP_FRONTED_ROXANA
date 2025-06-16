import axios from "axios";
import {
  ReporteDTO,
  ReporteAsistenciaDTO,
  ReporteUsoAulaDTO,
  ReporteEstadisticoDTO,
} from "../types/Reporte";

const API_URL = import.meta.env.VITE_API_URL;

export const reporteApi = {
  generarReporteAsistencia: async (
    dto: ReporteAsistenciaDTO,
  ): Promise<Blob> => {
    const response = await axios.post(
      `${API_URL}/api/reportes/asistencia`,
      dto,
      {
        responseType: "blob",
        headers: {
          Accept: "application/pdf,application/vnd.ms-excel,text/csv",
        },
      },
    );
    return response.data;
  },

  generarReporteUsoAula: async (dto: ReporteUsoAulaDTO): Promise<Blob> => {
    const response = await axios.post(`${API_URL}/reportes/uso-aula`, dto, {
      responseType: "blob",
      headers: {
        Accept: "application/pdf,application/vnd.ms-excel,text/csv",
      },
    });
    return response.data;
  },

  generarReporteEstadistico: async (
    dto: ReporteEstadisticoDTO,
  ): Promise<Blob> => {
    const response = await axios.post(
      `${API_URL}/api/reportes/estadistico`,
      dto,
      {
        responseType: "blob",
        headers: {
          Accept: "application/pdf,application/vnd.ms-excel,text/csv",
        },
      },
    );
    return response.data;
  },

  obtenerReporte: async (idReporte: number): Promise<ReporteDTO> => {
    const response = await axios.get(`${API_URL}/api/reportes/${idReporte}`);
    return response.data;
  },

  listarReportes: async (): Promise<ReporteDTO[]> => {
    const response = await axios.get(`${API_URL}/api/reportes`);
    return response.data;
  },
};
