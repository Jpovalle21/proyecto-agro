import { NavLink, useNavigate } from "react-router-dom";

export default function GestionHumanaSidebar() {
  const navigate = useNavigate();

  const menu = [
    { name: "Ingresos", path: "/app/gestion-humana/ingresos" },
    { name: "Perfil de Usuario", path: "/app/gestion-humana/perfil-usuario" },
    { name: "Novedades", path: "/app/gestion-humana/novedades" },
    { name: "Bienestar", path: "/app/gestion-humana/bienestar" },
    { name: "Informe", path: "/app/gestion-humana/informe" },
  ];

  return (
    <div className="w-64 h-screen flex flex-col justify-between bg-gradient-to-b from-[#5a3d8f] to-[#100a1d] text-white shadow-2xl">
      <div className="px-5 pt-6">
        <h1 className="text-base font-semibold tracking-widest opacity-90 mb-8">
          AGRO ÁNGELES
        </h1>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-sm font-semibold shadow-inner">
            CM
          </div>
          <div>
            <p className="text-sm font-medium tracking-wide">Juan Pablo</p>
            <p className="text-xs text-white/60">Administrador</p>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-5" />

        <p className="text-xs uppercase tracking-widest text-white/40 mb-5 pl-2">
          GESTIÓN HUMANA
        </p>

        <nav className="flex flex-col gap-1">
          {menu.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `px-4 py-3 rounded-lg text-sm transition-all duration-300 ${
                  isActive
                    ? "bg-white/90 text-[#5a3d8f] font-medium shadow-md"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="px-5 pb-6 space-y-3">
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-3" />

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full py-2.5 rounded-lg text-sm bg-white/10 border border-white/10 hover:bg-white/20 hover:scale-[1.02] transition-all duration-300"
        >
          ← Volver al panel
        </button>

        <button className="w-full py-2.5 rounded-lg text-sm bg-red-500/80 hover:bg-red-600 shadow-md hover:shadow-lg transition-all duration-300">
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
