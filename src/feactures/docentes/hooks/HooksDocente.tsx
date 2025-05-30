import { useEffect, useState } from 'react';
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

  // Estado para filtro de estado y paginación
  const [estadoFiltro, setEstadoFiltro] = useState<'todos' | 'activos' | 'inactivos'>('todos');
  const [pagina, setPagina] = useState(1);
  const porPagina = 6;

  useEffect(() => {
    fetchProfesores();
  }, [fetchProfesores]);

  // Filtrado por texto y estado
  const filteredProfesores = profesores.filter((profesor) => {
    const coincideBusqueda = `${profesor.nombres} ${profesor.apellidos} ${profesor.tipo_docencia}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const coincideEstado =
      estadoFiltro === 'todos' ? true : estadoFiltro === 'activos' ? profesor.estado : !profesor.estado;
    return coincideBusqueda && coincideEstado;
  });

  // Paginación
  const totalPaginas = Math.ceil(filteredProfesores.length / porPagina);
  const paginados = filteredProfesores.slice((pagina - 1) * porPagina, pagina * porPagina);

  // Cambio de página seguro
  const setPaginaSeguro = (nueva: number) => {
    if (nueva < 1 || nueva > totalPaginas) return;
    setPagina(nueva);
  };

  // Resetear página al cambiar filtro
  useEffect(() => {
    setPagina(1);
  }, [searchTerm, estadoFiltro]);

  return {
    profesores: paginados,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    createProfesor, // ✅ expone el método del store, no uno nuevo
    estadoFiltro,
    setEstadoFiltro,
    pagina,
    setPagina: setPaginaSeguro,
    totalPaginas,
    totalFiltrados: filteredProfesores.length
  };
};
