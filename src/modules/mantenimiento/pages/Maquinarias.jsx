import { useMemo, useState } from "react";

const MAIN = "rgb(183,183,183)";

const nombresMaquinas = [
  "Generadora de Hielo #1",
  "Báscula Grande",
  "Aturdidor",
  "Motobomba General",
  "Peladora Centrifuga 1",
  "Peladora Centrifuga 2",
  "Escaldadora",
  "Escaldadora de Patas y Cabeza",
  "Peladora de Mollejas #1",
  "Linea de Colgado",
  "Linea de Eviscerado",
  "Descolgador de Pollos",
  "Rotuladora",
  "Ventiladores",
  "Extractores Plataforma",
  "Caldera",
  "Chiller de Patas y Cabeza",
  "Chiller de Visceras",
  "Chiller",
  "Prechiller",
  "Cuarto Frio #1 (Pequeño)",
  "Cuarto Frio #2 (Grande)",
  "Motobomba Caldera",
  "Tanque de Gas",
  "Compresor de Tornillo",
  "Bomba de Vacío #1",
  "Pistola Cloaca",
  "Pistola Pulmón",
  "Tijera Corta Cuello",
  "Evacuador",
  "Generadora Eléctrica",
  "Difusor Empaque",
  "Blower Prechiller",
  "Blower Chiller",
  "Blower H Y M",
  "Motobomba Arco de Desinfección",
  "Difusor de Despacho",
  "Lavadora de Canastillas",
  "Secador de Manos",
  "Hidroflow Eviscerado",
  "Blower Escaldadora",
  "Hidroflow Generadora",
  "Peladora de Mollejas Grande #2",
  "Banco de Condesadores #1",
  "Motobomba Lapicero",
  "Generadora de Hielo #2",
  "Carcher Lavado de Vehículos",
  "Banco de Condesadores #2",
  "Electrovalvulas tanques",
  "Aires Acondicionados Oficinas",
  "Motobomba Sumergible",
  "Lavadora de Huacales",
  "Tunel Tolerancia Cero",
  "Extractor Eviscerado",
  "Bomba de Vacio #2",
  "Hidrolavadora de Generadoras",
  "Wincher Subproductos",
  "Compresor de Pistón",
  "Transformador",
  "Chiller enfriamiento de agua",
  "Lavadora",
  "Secadora",
];

const initialMachines = nombresMaquinas.map((nombre, index) => ({
  id: index + 1,
  nombre,
  descripcion: "Maquinaria registrada para control de mantenimiento.",
  preventivos: [],
  correctivos: [],
}));

