import { NavLink, useNavigate } from "react-router-dom";
import { MAIN_NAV, MOCK_USER } from "../../config/Modules";

export default function MainSidebar() {
  const navigate = useNavigate();

  return (
    <aside className="hidden md:flex w-64 h-screen flex-col justify-between bg-gradient-to-b from-[rgb(0,30,49)] to-[rgb(24,0,0)] text-white shadow-xl shrink-0">
      <div className="px-5 pt-6">
        <h1 className="text-base font-semibold tracking-widest mb-8">
          AGRO ÁNGELES
        </h1>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center text-sm font-semibold">
            CM
          </div>
          <div>
            <p className="text-sm font-medium">{MOCK_USER.name}</p>
            <p className="text-xs text-white/55">{MOCK_USER.role}</p>
          </div>
        </div>

        {/* SEPARADOR */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-5"></div>

        <p className="text-xs uppercase tracking-widest text-white/40 mb-4 pl-2">
          Panel principal
        </p>

        <nav className="flex flex-col gap-1">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `px-4 py-3 rounded-lg text-sm transition ${
                isActive
                  ? "bg-white text-[#1f2937] font-medium"
                  : "text-white/75 hover:text-white hover:bg-white/10"
              }`
            }
          >
            Dashboard
          </NavLink>

          {MAIN_NAV.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 rounded-lg text-sm transition ${
                  isActive
                    ? "bg-white text-[#1f2937] font-medium"
                    : "text-white/75 hover:text-white hover:bg-white/10"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* BOTTOM */}
      <div className="px-5 pb-6 space-y-3">

        {/* SEPARADOR */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-3"></div>

        {/* BOTÓN VOLVER */}


        {/* BOTÓN CERRAR SESIÓN */}
        <button className="w-full py-2.5 rounded-lg text-sm 
          bg-red-500/80 
          hover:bg-red-600 
          shadow-md hover:shadow-lg
          transition-all duration-300">
          Cerrar sesión
        </button>
      </div>
     </aside>
  );
}
