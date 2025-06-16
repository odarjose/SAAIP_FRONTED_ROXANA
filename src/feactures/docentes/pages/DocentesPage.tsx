import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../shared/components/Card";
import { Button } from "../../../shared/components/Button";
import { Input } from "../../../shared/components/Input";
import { BookOpen, Plus, Search, Settings } from "lucide-react";
import { DocentesList } from "../pages/DocentesListPage";
import { useDocentes } from "../hooks/HooksDocente";
import toast from "react-hot-toast";
import { Select } from "../../../shared/components/Select";
import { SelectOption } from "../../../shared/interface/Interfaces";
import { useDocenteStore } from '../store/StoreDocente';
import { DocenteResponseDTO, PartialDocente } from '../interface/InterfaceDocente';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../shared/components/Dialog';
import { DocentesModalForm, DocenteUpdateForm } from "../pages/DocenteFormPage";
import { formatDate } from '../../../shared/lib/Utils';
import { ReportButton } from "../../../shared/components/ReportButton";
import { generatePDFReport } from "../../../shared/lib/reportUtils";

const DocentesPage: React.FC = () => {
  const {
    profesores,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    createProfesor,
    estadoFiltro,
    setEstadoFiltro,
    pagina,
    setPagina,
    totalPaginas,
    totalFiltrados,
  } = useDocentes();

  const {
    updateProfesor,
    toggleEstadoProfesor,
    
  } = useDocenteStore();

  // Opciones para el filtro de estado
  const estadoOptions: SelectOption[] = [
    { value: "todos", label: "Todos" },
    { value: "activos", label: "Activos" },
    { value: "inactivos", label: "Inactivos" },
  ];

  // Estado para modal de detalle y edición
  const [detalleDocente, setDetalleDocente] = useState<DocenteResponseDTO | null>(null);
  const [editandoDocente, setEditandoDocente] = useState<DocenteResponseDTO | null>(null);
  const [, setEditId] = useState<number | null>(null); // Nuevo estado para el id
  const [, setEditForm] = useState<PartialDocente>({});
  const [, setEditError] = useState<string | null>(null);
  

  // Estado para modal de registro
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handler para ver detalle
  const handleVer = (profesor: DocenteResponseDTO) => {
    setDetalleDocente(profesor);
  };

  // Handler para cerrar modal de detalle
  const handleCerrarDetalle = () => setDetalleDocente(null);

  // Handler para editar
  const handleEditar = (profesor: DocenteResponseDTO) => {
    console.log('ID del docente a editar:', profesor.id_docente); // Agregar log para debug
    setEditandoDocente(profesor);
    setEditId(profesor.id_docente);
    setEditForm({ ...profesor });
    setEditError(null);
  };
  const handleCerrarEditar = () => {
    setEditandoDocente(null);
    setEditId(null); // Limpiar el id
    setEditForm({});
    setEditError(null);
  };
  // Handler para guardar edición
  const handleGuardarEdicion = async (id: number, data: PartialDocente) => {
    console.log('Guardando edición con ID:', id); // Agregar log para debug
    try {
      if (!id || isNaN(id)) {
        throw new Error('ID de docente inválido');
      }
      await updateProfesor(id, data);
      toast.success('Docente actualizado');
      handleCerrarEditar();
      return { success: true };
    } catch (err) {
      console.error('Error en handleGuardarEdicion:', err); // Agregar log para debug
      return { success: false, error: 'Error al actualizar docente' };
    }
  };
  // Handler para cambiar estado
  const handleToggleEstado = async (id: number, nuevoEstado: boolean) => {
    try {
      await toggleEstadoProfesor(id, nuevoEstado);
      // La lista se actualizará automáticamente gracias al store
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      // Mostrar mensaje de error al usuario
      alert('Error al cambiar el estado del profesor');
    }
  };
  // Handler para registrar docente
  const handleSubmitDocente = async (data: any) => {
    try {
      await createProfesor(data);
      toast.success("Docente registrado correctamente");
      setIsModalOpen(false);
      return { success: true };
    } catch (error) {
      toast.error("Error al registrar el docente");
      return { success: false, error: "Error al registrar el docente" };
    }
  };

  const handleGenerateReport = () => {
    const headers = [
      "ID",
      "Nombres",
      "Apellidos",
      "DNI",
      "Email",
      "Teléfono",
      "Tipo Docencia",
      "Tipo Contrato",
      "Fecha Inicio",
      "Fecha Fin",
      "Estado"
    ];

    const reportData = profesores.map(docente => ({
      id: docente.id_docente,
      nombres: docente.nombres,
      apellidos: docente.apellidos,
      dni: docente.dni,
      email: docente.e_mail || 'No especificado',
      telefono: docente.telefono || 'No especificado',
      tipo_docencia: docente.tipo_docencia || 'No especificado',
      tipo_contrato: docente.tipo_contrato || 'No especificado',
      fecha_inicio: formatDate(docente.fecha_inicio_contrato, 'dd/MM/yyyy') || 'No especificada',
      fecha_fin: formatDate(docente.fecha_fin_contrato, 'dd/MM/yyyy') || 'No especificada',
      estado: docente.estado ? 'Activo' : 'Inactivo'
    }));

    generatePDFReport({
      title: "Reporte de Docentes",
      headers,
      data: reportData,
      filters: {
        Estado: estadoFiltro !== 'todos' ? estadoOptions.find(e => e.value === estadoFiltro)?.label || '' : '',
        Búsqueda: searchTerm || ''
      }
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            Gestión de Profesores
          </h1>
          <p className="text-secondary-600">
            Administración del personal docente
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2 w-full md:w-auto">
          <ReportButton onClick={handleGenerateReport} />
          <Button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto">
            <Plus size={16} className="mr-2" />
            Nuevo Profesor
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen size={20} className="mr-2 text-primary-600" />
            Listado de Profesores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-2">
            <div className="relative mb-4 md:mb-0 w-full md:w-64">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"
                size={18}
              />
              <Input
                placeholder="Buscar profesor..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Buscar profesores por nombre o especialidad"
              />
            </div>
            <div className="flex space-x-2 items-center">
              <Select
                options={estadoOptions}
                value={estadoFiltro}
                onChange={(e) =>
                  setEstadoFiltro(
                    e.target.value as "todos" | "activos" | "inactivos"
                  )
                }
                label="Estado"
                className="w-36"
              />
              <Button variant="outline" size="sm">
                <Settings size={16} className="mr-1" />
                Filtrar
              </Button>
            </div>
          </div>

          {loading && <p className="text-secondary-600">Cargando...</p>}
          {error && <p className="text-error-600">{error}</p>}
          {!loading && !error && (
            <DocentesList
              profesores={profesores}
              onVer={handleVer}
              onEditar={handleEditar}
              onToggleEstado={handleToggleEstado}
            />
          )}

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-secondary-500">
              Mostrando {profesores.length} de {totalFiltrados} profesores
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagina(pagina - 1)}
                disabled={pagina === 1}
              >
                Anterior
              </Button>
              <span className="text-sm px-2">
                Página {pagina} de {totalPaginas}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagina(pagina + 1)}
                disabled={pagina === totalPaginas || totalPaginas === 0}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Modal de registro */}
      <DocentesModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitDocente}
      />
      {/* Modal de detalle */}
      <Dialog open={!!detalleDocente} onOpenChange={handleCerrarDetalle}>
        <DialogContent className="max-w-lg w-full sm:w-[95vw] md:w-[500px] bg-white rounded-2xl shadow-lg px-6 py-8 border border-secondary-200">
          <DialogHeader>
            <DialogTitle>Detalle del Docente</DialogTitle>
          </DialogHeader>
          {detalleDocente && (
            <div className="space-y-3 text-sm md:text-base px-1 md:px-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                <div><b>Nombre:</b> {detalleDocente.nombres} {detalleDocente.apellidos}</div>
                <div><b>Email:</b> {detalleDocente.e_mail || 'No especificado'}</div>
                <div><b>Teléfono:</b> {detalleDocente.telefono || 'No especificado'}</div>
                <div><b>DNI:</b> {detalleDocente.dni || 'No especificado'}</div>
                <div><b>Dirección:</b> {detalleDocente.direccion || 'No especificada'}</div>
                <div><b>Tipo Docencia:</b> {detalleDocente.tipo_docencia || 'No especificado'}</div>
                <div><b>Tipo Contrato:</b> {detalleDocente.tipo_contrato || 'No especificado'}</div>
                <div><b>Fecha Inicio:</b> {formatDate(detalleDocente.fecha_inicio_contrato, 'dd/MM/yyyy') || 'No especificada'}</div>
                <div><b>Fecha Fin:</b> {formatDate(detalleDocente.fecha_fin_contrato, 'dd/MM/yyyy') || 'No especificada'}</div>
                <div><b>Estado:</b> {detalleDocente.estado ? 'Activo' : 'Inactivo'}</div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={handleCerrarDetalle}>Cerrar</Button>
                <Button 
                  variant={detalleDocente.estado ? "error" : "success"}
                  onClick={() => handleToggleEstado(detalleDocente.id_docente, detalleDocente.estado)}
                >
                  {detalleDocente.estado ? 'Desactivar' : 'Activar'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Modal de edición */}
      <DocenteUpdateForm
        isOpen={!!editandoDocente}
        onClose={handleCerrarEditar}
        onSubmit={handleGuardarEdicion}
        docente={editandoDocente}
      />
    </div>
  );
};

export default DocentesPage;