import { NavLink, useNavigate } from "react-router-dom";

export default function SSTSidebar() {
  const navigate = useNavigate();

  const menu = [
    { name: "Dashboard SST", path: "/app/sst/dashboard" },
    { name: "Incapacidades", path: "/app/sst/incapacidades" },
    { name: "Exámenes médicos", path: "/app/sst/examenes-medicos" },
    { name: "Solicitudes e incidentes", path: "/app/sst/solicitudes" },
  ];

  return (
    <div className="flex h-screen w-64 flex-col justify-between bg-gradient-to-b from-[#003049] to-[#000f17] text-white shadow-2xl">
      <div className="px-5 pt-6">
        <h1 className="mb-8 text-base font-semibold tracking-widest opacity-90">
          AGRO ÁNGELES
        </h1>

        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-sm font-semibold shadow-inner backdrop-blur-md">
            SST
          </div>

          <div>
            <p className="text-sm font-medium tracking-wide">Elizabeth Ortega</p>
            <p className="text-xs text-white/60">Coordinadora SST</p>
          </div>
        </div>

        <div className="mb-5 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <p className="mb-5 pl-2 text-xs uppercase tracking-widest text-white/40">
          Seguridad y salud
        </p>

        <nav className="flex flex-col gap-1">
          {menu.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `rounded-lg px-4 py-3 text-sm transition-all duration-300 ${
                  isActive
                    ? "bg-white/90 font-medium text-[rgb(0,48,73)] shadow-md"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="space-y-3 px-5 pb-6">
        <div className="mb-3 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full rounded-lg border border-white/10 bg-white/10 py-2.5 text-sm backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:bg-white/20"
        >
          ← Volver al panel
        </button>

        <button className="w-full rounded-lg bg-red-500/80 py-2.5 text-sm shadow-md transition-all duration-300 hover:bg-red-600 hover:shadow-lg">
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
