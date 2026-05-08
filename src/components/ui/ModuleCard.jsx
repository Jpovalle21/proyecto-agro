// components/ui/ModuleCard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ModuleCard({ module }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(module.path)}
      className="group relative flex flex-col items-center rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 w-full"
    >
      <div
        className="w-full h-1 transition-opacity duration-300"
        style={{ backgroundColor: module.color, opacity: hovered ? 1 : 0.3 }}
      />
      <div className="flex items-center justify-center w-full pt-5 pb-3 px-4">
        <div
          className="flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 rounded-2xl transition-all duration-300 group-hover:scale-105"
          style={{
            backgroundColor: hovered ? module.color : `${module.color}14`,
            color: hovered ? "#ffffff" : module.color,
          }}
        >
          {module.icon}
        </div>
      </div>
      <div className="w-full px-3 pb-4 text-center">
        <h3
          className="text-xs lg:text-sm font-semibold tracking-wide transition-colors duration-300"
          style={{ color: hovered ? module.color : "#334155" }}
        >
          {module.name}
        </h3>
        <p className="text-[10px] lg:text-xs text-slate-400 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {module.description}
        </p>
      </div>
    </button>
  );
}