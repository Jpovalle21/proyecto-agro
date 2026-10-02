import { useEffect, useMemo, useState } from "react";
import controlPccCanalesImage from "../../../assets/calidad/control-pcc-canales.png";
import {
  createInitialDynamicRow,
  createInitialTableRow,
  formatDateTime,
  formatTemplates,
  getEditableFieldCount,
  getGlobalProgress,
  getInitialValues,
  getMissingRequiredField,
  getPeriodKey,
  getRecordsForTemplateCurrentPeriod,
  getRequiredFieldCount,
  getTemplateFields,
  getTemplateProgress,
  getWeekPeriodKey,
  getWeeklyPoesAreaResponsibles,
  getWeeklyPoesPeriodLabel,
  loadFormatRecords,
  saveFormatRecords,
} from "../data/calidadStore";

export default function DocumentosCalidad() {
  const [selectedFormatId, setSelectedFormatId] = useState(formatTemplates[0].id);
  const [mode, setMode] = useState("preview");
  const [search, setSearch] = useState("");
  const [values, setValues] = useState(() => getInitialValues(formatTemplates[0]));
  const [records, setRecords] = useState(() => loadFormatRecords());
  const [message, setMessage] = useState("");

  const selectedTemplate = useMemo(
    () => formatTemplates.find((template) => template.id === selectedFormatId) || formatTemplates[0],
    [selectedFormatId]
  );

  const selectedRecords = records.filter(
    (record) => record.formatoId === selectedTemplate.id
  );
  const selectedPeriodRecords = getRecordsForTemplateCurrentPeriod(records, selectedTemplate);
  const globalProgress = getGlobalProgress(records);
  const selectedProgress = getTemplateProgress(records, selectedTemplate);

  const filteredTemplates = useMemo(() => {
    const term = search.trim().toLowerCase();

    return formatTemplates.filter((template) => {
      const content = `${template.codigo} ${template.nombre} ${template.descripcion}`.toLowerCase();
      return content.includes(term);
    });
  }, [search]);

  useEffect(() => {
    saveFormatRecords(records);
  }, [records]);

  const selectFormat = (templateId) => {
    const template = formatTemplates.find((item) => item.id === templateId) || formatTemplates[0];

    setSelectedFormatId(template.id);
    setValues(getInitialValues(template));
    setMessage("");
    setMode("preview");
  };

  const getStartValues = () => {
    const initialValues = getInitialValues(selectedTemplate);

    if (selectedTemplate.layout === "temperature-pcc") {
      const todayRecord = selectedPeriodRecords.find(
        (record) => (record.dayKey || record.values?.fecha) === initialValues.fecha
      );

      return todayRecord?.values
        ? JSON.parse(JSON.stringify(todayRecord.values))
        : initialValues;
    }

    if (selectedTemplate.layout === "dispatch-product-daily") {
      const todayRecord = selectedPeriodRecords.find(
        (record) => (record.dayKey || record.values?.fecha) === initialValues.fecha
      );

      return todayRecord?.values
        ? JSON.parse(JSON.stringify(todayRecord.values))
        : initialValues;
    }

    if (selectedTemplate.layout === "chlorine-chiller-daily") {
      const todayRecord = selectedPeriodRecords.find(
        (record) => (record.dayKey || record.values?.loteProceso) === initialValues.loteProceso
      );

      return todayRecord?.values
        ? JSON.parse(JSON.stringify(todayRecord.values))
        : initialValues;
    }

    if (selectedTemplate.layout === "viscera-temperature-daily") {
      const todayRecord = selectedPeriodRecords.find(
        (record) => (record.dayKey || record.values?.loteProceso) === initialValues.loteProceso
      );

      return todayRecord?.values
        ? JSON.parse(JSON.stringify(todayRecord.values))
        : initialValues;
    }

    if (selectedTemplate.layout === "cold-rooms-monthly") {
      const monthRecord = selectedPeriodRecords.find(
        (record) => (record.periodKey || record.values?.monthKey) === initialValues.monthKey
      );

      return monthRecord?.values
        ? JSON.parse(JSON.stringify(monthRecord.values))
        : initialValues;
    }

    return initialValues;
  };

  const startFilling = () => {
    setValues(getStartValues());
    setMessage("");
    setMode("fill");
  };

  useEffect(() => {
    const handleHashChange = () => {
      const prefix = "#llenar-";
      if (window.location.hash.startsWith(prefix)) {
        const templateId = window.location.hash.slice(prefix.length);
        const targetTemplate = formatTemplates.find((template) => template.id === templateId);
        if (!targetTemplate) return;

        const initialValues = getInitialValues(targetTemplate);
        const periodRecords = getRecordsForTemplateCurrentPeriod(records, targetTemplate);
        const existingRecord = targetTemplate.layout === "temperature-pcc"
          ? periodRecords.find(
              (record) => (record.dayKey || record.values?.fecha) === initialValues.fecha
            )
          : targetTemplate.layout === "dispatch-product-daily"
            ? periodRecords.find(
                (record) => (record.dayKey || record.values?.fecha) === initialValues.fecha
              )
          : targetTemplate.layout === "chlorine-chiller-daily"
            ? periodRecords.find(
                (record) =>
                  (record.dayKey || record.values?.loteProceso) === initialValues.loteProceso
              )
          : targetTemplate.layout === "viscera-temperature-daily"
            ? periodRecords.find(
                (record) =>
                  (record.dayKey || record.values?.loteProceso) === initialValues.loteProceso
              )
          : targetTemplate.layout === "cold-rooms-monthly"
            ? periodRecords.find(
                (record) =>
                  (record.periodKey || record.values?.monthKey) === initialValues.monthKey
              )
          : null;

        setSelectedFormatId(targetTemplate.id);
        setValues(
          existingRecord?.values
            ? JSON.parse(JSON.stringify(existingRecord.values))
            : initialValues
        );
        setMessage("");
        setMode("fill");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [records]);

  const updateValue = (fieldId, value) => {
    setValues((current) => ({ ...current, [fieldId]: value }));
  };

  const saveEntry = (event) => {
    event.preventDefault();

    const missingField = getMissingRequiredField(selectedTemplate, values);

    if (missingField) {
      setMessage(missingField);
      return;
    }

    if (
      selectedTemplate.period === "monthly" &&
      selectedTemplate.layout === "empaques-table"
    ) {
      const valueKey = selectedTemplate.table.valueKey;
      const maxPerDay = selectedTemplate.table.maxPerDay || 1;
      const currentRows = values[valueKey] || [];
      const currentDate = currentRows[0]?.fecha;
      const savedToday = selectedPeriodRecords.reduce(
        (sum, record) =>
          sum +
          (record.values?.[valueKey] || []).filter((row) => row.fecha === currentDate)
            .length,
        0
      );

      if (savedToday + currentRows.length > maxPerDay) {
        setMessage(`Este formato solo permite ${maxPerDay} mediciones por dia.`);
        return;
      }
    }

    const record = {
      id: `registro-${Date.now()}`,
      formatoId: selectedTemplate.id,
      codigo: selectedTemplate.codigo,
      nombre: selectedTemplate.nombre,
      fechaRegistro: new Date().toISOString(),
      values,
    };

    if (selectedTemplate.layout === "monthly-checklist") {
      record.periodKey = values.monthKey;
      record.day = values.day;
    } else if (selectedTemplate.layout === "weekly-poes") {
      record.periodKey = getWeekPeriodKey(values.periodoDesde || undefined);
      record.periodLabel = getWeeklyPoesPeriodLabel(values, record.periodKey);
    } else if (
      selectedTemplate.period === "monthly" &&
      selectedTemplate.layout === "empaques-table"
    ) {
      const firstRow = values[selectedTemplate.table.valueKey]?.[0] || {};
      record.periodKey = firstRow.fecha?.slice(0, 7) || getPeriodKey();
      record.day = Number(firstRow.fecha?.slice(8, 10)) || undefined;
    } else if (selectedTemplate.layout === "daily-trip-table") {
      record.dayKey = values.fecha;
    } else if (selectedTemplate.layout === "hydration-test") {
      record.dayKey = values.fecha;
    } else if (selectedTemplate.layout === "temperature-pcc") {
      record.dayKey = values.fecha;
    } else if (selectedTemplate.layout === "cold-rooms-monthly") {
      record.periodKey = values.monthKey || getPeriodKey();
    } else if (selectedTemplate.layout === "dispatch-product-daily") {
      record.dayKey = values.fecha;
    } else if (selectedTemplate.layout === "chlorine-chiller-daily") {
      record.dayKey = values.loteProceso;
    } else if (selectedTemplate.layout === "viscera-temperature-daily") {
      record.dayKey = values.loteProceso;
    }

    setRecords((current) => {
      if (
        selectedTemplate.layout !== "monthly-checklist" &&
        selectedTemplate.layout !== "daily-trip-table" &&
        selectedTemplate.layout !== "weekly-poes" &&
        selectedTemplate.layout !== "hydration-test" &&
        selectedTemplate.layout !== "temperature-pcc" &&
        selectedTemplate.layout !== "cold-rooms-monthly" &&
        selectedTemplate.layout !== "dispatch-product-daily" &&
        selectedTemplate.layout !== "chlorine-chiller-daily" &&
        selectedTemplate.layout !== "viscera-temperature-daily"
      ) {
        return [record, ...current];
      }

      if (selectedTemplate.layout === "weekly-poes") {
        const withoutSameWeek = current.filter(
          (item) =>
            !(
              item.formatoId === selectedTemplate.id &&
              item.periodKey === record.periodKey
            )
        );

        return [record, ...withoutSameWeek];
      }

      if (selectedTemplate.layout === "daily-trip-table") {
        const withoutSameDay = current.filter(
          (item) =>
            !(
              item.formatoId === selectedTemplate.id &&
              (item.dayKey || item.values?.fecha) === record.dayKey
            )
        );

        return [record, ...withoutSameDay];
      }

      if (selectedTemplate.layout === "hydration-test") {
        const withoutSameDay = current.filter(
          (item) =>
            !(
              item.formatoId === selectedTemplate.id &&
              (item.dayKey || item.values?.fecha) === record.dayKey
            )
        );

        return [record, ...withoutSameDay];
      }

      if (selectedTemplate.layout === "temperature-pcc") {
        const withoutSameDay = current.filter(
          (item) =>
            !(
              item.formatoId === selectedTemplate.id &&
              (item.dayKey || item.values?.fecha) === record.dayKey
            )
        );

        return [record, ...withoutSameDay];
      }

      if (selectedTemplate.layout === "dispatch-product-daily") {
        const withoutSameDay = current.filter(
          (item) =>
            !(
              item.formatoId === selectedTemplate.id &&
              (item.dayKey || item.values?.fecha) === record.dayKey
            )
        );

        return [record, ...withoutSameDay];
      }

      if (selectedTemplate.layout === "chlorine-chiller-daily") {
        const withoutSameDay = current.filter(
          (item) =>
            !(
              item.formatoId === selectedTemplate.id &&
              (item.dayKey || item.values?.loteProceso) === record.dayKey
            )
        );

        return [record, ...withoutSameDay];
      }

      if (selectedTemplate.layout === "viscera-temperature-daily") {
        const withoutSameDay = current.filter(
          (item) =>
            !(
              item.formatoId === selectedTemplate.id &&
              (item.dayKey || item.values?.loteProceso) === record.dayKey
            )
        );

        return [record, ...withoutSameDay];
      }

      if (selectedTemplate.layout === "cold-rooms-monthly") {
        const withoutSameMonth = current.filter(
          (item) =>
            !(
              item.formatoId === selectedTemplate.id &&
              (item.periodKey || item.values?.monthKey) === record.periodKey
            )
        );

        return [record, ...withoutSameMonth];
      }

      const withoutSameDay = current.filter(
        (item) =>
          !(
            item.formatoId === selectedTemplate.id &&
            item.periodKey === record.periodKey &&
            item.day === record.day
          )
      );

      return [record, ...withoutSameDay];
    });
    setValues(
      selectedTemplate.layout === "temperature-pcc" ||
        selectedTemplate.layout === "cold-rooms-monthly" ||
        selectedTemplate.layout === "dispatch-product-daily" ||
        selectedTemplate.layout === "chlorine-chiller-daily" ||
        selectedTemplate.layout === "viscera-temperature-daily"
        ? values
        : getInitialValues(selectedTemplate)
    );
    setMessage(
      selectedTemplate.layout === "monthly-checklist"
        ? "Dia guardado correctamente dentro del formato mensual."
        : selectedTemplate.layout === "weekly-poes"
          ? "Formato semanal guardado correctamente."
        : selectedTemplate.layout === "daily-trip-table"
          ? "Formato del dia guardado correctamente con todos los viajes."
        : selectedTemplate.layout === "hydration-test"
          ? "Formato de hidratacion guardado correctamente para el dia."
        : selectedTemplate.layout === "temperature-pcc"
          ? "Formato PCC guardado correctamente para el dia."
        : selectedTemplate.layout === "cold-rooms-monthly"
          ? "Formato mensual de cuartos frios guardado correctamente."
        : selectedTemplate.layout === "dispatch-product-daily"
          ? "Formato de producto despachado guardado correctamente para el dia."
        : selectedTemplate.layout === "chlorine-chiller-daily"
          ? "Formato de cloro residual guardado correctamente para el dia."
        : selectedTemplate.layout === "viscera-temperature-daily"
          ? "Formato de temperaturas de visceras guardado correctamente para el dia."
        : selectedTemplate.period === "monthly"
          ? "Medicion guardada correctamente dentro del formato mensual."
          : "Muestra guardada correctamente. Puedes registrar otra muestra."
    );
  };

  if (mode === "fill") {
    return (
      <FullPageForm
        template={selectedTemplate}
        values={values}
        savedRecords={selectedPeriodRecords}
        message={message}
        onBack={() => {
          setMode("preview");
          setMessage("");
        }}
        onValueChange={updateValue}
        onClear={() => setValues(getInitialValues(selectedTemplate))}
        onSubmit={saveEntry}
      />
    );
  }

  return (
    <div className="min-h-full bg-[#f8fafc] p-6 text-slate-800">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Formatos</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Busca un formato, revisa su vista previa y entra a llenarlo.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Metric label="Avance general" value={`${globalProgress.percent}%`} />
          <Metric label="Completados" value={`${globalProgress.completed}/${globalProgress.total}`} />
          <Metric label="Formatos" value={formatTemplates.length} />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Busqueda
            </p>
            <h2 className="mt-1 text-xl font-black text-slate-900">
              Formatos disponibles
            </h2>

            <div className="mt-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 focus-within:border-[rgb(0,48,73)] focus-within:ring-4 focus-within:ring-slate-100">
              <SearchIcon />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-11 flex-1 bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
                placeholder="Buscar por nombre o codigo..."
              />
            </div>
          </div>

          <div className="grid gap-3 p-4">
            {filteredTemplates.map((template) => {
              const isActive = selectedTemplate.id === template.id;
              const progress = getTemplateProgress(records, template);

              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => selectFormat(template.id)}
                  className={`rounded-xl border p-4 text-left transition ${
                    isActive
                      ? "border-[rgb(0,48,73)] bg-slate-50 shadow-sm"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        {template.codigo}
                      </p>
                      <h3 className="mt-1 font-black text-slate-900">
                        {template.nombre}
                      </h3>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                      {progress.percent}%
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-xs font-bold text-slate-400">
                      <span>
                        {template.period === "monthly"
                          ? "Mes"
                          : template.period === "weekly"
                            ? "Semana"
                            : "Hoy"}
                      </span>
                      <span>{getProgressLabel(template, progress)}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-[rgb(0,48,73)]"
                        style={{ width: `${progress.percent}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}

            {filteredTemplates.length === 0 && (
              <p className="rounded-lg bg-slate-50 px-4 py-6 text-center text-sm font-medium text-slate-500">
                No hay formatos que coincidan con la busqueda.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[rgb(0,48,73)]">
                  {selectedTemplate.codigo}
                </p>
                <h2 className="mt-1 text-2xl font-black text-slate-900">
                  {selectedTemplate.nombre}
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  {selectedTemplate.descripcion}
                </p>
              </div>

              <a
                href={`#llenar-${selectedTemplate.id}`}
                onClick={startFilling}
                className="btn-primary inline-flex items-center justify-center"
              >
                Llenar formato
              </a>
            </div>
          </div>

          <div className="grid gap-5 p-6 lg:grid-cols-[1fr_280px]">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">
                Vista del formato
              </h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <Detail label="Area" value={selectedTemplate.area} />
                <Detail label="Frecuencia" value={selectedTemplate.frecuencia || "Diario"} />
                <Detail label="Campos editables" value={getEditableFieldCount(selectedTemplate)} />
                <Detail label="Obligatorios" value={getRequiredFieldCount(selectedTemplate)} />
              </div>

              <div className="mt-5 rounded-xl border border-slate-200">
                <div className="border-b border-slate-100 px-4 py-3">
                  <p className="text-sm font-bold text-slate-700">
                    Campos del formato
                  </p>
                </div>
                <div className="divide-y divide-slate-100">
                  {getTemplateFields(selectedTemplate).map((field, fieldIndex) => (
                    <div
                      key={`${field.id}-${fieldIndex}`}
                      className="flex flex-col gap-1 px-4 py-3 md:flex-row md:items-center md:justify-between"
                    >
                      <span className="font-semibold text-slate-700">{field.label}</span>
                      <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        {field.locked ? "Automatico / fijo" : field.required ? "Obligatorio" : "Opcional"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedTemplate.nota && (
                <p className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium leading-6 text-slate-600">
                  {selectedTemplate.nota}
                </p>
              )}
            </div>

            <aside className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                {selectedTemplate.period === "monthly"
                  ? "Avance del mes"
                  : selectedTemplate.period === "weekly"
                    ? "Avance de la semana"
                    : "Avance de hoy"}
              </p>
              <p className="mt-2 text-4xl font-black text-[rgb(0,48,73)]">
                {selectedProgress.percent}%
              </p>
              <p className="mt-1 text-sm font-bold text-slate-500">
                {getProgressLabel(selectedTemplate, selectedProgress)}
              </p>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full rounded-full bg-[rgb(0,48,73)]"
                  style={{ width: `${selectedProgress.percent}%` }}
                />
              </div>

              <div className="mt-6">
                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Ultimos registros
                </h3>
                <div className="mt-3 grid gap-2">
                  {selectedRecords.slice(0, 3).map((record) => (
                    <div key={record.id} className="rounded-lg bg-white px-3 py-2">
                      <p className="text-sm font-bold text-slate-800">{getRecordTitle(record)}</p>
                      <p className="text-xs font-semibold text-slate-400">
                        {formatDateTime(record.fechaRegistro)}
                      </p>
                    </div>
                  ))}

                  {selectedRecords.length === 0 && (
                    <p className="text-sm font-medium text-slate-500">
                      Sin registros guardados.
                    </p>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
}

function FullPageForm({
  template,
  values,
  savedRecords,
  message,
  onBack,
  onValueChange,
  onClear,
  onSubmit,
}) {
  const isTableFormat = template.layout === "empaques-table";
  const isMonthlyChecklist = template.layout === "monthly-checklist";
  const isDailyTripTable = template.layout === "daily-trip-table";
  const isWeeklyPoes = template.layout === "weekly-poes";
  const isHydrationTest = template.layout === "hydration-test";
  const isTemperaturePcc = template.layout === "temperature-pcc";
  const isColdRoomsMonthly = template.layout === "cold-rooms-monthly";
  const isDispatchProductDaily = template.layout === "dispatch-product-daily";
  const isChlorineChillerDaily = template.layout === "chlorine-chiller-daily";
  const isVisceraTemperatureDaily = template.layout === "viscera-temperature-daily";
  const submitLabel = isMonthlyChecklist
    ? "Guardar dia"
    : isWeeklyPoes
      ? "Guardar semana"
    : isDailyTripTable
      ? "Guardar formato del dia"
    : isHydrationTest
      ? "Guardar formato del dia"
    : isTemperaturePcc
      ? "Guardar formato del dia"
    : isColdRoomsMonthly
      ? "Guardar formato mensual"
    : isDispatchProductDaily
      ? "Guardar formato del dia"
    : isChlorineChillerDaily
      ? "Guardar formato del dia"
    : isVisceraTemperatureDaily
      ? "Guardar formato del dia"
      : template.table?.saveLabel || "Guardar muestra";
  const clearLabel = isMonthlyChecklist
    ? "Limpiar dia"
    : isWeeklyPoes
      ? "Limpiar semana"
    : isDailyTripTable
      ? "Limpiar formato"
    : isHydrationTest
      ? "Limpiar formato"
    : isTemperaturePcc
      ? "Limpiar formato"
    : isColdRoomsMonthly
      ? "Limpiar formato"
    : isDispatchProductDaily
      ? "Limpiar formato"
    : isChlorineChillerDaily
      ? "Limpiar formato"
    : isVisceraTemperatureDaily
      ? "Limpiar formato"
      : template.table?.clearLabel || "Limpiar muestra";

  return (
    <div className="min-h-full bg-[#f8fafc] p-6 text-slate-800">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white px-6 py-5 shadow-sm md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[rgb(0,48,73)]">
              {template.codigo}
            </p>
            <h1 className="mt-1 text-3xl font-black text-slate-900">
              {template.nombre}
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              {template.descripcion}
            </p>
          </div>

          <button onClick={onBack} className="btn-secondary">
            Volver a formatos
          </button>
        </div>

        <form onSubmit={onSubmit} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-[180px_180px_1fr]">
            <ReadOnlyInfo label="Codigo" value={template.codigo} />
            <ReadOnlyInfo label="Version" value={template.version || "1"} />
            <ReadOnlyInfo label="Fecha de elaboracion" value={template.fechaElaboracion || "No definida"} />
          </div>

          {isMonthlyChecklist ? (
            <MonthlyChecklistForm
              template={template}
              values={values}
              savedRecords={savedRecords}
              onValueChange={onValueChange}
            />
          ) : isWeeklyPoes ? (
            <WeeklyPoesForm
              template={template}
              values={values}
              savedRecords={savedRecords}
              onValueChange={onValueChange}
            />
          ) : isDailyTripTable ? (
            <DailyTripForm
              template={template}
              values={values}
              savedRecords={savedRecords}
              onValueChange={onValueChange}
            />
          ) : isHydrationTest ? (
            <HydrationTestForm
              template={template}
              values={values}
              savedRecords={savedRecords}
              onValueChange={onValueChange}
            />
          ) : isTemperaturePcc ? (
            <TemperaturePccForm
              template={template}
              values={values}
              savedRecords={savedRecords}
              onValueChange={onValueChange}
            />
          ) : isColdRoomsMonthly ? (
            <ColdRoomsMonthlyForm
              template={template}
              values={values}
              savedRecords={savedRecords}
              onValueChange={onValueChange}
            />
          ) : isDispatchProductDaily ? (
            <DispatchProductForm
              template={template}
              values={values}
              savedRecords={savedRecords}
              onValueChange={onValueChange}
            />
          ) : isChlorineChillerDaily ? (
            <ChlorineChillerForm
              template={template}
              values={values}
              savedRecords={savedRecords}
              onValueChange={onValueChange}
            />
          ) : isVisceraTemperatureDaily ? (
            <VisceraTemperatureForm
              template={template}
              values={values}
              savedRecords={savedRecords}
              onValueChange={onValueChange}
            />
          ) : isTableFormat ? (
            <EmpaquesTableForm
              template={template}
              rows={values[template.table.valueKey] || []}
              savedRecords={savedRecords}
              onRowsChange={(rows) => onValueChange(template.table.valueKey, rows)}
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {(template.fields || []).map((field) => (
                <FieldControl
                  key={field.id}
                  field={field}
                  value={values[field.id] || ""}
                  onChange={(value) => onValueChange(field.id, value)}
                />
              ))}
            </div>
          )}

          {template.nota && (
            <p className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium leading-6 text-slate-600">
              {template.nota}
            </p>
          )}

          {message && (
            <p className="mt-5 rounded-lg bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600">
              {message}
            </p>
          )}

          <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button type="button" onClick={onClear} className="btn-secondary">
              {clearLabel}
            </button>
            <button type="submit" className="btn-primary">
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MonthlyChecklistForm({ template, values, savedRecords, onValueChange }) {
  const savedDays = savedRecords
    .map((record) => ({
      id: record.id,
      day: record.day || record.values?.day,
      mes: record.values?.mes,
      autoridadInvima: record.values?.autoridadInvima,
      verifico: record.values?.verifico,
      desinfectante: record.values?.desinfectante,
      concentracion: record.values?.concentracion,
      horaLiberacion: record.values?.horaLiberacion,
      horaInicioProceso: record.values?.horaInicioProceso,
      savedAt: record.fechaRegistro,
      completed: getFilledCheckCount(template, record.values?.checks || {}),
    }))
    .sort((a, b) => Number(a.day) - Number(b.day));

  const updateCheck = (itemId, value) => {
    onValueChange("checks", {
      ...(values.checks || {}),
      [itemId]: value,
    });
  };

  const updateAction = (index, fieldId, value) => {
    const actions = [...(values.actions || [])];
    actions[index] = { ...actions[index], [fieldId]: value };
    onValueChange("actions", actions);
  };

  const addAction = () => {
    const nextAction = Object.fromEntries(
      template.actionFields.map((field) => [field.id, field.id === "fecha" ? values.monthKey ? `${values.monthKey}-${String(values.day).padStart(2, "0")}` : "" : ""])
    );

    onValueChange("actions", [...(values.actions || []), nextAction]);
  };

  const removeAction = (index) => {
    onValueChange(
      "actions",
      (values.actions || []).filter((_, actionIndex) => actionIndex !== index)
    );
  };

  return (
    <div className="grid gap-5">
      <section className="rounded-xl border border-slate-200">
        <div className="grid gap-4 border-b border-slate-100 bg-slate-50 p-5 sm:grid-cols-2 lg:grid-cols-[180px_140px_1fr]">
          <ReadOnlyInfo label="Fecha" value={values.fecha} />
          <ReadOnlyInfo label="Dia" value={values.day} />
          <ReadOnlyInfo label="Periodo" value={values.monthKey} />
        </div>

        <div className="grid gap-4 p-5 xl:grid-cols-2">
          {template.checklist.map((group) => (
            <div key={group.zone} className="rounded-xl border border-slate-200 bg-white">
              <div className="border-b border-slate-100 px-4 py-3">
                <h2 className="text-sm font-black uppercase tracking-wide text-slate-700">
                  {group.zone}
                </h2>
              </div>
              <div className="divide-y divide-slate-100">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className="grid gap-3 px-4 py-3 sm:grid-cols-[1fr_140px]"
                  >
                    <p className="text-sm font-semibold text-slate-700">{item.label}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {template.markOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateCheck(item.id, option)}
                          className={`h-10 rounded-lg border text-sm font-black transition ${
                            values.checks?.[item.id] === option
                              ? "border-[rgb(0,48,73)] bg-[rgb(0,48,73)] text-white"
                              : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200">
        <div className="border-b border-slate-100 bg-white px-5 py-4">
          <h2 className="text-lg font-black text-slate-900">Datos del dia</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Corresponde al bloque que aparece desde MES hacia abajo en el formato.
          </p>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
          {template.dailyFields.map((field) => (
            <DailyField
              key={field.id}
              field={field}
              value={values[field.id] || ""}
              onChange={(value) => onValueChange(field.id, value)}
            />
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200">
        <div className="flex flex-col gap-3 border-b border-slate-100 bg-white px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">Acciones correctivas</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Agrega una accion cuando haya una inconformidad en el pre-operativo.
            </p>
          </div>
          <button type="button" onClick={addAction} className="btn-secondary">
            Agregar accion
          </button>
        </div>

        <div className="grid gap-4 p-5">
          {(values.actions || []).map((action, index) => (
            <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="grid gap-4 lg:grid-cols-[160px_1fr_1fr_220px_90px]">
                {template.actionFields.map((field) => (
                  <ActionField
                    key={field.id}
                    field={field}
                    value={action[field.id] || ""}
                    onChange={(value) => updateAction(index, field.id, value)}
                  />
                ))}
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeAction(index)}
                    className="h-12 rounded-lg border border-slate-200 px-4 text-sm font-bold text-slate-500 transition hover:bg-white"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            </div>
          ))}

          {(values.actions || []).length === 0 && (
            <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm font-medium text-slate-500">
              Sin acciones correctivas para este dia.
            </p>
          )}
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200">
        <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
          <h2 className="text-lg font-black text-slate-900">Dias guardados este mes</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Estos dias se van uniendo en el mismo formato mensual.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-white text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">Dia</th>
                <th className="px-4 py-3 text-left">Mes</th>
                <th className="px-4 py-3 text-left">Autoridad INVIMA</th>
                <th className="px-4 py-3 text-left">Items</th>
                <th className="px-4 py-3 text-left">Verifico</th>
                <th className="px-4 py-3 text-left">Desinfectante</th>
                <th className="px-4 py-3 text-left">Guardado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {savedDays.map((day) => (
                <tr key={day.id}>
                  <td className="px-4 py-3 font-black text-slate-700">{day.day}</td>
                  <td className="px-4 py-3 text-slate-600">{day.mes}</td>
                  <td className="px-4 py-3 text-slate-600">{day.autoridadInvima}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {day.completed}/{getTemplateFields(template).length}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{day.verifico}</td>
                  <td className="px-4 py-3 text-slate-600">{day.desinfectante}</td>
                  <td className="px-4 py-3 text-slate-500">{formatDateTime(day.savedAt)}</td>
                </tr>
              ))}

              {savedDays.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center">
                    <p className="font-bold text-slate-700">Aun no hay dias guardados este mes</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Guarda el primer dia para iniciar el formato mensual.
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

function WeeklyPoesForm({ template, values, savedRecords, onValueChange }) {
  const actions = values[template.actionTable.valueKey] || [];
  const savedWeek = savedRecords.find((record) => record.periodKey === getWeekPeriodKey(values.periodoDesde || undefined));
  const updateItem = (itemId, nextValue) => {
    onValueChange("items", {
      ...(values.items || {}),
      [itemId]: {
        ...(values.items?.[itemId] || {}),
        ...nextValue,
      },
    });
  };

  const updateItemField = (itemId, fieldId, value) => {
    updateItem(itemId, { [fieldId]: value });
  };

  const updateControl = (itemId, dayId, controlIndex, fieldId, value) => {
    const item = values.items?.[itemId] || {};
    const controls = item.controles?.[dayId] || [];
    const nextControls = controls.map((control, index) =>
      index === controlIndex ? { ...control, [fieldId]: value } : control
    );

    updateItem(itemId, {
      controles: {
        ...(item.controles || {}),
        [dayId]: nextControls,
      },
    });
  };

  const addControl = (itemId, dayId) => {
    const item = values.items?.[itemId] || {};
    const controls = item.controles?.[dayId] || [];

    updateItem(itemId, {
      controles: {
        ...(item.controles || {}),
        [dayId]: [...controls, { hora: "", estado: "" }],
      },
    });
  };

  const removeControl = (itemId, dayId, controlIndex) => {
    const item = values.items?.[itemId] || {};
    const controls = item.controles?.[dayId] || [];

    updateItem(itemId, {
      controles: {
        ...(item.controles || {}),
        [dayId]: controls.filter((_, index) => index !== controlIndex),
      },
    });
  };

  const updateStartTime = (dayId, value) => {
    onValueChange("horasInicio", {
      ...(values.horasInicio || {}),
      [dayId]: value,
    });
  };

  const updateAreaResponsible = (areaId, fieldId, value) => {
    onValueChange("areaResponsables", {
      ...(values.areaResponsables || {}),
      [areaId]: {
        ...(values.areaResponsables?.[areaId] || {}),
        [fieldId]: value,
      },
    });
  };

  return (
    <div className="grid gap-5">
      <section className="rounded-xl border border-slate-200">
        <div className="border-b border-slate-100 bg-white px-5 py-4">
          <h2 className="text-lg font-black text-slate-900">Periodo semanal</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Este bloque reemplaza la fecha: Semana del ___ al ___ de ___.
          </p>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-3">
          <div>
            <label className="label">
              Del <span className="ml-1 text-red-500">*</span>
            </label>
            <input
              type="date"
              value={values.periodoDesde || ""}
              onChange={(event) => onValueChange("periodoDesde", event.target.value)}
              className="input-pro bg-white"
            />
          </div>
          <div>
            <label className="label">
              Al <span className="ml-1 text-red-500">*</span>
            </label>
            <input
              type="date"
              value={values.periodoHasta || ""}
              onChange={(event) => onValueChange("periodoHasta", event.target.value)}
              className="input-pro bg-white"
            />
          </div>
          <div>
            <label className="label">
              De <span className="ml-1 text-red-500">*</span>
            </label>
            <input
              value={values.periodoMes || ""}
              onChange={(event) => onValueChange("periodoMes", event.target.value)}
              className="input-pro bg-white"
              placeholder="Mes"
            />
          </div>
        </div>

        <div className="border-t border-slate-100 p-5">
          <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-500">
            Hora inicio proceso
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {template.days.map((day) => (
              <div key={day.id}>
                <label className="label">{day.label}</label>
                <input
                  type="time"
                  value={values.horasInicio?.[day.id] || ""}
                  onChange={(event) => updateStartTime(day.id, event.target.value)}
                  className="input-pro bg-white"
                />
              </div>
            ))}
          </div>
        </div>

        {savedWeek && (
          <p className="mx-5 mb-5 rounded-lg bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600">
            Ya existe un formato guardado para esta semana. Al guardar se actualizara.
          </p>
        )}
      </section>

      {template.weeklyAreas.map((area) => (
        <section key={area.id} className="rounded-xl border border-slate-200">
          <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
            <h2 className="text-lg font-black text-slate-900">{area.label}</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Diligencia principio activo, concentracion, tipo de aplicacion y controles por dia.
            </p>
          </div>

          <div className="grid gap-5 p-5">
            <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-2">
              <div>
                <label className="label">
                  Realizado por <span className="ml-1 text-red-500">*</span>
                </label>
                <input
                  value={values.areaResponsables?.[area.id]?.realizadoPor || values.realizadoPor || ""}
                  onChange={(event) =>
                    updateAreaResponsible(area.id, "realizadoPor", event.target.value)
                  }
                  className="input-pro bg-white"
                  placeholder={`Responsable de ${area.label}`}
                />
              </div>
              <div>
                <label className="label">
                  Verificado por <span className="ml-1 text-red-500">*</span>
                </label>
                <select
                  value={values.areaResponsables?.[area.id]?.verificadoPor || values.verificadoPor || ""}
                  onChange={(event) =>
                    updateAreaResponsible(area.id, "verificadoPor", event.target.value)
                  }
                  className="input-pro bg-white"
                >
                  <option value="">Seleccione</option>
                  {template.verifierOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {area.blocks.map((block) => (
              <div key={block.id} className="grid gap-4">
                <h3 className="text-sm font-black uppercase tracking-wide text-slate-500">
                  {block.label}
                </h3>
                {block.items.map((item) => (
                  <WeeklyPoesItem
                    key={item.id}
                    item={item}
                    days={template.days}
                    value={values.items?.[item.id] || {}}
                    onFieldChange={(fieldId, value) => updateItemField(item.id, fieldId, value)}
                    onControlChange={(dayId, controlIndex, fieldId, value) =>
                      updateControl(item.id, dayId, controlIndex, fieldId, value)
                    }
                    onAddControl={(dayId) => addControl(item.id, dayId)}
                    onRemoveControl={(dayId, controlIndex) =>
                      removeControl(item.id, dayId, controlIndex)
                    }
                  />
                ))}
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="rounded-xl border border-slate-200">
        <DynamicRowsTable
          title={template.actionTable.title}
          help={template.actionTable.help}
          columns={template.actionTable.columns}
          rows={actions}
          emptyText="Sin acciones correctivas registradas para esta semana."
          addLabel="Agregar accion"
          removeLabel="Quitar"
          onRowsChange={(rows) => onValueChange(template.actionTable.valueKey, rows)}
        />
      </section>
    </div>
  );
}

function WeeklyPoesItem({
  item,
  days,
  value,
  onFieldChange,
  onControlChange,
  onAddControl,
  onRemoveControl,
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-3">
        <h4 className="font-black text-slate-900">{item.label}</h4>
      </div>

      <div className="grid gap-4 border-b border-slate-100 bg-slate-50 p-4 md:grid-cols-3">
        <div>
          <label className="label">Principio activo</label>
          <input
            value={value.principioActivo || ""}
            onChange={(event) => onFieldChange("principioActivo", event.target.value)}
            className="input-pro bg-white"
          />
        </div>
        <div>
          <label className="label">Concent.</label>
          <input
            value={value.concentracion || ""}
            onChange={(event) => onFieldChange("concentracion", event.target.value)}
            className="input-pro bg-white"
          />
        </div>
        <div>
          <label className="label">Inmersion / Aspersion</label>
          <input
            value={value.aplicacion || ""}
            onChange={(event) => onFieldChange("aplicacion", event.target.value)}
            className="input-pro bg-white"
          />
        </div>
      </div>

      <div className="grid gap-3 p-4 lg:grid-cols-3 xl:grid-cols-6">
        {days.map((day) => {
          const controls = value.controles?.[day.id] || [];

          return (
            <div key={day.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-black text-slate-700">{day.label}</p>
                <button
                  type="button"
                  onClick={() => onAddControl(day.id)}
                  className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-500 transition hover:bg-slate-100"
                >
                  Agregar
                </button>
              </div>

              <div className="grid gap-2">
                {controls.map((control, index) => (
                  <div key={index} className="rounded-lg bg-white p-2">
                    <div className="grid gap-2">
                      <input
                        type="time"
                        value={control.hora || ""}
                        onChange={(event) =>
                          onControlChange(day.id, index, "hora", event.target.value)
                        }
                        className="input-pro h-10 bg-white text-sm"
                      />
                      <select
                        value={control.estado || ""}
                        onChange={(event) =>
                          onControlChange(day.id, index, "estado", event.target.value)
                        }
                        className="input-pro h-10 bg-white text-sm"
                      >
                        <option value="">C/NC</option>
                        <option value="C">C</option>
                        <option value="NC">NC</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => onRemoveControl(day.id, index)}
                        className="rounded-md border border-slate-200 px-2 py-1 text-xs font-bold text-slate-400 transition hover:bg-slate-50"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ))}

                {controls.length === 0 && (
                  <p className="rounded-lg bg-white px-3 py-4 text-center text-xs font-semibold text-slate-400">
                    Sin controles.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DailyTripForm({ template, values, savedRecords, onValueChange }) {
  const trips = values[template.tripTable.valueKey] || [];
  const actions = values[template.actionTable.valueKey] || [];
  const savedToday = savedRecords.find(
    (record) => (record.dayKey || record.values?.fecha) === values.fecha
  );

  const updateRows = (key, rows) => {
    onValueChange(key, rows);
  };

  return (
    <div className="grid gap-5">
      <section className="rounded-xl border border-slate-200">
        <div className="grid gap-4 border-b border-slate-100 bg-slate-50 p-5 sm:grid-cols-2 lg:grid-cols-[180px_1fr]">
          <ReadOnlyInfo label="Fecha" value={values.fecha} />
          <div className="flex items-end">
            <p className="rounded-lg bg-white px-4 py-3 text-sm font-bold text-slate-600">
              {savedToday
                ? "Ya existe un formato guardado para esta fecha. Al guardar se actualizara."
                : "Este formato se guarda completo al finalizar el dia."}
            </p>
          </div>
        </div>

        <DynamicRowsTable
          title={template.tripTable.title}
          help={template.tripTable.help}
          columns={template.tripTable.columns}
          rows={trips}
          emptyText="Agrega el primer viaje del dia."
          addLabel="Agregar viaje"
          removeLabel="Quitar"
          onRowsChange={(rows) => updateRows(template.tripTable.valueKey, rows)}
        />
      </section>

      <section className="rounded-xl border border-slate-200">
        <div className="border-b border-slate-100 bg-white px-5 py-4">
          <h2 className="text-lg font-black text-slate-900">Cierre del formato</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Completa observaciones y verificacion al finalizar el monitoreo.
          </p>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="label">Observaciones</label>
            <textarea
              value={values.observaciones || ""}
              onChange={(event) => onValueChange("observaciones", event.target.value)}
              className="input-pro min-h-28 resize-none bg-white"
              placeholder="Observaciones del dia"
            />
          </div>

          <div>
            <label className="label">
              Verificado por <span className="ml-1 text-red-500">*</span>
            </label>
            <select
              value={values.verificadoPor || ""}
              onChange={(event) => onValueChange("verificadoPor", event.target.value)}
              className="input-pro bg-white"
            >
              <option value="">Seleccione</option>
              {template.verifierOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200">
        <DynamicRowsTable
          title={template.actionTable.title}
          help={template.actionTable.help}
          columns={template.actionTable.columns}
          rows={actions}
          emptyText="Sin acciones correctivas registradas para este dia."
          addLabel="Agregar accion"
          removeLabel="Quitar"
          compact
          onRowsChange={(rows) => updateRows(template.actionTable.valueKey, rows)}
        />
      </section>

      <GuideTable guide={template.guide} />
    </div>
  );
}

function ColdRoomsMonthlyForm({ template, values, savedRecords, onValueChange }) {
  const controls = values[template.monitorTable.valueKey] || [];
  const actions = values[template.actionTable.valueKey] || [];
  const savedMonth = savedRecords.find(
    (record) => (record.periodKey || record.values?.monthKey) === values.monthKey
  );
  const savedDays = new Set(controls.map((row) => row.fecha).filter(Boolean)).size;

  const updateRows = (key, rows) => {
    onValueChange(key, rows);
  };

  return (
    <div className="grid min-w-0 grid-cols-1 gap-5">
      <section className="rounded-xl border border-slate-200">
        <div className="grid gap-4 border-b border-slate-100 bg-slate-50 p-5 sm:grid-cols-2 lg:grid-cols-[180px_180px_1fr]">
          <ReadOnlyInfo label="Periodo" value={values.monthKey} />
          <ReadOnlyInfo label="Dias con control" value={savedDays} />
          <div className="flex items-end">
            <p className="rounded-lg bg-white px-4 py-3 text-sm font-bold text-slate-600">
              {savedMonth
                ? "Ya existe un formato guardado para este mes. Se cargo para continuar agregando controles."
                : "Este formato se va consolidando durante todo el mes."}
            </p>
          </div>
        </div>

        <ColdRoomsControlsEditor
          columns={template.monitorTable.columns}
          rows={controls}
          onRowsChange={(rows) => updateRows(template.monitorTable.valueKey, rows)}
        />
      </section>

      <section className="rounded-xl border border-slate-200">
        <DynamicRowsTable
          title={template.actionTable.title}
          help={template.actionTable.help}
          columns={template.actionTable.columns}
          rows={actions}
          emptyText="Sin acciones correctivas registradas para este mes."
          addLabel="Agregar accion"
          removeLabel="Quitar"
          compact
          onRowsChange={(rows) => updateRows(template.actionTable.valueKey, rows)}
        />
      </section>

      <GuideTable guide={template.guide} />
    </div>
  );
}

function ColdRoomsControlsEditor({ columns, rows, onRowsChange }) {
  const columnById = Object.fromEntries(columns.map((column) => [column.id, column]));
  const roomColumns = ["temperaturaCuarto1", "temperaturaCuarto2"]
    .map((id) => columnById[id])
    .filter(Boolean);
  const productColumns = columns.filter((column) => column.id.startsWith("productoT"));

  const updateRow = (rowIndex, columnId, value) => {
    onRowsChange(
      rows.map((row, index) =>
        index === rowIndex ? { ...row, [columnId]: value } : row
      )
    );
  };

  const addRow = () => {
    onRowsChange([...rows, createInitialDynamicRow(columns)]);
  };

  const removeRow = (rowIndex) => {
    onRowsChange(rows.filter((_, index) => index !== rowIndex));
  };

  return (
    <div className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-100 bg-white px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900">Controles de temperatura</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Agrega cada control realizado durante el mes. Puedes registrar mas de dos en un dia.
          </p>
        </div>
        <button type="button" onClick={addRow} className="btn-secondary">
          Agregar control
        </button>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 p-5">
        {rows.map((row, rowIndex) => (
          <article key={rowIndex} className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[rgb(0,48,73)] text-sm font-black text-white">
                  {rowIndex + 1}
                </span>
                <div>
                  <h3 className="font-black text-slate-900">Control {rowIndex + 1}</h3>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Cuartos frios
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeRow(rowIndex)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-100"
              >
                Quitar
              </button>
            </div>

            <div
              className="grid min-w-0 gap-3"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 190px), 1fr))" }}
            >
              {["fecha", "hora", "responsable"].map((fieldId) => (
                <ColdRoomField
                  key={fieldId}
                  column={columnById[fieldId]}
                  value={row[fieldId] || ""}
                  onChange={(value) => updateRow(rowIndex, fieldId, value)}
                />
              ))}
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[260px_1fr]">
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="mb-3 text-xs font-black uppercase tracking-wide text-slate-400">
                  Temperatura ambiente
                </p>
                <div className="grid gap-3">
                  {roomColumns.map((column) => (
                    <ColdRoomField
                      key={column.id}
                      column={column}
                      value={row[column.id] || ""}
                      onChange={(value) => updateRow(rowIndex, column.id, value)}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="mb-3 text-xs font-black uppercase tracking-wide text-slate-400">
                  Temperatura de producto
                </p>
                <div
                  className="grid min-w-0 gap-2"
                  style={{ gridTemplateColumns: "repeat(auto-fit, minmax(88px, 1fr))" }}
                >
                  {productColumns.map((column) => (
                    <ColdRoomField
                      key={column.id}
                      column={column}
                      value={row[column.id] || ""}
                      onChange={(value) => updateRow(rowIndex, column.id, value)}
                      dense
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <ColdRoomField
                column={columnById.observaciones}
                value={row.observaciones || ""}
                onChange={(value) => updateRow(rowIndex, "observaciones", value)}
              />
            </div>
          </article>
        ))}

        {rows.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
            <p className="font-bold text-slate-700">Sin controles registrados.</p>
            <p className="mt-1 text-sm text-slate-500">
              Usa Agregar control para iniciar el formato mensual.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ColdRoomField({ column, value, onChange, dense = false }) {
  if (!column) return null;

  const inputClass = dense ? "input-pro h-10 bg-white text-sm" : "input-pro bg-white";

  return (
    <div>
      <label className="label">
        {column.label}
        {column.required && !column.locked && <span className="ml-1 text-red-500">*</span>}
      </label>
      {column.locked ? (
        <div className="flex h-11 items-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700">
          {value}
        </div>
      ) : column.type === "textarea" ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="input-pro min-h-24 resize-none bg-white"
          placeholder={column.label}
        />
      ) : (
        <input
          type={column.type}
          step={column.step}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={inputClass}
          placeholder={column.label}
        />
      )}
    </div>
  );
}

function DispatchProductForm({ template, values, savedRecords, onValueChange }) {
  const dispatches = values[template.dispatchTable.valueKey] || [];
  const actions = values[template.actionTable.valueKey] || [];
  const savedToday = savedRecords.find(
    (record) => (record.dayKey || record.values?.fecha) === values.fecha
  );

  return (
    <div className="grid min-w-0 grid-cols-1 gap-5">
      <section className="rounded-xl border border-slate-200">
        <div className="grid gap-4 border-b border-slate-100 bg-slate-50 p-5 sm:grid-cols-2 lg:grid-cols-[180px_180px_1fr]">
          <ReadOnlyInfo label="Fecha" value={values.fecha} />
          <ReadOnlyInfo label="Despachos" value={dispatches.length} />
          <div className="flex items-end">
            <p className="rounded-lg bg-white px-4 py-3 text-sm font-bold text-slate-600">
              {savedToday
                ? "Ya existe un formato guardado para esta fecha. Se cargo para continuar editandolo."
                : "Este formato se guarda completo al cerrar el dia."}
            </p>
          </div>
        </div>

        <DispatchRowsEditor
          template={template}
          columns={template.dispatchTable.columns}
          rows={dispatches}
          onRowsChange={(rows) => onValueChange(template.dispatchTable.valueKey, rows)}
        />
      </section>

      <section className="rounded-xl border border-slate-200">
        <div className="border-b border-slate-100 bg-white px-5 py-4">
          <h2 className="text-lg font-black text-slate-900">Cierre del formato</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Completa observaciones y verificacion al finalizar los despachos del dia.
          </p>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="label">Observaciones</label>
            <textarea
              value={values.observaciones || ""}
              onChange={(event) => onValueChange("observaciones", event.target.value)}
              className="input-pro min-h-28 resize-none bg-white"
              placeholder="Observaciones del dia"
            />
          </div>

          <div>
            <label className="label">Verificado por</label>
            <input
              value={values.verificadoPor || ""}
              onChange={(event) => onValueChange("verificadoPor", event.target.value)}
              className="input-pro bg-white"
              placeholder="Nombre de quien verifica"
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200">
        <DynamicRowsTable
          title={template.actionTable.title}
          help={template.actionTable.help}
          columns={template.actionTable.columns}
          rows={actions}
          emptyText="Sin acciones correctivas registradas para este dia."
          addLabel="Agregar accion"
          removeLabel="Quitar"
          compact
          onRowsChange={(rows) => onValueChange(template.actionTable.valueKey, rows)}
        />
      </section>

      <GuideTable guide={template.guide} />
    </div>
  );
}

function DispatchRowsEditor({ template, columns, rows, onRowsChange }) {
  const columnById = Object.fromEntries(columns.map((column) => [column.id, column]));
  const temperatureFields = [
    "temperaturaT1",
    "temperaturaT2",
    "temperaturaT3",
    "temperaturaT4",
    "temperaturaT5",
  ];
  const packageFields = ["sinTrazabilidad", "rupturas", "malSellado"];
  const basketFields = ["canastillaLimpieza", "canastillaAveriada"];
  const vehicleFields = [
    "numeroPlaca",
    "limpiezaDesinfeccion",
    "temperaturaFurgonVisor",
    "temperaturaFurgonTermometro",
    "temperaturaAmbienteDespachos",
    "responsable",
    "auxiliarCalidad",
  ];

  const updateRow = (rowIndex, columnId, value) => {
    onRowsChange(
      rows.map((row, index) =>
        index === rowIndex ? { ...row, [columnId]: value } : row
      )
    );
  };

  const addRow = () => {
    onRowsChange([...rows, createInitialDynamicRow(columns)]);
  };

  const removeRow = (rowIndex) => {
    onRowsChange(rows.filter((_, index) => index !== rowIndex));
  };

  return (
    <div className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-100 bg-white px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900">{template.dispatchTable.title}</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {template.dispatchTable.help}
          </p>
        </div>
        <button type="button" onClick={addRow} className="btn-secondary">
          Agregar despacho
        </button>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 p-5">
        {rows.map((row, rowIndex) => (
          <article key={rowIndex} className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[rgb(0,48,73)] text-sm font-black text-white">
                  {rowIndex + 1}
                </span>
                <div>
                  <h3 className="font-black text-slate-900">Despacho {rowIndex + 1}</h3>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Producto despachado
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeRow(rowIndex)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-100"
              >
                Quitar
              </button>
            </div>

            <div
              className="grid min-w-0 gap-3"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 190px), 1fr))" }}
            >
              {[
                "fecha",
                "hora",
                "referenciaProducto",
                "destinoProducto",
                "lote",
                "fechaVencimiento",
              ].map((fieldId) => (
                <DispatchField
                  key={fieldId}
                  column={columnById[fieldId]}
                  value={row[fieldId] || ""}
                  options={template.markOptions}
                  onChange={(value) => updateRow(rowIndex, fieldId, value)}
                />
              ))}
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_330px]">
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="mb-3 text-xs font-black uppercase tracking-wide text-slate-400">
                  Temperatura de producto
                </p>
                <div
                  className="grid min-w-0 gap-2"
                  style={{ gridTemplateColumns: "repeat(auto-fit, minmax(84px, 1fr))" }}
                >
                  {temperatureFields.map((fieldId) => (
                    <DispatchField
                      key={fieldId}
                      column={columnById[fieldId]}
                      value={row[fieldId] || ""}
                      options={template.markOptions}
                      dense
                      onChange={(value) => updateRow(rowIndex, fieldId, value)}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="mb-3 text-xs font-black uppercase tracking-wide text-slate-400">
                  Empaque y canastilla
                </p>
                <div className="grid gap-3">
                  {[...packageFields, ...basketFields].map((fieldId) => (
                    <DispatchField
                      key={fieldId}
                      column={columnById[fieldId]}
                      value={row[fieldId] || ""}
                      options={template.markOptions}
                      onChange={(value) => updateRow(rowIndex, fieldId, value)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3">
              <p className="mb-3 text-xs font-black uppercase tracking-wide text-slate-400">
                Condiciones del vehiculo
              </p>
              <div
                className="grid min-w-0 gap-3"
                style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 190px), 1fr))" }}
              >
                {vehicleFields.map((fieldId) => (
                  <DispatchField
                    key={fieldId}
                    column={columnById[fieldId]}
                    value={row[fieldId] || ""}
                    options={template.markOptions}
                    onChange={(value) => updateRow(rowIndex, fieldId, value)}
                  />
                ))}
              </div>
            </div>
          </article>
        ))}

        {rows.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
            <p className="font-bold text-slate-700">Sin despachos registrados.</p>
            <p className="mt-1 text-sm text-slate-500">
              Usa Agregar despacho para iniciar el formato del dia.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function DispatchField({ column, value, onChange, options = [], dense = false }) {
  if (!column) return null;

  const inputClass = dense ? "input-pro h-10 bg-white text-sm" : "input-pro bg-white";

  return (
    <div>
      <label className="label">
        {column.label}
        {column.required && !column.locked && <span className="ml-1 text-red-500">*</span>}
      </label>
      {column.locked ? (
        <div className="flex h-11 items-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700">
          {value}
        </div>
      ) : column.type === "mark" ? (
        <div className="grid grid-cols-2 gap-2">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onChange(value === option ? "" : option)}
              className={`h-10 rounded-lg border text-sm font-black transition ${
                value === option
                  ? "border-[rgb(0,48,73)] bg-[rgb(0,48,73)] text-white"
                  : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      ) : column.type === "textarea" ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="input-pro min-h-24 resize-none bg-white"
          placeholder={column.label}
        />
      ) : (
        <input
          type={column.type}
          step={column.step}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={inputClass}
          placeholder={column.label}
        />
      )}
    </div>
  );
}

function ChlorineChillerForm({ template, values, savedRecords, onValueChange }) {
  const controls = values[template.chlorineTable.valueKey] || [];
  const savedToday = savedRecords.find(
    (record) => (record.dayKey || record.values?.loteProceso) === values.loteProceso
  );
  const verifierField = (template.fields || []).find((field) => field.id === "verifica");

  return (
    <div className="grid min-w-0 grid-cols-1 gap-5">
      <section className="rounded-xl border border-slate-200">
        <div className="grid gap-4 border-b border-slate-100 bg-slate-50 p-5 sm:grid-cols-2 lg:grid-cols-[180px_180px_1fr]">
          <ReadOnlyInfo label="Lote proceso" value={values.loteProceso} />
          <ReadOnlyInfo label="Controles" value={controls.length} />
          <div className="flex items-end">
            <p className="rounded-lg bg-white px-4 py-3 text-sm font-bold text-slate-600">
              {savedToday
                ? "Ya existe un formato guardado para esta fecha. Se cargo para continuar editandolo."
                : "Este formato se guarda completo al cerrar el dia."}
            </p>
          </div>
        </div>

        <ChlorineControlsEditor
          template={template}
          columns={template.chlorineTable.columns}
          rows={controls}
          onRowsChange={(rows) => onValueChange(template.chlorineTable.valueKey, rows)}
        />
      </section>

      <section className="rounded-xl border border-slate-200">
        <div className="border-b border-slate-100 bg-white px-5 py-4">
          <h2 className="text-lg font-black text-slate-900">Cierre del formato</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Selecciona quien verifica el formato al terminar los controles del dia.
          </p>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2">
          <FieldControl
            field={verifierField}
            value={values.verifica || ""}
            onChange={(value) => onValueChange("verifica", value)}
          />
        </div>
      </section>

      <GuideTable guide={template.guide} />
    </div>
  );
}

function ChlorineControlsEditor({ template, columns, rows, onRowsChange }) {
  const columnById = Object.fromEntries(columns.map((column) => [column.id, column]));
  const prechillerFields = ["dosificacionPrechiller", "ppmPrechiller"];
  const chillerFields = ["dosificacionChiller", "ppmChiller"];
  const closureFields = ["noConformidad", "accionesCorrectivas", "observaciones", "monitoreadoPor"];

  const updateRow = (rowIndex, columnId, value) => {
    onRowsChange(
      rows.map((row, index) =>
        index === rowIndex ? { ...row, [columnId]: value } : row
      )
    );
  };

  const addRow = () => {
    onRowsChange([...rows, createInitialDynamicRow(columns)]);
  };

  const removeRow = (rowIndex) => {
    onRowsChange(rows.filter((_, index) => index !== rowIndex));
  };

  return (
    <div className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-100 bg-white px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900">{template.chlorineTable.title}</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {template.chlorineTable.help}
          </p>
        </div>
        <button type="button" onClick={addRow} className="btn-secondary">
          Agregar control
        </button>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 p-5">
        {rows.map((row, rowIndex) => (
          <article key={rowIndex} className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[rgb(0,48,73)] text-sm font-black text-white">
                  {rowIndex + 1}
                </span>
                <div>
                  <h3 className="font-black text-slate-900">Control {rowIndex + 1}</h3>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Cloro residual en chiller
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeRow(rowIndex)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-100"
              >
                Quitar
              </button>
            </div>

            <div
              className="grid min-w-0 gap-3"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 190px), 1fr))" }}
            >
              <ChlorineField
                column={columnById.hora}
                value={row.hora || ""}
                onChange={(value) => updateRow(rowIndex, "hora", value)}
              />
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="mb-3 text-xs font-black uppercase tracking-wide text-slate-400">
                  Prechiller
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {prechillerFields.map((fieldId) => (
                    <ChlorineField
                      key={fieldId}
                      column={columnById[fieldId]}
                      value={row[fieldId] || ""}
                      onChange={(value) => updateRow(rowIndex, fieldId, value)}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="mb-3 text-xs font-black uppercase tracking-wide text-slate-400">
                  Chiller
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {chillerFields.map((fieldId) => (
                    <ChlorineField
                      key={fieldId}
                      column={columnById[fieldId]}
                      value={row[fieldId] || ""}
                      onChange={(value) => updateRow(rowIndex, fieldId, value)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div
              className="mt-4 grid min-w-0 gap-3"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))" }}
            >
              {closureFields.map((fieldId) => (
                <ChlorineField
                  key={fieldId}
                  column={columnById[fieldId]}
                  value={row[fieldId] || ""}
                  onChange={(value) => updateRow(rowIndex, fieldId, value)}
                  wide={columnById[fieldId]?.type === "textarea"}
                />
              ))}
            </div>
          </article>
        ))}

        {rows.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
            <p className="font-bold text-slate-700">Sin controles registrados.</p>
            <p className="mt-1 text-sm text-slate-500">
              Usa Agregar control para iniciar el formato del dia.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ChlorineField({ column, value, onChange, wide = false }) {
  if (!column) return null;

  return (
    <div className={wide ? "md:col-span-2" : ""}>
      <label className="label">
        {column.label}
        {column.required && !column.locked && <span className="ml-1 text-red-500">*</span>}
      </label>
      {column.locked ? (
        <div className="flex h-11 items-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700">
          {value}
        </div>
      ) : column.type === "textarea" ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="input-pro min-h-24 resize-none bg-white"
          placeholder={column.label}
        />
      ) : (
        <input
          type={column.type}
          step={column.step}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="input-pro bg-white"
          placeholder={column.label}
        />
      )}
    </div>
  );
}

function VisceraTemperatureForm({ template, values, savedRecords, onValueChange }) {
  const actions = values[template.actionTable.valueKey] || [];
  const savedToday = savedRecords.find(
    (record) => (record.dayKey || record.values?.loteProceso) === values.loteProceso
  );
  const verificadoField = (template.fields || []).find((field) => field.id === "verificadoPor");

  const totalSamples = (template.sections || []).reduce(
    (sum, section) => sum + (values[section.valueKey] || []).length,
    0
  );

  return (
    <div className="grid min-w-0 grid-cols-1 gap-5">
      <section className="rounded-xl border border-slate-200">
        <div className="grid gap-4 border-b border-slate-100 bg-slate-50 p-5 sm:grid-cols-2 lg:grid-cols-[180px_180px_1fr]">
          <ReadOnlyInfo label="Lote proceso" value={values.loteProceso} />
          <ReadOnlyInfo label="Muestreos" value={totalSamples} />
          <div className="flex items-end">
            <p className="rounded-lg bg-white px-4 py-3 text-sm font-bold text-slate-600">
              {savedToday
                ? "Ya existe un formato guardado para esta fecha. Se cargo para continuar editandolo."
                : "Este formato se guarda completo al cerrar el dia."}
            </p>
          </div>
        </div>

        <div className="grid gap-5 p-5">
          {template.sections.map((section) => (
            <VisceraTemperatureSection
              key={section.id}
              section={section}
              columns={template.temperatureColumns}
              rows={values[section.valueKey] || []}
              onRowsChange={(rows) => onValueChange(section.valueKey, rows)}
            />
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200">
        <div className="border-b border-slate-100 bg-white px-5 py-4">
          <h2 className="text-lg font-black text-slate-900">Cierre del formato</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Registra observaciones y selecciona quien verifica el formato del dia.
          </p>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="label">Observaciones</label>
            <textarea
              value={values.observaciones || ""}
              onChange={(event) => onValueChange("observaciones", event.target.value)}
              className="input-pro min-h-28 resize-none bg-white"
              placeholder="Observaciones del dia"
            />
          </div>

          <FieldControl
            field={verificadoField}
            value={values.verificadoPor || ""}
            onChange={(value) => onValueChange("verificadoPor", value)}
          />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200">
        <DynamicRowsTable
          title={template.actionTable.title}
          help={template.actionTable.help}
          columns={template.actionTable.columns}
          rows={actions}
          emptyText="Sin no conformidades ni acciones correctivas registradas para este dia."
          addLabel="Agregar accion"
          removeLabel="Quitar"
          compact
          onRowsChange={(rows) => onValueChange(template.actionTable.valueKey, rows)}
        />
      </section>

      <GuideTable guide={template.guide} />
    </div>
  );
}

function VisceraTemperatureSection({ section, columns, rows, onRowsChange }) {
  const columnById = Object.fromEntries(columns.map((column) => [column.id, column]));
  const temperatureFields = Array.from(
    { length: 10 },
    (_, index) => `temperaturaT${index + 1}`
  );
  const metaFields = [
    "temperaturaAguaChiller",
    "noConformidadCodigo",
    "accionesCorrectivasCodigo",
    "monitoreadoPor",
  ];

  const updateRow = (rowIndex, columnId, value) => {
    onRowsChange(
      rows.map((row, index) =>
        index === rowIndex ? { ...row, [columnId]: value } : row
      )
    );
  };

  const addRow = () => {
    onRowsChange([...rows, createInitialDynamicRow(columns)]);
  };

  const removeRow = (rowIndex) => {
    onRowsChange(rows.filter((_, index) => index !== rowIndex));
  };

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900">{section.label}</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {section.productHelp}. Agrega tantos muestreos como se realicen durante el dia.
          </p>
        </div>
        <button type="button" onClick={addRow} className="btn-secondary">
          Agregar muestreo
        </button>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 bg-slate-50 p-5">
        {rows.map((row, rowIndex) => (
          <article key={rowIndex} className="min-w-0 rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[rgb(0,48,73)] text-sm font-black text-white">
                  {rowIndex + 1}
                </span>
                <div>
                  <h3 className="font-black text-slate-900">Muestreo {rowIndex + 1}</h3>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    {section.label}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeRow(rowIndex)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-100"
              >
                Quitar
              </button>
            </div>

            <div
              className="grid min-w-0 gap-3"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 190px), 1fr))" }}
            >
              {["horaMuestreo", "tipoProducto"].map((fieldId) => (
                <VisceraTemperatureField
                  key={fieldId}
                  column={columnById[fieldId]}
                  value={row[fieldId] || ""}
                  onChange={(value) => updateRow(rowIndex, fieldId, value)}
                />
              ))}
            </div>

            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="mb-3 text-xs font-black uppercase tracking-wide text-slate-400">
                Temperatura de producto (maximo 4 C)
              </p>
              <div
                className="grid min-w-0 gap-2"
                style={{ gridTemplateColumns: "repeat(auto-fit, minmax(78px, 1fr))" }}
              >
                {temperatureFields.map((fieldId) => (
                  <VisceraTemperatureField
                    key={fieldId}
                    column={columnById[fieldId]}
                    value={row[fieldId] || ""}
                    onChange={(value) => updateRow(rowIndex, fieldId, value)}
                    dense
                  />
                ))}
              </div>
            </div>

            <div
              className="mt-4 grid min-w-0 gap-3"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 190px), 1fr))" }}
            >
              {metaFields.map((fieldId) => (
                <VisceraTemperatureField
                  key={fieldId}
                  column={columnById[fieldId]}
                  value={row[fieldId] || ""}
                  onChange={(value) => updateRow(rowIndex, fieldId, value)}
                />
              ))}
            </div>
          </article>
        ))}

        {rows.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
            <p className="font-bold text-slate-700">Sin muestreos registrados.</p>
            <p className="mt-1 text-sm text-slate-500">
              Usa Agregar muestreo para iniciar esta seccion.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function VisceraTemperatureField({ column, value, onChange, dense = false }) {
  if (!column) return null;

  const inputClass = dense ? "input-pro h-10 bg-white text-sm" : "input-pro bg-white";

  return (
    <div>
      <label className="label">
        {column.label}
        {column.required && !column.locked && <span className="ml-1 text-red-500">*</span>}
      </label>
      <input
        type={column.type}
        step={column.step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
        placeholder={column.label}
      />
    </div>
  );
}

function DynamicRowsTable({
  title,
  help,
  columns,
  rows,
  emptyText,
  addLabel,
  removeLabel,
  compact = false,
  onRowsChange,
}) {
  const updateRow = (rowIndex, columnId, value) => {
    onRowsChange(
      rows.map((row, index) =>
        index === rowIndex ? { ...row, [columnId]: value } : row
      )
    );
  };

  const addRow = () => {
    onRowsChange([...rows, createInitialDynamicRow(columns)]);
  };

  const removeRow = (rowIndex) => {
    onRowsChange(rows.filter((_, index) => index !== rowIndex));
  };

  return (
    <div className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-100 bg-white px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900">{title}</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">{help}</p>
        </div>
        <button type="button" onClick={addRow} className="btn-secondary">
          {addLabel}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className={`w-full text-sm ${compact ? "min-w-[760px]" : "min-w-[1500px]"}`}>
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="w-12 border-r border-slate-200 px-3 py-3 text-left">#</th>
              {columns.map((column) => (
                <th key={column.id} className="border-r border-slate-200 px-3 py-3 text-left">
                  {column.label}
                  {column.required && <span className="ml-1 text-red-500">*</span>}
                </th>
              ))}
              <th className="w-24 px-3 py-3 text-left">Accion</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="align-top">
                <td className="border-r border-slate-100 px-3 py-3 font-black text-slate-400">
                  {rowIndex + 1}
                </td>
                {columns.map((column) => (
                  <td key={column.id} className="border-r border-slate-100 px-3 py-3">
                    <TableCellControl
                      column={column}
                      value={row[column.id] || ""}
                      onChange={(value) => updateRow(rowIndex, column.id, value)}
                    />
                  </td>
                ))}
                <td className="px-3 py-3">
                  <button
                    type="button"
                    onClick={() => removeRow(rowIndex)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-50"
                  >
                    {removeLabel}
                  </button>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 2} className="px-5 py-10 text-center">
                  <p className="font-bold text-slate-700">{emptyText}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Usa el boton superior para agregar una fila.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GuideTable({ guide }) {
  const hasActionCode = guide.some((item) => item.codigoAccionCorrectiva);

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200">
      <div className="border-b border-slate-100 bg-white px-5 py-4">
        <h2 className="text-lg font-black text-slate-900">
          Tabla guia de no conformidades y acciones correctivas
        </h2>
        <p className="mt-1 text-sm font-medium text-slate-500">
          Usa estos codigos como apoyo para registrar las acciones correctivas.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-3 text-left">No conformidad</th>
              <th className="px-3 py-3 text-left">Codigo no conformidad</th>
              <th className="px-3 py-3 text-left">Accion correctiva a aplicar</th>
              {hasActionCode && (
                <th className="px-3 py-3 text-left">Codigo accion correctiva</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {guide.map((item) => (
              <tr key={item.codigoNoConformidad}>
                <td className="px-3 py-3 font-semibold text-slate-700">{item.noConformidad}</td>
                <td className="px-3 py-3 font-black text-slate-700">{item.codigoNoConformidad}</td>
                <td className="px-3 py-3 text-slate-600">{item.accionCorrectiva}</td>
                {hasActionCode && (
                  <td className="px-3 py-3 font-black text-slate-700">
                    {item.codigoAccionCorrectiva}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function HydrationTestForm({ template, values, savedRecords, onValueChange }) {
  const savedDay = savedRecords.find(
    (record) => (record.dayKey || record.values?.fecha) === values.fecha
  );
  const samples = values.muestras || [];
  const sampleFields = (template.sampleColumns || []).filter((column) => !column.locked);
  const fieldById = (fieldId) => template.fields.find((field) => field.id === fieldId);
  const updateSample = (rowIndex, fieldId, value) => {
    onValueChange(
      "muestras",
      samples.map((sample, index) =>
        index === rowIndex ? { ...sample, [fieldId]: value } : sample
      )
    );
  };

  const renderField = (fieldId) => {
    const field = fieldById(fieldId);
    if (!field) return null;

    return (
      <FieldControl
        key={field.id}
        field={field}
        value={values[field.id] || ""}
        onChange={(value) => onValueChange(field.id, value)}
      />
    );
  };

  return (
    <div className="grid gap-5">
      <section className="rounded-xl border border-slate-200">
        <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
          <h2 className="text-lg font-black text-slate-900">Datos generales</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            La fecha se toma automaticamente. Diligencia la granja y los datos del proceso.
          </p>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2 lg:grid-cols-4">
          <ReadOnlyInfo label="Fecha" value={values.fecha} />
          {renderField("granja")}
          {renderField("horaInicial")}
          {renderField("horaFinal")}
        </div>

        {savedDay && (
          <p className="mx-5 mb-5 rounded-lg bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600">
            Ya existe un formato guardado para este dia. Al guardar se actualizara.
          </p>
        )}
      </section>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <section className="overflow-hidden rounded-xl border border-slate-200">
          <div className="border-b border-slate-100 bg-white px-5 py-4">
            <h2 className="text-lg font-black text-slate-900">Muestras</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Registra peso inicial y peso final para las 10 muestras.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="w-24 border-r border-slate-200 px-3 py-3 text-left">
                    Muestra
                  </th>
                  {sampleFields.map((column) => (
                    <th key={column.id} className="border-r border-slate-200 px-3 py-3 text-left">
                      {column.label}
                      {column.required && <span className="ml-1 text-red-500">*</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {samples.map((sample, rowIndex) => (
                  <tr key={sample.numero} className="bg-white">
                    <td className="border-r border-slate-100 px-3 py-3 font-black text-slate-500">
                      {sample.numero}
                    </td>
                    {sampleFields.map((column) => (
                      <td key={column.id} className="border-r border-slate-100 px-3 py-3">
                        <TableCellControl
                          column={column}
                          value={sample[column.id] || ""}
                          onChange={(value) => updateSample(rowIndex, column.id, value)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200">
          <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
            <h2 className="text-lg font-black text-slate-900">Temperaturas</h2>
          </div>
          <div className="grid gap-4 p-5">
            {renderField("temperaturaPreChiller")}
            {renderField("temperaturaChiller")}
            {renderField("temperaturaIngresoCanales")}
            {renderField("temperaturaSalidaCanales")}
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-slate-200">
        <div className="border-b border-slate-100 bg-white px-5 py-4">
          <h2 className="text-lg font-black text-slate-900">Cierre del formato</h2>
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-4">
          {renderField("porcentajeHidratacion")}
          {renderField("viaje")}
          {renderField("responsable")}
          {renderField("verifico")}
          {renderField("observaciones")}
        </div>
      </section>
    </div>
  );
}

function TemperaturePccForm({ template, values, savedRecords, onValueChange }) {
  const savedDay = savedRecords.find(
    (record) => (record.dayKey || record.values?.fecha) === values.fecha
  );
  const measurements = values[template.monitorTable.valueKey] || [];
  const actions = values[template.actionTable.valueKey] || [];
  const fieldById = (fieldId) => template.fields.find((field) => field.id === fieldId);
  const renderField = (fieldId) => {
    const field = fieldById(fieldId);
    if (!field) return null;

    return (
      <FieldControl
        key={field.id}
        field={field}
        value={values[field.id] || ""}
        onChange={(value) => onValueChange(field.id, value)}
      />
    );
  };

  return (
    <div className="grid min-w-0 grid-cols-1 gap-5">
      <section className="grid min-w-0 grid-cols-1 gap-5">
        <div className="min-w-0 rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
            <h2 className="text-lg font-black text-slate-900">Datos del proceso</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              El formato de hoy queda guardado para continuar agregando controles por hora.
            </p>
          </div>

          <div
            className="grid min-w-0 gap-4 p-5"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))" }}
          >
            <ReadOnlyInfo label="Fecha" value={values.fecha} />
            {renderField("loteProceso")}
            {renderField("horaInicio")}
            {renderField("verifica")}
          </div>

          {savedDay && (
            <p className="mx-5 mb-5 rounded-lg bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600">
              Ya existe un formato guardado para este dia. Se cargo para continuar agregando mediciones.
            </p>
          )}
        </div>

        <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4">
          <div
            className="grid min-w-0 gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 160px), 1fr))" }}
          >
            <div className="mx-auto w-full max-w-[220px]">
              <img
                src={controlPccCanalesImage}
                alt="Grafica de control PCC canales"
                className="max-h-48 w-full rounded-lg border border-slate-200 object-contain"
              />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-black text-slate-900">Control PCC</h2>
              <div className="mt-3 grid gap-2">
                {(template.controlLimits || []).map((item) => (
                  <div key={item.label} className="rounded-lg bg-slate-50 px-3 py-2">
                    <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">
                      {item.label}
                    </p>
                    <p className="text-sm font-black text-slate-800">{item.value}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600">
                C cumple, NC no cumple.
              </p>
            </div>
          </div>
        </div>
      </section>

      <TemperatureMeasurementsEditor
        columns={template.monitorTable.columns}
        rows={measurements}
        onRowsChange={(rows) => onValueChange(template.monitorTable.valueKey, rows)}
      />

      <section className="rounded-xl border border-slate-200">
        <DynamicRowsTable
          title={template.actionTable.title}
          help={template.actionTable.help}
          columns={template.actionTable.columns}
          rows={actions}
          emptyText="Sin acciones correctivas registradas."
          addLabel="Agregar accion"
          removeLabel="Quitar"
          compact
          onRowsChange={(rows) => onValueChange(template.actionTable.valueKey, rows)}
        />
      </section>

      <GuideTable guide={template.guide} />
    </div>
  );
}

function TemperatureMeasurementsEditor({ columns, rows, onRowsChange }) {
  const channelColumns = columns.filter((column) => column.id.startsWith("canalC"));
  const metaColumns = columns.filter(
    (column) => !column.id.startsWith("canalC") && column.id !== "hora"
  );
  const columnById = Object.fromEntries(columns.map((column) => [column.id, column]));

  const updateRow = (rowIndex, fieldId, value) => {
    onRowsChange(
      rows.map((row, index) =>
        index === rowIndex ? { ...row, [fieldId]: value } : row
      )
    );
  };

  const addRow = () => {
    onRowsChange([...rows, createInitialDynamicRow(columns)]);
  };

  const removeRow = (rowIndex) => {
    onRowsChange(rows.filter((_, index) => index !== rowIndex));
  };

  return (
    <section className="min-w-0 rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900">Mediciones por hora</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Agrega una tarjeta por cada control realizado durante el dia.
          </p>
        </div>
        <button type="button" onClick={addRow} className="btn-secondary">
          Agregar medicion
        </button>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 p-5">
        {rows.map((row, rowIndex) => (
          <article key={rowIndex} className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[rgb(0,48,73)] text-sm font-black text-white">
                  {rowIndex + 1}
                </span>
                <div>
                  <h3 className="font-black text-slate-900">Medicion {rowIndex + 1}</h3>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Control de temperatura PCC
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeRow(rowIndex)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-100"
              >
                Quitar
              </button>
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-4">
              <CompactMeasurementField
                column={columnById.hora}
                value={row.hora || ""}
                onChange={(value) => updateRow(rowIndex, "hora", value)}
              />

              <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-3">
                <p className="mb-3 text-xs font-black uppercase tracking-wide text-slate-400">
                  Temperatura canales
                </p>
                <div
                  className="grid min-w-0 gap-2"
                  style={{ gridTemplateColumns: "repeat(auto-fit, minmax(72px, 1fr))" }}
                >
                  {channelColumns.map((column) => (
                    <CompactMeasurementField
                      key={column.id}
                      column={column}
                      value={row[column.id] || ""}
                      onChange={(value) => updateRow(rowIndex, column.id, value)}
                      dense
                    />
                  ))}
                </div>
              </div>
            </div>

            <div
              className="mt-4 grid min-w-0 gap-3"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))" }}
            >
              {metaColumns.map((column) => (
                <CompactMeasurementField
                  key={column.id}
                  column={column}
                  value={row[column.id] || ""}
                  onChange={(value) => updateRow(rowIndex, column.id, value)}
                  wide={column.type === "textarea"}
                />
              ))}
            </div>
          </article>
        ))}

        {rows.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
            <p className="font-bold text-slate-700">Sin mediciones registradas para hoy.</p>
            <p className="mt-1 text-sm text-slate-500">
              Usa Agregar medicion para iniciar el control del dia.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function CompactMeasurementField({ column, value, onChange, dense = false, wide = false }) {
  const wrapperClass = wide ? "col-span-full" : "";
  const inputClass = dense ? "input-pro h-10 bg-white text-sm" : "input-pro bg-white";

  return (
    <div className={wrapperClass}>
      <label className="label">
        {column.label}
        {column.required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {column.type === "textarea" ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="input-pro min-h-24 resize-none bg-white"
          placeholder={column.label}
        />
      ) : (
        <input
          type={column.type}
          step={column.step}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={inputClass}
          placeholder={column.label}
        />
      )}
    </div>
  );
}

function EmpaquesTableForm({ template, rows, savedRecords, onRowsChange }) {
  const columns = template.table.columns;

  const updateRow = (rowIndex, columnId, value) => {
    const nextRows = rows.map((row, index) =>
      index === rowIndex ? { ...row, [columnId]: value } : row
    );

    onRowsChange(nextRows);
  };

  const resetCurrentSample = () => {
    onRowsChange([createInitialTableRow(template)]);
  };

  const savedSamples = savedRecords
    .flatMap((record) =>
      (record.values?.[template.table.valueKey] || []).map((sample) => ({
        ...sample,
        id: record.id,
        fechaRegistro: record.fechaRegistro,
      }))
    )
    .sort((a, b) => new Date(a.fechaRegistro) - new Date(b.fechaRegistro));

  return (
    <section className="grid gap-5">
      <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="flex flex-col gap-3 border-b border-slate-100 bg-white px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900">
            {template.table.currentTitle || "Registro actual"}
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {template.table.currentHelp || "Llena el registro, guardalo y luego inicia el siguiente."}
          </p>
        </div>

        <button type="button" onClick={resetCurrentSample} className="btn-secondary">
          Nuevo registro
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1180px] border-collapse text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="w-12 border-r border-slate-200 px-3 py-3 text-left">#</th>
              {columns.map((column) => (
                <th key={column.id} className="border-r border-slate-200 px-3 py-3 text-left">
                  {column.label}
                  {column.required && !column.locked && <span className="ml-1 text-red-500">*</span>}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.slice(0, 1).map((row, rowIndex) => (
              <tr key={`${row.fecha}-${row.hora}-${rowIndex}`} className="align-top">
                <td className="border-r border-slate-100 px-3 py-3 font-black text-slate-400">
                  {rowIndex + 1}
                </td>
                {columns.map((column) => (
                  <td key={column.id} className="border-r border-slate-100 px-3 py-3">
                    <TableCellControl
                      column={column}
                      value={row[column.id] || ""}
                      onChange={(value) => updateRow(rowIndex, column.id, value)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200">
        <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
          <h2 className="text-lg font-black text-slate-900">
            {template.table.savedTitle || "Registros guardados hoy"}
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {template.table.savedHelp || "Estos registros quedan guardados aunque cierres la web o apagues el computador."}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm">
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
              {savedSamples.map((sample, index) => (
                <tr key={`${sample.id}-${index}`} className="bg-white">
                  <td className="border-r border-slate-100 px-3 py-3 font-black text-slate-400">
                    {index + 1}
                  </td>
                  {columns.map((column) => (
                    <td key={column.id} className="border-r border-slate-100 px-3 py-3 text-slate-600">
                      {sample[column.id] || ""}
                    </td>
                  ))}
                </tr>
              ))}

              {savedSamples.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="px-5 py-10 text-center">
                    <p className="font-bold text-slate-700">
                      {template.table.emptyTitle || "Aun no hay registros guardados hoy"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {template.table.emptyHelp || "Guarda el primer registro para que quede fijo en este listado."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function TableCellControl({ column, value, onChange }) {
  if (column.locked) {
    return (
      <div className="min-h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-semibold text-slate-600">
        {value}
      </div>
    );
  }

  if (column.type === "select") {
    return (
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="input-pro min-w-44"
      >
        <option value="">Seleccione</option>
        {column.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  if (column.type === "textarea") {
    return (
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="input-pro min-h-24 min-w-56 resize-none"
        placeholder={column.label}
      />
    );
  }

  return (
    <input
      type={column.type}
      step={column.step}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="input-pro min-w-32"
      placeholder={column.label}
    />
  );
}

function DailyField({ field, value, onChange }) {
  return (
    <div>
      <label className="label">
        {field.label}
        {field.required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {field.type === "select" ? (
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="input-pro bg-white"
        >
          <option value="">Seleccione</option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={field.type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="input-pro bg-white"
          placeholder={field.label}
        />
      )}
    </div>
  );
}

function ActionField({ field, value, onChange }) {
  if (field.locked) {
    return (
      <div>
        <p className="label">{field.label}</p>
        <div className="flex h-12 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700">
          {value}
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="label">{field.label}</label>
      {field.type === "select" ? (
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="input-pro bg-white"
        >
          <option value="">Seleccione</option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="input-pro min-h-24 resize-none bg-white"
          placeholder={field.label}
        />
      ) : (
        <input
          type={field.type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="input-pro bg-white"
          placeholder={field.label}
        />
      )}
    </div>
  );
}

function getRecordTitle(record) {
  if (record.values?.checks) {
    return [
      record.day && `Dia ${record.day}`,
      record.values.verifico,
    ].filter(Boolean).join(" - ");
  }

  if (record.values?.viajes) {
    const trips = record.values.viajes.length;

    return [
      trips === 1 ? "1 viaje" : `${trips} viajes`,
      record.values.verificadoPor,
    ].filter(Boolean).join(" - ");
  }

  if (record.values?.periodoDesde && record.values?.periodoHasta) {
    const template = formatTemplates.find((item) => item.id === record.formatoId);
    const verifierNames = template
      ? getWeeklyPoesAreaResponsibles(record.values, template).map((area) => area.verificadoPor)
      : [record.values.verificadoPor];

    return [
      getWeeklyPoesPeriodLabel(record.values, record.periodKey),
      ...new Set(verifierNames.filter(Boolean)),
    ].filter(Boolean).join(" - ");
  }

  if (record.values?.muestras && record.values?.granja) {
    return [
      record.values.fecha,
      record.values.granja,
      record.values.verifico,
    ].filter(Boolean).join(" - ") || "Formato guardado";
  }

  if (record.values?.mediciones && record.values?.horaInicio !== undefined) {
    const measurements = record.values.mediciones.length;

    return [
      record.values.fecha,
      record.values.loteProceso,
      measurements === 1 ? "1 medicion" : `${measurements} mediciones`,
    ].filter(Boolean).join(" - ") || "Formato guardado";
  }

  if (record.values?.controles) {
    const controls = record.values.controles.length;

    if (record.values.loteProceso) {
      return [
        record.values.loteProceso,
        controls === 1 ? "1 control" : `${controls} controles`,
        record.values.verifica,
      ].filter(Boolean).join(" - ") || "Formato diario guardado";
    }

    return [
      record.values.monthKey,
      controls === 1 ? "1 control" : `${controls} controles`,
    ].filter(Boolean).join(" - ") || "Formato mensual guardado";
  }

  if (record.values?.visceras || record.values?.patasCabezas) {
    const samples =
      (record.values.visceras || []).length +
      (record.values.patasCabezas || []).length;

    return [
      record.values.loteProceso,
      samples === 1 ? "1 muestreo" : `${samples} muestreos`,
      record.values.verificadoPor,
    ].filter(Boolean).join(" - ") || "Formato diario guardado";
  }

  if (record.values?.despachos) {
    const dispatches = record.values.despachos.length;

    return [
      record.values.fecha,
      dispatches === 1 ? "1 despacho" : `${dispatches} despachos`,
      record.values.verificadoPor,
    ].filter(Boolean).join(" - ") || "Formato diario guardado";
  }

  const sample = record.values?.muestras?.[0];
  const measurement = record.values?.mediciones?.[0];

  if (measurement) {
    return [
      measurement.hora && `${measurement.hora}`,
      measurement.area,
      measurement.verifico,
    ].filter(Boolean).join(" - ") || "Medicion guardada";
  }

  if (!sample) return "Muestra guardada";

  return [
    sample.numeroMuestra && `Muestra ${sample.numeroMuestra}`,
    sample.verificadoPor,
  ].filter(Boolean).join(" - ");
}

function getProgressLabel(template, progress) {
  if (template.period === "weekly") {
    return progress.completed === 1
      ? "Semana guardada"
      : "Semana pendiente";
  }

  if (template.period === "monthly") {
    if (template.layout === "empaques-table") {
      return `${progress.completed}/${progress.total} mediciones`;
    }

    if (template.layout === "cold-rooms-monthly") {
      return progress.completed === 1
        ? "1 dia con control"
        : `${progress.completed}/${progress.total} dias con control`;
    }

    return progress.completed === 1
      ? "1 dia guardado"
      : `${progress.completed}/${progress.total} dias guardados`;
  }

  if (template.layout === "empaques-table") {
    if (template.table?.valueKey === "mediciones") {
      return progress.completed === 1
        ? "1 medicion guardada"
        : `${progress.completed} mediciones guardadas`;
    }

    return progress.completed === 1
      ? "1 muestra guardada"
      : `${progress.completed} muestras guardadas`;
  }

  return `${progress.completed}/${progress.total}`;
}

function getFilledCheckCount(template, checks) {
  return getTemplateFields(template).filter((item) =>
    String(checks[item.id] || "").trim()
  ).length;
}

function ReadOnlyInfo({ label, value }) {
  return (
    <div>
      <p className="label">{label}</p>
      <div className="flex h-12 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700">
        {value}
      </div>
    </div>
  );
}

function FieldControl({ field, value, onChange }) {
  const wrapperClass = field.type === "textarea" ? "md:col-span-2" : "";

  return (
    <div className={wrapperClass}>
      <label className="label">
        {field.label}
        {field.required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {field.type === "select" ? (
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="input-pro"
        >
          <option value="">Seleccione</option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="input-pro min-h-32 resize-none"
          placeholder={field.label}
        />
      ) : (
        <input
          type={field.type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="input-pro"
          placeholder={field.label}
        />
      )}
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 font-bold text-slate-700">{value}</p>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-[rgb(0,48,73)]">
        {value}
      </p>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-slate-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
