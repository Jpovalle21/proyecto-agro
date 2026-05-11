import { useMemo, useState } from "react";

const empleados = [
  "Juan Pablo Ovalle - 1.234.567.890",
  "Andres Aranda Fernando - 1.112.223.334",
  "Juan Jose Zuluaga- 1.098.765.432",
];

const tabs = [
  "Permisos",
  "Inasistencias",
  "Incapacidades",
  "Suspensiones",
  "Llamados de Atención",
  "Vacaciones",
  "Descargos",
];

const historialesIniciales = {
  Permisos: [
    {
      tipo: "Remunerado",
      fechaInicial: "15/05/2024",
      fechaFinal: "15/05/2024",
      remunerado: "Sí",
      documento: "permiso_medico.pdf",
    },
    {
      tipo: "No remunerado",
      fechaInicial: "22/04/2024",
      fechaFinal: "22/04/2024",
      remunerado: "No",
      documento: "permiso_personal.pdf",
    },
    {
      tipo: "Licencia de paternidad",
      fechaInicial: "10/03/2024",
      fechaFinal: "17/03/2024",
      remunerado: "Sí",
      documento: "licencia_paternidad.pdf",
    },
  ],
};

export default function Novedades() {
  const [empleado, setEmpleado] = useState(empleados[0]);
  const [activeTab, setActiveTab] = useState("Permisos");
  const [form, setForm] = useState({
    tipo: "Remunerado",
    fechaInicial: "2024-05-15",
    fechaFinal: "2024-05-15",
    observaciones: "Salida médica programada.",
    documento: null,
  });
  const [historiales, setHistoriales] = useState(historialesIniciales);

  const historialActual = useMemo(() => {
    return historiales[activeTab] || [];
  }, [historiales, activeTab]);

  const handleChange = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleFile = (event) => {
    const file = event.target.files?.[0];

    setForm((current) => ({
      ...current,
      documento: file || null,
    }));
  };

  const guardarNovedad = () => {
    const nuevaNovedad = {
      tipo: form.tipo,
      fechaInicial: formatDate(form.fechaInicial),
      fechaFinal: formatDate(form.fechaFinal),
      remunerado: form.tipo === "Remunerado" ? "Sí" : "No",
      documento: form.documento?.name || "documento_soporte.pdf",
    };

    setHistoriales((current) => ({
      ...current,
      [activeTab]: [nuevaNovedad, ...(current[activeTab] || [])],
    }));
  };

  return (
    <div className="min-h-full bg-[#f8fafc] px-8 py-8 text-slate-800">
      <div className="mb-8">
        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          Novedades
        </h1>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Gestiona permisos, incapacidades, llamados de atención y otros registros del colaborador.
        </p>
      </div>

      <div className="mb-7 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <SummaryCard
          title="Total llamados de atención"
          value="18"
          subtitle="Este mes"
        />

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-600">
                Empleados con más llamados
              </h2>

              <div className="mt-5 space-y-3 text-base font-medium text-slate-600">
                <RankingLine index="1." name="Juan Pablo Ovalle" total="5" />
                <RankingLine index="2." name="Andres Aranda Fernando" total="4" />
                <RankingLine index="3." name="Juan Jose Zuluaga" total="3" />
              </div>
            </div>
          </div>
        </section>
      </div>

      <label className="mb-5 block max-w-xl">
        <span className="mb-3 block text-sm font-semibold text-slate-600">
          Selecciona un empleado
        </span>
        <select
          value={empleado}
          onChange={(event) => setEmpleado(event.target.value)}
          className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-purple-900 focus:ring-4 focus:ring-purple-100"
        >
          {empleados.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-7 flex gap-8 overflow-x-auto border-b border-slate-200 px-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 border-b-3 px-3 pb-4 text-sm font-bold transition ${
                  isActive
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_330px]">
          <div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <SelectInput
                label={`Tipo de ${activeTab.replace("s", "")}`}
                value={form.tipo}
                onChange={handleChange("tipo")}
                options={getOptionsByTab(activeTab)}
              />

              <DateInput
                label="Fecha Inicial"
                value={form.fechaInicial}
                onChange={handleChange("fechaInicial")}
              />

              <DateInput
                label="Fecha Final"
                value={form.fechaFinal}
                onChange={handleChange("fechaFinal")}
              />
            </div>

            <label className="mt-6 block">
              <span className="mb-3 block text-sm font-semibold text-slate-600">
                Observaciones
              </span>
              <textarea
                value={form.observaciones}
                onChange={handleChange("observaciones")}
                placeholder="Escribe una observación..."
                className="min-h-32 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
              />
            </label>
          </div>

          <div>
            <span className="mb-3 block text-sm font-semibold text-slate-600">
              Documento Soporte
            </span>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-lg bg-red-50 text-red-500">
                  <PdfIcon />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-800">
                    {form.documento?.name || "permiso_medico.pdf"}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-500">
                    PDF - 1,2 MB
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                <label className="cursor-pointer rounded-lg border border-slate-200 px-5 py-3 text-sm font-bold text-purple-600 transition hover:bg-purple-50">
                  Ver documento
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handleFile}
                  />
                </label>

                <button
                  onClick={() =>
                    setForm((current) => ({ ...current, documento: null }))
                  }
                  className="rounded-lg p-3 text-slate-500 transition hover:bg-red-50 hover:text-red-500"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>

            <button
              onClick={guardarNovedad}
              className="mt-7 h-12 w-full rounded-lg bg-purple-600 px-6 text-sm font-bold text-white shadow-md transition hover:bg-purple-700"
            >
              Guardar {activeTab.slice(0, -1)}
            </button>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          Historial de {activeTab}
        </h2>

        <div className="mt-5 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="bg-slate-50 text-xs font-bold text-slate-500">
              <tr>
                <th className="px-5 py-4 text-left">Tipo</th>
                <th className="px-5 py-4 text-center">Fecha Inicial</th>
                <th className="px-5 py-4 text-center">Fecha Final</th>
                <th className="px-5 py-4 text-center">Remunerado</th>
                <th className="px-5 py-4 text-left">Documento</th>
                <th className="px-5 py-4 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-600">
              {historialActual.map((item, index) => (
                <tr key={`${item.tipo}-${index}`}>
                  <td className="px-5 py-4 font-medium">{item.tipo}</td>
                  <td className="px-5 py-4 text-center">{item.fechaInicial}</td>
                  <td className="px-5 py-4 text-center">{item.fechaFinal}</td>
                  <td className="px-5 py-4 text-center">{item.remunerado}</td>
                  <td className="px-5 py-4 font-medium text-slate-600">
                    {item.documento}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-3 text-purple-600">
                      <button className="rounded-md p-2 transition hover:bg-purple-50">
                        <EyeIcon />
                      </button>
                      <button className="rounded-md p-2 transition hover:bg-purple-50">
                        <DownloadIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {historialActual.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center">
                    <p className="text-base font-bold text-slate-700">
                      No hay registros en esta categoría
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Guarda una novedad para verla en el historial.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({ title, value, subtitle, icon }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-600">{title}</h2>
          <p className="mt-6 text-5xl font-bold text-slate-900">{value}</p>
          <p className="mt-4 text-base font-medium text-slate-500">{subtitle}</p>
        </div>
      </div>
    </section>
  );
}

function RankingLine({ index, name, total }) {
  return (
    <div className="grid grid-cols-[28px_1fr_auto] items-center gap-3">
      <span>{index}</span>
      <span>{name}</span>
      <span className="font-bold text-slate-800">{total}</span>
    </div>
  );
}

function SelectInput({ label, value, onChange, options }) {
  return (
    <label>
      <span className="mb-3 block text-sm font-semibold text-slate-600">
        {label}
      </span>
      <select
        value={value}
        onChange={onChange}
        className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function DateInput({ label, value, onChange }) {
  return (
    <label>
      <span className="mb-3 block text-sm font-semibold text-slate-600">
        {label}
      </span>
      <input
        type="date"
        value={value}
        onChange={onChange}
        className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
      />
    </label>
  );
}

function getOptionsByTab(tab) {
  const options = {
    Permisos: ["Remunerado", "No remunerado", "Licencia de paternidad"],
    Inasistencias: ["Justificada", "No justificada"],
    Incapacidades: ["Enfermedad general", "Accidente laboral", "Licencia médica"],
    Suspensiones: ["Disciplinaria", "Temporal", "Contrato suspendido"],
    "Llamados de Atención": ["Verbal", "Escrito", "Reincidencia"],
    Vacaciones: ["Ordinarias", "Colectivas", "Anticipadas"],
    Descargos: ["Citación", "Acta de descargos", "Cierre de proceso"],
  };

  return options[tab] || ["General"];
}

function formatDate(date) {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};

function PdfIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-8 w-8">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M8 15h1.5a1.5 1.5 0 0 0 0-3H8v5" />
      <path d="M13 12v5" />
      <path d="M16 12h2" />
      <path d="M16 15h1.5" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}
