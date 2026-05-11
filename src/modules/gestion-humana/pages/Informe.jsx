import { useMemo, useState } from "react";

const empleados = [
  {
    nombre: "Juan Camilo Pérez Gómez",
    documento: "1.234.567.890",
    area: "Producción",
    fechaIngreso: "2024-05-15",
    fechaRetiro: "",
    salario: 1800000,
    estado: "Activo",
  },
  {
    nombre: "María Alejandra López",
    documento: "1.098.765.432",
    area: "Calidad",
    fechaIngreso: "2023-03-20",
    fechaRetiro: "",
    salario: 2200000,
    estado: "Activo",
  },
  {
    nombre: "Pedro José Ramírez",
    documento: "1.112.223.334",
    area: "Mantenimiento",
    fechaIngreso: "2022-01-12",
    fechaRetiro: "2024-04-30",
    salario: 2000000,
    estado: "Retirado",
  },
  {
    nombre: "Laura Sofía Herrera",
    documento: "1.334.456.667",
    area: "Talento Humano",
    fechaIngreso: "2023-07-01",
    fechaRetiro: "",
    salario: 2500000,
    estado: "Activo",
  },
  {
    nombre: "Andrés Felipe Giraldo",
    documento: "1.222.333.444",
    area: "Almacén",
    fechaIngreso: "2024-02-05",
    fechaRetiro: "",
    salario: 1700000,
    estado: "Activo",
  },
  {
    nombre: "Daniela Morales Castro",
    documento: "1.101.112.111",
    area: "SST",
    fechaIngreso: "2023-08-18",
    fechaRetiro: "",
    salario: 2100000,
    estado: "Activo",
  },
  {
    nombre: "Carlos Alberto Ruiz",
    documento: "1.341.516.171",
    area: "Producción",
    fechaIngreso: "2021-11-30",
    fechaRetiro: "2024-06-15",
    salario: 1950000,
    estado: "Retirado",
  },
];

