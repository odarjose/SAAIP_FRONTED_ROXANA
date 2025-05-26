import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../shared/components/Card";
import { Button } from "../../../shared/components/Button";
import { Input } from "../../../shared/components/Input";
import { Badge } from "../../../shared/components/Badge";
import { Select } from '../../../shared/components/Select';
import { 
  FileBarChart,
  Download,
  FileText,
  
  Filter,
  Eye,
  Trash,
  FileIcon,
  Table,
  FileJson2
} from 'lucide-react';
import { formatDate } from '../../../shared/lib/Utils';

const ReportesPage: React.FC = () => {
  const [filtro, setFiltro] = useState({
    tipo: '',
    fechaInicio: '',
    fechaFin: '',
    formato: '',
  });

  // Datos de ejemplo para reportes
  const reportes = [
    {
      id: '1',
      titulo: 'Reporte de Asistencia Mensual',
      tipo: 'asistencia',
      fechaGeneracion: new Date(2024, 2, 15, 14, 30),
      formato: 'pdf',
      generadoPor: 'Ana García',
      tamaño: '2.5 MB',
    },
    {
      id: '2',
      titulo: 'Uso de Aulas - Febrero 2024',
      tipo: 'aula',
      fechaGeneracion: new Date(2024, 2, 14, 10, 15),
      formato: 'excel',
      generadoPor: 'Carlos Martínez',
      tamaño: '1.8 MB',
    },
    {
      id: '3',
      titulo: 'Estadísticas de Asistencia Q1 2024',
      tipo: 'estadistica',
      fechaGeneracion: new Date(2024, 2, 13, 16, 45),
      formato: 'csv',
      generadoPor: 'Laura Rodríguez',
      tamaño: '956 KB',
    },
    {
      id: '4',
      titulo: 'Reporte de Inconsistencias',
      tipo: 'asistencia',
      fechaGeneracion: new Date(2024, 2, 12, 9, 20),
      formato: 'pdf',
      generadoPor: 'Miguel López',
      tamaño: '1.2 MB',
    },
  ];

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'asistencia':
        return <Badge variant="primary">Asistencia</Badge>;
      case 'aula':
        return <Badge variant="success">Aulas</Badge>;
      case 'estadistica':
        return <Badge variant="warning">Estadísticas</Badge>;
      default:
        return <Badge>Otro</Badge>;
    }
  };

  const getFormatoIcon = (formato: string) => {
    switch (formato) {
      case 'pdf':
        return <FileIcon size={16} className="text-error-600" />;
      case 'excel':
        return <Table size={16} className="text-success-600" />;
      case 'csv':
        return <FileJson2 size={16} className="text-primary-600" />;
      default:
        return <FileText size={16} className="text-secondary-600" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Reportes</h1>
          <p className="text-secondary-600">Generación y gestión de reportes</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button>
            <FileBarChart size={16} className="mr-2" />
            Generar Reporte
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter size={20} className="mr-2 text-primary-600" />
            Generar nuevo reporte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="Tipo de reporte"
              options={[
                { value: '', label: 'Seleccionar tipo' },
                { value: 'asistencia', label: 'Asistencia' },
                { value: 'aula', label: 'Uso de aulas' },
                { value: 'estadistica', label: 'Estadísticas' },
              ]}
              value={filtro.tipo}
              onChange={(e) => setFiltro({ ...filtro, tipo: e.target.value })}
            />
            
            <Input
              type="date"
              label="Fecha inicio"
              value={filtro.fechaInicio}
              onChange={(e) => setFiltro({ ...filtro, fechaInicio: e.target.value })}
            />
            
            <Input
              type="date"
              label="Fecha fin"
              value={filtro.fechaFin}
              onChange={(e) => setFiltro({ ...filtro, fechaFin: e.target.value })}
            />
            
            <Select
              label="Formato"
              options={[
                { value: '', label: 'Seleccionar formato' },
                { value: 'pdf', label: 'PDF' },
                { value: 'excel', label: 'Excel' },
                { value: 'csv', label: 'CSV' },
              ]}
              value={filtro.formato}
              onChange={(e) => setFiltro({ ...filtro, formato: e.target.value })}
            />
          </div>
          
          <div className="flex justify-end mt-4">
            <Button>
              <FileBarChart size={16} className="mr-2" />
              Generar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText size={20} className="mr-2 text-primary-600" />
            Reportes generados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary-500">Reporte</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary-500">Tipo</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary-500">Fecha</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary-500">Generado por</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary-500">Tamaño</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-secondary-500">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reportes.map((reporte) => (
                  <tr key={reporte.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {getFormatoIcon(reporte.formato)}
                        <span className="ml-2 font-medium">{reporte.titulo}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {getTipoBadge(reporte.tipo)}
                    </td>
                    <td className="py-3 px-4 text-secondary-600">
                      {formatDate(reporte.fechaGeneracion, 'dd/MM/yyyy HH:mm')}
                    </td>
                    <td className="py-3 px-4 text-secondary-600">
                      {reporte.generadoPor}
                    </td>
                    <td className="py-3 px-4 text-secondary-600">
                      {reporte.tamaño}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="text-primary-600">
                          <Eye size={16} className="mr-1" />
                          Ver
                        </Button>
                        <Button variant="ghost" size="sm" className="text-success-600">
                          <Download size={16} className="mr-1" />
                          Descargar
                        </Button>
                        <Button variant="ghost" size="sm" className="text-error-600">
                          <Trash size={16} className="mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportesPage;