import { useMemo, useState } from "react";
import controlPccCanalesImage from "../../../assets/calidad/control-pcc-canales.png";
import {
  formatDateTime,
  formatTemplates,
  getDateKey,
  getWeeklyPoesAreaResponsibles,
  getWeeklyPoesItems,
  getWeeklyPoesPeriodLabel,
  loadFormatRecords,
} from "../data/calidadStore";

export default function HistorialFormatos() {
  const [records] = useState(() => loadFormatRecords());
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [formatFilter, setFormatFilter] = useState("todos");
  const [selectedGroup, setSelectedGroup] = useState(null);

  const formatGroups = useMemo(() => groupRecords(records), [records]);

  const filteredFormats = useMemo(() => {
    const term = search.trim().toLowerCase();

    return formatGroups
      .filter((group) => {
        const matchDate =
          !dateFilter ||
          (group.kind.startsWith("monthly") ||
          group.kind === "cold-rooms-monthly" ||
          group.kind === "weekly-poes"
            ? group.filterDate.slice(0, 7) === dateFilter.slice(0, 7)
            : group.filterDate === dateFilter);
        const matchFormat =
          formatFilter === "todos" || group.formatoId === formatFilter;
        const content = getGroupSearchText(group).toLowerCase();

        return matchDate && matchFormat && content.includes(term);
      })
      .sort((a, b) => new Date(b.lastRecordAt) - new Date(a.lastRecordAt));
  }, [dateFilter, formatFilter, formatGroups, search]);

  return (
    <div className="min-h-full bg-[#f8fafc] p-6 text-slate-800">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Historial</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Consulta cada formato completo agrupado por dia o por mes, segun corresponda.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Formatos visibles
          </p>
          <p className="mt-1 text-2xl font-bold text-[rgb(0,48,73)]">
            {filteredFormats.length}
          </p>
        </div>
      </div>

      <section className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px]">
          <div>
            <label className="label">Buscar</label>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="input-pro"
              placeholder="Verificador, muestra, lote, formato o codigo..."
            />
          </div>

          <div>
            <label className="label">Fecha</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              className="input-pro"
            />
          </div>

          <div>
            <label className="label">Formato</label>
            <select
              value={formatFilter}
              onChange={(event) => setFormatFilter(event.target.value)}
              className="input-pro"
            >
              <option value="todos">Todos</option>
              {formatTemplates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1060px] text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4 text-left">Periodo</th>
                <th className="px-5 py-4 text-left">Formato</th>
                <th className="px-5 py-4 text-left">Codigo</th>
                <th className="px-5 py-4 text-left">Registros</th>
                <th className="px-5 py-4 text-left">Verificado por</th>
                <th className="px-5 py-4 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredFormats.map((group) => (
                <tr key={group.id} className="transition hover:bg-slate-50">
                  <td className="px-5 py-4 font-semibold text-slate-700">
                    {group.periodLabel}
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-800">
                    {group.nombre}
                  </td>
                  <td className="px-5 py-4 text-slate-500">{group.codigo}</td>
                  <td className="px-5 py-4 text-slate-600">
                    {getGroupCountLabel(group)}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {group.verifiers.join(", ") || "Sin verificador"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedGroup(group)}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-white"
                      >
                        Ver detalle
                      </button>
                      <button
                        type="button"
                        onClick={() => downloadFormat(group)}
                        className="rounded-lg bg-[rgb(0,48,73)] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#08243a]"
                      >
                        Descargar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredFormats.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center">
                    <p className="font-bold text-slate-700">
                      No hay formatos para mostrar
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Cambia la busqueda o guarda registros primero.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedGroup && (
        <FormatDetailModal
          group={selectedGroup}
          onClose={() => setSelectedGroup(null)}
          onDownload={() => downloadFormat(selectedGroup)}
        />
      )}
    </div>
  );
}

