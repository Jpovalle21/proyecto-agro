// modules/dashboard/pages/Dashboard.jsx

import { MODULES, MOCK_USER } from "../../../config/Modules";
import ModuleCard from "../../../components/ui/ModuleCard";
import Sidebar from "../../../components/Layout/AlmacenSidebar";
import AppLayout from "../../../components/Layout/AppLayout";
import ModuleLayout from "../../../components/Layout/ModuleLayout";

export default function Dashboard() {
  const user = MOCK_USER;

  // Filtrar módulos según permisos del usuario
  const visibleModules = MODULES.filter((m) =>
    user.modulos_permitidos.includes(m.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      
      {/* Top bar */}
      <header className="hidden md:flex sticky top-0 z-20 items-center justify-between px-8 py-3 bg-white/70 backdrop-blur-md border-b border-white/40">
        
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Panel Principal
          </h2>

          <p className="text-xs text-slate-400 mt-0.5">
            Selecciona un módulo para continuar
          </p>

          {/* Línea elegante */}
          <div className="mt-2 w-44 h-[2px] rounded-full bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300 shadow-sm" />
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          En línea
        </div>
      </header>

      {/* Grid */}
      <div className="px-4 py-4 md:px-6 lg:px-8 2xl:px-10">
        
        {/* Mobile title */}
        <div className="md:hidden mb-6">
          <h2 className="text-2xl font-black text-slate-800">
            Módulos
          </h2>

          <p className="text-sm text-slate-400">
            Selecciona para continuar
          </p>

          <div className="mt-3 w-44 h-[3px] rounded-full bg-slate-300" />
        </div>

        {/* Grid módulos */}
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-3
            2xl:grid-cols-4
            gap-8
            w-full
          "
        >
          {visibleModules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 md:px-6 pb-3">
        <p className="text-xs text-slate-400">
          Agro Angeles v1.0 — Todos los derechos reservados
        </p>
      </div>
    </div>
  );
}