import { useMemo, useState } from "react";

const USERS = [
  {
    id: 1,
    name: "Juan Pablo Ovalle Gonzalez",
    document: "1.234.567.890",
    area: "Producción",
    progress: 100,
    missing: 0,
    status: "Activo",
    entryDate: "15/05/2024",
    email: "juan.pablo@correo.com",
    phone: "320 556 1234",
  },
  {
    id: 2,
    name: "Andres Fernando Aranda Villada",
    document: "1.098.765.432",
    area: "Calidad",
    progress: 65,
    missing: 2,
    status: "Activo",
    entryDate: "20/03/2023",
    email: "andres.aranda@correo.com",
    phone: "311 482 0091",
  },
  {
    id: 3,
    name: "Estefania Restrepo Marín",
    document: "1.112.223.334",
    area: "Mantenimiento",
    progress: 40,
    missing: 3,
    status: "Retirado",
    entryDate: "12/01/2022",
    email: "estefania.restrepo@correo.com",
    phone: "300 221 4550",
  },
  {
    id: 4,
    name: "Laura Sofía Herrera",
    document: "1.334.456.667",
    area: "Talento Humano",
    progress: 80,
    missing: 1,
    status: "Activo",
    entryDate: "01/07/2023",
    email: "laura.herrera@correo.com",
    phone: "315 889 1120",
  },
  {
    id: 5,
    name: "Andrés Felipe Giraldo",
    document: "1.222.333.444",
    area: "Almacén",
    progress: 55,
    missing: 2,
    status: "Reintegrado",
    entryDate: "05/02/2024",
    email: "andres.giraldo@correo.com",
    phone: "312 778 4010",
  },
  {
    id: 6,
    name: "Daniela Morales Castro",
    document: "1.101.112.111",
    area: "SST",
    progress: 90,
    missing: 1,
    status: "Activo",
    entryDate: "18/08/2023",
    email: "daniela.morales@correo.com",
    phone: "301 654 9901",
  },
  {
    id: 7,
    name: "Carlos Alberto Ruiz",
    document: "1.341.516.171",
    area: "Producción",
    progress: 25,
    missing: 3,
    status: "Retirado",
    entryDate: "30/11/2021",
    email: "carlos.ruiz@correo.com",
    phone: "310 245 1112",
  },
];

export default function PerfilUsuario() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Todos");
  const [drawer, setDrawer] = useState(null);

  const users = useMemo(() => {
    return USERS.filter((user) => {
      const matchesQuery = `${user.name} ${user.document} ${user.area}`
        .toLowerCase()
        .includes(query.toLowerCase());

      const matchesStatus = status === "Todos" || user.status === status;

      return matchesQuery && matchesStatus;
    });
  }, [query, status]);

  return (
    <div className="min-h-full bg-[#f8fafc] px-8 py-8 text-slate-800">
      <div className="mb-8">
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Usuarios</h1>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Consulta, filtra y administra la información principal de los colaboradores.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center">
        <label className="relative w-full lg:max-w-xl">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nombre, documento o área..."
            className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 pr-12 text-sm font-medium text-slate-700 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
            <SearchIcon />
          </span>
        </label>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 lg:w-56"
        >
          <option value="Todos">Estado: Todos</option>
          <option value="Activo">Estado: Activo</option>
          <option value="Retirado">Estado: Retirado</option>
          <option value="Reintegrado">Estado: Reintegrado</option>
        </select>
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
                <th className="px-5 py-4">Nombre Completo</th>
                <th className="px-5 py-4">Documento</th>
                <th className="px-5 py-4">Área</th>
                <th className="px-5 py-4 text-center">Datos Completos</th>
                <th className="px-5 py-4">Estado</th>
                <th className="px-5 py-4">Fecha Ingreso</th>
                <th className="px-5 py-4 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-slate-100 text-sm text-slate-600 transition hover:bg-blue-50/40"
                >
                  <td className="px-5 py-5 font-semibold text-slate-700">{user.name}</td>
                  <td className="px-5 py-5">{user.document}</td>
                  <td className="px-5 py-5">{user.area}</td>
                  <td className="px-5 py-5">
                    <Progress value={user.progress} missing={user.missing} />
                  </td>
                  <td className="px-5 py-5">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-5 py-5">{user.entryDate}</td>
                  <td className="px-5 py-5">
                    <div className="flex items-center justify-center gap-3 text-slate-500">
                      <button
                        onClick={() => setDrawer({ mode: "view", user })}
                        className="rounded-md p-2 transition hover:bg-blue-50 hover:text-blue-600"
                        title="Ver usuario"
                      >
                        <EyeIcon />
                      </button>

                      <button
                        onClick={() => setDrawer({ mode: "edit", user })}
                        className="rounded-md p-2 transition hover:bg-blue-50 hover:text-blue-600"
                        title="Editar usuario"
                      >
                        <EditIcon />
                      </button>

                      <button
                        className="rounded-md p-2 transition hover:bg-slate-100 hover:text-slate-800"
                        title="Más opciones"
                      >
                        <DotsIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-4 text-sm font-medium text-slate-500">
          <p>
            Mostrando {users.length} de {USERS.length} usuarios
          </p>

          <div className="flex items-center gap-2">
            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-300 hover:text-blue-600">
              ‹
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-400 bg-blue-50 text-sm font-bold text-blue-600">
              1
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-300 hover:text-blue-600">
              ›
            </button>
          </div>
        </div>
      </section>

      {drawer && (
        <UserDrawer
          mode={drawer.mode}
          user={drawer.user}
          onClose={() => setDrawer(null)}
        />
      )}
    </div>
  );
}

