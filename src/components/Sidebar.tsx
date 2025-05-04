import React, { useState } from "react";
import { SidebarNav } from "./SidebarNav";
import { ChevronLeft, Menu } from "lucide-react";
import { cn } from "../shared/lib/Utils";

import { SidebarProps } from "../interface/Interface";

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "bg-white border-r border-secondary-200 h-full flex flex-col transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64",
        className,
      )}
    >
      <div
        className={cn(
          "h-16 flex items-center px-4 border-b border-secondary-200",
          collapsed ? "justify-center" : "justify-between",
        )}
      >
        {!collapsed && (
          <div className="font-bold text-lg text-primary-800">AIP Sistema</div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-secondary-100 text-secondary-500"
        >
          {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <SidebarNav collapsed={collapsed} />
      </div>
    </aside>
  );
};
