import { useMemo, useState } from "react";

const initialEvents = [
  {
    id: 1,
    type: "Cumpleaños",
    title: "Cumpleaños María López",
    date: "2024-05-02",
    description: "Celebración de cumpleaños.",
  },
  {
    id: 2,
    type: "Fecha Especial",
    title: "Día de la Madre",
    date: "2024-05-08",
    description: "Fecha especial corporativa.",
  },
  {
    id: 3,
    type: "Evento Corporativo",
    title: "Aniversario Empresa",
    date: "2024-05-10",
    description: "Aniversario institucional.",
  },
  {
    id: 4,
    type: "Cumpleaños",
    title: "Cumpleaños Juan Pérez",
    date: "2024-05-15",
    description: "Celebración de cumpleaños.",
  },
  {
    id: 5,
    type: "Festivo",
    title: "Día del Trabajador",
    date: "2024-05-20",
    description: "Día festivo.",
  },
  {
    id: 6,
    type: "Cumpleaños",
    title: "Cumpleaños Pedro Ramírez",
    date: "2024-05-25",
    description: "Celebración de cumpleaños.",
  },
  {
    id: 7,
    type: "Vacaciones",
    title: "Vacaciones Laura Herrera",
    date: "2024-05-27",
    description: "Inicio de vacaciones.",
  },
  {
    id: 8,
    type: "Otro Evento",
    title: "Fin de Mes Corporativo",
    date: "2024-05-31",
    description: "Cierre mensual.",
  },
];

const eventTypes = [
  "Todos",
  "Cumpleaños",
  "Fecha Especial",
  "Evento Corporativo",
  "Festivo",
  "Vacaciones",
  "Otro Evento",
];

const typeStyles = {
  Cumpleaños: "bg-emerald-50 text-emerald-700 border-emerald-100",
  "Fecha Especial": "bg-amber-50 text-amber-700 border-amber-100",
  "Evento Corporativo": "bg-purple-50 text-purple-700 border-purple-100",
  Festivo: "bg-pink-50 text-pink-700 border-pink-100",
  Vacaciones: "bg-violet-50 text-violet-700 border-violet-100",
  "Otro Evento": "bg-slate-100 text-slate-700 border-slate-200",
};

const typeDotStyles = {
  Cumpleaños: "bg-emerald-500",
  "Fecha Especial": "bg-amber-500",
  "Evento Corporativo": "bg-purple-600",
  Festivo: "bg-pink-500",
  Vacaciones: "bg-violet-600",
  "Otro Evento": "bg-slate-500",
};

