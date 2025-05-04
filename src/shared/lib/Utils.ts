import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isToday, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: Date | string,
  formatStr: string = "PPP",
): string {
  if (!date) return "";

  const dateObj = typeof date === "string" ? parseISO(date) : date;

  return format(dateObj, formatStr, { locale: es });
}

export function formatTime(date: Date | string): string {
  if (!date) return "";

  const dateObj = typeof date === "string" ? parseISO(date) : date;

  return format(dateObj, "HH:mm", { locale: es });
}

export function formatDateTime(date: Date | string): string {
  if (!date) return "";

  const dateObj = typeof date === "string" ? parseISO(date) : date;

  return format(dateObj, "Pp", { locale: es });
}

export function isHoy(date: Date | string): boolean {
  if (!date) return false;

  const dateObj = typeof date === "string" ? parseISO(date) : date;

  return isToday(dateObj);
}

export function getNombreCompleto(nombre: string, apellido: string): string {
  return `${nombre} ${apellido}`;
}

export function getInitials(nombre: string, apellido: string): string {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
}

export function getEstadoAsistenciaColor(estado: string): string {
  switch (estado) {
    case "a_tiempo":
      return "bg-success-500";
    case "tarde":
    case "temprano":
      return "bg-warning-500";
    case "ausente":
      return "bg-error-500";
    default:
      return "bg-secondary-300";
  }
}

export function getDiaSemana(dia: number): string {
  const dias = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  return dias[dia];
}

export function getDiasSemanaString(dias: number[]): string {
  if (!dias || dias.length === 0) return "";

  const nombresDias = dias.map((dia) => getDiaSemana(dia).substring(0, 3));
  return nombresDias.join(", ");
}