export default function Maquinarias() {
  const [machines, setMachines] = useState(initialMachines);
  const [filters, setFilters] = useState({
    mostrar: "Con preventivos este mes",
    search: "",
    mes: String(new Date().getMonth() + 1).padStart(2, "0"),
    anio: String(new Date().getFullYear()),
  });
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);

  const monthKey = `${filters.anio}-${filters.mes}`;

  const maquinasFiltradas = useMemo(() => {
    return machines.filter((machine) => {
      const matchSearch = `${machine.id} ${machine.nombre} ${machine.descripcion}`
        .toLowerCase()
        .includes(filters.search.toLowerCase());

      const hasPreventivoEsteMes = machine.preventivos.some((p) =>
        p.mesAnio === toMonthKey(new Date())
      );

      const hasPreventivoMes = machine.preventivos.some((p) => p.mesAnio === monthKey);

      const matchMostrar =
        filters.mostrar === "Todas las maquinarias" ||
        (filters.mostrar === "Con preventivos este mes" && hasPreventivoEsteMes) ||
        (filters.mostrar === "Con preventivos en mes específico" && hasPreventivoMes);

      return matchSearch && matchMostrar;
    });
  }, [machines, filters, monthKey]);

  const createMachine = (data) => {
    setMachines((current) => [
      {
        id: current.length ? Math.max(...current.map((m) => m.id)) + 1 : 1,
        nombre: data.nombre,
        descripcion: data.descripcion,
        preventivos: [],
        correctivos: [],
      },
      ...current,
    ]);
    setModal(null);
  };

  const updateMachine = (id, data) => {
    setMachines((current) =>
      current.map((machine) =>
        machine.id === id ? { ...machine, ...data } : machine
      )
    );

    setSelected((current) =>
      current?.id === id ? { ...current, ...data } : current
    );

    setModal(null);
  };

  const deleteMachine = (id) => {
    const ok = window.confirm("¿Deseas eliminar esta maquinaria?");
    if (!ok) return;

    setMachines((current) => current.filter((machine) => machine.id !== id));
  };

  const addPreventive = (machineId, data) => {
    const preventive = {
      id: Date.now(),
      mesAnio: `${data.anio}-${data.mes}`,
      estado: "Pendiente",
      fechaVencimiento: `${data.anio}-${data.mes}-28`,
      notas: data.notas,
    };

    setMachines((current) =>
      current.map((machine) =>
        machine.id === machineId
          ? { ...machine, preventivos: [preventive, ...machine.preventivos] }
          : machine
      )
    );

    setSelected((current) =>
      current?.id === machineId
        ? { ...current, preventivos: [preventive, ...current.preventivos] }
        : current
    );

    setModal(null);
  };

  if (selected) {
    return (
      <MachineDetail
        machine={selected}
        onBack={() => setSelected(null)}
        onSchedule={() => setModal({ type: "preventive", machine: selected })}
      >
        {modal?.type === "preventive" && (
          <PreventiveModal
            onClose={() => setModal(null)}
            onSave={(data) => addPreventive(selected.id, data)}
          />
        )}
      </MachineDetail>
    );
  }

  return (
    <div className="min-h-full bg-[#f8fafc] p-4 text-slate-800 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Maquinarias
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Administra maquinarias, preventivos y registros de mantenimiento.
            </p>
          </div>

          <button
            onClick={() => setModal({ type: "create" })}
            className="rounded-lg px-5 py-3 text-sm font-bold text-white shadow-md transition hover:opacity-90"
            style={{ backgroundColor: MAIN }}
          >
            + Crear Nueva Maquinaria
          </button>
        </div>

        <section className="mb-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr_auto_auto]">
            <label>
              <span className="mb-2 block text-sm font-bold text-slate-600">
                Mostrar
              </span>
              <select
                value={filters.mostrar}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    mostrar: event.target.value,
                  }))
                }
                className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none focus:border-[rgb(183,183,183)] focus:ring-4 focus:ring-slate-100"
              >
                <option>Con preventivos este mes</option>
                <option>Con preventivos en mes específico</option>
                <option>Todas las maquinarias</option>
              </select>
            </label>

            <label>
              <span className="mb-2 block text-sm font-bold text-slate-600">
                Buscar
              </span>
              <input
                value={filters.search}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    search: event.target.value,
                  }))
                }
                placeholder="Nombre o código..."
                className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none focus:border-[rgb(183,183,183)] focus:ring-4 focus:ring-slate-100"
              />
            </label>

            {filters.mostrar === "Con preventivos en mes específico" && (
              <div className="grid grid-cols-2 gap-3">
                <label>
                  <span className="mb-2 block text-sm font-bold text-slate-600">
                    Mes
                  </span>
                  <select
                    value={filters.mes}
                    onChange={(event) =>
                      setFilters((current) => ({ ...current, mes: event.target.value }))
                    }
                    className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none"
                  >
                    {Array.from({ length: 12 }, (_, index) => {
                      const value = String(index + 1).padStart(2, "0");
                      return (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      );
                    })}
                  </select>
                </label>

                <label>
                  <span className="mb-2 block text-sm font-bold text-slate-600">
                    Año
                  </span>
                  <input
                    value={filters.anio}
                    onChange={(event) =>
                      setFilters((current) => ({ ...current, anio: event.target.value }))
                    }
                    className="h-11 w-24 rounded-lg border border-slate-200 px-3 text-sm outline-none"
                  />
                </label>
              </div>
            )}

            <div className="flex items-end gap-3">
              <button
                className="h-11 rounded-lg px-5 text-sm font-bold text-white shadow-sm"
                style={{ backgroundColor: MAIN }}
              >
                Filtrar
              </button>

              <button
                onClick={() =>
                  setFilters({
                    mostrar: "Con preventivos este mes",
                    search: "",
                    mes: String(new Date().getMonth() + 1).padStart(2, "0"),
                    anio: String(new Date().getFullYear()),
                  })
                }
                className="h-11 rounded-lg bg-slate-500 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-600"
              >
                Limpiar
              </button>
            </div>
          </div>
        </section>

        <div className="mb-4 rounded-lg border-l-4 bg-white px-5 py-4 text-sm font-bold text-slate-600 shadow-sm" style={{ borderColor: MAIN }}>
          {maquinasFiltradas.length} maquinaria(s) encontrada(s)
        </div>

        {maquinasFiltradas.length === 0 ? (
          <section className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              No hay maquinarias para el filtro seleccionado.
            </p>
          </section>
        ) : (
          <>
            <section className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:block">
              <table className="w-full text-sm">
                <thead style={{ backgroundColor: MAIN }} className="text-white">
                  <tr>
                    <th className="px-5 py-4 text-left">Código</th>
                    <th className="px-5 py-4 text-left">Maquinaria</th>
                    <th className="px-5 py-4 text-left">Descripción</th>
                    <th className="px-5 py-4 text-center">Acción</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {maquinasFiltradas.map((machine) => (
                    <tr key={machine.id} className="transition hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <span className="rounded-lg px-3 py-1 text-xs font-bold text-white" style={{ backgroundColor: MAIN }}>
                          {machine.id}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-800">
                        {machine.nombre}
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {machine.descripcion}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-2">
                          <ActionButton label="Editar" onClick={() => setModal({ type: "edit", machine })}>
                            ✎
                          </ActionButton>
                          <ActionButton label="Eliminar" onClick={() => deleteMachine(machine.id)}>
                            🗑
                          </ActionButton>
                          <ActionButton label="Ver" onClick={() => setSelected(machine)}>
                            👁
                          </ActionButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="space-y-4 lg:hidden">
              {maquinasFiltradas.map((machine) => (
                <article key={machine.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="rounded-lg px-3 py-1 text-xs font-bold text-white" style={{ backgroundColor: MAIN }}>
                      {machine.id}
                    </span>
                    <div>
                      <h2 className="font-bold text-slate-900">{machine.nombre}</h2>
                      <p className="mt-1 text-sm text-slate-500">{machine.descripcion}</p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <button onClick={() => setModal({ type: "edit", machine })} className="rounded-lg py-2.5 text-sm font-bold text-white" style={{ backgroundColor: MAIN }}>
                      Editar
                    </button>
                    <button onClick={() => deleteMachine(machine.id)} className="rounded-lg bg-red-100 py-2.5 text-sm font-bold text-red-600">
                      Eliminar
                    </button>
                    <button onClick={() => setSelected(machine)} className="rounded-lg bg-slate-600 py-2.5 text-sm font-bold text-white">
                      Ver
                    </button>
                  </div>
                </article>
              ))}
            </section>
          </>
        )}
      </div>

      {modal?.type === "create" && (
        <MachineModal
          title="Agregar Maquinaria"
          onClose={() => setModal(null)}
          onSave={createMachine}
        />
      )}

      {modal?.type === "edit" && (
        <MachineModal
          title="Editar Maquinaria"
          initial={modal.machine}
          onClose={() => setModal(null)}
          onSave={(data) => updateMachine(modal.machine.id, data)}
        />
      )}
    </div>
  );
}

function MachineDetail({ machine, onBack, onSchedule, children }) {
  const [correctiveDetail, setCorrectiveDetail] = useState(null);
  const [preventiveDetail, setPreventiveDetail] = useState(null);

  if (correctiveDetail) {
    return (
      <CorrectiveDetail
        machine={machine}
        record={correctiveDetail}
        onBack={() => setCorrectiveDetail(null)}
      />
    );
  }

  return (
    <div className="min-h-full bg-[#f8fafc] p-4 text-slate-800 md:p-8">
      <button
        onClick={onBack}
        className="mb-6 rounded-lg px-4 py-2 text-sm font-bold text-white"
        style={{ backgroundColor: MAIN }}
      >
        ← Volver
      </button>

      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <span className="rounded-lg px-3 py-1 text-xs font-bold text-white" style={{ backgroundColor: MAIN }}>
            {machine.id}
          </span>
          <h1 className="mt-4 text-3xl font-bold text-slate-900">
            {machine.nombre}
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            {machine.descripcion}
          </p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Mantenimientos Preventivos
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Programaciones preventivas de la maquinaria.
              </p>
            </div>
            <button
              onClick={onSchedule}
              className="rounded-lg px-5 py-3 text-sm font-bold text-white shadow-sm"
              style={{ backgroundColor: MAIN }}
            >
              + Programar Mantenimiento
            </button>
          </div>

          <DataTable
            headers={["Mes/Año", "Estado", "Fecha vencimiento", "Notas", "Acción"]}
            empty="No hay mantenimientos preventivos programados."
            rows={machine.preventivos.map((p) => [
              p.mesAnio,
              <StatusBadge key="status" label={p.estado} tone="amber" />,
              p.fechaVencimiento,
              p.notas || "—",
              <button
                key="view"
                onClick={() => setPreventiveDetail(p)}
                className="rounded-lg bg-slate-500 px-4 py-2 text-xs font-bold text-white"
              >
                Ver
              </button>,
            ])}
          />

          {preventiveDetail && (
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="font-bold text-slate-900">Detalle del preventivo</h3>
              <p className="mt-2 text-sm text-slate-600">
                <strong>Mes/Año:</strong> {preventiveDetail.mesAnio}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                <strong>Notas:</strong> {preventiveDetail.notas || "Sin notas"}
              </p>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            Mantenimientos Correctivos
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Historial de intervenciones correctivas registradas.
          </p>

          <DataTable
            headers={["Fecha", "Estado", "Técnico", "Acción"]}
            empty="No hay mantenimientos correctivos registrados."
            rows={machine.correctivos.map((c) => [
              c.fecha,
              <StatusBadge key="status" label={c.estado} tone="emerald" />,
              c.tecnico,
              <button
                key="view"
                onClick={() => setCorrectiveDetail(c)}
                className="rounded-lg bg-slate-500 px-4 py-2 text-xs font-bold text-white"
              >
                Ver
              </button>,
            ])}
          />
        </section>
      </div>

      {children}
    </div>
  );
}

function MachineModal({ title, initial, onClose, onSave }) {
  const [form, setForm] = useState({
    nombre: initial?.nombre || "",
    descripcion: initial?.descripcion || "",
  });

  const save = () => {
    if (!form.nombre.trim()) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>

        <label className="mt-6 block">
          <span className="mb-2 block text-sm font-bold text-slate-600">
            Nombre de la maquinaria
          </span>
          <input
            value={form.nombre}
            onChange={(e) => setForm((current) => ({ ...current, nombre: e.target.value }))}
            placeholder="Ej: Generadora de hielo"
            className="h-12 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none focus:border-[rgb(183,183,183)] focus:ring-4 focus:ring-slate-100"
          />
        </label>

        <label className="mt-5 block">
          <span className="mb-2 block text-sm font-bold text-slate-600">
            Descripción
          </span>
          <textarea
            value={form.descripcion}
            onChange={(e) => setForm((current) => ({ ...current, descripcion: e.target.value }))}
            placeholder="Agrega una descripción..."
            className="min-h-28 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[rgb(183,183,183)] focus:ring-4 focus:ring-slate-100"
          />
        </label>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            onClick={save}
            className="rounded-lg px-5 py-3 text-sm font-bold text-white shadow-md"
            style={{ backgroundColor: MAIN }}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

function PreventiveModal({ onClose, onSave }) {
  const today = new Date();

  const [form, setForm] = useState({
    mes: String(today.getMonth() + 1).padStart(2, "0"),
    anio: String(today.getFullYear()),
    notas: "",
  });

  const save = () => {
    if (!form.mes || !form.anio) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-slate-900">
          Programar Mantenimiento
        </h2>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <label>
            <span className="mb-2 block text-sm font-bold text-slate-600">Mes</span>
            <select
              value={form.mes}
              onChange={(e) => setForm((current) => ({ ...current, mes: e.target.value }))}
              className="h-12 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none"
            >
              {Array.from({ length: 12 }, (_, index) => {
                const value = String(index + 1).padStart(2, "0");
                return <option key={value} value={value}>{value}</option>;
              })}
            </select>
          </label>

          <label>
            <span className="mb-2 block text-sm font-bold text-slate-600">Año</span>
            <input
              value={form.anio}
              onChange={(e) => setForm((current) => ({ ...current, anio: e.target.value }))}
              className="h-12 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none"
            />
          </label>
        </div>

        <label className="mt-5 block">
          <span className="mb-2 block text-sm font-bold text-slate-600">Notas</span>
          <textarea
            value={form.notas}
            onChange={(e) => setForm((current) => ({ ...current, notas: e.target.value }))}
            placeholder="Descripción del preventivo..."
            className="min-h-28 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none"
          />
        </label>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button onClick={onClose} className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600">
            Cancelar
          </button>
          <button onClick={save} className="rounded-lg px-5 py-3 text-sm font-bold text-white" style={{ backgroundColor: MAIN }}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

function CorrectiveDetail({ machine, record, onBack }) {
  return (
    <div className="min-h-full bg-[#f8fafc] p-4 text-slate-800 md:p-8">
      <button onClick={onBack} className="mb-6 rounded-lg px-4 py-2 text-sm font-bold text-white" style={{ backgroundColor: MAIN }}>
        ← Volver
      </button>

      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Mantenimiento Correctivo</h1>
          <p className="mt-2 text-sm text-slate-500">#{machine.id} · {machine.nombre}</p>
        </section>

        <InfoCard title="Información General">
          <Info label="Tipo de mantenimiento" value="Correctivo" />
          <Info label="Técnico que realizó" value={record.tecnico} />
          <Info label="Fecha de realización" value={record.fecha} />
        </InfoCard>

        <TextBlock title="Descripción de la Intervención" value={record.descripcion || "Sin descripción"} />
        <TextBlock title="Observaciones" value={record.observaciones || "Sin observaciones"} />
        <TextBlock title="Repuestos Utilizados" value={record.repuestos || "Sin repuestos registrados"} />
      </div>
    </div>
  );
}

function DataTable({ headers, rows, empty }) {
  if (!rows.length) {
    return (
      <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm font-medium text-slate-500">
        {empty}
      </div>
    );
  }

  return (
    <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
      <table className="w-full min-w-[720px] text-sm">
        <thead style={{ backgroundColor: MAIN }} className="text-white">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-5 py-4 text-left">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, index) => (
            <tr key={index} className="hover:bg-slate-50">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-5 py-4">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ActionButton({ children, label, onClick }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-white transition hover:opacity-90"
      style={{ backgroundColor: MAIN }}
    >
      {children}
    </button>
  );
}

function StatusBadge({ label, tone }) {
  const styles = {
    amber: "bg-amber-100 text-amber-700",
    emerald: "bg-emerald-100 text-emerald-700",
  };

  return (
    <span className={`rounded-lg px-3 py-1 text-xs font-bold ${styles[tone]}`}>
      {label}
    </span>
  );
}

function InfoCard({ title, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="border-b border-slate-200 pb-3 text-xl font-bold text-slate-900">{title}</h2>
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">{children}</div>
    </section>
  );
}

function TextBlock({ title, value }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="border-b border-slate-200 pb-3 text-xl font-bold text-slate-900">{title}</h2>
      <div className="mt-5 border-l-4 bg-slate-50 p-4 text-sm text-slate-600" style={{ borderColor: MAIN }}>
        {value}
      </div>
    </section>
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

function toMonthKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}
