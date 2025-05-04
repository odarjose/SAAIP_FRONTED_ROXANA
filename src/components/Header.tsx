import React from "react";
import { Bell, Calendar, Search } from "lucide-react";
import { HeaderProps } from "../interface/Interface";
import { Avatar } from "../shared/components/Avatar";
import { cn } from "../shared/lib/Utils";

export const Header: React.FC<HeaderProps> = ({ className, title }) => {
  // Datos de ejemplo para el usuario
  const user = {
    nombre: "Juan",
    apellido: "Pérez",
    avatar: undefined,
  };

  return (
    <header
      className={cn(
        "h-16 bg-white border-b border-secondary-200 flex items-center justify-between px-6",
        className,
      )}
    >
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-secondary-900">
          {title || "Dashboard"}
        </h1>
      </div>

      <div className="hidden md:flex items-center rounded-md border border-secondary-300 bg-white px-3 py-2 w-96">
        <Search size={18} className="text-secondary-400 mr-2" />
        <input
          type="text"
          placeholder="Buscar..."
          className="bg-transparent border-none w-full focus:outline-none text-sm"
        />
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full bg-secondary-100 hover:bg-secondary-200 transition-colors">
          <Calendar size={18} className="text-secondary-600" />
        </button>
        <button className="p-2 rounded-full bg-secondary-100 hover:bg-secondary-200 transition-colors relative">
          <Bell size={18} className="text-secondary-600" />
          <span className="absolute top-0 right-0 block w-2 h-2 rounded-full bg-error-500"></span>
        </button>
        <div className="flex items-center space-x-2">
          <Avatar
            name={user.nombre}
            surname={user.apellido}
            src={user.avatar}
            size="sm"
          />
          <div className="hidden md:block">
            <p className="text-sm font-medium text-secondary-800">
              {user.nombre} {user.apellido}
            </p>
            <p className="text-xs text-secondary-500">Administrador</p>
          </div>
        </div>
      </div>
    </header>
  );
};
