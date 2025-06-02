import axios from "axios";

import { TurnoResponseDTO,PartialTurno,RegisterTurno, } from "../interface/InterfaceTurnos";


const API_URL = import.meta.env.VITE_API_URL;

const mapearTurnoBackend = (turnoBackend: any): TurnoResponseDTO => {
    return {
      idDocenteTurno: turnoBackend.idDocenteTurno ?? 0,
      idDocente: turnoBackend.idDocente ?? 0,
      fecha_asignacion: turnoBackend.fecha_asignacion ?? '',
      estado: turnoBackend.estado ?? false,
      tipo_turno: turnoBackend.tipo_turno ?? '',
      hora_inicio: turnoBackend.hora_inicio ?? '',
      hora_fin: turnoBackend.hora_fin ?? '',
      grado: turnoBackend.grado ?? 0,
      seccion: turnoBackend.seccion ?? '',
  
      // Información del docente
      docente_idDocente: turnoBackend.docente_idDocente ?? 0,
      docente_idUsuario: turnoBackend.docente_idUsuario ?? 0,
      docente_tipo_docencia: turnoBackend.docente_tipo_docencia ?? '',
      docente_tipo_contrato: turnoBackend.docente_tipo_contrato ?? '',
      docente_fecha_inicio_contrato: turnoBackend.docente_fecha_inicio_contrato ?? '',
      docente_fecha_fin_contrato: turnoBackend.docente_fecha_fin_contrato ?? '',
      docente_estado: turnoBackend.docente_estado ?? false,
  
      // Información del usuario
      usuario_idUsuario: turnoBackend.usuario_idUsuario ?? 0,
      usuario_nombres: turnoBackend.usuario_nombres ?? '',
      usuario_apellidos: turnoBackend.usuario_apellidos ?? '',
      usuario_dni: turnoBackend.usuario_dni ?? '',
      usuario_telefono: turnoBackend.usuario_telefono ?? '',
      usuario_direccion: turnoBackend.usuario_direccion ?? '',
      usuario_fecha_nacimiento: turnoBackend.usuario_fecha_nacimiento ?? '',
      usuario_e_mail: turnoBackend.usuario_e_mail ?? '',
      usuario_estado: turnoBackend.usuario_estado ?? false
    };
  };

export const turnoApi={
    getTurnos: async (): Promise<TurnoResponseDTO[]> => {
        try {
            const response = await axios.get(`${API_URL}/turnos/list`);
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