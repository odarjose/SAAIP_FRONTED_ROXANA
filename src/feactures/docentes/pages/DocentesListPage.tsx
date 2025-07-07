import { Card, CardContent} from '../../../shared/components/Card';
import { Badge } from "../../../shared/components/Badge";
import { Avatar } from "../../../shared/components/Avatar";
import { Button } from '../../../shared/components/Button';
import { Mail, Phone, FileText, Calendar, Pencil, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import { formatDate } from '../../../shared/lib/Utils';
import { DocenteResponseDTO } from '../interface/InterfaceDocente';

interface DocentesListProps {
  profesores: DocenteResponseDTO[];
  onVer?: (profesor: DocenteResponseDTO) => void;
  onEditar?: (profesor: DocenteResponseDTO) => void;
  onToggleEstado?: (id_docente: number, estado: boolean) => void;
}

export const DocentesList: React.FC<DocentesListProps> = ({ profesores, onVer, onEditar, onToggleEstado }) => {
  console.log('📋 Rendering teachers list with data:', profesores);

  const getEstadoBadge = (estado: boolean) => {
    return estado ? (
      <Badge variant="success">Activo</Badge>
    ) : (
      <Badge variant="secondary">Inactivo</Badge>
    );
  };

  const handleToggleEstado = (profesor: DocenteResponseDTO) => {
    console.log('🔄 Toggling state for teacher:', profesor);
    if (onToggleEstado) {
      onToggleEstado(profesor.id_docente, !profesor.estado);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {profesores.map((profesor) => {
        console.log('🎯 Rendering teacher card:', profesor);
        return (
          <Card key={profesor.id_docente} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className={`h-2 w-full ${profesor.estado ? 'bg-success-500' : 'bg-secondary-300'}`} />
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <Avatar name={profesor.nombres} surname={profesor.apellidos} size="md" />
                  <div className="ml-3">
                    <h3 className="font-semibold text-lg">
                      {profesor.nombres} {profesor.apellidos}
                    </h3>
                    <p className="text-sm text-secondary-600">{profesor.tipo_docencia}</p>
                  </div>
                </div>
                {getEstadoBadge(
                  typeof profesor.estado === "boolean"
                    ? profesor.estado
                    : profesor.estado === "activo"
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center text-secondary-600">
                  <Mail size={16} className="mr-2" />
                  {profesor.e_mail}
                </div>
                <div className="flex items-center text-secondary-600">
                  <Phone size={16} className="mr-2" />
                  {profesor.telefono}
                </div>
                <div className="flex items-center text-secondary-600">
                  <FileText size={16} className="mr-2" />
                  DNI: {profesor.dni}
                </div>
                <div className="flex items-center text-secondary-600">
                  <Calendar size={16} className="mr-2" />
                  Contratado: {formatDate(profesor.fecha_inicio_contrato, 'dd/MM/yyyy')}
                </div>
              </div>

              <div className="flex justify-between mt-4 pt-3 border-t border-secondary-200 gap-1">
                <Button variant="ghost" size="sm" className="text-primary-600" onClick={() => onVer && onVer(profesor)}>
                  <Eye size={14} className="mr-1" />
                  Ver
                </Button>
                <Button variant="ghost" size="sm" className="text-primary-600" onClick={() => onEditar && onEditar(profesor)}>
                  <Pencil size={14} className="mr-1" />
                  Editar
                </Button>
                <Button variant="ghost" size="sm" className={profesor.estado ? 'text-warning-600' : 'text-success-600'} onClick={() => handleToggleEstado(profesor)}>
                  {profesor.estado ? <ToggleLeft size={16} className="mr-1" /> : <ToggleRight size={16} className="mr-1" />}
                  {profesor.estado ? 'Desactivar' : 'Activar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};