function Progress({ value, missing }) {
  const color =
    value >= 80 ? "#22c55e" : value >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col items-center">
      <div
        className="grid h-16 w-16 place-items-center rounded-full"
        style={{
          background: `conic-gradient(${color} ${value * 3.6}deg, #e5e7eb 0deg)`,
        }}
      >
        <div className="grid h-12 w-12 place-items-center rounded-full bg-white">
          <span className="text-sm font-bold text-slate-700">{value}%</span>
        </div>
      </div>

      <p
        className={`mt-2 text-xs font-bold ${
          missing === 0 ? "text-emerald-600" : value >= 50 ? "text-amber-500" : "text-red-500"
        }`}
      >
        {missing === 0 ? "Completo" : `Faltan ${missing}`}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Activo: "bg-emerald-50 text-emerald-700",
    Retirado: "bg-red-50 text-red-600",
    Reintegrado: "bg-amber-50 text-amber-600",
  };

  return (
    <span className={`rounded-md px-3 py-1 text-xs font-bold ${styles[status]}`}>
      {status}
    </span>
  );
}

function UserDrawer({ mode, user, onClose }) {
  const isEdit = mode === "edit";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-sm">
      <aside className="h-full w-full max-w-md bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
              {isEdit ? "Editar usuario" : "Vista de usuario"}
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">{user.name}</h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5 px-6 py-6">
          <DrawerField label="Nombre completo" value={user.name} editable={isEdit} />
          <DrawerField label="Documento" value={user.document} editable={isEdit} />
          <DrawerField label="Área" value={user.area} editable={isEdit} />
          <DrawerField label="Correo" value={user.email} editable={isEdit} />
          <DrawerField label="Teléfono" value={user.phone} editable={isEdit} />
          <DrawerField label="Fecha de ingreso" value={user.entryDate} editable={isEdit} />

          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-4 text-sm font-semibold text-blue-700">
            Esta vista queda lista para conectar después con el diseño detallado de ver o editar.
          </div>
        </div>

        <div className="mt-auto flex justify-end gap-3 border-t border-slate-200 px-6 py-5">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
          >
            Cerrar
          </button>

          {isEdit && (
            <button className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-blue-700">
              Guardar Cambios
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}

function DrawerField({ label, value, editable }) {
  return (
    <label>
      <span className="mb-2 block text-sm font-semibold text-slate-600">
        {label}
      </span>
      <input
        defaultValue={value}
        readOnly={!editable}
        className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 shadow-sm outline-none transition read-only:bg-slate-50 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
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

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <circle cx="12" cy="5" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="12" cy="19" r="1.8" />
    </svg>
  );
}
