import axios from "axios";

import { RegistrarDocente, PartialDocente,DocenteResponseDTO } from "../interface/InterfaceDocente";


const API_URL = import.meta.env.VITE_API_URL;

const mapearDocenteBackend = (docenteBackend: any): DocenteResponseDTO => {
    return {
        id_docente: docenteBackend.idDocente ?? docenteBackend.id_docente ?? 0,
        id_usuario: docenteBackend.idUsuario ?? docenteBackend.id_usuario ?? 0,
        nombres: docenteBackend.nombres ?? '',
        apellidos: docenteBackend.apellidos ?? '',
        direccion: docenteBackend.direccion ?? '',
        fecha_nacimiento: docenteBackend.fechaNacimiento ?? docenteBackend.fecha_nacimiento ?? '',
        contraseña: docenteBackend.contraseña ?? '',
        e_mail: docenteBackend.eMail ?? docenteBackend.e_mail ?? '',
        telefono: docenteBackend.telefono ?? '',
        dni: docenteBackend.dni ?? '',
        tipo_docencia: docenteBackend.tipoDocencia ?? docenteBackend.tipo_docencia ?? 'UNIDOCENCIA',
        fecha_inicio_contrato: docenteBackend.fechaInicioContrato ?? docenteBackend.fecha_inicio_contrato ?? '',
        fecha_fin_contrato: docenteBackend.fechaFinContrato ?? docenteBackend.fecha_fin_contrato ?? '',
        tipo_contrato: docenteBackend.tipoContrato ?? docenteBackend.tipo_contrato ?? 'NOMBRAMIENTO',
        estado: docenteBackend.estado ?? false
    };
};



export const docenteApi = {
    getProfesores: async (): Promise<DocenteResponseDTO[]> => {
   
        try {
            const response = await axios.get(`${API_URL}/docentes/con_usuario`);
            const docentesMapeados = response.data.map(mapearDocenteBackend);
            return docentesMapeados;
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

    updateDocente: async (id_docente: number, docente: PartialDocente): Promise<DocenteResponseDTO> => {
        try {
            console.log('🔍 ID recibido en el servicio:', id_docente, typeof id_docente);
            
            // Validación más robusta del ID
            const id = Number(id_docente);
            if (!id || isNaN(id) || id <= 0) {
                console.error('❌ ID inválido:', { original: id_docente, converted: id });
                throw new Error(`ID de docente inválido: ${id_docente}`);
            }

            const dataToSend = {
                ...docente,
                id_docente: id,
                id_usuario: docente.id_usuario,
                contraseña: docente.contraseña || ''
            };

            console.log('📤 Datos a enviar:', dataToSend);
            const response = await axios.put(`${API_URL}/docentes/${id}`, dataToSend);
            
            console.log('📥 Respuesta del update:', response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Error updating docente:", error);
            throw error;
        }
    },


    // Inhabilitar/habilitar docente (cambiar estado)
    toggleEstado: async (id_docente: number, estado: boolean) => {
        try {
            console.log('Enviando estado:', { id_docente, estado });
            // Asegurarnos de que el ID sea un número
            const id = Number(id_docente);
            if (isNaN(id)) {
                throw new Error('ID de docente inválido');
            }
            // Enviar el estado como query parameter
            const url = `${API_URL}/docentes/estado/${id}?estado=${estado}`;
            console.log('URL de la petición:', url);
            const response = await axios.put(url);
            console.log('Respuesta del servidor:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error al cambiar estado:', error);
            throw error;
        }
    },

    getProfesoresInactivos: async (): Promise<DocenteResponseDTO[]> => {
        try {
            console.log('📥 Fetching inactive teachers...');
            const response = await axios.get(`${API_URL}/docentes/list/inactivos`);
            console.log('📦 Raw response data:', response.data);
            const docentesMapeados = response.data.map((docente: any) => {
                console.log('🔄 Mapping teacher:', docente);
                const mapeado = mapearDocenteBackend(docente);
                // Forzar el estado a false para inactivos
                mapeado.estado = false;
                console.log('✅ Mapped result:', mapeado);
                return mapeado;
            });
            return docentesMapeados;
        } catch (error) {
            console.error("❌ Error fetching docentes inactivos:", error);
            throw error;
        }
    }
}