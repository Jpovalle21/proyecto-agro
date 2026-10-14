import { useEffect, useMemo, useState } from "react";
import {
  excelReferenceSummary,
  loadIncapacidades,
  money,
  saveIncapacidades,
} from "../data/sstStore";

const emptyForm = {
  fuente: "EPS",
  persona: "",
  cedula: "",
  tipo: "General",
  dias: "",
  fechaInicio: new Date().toISOString().slice(0, 10),
  entidad: "",
  seCobro: true,
  valor: "",
  pagada: false,
  observaciones: "",
};

export default function IncapacidadesSST() {
  const [records, setRecords] = useState(() => loadIncapacidades());
  const [search, setSearch] = useState("");
  const [source, setSource] = useState("Todas");
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");

  useEffect(() => {
    saveIncapacidades(records);
  }, [records]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return records.filter((item) => {
      const sourceMatch = source === "Todas" || item.fuente === source;
      const text = `${item.persona} ${item.cedula} ${item.tipo} ${item.entidad} ${item.observaciones}`.toLowerCase();
      return sourceMatch && text.includes(term);
    });
  }, [records, search, source]);

  const summary = useMemo(() => {
    const totalDias = filtered.reduce((total, item) => total + Number(item.dias || 0), 0);
    const totalValor = filtered.reduce((total, item) => total + Number(item.valor || 0), 0);
    const pendientes = filtered.filter((item) => !item.pagada).length;
    const cobradas = filtered.filter((item) => item.seCobro).length;
    return { totalDias, totalValor, pendientes, cobradas };
  }, [filtered]);

  const register = (event) => {
    event.preventDefault();
    if (!form.persona.trim() || !form.cedula.trim() || !form.dias || !form.fechaInicio) {
      setMessage("Completa persona, cedula, dias y fecha de inicio.");
      return;
    }

    setRecords((current) => [
      {
        ...form,
        id: crypto.randomUUID(),
        dias: Number(form.dias),
        valor: Number(form.valor || 0),
        persona: form.persona.trim(),
        cedula: form.cedula.trim(),
        entidad: form.entidad.trim(),
        observaciones: form.observaciones.trim(),
      },
      ...current,
    ]);
    setForm(emptyForm);
    setMessage("Incapacidad registrada.");
  };

  const togglePaid = (id) => {
    setRecords((current) =>
      current.map((item) => (item.id === id ? { ...item, pagada: !item.pagada } : item))
    );
  };

  return (
    <div className="min-h-full bg-[#f8fafc] p-6 text-slate-800">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#e67e22]">SST</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Incapacidades</h1>
        <p className="mt-2 max-w-3xl text-sm font-medium text-slate-500">
          Control de incapacidades EPS y ARL con cobro, valor, pago y observaciones.
        </p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Metric label="Registros visibles" value={filtered.length} />
        <Metric label="Dias acumulados" value={summary.totalDias} />
        <Metric label="Valor total" value={money(summary.totalValor)} />
        <Metric label="Pendientes pago" value={summary.pendientes} danger={summary.pendientes > 0} />
      </div>

      <section className="mb-6 rounded-xl border border-orange-200 bg-orange-50 p-4">
        <p className="text-sm font-bold text-orange-900">Referencia del Excel recibido</p>
        <p className="mt-1 text-sm text-orange-800">
          EPS: {excelReferenceSummary.incapacidades.epsRegistros} registros, {excelReferenceSummary.incapacidades.epsDias} dias,
          {` ${money(excelReferenceSummary.incapacidades.epsValor)} `}y {excelReferenceSummary.incapacidades.epsPendientesPago} pendientes de pago.
          ARL: {excelReferenceSummary.incapacidades.arlRegistros} registros, {excelReferenceSummary.incapacidades.arlDias} dias,
          {` ${money(excelReferenceSummary.incapacidades.arlValor)} `}y {excelReferenceSummary.incapacidades.arlPendientesPago} pendientes de pago.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.25fr]">
        <form onSubmit={register} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Registrar incapacidad</h2>
          {message && <p className="mt-3 rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">{message}</p>}

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Fuente">
              <select className="sst-input" value={form.fuente} onChange={(event) => setForm({ ...form, fuente: event.target.value })}>
                <option>EPS</option>
                <option>ARL</option>
              </select>
            </Field>
            <Field label="Tipo">
              <input className="sst-input" value={form.tipo} onChange={(event) => setForm({ ...form, tipo: event.target.value })} />
            </Field>
            <Field label="Persona">
              <input className="sst-input" value={form.persona} onChange={(event) => setForm({ ...form, persona: event.target.value })} />
            </Field>
            <Field label="Cedula">
              <input className="sst-input" value={form.cedula} onChange={(event) => setForm({ ...form, cedula: event.target.value })} />
            </Field>
            <Field label="Dias">
              <input className="sst-input" type="number" min="1" value={form.dias} onChange={(event) => setForm({ ...form, dias: event.target.value })} />
            </Field>
            <Field label="Fecha inicio">
              <input className="sst-input" type="date" value={form.fechaInicio} onChange={(event) => setForm({ ...form, fechaInicio: event.target.value })} />
            </Field>
            <Field label="Entidad">
              <input className="sst-input" value={form.entidad} onChange={(event) => setForm({ ...form, entidad: event.target.value })} />
            </Field>
            <Field label="Valor">
              <input className="sst-input" type="number" min="0" value={form.valor} onChange={(event) => setForm({ ...form, valor: event.target.value })} />
            </Field>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">
              <input type="checkbox" checked={form.seCobro} onChange={(event) => setForm({ ...form, seCobro: event.target.checked })} />
              Se cobro
            </label>
            <label className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">
              <input type="checkbox" checked={form.pagada} onChange={(event) => setForm({ ...form, pagada: event.target.checked })} />
              Pagada
            </label>
          </div>

          <Field label="Observaciones">
            <textarea className="sst-input min-h-24" value={form.observaciones} onChange={(event) => setForm({ ...form, observaciones: event.target.value })} />
          </Field>

          <button className="mt-4 w-full rounded-lg bg-[#003049] px-4 py-3 text-sm font-bold text-white">
            Guardar incapacidad
          </button>
        </form>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 grid gap-3 md:grid-cols-[1fr_160px]">
            <input className="sst-input" placeholder="Buscar por persona, cedula, entidad u observacion" value={search} onChange={(event) => setSearch(event.target.value)} />
            <select className="sst-input" value={source} onChange={(event) => setSource(event.target.value)}>
              <option>Todas</option>
              <option>EPS</option>
              <option>ARL</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-3 py-3">Persona</th>
                  <th className="px-3 py-3">Tipo</th>
                  <th className="px-3 py-3">Dias</th>
                  <th className="px-3 py-3">Fecha</th>
                  <th className="px-3 py-3">Entidad</th>
                  <th className="px-3 py-3">Valor</th>
                  <th className="px-3 py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-3 py-3">
                      <p className="font-semibold text-slate-900">{item.persona}</p>
                      <p className="text-xs text-slate-400">{item.cedula} · {item.fuente}</p>
                    </td>
                    <td className="px-3 py-3">{item.tipo}</td>
                    <td className="px-3 py-3 font-bold">{item.dias}</td>
                    <td className="px-3 py-3">{item.fechaInicio}</td>
                    <td className="px-3 py-3">{item.entidad}</td>
                    <td className="px-3 py-3">{money(item.valor)}</td>
                    <td className="px-3 py-3">
                      <button onClick={() => togglePaid(item.id)} className={`rounded-full px-3 py-1 text-xs font-bold ${item.pagada ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                        {item.pagada ? "Pagada" : "Pendiente"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function Metric({ label, value, danger }) {
  return (
    <div className={`rounded-xl border bg-white px-4 py-3 shadow-sm ${danger ? "border-red-200" : "border-slate-200"}`}>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className={`mt-1 text-xl font-black ${danger ? "text-red-600" : "text-slate-950"}`}>{value}</p>
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
