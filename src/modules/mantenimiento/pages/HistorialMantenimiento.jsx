import { useMemo, useState } from "react";

const MAIN = "rgb(183,183,183)";

const historialInicial = [
  {
    id: 20,
    usuario: "usuario",
    area: "Almacén",
    subarea: "Eviscerado",
    tipo: "Hidráulico",
    problema: "Tanques",
    prioridad: "-",
    descripcion: "test",
    estado: "Stand By",
    fechaLimite: "",
    tiempoExtra: 0,
    tiempoPerdido: 0,
    justificacion: "test",
    respuestaTiempoExtra: "Solicitud en Stand By",
  },
  {
    id: 19,
    usuario: "usuario",
    area: "Ambiental",
    subarea: "Eviscerado",
    tipo: "Eléctrica",
    problema: "Cableado",
    prioridad: "Media",
    descripcion: "aaa",
    estado: "Aceptado",
    fechaLimite: "2026-01-12T10:46",
    tiempoExtra: 0,
    tiempoPerdido: 2927.72,
    justificacion: "N/A",
    respuestaTiempoExtra: "",
  },
  {
    id: 18,
    usuario: "usuario",
    area: "Ambiental",
    subarea: "Eviscerado",
    tipo: "Eléctrica",
    problema: "Test tiempos",
    prioridad: "Media",
    descripcion: "Test tiempos",
    estado: "Cancelado",
    fechaLimite: "",
    tiempoExtra: 0,
    tiempoPerdido: 0,
    justificacion: "[RECHAZADO] Necesitamos más",
    respuestaTiempoExtra: "Solicitud cancelada",
  },
  {
    id: 17,
    usuario: "usuario",
    area: "Ambiental",
    subarea: "Eviscerado",
    tipo: "Mecánica",
    problema: "Test final",
    prioridad: "Media",
    descripcion: "Test final",
    estado: "Terminado",
    fechaLimite: "",
    tiempoExtra: 0,
    tiempoPerdido: 0,
    justificacion: "Necesitamos",
    respuestaTiempoExtra: "",
  },
  {
    id: 16,
    usuario: "usuario",
    area: "Calidad",
    subarea: "Laboratorio",
    tipo: "Preventivo",
    problema: "test",
    prioridad: "Media",
    descripcion: "test",
    estado: "Terminado",
    fechaLimite: "",
    tiempoExtra: 0,
    tiempoPerdido: 0,
    justificacion: "N/A",
    respuestaTiempoExtra: "",
  },
  {
    id: 15,
    usuario: "usuario",
    area: "Ambiental",
    subarea: "Eviscerado",
    tipo: "Eléctrica",
    problema: "Solicitud",
    prioridad: "Baja",
    descripcion: "Solicitud",
    estado: "Esperando Usuario",
    fechaLimite: "",
    tiempoExtra: 0,
    tiempoPerdido: 0,
    justificacion: "Necesitamos tiempo extra.",
    respuestaTiempoExtra: "Pendiente de respuesta del usuario",
  },
  {
    id: 14,
    usuario: "usuario",
    area: "Almacén",
    subarea: "Bodega",
    tipo: "Mecánica",
    problema: "Test",
    prioridad: "Media",
    descripcion: "Test",
    estado: "Aceptado",
    fechaLimite: "2026-01-10T09:20",
    tiempoExtra: 0,
    tiempoPerdido: 0,
    justificacion: "N/A",
    respuestaTiempoExtra: "",
  },
  {
    id: 13,
    usuario: "usuario",
    area: "Almacén",
    subarea: "Bodega",
    tipo: "Mecánica",
    problema: "aa",
    prioridad: "Alta",
    descripcion: "aa",
    estado: "Cancelado",
    fechaLimite: "",
    tiempoExtra: 0,
    tiempoPerdido: 0,
    justificacion: "TEst",
    respuestaTiempoExtra: "Solicitud cancelada",
  },
  {
    id: 11,
    usuario: "usuario",
    area: "Almacén",
    subarea: "Bodega",
    tipo: "Eléctrica",
    problema: "Test",
    prioridad: "Media",
    descripcion: "Test",
    estado: "Rechazado",
    fechaLimite: "",
    tiempoExtra: 0,
    tiempoPerdido: 0,
    justificacion: "Test",
    respuestaTiempoExtra: "Solicitud rechazada",
  },
  {
    id: 10,
    usuario: "usuario",
    area: "Producción",
    subarea: "Línea 1",
    tipo: "Preventivo",
    problema: "Pendiente de revisión",
    prioridad: "Alta",
    descripcion: "Revisión inicial pendiente",
    estado: "Pendiente",
    fechaLimite: "2026-05-20T08:00",
    tiempoExtra: 0,
    tiempoPerdido: 0,
    justificacion: "N/A",
    respuestaTiempoExtra: "",
  },
];

