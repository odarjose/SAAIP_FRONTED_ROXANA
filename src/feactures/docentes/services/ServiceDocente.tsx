import axios from "axios";

import { RegistrarDocente, PartialDocente,DocenteResponseDTO } from "../interface/InterfaceDocente";


const API_URL = import.meta.env.VITE_API_URL;

export const docenteApi = {
    getProfesores: async (): Promise<DocenteResponseDTO[]> => {
   
        try {
            const response = await axios.get(`${API_URL}/docentes/con_usuario`);
            return response.data;
        } catch (error) {
            console.error("Error fetching docentes:", error);
            throw error;
        }
    },

    createDocente: async (docente: RegistrarDocente): Promise<DocenteResponseDTO> => {
        try {
            const response = await axios.post(`${API_URL}/docentes/register`, docente);
            return response.data;
        } catch (error) {
            console.error("Error creating docente:", error);
            throw error;
        }
    },

    updateDocente: async (id: number, docente: PartialDocente): Promise<DocenteResponseDTO> => {
        try {
            const response = await axios.put(`${API_URL}/update/${id}`, docente);
            return response.data;
        } catch (error) {
            console.error("Error updating docente:", error);
            throw error;
        }
    },

    // Inhabilitar/habilitar docente (cambiar estado)
    toggleEstado: async (id: number, estado: boolean): Promise<DocenteResponseDTO> => {
        try {
            const response = await axios.put(`${API_URL}/toggle/${id}`, { estado });
            return response.data;
        } catch (error) {
            console.error("Error toggling docente estado:", error);
            throw error;
        }
    } 

}