export interface Profesor {
  id: string;
  userId: string;
  nombre: string;
  apellido: string;
  email: string;
  documentoIdentidad: string;
  telefono: string;
  fechaContratacion: Date;
  fechaFinContrato?: Date;
  estado: "activo" | "inactivo" | "suspendido";
  especialidad: string;
  observaciones?: string;
  turnosAsignados: Turno[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Turno {
  id: string;
  nombre: string;
  horaInicio: string;
  horaFin: string;
  diasSemana: number[]; // 0 = Domingo, 1 = Lunes, etc.
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfesorTurno {
  id: string;
  profesorId: string;
  turnoId: string;
  fechaInicio: Date;
  fechaFin?: Date;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}