const estados = [
  "Todos los estados",
  "Pendiente",
  "Aceptado",
  "Stand By",
  "Rechazado",
  "Cancelado",
  "Esperando Usuario",
  "Terminado",
];

const prioridades = ["Todas las prioridades", "Alta", "Media", "Baja", "-"];

export default function HistorialMantenimiento() {
  const [filters, setFilters] = useState({
    estado: "Todos los estados",
    prioridad: "Todas las prioridades",
    usuario: "",
  });
  const [detalle, setDetalle] = useState(null);
  const [notificacionesAbiertas, setNotificacionesAbiertas] = useState(false);

  const registros = useMemo(() => {
    return historialInicial.filter((item) => {
      const byEstado =
        filters.estado === "Todos los estados" || item.estado === filters.estado;
      const byPrioridad =
        filters.prioridad === "Todas las prioridades" || item.prioridad === filters.prioridad;
      const byUsuario = item.usuario
        .toLowerCase()
        .includes(filters.usuario.toLowerCase());

      return byEstado && byPrioridad && byUsuario;
    });
  }, [filters]);

  const notificaciones = historialInicial.filter((item) =>
    ["Pendiente", "Aceptado", "Stand By", "Esperando Usuario"].includes(item.estado)
  );

  const totalNotificaciones = notificaciones.length;

  if (detalle) {
    return (
      <DetalleHistorial
        solicitud={detalle}
        onBack={() => setDetalle(null)}
      />
    );
  }

  return (
    <div className="min-h-full bg-[#f8fafc] text-slate-800">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 shadow-sm md:px-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Historial
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Consulta el estado y trazabilidad de las solicitudes de mantenimiento.
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => setNotificacionesAbiertas((value) => !value)}
            className="relative rounded-lg p-2 text-2xl transition hover:bg-slate-100"
            title="Notificaciones"
          >
            <span>🔔</span>
            {totalNotificaciones > 0 && (
              <span className="absolute -right-1 -top-1 rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {totalNotificaciones}
              </span>
            )}
          </button>

          {notificacionesAbiertas && (
            <div className="absolute right-0 mt-3 w-80 rounded-xl border border-slate-200 bg-white p-4 shadow-2xl">
              <p className="font-bold text-slate-900">
                Notificaciones
              </p>

              <div className="mt-3 space-y-3">
                {notificaciones.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setDetalle(item);
                      setNotificacionesAbiertas(false);
                    }}
                    className="w-full rounded-lg border border-slate-100 p-3 text-left transition hover:bg-slate-50"
                  >
                    <p className="text-sm font-bold text-slate-800">
                      Solicitud #{item.id}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.estado} · {item.area}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="p-4 md:p-8">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: MAIN }}>
                Historial de solicitudes
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Filtra por estado, prioridad o usuario.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <select
                value={filters.estado}
                onChange={(event) =>
                  setFilters((current) => ({ ...current, estado: event.target.value }))
                }
                className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[rgb(183,183,183)] focus:ring-4 focus:ring-slate-100"
              >
                {estados.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>

              <select
                value={filters.prioridad}
                onChange={(event) =>
                  setFilters((current) => ({ ...current, prioridad: event.target.value }))
                }
                className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[rgb(183,183,183)] focus:ring-4 focus:ring-slate-100"
              >
                {prioridades.map((prioridad) => (
                  <option key={prioridad} value={prioridad}>
                    {prioridad}
                  </option>
                ))}
              </select>

              <input
                value={filters.usuario}
                onChange={(event) =>
                  setFilters((current) => ({ ...current, usuario: event.target.value }))
                }
                placeholder="Buscar usuario..."
                className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[rgb(183,183,183)] focus:ring-4 focus:ring-slate-100"
              />

              <button
                onClick={() =>
                  setFilters({
                    estado: "Todos los estados",
                    prioridad: "Todas las prioridades",
                    usuario: "",
                  })
                }
                className="h-10 rounded-lg bg-emerald-500 px-4 text-sm font-bold text-white transition hover:bg-emerald-600"
              >
                Limpiar
              </button>
            </div>
          </div>

          <div className="hidden overflow-hidden rounded-xl border border-slate-200 lg:block">
            <table className="w-full min-w-[1100px] text-sm">
              <thead style={{ backgroundColor: MAIN }} className="text-white">
                <tr>
                  <th className="px-4 py-4 text-left">ID</th>
                  <th className="px-4 py-4 text-left">Usuario</th>
                  <th className="px-4 py-4 text-left">Área</th>
                  <th className="px-4 py-4 text-left">Prioridad</th>
                  <th className="px-4 py-4 text-left">Descripción</th>
                  <th className="px-4 py-4 text-center">Estado</th>
                  <th className="px-4 py-4 text-center">Tiempo restante</th>
                  <th className="px-4 py-4 text-left">Justificación</th>
                  <th className="px-4 py-4 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {registros.map((item) => (
                  <tr key={item.id} className="transition hover:bg-slate-50">
                    <td className="px-4 py-4 font-bold">{item.id}</td>
                    <td className="px-4 py-4">{item.usuario}</td>
                    <td className="px-4 py-4">{item.area}</td>
                    <td className="px-4 py-4">{item.prioridad}</td>
                    <td className="px-4 py-4">{item.descripcion}</td>
                    <td className="px-4 py-4 text-center">
                      <EstadoBadge estado={item.estado} />
                    </td>
                    <td className="px-4 py-4 text-center font-semibold">
                      {item.fechaLimite ? formatTiempoRestante(item.fechaLimite) : "—"}
                    </td>
                    <td className="px-4 py-4">{item.justificacion || "N/A"}</td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => setDetalle(item)}
                        className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-600"
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}

                {registros.length === 0 && (
                  <tr>
                    <td colSpan="9" className="px-5 py-12 text-center">
                      <p className="font-bold text-slate-700">No hay solicitudes para mostrar</p>
                      <p className="mt-1 text-sm text-slate-500">Ajusta los filtros.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <section className="space-y-4 lg:hidden">
            {registros.map((item) => (
              <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-bold">#{item.id}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.area}</p>
                  </div>
                  <EstadoBadge estado={item.estado} />
                </div>

                <p className="mt-4 text-sm font-medium text-slate-700">
                  {item.descripcion}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <Info label="Usuario" value={item.usuario} />
                  <Info label="Prioridad" value={item.prioridad} />
                  <Info label="Tiempo" value={item.fechaLimite ? formatTiempoRestante(item.fechaLimite) : "—"} />
                  <Info label="Justificación" value={item.justificacion || "N/A"} />
                </div>

                <button
                  onClick={() => setDetalle(item)}
                  className="mt-5 w-full rounded-lg bg-emerald-500 py-3 text-sm font-bold text-white"
                >
                  Ver
                </button>
              </article>
            ))}
          </section>
        </section>
      </main>
    </div>
  );
}

function DetalleHistorial({ solicitud, onBack }) {
  return (
    <div className="min-h-full bg-[#f8fafc] p-4 text-slate-800 md:p-8">
      <button
        onClick={onBack}
        className="mb-6 rounded-lg px-4 py-2 text-sm font-bold text-white shadow-sm"
        style={{ backgroundColor: MAIN }}
      >
        ← Volver
      </button>

      <section className="mx-auto max-w-5xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-3xl font-bold" style={{ color: MAIN }}>
          Detalle de la solicitud
        </h1>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          {[
            ["ID", solicitud.id],
            ["Usuario", solicitud.usuario],
            ["Área", solicitud.area],
            ["Subárea", solicitud.subarea],
            ["Tipo", solicitud.tipo],
            ["Problema", solicitud.problema],
            ["Prioridad", solicitud.prioridad],
            ["Descripción", solicitud.descripcion],
            ["Estado", solicitud.estado],
          ].map(([label, value]) => (
            <div
              key={label}
              className="grid grid-cols-1 border-b border-slate-200 last:border-b-0 md:grid-cols-[320px_1fr]"
            >
              <div
                className="px-5 py-4 font-bold text-white"
                style={{ backgroundColor: MAIN }}
              >
                {label}
              </div>
              <div className="bg-slate-50 px-5 py-4 font-medium text-slate-700">
                {value || "—"}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-7 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-bold text-emerald-500">
            Gestión de tiempos
          </h2>

          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p>
              <strong>Fecha límite:</strong>{" "}
              {solicitud.fechaLimite
                ? formatDateTime(solicitud.fechaLimite)
                : "Sin fecha límite"}
            </p>
            <p>
              <strong>Tiempo extra:</strong> {solicitud.tiempoExtra || 0} h
            </p>
            <p>
              <strong>Tiempo perdido:</strong> {solicitud.tiempoPerdido || 0} h
            </p>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-bold text-emerald-500">
              Respuesta de la última solicitud de tiempo extra:
            </h3>

            {solicitud.estado === "Stand By" ? (
              <div className="mt-3 rounded-lg border-l-4 border-amber-400 bg-amber-50 p-4 text-amber-700">
                <p className="font-bold">Solicitud en Stand By</p>
                <p className="mt-2 font-semibold">Justificación:</p>
                <p className="mt-2">{solicitud.justificacion || "Sin justificación"}</p>
                <p className="mt-4 text-sm italic">
                  Esta solicitud está pausada temporalmente.
                </p>
              </div>
            ) : (
              <p className="mt-3 text-slate-600">
                {solicitud.respuestaTiempoExtra || "No hay solicitudes registradas."}
              </p>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-bold text-emerald-500">
              Evaluación
            </h3>
            <p className="mt-2 text-slate-600">
              No hay evaluaciones registradas.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function EstadoBadge({ estado }) {
  const styles = {
    Pendiente: "bg-slate-100 text-slate-700",
    Aceptado: "bg-blue-100 text-blue-700",
    "Stand By": "bg-amber-100 text-amber-700",
    Rechazado: "bg-red-100 text-red-700",
    Cancelado: "bg-slate-200 text-slate-700",
    "Esperando Usuario": "bg-orange-100 text-orange-700",
    Terminado: "bg-emerald-100 text-emerald-700",
  };

  return (
    <span className={`rounded-lg px-3 py-1 text-xs font-bold ${styles[estado] || "bg-slate-100 text-slate-700"}`}>
      {estado}
    </span>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function getHorasRestantes(date) {
  if (!date) return null;
  return (new Date(date) - new Date()) / (1000 * 60 * 60);
}

function formatTiempoRestante(date) {
  const hours = getHorasRestantes(date);

  if (hours === null) return "—";
  if (hours < 0) return "VENCIDA";
  if (hours < 24) return `${Math.ceil(hours)} h`;
  return `${Math.ceil(hours / 24)} días`;
}

function formatDateTime(date) {
  if (!date) return "Sin fecha límite";

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}
