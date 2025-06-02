import axios from "axios";

import { AsistenciaResponseDTO,PartialAsistencia,RegisterAsistencia, } from "../types/Asistencia";


const API_URL = import.meta.env.VITE_API_URL;

const mapearAsistenciaBackend = (asistenciaBackend: any): AsistenciaResponseDTO => {
    return {
      idDocenteTurno: asistenciaBackend.idDocenteTurno ?? 0,
      idDocente: asistenciaBackend.idDocente ?? 0,
      fecha: asistenciaBackend.fecha ?? '',
      hora_entrada: asistenciaBackend.hora_entrada ?? '',
      hora_salida: asistenciaBackend.hora_salida ?? '',
      tiempo_uso: asistenciaBackend.tiempo_uso ?? 0,
      estado: asistenciaBackend.estado ?? false,
      
  
      // Información del docente
      docente_idDocente: asistenciaBackend.docente_idDocente ?? 0,
      docente_idUsuario: asistenciaBackend.docente_idUsuario ?? 0,
      docente_tipo_docencia: asistenciaBackend.docente_tipo_docencia ?? '',
      docente_tipo_contrato: asistenciaBackend.docente_tipo_contrato ?? '',
      docente_fecha_inicio_contrato: asistenciaBackend.docente_fecha_inicio_contrato ?? '',
      docente_fecha_fin_contrato: asistenciaBackend.docente_fecha_fin_contrato ?? '',
      docente_estado: asistenciaBackend.docente_estado ?? false,
  
      // Información del usuario
      usuario_idUsuario: asistenciaBackend.usuario_idUsuario ?? 0,
      usuario_nombres: asistenciaBackend.usuario_nombres ?? '',
      usuario_apellidos: asistenciaBackend.usuario_apellidos ?? '',
      usuario_dni: asistenciaBackend.usuario_dni ?? '',
      usuario_telefono: asistenciaBackend.usuario_telefono ?? '',
      usuario_direccion: asistenciaBackend.usuario_direccion ?? '',
      usuario_fecha_nacimiento: asistenciaBackend.usuario_fecha_nacimiento ?? '',
      usuario_e_mail: asistenciaBackend.usuario_e_mail ?? '',
      usuario_estado: asistenciaBackend.usuario_estado ?? false
    };
  };

export interface Docente {
  idDocente: number;
  idUsuario: number;
  nombres: string;
  apellidos: string;
  dni: string;
  estado: boolean;
}

export const asistenciaApi = {
    getAsistencias: async (): Promise<AsistenciaResponseDTO[]> => {
        const response = await axios.get(`${API_URL}/asistencias/list`);
        const asistenciasMapeadas = response.data.map(mapearAsistenciaBackend);
        return asistenciasMapeadas;
    },

    getDocentes: async (): Promise<Docente[]> => {
        const response = await axios.get(`${API_URL}/docentes/list`);
        return response.data.map((docente: any) => ({
            idDocente: docente.idDocente,
            idUsuario: docente.idUsuario,
            nombres: docente.nombres,
            apellidos: docente.apellidos,
            dni: docente.dni,
            estado: docente.estado
        }));
    },

    createAsistencia: async (asistencia: RegisterAsistencia): Promise<AsistenciaResponseDTO> => {
        const response = await axios.post(`${API_URL}/asistencias/register`, asistencia);
        return response.data;
    },

    updateAsistencia: async (id_asistencia: number, asistencia: PartialAsistencia): Promise<AsistenciaResponseDTO> => {
        const id = Number(id_asistencia);
        if (!id || isNaN(id) || id <= 0) {
            throw new Error(`ID de asistencia inválido: ${id_asistencia}`);
        }

        const dataToSend = {
            ...asistencia,
            idAsistencia: id,
        };

        console.log('📤 Datos a enviar:', dataToSend);
        const response = await axios.put(`${API_URL}/asistencias/${id}`, dataToSend);
        
        console.log('📥 Respuesta del update:', response.data);
        return response.data;
    },
}

export const turnoApi = {
    getTurnos: async (): Promise<AsistenciaResponseDTO[]> => {
        try {
            const response = await axios.get(`${API_URL}/turnos/list`);
            const turnosMapeados = response.data.map(mapearAsistenciaBackend);
            return turnosMapeados;
        } catch (error) {
            console.error("Error fetching turnos:", error);
            throw error;
        }
    },
    createTurno: async (turno: RegisterAsistencia): Promise<AsistenciaResponseDTO> => {
        try {
            const response = await axios.post(`${API_URL}/turnos/register`, turno);
            return response.data;
        } catch (error) {
            console.error("Error creating turno:", error);
            throw error;
        }
    },
    updateTurno: async (id_turno: number, turno: PartialAsistencia): Promise<AsistenciaResponseDTO> => {
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
                idDocenteTurno: id,
                
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