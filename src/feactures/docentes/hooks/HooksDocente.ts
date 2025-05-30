import { useEffect, useState } from 'react';
import { useDocenteStore } from '../store/StoreDocente';
import { DocenteResponseDTO, RegistrarDocente, PartialDocente } from '../interface/InterfaceDocente';

export const useDocentes = () => {
  const store = useDocenteStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalFiltrados, setTotalFiltrados] = useState(0);

  // Cargar profesores al montar el componente y cuando cambie el filtro
  useEffect(() => {
    store.fetchProfesores();
  }, [store.estadoFiltro]);

  // Actualizar la búsqueda cuando cambie el término de búsqueda
  useEffect(() => {
    store.setSearchTerm(searchTerm);
    store.fetchProfesores();
  }, [searchTerm]);

  // Actualizar totales cuando cambien los profesores
  useEffect(() => {
    setTotalFiltrados(store.profesores.length);
    setTotalPaginas(Math.ceil(store.profesores.length / 10));
  }, [store.profesores]);

  // Paginar resultados
  const profesores = store.profesores.slice((pagina - 1) * 10, pagina * 10);

  return {
    profesores,
    loading: store.loading,
    error: store.error,
    searchTerm,
    setSearchTerm,
    createProfesor: store.createProfesor,
    estadoFiltro: store.estadoFiltro,
    setEstadoFiltro: store.setEstadoFiltro,
    pagina,
    setPagina,
    totalPaginas,
    totalFiltrados,
    refreshProfesores: store.fetchProfesores
  };
}; 