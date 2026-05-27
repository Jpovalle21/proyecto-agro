import { useMemo, useState } from "react";

const MAIN = "rgb(183,183,183)";

const solicitudesIniciales = [
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
    fechaSolicitud: "2026-01-05T10:46",
    fechaLimite: "2026-01-12T10:46",
    tecnico: "",
    finalizada: false,
    tiempoExtra: 0,
  },
  {
    id: 14,
    usuario: "usuario",
    area: "Almacén",
    subarea: "Bodega principal",
    tipo: "Mecánica",
    problema: "Test",
    prioridad: "Media",
    descripcion: "Test",
    estado: "Aceptado",
    fechaSolicitud: "2026-01-07T09:20",
    fechaLimite: "2026-01-10T09:20",
    tecnico: "",
    finalizada: false,
    tiempoExtra: 0,
  },
  {
    id: 22,
    usuario: "Carlos Méndez",
    area: "Producción",
    subarea: "Línea 2",
    tipo: "Preventivo",
    problema: "Lubricación",
    prioridad: "Alta",
    descripcion: "Revisión de motor principal.",
    estado: "Aceptado",
    fechaSolicitud: "2026-05-12T08:30",
    fechaLimite: "2026-05-15T08:30",
    tecnico: "",
    finalizada: false,
    tiempoExtra: 0,
  },
];

const tecnicos = ["Andrés Técnico", "María Operaria", "Luis Mantenimiento"];

