// components/layout/ModuleLayout.jsx
import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { MODULES, MODULE_NAV, MOCK_USER } from "../../config/Modules";
import Sidebar from "./AlmacenSidebar";
import GestionHumanaSidebar from "./GestionHumanaSidebar";
import ComprasSidebar from "./ComprasSidebar";
import MantenimientoSidebar from "./MantenimientoSidebar";



function ModuleSidebarContent({ module, user, navItems, onLogout, onBack }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {/* Logo compacto */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: module.color }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
              <path
                d="M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-1 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z"
                fill="#A7F3D0"
              />
            </svg>
          </div>
          <span className="text-xs font-bold">AGRO ANGELES</span>
        </div>
      </div>

      {/* Botón volver */}
      <div className="px-3 pb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs transition-colors duration-200"
          style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Volver al panel
        </button>
      </div>

      <div className="mx-4 h-px" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />

      {/* Usuario compacto */}
      <div className="px-4 py-3 flex items-center gap-2">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ backgroundColor: module.color }}
        >
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" className="w-5 h-5">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          )}
        </div>
        <div>
          <p className="text-xs font-semibold">{user?.name || "Usuario"}</p>
          <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.5)" }}>
            {user?.role || "Sin rol"}
          </p>
        </div>
      </div>

      <div className="mx-4 h-px" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />

      {/* Navegación del módulo */}
      <div className="flex-1 px-3 py-2">
        {navItems.length > 0 && (
          <>
            <p className="px-3 pt-2 pb-1 text-[9px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>
              {module.name}
            </p>
            {navItems.map((item) => {
              const fullPath = `${module.path}/${item.path}`;
              const isActive = location.pathname.includes(item.path);

              return (
                <button
                  key={item.id}
                  onClick={() => navigate(fullPath)}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs transition-colors duration-200 text-left"
                  style={{
                    color: isActive ? "#fff" : "rgba(255,255,255,0.55)",
                    backgroundColor: isActive ? "rgba(255,255,255,0.12)" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)";
                      e.currentTarget.style.color = "#fff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "rgba(255,255,255,0.55)";
                    }
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </>
        )}

        <div className="mx-0 my-2 h-px" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />

        <p className="px-3 pt-1 pb-1 text-[9px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>
          General
        </p>
        <button
          onClick={() => navigate(`${module.path}/nueva-solicitud`)}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs transition-colors duration-200 text-left"
          style={{ color: "rgba(255,255,255,0.55)" }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
          </svg>
          Nueva solicitud
        </button>
      </div>

      {/* Logout */}
      <div className="px-3 pb-5">
        <button
          onClick={onLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs text-red-400/60 hover:text-red-400 hover:bg-red-950/30 transition-colors duration-200"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          Cerrar sesión
        </button>
      </div>
    </>
  );
}

export default function ModuleLayout({ moduleId }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const user = MOCK_USER;
  const module = MODULES.find((m) => m.id === moduleId);
  const navItems = MODULE_NAV[moduleId]?.[user.role] || [];

  const handleLogout = () => {
    console.log("Logout desactivado por ahora");
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  if (!module) return null;

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-[#f8fafc]">
      {/* Mobile header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 shrink-0" style={{ backgroundColor: module.colorDark }}>
        <div className="flex items-center gap-2">
          <button onClick={handleBack} className="p-1.5 rounded-lg text-white/60 hover:text-white transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-white/80">{module.sidebarIcon}</span>
            <h1 className="text-sm font-bold text-white tracking-tight">{module.name}</h1>
          </div>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-lg text-white/60 hover:text-white transition-colors">
          {menuOpen ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative ml-auto w-72 h-full text-white flex flex-col shadow-2xl"
            style={{ backgroundColor: module.colorDark }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setMenuOpen(false)} className="absolute top-3 right-3 p-1.5 rounded-lg text-white/40 hover:text-white transition-colors z-10">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <ModuleSidebarContent module={module} user={user} navItems={navItems} onLogout={handleLogout} onBack={handleBack} />
          </div>
        </div>
      )}

      {/* Desktop/Tablet sidebar */}
      {moduleId === "almacen" ? (
        <aside className="hidden md:block shrink-0">
          <Sidebar />
        </aside>
      ) : moduleId === "gestion_humana" ? (
        <aside className="hidden md:block shrink-0">
          <GestionHumanaSidebar />
        </aside>
      ) : moduleId === "compras" ? (
        <aside className="hidden md:block shrink-0">
          <ComprasSidebar />
        </aside>  
      ) :moduleId === "mantenimiento" ? (
        <aside className="hidden md:block shrink-0">
          <MantenimientoSidebar />
        </aside>  
      ) : (
        
        <aside
          className="hidden md:flex w-64 h-screen text-white flex-col shadow-2xl shrink-0"
          style={{ backgroundColor: module.colorDark }}
        >
          <ModuleSidebarContent
            module={module}
            user={user}
            navItems={navItems}
            onLogout={handleLogout}
            onBack={handleBack}
          />
        </aside>
      )}

      {/* Contenido del módulo */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}