function FormatDetailModal({ group, onClose, onDownload }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4">
      <section className="max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[rgb(0,48,73)]">
              {group.codigo}
            </p>
            <h2 className="mt-1 text-2xl font-black text-slate-900">
              {group.nombre}
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              {group.periodLabel} con {getGroupCountLabel(group)}.
            </p>
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={onDownload} className="btn-primary">
              Descargar
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cerrar
            </button>
          </div>
        </div>

        <div className="max-h-[calc(92vh-120px)] overflow-auto p-6">
          <div className="mb-5 grid gap-3 md:grid-cols-4">
            <Detail label="Periodo" value={group.periodLabel} />
            <Detail label="Version" value={group.template.version || "1"} />
            <Detail label="Registros" value={getGroupCountLabel(group)} />
            <Detail label="Ultimo guardado" value={formatDateTime(group.lastRecordAt)} />
          </div>

          {group.kind === "monthly-checklist" ? (
            <MonthlyChecklistDetail group={group} />
          ) : group.kind === "weekly-poes" ? (
            <WeeklyPoesDetail group={group} />
          ) : group.kind === "daily-trip" ? (
            <DailyTripDetail group={group} />
          ) : group.kind === "hydration-test" ? (
            <HydrationDetail group={group} />
          ) : group.kind === "temperature-pcc" ? (
            <TemperaturePccDetail group={group} />
          ) : group.kind === "cold-rooms-monthly" ? (
            <ColdRoomsMonthlyDetail group={group} />
          ) : group.kind === "dispatch-product" ? (
            <DispatchProductDetail group={group} />
          ) : group.kind === "chlorine-chiller" ? (
            <ChlorineChillerDetail group={group} />
          ) : group.kind === "viscera-temperature" ? (
            <VisceraTemperatureDetail group={group} />
          ) : (
            <SamplesDetailTable group={group} />
          )}

          {group.template.nota && (
            <p className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium leading-6 text-slate-600">
              {group.template.nota}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function WeeklyPoesDetail({ group }) {
  const values = group.weeklyRecord?.values || {};
  const actions = values[group.template.actionTable.valueKey] || [];
  const responsibles = getWeeklyPoesAreaResponsibles(values, group.template);

  return (
    <div className="grid min-w-0 grid-cols-1 gap-5">
      <div className="grid gap-3 md:grid-cols-2">
        <Detail label="Semana completa" value={getWeeklyPoesPeriodLabel(values, group.periodKey)} />
        <Detail label="Registro" value="Formato semanal consolidado" />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200">
        <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
          <h3 className="font-black text-slate-900">Responsables por area</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-3 text-left">Area</th>
                <th className="px-3 py-3 text-left">Realizado por</th>
                <th className="px-3 py-3 text-left">Verificado por</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {responsibles.map((area) => (
                <tr key={area.areaId}>
                  <td className="px-3 py-3 font-bold text-slate-800">{area.areaLabel}</td>
                  <td className="px-3 py-3 text-slate-700">
                    {area.realizadoPor || "Sin responsable"}
                  </td>
                  <td className="px-3 py-3 text-slate-700">
                    {area.verificadoPor || "Sin verificador"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200">
        <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
          <h3 className="font-black text-slate-900">Hora inicio proceso</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                {group.template.days.map((day) => (
                  <th key={day.id} className="px-3 py-3 text-left">{day.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {group.template.days.map((day) => (
                  <td key={day.id} className="px-3 py-3 font-semibold text-slate-700">
                    {values.horasInicio?.[day.id] || ""}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {group.template.weeklyAreas.map((area) => (
        <div key={area.id} className="grid gap-4 rounded-xl border border-slate-200 p-4">
          <h3 className="text-lg font-black text-slate-900">{area.label}</h3>
          {area.blocks.map((block) => (
            <div key={block.id} className="grid gap-3">
              <h4 className="text-sm font-black uppercase tracking-wide text-slate-500">
                {block.label}
              </h4>
              {block.items.map((item) => (
                <WeeklyPoesItemDetail
                  key={item.id}
                  item={item}
                  days={group.template.days}
                  value={values.items?.[item.id] || {}}
                />
              ))}
            </div>
          ))}
        </div>
      ))}

      <DetailTable
        title="Acciones correctivas"
        columns={group.template.actionTable.columns}
        rows={actions}
        emptyText="Sin acciones correctivas registradas."
      />
    </div>
  );
}

function WeeklyPoesItemDetail({ item, days, value }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
        <h5 className="font-black text-slate-900">{item.label}</h5>
        <p className="mt-1 text-sm font-medium text-slate-500">
          Principio activo: {value.principioActivo || ""} - Concent.: {value.concentracion || ""} - Aplicacion: {value.aplicacion || ""}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="text-xs uppercase tracking-wide text-slate-500">
            <tr>
              {days.map((day) => (
                <th key={day.id} className="border-r border-slate-200 px-3 py-3 text-left">
                  {day.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="align-top">
              {days.map((day) => {
                const controls = value.controles?.[day.id] || [];

                return (
                  <td key={day.id} className="border-r border-slate-100 px-3 py-3 text-slate-700">
                    {controls.length > 0
                      ? controls.map((control, index) => (
                          <p key={index} className="mb-1 font-semibold">
                            {control.hora || "--"} / {control.estado || "--"}
                          </p>
                        ))
                      : "Sin controles"}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DailyTripDetail({ group }) {
  const values = group.tripRecord?.values || {};
  const trips = values[group.template.tripTable.valueKey] || [];
  const actions = values[group.template.actionTable.valueKey] || [];

  return (
    <div className="grid gap-5">
      <DetailTable
        title="Viajes del dia"
        columns={group.template.tripTable.columns}
        rows={trips}
        emptyText="Sin viajes registrados."
      />

      <div className="grid gap-3 md:grid-cols-2">
        <Detail label="Fecha" value={values.fecha || group.filterDate} />
        <Detail label="Verificado por" value={values.verificadoPor || "Sin verificador"} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          Observaciones
        </p>
        <p className="mt-2 whitespace-pre-wrap text-sm font-medium leading-6 text-slate-700">
          {values.observaciones || "Sin observaciones."}
        </p>
      </div>

      <DetailTable
        title="Acciones correctivas"
        columns={group.template.actionTable.columns}
        rows={actions}
        emptyText="Sin acciones correctivas registradas."
      />

      <GuideDetailTable guide={group.template.guide} />
    </div>
  );
}

function HydrationDetail({ group }) {
  const values = group.hydrationRecord?.values || {};

  return (
    <div className="grid gap-5">
      <div className="grid gap-3 md:grid-cols-4">
        <Detail label="Fecha" value={values.fecha || group.filterDate} />
        <Detail label="Granja" value={values.granja || ""} />
        <Detail label="Viaje" value={values.viaje || ""} />
        <Detail label="Verifico" value={values.verifico || ""} />
      </div>

      <DetailTable
        title="Muestras"
        columns={group.template.sampleColumns}
        rows={values.muestras || []}
        emptyText="Sin muestras registradas."
      />

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Detail label="Hora inicial" value={values.horaInicial || ""} />
        <Detail label="Hora final" value={values.horaFinal || ""} />
        <Detail label="Temperatura pre-chiller" value={values.temperaturaPreChiller || ""} />
        <Detail label="Temperatura chiller" value={values.temperaturaChiller || ""} />
        <Detail label="Temperatura ingreso canales" value={values.temperaturaIngresoCanales || ""} />
        <Detail label="Temperatura salida canales" value={values.temperaturaSalidaCanales || ""} />
        <Detail label="% Hidratacion" value={values.porcentajeHidratacion || ""} />
        <Detail label="Responsable" value={values.responsable || ""} />
      </div>

      <Detail label="Observaciones" value={values.observaciones || "Sin observaciones"} />
    </div>
  );
}

function TemperaturePccDetail({ group }) {
  const values = group.temperatureRecord?.values || {};
  const measurements = values[group.template.monitorTable.valueKey] || [];
  const actions = values[group.template.actionTable.valueKey] || [];

  return (
    <div className="grid gap-5">
      <div className="grid gap-3 md:grid-cols-4">
        <Detail label="Fecha" value={values.fecha || group.filterDate} />
        <Detail label="Lote de proceso" value={values.loteProceso || ""} />
        <Detail label="Hora de inicio" value={values.horaInicio || ""} />
        <Detail label="Verifica" value={values.verifica || ""} />
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-5">
        <div className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
            <h3 className="font-black text-slate-900">Grafica de control PCC</h3>
          </div>
          <div className="p-4">
            <img
              src={controlPccCanalesImage}
              alt="Grafica de control PCC canales"
              className="mx-auto max-h-44 w-full max-w-[260px] rounded-lg border border-slate-200 object-contain"
            />
          </div>
        </div>

        <div
          className="grid min-w-0 gap-3"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 170px), 1fr))" }}
        >
          {(group.template.controlLimits || []).map((item) => (
            <Detail key={item.label} label={item.label} value={item.value} />
          ))}
          <Detail label="Convenciones" value="C cumple, NC no cumple" />
        </div>
      </div>

      <TemperatureMeasurementsDetail
        columns={group.template.monitorTable.columns}
        rows={measurements}
      />

      <DetailTable
        title="Acciones correctivas"
        columns={group.template.actionTable.columns}
        rows={actions}
        emptyText="Sin acciones correctivas registradas."
      />

      <GuideDetailTable guide={group.template.guide} />
    </div>
  );
}

function TemperatureMeasurementsDetail({ columns, rows }) {
  const channelColumns = columns.filter((column) => column.id.startsWith("canalC"));
  const metaColumns = columns.filter(
    (column) => !column.id.startsWith("canalC") && column.id !== "hora"
  );

  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
        <h3 className="font-black text-slate-900">Mediciones de temperatura</h3>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 p-4">
        {rows.map((row, rowIndex) => (
          <article key={rowIndex} className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <h4 className="font-black text-slate-900">Medicion {rowIndex + 1}</h4>
              <p className="text-sm font-bold text-slate-500">Hora: {row.hora || ""}</p>
            </div>

            <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-3">
              <p className="mb-3 text-xs font-black uppercase tracking-wide text-slate-400">
                Temperatura canales
              </p>
              <div
                className="grid min-w-0 gap-2"
                style={{ gridTemplateColumns: "repeat(auto-fit, minmax(72px, 1fr))" }}
              >
                {channelColumns.map((column) => (
                  <div key={column.id} className="rounded-lg bg-slate-50 px-2 py-2">
                    <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                      {column.label}
                    </p>
                    <p className="mt-1 text-sm font-black text-slate-800">
                      {row[column.id] || ""}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="mt-3 grid min-w-0 gap-2"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))" }}
            >
              {metaColumns.map((column) => (
                <div
                  key={column.id}
                  className={`rounded-lg bg-white px-3 py-2 ${column.type === "textarea" ? "col-span-full" : ""}`}
                >
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                    {column.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {row[column.id] || ""}
                  </p>
                </div>
              ))}
            </div>
          </article>
        ))}

        {rows.length === 0 && (
          <p className="rounded-lg bg-slate-50 px-4 py-8 text-center text-sm font-medium text-slate-500">
            Sin mediciones registradas.
          </p>
        )}
      </div>
    </div>
  );
}

function DetailTable({ title, columns, rows, emptyText }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
        <h3 className="font-black text-slate-900">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1120px] border-collapse text-sm">
          <thead className="bg-white text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="w-12 border-r border-slate-200 px-3 py-3 text-left">#</th>
              {columns.map((column) => (
                <th key={column.id} className="border-r border-slate-200 px-3 py-3 text-left">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, index) => (
              <tr key={index} className="bg-white">
                <td className="border-r border-slate-100 px-3 py-3 font-black text-slate-400">
                  {index + 1}
                </td>
                {columns.map((column) => (
                  <td key={column.id} className="border-r border-slate-100 px-3 py-3 text-slate-600">
                    {row[column.id] || ""}
                  </td>
                ))}
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-5 py-8 text-center text-sm font-medium text-slate-500">
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GuideDetailTable({ guide }) {
  const hasActionCode = guide.some((item) => item.codigoAccionCorrectiva);
  const columns = [
    { id: "noConformidad", label: "No conformidad" },
    { id: "codigoNoConformidad", label: "Codigo no conformidad" },
    { id: "accionCorrectiva", label: "Accion correctiva a aplicar" },
    ...(hasActionCode
      ? [{ id: "codigoAccionCorrectiva", label: "Codigo accion correctiva" }]
      : []),
  ];

  return (
    <DetailTable
      title="Tabla guia de no conformidades y acciones correctivas"
      columns={columns}
      rows={guide}
      emptyText="Sin guia configurada."
    />
  );
}

function ColdRoomsMonthlyDetail({ group }) {
  const values = group.coldRoomsRecord?.values || {};
  const controls = values[group.template.monitorTable.valueKey] || [];
  const actions = values[group.template.actionTable.valueKey] || [];
  const daysWithControls = new Set(controls.map((row) => row.fecha).filter(Boolean)).size;

  return (
    <div className="grid min-w-0 grid-cols-1 gap-5">
      <div className="grid gap-3 md:grid-cols-3">
        <Detail label="Periodo" value={values.monthKey || group.periodKey} />
        <Detail label="Controles" value={controls.length} />
        <Detail label="Dias con control" value={daysWithControls} />
      </div>

      <DetailTable
        title="Controles de temperatura"
        columns={group.template.monitorTable.columns}
        rows={controls}
        emptyText="Sin controles registrados."
      />

      <DetailTable
        title="Acciones correctivas"
        columns={group.template.actionTable.columns}
        rows={actions}
        emptyText="Sin acciones correctivas registradas."
      />

      <GuideDetailTable guide={group.template.guide} />
    </div>
  );
}

function DispatchProductDetail({ group }) {
  const values = group.dispatchRecord?.values || {};
  const dispatches = values[group.template.dispatchTable.valueKey] || [];
  const actions = values[group.template.actionTable.valueKey] || [];

  return (
    <div className="grid min-w-0 grid-cols-1 gap-5">
      <div className="grid gap-3 md:grid-cols-4">
        <Detail label="Fecha" value={values.fecha || group.filterDate} />
        <Detail label="Despachos" value={dispatches.length} />
        <Detail label="Observaciones" value={values.observaciones || "Sin observaciones"} />
        <Detail label="Verificado por" value={values.verificadoPor || "Sin verificador"} />
      </div>

      <DetailTable
        title="Despachos del dia"
        columns={group.template.dispatchTable.columns}
        rows={dispatches}
        emptyText="Sin despachos registrados."
      />

      <DetailTable
        title="Acciones correctivas"
        columns={group.template.actionTable.columns}
        rows={actions}
        emptyText="Sin acciones correctivas registradas."
      />

      <GuideDetailTable guide={group.template.guide} />
    </div>
  );
}

function ChlorineChillerDetail({ group }) {
  const values = group.chlorineRecord?.values || {};
  const controls = values[group.template.chlorineTable.valueKey] || [];

  return (
    <div className="grid min-w-0 grid-cols-1 gap-5">
      <div className="grid gap-3 md:grid-cols-3">
        <Detail label="Lote proceso" value={values.loteProceso || group.filterDate} />
        <Detail label="Controles" value={controls.length} />
        <Detail label="Verifica" value={values.verifica || "Sin verificador"} />
      </div>

      <DetailTable
        title="Controles de cloro residual"
        columns={group.template.chlorineTable.columns}
        rows={controls}
        emptyText="Sin controles registrados."
      />

      <GuideDetailTable guide={group.template.guide} />
    </div>
  );
}

function VisceraTemperatureDetail({ group }) {
  const values = group.visceraRecord?.values || {};
  const actions = values[group.template.actionTable.valueKey] || [];
  const totalSamples = (values.visceras || []).length + (values.patasCabezas || []).length;

  return (
    <div className="grid min-w-0 grid-cols-1 gap-5">
      <div className="grid gap-3 md:grid-cols-4">
        <Detail label="Lote proceso" value={values.loteProceso || group.filterDate} />
        <Detail label="Muestreos" value={totalSamples} />
        <Detail label="Verificado por" value={values.verificadoPor || "Sin verificador"} />
        <Detail label="Observaciones" value={values.observaciones || "Sin observaciones"} />
      </div>

      {group.template.sections.map((section) => (
        <DetailTable
          key={section.id}
          title={section.label}
          columns={group.template.temperatureColumns}
          rows={values[section.valueKey] || []}
          emptyText="Sin muestreos registrados."
        />
      ))}

      <DetailTable
        title="No conformidades y acciones correctivas"
        columns={group.template.actionTable.columns}
        rows={actions}
        emptyText="Sin acciones correctivas registradas."
      />

      <GuideDetailTable guide={group.template.guide} />
    </div>
  );
}

function SamplesDetailTable({ group }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1120px] border-collapse text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="w-12 border-r border-slate-200 px-3 py-3 text-left">#</th>
              {group.template.table.columns.map((column) => (
                <th key={column.id} className="border-r border-slate-200 px-3 py-3 text-left">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {group.samples.map((sample, index) => (
              <tr key={`${sample.id}-${index}`} className="bg-white">
                <td className="border-r border-slate-100 px-3 py-3 font-black text-slate-400">
                  {index + 1}
                </td>
                {group.template.table.columns.map((column) => (
                  <td key={column.id} className="border-r border-slate-100 px-3 py-3 text-slate-600">
                    {sample[column.id] || ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MonthlyChecklistDetail({ group }) {
  return (
    <div className="grid gap-5">
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1320px] border-collapse text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="sticky left-0 z-10 min-w-56 border-r border-slate-200 bg-slate-50 px-3 py-3 text-left">
                  Zona / Item
                </th>
                {Array.from({ length: 31 }, (_, index) => (
                  <th key={index + 1} className="border-r border-slate-200 px-3 py-3 text-center">
                    {index + 1}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {group.template.checklist.map((zone) => (
                <GroupedZoneRows key={zone.zone} zone={zone} group={group} />
              ))}
              <MonthlyDailyFieldRows group={group} />
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <MonthlyMetaTable group={group} />
        <CorrectiveActionsTable group={group} />
      </div>
    </div>
  );
}

function GroupedZoneRows({ zone, group }) {
  return (
    <>
      <tr className="bg-slate-100">
        <td colSpan="32" className="px-3 py-2 text-xs font-black uppercase tracking-wide text-slate-600">
          {zone.zone}
        </td>
      </tr>
      {zone.items.map((item) => (
        <tr key={item.id} className="bg-white">
          <td className="sticky left-0 z-10 border-r border-slate-100 bg-white px-3 py-3 font-semibold text-slate-700">
            {item.label}
          </td>
          {Array.from({ length: 31 }, (_, index) => {
            const day = index + 1;
            const dayRecord = group.daysByNumber.get(day);

            return (
              <td key={day} className="border-r border-slate-100 px-3 py-3 text-center font-black text-slate-700">
                {dayRecord?.values?.checks?.[item.id] || ""}
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
}

function MonthlyDailyFieldRows({ group }) {
  return (
    <>
      <tr className="bg-slate-100">
        <td colSpan="32" className="px-3 py-2 text-xs font-black uppercase tracking-wide text-slate-600">
          Datos del dia
        </td>
      </tr>
      {group.template.dailyFields.map((field) => (
        <tr key={field.id} className="bg-white">
          <td className="sticky left-0 z-10 border-r border-slate-100 bg-white px-3 py-3 font-semibold text-slate-700">
            {field.label}
          </td>
          {Array.from({ length: 31 }, (_, index) => {
            const day = index + 1;
            const dayRecord = group.daysByNumber.get(day);

            return (
              <td key={day} className="border-r border-slate-100 px-3 py-3 text-center text-slate-700">
                {dayRecord?.values?.[field.id] || ""}
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
}

function MonthlyMetaTable({ group }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
        <h3 className="font-black text-slate-900">Datos por dia</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-3 text-left">Dia</th>
              <th className="px-3 py-3 text-left">Mes</th>
              <th className="px-3 py-3 text-left">Autoridad INVIMA</th>
              <th className="px-3 py-3 text-left">Verifico</th>
              <th className="px-3 py-3 text-left">Desinfectante</th>
              <th className="px-3 py-3 text-left">Concentracion</th>
              <th className="px-3 py-3 text-left">Hora liberacion</th>
              <th className="px-3 py-3 text-left">Hora inicio proceso</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {group.days.map((day) => (
              <tr key={day.id}>
                <td className="px-3 py-3 font-black text-slate-700">{day.day}</td>
                <td className="px-3 py-3 text-slate-600">{day.values.mes}</td>
                <td className="px-3 py-3 text-slate-600">{day.values.autoridadInvima}</td>
                <td className="px-3 py-3 text-slate-600">{day.values.verifico}</td>
                <td className="px-3 py-3 text-slate-600">{day.values.desinfectante}</td>
                <td className="px-3 py-3 text-slate-600">{day.values.concentracion}</td>
                <td className="px-3 py-3 text-slate-600">{day.values.horaLiberacion}</td>
                <td className="px-3 py-3 text-slate-600">{day.values.horaInicioProceso}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CorrectiveActionsTable({ group }) {
  const actions = group.days.flatMap((day) =>
    (day.values.actions || []).map((action) => ({ ...action, sourceDay: day.day }))
  );

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
        <h3 className="font-black text-slate-900">Acciones correctivas</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-3 text-left">Dia</th>
              <th className="px-3 py-3 text-left">Fecha</th>
              <th className="px-3 py-3 text-left">Inconformidad</th>
              <th className="px-3 py-3 text-left">Accion correctiva</th>
              <th className="px-3 py-3 text-left">Verifico</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {actions.map((action, index) => (
              <tr key={`${action.sourceDay}-${index}`}>
                <td className="px-3 py-3 font-black text-slate-700">{action.sourceDay}</td>
                <td className="px-3 py-3 text-slate-600">{action.fecha}</td>
                <td className="px-3 py-3 text-slate-600">{action.inconformidad}</td>
                <td className="px-3 py-3 text-slate-600">{action.accionCorrectiva}</td>
                <td className="px-3 py-3 text-slate-600">{action.verifico}</td>
              </tr>
            ))}

            {actions.length === 0 && (
              <tr>
                <td colSpan="5" className="px-3 py-8 text-center text-sm font-medium text-slate-500">
                  Sin acciones correctivas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function groupRecords(records) {
  const groups = new Map();

  records.forEach((record) => {
    const template = formatTemplates.find((item) => item.id === record.formatoId);
    if (!template) return;

    if (template.layout === "monthly-checklist") {
      addMonthlyRecord(groups, record, template);
      return;
    }

    if (template.layout === "weekly-poes") {
      addWeeklyPoesRecord(groups, record, template);
      return;
    }

    if (template.layout === "daily-trip-table") {
      addDailyTripRecord(groups, record, template);
      return;
    }

    if (template.layout === "hydration-test") {
      addHydrationRecord(groups, record, template);
      return;
    }

    if (template.layout === "temperature-pcc") {
      addTemperaturePccRecord(groups, record, template);
      return;
    }

    if (template.layout === "cold-rooms-monthly") {
      addColdRoomsMonthlyRecord(groups, record, template);
      return;
    }

    if (template.layout === "dispatch-product-daily") {
      addDispatchProductRecord(groups, record, template);
      return;
    }

    if (template.layout === "chlorine-chiller-daily") {
      addChlorineChillerRecord(groups, record, template);
      return;
    }

    if (template.layout === "viscera-temperature-daily") {
      addVisceraTemperatureRecord(groups, record, template);
      return;
    }

    addSampleRecord(groups, record, template);
  });

  return Array.from(groups.values()).map((group) => {
    if (group.kind === "monthly-checklist") {
      const days = group.days.sort((a, b) => Number(a.day) - Number(b.day));

      return {
        ...group,
        days,
        daysByNumber: new Map(days.map((day) => [Number(day.day), day])),
      };
    }

    if (group.kind === "weekly-poes") {
      return group;
    }

    if (group.kind === "daily-trip") {
      return group;
    }

    if (group.kind === "hydration-test") {
      return group;
    }

    if (group.kind === "temperature-pcc") {
      return group;
    }

    if (group.kind === "cold-rooms-monthly") {
      return group;
    }

    if (group.kind === "dispatch-product") {
      return group;
    }

    if (group.kind === "chlorine-chiller") {
      return group;
    }

    if (group.kind === "viscera-temperature") {
      return group;
    }

    return {
      ...group,
      samples: group.samples.sort(
        (a, b) => new Date(a.fechaRegistro) - new Date(b.fechaRegistro)
      ),
    };
  });
}

function addWeeklyPoesRecord(groups, record, template) {
  const periodKey = record.periodKey || record.values?.periodoDesde || getDateKey(record.fechaRegistro);
  if (!periodKey) return;
  const responsibles = getWeeklyPoesAreaResponsibles(record.values || {}, template);

  const groupId = `${record.formatoId}-${periodKey}`;
  const current = createBaseGroup({
    id: groupId,
    record,
    template,
    kind: "weekly-poes",
    filterDate: periodKey,
    periodLabel: record.periodLabel || getWeeklyPoesPeriodLabel(record.values || {}, periodKey),
  });

  current.records = [record];
  current.periodKey = periodKey;
  current.weeklyRecord = {
    id: record.id,
    fechaRegistro: record.fechaRegistro,
    values: record.values || {},
  };
  current.verifiers = getUniqueValues([
    ...responsibles.map((area) => area.verificadoPor),
    ...(record.values?.acciones || []).map((action) => action.verificadoPor),
  ]);

  groups.set(groupId, current);
}

function addDailyTripRecord(groups, record, template) {
  const dateKey = record.dayKey || record.values?.fecha || getDateKey(record.fechaRegistro);
  if (!dateKey) return;

  const groupId = `${record.formatoId}-${dateKey}`;
  const current = createBaseGroup({
    id: groupId,
    record,
    template,
    kind: "daily-trip",
    filterDate: dateKey,
    periodLabel: formatDisplayDate(dateKey),
  });

  current.records = [record];
  current.tripRecord = {
    id: record.id,
    fechaRegistro: record.fechaRegistro,
    values: record.values || {},
  };
  current.verifiers = getUniqueValues([record.values?.verificadoPor]);

  groups.set(groupId, current);
}

function addHydrationRecord(groups, record, template) {
  const dateKey = record.dayKey || record.values?.fecha || getDateKey(record.fechaRegistro);
  if (!dateKey) return;

  const groupId = `${record.formatoId}-${dateKey}`;
  const current = createBaseGroup({
    id: groupId,
    record,
    template,
    kind: "hydration-test",
    filterDate: dateKey,
    periodLabel: formatDisplayDate(dateKey),
  });

  current.records = [record];
  current.hydrationRecord = {
    id: record.id,
    fechaRegistro: record.fechaRegistro,
    values: record.values || {},
  };
  current.verifiers = getUniqueValues([record.values?.verifico]);

  groups.set(groupId, current);
}

function addTemperaturePccRecord(groups, record, template) {
  const dateKey = record.dayKey || record.values?.fecha || getDateKey(record.fechaRegistro);
  if (!dateKey) return;

  const groupId = `${record.formatoId}-${dateKey}`;
  const current = createBaseGroup({
    id: groupId,
    record,
    template,
    kind: "temperature-pcc",
    filterDate: dateKey,
    periodLabel: formatDisplayDate(dateKey),
  });

  current.records = [record];
  current.temperatureRecord = {
    id: record.id,
    fechaRegistro: record.fechaRegistro,
    values: record.values || {},
  };
  current.verifiers = getUniqueValues([
    record.values?.verifica,
    ...(record.values?.[template.monitorTable.valueKey] || []).map(
      (row) => row.monitoreadoVerificadoPor
    ),
    ...(record.values?.[template.actionTable.valueKey] || []).map(
      (row) => row.responsable
    ),
  ]);

  groups.set(groupId, current);
}

function addColdRoomsMonthlyRecord(groups, record, template) {
  const periodKey =
    record.periodKey ||
    record.values?.monthKey ||
    getDateKey(record.fechaRegistro).slice(0, 7);
  if (!periodKey) return;

  const groupId = `${record.formatoId}-${periodKey}`;
  const current = createBaseGroup({
    id: groupId,
    record,
    template,
    kind: "cold-rooms-monthly",
    filterDate: `${periodKey}-01`,
    periodLabel: getMonthLabel("", periodKey),
  });

  current.records = [record];
  current.periodKey = periodKey;
  current.coldRoomsRecord = {
    id: record.id,
    fechaRegistro: record.fechaRegistro,
    values: record.values || {},
  };
  current.verifiers = getUniqueValues([
    ...(record.values?.[template.monitorTable.valueKey] || []).map(
      (row) => row.responsable
    ),
    ...(record.values?.[template.actionTable.valueKey] || []).map(
      (row) => row.ejecutadoPor
    ),
  ]);

  groups.set(groupId, current);
}

function addDispatchProductRecord(groups, record, template) {
  const dateKey = record.dayKey || record.values?.fecha || getDateKey(record.fechaRegistro);
  if (!dateKey) return;

  const groupId = `${record.formatoId}-${dateKey}`;
  const current = createBaseGroup({
    id: groupId,
    record,
    template,
    kind: "dispatch-product",
    filterDate: dateKey,
    periodLabel: formatDisplayDate(dateKey),
  });

  current.records = [record];
  current.dispatchRecord = {
    id: record.id,
    fechaRegistro: record.fechaRegistro,
    values: record.values || {},
  };
  current.verifiers = getUniqueValues([
    record.values?.verificadoPor,
    ...(record.values?.[template.dispatchTable.valueKey] || []).flatMap((row) => [
      row.responsable,
      row.auxiliarCalidad,
    ]),
    ...(record.values?.[template.actionTable.valueKey] || []).map(
      (row) => row.ejecutadoPor
    ),
  ]);

  groups.set(groupId, current);
}

function addChlorineChillerRecord(groups, record, template) {
  const dateKey = record.dayKey || record.values?.loteProceso || getDateKey(record.fechaRegistro);
  if (!dateKey) return;

  const groupId = `${record.formatoId}-${dateKey}`;
  const current = createBaseGroup({
    id: groupId,
    record,
    template,
    kind: "chlorine-chiller",
    filterDate: dateKey,
    periodLabel: formatDisplayDate(dateKey),
  });

  current.records = [record];
  current.chlorineRecord = {
    id: record.id,
    fechaRegistro: record.fechaRegistro,
    values: record.values || {},
  };
  current.verifiers = getUniqueValues([
    record.values?.verifica,
    ...(record.values?.[template.chlorineTable.valueKey] || []).map(
      (row) => row.monitoreadoPor
    ),
  ]);

  groups.set(groupId, current);
}

function addVisceraTemperatureRecord(groups, record, template) {
  const dateKey = record.dayKey || record.values?.loteProceso || getDateKey(record.fechaRegistro);
  if (!dateKey) return;

  const groupId = `${record.formatoId}-${dateKey}`;
  const current = createBaseGroup({
    id: groupId,
    record,
    template,
    kind: "viscera-temperature",
    filterDate: dateKey,
    periodLabel: formatDisplayDate(dateKey),
  });

  current.records = [record];
  current.visceraRecord = {
    id: record.id,
    fechaRegistro: record.fechaRegistro,
    values: record.values || {},
  };
  current.verifiers = getUniqueValues([
    record.values?.verificadoPor,
    ...(template.sections || []).flatMap((section) =>
      (record.values?.[section.valueKey] || []).map((row) => row.monitoreadoPor)
    ),
    ...(record.values?.[template.actionTable.valueKey] || []).map(
      (row) => row.responsable
    ),
  ]);

  groups.set(groupId, current);
}

function addSampleRecord(groups, record, template) {
  const isMonthlyTable = template.period === "monthly";
  const firstRow = record.values?.[template.table?.valueKey]?.[0] || {};
  const dateKey = firstRow.fecha || getDateKey(record.fechaRegistro);
  if (!dateKey) return;

  const periodKey = isMonthlyTable
    ? record.periodKey || dateKey.slice(0, 7)
    : dateKey;
  const groupId = `${record.formatoId}-${periodKey}`;
  const current = groups.get(groupId) || createBaseGroup({
    id: groupId,
    record,
    template,
    kind: isMonthlyTable ? "monthly-samples" : "samples",
    filterDate: isMonthlyTable ? `${periodKey}-01` : dateKey,
    periodLabel: isMonthlyTable ? getMonthLabel("", periodKey) : formatDisplayDate(dateKey),
  });

  const samples = record.values?.[template.table?.valueKey] || [];
  const samplesWithMeta = samples.map((sample) => ({
    ...sample,
    id: record.id,
    fechaRegistro: record.fechaRegistro,
  }));

  current.records.push(record);
  current.samples.push(...samplesWithMeta);
  current.verifiers = getUniqueValues([
    ...current.verifiers,
    ...samplesWithMeta.map((sample) => sample.verificadoPor || sample.verifico),
  ]);
  updateGroupDates(current, record.fechaRegistro);

  groups.set(groupId, current);
}

function addMonthlyRecord(groups, record, template) {
  const periodKey = record.periodKey || getDateKey(record.fechaRegistro).slice(0, 7);
  if (!periodKey) return;

  const monthStart = `${periodKey}-01`;
  const groupId = `${record.formatoId}-${periodKey}`;
  const current = groups.get(groupId) || createBaseGroup({
    id: groupId,
    record,
    template,
    kind: "monthly-checklist",
    filterDate: monthStart,
    periodLabel: getMonthLabel(record.values?.mes, periodKey),
  });

  const dayRecord = {
    id: record.id,
    day: record.day || record.values?.day,
    fechaRegistro: record.fechaRegistro,
    values: record.values || {},
  };

  current.records.push(record);
  current.days = [
    ...current.days.filter((item) => Number(item.day) !== Number(dayRecord.day)),
    dayRecord,
  ];
  current.verifiers = getUniqueValues([
    ...current.verifiers,
    dayRecord.values.verifico,
    ...(dayRecord.values.actions || []).map((action) => action.verifico),
  ]);
  updateGroupDates(current, record.fechaRegistro);

  groups.set(groupId, current);
}

function createBaseGroup({ id, record, template, kind, filterDate, periodLabel }) {
  return {
    id,
    kind,
    formatoId: record.formatoId,
    codigo: record.codigo,
    nombre: record.nombre,
    filterDate,
    periodLabel,
    firstRecordAt: record.fechaRegistro,
    lastRecordAt: record.fechaRegistro,
    records: [],
    samples: [],
    days: [],
    template,
    verifiers: [],
  };
}

function updateGroupDates(group, value) {
  group.firstRecordAt =
    new Date(value) < new Date(group.firstRecordAt) ? value : group.firstRecordAt;
  group.lastRecordAt =
    new Date(value) > new Date(group.lastRecordAt) ? value : group.lastRecordAt;
}

function downloadFormat(group) {
  const html = group.kind === "monthly-checklist"
    ? buildMonthlyDownloadHtml(group)
    : group.kind === "weekly-poes"
      ? buildWeeklyPoesDownloadHtml(group)
    : group.kind === "daily-trip"
      ? buildDailyTripDownloadHtml(group)
    : group.kind === "hydration-test"
      ? buildHydrationDownloadHtml(group)
    : group.kind === "temperature-pcc"
      ? buildTemperaturePccDownloadHtml(group)
    : group.kind === "cold-rooms-monthly"
      ? buildColdRoomsMonthlyDownloadHtml(group)
    : group.kind === "dispatch-product"
      ? buildDispatchProductDownloadHtml(group)
    : group.kind === "chlorine-chiller"
      ? buildChlorineChillerDownloadHtml(group)
    : group.kind === "viscera-temperature"
      ? buildVisceraTemperatureDownloadHtml(group)
      : buildSamplesDownloadHtml(group);
  const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${group.codigo}-${sanitizeFilePart(group.periodLabel)}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function buildWeeklyPoesDownloadHtml(group) {
  const values = group.weeklyRecord?.values || {};
  const responsibles = getWeeklyPoesAreaResponsibles(values, group.template);
  const actions = buildRowsHtml(
    group.template.actionTable.columns,
    values[group.template.actionTable.valueKey] || []
  );
  const startHeader = group.template.days
    .map((day) => `<th>${escapeHtml(day.label)}</th>`)
    .join("");
  const startCells = group.template.days
    .map((day) => `<td>${escapeHtml(values.horasInicio?.[day.id] || "")}</td>`)
    .join("");
  const areaTables = group.template.weeklyAreas
    .map((area) => {
      const blockTables = area.blocks
        .map((block) => {
          const rows = block.items
            .map((item) => {
              const itemValue = values.items?.[item.id] || {};
              const dayCells = group.template.days
                .map((day) => {
                  const controls = itemValue.controles?.[day.id] || [];
                  const text = controls
                    .map((control) => `${control.hora || ""} ${control.estado || ""}`.trim())
                    .filter(Boolean)
                    .join(" / ");

                  return `<td>${escapeHtml(text)}</td>`;
                })
                .join("");

              return `
                <tr>
                  <td>${escapeHtml(item.label)}</td>
                  <td>${escapeHtml(itemValue.principioActivo || "")}</td>
                  <td>${escapeHtml(itemValue.concentracion || "")}</td>
                  <td>${escapeHtml(itemValue.aplicacion || "")}</td>
                  ${dayCells}
                </tr>`;
            })
            .join("");

          return `
            <h3>${escapeHtml(area.label)} - ${escapeHtml(block.label)}</h3>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Principio activo</th>
                  <th>Concent.</th>
                  <th>Inmersion / Aspersion</th>
                  ${startHeader}
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>`;
        })
        .join("");

      return blockTables;
    })
    .join("");
  const body = `
    <table>
      <tbody>
        <tr><th>Semana completa</th><td>${escapeHtml(getWeeklyPoesPeriodLabel(values, group.periodKey))}</td></tr>
      </tbody>
    </table>
    <h3>Responsables por area</h3>
    <table>
      <thead>
        <tr>
          <th>Area</th>
          <th>Realizado por</th>
          <th>Verificado por</th>
        </tr>
      </thead>
      <tbody>
        ${responsibles
          .map((area) => `
            <tr>
              <td>${escapeHtml(area.areaLabel)}</td>
              <td>${escapeHtml(area.realizadoPor || "")}</td>
              <td>${escapeHtml(area.verificadoPor || "")}</td>
            </tr>
          `)
          .join("")}
      </tbody>
    </table>
    <h3>Hora inicio proceso</h3>
    <table><thead><tr>${startHeader}</tr></thead><tbody><tr>${startCells}</tr></tbody></table>
    ${areaTables}
    <h3>Acciones correctivas</h3>
    ${buildTableHtml(group.template.actionTable.columns, actions)}
  `;

  return buildExcelHtml({
    group,
    countLabel: getGroupCountLabel(group),
    body,
  });
}

function buildDailyTripDownloadHtml(group) {
  const values = group.tripRecord?.values || {};
  const tripRows = buildRowsHtml(
    group.template.tripTable.columns,
    values[group.template.tripTable.valueKey] || []
  );
  const actionRows = buildRowsHtml(
    group.template.actionTable.columns,
    values[group.template.actionTable.valueKey] || []
  );
  const guideColumns = [
    { id: "noConformidad", label: "No conformidad" },
    { id: "codigoNoConformidad", label: "Codigo no conformidad" },
    { id: "accionCorrectiva", label: "Accion correctiva a aplicar" },
    { id: "codigoAccionCorrectiva", label: "Codigo accion correctiva" },
  ];
  const guideRows = buildRowsHtml(guideColumns, group.template.guide || []);
  const body = `
    <h3>Viajes del dia</h3>
    ${buildTableHtml(group.template.tripTable.columns, tripRows)}
    <h3>Cierre del formato</h3>
    <table>
      <tbody>
        <tr><th>Fecha</th><td>${escapeHtml(values.fecha || group.filterDate)}</td></tr>
        <tr><th>Observaciones</th><td>${escapeHtml(values.observaciones || "")}</td></tr>
        <tr><th>Verificado por</th><td>${escapeHtml(values.verificadoPor || "")}</td></tr>
      </tbody>
    </table>
    <h3>Acciones correctivas</h3>
    ${buildTableHtml(group.template.actionTable.columns, actionRows)}
    <h3>Tabla guia de no conformidades y acciones correctivas</h3>
    ${buildTableHtml(guideColumns, guideRows)}
  `;

  return buildExcelHtml({
    group,
    countLabel: getGroupCountLabel(group),
    body,
  });
}

function buildDispatchProductDownloadHtml(group) {
  const values = group.dispatchRecord?.values || {};
  const dispatchRows = buildRowsHtml(
    group.template.dispatchTable.columns,
    values[group.template.dispatchTable.valueKey] || []
  );
  const actionRows = buildRowsHtml(
    group.template.actionTable.columns,
    values[group.template.actionTable.valueKey] || []
  );
  const guideColumns = [
    { id: "noConformidad", label: "No conformidad" },
    { id: "codigoNoConformidad", label: "Codigo no conformidad" },
    { id: "accionCorrectiva", label: "Accion correctiva a aplicar" },
    { id: "codigoAccionCorrectiva", label: "Codigo accion correctiva" },
  ];
  const guideRows = buildRowsHtml(guideColumns, group.template.guide || []);
  const body = `
    <h3>Despachos del dia</h3>
    ${buildTableHtml(group.template.dispatchTable.columns, dispatchRows)}
    <h3>Cierre del formato</h3>
    <table>
      <tbody>
        <tr><th>Fecha</th><td>${escapeHtml(values.fecha || group.filterDate)}</td></tr>
        <tr><th>Observaciones</th><td>${escapeHtml(values.observaciones || "")}</td></tr>
        <tr><th>Verificado por</th><td>${escapeHtml(values.verificadoPor || "")}</td></tr>
      </tbody>
    </table>
    <h3>Acciones correctivas</h3>
    ${buildTableHtml(group.template.actionTable.columns, actionRows)}
    <h3>Tabla guia de no conformidades y acciones correctivas</h3>
    ${buildTableHtml(guideColumns, guideRows)}
  `;

  return buildExcelHtml({
    group,
    countLabel: getGroupCountLabel(group),
    body,
  });
}

function buildChlorineChillerDownloadHtml(group) {
  const values = group.chlorineRecord?.values || {};
  const controlRows = buildRowsHtml(
    group.template.chlorineTable.columns,
    values[group.template.chlorineTable.valueKey] || []
  );
  const guideColumns = [
    { id: "noConformidad", label: "No conformidad" },
    { id: "codigoNoConformidad", label: "Codigo no conformidad" },
    { id: "accionCorrectiva", label: "Accion correctiva a aplicar" },
    { id: "codigoAccionCorrectiva", label: "Codigo accion correctiva" },
  ];
  const guideRows = buildRowsHtml(guideColumns, group.template.guide || []);
  const body = `
    <table>
      <tbody>
        <tr><th>Lote proceso</th><td>${escapeHtml(values.loteProceso || group.filterDate)}</td></tr>
        <tr><th>Verifica</th><td>${escapeHtml(values.verifica || "")}</td></tr>
      </tbody>
    </table>
    <h3>Controles de cloro residual</h3>
    ${buildTableHtml(group.template.chlorineTable.columns, controlRows)}
    <h3>Tabla guia de no conformidades y acciones correctivas</h3>
    ${buildTableHtml(guideColumns, guideRows)}
  `;

  return buildExcelHtml({
    group,
    countLabel: getGroupCountLabel(group),
    body,
  });
}

function buildVisceraTemperatureDownloadHtml(group) {
  const values = group.visceraRecord?.values || {};
  const actionRows = buildRowsHtml(
    group.template.actionTable.columns,
    values[group.template.actionTable.valueKey] || []
  );
  const guideColumns = [
    { id: "noConformidad", label: "No conformidad" },
    { id: "codigoNoConformidad", label: "Codigo no conformidad" },
    { id: "accionCorrectiva", label: "Accion correctiva a aplicar" },
    { id: "codigoAccionCorrectiva", label: "Codigo accion correctiva" },
  ];
  const guideRows = buildRowsHtml(guideColumns, group.template.guide || []);
  const sectionTables = group.template.sections
    .map((section) => {
      const rows = buildRowsHtml(
        group.template.temperatureColumns,
        values[section.valueKey] || []
      );

      return `
        <h3>${escapeHtml(section.label)}</h3>
        ${buildTableHtml(group.template.temperatureColumns, rows)}
      `;
    })
    .join("");
  const body = `
    <table>
      <tbody>
        <tr><th>Lote proceso</th><td>${escapeHtml(values.loteProceso || group.filterDate)}</td></tr>
        <tr><th>Observaciones</th><td>${escapeHtml(values.observaciones || "")}</td></tr>
        <tr><th>Verificado por</th><td>${escapeHtml(values.verificadoPor || "")}</td></tr>
      </tbody>
    </table>
    ${sectionTables}
    <h3>No conformidades y acciones correctivas</h3>
    ${buildTableHtml(group.template.actionTable.columns, actionRows)}
    <h3>Tabla guia de no conformidades y acciones correctivas</h3>
    ${buildTableHtml(guideColumns, guideRows)}
  `;

  return buildExcelHtml({
    group,
    countLabel: getGroupCountLabel(group),
    body,
  });
}

function buildHydrationDownloadHtml(group) {
  const values = group.hydrationRecord?.values || {};
  const sampleRows = buildRowsHtml(group.template.sampleColumns, values.muestras || []);
  const body = `
    <table>
      <tbody>
        <tr><th>Fecha</th><td>${escapeHtml(values.fecha || group.filterDate)}</td></tr>
        <tr><th>Granja</th><td>${escapeHtml(values.granja || "")}</td></tr>
        <tr><th>Hora inicial</th><td>${escapeHtml(values.horaInicial || "")}</td></tr>
        <tr><th>Hora final</th><td>${escapeHtml(values.horaFinal || "")}</td></tr>
      </tbody>
    </table>
    <h3>Muestras</h3>
    ${buildTableHtml(group.template.sampleColumns, sampleRows)}
    <h3>Temperaturas</h3>
    <table>
      <tbody>
        <tr><th>Temperatura pre-chiller</th><td>${escapeHtml(values.temperaturaPreChiller || "")}</td></tr>
        <tr><th>Temperatura chiller</th><td>${escapeHtml(values.temperaturaChiller || "")}</td></tr>
        <tr><th>Temperatura ingreso canales</th><td>${escapeHtml(values.temperaturaIngresoCanales || "")}</td></tr>
        <tr><th>Temperatura salida canales</th><td>${escapeHtml(values.temperaturaSalidaCanales || "")}</td></tr>
      </tbody>
    </table>
    <h3>Cierre</h3>
    <table>
      <tbody>
        <tr><th>% Hidratacion</th><td>${escapeHtml(values.porcentajeHidratacion || "")}</td></tr>
        <tr><th>Viaje</th><td>${escapeHtml(values.viaje || "")}</td></tr>
        <tr><th>Observaciones</th><td>${escapeHtml(values.observaciones || "")}</td></tr>
        <tr><th>Responsable</th><td>${escapeHtml(values.responsable || "")}</td></tr>
        <tr><th>Verifico</th><td>${escapeHtml(values.verifico || "")}</td></tr>
      </tbody>
    </table>
  `;

  return buildExcelHtml({
    group,
    countLabel: getGroupCountLabel(group),
    body,
  });
}

function buildTemperaturePccDownloadHtml(group) {
  const values = group.temperatureRecord?.values || {};
  const measurementRows = buildRowsHtml(
    group.template.monitorTable.columns,
    values[group.template.monitorTable.valueKey] || []
  );
  const actionRows = buildRowsHtml(
    group.template.actionTable.columns,
    values[group.template.actionTable.valueKey] || []
  );
  const guideColumns = [
    { id: "noConformidad", label: "No conformidad" },
    { id: "codigoNoConformidad", label: "Codigo no conformidad" },
    { id: "accionCorrectiva", label: "Accion correctiva a aplicar" },
  ];
  const guideRows = buildRowsHtml(guideColumns, group.template.guide || []);
  const limitRows = (group.template.controlLimits || [])
    .map((item) => `
      <tr>
        <td>${escapeHtml(item.label)}</td>
        <td>${escapeHtml(item.value)}</td>
      </tr>
    `)
    .join("");
  const body = `
    <table>
      <tbody>
        <tr><th>Fecha</th><td>${escapeHtml(values.fecha || group.filterDate)}</td></tr>
        <tr><th>Lote de proceso</th><td>${escapeHtml(values.loteProceso || "")}</td></tr>
        <tr><th>Hora de inicio</th><td>${escapeHtml(values.horaInicio || "")}</td></tr>
        <tr><th>Verifica</th><td>${escapeHtml(values.verifica || "")}</td></tr>
      </tbody>
    </table>
    <h3>Limites PCC</h3>
    <table><thead><tr><th>Referencia</th><th>Valor</th></tr></thead><tbody>${limitRows}</tbody></table>
    <h3>Mediciones de temperatura</h3>
    ${buildTableHtml(group.template.monitorTable.columns, measurementRows)}
    <h3>Acciones correctivas</h3>
    ${buildTableHtml(group.template.actionTable.columns, actionRows)}
    <h3>Tabla guia de no conformidades y acciones correctivas</h3>
    ${buildTableHtml(guideColumns, guideRows)}
  `;

  return buildExcelHtml({
    group,
    countLabel: getGroupCountLabel(group),
    body,
  });
}

function buildColdRoomsMonthlyDownloadHtml(group) {
  const values = group.coldRoomsRecord?.values || {};
  const controlRows = buildRowsHtml(
    group.template.monitorTable.columns,
    values[group.template.monitorTable.valueKey] || []
  );
  const actionRows = buildRowsHtml(
    group.template.actionTable.columns,
    values[group.template.actionTable.valueKey] || []
  );
  const guideColumns = [
    { id: "noConformidad", label: "No conformidad" },
    { id: "codigoNoConformidad", label: "Codigo no conformidad" },
    { id: "accionCorrectiva", label: "Accion correctiva a aplicar" },
    { id: "codigoAccionCorrectiva", label: "Codigo accion correctiva" },
  ];
  const guideRows = buildRowsHtml(guideColumns, group.template.guide || []);
  const body = `
    <table>
      <tbody>
        <tr><th>Periodo</th><td>${escapeHtml(values.monthKey || group.periodKey)}</td></tr>
      </tbody>
    </table>
    <h3>Controles de temperatura</h3>
    ${buildTableHtml(group.template.monitorTable.columns, controlRows)}
    <h3>Acciones correctivas</h3>
    ${buildTableHtml(group.template.actionTable.columns, actionRows)}
    <h3>Tabla guia de no conformidades y acciones correctivas</h3>
    ${buildTableHtml(guideColumns, guideRows)}
  `;

  return buildExcelHtml({
    group,
    countLabel: getGroupCountLabel(group),
    body,
  });
}

function buildRowsHtml(columns, rows) {
  return rows
    .map((row, index) => {
      const cells = columns
        .map((column) => `<td>${escapeHtml(row[column.id] || "")}</td>`)
        .join("");

      return `<tr><td>${index + 1}</td>${cells}</tr>`;
    })
    .join("");
}

function buildTableHtml(columns, rowsHtml) {
  const headerCells = columns
    .map((column) => `<th>${escapeHtml(column.label)}</th>`)
    .join("");

  return `
    <table>
      <thead><tr><th>#</th>${headerCells}</tr></thead>
      <tbody>${rowsHtml || `<tr><td colspan="${columns.length + 1}">Sin registros</td></tr>`}</tbody>
    </table>
  `;
}

function buildSamplesDownloadHtml(group) {
  const columns = group.template.table.columns;
  const headerCells = columns
    .map((column) => `<th>${escapeHtml(column.label)}</th>`)
    .join("");
  const rows = group.samples
    .map((sample, index) => {
      const cells = columns
        .map((column) => `<td>${escapeHtml(sample[column.id] || "")}</td>`)
        .join("");

      return `<tr><td>${index + 1}</td>${cells}</tr>`;
    })
    .join("");

  return buildExcelHtml({
    group,
    countLabel: getGroupCountLabel(group),
    body: `<table><thead><tr><th>#</th>${headerCells}</tr></thead><tbody>${rows}</tbody></table>`,
  });
}

function buildMonthlyDownloadHtml(group) {
  const dayHeaders = Array.from({ length: 31 }, (_, index) => `<th>${index + 1}</th>`).join("");
  const checklistRows = group.template.checklist
    .map((zone) => {
      const zoneRow = `<tr><th colspan="32">${escapeHtml(zone.zone)}</th></tr>`;
      const itemRows = zone.items
        .map((item) => {
          const cells = Array.from({ length: 31 }, (_, index) => {
            const day = index + 1;
            const record = group.daysByNumber.get(day);

            return `<td>${escapeHtml(record?.values?.checks?.[item.id] || "")}</td>`;
          }).join("");

          return `<tr><td>${escapeHtml(item.label)}</td>${cells}</tr>`;
        })
        .join("");

      return `${zoneRow}${itemRows}`;
    })
    .join("");
  const dailyFieldRows = `
    <tr><th colspan="32">Datos del dia</th></tr>
    ${group.template.dailyFields
      .map((field) => {
        const cells = Array.from({ length: 31 }, (_, index) => {
          const day = index + 1;
          const record = group.daysByNumber.get(day);

          return `<td>${escapeHtml(record?.values?.[field.id] || "")}</td>`;
        }).join("");

        return `<tr><td>${escapeHtml(field.label)}</td>${cells}</tr>`;
      })
      .join("")}`;
  const actionRows = group.days
    .flatMap((day) =>
      (day.values.actions || []).map((action) => `
        <tr>
          <td>${escapeHtml(day.day)}</td>
          <td>${escapeHtml(action.fecha || "")}</td>
          <td>${escapeHtml(action.inconformidad || "")}</td>
          <td>${escapeHtml(action.accionCorrectiva || "")}</td>
          <td>${escapeHtml(action.verifico || "")}</td>
        </tr>
      `)
    )
    .join("");
  const body = `
    <table>
      <thead><tr><th>Zona / Item</th>${dayHeaders}</tr></thead>
      <tbody>${checklistRows}${dailyFieldRows}</tbody>
    </table>
    <h3>Acciones correctivas</h3>
    <table>
      <thead><tr><th>Dia</th><th>Fecha</th><th>Inconformidad</th><th>Accion correctiva</th><th>Verifico</th></tr></thead>
      <tbody>${actionRows || '<tr><td colspan="5">Sin acciones correctivas</td></tr>'}</tbody>
    </table>`;

  return buildExcelHtml({
    group,
    countLabel: `${group.days.length} dias guardados`,
    body,
  });
}

function buildExcelHtml({ group, countLabel, body }) {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: Arial, sans-serif; color: #0f172a; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 14px; }
    th, td { border: 1px solid #94a3b8; padding: 8px; font-size: 12px; }
    th { background: #e2e8f0; text-align: left; }
    h3 { margin-top: 18px; }
    .title { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
    .meta { margin-bottom: 14px; font-size: 12px; }
    .note { margin-top: 14px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="title">${escapeHtml(group.nombre)}</div>
  <div class="meta">
    <strong>Codigo:</strong> ${escapeHtml(group.codigo)}
    &nbsp; <strong>Version:</strong> ${escapeHtml(group.template.version || "1")}
    &nbsp; <strong>Periodo:</strong> ${escapeHtml(group.periodLabel)}
    &nbsp; <strong>Registros:</strong> ${escapeHtml(countLabel)}
  </div>
  ${body}
  <div class="note">${escapeHtml(group.template.nota || "")}</div>
</body>
</html>`;
}

function getGroupSearchText(group) {
  if (group.kind === "monthly-checklist") {
    return [
      group.codigo,
      group.nombre,
      group.periodLabel,
      group.verifiers.join(" "),
      ...group.days.flatMap((day) => [
        day.day,
        ...group.template.dailyFields.map((field) => day.values[field.id]),
        ...Object.values(day.values.checks || {}),
        ...(day.values.actions || []).flatMap((action) => Object.values(action)),
      ]),
    ]
      .filter(Boolean)
      .join(" ");
  }

  if (group.kind === "daily-trip") {
    const values = group.tripRecord?.values || {};

    return [
      group.codigo,
      group.nombre,
      group.periodLabel,
      group.verifiers.join(" "),
      values.fecha,
      values.observaciones,
      values.verificadoPor,
      ...(values[group.template.tripTable.valueKey] || []).flatMap((row) => Object.values(row)),
      ...(values[group.template.actionTable.valueKey] || []).flatMap((row) => Object.values(row)),
      ...(group.template.guide || []).flatMap((row) => Object.values(row)),
    ]
      .filter(Boolean)
      .join(" ");
  }

  if (group.kind === "hydration-test") {
    const values = group.hydrationRecord?.values || {};

    return [
      group.codigo,
      group.nombre,
      group.periodLabel,
      group.verifiers.join(" "),
      values.fecha,
      values.granja,
      values.horaInicial,
      values.horaFinal,
      values.temperaturaPreChiller,
      values.temperaturaChiller,
      values.temperaturaIngresoCanales,
      values.temperaturaSalidaCanales,
      values.porcentajeHidratacion,
      values.viaje,
      values.observaciones,
      values.responsable,
      values.verifico,
      ...(values.muestras || []).flatMap((row) => Object.values(row)),
    ]
      .filter(Boolean)
      .join(" ");
  }

  if (group.kind === "temperature-pcc") {
    const values = group.temperatureRecord?.values || {};

    return [
      group.codigo,
      group.nombre,
      group.periodLabel,
      group.verifiers.join(" "),
      values.fecha,
      values.loteProceso,
      values.horaInicio,
      values.verifica,
      ...(values[group.template.monitorTable.valueKey] || []).flatMap((row) => Object.values(row)),
      ...(values[group.template.actionTable.valueKey] || []).flatMap((row) => Object.values(row)),
      ...(group.template.guide || []).flatMap((row) => Object.values(row)),
      ...(group.template.controlLimits || []).flatMap((row) => Object.values(row)),
    ]
      .filter(Boolean)
      .join(" ");
  }

  if (group.kind === "cold-rooms-monthly") {
    const values = group.coldRoomsRecord?.values || {};

    return [
      group.codigo,
      group.nombre,
      group.periodLabel,
      group.verifiers.join(" "),
      values.monthKey,
      ...(values[group.template.monitorTable.valueKey] || []).flatMap((row) => Object.values(row)),
      ...(values[group.template.actionTable.valueKey] || []).flatMap((row) => Object.values(row)),
      ...(group.template.guide || []).flatMap((row) => Object.values(row)),
    ]
      .filter(Boolean)
      .join(" ");
  }

  if (group.kind === "dispatch-product") {
    const values = group.dispatchRecord?.values || {};

    return [
      group.codigo,
      group.nombre,
      group.periodLabel,
      group.verifiers.join(" "),
      values.fecha,
      values.observaciones,
      values.verificadoPor,
      ...(values[group.template.dispatchTable.valueKey] || []).flatMap((row) => Object.values(row)),
      ...(values[group.template.actionTable.valueKey] || []).flatMap((row) => Object.values(row)),
      ...(group.template.guide || []).flatMap((row) => Object.values(row)),
    ]
      .filter(Boolean)
      .join(" ");
  }

  if (group.kind === "chlorine-chiller") {
    const values = group.chlorineRecord?.values || {};

    return [
      group.codigo,
      group.nombre,
      group.periodLabel,
      group.verifiers.join(" "),
      values.loteProceso,
      values.verifica,
      ...(values[group.template.chlorineTable.valueKey] || []).flatMap((row) => Object.values(row)),
      ...(group.template.guide || []).flatMap((row) => Object.values(row)),
    ]
      .filter(Boolean)
      .join(" ");
  }

  if (group.kind === "viscera-temperature") {
    const values = group.visceraRecord?.values || {};

    return [
      group.codigo,
      group.nombre,
      group.periodLabel,
      group.verifiers.join(" "),
      values.loteProceso,
      values.observaciones,
      values.verificadoPor,
      ...group.template.sections.flatMap((section) =>
        (values[section.valueKey] || []).flatMap((row) => Object.values(row))
      ),
      ...(values[group.template.actionTable.valueKey] || []).flatMap((row) => Object.values(row)),
      ...(group.template.guide || []).flatMap((row) => Object.values(row)),
    ]
      .filter(Boolean)
      .join(" ");
  }

  if (group.kind === "weekly-poes") {
    const values = group.weeklyRecord?.values || {};
    const responsibles = getWeeklyPoesAreaResponsibles(values, group.template);

    return [
      group.codigo,
      group.nombre,
      group.periodLabel,
      group.verifiers.join(" "),
      values.periodoDesde,
      values.periodoHasta,
      values.periodoMes,
      values.realizadoPor,
      values.verificadoPor,
      ...responsibles.flatMap((area) => [
        area.areaLabel,
        area.realizadoPor,
        area.verificadoPor,
      ]),
      ...Object.values(values.horasInicio || {}),
      ...getWeeklyPoesItems(group.template).flatMap((item) => {
        const itemValue = values.items?.[item.id] || {};

        return [
          item.areaLabel,
          item.blockLabel,
          item.label,
          itemValue.principioActivo,
          itemValue.concentracion,
          itemValue.aplicacion,
          ...Object.values(itemValue.controles || {}).flatMap((controls) =>
            controls.flatMap((control) => Object.values(control))
          ),
        ];
      }),
      ...(values[group.template.actionTable.valueKey] || []).flatMap((row) => Object.values(row)),
    ]
      .filter(Boolean)
      .join(" ");
  }

  return [
    group.codigo,
    group.nombre,
    group.periodLabel,
    group.verifiers.join(" "),
    ...group.samples.flatMap((sample) => Object.values(sample)),
  ]
    .filter(Boolean)
    .join(" ");
}

function getGroupCountLabel(group) {
  if (group.kind === "monthly-checklist") {
    return group.days.length === 1
      ? "1 dia"
      : `${group.days.length} dias`;
  }

  if (group.kind === "daily-trip") {
    const values = group.tripRecord?.values || {};
    const trips = values[group.template.tripTable.valueKey] || [];

    return trips.length === 1
      ? "1 viaje"
      : `${trips.length} viajes`;
  }

  if (group.kind === "hydration-test") {
    return "1 formato";
  }

  if (group.kind === "temperature-pcc") {
    const values = group.temperatureRecord?.values || {};
    const measurements = values[group.template.monitorTable.valueKey] || [];

    return measurements.length === 1
      ? "1 medicion"
      : `${measurements.length} mediciones`;
  }

  if (group.kind === "cold-rooms-monthly") {
    const values = group.coldRoomsRecord?.values || {};
    const controls = values[group.template.monitorTable.valueKey] || [];

    return controls.length === 1
      ? "1 control"
      : `${controls.length} controles`;
  }

  if (group.kind === "dispatch-product") {
    const values = group.dispatchRecord?.values || {};
    const dispatches = values[group.template.dispatchTable.valueKey] || [];

    return dispatches.length === 1
      ? "1 despacho"
      : `${dispatches.length} despachos`;
  }

  if (group.kind === "chlorine-chiller") {
    const values = group.chlorineRecord?.values || {};
    const controls = values[group.template.chlorineTable.valueKey] || [];

    return controls.length === 1
      ? "1 control"
      : `${controls.length} controles`;
  }

  if (group.kind === "viscera-temperature") {
    const values = group.visceraRecord?.values || {};
    const samples = (values.visceras || []).length + (values.patasCabezas || []).length;

    return samples === 1
      ? "1 muestreo"
      : `${samples} muestreos`;
  }

  if (group.kind === "weekly-poes") {
    return "1 semana";
  }

  if (group.template.table?.valueKey === "mediciones") {
    return group.samples.length === 1
      ? "1 medicion"
      : `${group.samples.length} mediciones`;
  }

  return group.samples.length === 1
    ? "1 muestra"
    : `${group.samples.length} muestras`;
}

function getUniqueValues(values) {
  return Array.from(
    new Set(values.map((value) => String(value || "").trim()).filter(Boolean))
  );
}

function getMonthLabel(value, periodKey) {
  if (value) return value;

  const [year, month] = periodKey.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);

  return new Intl.DateTimeFormat("es-CO", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatDisplayDate(dateKey) {
  const [year, month, day] = dateKey.split("-");

  return `${day}/${month}/${year}`;
}

function sanitizeFilePart(value) {
  return String(value)
    .replaceAll("/", "-")
    .replaceAll(" ", "_")
    .replace(/[^\w.-]/g, "");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function Detail({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 font-bold text-slate-700">{value}</p>
    </div>
  );
}
