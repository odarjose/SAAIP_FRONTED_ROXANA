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
import { DocentesModalForm } from "../pages/DocenteFormPage";
import { useDocentes } from "../hooks/HooksDocente";
import toast from "react-hot-toast";

const DocentesPage: React.FC = () => {
  const {
    profesores,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    createProfesor,
  } = useDocentes();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmitDocente = async (data: any) => {
    try {
      await createProfesor(data);
      toast.success("Docente registrado correctamente");
      setIsModalOpen(false); // ✅ Cerrar modal aquí después del éxito
      return { success: true };
    } catch (error) {
      console.error("Error al registrar docente:", error);
      toast.error("Error al registrar el docente");
      return { success: false, error: "Error al registrar el docente" };
    }
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
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button onClick={() => setIsModalOpen(true)}>
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
          <div className="flex flex-col md:flex-row justify-between mb-6">
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
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Settings size={16} className="mr-1" />
                Filtrar
              </Button>
            </div>
          </div>

          {loading && <p className="text-secondary-600">Cargando...</p>}
          {error && <p className="text-error-600">{error}</p>}
          {!loading && !error && <DocentesList profesores={profesores} />}

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-secondary-500">
              Mostrando {profesores.length} de {profesores.length} profesores
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>
                Anterior
              </Button>
              <Button variant="outline" size="sm" disabled>
                Siguiente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <DocentesModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitDocente} // ✅ Usar la función separada
      />
    </div>
  );
};

export default DocentesPage;