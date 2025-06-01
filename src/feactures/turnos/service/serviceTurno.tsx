import axios from "axios";

import { TurnoResponseDTO,PartialTurno,RegisterTurno, } from "../interface/InterfaceTurnos";


const API_URL = import.meta.env.VITE_API_URL;

const mapearTurnoBackend = (turnoBackend: any): TurnoResponseDTO => {
    return {
        id_turno: turnoBackend.idTurno ?? turnoBackend.id_turno ?? 0,
        nombre: turnoBackend.nombre ?? '',
        hora_inicio: turnoBackend.hora_inicio ?? '',
        hora_fin: turnoBackend.hora_fin ?? '',
        grado: turnoBackend.grado ?? '',
        seccion: turnoBackend.seccion ?? '',
    };
}

export const turnoApi={
    getTurnos: async (): Promise<TurnoResponseDTO[]> => {
        try {
            const response = await axios.get(`${API_URL}/turnos`);
            const turnosMapeados = response.data.map(mapearTurnoBackend);
            return turnosMapeados;
        } catch (error) {
            console.error("Error fetching turnos:", error);
            throw error;
        }
    },
    createTurno: async (turno: RegisterTurno): Promise<TurnoResponseDTO> => {
        try {
            const response = await axios.post(`${API_URL}/turnos/register`, turno);
            return response.data;
        } catch (error) {
            console.error("Error creating turno:", error);
            throw error;
        }
    },
    updateTurno: async (id_turno: number, turno: PartialTurno): Promise<TurnoResponseDTO> => {
        try {
            console.log('🔍 ID recibido en el servicio:', id_turno, typeof id_turno);
            
            // Validación más robusta del ID
            const id = Number(id_turno);
            if (!id || isNaN(id) || id <= 0) {
                console.error('❌ ID inválido:', { original: id_turno, converted: id });
                throw new Error(`ID de turno inválido: ${id_turno}`);
            }

            const dataToSend = {
                ...turno,
                id_turno: id,
                
            };

            console.log('📤 Datos a enviar:', dataToSend);
            const response = await axios.put(`${API_URL}/turnos/${id}`, dataToSend);
            
            console.log('📥 Respuesta del update:', response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Error updating turno:", error);
            throw error;
        }
    },
   
}