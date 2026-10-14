import { useEffect, useMemo, useState } from "react";
import {
  examStatusMeta,
  excelReferenceSummary,
  getDaysToDue,
  getExamDueDate,
  getExamStatus,
  loadExamenes,
  saveExamenes,
} from "../data/sstStore";

const emptyForm = {
  nombre: "",
  cedula: "",
  cargo: "",
  tipoExamen: "Periodico",
  fechaExamen: new Date().toISOString().slice(0, 10),
  concepto: "Apto para el cargo",
  observacion: "",
};

export default function ExamenesMedicosSST() {
  const [records, setRecords] = useState(() => loadExamenes());
  const [status, setStatus] = useState("todos");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");

  useEffect(() => {
    saveExamenes(records);
  }, [records]);

  const counts = records.reduce((acc, item) => {
    acc[item.estado] = (acc[item.estado] || 0) + 1;
    return acc;
  }, {});

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return records
      .filter((item) => status === "todos" || item.estado === status)
      .filter((item) => `${item.nombre} ${item.cedula} ${item.cargo} ${item.concepto} ${item.observacion}`.toLowerCase().includes(term))
      .sort((a, b) => {
        const order = { vencido: 0, por_vencer: 1, sin_fecha: 2, faltante: 3, vigente: 4 };
        return (order[a.estado] ?? 9) - (order[b.estado] ?? 9) || (a.dias ?? 999) - (b.dias ?? 999);
      });
  }, [records, search, status]);

  const register = (event) => {
    event.preventDefault();
    if (!form.nombre.trim() || !form.cedula.trim() || !form.fechaExamen) {
      setMessage("Completa nombre, cedula y fecha del examen.");
      return;
    }

    const fechaVencimiento = getExamDueDate(form.fechaExamen);
    const estado = getExamStatus(fechaVencimiento);

    setRecords((current) => [
      {
        ...form,
        id: crypto.randomUUID(),
        fechaVencimiento,
        estado,
        dias: getDaysToDue(fechaVencimiento),
        nombre: form.nombre.trim(),
        cedula: form.cedula.trim(),
        cargo: form.cargo.trim(),
        observacion: form.observacion.trim(),
      },
      ...current,
    ]);
    setForm(emptyForm);
    setMessage("Examen medico actualizado.");
  };

  const markScheduled = (id) => {
    setRecords((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, observacion: `${item.observacion ? `${item.observacion} | ` : ""}Cita solicitada por SST.` }
          : item
      )
    );
  };

  return (
    <div className="min-h-full bg-[#f8fafc] p-6 text-slate-800">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#e67e22]">SST</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Exámenes médicos ocupacionales</h1>
        <p className="mt-2 max-w-3xl text-sm font-medium text-slate-500">
          Seguimiento de personal activo: faltantes, vencidos, por vencer, vigentes y registros sin fecha.
        </p>
      </div>

      <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          <Summary label="Activos" value={excelReferenceSummary.examenes.personalActivo} />
          <Summary label="Vencidos" value={counts.vencido || 0} danger />
          <Summary label="Por vencer" value={counts.por_vencer || 0} warning />
          <Summary label="Vigentes" value={counts.vigente || 0} />
          <Summary label="Faltan" value={counts.faltante || 0} muted />
          <Summary label="Sin fecha" value={counts.sin_fecha || 0} muted />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.25fr]">
        <form onSubmit={register} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Actualizar o registrar examen</h2>
          <p className="mt-1 text-sm text-slate-500">
            La fecha de vencimiento se calcula automaticamente a un año.
          </p>
          {message && <p className="mt-3 rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">{message}</p>}

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Nombre">
              <input className="sst-input" value={form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} />
            </Field>
            <Field label="Cedula">
              <input className="sst-input" value={form.cedula} onChange={(event) => setForm({ ...form, cedula: event.target.value })} />
            </Field>
            <Field label="Cargo">
              <input className="sst-input" value={form.cargo} onChange={(event) => setForm({ ...form, cargo: event.target.value })} />
            </Field>
            <Field label="Tipo examen">
              <select className="sst-input" value={form.tipoExamen} onChange={(event) => setForm({ ...form, tipoExamen: event.target.value })}>
                <option>Ingreso</option>
                <option>Periodico</option>
                <option>Post incapacidad</option>
                <option>Alturas</option>
                <option>Retiro</option>
              </select>
            </Field>
            <Field label="Fecha examen">
              <input className="sst-input" type="date" value={form.fechaExamen} onChange={(event) => setForm({ ...form, fechaExamen: event.target.value })} />
            </Field>
            <Field label="Concepto">
              <input className="sst-input" value={form.concepto} onChange={(event) => setForm({ ...form, concepto: event.target.value })} />
            </Field>
          </div>

          <Field label="Observacion">
            <textarea className="sst-input min-h-24" value={form.observacion} onChange={(event) => setForm({ ...form, observacion: event.target.value })} />
          </Field>

          <button className="mt-4 w-full rounded-lg bg-[#003049] px-4 py-3 text-sm font-bold text-white">
            Guardar examen
          </button>
        </form>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 grid gap-3 md:grid-cols-[1fr_190px]">
            <input className="sst-input" placeholder="Buscar por nombre, cedula, cargo o concepto" value={search} onChange={(event) => setSearch(event.target.value)} />
            <select className="sst-input" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="todos">Todos</option>
              {Object.entries(examStatusMeta).map(([key, meta]) => (
                <option key={key} value={key}>{meta.label}</option>
              ))}
            </select>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {Object.entries(examStatusMeta).map(([key, meta]) => (
              <button
                key={key}
                onClick={() => setStatus(key)}
                className={`rounded-full px-3 py-1 text-xs font-bold ${status === key ? "bg-[#003049] text-white" : "bg-slate-100 text-slate-600"}`}
              >
                {meta.label}: {counts[key] || 0}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((item) => (
              <article key={item.id} className="rounded-xl border border-slate-200 p-4 transition hover:border-[#e67e22]">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="font-bold text-slate-950">{item.nombre}</p>
                    <p className="text-sm text-slate-500">{item.cedula} · {item.cargo || "Sin cargo"} · {item.tipoExamen || "Sin tipo"}</p>
                    <p className="mt-2 text-sm text-slate-600">{item.concepto || item.observacion || "Sin concepto registrado"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(item.estado)}`}>
                      {examStatusMeta[item.estado]?.label || item.estado}
                    </span>
                    <button onClick={() => markScheduled(item.id)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50">
                      Marcar cita
                    </button>
                  </div>
                </div>
                <div className="mt-3 grid gap-2 text-xs text-slate-500 sm:grid-cols-3">
                  <span>Examen: {item.fechaExamen || "Sin fecha"}</span>
                  <span>Vence: {item.fechaVencimiento || "Sin fecha"}</span>
                  <span>Dias: {item.dias ?? "No calculado"}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Summary({ label, value, danger, warning, muted }) {
  return (
    <div className={`rounded-xl border px-4 py-3 ${danger ? "border-red-200 bg-red-50" : warning ? "border-amber-200 bg-amber-50" : muted ? "border-slate-200 bg-slate-50" : "border-emerald-200 bg-emerald-50"}`}>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-black ${danger ? "text-red-700" : warning ? "text-amber-700" : "text-slate-950"}`}>{value}</p>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span>
      {children}
    </label>
  );
}

function statusClass(status) {
  const classes = {
    vencido: "bg-red-100 text-red-700",
    por_vencer: "bg-amber-100 text-amber-700",
    vigente: "bg-emerald-100 text-emerald-700",
    faltante: "bg-slate-100 text-slate-700",
    sin_fecha: "bg-sky-100 text-sky-700",
  };
  return classes[status] || "bg-slate-100 text-slate-700";
}
