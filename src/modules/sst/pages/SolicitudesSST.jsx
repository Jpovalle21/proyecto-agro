import { useEffect, useMemo, useState } from "react";
import {
  createSolicitudSst,
  loadSolicitudesSst,
  saveSolicitudesSst,
} from "../data/sstStore";

const areas = ["Produccion", "Mantenimiento", "Calidad", "Almacen", "Gestion Humana", "Ambiental", "Despacho", "Compras"];

const emptyForm = {
  tipo: "Solicitud",
  area: "Produccion",
  reporta: "",
  prioridad: "Media",
  titulo: "",
  descripcion: "",
};

export default function SolicitudesSST() {
  const [records, setRecords] = useState(() => loadSolicitudesSst());
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Todos");
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    saveSolicitudesSst(records);
  }, [records]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return records
      .filter((item) => status === "Todos" || item.estado === status)
      .filter((item) => `${item.tipo} ${item.area} ${item.reporta} ${item.titulo} ${item.descripcion}`.toLowerCase().includes(term))
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
  }, [records, search, status]);

  const counts = records.reduce((acc, item) => {
    acc[item.estado] = (acc[item.estado] || 0) + 1;
    return acc;
  }, {});

  const submit = (event) => {
    event.preventDefault();
    if (!form.reporta.trim() || !form.titulo.trim() || !form.descripcion.trim()) {
      setMessage("Completa quien reporta, titulo y descripcion.");
      return;
    }

    const record = createSolicitudSst({
      ...form,
      reporta: form.reporta.trim(),
      titulo: form.titulo.trim(),
      descripcion: form.descripcion.trim(),
    });

    setRecords((current) => [record, ...current]);
    setSelected(record);
    setForm(emptyForm);
    setMessage("Reporte enviado a SST.");
  };

  const updateStatus = (id, estado) => {
    setRecords((current) => current.map((item) => (item.id === id ? { ...item, estado } : item)));
    setSelected((current) => (current?.id === id ? { ...current, estado } : current));
  };

  const saveActions = (id, acciones) => {
    setRecords((current) => current.map((item) => (item.id === id ? { ...item, acciones } : item)));
    setSelected((current) => (current?.id === id ? { ...current, acciones } : current));
  };

  return (
    <div className="min-h-full bg-[#f8fafc] p-6 text-slate-800">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#e67e22]">SST</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Solicitudes e incidentes</h1>
        <p className="mt-2 max-w-3xl text-sm font-medium text-slate-500">
          Canal para que otras areas reporten incidentes, condiciones inseguras o solicitudes de apoyo.
        </p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Metric label="Recibidos" value={counts.Recibido || 0} />
        <Metric label="En revision" value={counts["En revision"] || 0} warning />
        <Metric label="Cerrados" value={counts.Cerrado || 0} />
        <Metric label="Total" value={records.length} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <form onSubmit={submit} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Nuevo reporte</h2>
          <p className="mt-1 text-sm text-slate-500">
            Este formulario simula el canal que usarian las demas areas.
          </p>
          {message && <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">{message}</p>}

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Tipo">
              <select className="sst-input" value={form.tipo} onChange={(event) => setForm({ ...form, tipo: event.target.value })}>
                <option>Solicitud</option>
                <option>Incidente</option>
                <option>Acto inseguro</option>
                <option>Condicion insegura</option>
                <option>Capacitacion</option>
              </select>
            </Field>
            <Field label="Area">
              <select className="sst-input" value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value })}>
                {areas.map((area) => <option key={area}>{area}</option>)}
              </select>
            </Field>
            <Field label="Reporta">
              <input className="sst-input" value={form.reporta} onChange={(event) => setForm({ ...form, reporta: event.target.value })} />
            </Field>
            <Field label="Prioridad">
              <select className="sst-input" value={form.prioridad} onChange={(event) => setForm({ ...form, prioridad: event.target.value })}>
                <option>Baja</option>
                <option>Media</option>
                <option>Alta</option>
                <option>Critica</option>
              </select>
            </Field>
          </div>

          <Field label="Titulo">
            <input className="sst-input" value={form.titulo} onChange={(event) => setForm({ ...form, titulo: event.target.value })} />
          </Field>

          <Field label="Descripcion">
            <textarea className="sst-input min-h-32" value={form.descripcion} onChange={(event) => setForm({ ...form, descripcion: event.target.value })} />
          </Field>

          <button className="mt-4 w-full rounded-lg bg-[#003049] px-4 py-3 text-sm font-bold text-white">
            Enviar a SST
          </button>
        </form>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 grid gap-3 md:grid-cols-[1fr_160px]">
            <input className="sst-input" placeholder="Buscar por area, responsable, titulo o descripcion" value={search} onChange={(event) => setSearch(event.target.value)} />
            <select className="sst-input" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option>Todos</option>
              <option>Recibido</option>
              <option>En revision</option>
              <option>Cerrado</option>
            </select>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_0.95fr]">
            <div className="space-y-3">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className={`w-full rounded-xl border p-4 text-left transition ${selected?.id === item.id ? "border-[#e67e22] bg-orange-50" : "border-slate-200 hover:border-slate-300"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-950">{item.titulo}</p>
                      <p className="text-sm text-slate-500">{item.tipo} · {item.area} · {item.reporta}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${priorityClass(item.prioridad)}`}>
                      {item.prioridad}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">{item.descripcion}</p>
                  <p className="mt-2 text-xs font-semibold text-slate-400">{item.fecha} · {item.estado}</p>
                </button>
              ))}
            </div>

            <Detail selected={selected} onStatus={updateStatus} onActions={saveActions} />
          </div>
        </section>
      </div>
    </div>
  );
}

