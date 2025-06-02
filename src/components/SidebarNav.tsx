import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Calendar,
  BookOpen,
  ClipboardCheck,
  FileBarChart,
  Settings,
  LogOut,
} from "lucide-react";

import { cn } from "../shared/lib/Utils";
import { NavItem } from "../types/Types";
import { SidebarNavProps } from "../interface/Interface";

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <Home size={20} />,
  },
  {
    title: "Usuarios",
    href: "/usuarios",
    icon: <Users size={20} />,
  },
  {
    title: "Profesores",
    href: "/docentes",
    icon: <BookOpen size={20} />,
  },
  {
    title: "Turnos",
    href: "/turnos",
    icon: <Calendar size={20} />,
  },
  {
    title: "Asistencias",
    href: "/asistencias",
    icon: <ClipboardCheck size={20} />,
  },
  {
    title: "Reportes",
    href: "/reportes",
    icon: <FileBarChart size={20} />,
  },
  {
    title: "Configuración",
    href: "/configuracion",
    icon: <Settings size={20} />,
  },
];

export const SidebarNav: React.FC<SidebarNavProps> = ({
  className,
  collapsed,
}) => {
  const location = useLocation();

  return (
    <nav className={cn("flex flex-col gap-2 p-2", className)}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
            "hover:bg-primary-50 hover:text-primary-700",
            location.pathname === item.href
              ? "bg-primary-50 text-primary-700"
              : "text-secondary-600",
            collapsed && "justify-center px-2"
          )}
        >
          {item.icon}
          {!collapsed && <span>{item.title}</span>}
        </Link>
      ))}
      <div className="mt-auto pt-4 border-t border-secondary-200">
        <Link
          to="/logout"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
            "hover:bg-error-50 hover:text-error-600 text-secondary-600",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut size={20} />
          {!collapsed && <span>Cerrar Sesión</span>}
        </Link>
      </div>
    </nav>
  );
};
