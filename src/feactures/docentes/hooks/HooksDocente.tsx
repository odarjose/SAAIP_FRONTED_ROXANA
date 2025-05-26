import { useEffect } from 'react';
import { useDocenteStore } from '../store/StoreDocente';


export const useDocentes = () => {
  const {
    profesores,
    loading,
    error,
    fetchProfesores,
    createProfesor, // ✅ Usa el del store directamente
    searchTerm,
    setSearchTerm
  } = useDocenteStore();

  useEffect(() => {
    fetchProfesores();
  }, [fetchProfesores]);

  const filteredProfesores = profesores.filter((profesor) =>
    `${profesor.nombres} ${profesor.apellidos} ${profesor.tipo_docencia}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return {
    profesores: filteredProfesores,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    createProfesor, // ✅ expone el método del store, no uno nuevo
  };
};