export default function SolicitudesMantenimiento() {
  const [solicitudes, setSolicitudes] = useState(solicitudesIniciales);
  const [filters, setFilters] = useState({
    usuario: "",
    prioridad: "Todas",
    area: "Todas",
    orden: "Por defecto",
    cercanas: false,
  });
  const [vista, setVista] = useState("lista");
  const [seleccionada, setSeleccionada] = useState(null);
  const [notificacionesAbiertas, setNotificacionesAbiertas] = useState(false);

  const areas = ["Todas", ...new Set(solicitudes.map((s) => s.area))];

  const solicitudesFiltradas = useMemo(() => {
    let result = solicitudes.filter((s) => {
      const byUsuario = s.usuario.toLowerCase().includes(filters.usuario.toLowerCase());
      const byPrioridad = filters.prioridad === "Todas" || s.prioridad === filters.prioridad;
      const byArea = filters.area === "Todas" || s.area === filters.area;
      const byCercanas = !filters.cercanas || getHorasRestantes(s.fechaLimite) <= 48;

      return byUsuario && byPrioridad && byArea && byCercanas;
    });

    if (filters.orden === "Menos tiempo restante") {
      result = [...result].sort((a, b) => getHorasRestantes(a.fechaLimite) - getHorasRestantes(b.fechaLimite));
    }

    if (filters.orden === "Mayor prioridad") {
      const weight = { Alta: 1, Media: 2, Baja: 3 };
      result = [...result].sort((a, b) => weight[a.prioridad] - weight[b.prioridad]);
    }

    if (filters.orden === "Área") {
      result = [...result].sort((a, b) => a.area.localeCompare(b.area));
    }

    return result;
  }, [solicitudes, filters]);

  const notificaciones = solicitudes.filter((s) => !s.finalizada && getHorasRestantes(s.fechaLimite) <= 48);
  const totalNotificaciones = notificaciones.length;

  const updateFilter = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }));
  };

  const abrirGestion = (solicitud) => {
    setSeleccionada(solicitud);
    setVista("gestion");
  };

  const abrirDetalle = (solicitud) => {
    setSeleccionada(solicitud);
    setVista("detalle");
  };

  const volver = () => {
    setSeleccionada(null);
    setVista("lista");
  };

  const actualizarSolicitud = (id, patch) => {
    setSolicitudes((current) =>
      current.map((s) => (s.id === id ? { ...s, ...patch } : s))
    );
    setSeleccionada((current) => (current ? { ...current, ...patch } : current));
  };

  if (vista === "gestion" && seleccionada) {
    return (
      <GestionSolicitud
        solicitud={seleccionada}
        onBack={volver}
        onUpdate={actualizarSolicitud}
      />
    );
  }

  if (vista === "detalle" && seleccionada) {
    return (
      <DetalleSolicitud
        solicitud={seleccionada}
        onBack={volver}
      />
    );
  }

  return (
    <div className="min-h-full bg-[#f8fafc] text-slate-800">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 shadow-sm md:px-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Solicitudes
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Revisa y gestiona las solicitudes de mantenimiento asignadas a tu área.
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
              <p className="font-bold text-slate-900">Notificaciones</p>
              <div className="mt-3 space-y-3">
                {notificaciones.length === 0 && (
                  <p className="text-sm text-slate-500">No hay solicitudes cercanas a vencer.</p>
                )}

                {notificaciones.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => abrirDetalle(item)}
                    className="w-full rounded-lg border border-slate-100 p-3 text-left transition hover:bg-slate-50"
                  >
                    <p className="text-sm font-bold text-slate-800">
                      Solicitud #{item.id}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.area} · {formatTiempoRestante(item.fechaLimite)}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="p-4 md:p-8">

        <section className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            <Field
              label="Usuario"
              value={filters.usuario}
              onChange={(event) => updateFilter("usuario", event.target.value)}
              placeholder="Nombre de usuario"
            />

            <Select
              label="Prioridad"
              value={filters.prioridad}
              onChange={(event) => updateFilter("prioridad", event.target.value)}
              options={["Todas", "Alta", "Media", "Baja"]}
            />

            <Select
              label="Área"
              value={filters.area}
              onChange={(event) => updateFilter("area", event.target.value)}
              options={areas}
            />

            <Select
              label="Ordenar"
              value={filters.orden}
              onChange={(event) => updateFilter("orden", event.target.value)}
              options={["Por defecto", "Menos tiempo restante", "Mayor prioridad", "Área"]}
            />
          </div>

          <div className="mt-5 flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex items-center gap-3 text-sm font-bold text-slate-600">
              <button
                type="button"
                onClick={() => updateFilter("cercanas", !filters.cercanas)}
                className={`h-8 w-14 rounded-full p-1 transition ${
                  filters.cercanas ? "bg-[rgb(183,183,183)]" : "bg-slate-300"
                }`}
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white shadow transition ${
                    filters.cercanas ? "translate-x-6" : ""
                  }`}
                />
              </button>
              Solo cercanas a vencer
              <span className="font-medium text-slate-400">(menos de 48h)</span>
            </label>

            <button
              onClick={() =>
                setFilters({
                  usuario: "",
                  prioridad: "Todas",
                  area: "Todas",
                  orden: "Por defecto",
                  cercanas: false,
                })
              }
              className="rounded-lg px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:opacity-90"
              style={{ backgroundColor: MAIN }}
            >
              Limpiar filtros
            </button>
          </div>
        </section>

        <section className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:block">
          <table className="w-full min-w-[980px] text-sm">
            <thead style={{ backgroundColor: MAIN }} className="text-white">
              <tr>
                <th className="px-5 py-4 text-left">ID</th>
                <th className="px-5 py-4 text-left">Usuario</th>
                <th className="px-5 py-4 text-left">Área</th>
                <th className="px-5 py-4 text-left">Prioridad</th>
                <th className="px-5 py-4 text-left">Descripción</th>
                <th className="px-5 py-4 text-center">Estado</th>
                <th className="px-5 py-4 text-center">Tiempo restante</th>
                <th className="px-5 py-4 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {solicitudesFiltradas.map((item) => (
                <tr key={item.id} className="transition hover:bg-slate-50">
                  <td className="px-5 py-5 font-bold">{item.id}</td>
                  <td className="px-5 py-5">{item.usuario}</td>
                  <td className="px-5 py-5">{item.area}</td>
                  <td className="px-5 py-5 font-bold">{item.prioridad}</td>
                  <td className="px-5 py-5">{item.descripcion}</td>
                  <td className="px-5 py-5 text-center">
                    <span className="rounded-lg px-3 py-1 text-xs font-bold text-white" style={{ backgroundColor: MAIN }}>
                      {item.estado}
                    </span>
                  </td>
                  <td className="px-5 py-5 text-center font-bold">
                    <span className={getHorasRestantes(item.fechaLimite) < 0 ? "text-red-700" : "text-slate-700"}>
                      {formatTiempoRestante(item.fechaLimite)}
                    </span>
                  </td>
                  <td className="px-5 py-5">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => abrirGestion(item)}
                        className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-600"
                      >
                        Gestionar
                      </button>
                      <button
                        onClick={() => abrirDetalle(item)}
                        className="rounded-lg px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
                        style={{ backgroundColor: MAIN }}
                      >
                        Ver
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {solicitudesFiltradas.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-5 py-12 text-center">
                    <p className="font-bold text-slate-700">No hay solicitudes para mostrar</p>
                    <p className="mt-1 text-sm text-slate-500">Ajusta los filtros para ver más resultados.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <section className="space-y-4 lg:hidden">
          {solicitudesFiltradas.map((item) => (
            <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-lg font-bold">#{item.id}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.area}</p>
                </div>
                <span className="rounded-lg px-3 py-1 text-xs font-bold text-white" style={{ backgroundColor: MAIN }}>
                  {item.estado}
                </span>
              </div>

              <p className="mt-4 text-sm text-slate-600">{item.descripcion}</p>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <Info label="Usuario" value={item.usuario} />
                <Info label="Prioridad" value={item.prioridad} />
                <Info label="Tiempo" value={formatTiempoRestante(item.fechaLimite)} />
                <Info label="Tipo" value={item.tipo} />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  onClick={() => abrirGestion(item)}
                  className="rounded-lg bg-emerald-500 py-3 text-sm font-bold text-white"
                >
                  Gestionar
                </button>
                <button
                  onClick={() => abrirDetalle(item)}
                  className="rounded-lg py-3 text-sm font-bold text-white"
                  style={{ backgroundColor: MAIN }}
                >
                  Ver
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

function GestionSolicitud({ solicitud, onBack, onUpdate }) {
  const [tecnico, setTecnico] = useState(solicitud.tecnico || "");
  const [tecnicoFinal, setTecnicoFinal] = useState("");
  const [fechaEjecucion, setFechaEjecucion] = useState("");
  const [imagenes, setImagenes] = useState([]);
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [justificacion, setJustificacion] = useState("");

  const asignarTecnico = () => {
    if (!tecnico) return;
    onUpdate(solicitud.id, { tecnico });
  };

  const finalizar = () => {
    if (!tecnicoFinal || !fechaEjecucion) return;
    onUpdate(solicitud.id, {
      finalizada: true,
      estado: "Esperando usuario",
      tecnico: tecnicoFinal,
      fechaEjecucion,
      imagenes,
    });
  };

  const solicitarTiempo = () => {
    if (!nuevaFecha || !justificacion.trim()) return;
    onUpdate(solicitud.id, {
      fechaLimite: nuevaFecha,
      tiempoExtra: Math.max(0, Math.round(getHorasRestantes(nuevaFecha))),
      respuestaTiempoExtra: "Pendiente de aprobación",
      justificacionTiempoExtra: justificacion,
    });
  };

  return (
    <div className="min-h-full bg-[#f8fafc] p-4 text-slate-800 md:p-8">
      <button
        onClick={onBack}
        className="mb-6 rounded-lg px-4 py-2 text-sm font-bold text-white shadow-sm"
        style={{ backgroundColor: MAIN }}
      >
        ← Volver
      </button>

      <section className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="border-b pb-3 text-2xl font-bold" style={{ color: MAIN, borderColor: MAIN }}>
          Gestión de solicitud #{solicitud.id}
        </h1>

        <div className="mt-5 grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
          <Info label="Área" value={solicitud.area} />
          <Info label="Subárea" value={solicitud.subarea} />
          <Info label="Tipo" value={solicitud.tipo} />
          <Info label="Problema" value={solicitud.problema} />
          <Info label="Prioridad" value={solicitud.prioridad} />
          <Info label="Estado" value={solicitud.estado} />
          <Info label="Fecha de solicitud" value={formatDateTime(solicitud.fechaSolicitud)} />
          <Info label="Fecha límite" value={formatDateTime(solicitud.fechaLimite)} />
        </div>

        <ActionBox title="Asignar Técnico Oficial" description="Selecciona el técnico que quedará registrado oficialmente para esta solicitud.">
          <SelectPlain value={tecnico} onChange={(e) => setTecnico(e.target.value)} options={["", ...tecnicos]} placeholder="Seleccione el empleado..." />
          <button onClick={asignarTecnico} className="mt-4 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white">
            Asignar
          </button>
        </ActionBox>

        <ActionBox title="Finalizar solicitud" description="Registra el técnico, fecha e imágenes de evidencia.">
          <SelectPlain value={tecnicoFinal} onChange={(e) => setTecnicoFinal(e.target.value)} options={["", ...tecnicos]} placeholder="Seleccione el empleado..." />
          <input
            type="datetime-local"
            value={fechaEjecucion}
            onChange={(e) => setFechaEjecucion(e.target.value)}
            className="mt-4 h-11 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none focus:ring-4 focus:ring-slate-100"
          />
          <input
            type="file"
            multiple
            onChange={(e) => setImagenes(Array.from(e.target.files || []))}
            className="mt-4 w-full rounded-lg border border-slate-200 p-3 text-sm"
          />
          <p className="mt-2 text-xs text-slate-500">
            Puedes subir múltiples imágenes como evidencia.
          </p>
          <button onClick={finalizar} className="mt-4 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white">
            Marcar como realizado
          </button>
        </ActionBox>

        <ActionBox title="Solicitar tiempo extra" description="Registra una nueva fecha límite y la justificación.">
          <input
            type="datetime-local"
            value={nuevaFecha}
            onChange={(e) => setNuevaFecha(e.target.value)}
            className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none focus:ring-4 focus:ring-slate-100"
          />
          <textarea
            value={justificacion}
            onChange={(e) => setJustificacion(e.target.value)}
            placeholder="Justificación..."
            className="mt-4 min-h-28 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-slate-100"
          />
          <button onClick={solicitarTiempo} className="mt-4 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white">
            Solicitar tiempo extra
          </button>
        </ActionBox>
      </section>
    </div>
  );
}

function DetalleSolicitud({ solicitud, onBack }) {
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
            <div key={label} className="grid grid-cols-1 border-b border-slate-200 last:border-b-0 md:grid-cols-[320px_1fr]">
              <div className="px-5 py-4 font-bold text-white" style={{ backgroundColor: MAIN }}>
                {label}
              </div>
              <div className="bg-slate-50 px-5 py-4 font-medium text-slate-700">
                {value}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          <h2 className="text-xl font-bold text-emerald-500">Gestión de tiempos</h2>
          <p><strong>Fecha límite:</strong> {formatDateTime(solicitud.fechaLimite)}</p>
          <p><strong>Tiempo extra:</strong> {solicitud.tiempoExtra || 0} h</p>
          <p><strong>Tiempo restante:</strong> {formatTiempoRestante(solicitud.fechaLimite)}</p>
          <h3 className="pt-3 text-lg font-bold text-emerald-500">Respuesta de la última solicitud de tiempo extra:</h3>
          <p>{solicitud.respuestaTiempoExtra || "No hay solicitudes registradas."}</p>
          <h3 className="pt-3 text-lg font-bold text-emerald-500">Evaluación</h3>
          <p>No hay evaluaciones registradas.</p>
        </div>
      </section>
    </div>
  );
}

function ActionBox({ title, description, children }) {
  return (
    <section className="mt-8 rounded-xl border p-5" style={{ borderColor: MAIN }}>
      <h2 className="text-lg font-bold text-emerald-500">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Field({ label, ...props }) {
  return (
    <label>
      <span className="mb-2 block text-sm font-bold text-slate-600">{label}</span>
      <input
        {...props}
        className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none focus:border-[rgb(183,183,183)] focus:ring-4 focus:ring-slate-100"
      />
    </label>
  );
}

function Select({ label, options, ...props }) {
  return (
    <label>
      <span className="mb-2 block text-sm font-bold text-slate-600">{label}</span>
      <select
        {...props}
        className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none focus:border-[rgb(183,183,183)] focus:ring-4 focus:ring-slate-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function SelectPlain({ options, placeholder, ...props }) {
  return (
    <select
      {...props}
      className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none focus:ring-4 focus:ring-slate-100"
    >
      {options.map((option) => (
        <option key={option || "empty"} value={option}>
          {option || placeholder}
        </option>
      ))}
    </select>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function getHorasRestantes(date) {
  return (new Date(date) - new Date()) / (1000 * 60 * 60);
}

function formatTiempoRestante(date) {
  const hours = getHorasRestantes(date);

  if (hours < 0) return "VENCIDA";
  if (hours < 24) return `${Math.ceil(hours)} h`;
  return `${Math.ceil(hours / 24)} días`;
}

function formatDateTime(date) {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}
