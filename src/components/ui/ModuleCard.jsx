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
      className="
        group
        relative
        flex
        flex-col
        items-center
        justify-center
        rounded-[26px]
        border
        border-white/60
        bg-white/80
        overflow-hidden
        transition-transform
        duration-100
        ease-out
        hover:scale-[1.015]
        focus:outline-none
        w-full
        h-[180px]
        will-change-transform
      "
      style={{
        boxShadow: hovered
          ? "0 10px 25px rgba(15,23,42,0.08)"
          : "0 2px 6px rgba(15,23,42,0.03)",
      }}
    >
      {/* Línea superior */}
      <div
        className="absolute top-0 left-0 w-full h-[3px]"
        style={{
          backgroundColor: module.color,
          opacity: hovered ? 1 : 0.4,
        }}
      />

      {/* Glow suave */}
      <div
        className="
          absolute
          inset-0
          opacity-0
          group-hover:opacity-100
          transition-opacity
          duration-150
          pointer-events-none
        "
        style={{
          background: `
            radial-gradient(
              circle at top,
              ${module.color}08,
              transparent 75%
            )
          `,
        }}
      />

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        
        {/* Ícono */}
        <div
          className="
            flex
            items-center
            justify-center
            w-16
            h-16
            lg:w-20
            lg:h-20
            rounded-[22px]
            transition-all
            duration-150
            group-hover:scale-105
          "
          style={{
            backgroundColor: hovered
              ? module.color
              : `${module.color}10`,
            color: hovered ? "#ffffff" : module.color,
          }}
        >
          <div className="scale-90">
            {module.icon}
          </div>
        </div>

        {/* Texto */}
        <div className="text-center mt-4 px-2">
          <h3
            className="
              text-base
              lg:text-lg
              font-bold
              tracking-tight
              transition-colors
              duration-100
            "
            style={{
              color: hovered ? module.color : "#1e293b",
            }}
          >
            {module.name}
          </h3>

          <p className="text-[11px] text-slate-400 mt-1">
            {module.description}
          </p>
        </div>
      </div>
    </button>
  );
}