export default function Informe() {
  const today = toDateKey(new Date());
  const firstDay = toDateKey(new Date(new Date().getFullYear(), new Date().getMonth(), 1));

  const [fechaInicial, setFechaInicial] = useState(firstDay);
  const [fechaFinal, setFechaFinal] = useState(today);
  const [generado, setGenerado] = useState(false);
  const [page, setPage] = useState(1);

  const registros = useMemo(() => {
    if (!generado) return [];

    return empleados.map((empleado) => ({
      ...empleado,
      diasLaborados: calcularDiasLaborados(
        empleado.fechaIngreso,
        empleado.fechaRetiro,
        fechaInicial,
        fechaFinal
      ),
    }));
  }, [fechaInicial, fechaFinal, generado]);

  const totalNomina = registros.reduce(
    (total, empleado) => total + empleado.salario,
    0
  );

  const activos = registros.filter((empleado) => empleado.estado === "Activo").length;
  const retirados = registros.filter((empleado) => empleado.estado === "Retirado").length;

  const generarInforme = () => {
    setGenerado(true);
    setPage(1);
  };

  const exportarCSV = (tipo) => {
    if (registros.length === 0) return;

    const headers = [
      "Nombre",
      "Documento",
      "Area",
      "Fecha ingreso",
      "Fecha retiro",
      "Salario",
      "Dias laborados",
      "Estado",
    ];

    const rows = registros.map((empleado) => [
      empleado.nombre,
      empleado.documento,
      empleado.area,
      formatDate(empleado.fechaIngreso),
      empleado.fechaRetiro ? formatDate(empleado.fechaRetiro) : "-",
      empleado.salario,
      empleado.diasLaborados,
      empleado.estado,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], {
      type: tipo === "excel" ? "text/csv;charset=utf-8;" : "application/pdf",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download =
      tipo === "excel"
        ? "informe-liquidaciones.csv"
        : "informe-liquidaciones.pdf";

    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-full bg-[#f8fafc] px-8 py-8 text-slate-800">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-wide text-purple-600">
          Informe
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          Informe de Liquidaciones
        </h1>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Genera reportes por periodo con salarios, estados y días laborados.
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
          <DateInput
            label="Fecha Inicial"
            value={fechaInicial}
            onChange={(event) => setFechaInicial(event.target.value)}
          />

          <DateInput
            label="Fecha Final"
            value={fechaFinal}
            onChange={(event) => setFechaFinal(event.target.value)}
          />

          <button
            onClick={generarInforme}
            disabled={!fechaInicial || !fechaFinal || fechaInicial > fechaFinal}
            className="h-12 rounded-lg bg-purple-600 px-7 text-sm font-bold text-white shadow-md transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            Generar Informe
          </button>
        </div>
      </section>

      {generado && (
        <>
          <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-3">
            <MetricCard label="Empleados activos" value={activos} />
            <MetricCard label="Empleados retirados" value={retirados} />
            <MetricCard label="Total salarios" value={formatCurrency(totalNomina)} />
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <span className="text-sm font-bold text-slate-600">
              Exportar a:
            </span>

            <button
              onClick={() => exportarCSV("excel")}
              className="h-11 rounded-lg border border-emerald-200 bg-emerald-50 px-5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
            >
              Excel
            </button>

            <button
              onClick={() => exportarCSV("pdf")}
              className="h-11 rounded-lg border border-red-200 bg-red-50 px-5 text-sm font-bold text-red-600 transition hover:bg-red-100"
            >
              PDF
            </button>
          </div>

          <section className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-sm">
                <thead className="bg-slate-50 text-xs font-bold text-slate-500">
                  <tr>
                    <th className="px-5 py-4 text-left">Nombre</th>
                    <th className="px-5 py-4 text-left">Documento</th>
                    <th className="px-5 py-4 text-left">Área</th>
                    <th className="px-5 py-4 text-left">Fecha ingreso</th>
                    <th className="px-5 py-4 text-left">Fecha retiro</th>
                    <th className="px-5 py-4 text-left">Salario</th>
                    <th className="px-5 py-4 text-center">Días Laborados</th>
                    <th className="px-5 py-4 text-center">Estado</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {registros.map((empleado) => (
                    <tr key={empleado.documento} className="transition hover:bg-purple-50/30">
                      <td className="px-5 py-5 font-semibold text-slate-700">
                        {empleado.nombre}
                      </td>
                      <td className="px-5 py-5">{empleado.documento}</td>
                      <td className="px-5 py-5">{empleado.area}</td>
                      <td className="px-5 py-5">{formatDate(empleado.fechaIngreso)}</td>
                      <td className="px-5 py-5">
                        {empleado.fechaRetiro ? formatDate(empleado.fechaRetiro) : "-"}
                      </td>
                      <td className="px-5 py-5 font-semibold text-slate-700">
                        {formatCurrency(empleado.salario)}
                      </td>
                      <td className="px-5 py-5 text-center font-bold text-slate-700">
                        {empleado.diasLaborados}
                      </td>
                      <td className="px-5 py-5 text-center">
                        <StatusBadge status={empleado.estado} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-5 py-4 text-sm font-medium text-slate-500">
              <p>
                Mostrando 1 a {registros.length} de {registros.length} registros
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-purple-300 hover:text-purple-600"
                >
                  ‹
                </button>

                <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-purple-400 bg-purple-50 text-sm font-bold text-purple-600">
                  {page}
                </button>

                <button
                  onClick={() => setPage(page + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-purple-300 hover:text-purple-600"
                >
                  ›
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      {!generado && (
        <section className="mt-7 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-bold text-slate-700">
            Selecciona un rango de fechas y genera el informe.
          </p>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Los resultados aparecerán aquí con opciones de exportación.
          </p>
        </section>
      )}
    </div>
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

function MetricCard({ label, value }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-3 text-3xl font-bold text-purple-700">
        {value}
      </p>
    </section>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Activo: "bg-emerald-50 text-emerald-700",
    Retirado: "bg-red-50 text-red-600",
  };

  return (
    <span className={`rounded-md px-3 py-1 text-xs font-bold ${styles[status]}`}>
      {status}
    </span>
  );
}

function calcularDiasLaborados(fechaIngreso, fechaRetiro, inicioPeriodo, finPeriodo) {
  const inicio = maxDate(new Date(`${fechaIngreso}T00:00:00`), new Date(`${inicioPeriodo}T00:00:00`));
  const fin = minDate(
    fechaRetiro ? new Date(`${fechaRetiro}T00:00:00`) : new Date(`${finPeriodo}T00:00:00`),
    new Date(`${finPeriodo}T00:00:00`)
  );

  if (fin < inicio) return 0;

  const diff = fin - inicio;
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}

function maxDate(a, b) {
  return a > b ? a : b;
}

function minDate(a, b) {
  return a < b ? a : b;
}

function formatDate(date) {
  if (!date) return "-";

  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}
