// modules/dashboard/pages/Dashboard.jsx
import { MODULES, MOCK_USER } from "../../../config/Modules";
import ModuleCard from "../../../components/ui/ModuleCard";
import Sidebar from "../../../components/Layout/Sidebar";
import AppLayout from "../../../components/Layout/AppLayout";
import ModuleLayout from "../../../components/Layout/ModuleLayout";

export default function Dashboard() {
  const user = MOCK_USER;

  // Filtrar módulos según permisos del usuario
  const visibleModules = MODULES.filter((m) =>
    user.modulos_permitidos.includes(m.id)
  );

  return (
    <>
      {/* Top bar */}
      <header className="hidden md:flex sticky top-0 z-10 items-center justify-between px-6 lg:px-8 py-4 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div>
          <h2 className="text-lg lg:text-xl font-bold text-slate-800 tracking-tight">
            Panel Principal
          </h2>
          <p className="text-xs text-slate-400">
            Selecciona un módulo para continuar
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          En línea
        </div>
      </header>

      {/* Grid */}
      <div className="px-4 py-5 md:px-6 md:py-6 lg:px-8 lg:py-8">
        <div className="md:hidden mb-4">
          <h2 className="text-base font-bold text-slate-800">Módulos</h2>
          <p className="text-xs text-slate-400">Selecciona para continuar</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5 max-w-5xl">
          {visibleModules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </div>

      <div className="px-4 md:px-6 lg:px-8 pb-4">
        <p className="text-[10px] text-slate-300">
          Agro Angeles v1.0 — Todos los derechos reservados
        </p>
      </div>
    </>
  );
}