export interface Aula {
  id: string;
  nombre: string;
  ubicabion: string;
  capacidad: number;
  tipo: "salon" | "laboratorio" | "auditorio" | "otro";
  descripcion?: string;
  equipamientos: string[];
  estado: "disponible" | "ocupada" | "mantenimiento" | "fuera_de_servicio";
  createdAt: Date;
  updatedAt: Date;
}
