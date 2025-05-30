import { useState, useEffect } from "react";
import { docenteApi } from "../services/ServiceDocente";
import { DocenteResponseDTO } from "../interface/InterfaceDocente";

export type FilterType = 'all' | 'active' | 'inactive';

export const useDocentes = (filter: FilterType = 'all') => {
    const [docentes, setDocentes] = useState<DocenteResponseDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDocentes = async () => {
        try {
            setLoading(true);
            setError(null);
            let data: DocenteResponseDTO[] = [];

            switch (filter) {
                case 'active':
                    data = await docenteApi.getProfesores();
                    data = data.filter(docente => docente.estado);
                    break;
                case 'inactive':
                    data = await docenteApi.getProfesoresInactivos();
                    break;
                default:
                    data = await docenteApi.getProfesores();
            }

            setDocentes(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar los docentes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocentes();
    }, [filter]);

    const refreshDocentes = () => {
        fetchDocentes();
    };

    return {
        docentes,
        loading,
        error,
        refreshDocentes
    };
}; 