import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { LayoutProps } from "../interface/Interface";

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-screen flex overflow-hidden bg-secondary-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};
