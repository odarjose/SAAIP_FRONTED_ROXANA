import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../shared/components/Card";

import { Button } from "../../../shared/components/Button";
import { Input } from "../../../shared/components/Input";
import { Badge } from "../../../shared/components/Badge";
import { Building2, Plus, Search, Pencil, Trash, Settings } from "lucide-react";

const AulasPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Datos de ejemplo para aulas
  const aulas = [
    {
      id: "1",
      nombre: "A-101",
      ubicacion: "Edificio A, Planta 1",
      capacidad: 30,
      tipo: "salon",
      equipamiento: ["Proyector", "Computadora", "Aire acondicionado"],
      estado: "disponible",
    },
    {
      id: "2",
      nombre: "B-203",
      ubicacion: "Edificio B, Planta 2",
      capacidad: 25,
      tipo: "salon",
      equipamiento: ["Proyector", "Pizarra digital"],
      estado: "ocupada",
    },
    {
      id: "3",
      nombre: "C-105",
      ubicacion: "Edificio C, Planta 1",
      capacidad: 40,
      tipo: "laboratorio",
      equipamiento: [
        "Computadoras (20)",
        "Proyector",
        "Pizarra digital",
        "Aire acondicionado",
      ],
      estado: "disponible",
    },
    {
      id: "4",
      nombre: "D-302",
      ubicacion: "Edificio D, Planta 3",
      capacidad: 60,
      tipo: "auditorio",
      equipamiento: ["Sistema de sonido", "Proyector", "Micrófonos"],
      estado: "mantenimiento",
    },
  ];

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "disponible":
        return <Badge variant="success">Disponible</Badge>;
      case "ocupada":
        return <Badge variant="warning">Ocupada</Badge>;
      case "mantenimiento":
        return <Badge variant="error">En mantenimiento</Badge>;
      case "fuera_de_servicio":
        return <Badge variant="error">Fuera de servicio</Badge>;
      default:
        return <Badge>Desconocido</Badge>;
    }
  };

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case "salon":
        return <Badge variant="primary">Salón</Badge>;
      case "laboratorio":
        return <Badge variant="secondary">Laboratorio</Badge>;
      case "auditorio":
        return <Badge variant="warning">Auditorio</Badge>;
      default:
        return <Badge>Otro</Badge>;
    }
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
          <Button>
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
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Settings size={16} className="mr-1" />
                Filtrar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aulas.map((aula) => (
              <Card
                key={aula.id}
                className="overflow-hidden hover:shadow-md transition-shadow card-hover"
              >
                <div
                  className={`h-2 w-full ${
                    aula.estado === "disponible"
                      ? "bg-success-500"
                      : aula.estado === "ocupada"
                        ? "bg-warning-500"
                        : "bg-error-500"
                  }`}
                />
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{aula.nombre}</h3>
                    <div className="flex space-x-1">
                      {getEstadoBadge(aula.estado)}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center mb-2 text-sm text-secondary-600">
                    <span className="flex items-center">
                      <Building2 size={14} className="mr-1" />
                      {aula.ubicacion}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {getTipoBadge(aula.tipo)}
                    <Badge variant="secondary">{aula.capacidad} personas</Badge>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-secondary-500 mb-1">
                      Equipamiento:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {aula.equipamiento.map((equipo, i) => (
                        <span
                          key={i}
                          className="inline-block px-2 py-1 text-xs bg-secondary-100 rounded-md text-secondary-600"
                        >
                          {equipo}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between mt-4 pt-3 border-t border-secondary-200">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-secondary-700"
                    >
                      <Pencil size={14} className="mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-error-600 hover:text-error-700"
                    >
                      <Trash size={14} className="mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AulasPage;
