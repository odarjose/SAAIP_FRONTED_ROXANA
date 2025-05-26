
import { Card, CardContent} from '../../../shared/components/Card';
import { Badge } from "../../../shared/components/Badge";
import { Avatar } from "../../../shared/components/Avatar";
import { Button } from '../../../shared/components/Button';
import { Mail, Phone, FileText, Calendar, Pencil, Trash } from 'lucide-react';
import { formatDate } from '../../../shared/lib/Utils';
import { DocenteResponseDTO } from '../interface/InterfaceDocente';

interface DocentesListProps {
  profesores: DocenteResponseDTO[];
}

export const DocentesList: React.FC<DocentesListProps> = ({ profesores }) => {
  const getEstadoBadge = (estado: boolean) => {
    return estado ? (
      <Badge variant="success">Activo</Badge>
    ) : (
      <Badge variant="secondary">Inactivo</Badge>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {profesores.map((profesor) => (
        <Card key={profesor.id_docente} className="overflow-hidden hover:shadow-md transition-shadow">
          <div className={`h-2 w-full ${profesor.estado === true ? 'bg-success-500' : 'bg-secondary-300'}`} />
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
              {getEstadoBadge(profesor.estado)}
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

            {/*<div className="mt-4">
              <p className="text-xs font-medium text-secondary-500 mb-2">Turnos asignados:</p>
              <div className="flex flex-wrap gap-1">
                {profesor.turnosAsignados.map((turno, index) => (
                  <div
                    key={index}
                    className="flex items-center px-2 py-1 rounded-md bg-primary-50 text-primary-700 text-xs"
                  >
                    <Clock size={12} className="mr-1" />
                    {turno}
                  </div>
                ))}
              </div>
            </div>.*/}

            <div className="flex justify-between mt-4 pt-3 border-t border-secondary-200">
              <Button variant="ghost" size="sm" className="text-primary-600">
                <Pencil size={14} className="mr-1" />
                Editar
              </Button>
              <Button variant="ghost" size="sm" className="text-error-600">
                <Trash size={14} className="mr-1" />
                Eliminar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};