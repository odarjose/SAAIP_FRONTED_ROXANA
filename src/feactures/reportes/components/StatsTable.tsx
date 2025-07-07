import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/Card";
import { Badge } from "../../../shared/components/Badge";

interface StatsTableProps {
  title: string;
  data: Array<{
    id: string | number;
    name: string;
    totalAsistencias: number;
    totalRegistrados: number;
    totalInasistencias: number;
    porcentajeAsistencia: number;
    promedioTiempoUso?: number;
  }>;
  showTimeUsage?: boolean;
}

export const StatsTable: React.FC<StatsTableProps> = ({
  title,
  data,
  showTimeUsage = false,
}) => {
  const getPorcentajeColor = (porcentaje: number, totalAsistencias: number) => {
    if (totalAsistencias === 0) return "secondary"; // Para docentes sin asistencias
    if (porcentaje >= 90) return "success";
    if (porcentaje >= 70) return "warning";
    return "error";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {title}
          <span className="text-sm font-normal text-secondary-500 ml-2">
            ({data.length} docentes)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-secondary-200">
                <th className="py-3 px-4 text-left text-sm font-medium text-secondary-500">
                  Nombre
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-secondary-500">
                  Total
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-secondary-500">
                  Registrados
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-secondary-500">
                  Inasistencias
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-secondary-500">
                  % Asistencia
                </th>
                {showTimeUsage && (
                  <th className="py-3 px-4 text-left text-sm font-medium text-secondary-500">
                    Tiempo Promedio
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr
                  key={item.id}
                  className={`border-b border-secondary-100 hover:bg-secondary-50 ${
                    item.totalAsistencias === 0 ? 'bg-secondary-25 text-secondary-500' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-medium text-secondary-900">
                    {item.name}
                  </td>
                  <td className="py-3 px-4 text-secondary-600">
                    {item.totalAsistencias}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="success">{item.totalRegistrados}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="error">{item.totalInasistencias}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={getPorcentajeColor(item.porcentajeAsistencia, item.totalAsistencias)}>
                      {item.totalAsistencias === 0 ? 'Sin datos' : `${item.porcentajeAsistencia}%`}
                    </Badge>
                  </td>
                  {showTimeUsage && item.promedioTiempoUso !== undefined && (
                    <td className="py-3 px-4 text-secondary-600">
                      {item.promedioTiempoUso} min
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.length === 0 && (
          <div className="text-center py-8 text-secondary-500">
            <p>No hay docentes disponibles para mostrar con los filtros aplicados.</p>
            <p className="text-sm mt-1">Intenta cambiar los filtros o activar "Mostrar todos los docentes".</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 