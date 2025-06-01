import axios from "axios";

import { RegistrarAula, PartialAula, AulaResponseDTO, EstadoAula } from "../types/interfaceAulas";


const API_URL = import.meta.env.VITE_API_URL;

const mapearAulaBackend = (aulaBackend: any): AulaResponseDTO => {
    return {
        id_aula: aulaBackend.idAula ?? aulaBackend.id_aula ?? 0,
        nombre: aulaBackend.nombre ?? '',
        capacidad: aulaBackend.capacidad ?? 0,
        equipos: aulaBackend.equipos ?? '',
        descripcion: aulaBackend.descripcion ?? '',
        tipo: aulaBackend.tipo ?? 'AULA DE CLASE',
        estado: aulaBackend.estado ?? 'DISPONIBLE'
    };
};

export const aulaApi = {
    getAulas: async (): Promise<AulaResponseDTO[]> => {
        try {
            const response = await axios.get(`${API_URL}/aulas`);
            const aulasMapeados = response.data.map(mapearAulaBackend);
            return aulasMapeados;
        } catch (error) {
            console.error("Error fetching aulas:", error);
            throw error;
        }
    },
    createAula: async (aula: RegistrarAula): Promise<AulaResponseDTO> => {
        try {
            const response = await axios.post(`${API_URL}/aulas/register`, aula);
            return response.data;
        } catch (error) {
            console.error("Error creating aula:", error);
            throw error;
        }
    },
    updateAula: async (id_aula: number, aula: PartialAula): Promise<AulaResponseDTO> => {
        try {
            console.log('🔍 ID recibido en el servicio:', id_aula, typeof id_aula);
            
            // Validación más robusta del ID
            const id = Number(id_aula);
            if (!id || isNaN(id) || id <= 0) {
                console.error('❌ ID inválido:', { original: id_aula, converted: id });
                throw new Error(`ID de aula inválido: ${id_aula}`);
            }

            const dataToSend = {
                ...aula,
                id_aula: id,
                
            };

            console.log('📤 Datos a enviar:', dataToSend);
            const response = await axios.put(`${API_URL}/aulas/${id}`, dataToSend);
            
            console.log('📥 Respuesta del update:', response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Error updating aula:", error);
            throw error;
        }
    },
    toggleEstadoAula: async (id_aula: number, estado: boolean) => {
        try {
            console.log('Enviando estado:', { id_aula, estado });
            // Asegurarnos de que el ID sea un número
            const id = Number(id_aula);
            if (isNaN(id)) {
                throw new Error('ID de aula inválido');
            }
            // Convertir el booleano a string esperado por el modelo
            const estadoStr = estado ? 'DISPONIBLE' : 'OCUPADO';
            // Enviar el estado como query parameter
            const url = `${API_URL}/aulas/estado/${id}?estado=${estadoStr}`;
            console.log('URL de la petición:', url);
            const response = await axios.put(url);
            console.log('Respuesta del servidor:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error al cambiar estado:', error);
            throw error;
        }
    },
    getAulasOcupadas: async (): Promise<AulaResponseDTO[]> => {
        try {
            console.log('📥 Fetching inactive teachers...');
            const response = await axios.get(`${API_URL}/aulas/list/ocupadas`);
            console.log('📦 Raw response data:', response.data);
            const aulasMapeados = response.data.map((aula: any) => {
                console.log('🔄 Mapping teacher:', aula);
                const mapeado = mapearAulaBackend(aula);
                // Forzar el estado a false para inactivos
                mapeado.estado = EstadoAula.OCUPADO;
                console.log('✅ Mapped result:', mapeado);
                return mapeado;
            });
            return aulasMapeados;
        } catch (error) {
            console.error("❌ Error fetching aulas inactivas:", error);
            throw error;
        }
    }
}