function Detail({ selected, onStatus, onActions }) {
  const [actions, setActions] = useState("");

  useEffect(() => {
    setActions(selected?.acciones || "");
  }, [selected]);

  if (!selected) {
    return (
      <div className="flex min-h-72 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm font-semibold text-slate-400">
        Selecciona un reporte para ver detalle y registrar acciones.
      </div>
    );
  }

  return (
    <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Detalle</p>
      <h3 className="mt-2 text-lg font-bold text-slate-950">{selected.titulo}</h3>
      <p className="mt-1 text-sm text-slate-500">{selected.tipo} · {selected.area} · {selected.fecha}</p>
      <p className="mt-4 text-sm text-slate-700">{selected.descripcion}</p>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {["Recibido", "En revision", "Cerrado"].map((estado) => (
          <button
            key={estado}
            onClick={() => onStatus(selected.id, estado)}
            className={`rounded-lg px-3 py-2 text-xs font-bold ${selected.estado === estado ? "bg-[#003049] text-white" : "bg-white text-slate-600"}`}
          >
            {estado}
          </button>
        ))}
      </div>

      <label className="mt-4 block">
        <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Acciones SST</span>
        <textarea className="sst-input min-h-28" value={actions} onChange={(event) => setActions(event.target.value)} />
      </label>
      <button onClick={() => onActions(selected.id, actions)} className="mt-3 w-full rounded-lg bg-[#e67e22] px-4 py-2.5 text-sm font-bold text-white">
        Guardar acciones
      </button>
    </article>
  );
}

function Metric({ label, value, warning }) {
  return (
    <div className={`rounded-xl border bg-white px-4 py-3 shadow-sm ${warning ? "border-amber-200" : "border-slate-200"}`}>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className={`mt-1 text-2xl font-black ${warning ? "text-amber-600" : "text-slate-950"}`}>{value}</p>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="mt-4 block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span>
      {children}
    </label>
  );
}

function priorityClass(priority) {
  const classes = {
    Baja: "bg-slate-100 text-slate-600",
    Media: "bg-sky-100 text-sky-700",
    Alta: "bg-amber-100 text-amber-700",
    Critica: "bg-red-100 text-red-700",
  };
  return classes[priority] || classes.Media;
}
