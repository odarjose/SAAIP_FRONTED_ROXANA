import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../shared/components/Card";

import { Button } from "../../../shared/components/Button";
import { Input } from "../../../shared/components/Input";
import { Badge } from "../../../shared/components/Badge";
import { Building2, Plus, Search, Pencil} from "lucide-react";
import { AulaFormModal } from "./AulaFormPage";
import { useAulaStore } from "../strore/storeAulas";
import { AulaResponseDTO, RegistrarAula, PartialAula, EstadoAula, TipoAula } from "../types/interfaceAulas";
import { Select } from '../../../shared/components/Select';

const AulasPage: React.FC = () => {
  const {
    aulas,
    createAula,
    updateAula,
    setEstadoFiltro,
    estadoFiltro,
    toggleEstadoAula,
    fetchAulas,
  } = useAulaStore();

  // Al montar, asegurar que el filtro esté en 'todas' (como en docentes)
  useEffect(() => {
    setEstadoFiltro('todas');
  }, [setEstadoFiltro]);

  useEffect(() => {
    fetchAulas();
  }, [estadoFiltro]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editandoAula, setEditandoAula] = useState<AulaResponseDTO | null>(null);

  // Filtrado por nombre y estado
  const aulasFiltradas = aulas.filter((aula) => {
    if (estadoFiltro === 'todas') {
      if (searchTerm.trim() === '') {
        return true;
      }
      return aula.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    }
    const matchesSearch = aula.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado =
      (estadoFiltro === 'disponibles' && aula.estado === EstadoAula.DISPONIBLE) ||
      (estadoFiltro === 'ocupados' && aula.estado === EstadoAula.OCUPADO);
    return matchesSearch && matchesEstado;
  });

  // Opciones de filtro
  const estadoOptions = [
    { value: 'todas', label: 'Todas' },
    { value: 'disponibles', label: 'Disponibles' },
    { value: 'ocupados', label: 'Ocupadas' },
  ];

  // Handlers
  const handleOpenNuevo = () => {
    setEditandoAula(null);
    setIsModalOpen(true);
  };
  const handleEditar = (aula: AulaResponseDTO) => {
    setEditandoAula(aula);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setEditandoAula(null);
    setIsModalOpen(false);
  };
  const handleSubmitAula = async (data: RegistrarAula | PartialAula, isEdit?: boolean) => {
    try {
      if (isEdit && editandoAula) {
        await updateAula(editandoAula.id_aula, data as PartialAula);
        setIsModalOpen(false);
        return { success: true };
      } else {
        await createAula(data as RegistrarAula);
        setIsModalOpen(false);
        return { success: true };
      }
    } catch (error) {
      return { success: false, error: 'Error al guardar el aula' };
    }
  };

  const getEstadoBadge = (estado: EstadoAula) => {
    switch (estado) {
      case EstadoAula.DISPONIBLE:
        return <Badge variant="success">Disponible</Badge>;
      case EstadoAula.OCUPADO:
        return <Badge variant="warning">Ocupada</Badge>;
      default:
        return <Badge>Desconocido</Badge>;
    }
  };
  const getTipoBadge = (tipo: TipoAula) => {
    switch (tipo) {
      case TipoAula.AULA_DE_CLASE:
        return <Badge variant="primary">Aula de Clase</Badge>;
      case TipoAula.AULA_DE_INNOVACION:
        return <Badge variant="secondary">Aula de Innovación</Badge>;
      default:
        return <Badge>Otro</Badge>;
    }
  };

  // Nuevo handler para cambiar estado como en docentes
  const handleToggleEstado = (aula: AulaResponseDTO) => {
    toggleEstadoAula(aula.id_aula, aula.estado !== EstadoAula.DISPONIBLE);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            Gestión de Aulas
          </h1>
          <p className="text-secondary-600">
            Administración de aulas y espacios educativos
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button onClick={handleOpenNuevo}>
            <Plus size={16} className="mr-2" />
            Nueva Aula
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 size={20} className="mr-2 text-primary-600" />
            Listado de Aulas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div className="relative mb-4 md:mb-0 w-full md:w-64">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"
                size={18}
              />
              <Input
                placeholder="Buscar aula..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2 items-center">
              <Select
                options={estadoOptions}
                value={estadoFiltro}
                onChange={e => setEstadoFiltro(e.target.value as 'todas' | 'disponibles' | 'ocupados')}
                label="Estado"
                className="w-36"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aulasFiltradas.map((aula) => (
              <Card key={aula.id_aula} className="overflow-hidden hover:shadow-md transition-shadow card-hover">
                <div
                  className={`h-2 w-full ${
                    aula.estado === EstadoAula.DISPONIBLE
                      ? "bg-success-500"
                      : aula.estado === EstadoAula.OCUPADO
                        ? "bg-warning-500"
                        : "bg-error-500"
                  }`}
                />
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{aula.nombre}</h3>
                    <div className="flex space-x-1">{getEstadoBadge(aula.estado)}</div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {getTipoBadge(aula.tipo)}
                    <Badge variant="secondary">{aula.capacidad} personas</Badge>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-secondary-500 mb-1">
                      Equipos:
                    </p>
                    <span className="inline-block px-2 py-1 text-xs bg-secondary-100 rounded-md text-secondary-600">
                      {aula.equipos}
                    </span>
                  </div>

                  <div className="mt-2 text-xs text-secondary-700">
                    <b>Descripción:</b> {aula.descripcion}
                  </div>

                  <div className="flex justify-between mt-4 pt-3 border-t border-secondary-200">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-secondary-700"
                      onClick={() => handleEditar(aula)}
                    >
                      <Pencil size={14} className="mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={aula.estado === EstadoAula.DISPONIBLE ? 'text-warning-600' : 'text-success-600'}
                      onClick={() => handleToggleEstado(aula)}
                    >
                      {aula.estado === EstadoAula.DISPONIBLE ? 'Ocupar' : 'Liberar'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      <AulaFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitAula}
        aula={editandoAula}
      />
    </div>
  );
};

export default AulasPage;