export default function Bienestar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState(initialEvents);
  const [filter, setFilter] = useState("Todos");
  const today = toDateKey(new Date());

  const [form, setForm] = useState({
  type: "Cumpleaños",
  title: "",
  date: today,
  description: "",
  });
 

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const eventDate = new Date(`${event.date}T00:00:00`);
      const sameMonth = eventDate.getMonth() === month && eventDate.getFullYear() === year;
      const matchesFilter = filter === "Todos" || event.type === filter;

      return sameMonth && matchesFilter;
    });
  }, [events, filter, month, year]);

  const calendarDays = useMemo(() => {
    return buildCalendarDays(year, month);
  }, [year, month]);

  const upcomingEvents = useMemo(() => {
    return [...filteredEvents]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);
  }, [filteredEvents]);

  const counts = {
    Cumpleaños: filteredEvents.filter((event) => event.type === "Cumpleaños").length,
    "Fecha Especial": filteredEvents.filter((event) => event.type === "Fecha Especial").length,
    Festivo: filteredEvents.filter((event) => event.type === "Festivo").length,
    Programados: filteredEvents.length,
  };

  const changeMonth = (direction) => {
    setCurrentDate((current) => new Date(current.getFullYear(), current.getMonth() + direction, 1));
  };

  const goToday = () => {
    setCurrentDate(new Date());
  };

  const handleChange = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const saveEvent = () => {
    if (!form.title.trim() || !form.date) return;

    setEvents((current) => [
      ...current,
      {
        id: Date.now(),
        type: form.type,
        title: form.title,
        date: form.date,
        description: form.description,
      },
    ]);
    const savedDate = new Date(`${form.date}T00:00:00`);
   setCurrentDate(new Date(savedDate.getFullYear(), savedDate.getMonth(), 1));

    setForm({
      type: "Cumpleaños",
      title: "",
      date: "toDateKey(new Date()),",
      description: "",
    });
  };

  return (
    <div className="min-h-full bg-[#f8fafc] px-8 py-8 text-slate-800">
      <div className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            Fechas Especiales
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Calendario de eventos importantes, vacaciones y actividades del equipo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={goToday}
            className="h-11 rounded-lg border border-slate-200 bg-white px-5 text-sm font-bold text-slate-600 shadow-sm transition hover:border-purple-200 hover:text-purple-700"
          >
            Hoy
          </button>

          <button
            onClick={() => changeMonth(-1)}
            className="h-11 w-11 rounded-lg border border-slate-200 bg-white text-xl font-bold text-slate-500 shadow-sm transition hover:border-purple-200 hover:text-purple-700"
          >
            ‹
          </button>

          <button
            onClick={() => changeMonth(1)}
            className="h-11 w-11 rounded-lg border border-slate-200 bg-white text-xl font-bold text-slate-500 shadow-sm transition hover:border-purple-200 hover:text-purple-700"
          >
            ›
          </button>

          <div className="h-11 rounded-lg border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 shadow-sm flex items-center">
            {formatMonth(currentDate)}
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
          >
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type === "Todos" ? "Filtrar: Todos" : `Filtrar: ${type}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-7 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Cumpleaños" value={counts.Cumpleaños} color="emerald" />
        <MetricCard title="Fechas Especiales" value={counts["Fecha Especial"]} color="amber" />
        <MetricCard title="Festivos" value={counts.Festivo} color="pink" />
        <MetricCard title="Eventos Programados" value={counts.Programados} color="purple" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_420px]">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-sm font-bold text-slate-600">
            {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
              <div key={day} className="py-4">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {calendarDays.map((day) => {
              const dayEvents = filteredEvents.filter((event) => event.date === day.dateKey);
              const isCurrentMonth = day.month === month;
              const isToday = day.dateKey === toDateKey(new Date());

              return (
                <button
                    type="button"
                    key={day.dateKey}
                    onClick={() =>
                        setForm((current) => ({
                        ...current,
                        date: day.dateKey,
                        }))
                    }
                    className={`min-h-32 border-b border-r border-slate-100 p-3 text-left transition hover:bg-purple-50/40 ${
                        isCurrentMonth ? "bg-white" : "bg-slate-50/70 text-slate-300"
                    } ${form.date === day.dateKey ? "ring-2 ring-inset ring-purple-400" : ""}`}
                >

                  <div
                    className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                      isToday
                        ? "bg-purple-600 text-white"
                        : isCurrentMonth
                          ? "text-slate-700"
                          : "text-slate-300"
                    }`}
                  >
                    {day.day}
                  </div>

                  <div className="space-y-2">
                    {dayEvents.slice(0, 3).map((event) => (
                      <button
                        key={event.id}
                        className={`w-full rounded-lg border px-2 py-2 text-left text-xs font-bold transition hover:shadow-sm ${typeStyles[event.type]}`}
                        title={event.description}
                      >
                        {event.title}
                      </button>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="space-y-5">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                Próximos Eventos
              </h2>
              <button
                onClick={() => setFilter("Todos")}
                className="text-sm font-bold text-purple-600 hover:text-purple-700"
              >
                Ver todos
              </button>
            </div>

            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-4">
                  <span className={`h-3 w-3 rounded-full ${typeDotStyles[event.type]}`} />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-800">
                      {event.title}
                    </p>
                    <p className="mt-1 text-xs font-medium text-slate-500">
                      {formatShortDate(event.date)}
                    </p>
                  </div>

                  <span className="rounded-md bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700">
                    {daysUntil(event.date)}
                  </span>
                </div>
              ))}

              {upcomingEvents.length === 0 && (
                <p className="py-6 text-center text-sm font-medium text-slate-500">
                  No hay eventos para este filtro.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Nuevo Evento
            </h2>

            <div className="mt-5 space-y-4">
              <SelectInput
                label="Tipo de Evento"
                value={form.type}
                onChange={handleChange("type")}
                options={eventTypes.filter((type) => type !== "Todos")}
              />

              <Field
                label="Nombre / Detalle"
                value={form.title}
                onChange={handleChange("title")}
                placeholder="Ej: Vacaciones Juan Pérez"
              />

              <DateInput
                label="Fecha"
                value={form.date}
                onChange={handleChange("date")}
              />

              <label>
                <span className="mb-3 block text-sm font-semibold text-slate-600">
                  Descripción
                </span>
                <textarea
                  value={form.description}
                  onChange={handleChange("description")}
                  placeholder="Agrega una descripción del evento..."
                  className="min-h-28 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
                />
              </label>

              <button
                onClick={saveEvent}
                disabled={!form.title.trim() || !form.date}
                className="h-12 w-full rounded-lg bg-purple-600 text-sm font-bold text-white shadow-md transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              >
                Guardar Evento
              </button>
            </div>
          </section>
        </aside>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-5 text-sm font-semibold text-slate-600">
        <span className="font-bold text-slate-900">Tipos de Eventos</span>
        {eventTypes
          .filter((type) => type !== "Todos")
          .map((type) => (
            <span key={type} className="flex items-center gap-2">
              <span className={`h-3 w-3 rounded-full ${typeDotStyles[type]}`} />
              {type}
            </span>
          ))}
      </div>
    </div>
  );
}

function MetricCard({ title, value, color }) {
  const styles = {
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    pink: "bg-pink-50 text-pink-600",
    purple: "bg-purple-50 text-purple-700",
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-5">
        <div className={`grid h-16 w-16 place-items-center rounded-xl ${styles[color]}`}>
          <CalendarIcon />
        </div>

        <div>
          <p className="text-4xl font-bold text-slate-900">{value}</p>
          <p className={`mt-1 text-sm font-bold ${styles[color].split(" ")[1]}`}>
            {title}
          </p>
          <p className="mt-3 text-sm font-medium text-slate-500">
            Este mes
          </p>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <label>
      <span className="mb-3 block text-sm font-semibold text-slate-600">
        {label}
      </span>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
      />
    </label>
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

function buildCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const startDate = new Date(year, month, 1 - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);

    return {
      day: date.getDate(),
      month: date.getMonth(),
      dateKey: toDateKey(date),
    };
  });
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatMonth(date) {
  return new Intl.DateTimeFormat("es-CO", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatShortDate(date) {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

function daysUntil(date) {
  const today = new Date();
  const target = new Date(`${date}T00:00:00`);
  const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));

  if (diff === 0) return "Hoy";
  if (diff < 0) return "Pasado";
  return `En ${diff} días`;
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-8 w-8">
      <path d="M8 2v4M16 2v4" />
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}
