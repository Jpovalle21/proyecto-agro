import { Link } from "react-router-dom";
import {
  examStatusMeta,
  excelReferenceSummary,
  loadExamenes,
  loadIncapacidades,
  loadSolicitudesSst,
  money,
} from "../data/sstStore";

export default function DashboardSST() {
  const examenes = loadExamenes();
  const incapacidades = loadIncapacidades();
  const solicitudes = loadSolicitudesSst();

  const examCounts = examenes.reduce((acc, item) => {
    acc[item.estado] = (acc[item.estado] || 0) + 1;
    return acc;
  }, {});

  const solicitudesAbiertas = solicitudes.filter((item) => item.estado !== "Cerrado");
  const incapacidadesPendientes = incapacidades.filter((item) => !item.pagada);
  const valorPendiente = incapacidadesPendientes.reduce((total, item) => total + Number(item.valor || 0), 0);

  const prioridades = [
    ...examenes
      .filter((item) => item.estado === "vencido" || item.estado === "por_vencer")
      .slice(0, 5)
      .map((item) => ({
        id: item.id,
        title: item.nombre,
        detail: `${examStatusMeta[item.estado].label} · ${item.cargo || "Sin cargo"} · ${item.dias ?? "-"} dias`,
        tone: item.estado === "vencido" ? "red" : "amber",
      })),
    ...solicitudesAbiertas.slice(0, 3).map((item) => ({
      id: item.id,
      title: item.titulo,
      detail: `${item.tipo} · ${item.area} · ${item.prioridad}`,
      tone: item.prioridad === "Alta" ? "red" : "sky",
    })),
  ];

  return (
    <div className="min-h-full bg-[#f8fafc] p-6 text-slate-800">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#e67e22]">
            Seguridad y salud en el trabajo
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Dashboard SST</h1>
          <p className="mt-2 max-w-3xl text-sm font-medium text-slate-500">
            Controla incapacidades, examenes medicos ocupacionales y reportes enviados por otras areas.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Metric label="Personal activo" value={excelReferenceSummary.examenes.personalActivo} />
          <Metric label="Solicitudes abiertas" value={solicitudesAbiertas.length} />
          <Metric label="Pendiente pago" value={money(valorPendiente)} danger={valorPendiente > 0} />
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatusCard label="Vencidos" value={examCounts.vencido || 0} reference={excelReferenceSummary.examenes.vencidos} tone="red" />
        <StatusCard label="Por vencer" value={examCounts.por_vencer || 0} reference={excelReferenceSummary.examenes.porVencer} tone="amber" />
        <StatusCard label="Vigentes" value={examCounts.vigente || 0} reference={excelReferenceSummary.examenes.vigentes} tone="emerald" />
        <StatusCard label="Faltan" value={examCounts.faltante || 0} reference={excelReferenceSummary.examenes.faltan} tone="slate" />
        <StatusCard label="Sin fecha" value={examCounts.sin_fecha || 0} reference={excelReferenceSummary.examenes.sinFecha} tone="sky" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-950">Prioridades de seguimiento</h2>
              <p className="text-sm text-slate-500">Lo mas urgente para revisar hoy.</p>
            </div>
            <Link className="rounded-lg bg-[#003049] px-4 py-2 text-sm font-semibold text-white" to="/app/sst/examenes-medicos">
              Ver examenes
            </Link>
          </div>

          <div className="space-y-3">
            {prioridades.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.detail}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${toneClass(item.tone)}`}>
                  Seguimiento
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Accesos rapidos</h2>
          <div className="mt-4 grid gap-3">
            <QuickLink to="/app/sst/incapacidades" title="Registrar incapacidad" detail="EPS, ARL, dias, valor y estado de pago." />
            <QuickLink to="/app/sst/examenes-medicos" title="Actualizar examen" detail="Fecha, vencimiento, concepto y observaciones." />
            <QuickLink to="/app/sst/solicitudes" title="Reportar incidente" detail="Solicitud escrita desde cualquier area." />
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

function StatusCard({ label, value, reference, tone }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`mb-3 h-1.5 rounded-full ${barClass(tone)}`} />
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-black text-slate-950">{value}</p>
      <p className="mt-1 text-xs text-slate-400">Excel base: {reference}</p>
    </div>
  );
}

function QuickLink({ to, title, detail }) {
  return (
    <Link to={to} className="rounded-lg border border-slate-200 p-4 transition hover:border-[#e67e22] hover:bg-orange-50">
      <p className="font-bold text-slate-900">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{detail}</p>
    </Link>
  );
}

function toneClass(tone) {
  const classes = {
    red: "bg-red-100 text-red-700",
    amber: "bg-amber-100 text-amber-700",
    sky: "bg-sky-100 text-sky-700",
  };
  return classes[tone] || "bg-slate-100 text-slate-700";
}

function barClass(tone) {
  const classes = {
    red: "bg-red-500",
    amber: "bg-amber-400",
    emerald: "bg-emerald-500",
    slate: "bg-slate-400",
    sky: "bg-sky-400",
  };
  return classes[tone] || "bg-slate-300";
}
