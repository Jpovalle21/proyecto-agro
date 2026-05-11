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
    name: "Juan Jose Zuluaga",
    document: "1.334.456.667",
    area: "Talento Humano",
    progress: 80,
    missing: 1,
    status: "Activo",
    entryDate: "01/07/2023",
    email: "juan.zuluaga@correo.com",
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
  if (mode === "edit") {
    return <EditDocumentsDrawer user={user} onClose={onClose} />;
  }

  return <UserDetailDrawer mode={mode} user={user} onClose={onClose} />;
}


function UserDetailDrawer({ mode, user, onClose }) {
  const [openSections, setOpenSections] = useState({
    personales: true,
    afiliaciones: true,
    inducciones: true,
    novedades: true,
  });

  const datosPersonales = [
    { documento: "Nombres y Apellidos", descripcion: user.name, fecha: "15/05/2024", estado: "Cargado", loaded: true },
    { documento: "Documento de Identidad", descripcion: user.document, fecha: "15/05/2024", estado: "Cargado", loaded: true },
    { documento: "Tipo de Documento", descripcion: "Cédula de ciudadanía", fecha: "15/05/2024", estado: "Cargado", loaded: true },
    { documento: "Género", descripcion: "Masculino", fecha: "15/05/2024", estado: "Cargado", loaded: true },
    { documento: "Área", descripcion: user.area, fecha: "15/05/2024", estado: "Cargado", loaded: true },
    { documento: "RH", descripcion: "O+", fecha: "15/05/2024", estado: "Cargado", loaded: true },
    { documento: "Tipo de Trabajo", descripcion: "Diurno", fecha: "15/05/2024", estado: "Cargado", loaded: true },
    { documento: "Tipo de Contrato", descripcion: "Término indefinido", fecha: "15/05/2024", estado: "Cargado", loaded: true },
    { documento: "Fecha de Ingreso", descripcion: user.entryDate, fecha: "15/05/2024", estado: "Cargado", loaded: true },
    { documento: "Fecha de Nacimiento", descripcion: "10/02/1995", fecha: "15/05/2024", estado: "Cargado", loaded: true },
    { documento: "Edad", descripcion: "29 años", fecha: "15/05/2024", estado: "Cargado", loaded: true },
  ];

  const afiliaciones = [
    { documento: "ARL - Bolívar", descripcion: "PDF", fecha: "10/05/2024", estado: "Cargado", loaded: true },
    { documento: "EPS - Sura", descripcion: "PDF", fecha: "10/05/2024", estado: "Cargado", loaded: true },
    { documento: "Fondo de Pensión - Protección", descripcion: "PDF", fecha: "10/05/2024", estado: "Cargado", loaded: true },
    { documento: "Caja de Compensación - Comfenalco", descripcion: "PDF", fecha: "-", estado: "Pendiente", loaded: false },
  ];

  const inducciones = [
    { documento: "Inducción Talento Humano", descripcion: "PDF", fecha: "15/05/2024", estado: "Cargado", loaded: true },
    { documento: "Inducción Ambiental", descripcion: "PDF", fecha: "15/05/2024", estado: "Cargado", loaded: true },
    { documento: "Inducción SST", descripcion: "PDF", fecha: "15/05/2024", estado: "Cargado", loaded: true },
    { documento: "Inducción Almacén", descripcion: "PDF", fecha: "-", estado: "Pendiente", loaded: false },
    { documento: "Inducción Calidad", descripcion: "PDF", fecha: "-", estado: "Pendiente", loaded: false },
    { documento: "Inducción Producción", descripcion: "PDF", fecha: "15/05/2024", estado: "Cargado", loaded: true },
    { documento: "Inducción Mantenimiento", descripcion: "PDF", fecha: "-", estado: "Pendiente", loaded: false },
    { documento: "Inducción Veterinaria", descripcion: "PDF", fecha: "-", estado: "Pendiente", loaded: false },
    { documento: "Inducción Auxiliar Contable", descripcion: "PDF", fecha: "-", estado: "Pendiente", loaded: false },
  ];

  const novedades = [
    { tipo: "Permiso", inicio: "15/05/2024", fin: "15/05/2024", descripcion: "Permiso personal por cita médica.", estado: "Aprobado", documento: "permiso_15052024.pdf" },
    { tipo: "Inasistencia", inicio: "22/04/2024", fin: "22/04/2024", descripcion: "Inasistencia no justificada.", estado: "No justificada", documento: "inasistencia_22042024.pdf" },
    { tipo: "Incapacidad", inicio: "10/03/2024", fin: "15/03/2024", descripcion: "Incapacidad médica por 5 días.", estado: "Aprobada", documento: "incapacidad_10032024.pdf" },
    { tipo: "Vacaciones", inicio: "01/12/2023", fin: "10/12/2023", descripcion: "Vacaciones anuales.", estado: "Finalizada", documento: "vacaciones_01122023.pdf" },
  ];

  const personalesCompletos = datosPersonales.filter((item) => item.loaded).length;
  const afiliacionesCompletas = afiliaciones.filter((item) => item.loaded).length;
  const induccionesCompletas = inducciones.filter((item) => item.loaded).length;

  const porcentajePersonales = (personalesCompletos / 27) * 100;
  const porcentajeAfiliaciones = (afiliacionesCompletas / 4) * 100;
  const porcentajeInducciones = (induccionesCompletas / 9) * 100;

  const totalPorcentaje = Math.round(
    (porcentajePersonales + porcentajeAfiliaciones + porcentajeInducciones) / 3
  );

  const totalCompletados = personalesCompletos + afiliacionesCompletas + induccionesCompletas;
  const totalRequisitos = 27 + 4 + 9;

  const toggleSection = (section) => {
    setOpenSections((current) => ({
      ...current,
      [section]: !current[section],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-7xl flex-col bg-white shadow-2xl">
        <header className="flex items-center justify-between bg-[#061b33] px-6 py-5 text-white">
          <h2 className="text-2xl font-bold">
            Perfil del Empleado - Vista Detallada
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-6">
          <section className="mb-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-6">
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                  <UserAvatarIcon />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {user.name}
                  </h3>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm font-semibold">
                    <span className="rounded-md bg-blue-50 px-3 py-1 text-blue-600">
                      Operario
                    </span>
                    <span className="text-slate-500">{user.area}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-emerald-600">{user.status}</span>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-6 text-sm font-medium text-slate-500">
                    <span>Fecha Ingreso: {user.entryDate}</span>
                    <span>Documento: {user.document}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Progreso total de documentos
                  </p>
                  <p className="mt-8 text-center text-sm font-medium text-slate-500">
                    {totalCompletados} de {totalRequisitos} requisitos completados
                  </p>
                </div>

                <div
                  className="grid h-28 w-28 place-items-center rounded-full"
                  style={{
                    background: `conic-gradient(#2563eb ${totalPorcentaje * 3.6}deg, #e2e8f0 0deg)`,
                  }}
                >
                  <div className="grid h-20 w-20 place-items-center rounded-full bg-white">
                    <span className="text-2xl font-bold text-slate-900">
                      {totalPorcentaje}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <DocumentSection
            title="Datos Personales"
            iconColor="blue"
            open={openSections.personales}
            onToggle={() => toggleSection("personales")}
            items={datosPersonales}
            completed={personalesCompletos}
            total={27}
          />

          <DocumentSection
            title="Afiliaciones"
            iconColor="emerald"
            open={openSections.afiliaciones}
            onToggle={() => toggleSection("afiliaciones")}
            items={afiliaciones}
            completed={afiliacionesCompletas}
            total={4}
          />

          <DocumentSection
            title="Inducciones"
            iconColor="violet"
            open={openSections.inducciones}
            onToggle={() => toggleSection("inducciones")}
            items={inducciones}
            completed={induccionesCompletas}
            total={9}
          />

          <NovedadesSection
            open={openSections.novedades}
            onToggle={() => toggleSection("novedades")}
            items={novedades}
          />
        </main>

        <footer className="flex justify-end border-t border-slate-200 bg-white px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-8 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
          >
            Cerrar
          </button>
        </footer>
      </div>
    </div>
  );
}

function EditDocumentsDrawer({ user, onClose }) {
  const [openSections, setOpenSections] = useState({
    personales: true,
    afiliaciones: false,
    inducciones: false,
  });

  const [personalDocs, setPersonalDocs] = useState([
    { id: 1, name: "Cédula de Ciudadanía", type: "PDF", date: "15/05/2024", loaded: true },
    { id: 2, name: "Certificado de Residencia", type: "PDF", date: "15/05/2024", loaded: true },
    { id: 3, name: "Foto 3x4", type: "JPG", date: "15/05/2024", loaded: true },
    { id: 4, name: "Hoja de Vida", type: "PDF", date: "15/05/2024", loaded: true },
    { id: 5, name: "Certificado Bancario", type: "PDF", date: "15/05/2024", loaded: true },
  ]);

  const [afiliacionDocs, setAfiliacionDocs] = useState([
    { id: 1, name: "EPS - Sura", type: "PDF", date: "10/05/2024", loaded: true },
    { id: 2, name: "Fondo de Pensiones - Protección", type: "PDF", date: "10/05/2024", loaded: true },
    { id: 3, name: "ARL - Sura", type: "PDF", date: "10/05/2024", loaded: true },
  ]);

  const [induccionDocs, setInduccionDocs] = useState([
    { id: 1, name: "Inducción Talento Humano", type: "PDF", date: "15/05/2024", loaded: true },
    { id: 2, name: "Inducción SST", type: "PDF", date: "15/05/2024", loaded: true },
    { id: 3, name: "Inducción Calidad", type: "PDF", date: "-", loaded: false },
    { id: 4, name: "Inducción Ambiente", type: "PDF", date: "-", loaded: false },
    { id: 5, name: "Inducción Producción", type: "PDF", date: "15/05/2024", loaded: true },
  ]);

  const [laborDoc, setLaborDoc] = useState({
    tipo: "",
    archivo: null,
    motivo: "",
  });

  const personalesCompletos = personalDocs.filter((doc) => doc.loaded).length;
  const afiliacionesCompletas = afiliacionDocs.filter((doc) => doc.loaded).length;
  const induccionesCompletas = induccionDocs.filter((doc) => doc.loaded).length;

  const porcentajePersonales = Math.round((personalesCompletos / 27) * 33);
  const porcentajeAfiliaciones = Math.round((afiliacionesCompletas / 4) * 33);
  const porcentajeInducciones = Math.round((induccionesCompletas / 9) * 33);

  const totalPorcentaje = porcentajePersonales + porcentajeAfiliaciones + porcentajeInducciones;
  const totalCompletados = personalesCompletos + afiliacionesCompletas + induccionesCompletas;

  const toggleSection = (section) => {
    setOpenSections((current) => ({
      ...current,
      [section]: !current[section],
    }));
  };

  const addDocument = (section) => (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const newDoc = {
      id: Date.now(),
      name: file.name,
      type: file.name.split(".").pop().toUpperCase(),
      date: new Date().toLocaleDateString("es-CO"),
      loaded: true,
    };

    if (section === "personales") setPersonalDocs((docs) => [...docs, newDoc]);
    if (section === "afiliaciones") setAfiliacionDocs((docs) => [...docs, newDoc]);
    if (section === "inducciones") setInduccionDocs((docs) => [...docs, newDoc]);
  };

  const deleteDocument = (section, id) => {
    if (section === "personales") setPersonalDocs((docs) => docs.filter((doc) => doc.id !== id));
    if (section === "afiliaciones") setAfiliacionDocs((docs) => docs.filter((doc) => doc.id !== id));
    if (section === "inducciones") setInduccionDocs((docs) => docs.filter((doc) => doc.id !== id));
  };

  const editDocument = (section, id) => {
    const nuevoNombre = window.prompt("Nuevo nombre del documento:");
    if (!nuevoNombre) return;

    const update = (docs) =>
      docs.map((doc) => (doc.id === id ? { ...doc, name: nuevoNombre } : doc));

    if (section === "personales") setPersonalDocs(update);
    if (section === "afiliaciones") setAfiliacionDocs(update);
    if (section === "inducciones") setInduccionDocs(update);
  };

  const saveLaborDoc = () => {
    if (!laborDoc.tipo || !laborDoc.archivo) return;

    alert(`Documento guardado: ${laborDoc.tipo}`);
    setLaborDoc({ tipo: "", archivo: null, motivo: "" });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-7xl flex-col bg-white shadow-2xl">
        <header className="flex items-center justify-between bg-[#061b33] px-6 py-5 text-white">
          <h2 className="text-2xl font-bold">Editar Documentos del Empleado</h2>
          <button onClick={onClose} className="rounded-lg p-2 text-white/80 transition hover:bg-white/10 hover:text-white">
            ✕
          </button>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-6">
          <section className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                  <UserAvatarIcon />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{user.name}</h3>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm font-semibold">
                    <span className="rounded-md bg-blue-50 px-3 py-1 text-blue-600">Operario</span>
                    <span className="text-slate-500">{user.area}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-emerald-600">{user.status}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div>
                  <p className="text-sm font-semibold text-slate-500">Progreso total de documentos</p>
                  <p className="mt-8 text-center text-sm font-medium text-slate-500">
                    {totalCompletados} de 40 requisitos completados
                  </p>
                </div>

                <div
                  className="grid h-24 w-24 place-items-center rounded-full"
                  style={{
                    background: `conic-gradient(#2563eb ${totalPorcentaje * 3.6}deg, #e2e8f0 0deg)`,
                  }}
                >
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-white">
                    <span className="text-xl font-bold text-slate-900">{totalPorcentaje}%</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <EditableDocumentSection
            title="Datos Personales"
            section="personales"
            color="blue"
            open={openSections.personales}
            onToggle={() => toggleSection("personales")}
            docs={personalDocs}
            percentage={porcentajePersonales}
            onUpload={addDocument("personales")}
            onDelete={(id) => deleteDocument("personales", id)}
            onEdit={(id) => editDocument("personales", id)}
          />

          <EditableDocumentSection
            title="Afiliaciones"
            section="afiliaciones"
            color="emerald"
            open={openSections.afiliaciones}
            onToggle={() => toggleSection("afiliaciones")}
            docs={afiliacionDocs}
            percentage={porcentajeAfiliaciones}
            onUpload={addDocument("afiliaciones")}
            onDelete={(id) => deleteDocument("afiliaciones", id)}
            onEdit={(id) => editDocument("afiliaciones", id)}
          />

          <EditableDocumentSection
            title="Inducciones"
            section="inducciones"
            color="violet"
            open={openSections.inducciones}
            onToggle={() => toggleSection("inducciones")}
            docs={induccionDocs}
            percentage={porcentajeInducciones}
            onUpload={addDocument("inducciones")}
            onDelete={(id) => deleteDocument("inducciones", id)}
            onEdit={(id) => editDocument("inducciones", id)}
          />

          <section className="mt-7 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">Documentos Laborales Adicionales</h3>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Carga documentos relacionados con renuncia o despido del empleado.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
              <label>
                <span className="mb-3 block text-sm font-semibold text-slate-600">Tipo de Documento</span>
                <select
                  value={laborDoc.tipo}
                  onChange={(event) => setLaborDoc((current) => ({ ...current, tipo: event.target.value }))}
                  className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="Renuncia">Renuncia</option>
                  <option value="Despido">Despido</option>
                </select>
              </label>

              <label>
                <span className="mb-3 block text-sm font-semibold text-slate-600">Documento</span>
                <div className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-blue-300 hover:bg-blue-50/40">
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(event) => setLaborDoc((current) => ({ ...current, archivo: event.target.files?.[0] || null }))}
                  />
                  <p className="text-sm font-medium text-slate-500">
                    {laborDoc.archivo ? laborDoc.archivo.name : "Arrastra y suelta el archivo aquí"}
                  </p>
                  <p className="my-2 text-sm text-slate-400">o</p>
                  <span className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-bold text-blue-600 shadow-sm">
                    Seleccionar archivo
                  </span>
                </div>
                <p className="mt-2 text-xs font-medium text-slate-400">
                  Formatos permitidos: PDF, JPG, PNG. Máx. 10MB
                </p>
              </label>
            </div>

            <label className="mt-6 block">
              <span className="mb-3 block text-sm font-semibold text-slate-600">Motivo</span>
              <textarea
                value={laborDoc.motivo}
                onChange={(event) => setLaborDoc((current) => ({ ...current, motivo: event.target.value }))}
                placeholder="Escribe el motivo de la renuncia o despido..."
                className="min-h-24 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <div className="mt-6 flex justify-end">
              <button
                onClick={saveLaborDoc}
                disabled={!laborDoc.tipo || !laborDoc.archivo}
                className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              >
                Guardar Documento
              </button>
            </div>
          </section>
        </main>

        <footer className="flex justify-end border-t border-slate-200 bg-white px-6 py-4">
          <button onClick={onClose} className="rounded-lg border border-slate-200 px-8 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50">
            Cerrar
          </button>
        </footer>
      </div>
    </div>
  );
}

function EditableDocumentSection({
  title,
  section,
  color,
  open,
  onToggle,
  docs,
  percentage,
  onUpload,
  onDelete,
  onEdit,
}) {
  const colors = {
    blue: "bg-blue-600 text-white border-blue-600",
    emerald: "bg-emerald-600 text-white border-emerald-600",
    violet: "bg-violet-600 text-white border-violet-600",
  };

  return (
    <section className={`overflow-hidden border border-slate-200 bg-white shadow-sm ${open ? "rounded-t-xl" : "rounded-xl"}`}>
      <button
        onClick={onToggle}
        className={`flex w-full items-center justify-between border-l-4 px-6 py-5 ${open ? "border-blue-600" : "border-transparent"}`}
      >
        <div className="flex items-center gap-4">
          <span className={`grid h-9 w-9 place-items-center rounded-lg ${colors[color]}`}>
            <EditFileIcon />
          </span>
          <h3 className={`text-lg font-bold ${open ? "text-blue-600" : "text-slate-900"}`}>
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-5">
          <span className="rounded-full bg-blue-50 px-4 py-1 text-sm font-bold text-blue-600">
            {percentage}%
          </span>
          <span className={`text-xl text-slate-500 transition ${open ? "rotate-180" : ""}`}>
            ˅
          </span>
        </div>
      </button>

      {open && (
        <div className="border-t border-slate-200 px-8 py-7">
          <div className="mb-5 flex items-center justify-between">
            <h4 className="text-xl font-bold text-slate-900">
              Documentos de {title}
            </h4>

            <label className="cursor-pointer rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-blue-700">
              + Cargar Documento
              <input type="file" className="hidden" onChange={onUpload} />
            </label>
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full min-w-[860px] text-sm">
              <thead className="bg-slate-50 text-xs font-bold text-slate-500">
                <tr>
                  <th className="px-5 py-4 text-left">Documento</th>
                  <th className="px-5 py-4 text-left">Descripción</th>
                  <th className="px-5 py-4 text-center">Fecha de Carga</th>
                  <th className="px-5 py-4 text-center">Estado</th>
                  <th className="px-5 py-4 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-slate-600">
                {docs.map((doc) => (
                  <tr key={doc.id}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className={`grid h-9 w-9 place-items-center rounded-md ${doc.loaded ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                          <EditFileIcon />
                        </span>
                        <span className="font-medium">{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">{doc.type}</td>
                    <td className="px-5 py-4 text-center">{doc.date}</td>
                    <td className="px-5 py-4 text-center">
                      <span className={`rounded-md px-3 py-1 text-xs font-bold ${doc.loaded ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-600"}`}>
                        {doc.loaded ? "Cargado" : "Pendiente"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => alert(`Viendo: ${doc.name}`)} className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600">
                          <SmallEyeIcon />
                        </button>
                        <button onClick={() => onEdit(doc.id)} className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600">
                          <SmallEditIcon />
                        </button>
                        <button onClick={() => onDelete(doc.id)} className="rounded-lg border border-slate-200 p-2 text-red-500 transition hover:border-red-200 hover:bg-red-50">
                          <SmallTrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

function EditFileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

function SmallEyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function SmallEditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </svg>
  );
}

function SmallTrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}


function DocumentSection({ title, iconColor, open, onToggle, items, completed, total }) {
  const porcentajeSeccion = Math.round((completed / total) * 33);

  const colors = {
    blue: "bg-blue-600 text-white",
    emerald: "bg-emerald-600 text-white",
    violet: "bg-violet-600 text-white",
  };

  return (
    <section className="mb-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <span className={`grid h-9 w-9 place-items-center rounded-lg ${colors[iconColor]}`}>
            <FileIcon />
          </span>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        </div>

        <div className="flex items-center gap-5">
          <span className="rounded-full bg-blue-50 px-4 py-1 text-sm font-bold text-blue-600">
            {porcentajeSeccion}% ({completed}/{total})
          </span>
          <span className={`text-xl text-slate-500 transition ${open ? "rotate-180" : ""}`}>
            ˅
          </span>
        </div>
      </button>

      {open && (
        <>
          <div className="mt-5 overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-slate-50 text-xs font-bold text-slate-500">
                <tr>
                  <th className="px-5 py-4 text-left">Documento</th>
                  <th className="px-5 py-4 text-left">Descripción</th>
                  <th className="px-5 py-4 text-center">Fecha de Carga</th>
                  <th className="px-5 py-4 text-center">Estado</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-slate-600">
                {items.map((item) => (
                  <tr key={item.documento}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`grid h-8 w-8 place-items-center rounded-md ${
                            item.loaded
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-red-50 text-red-500"
                          }`}
                        >
                          <FileIcon />
                        </span>
                        <span className="font-medium">{item.documento}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">{item.descripcion}</td>
                    <td className="px-5 py-4 text-center">{item.fecha}</td>
                    <td className="px-5 py-4 text-center">
                      <StatusPill loaded={item.loaded} label={item.estado} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-sm font-medium text-slate-500">
            Total requisitos: {completed} de {total}
          </p>
        </>
      )}
    </section>
  );
}

function NovedadesSection({ open, onToggle, items }) {
  return (
    <section className="mb-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <button onClick={onToggle} className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-700 text-white">
            <BellIcon />
          </span>
          <h3 className="text-lg font-bold text-slate-900">Novedades del Empleado</h3>
        </div>

        <span className={`text-xl text-slate-500 transition ${open ? "rotate-180" : ""}`}>
          ˅
        </span>
      </button>

      {open && (
        <div className="mt-5 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-slate-50 text-xs font-bold text-slate-500">
              <tr>
                <th className="px-5 py-4 text-left">Tipo de Novedad</th>
                <th className="px-5 py-4 text-center">Fecha Inicio</th>
                <th className="px-5 py-4 text-center">Fecha Fin</th>
                <th className="px-5 py-4 text-left">Descripción</th>
                <th className="px-5 py-4 text-center">Estado</th>
                <th className="px-5 py-4 text-left">Documento</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-600">
              {items.map((item) => (
                <tr key={`${item.tipo}-${item.inicio}`}>
                  <td className="px-5 py-4 font-semibold text-blue-600">{item.tipo}</td>
                  <td className="px-5 py-4 text-center">{item.inicio}</td>
                  <td className="px-5 py-4 text-center">{item.fin}</td>
                  <td className="px-5 py-4">{item.descripcion}</td>
                  <td className="px-5 py-4 text-center">
                    <span className="rounded-md bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                      {item.estado}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-semibold text-blue-600">{item.documento}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function StatusPill({ loaded, label }) {
  return (
    <span
      className={`rounded-md px-3 py-1 text-xs font-bold ${
        loaded
          ? "bg-emerald-50 text-emerald-700"
          : "bg-amber-50 text-amber-600"
      }`}
    >
      {label}
    </span>
  );
}

function UserAvatarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-16 w-16">
      <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
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
