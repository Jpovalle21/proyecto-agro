import { useState } from "react";

export default function Ingresos() {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    documento: "",
    tipoDocumento: "Cédula de ciudadanía",
    genero: "Masculino",
    area: "",
    rh: "",
    turno: "",
    tipoContrato: "Término indefinido",
    fechaIngreso: today,
    fechaNacimiento: today,
    edad: "",
    eps: "Sanitas",
    cesantias: "Porvenir",
    pension: "Porvenir",
    arl: "ARL Bolívar",
    direccion: "",
    ciudad: "",
    telefono: "",
    correo: "",
    escolaridad: "Técnico",
    estadoCivil: "Soltero",
    estrato: "",
    nucleoFamiliar: "",
    contactoEmergencia: "",
    telefonoEmergencia: "",
    parentescoEmergencia: "",
  });

  const [datosGuardados, setDatosGuardados] = useState({
    eps: form.eps,
    pension: form.pension,
  });

  const handleChange = (field) => (event) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: event.target.value,
    }));
  };

  const guardarDatosPersonales = () => {
    setDatosGuardados({
      eps: form.eps,
      pension: form.pension,
    });
  };

  const camposDatosPersonales = Object.values(form);
  const datosCompletos = camposDatosPersonales.filter(
    (value) => String(value).trim() !== ""
  ).length;

  const porcentajeDatosPersonales = Math.round(
    (datosCompletos / camposDatosPersonales.length) * 100
  );

  const aporteDatosPersonalesTotal = porcentajeDatosPersonales / 3;

  return (
    <div className="min-h-full bg-[#f8fafc] px-8 py-8 text-slate-800">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Datos Personales
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Información básica del colaborador para completar el proceso de ingreso.
          </p>
        </div>

        <div
          className="w-18 h-18 rounded-full flex items-center justify-center"
          style={{
            background: `conic-gradient(#2563eb ${porcentajeDatosPersonales * 3.6}deg, #e2e8f0 0deg)`,
          }}
        >
          <div className="w-14 h-14 rounded-full bg-[#f8fafc] flex items-center justify-center">
            <span className="text-lg font-semibold text-slate-800">
              {porcentajeDatosPersonales}%
            </span>
          </div>
        </div>
      </div>

      <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Field label="Nombre" value={form.nombres} onChange={handleChange("nombres")} placeholder="Juan Pablo" />

          <Field label="Apellidos" value={form.apellidos} onChange={handleChange("apellidos")} placeholder="Ovalle Gonzalez" />

          <Field label="Documento de Identidad" value={form.documento} onChange={handleChange("documento")} placeholder="1.234.567.890" />

          <SelectField
            label="Tipo de Documento"
            value={form.tipoDocumento}
            onChange={handleChange("tipoDocumento")}
            options={["Cédula de ciudadanía", "PPT", "Tarjeta de identidad", "Pasaporte"]}
          />

          <SelectField
            label="Género"
            value={form.genero}
            onChange={handleChange("genero")}
            options={["Masculino", "Femenino", "Otro"]}
          />

          <SelectField
            label="Área"
            value={form.area}
            onChange={handleChange("area")}
            options={["Operativo", "Administrativo"]}
            placeholder="Selecciona un área"
          />

          <SelectField
            label="RH"
            value={form.rh}
            onChange={handleChange("rh")}
            options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
            placeholder="Selecciona RH"
          />

          <SelectField
            label="Turno"
            value={form.turno}
            onChange={handleChange("turno")}
            options={["Diurno", "Nocturno"]}
          />

          <SelectField
            label="Tipo de Contrato"
            value={form.tipoContrato}
            onChange={handleChange("tipoContrato")}
            options={["Término indefinido", "Término fijo", "Obra o labor", "Aprendizaje", "Prestación de servicios"]}
          />

          <DateField label="Fecha de Ingreso" value={form.fechaIngreso} onChange={handleChange("fechaIngreso")} />
          <DateField label="Fecha de Nacimiento" value={form.fechaNacimiento} onChange={handleChange("fechaNacimiento")} />

          <Field label="Edad" value={form.edad} onChange={handleChange("edad")} placeholder="30" />

          <SelectField label="EPS" value={form.eps} onChange={handleChange("eps")} options={["Sanitas", "Sura", "Nueva EPS", "Salud Total", "SOS"]} />

          <SelectField
            label="Cesantías"
            value={form.cesantias}
            onChange={handleChange("cesantias")}
            options={["Porvenir"]}
            disabled
          />

          <SelectField label="Fondo de Pensión" value={form.pension} onChange={handleChange("pension")} options={["Porvenir", "Protección", "Colfondos", "Colpensiones"]} />

          <SelectField
            label="ARL"
            value={form.arl}
            onChange={handleChange("arl")}
            options={["ARL Bolívar"]}
            disabled
          />

          <Field label="Dirección" value={form.direccion} onChange={handleChange("direccion")} placeholder="Calle 123 #45-67" />
          <Field label="Ciudad" value={form.ciudad} onChange={handleChange("ciudad")} placeholder="Medellín" />
          <Field label="Teléfono" value={form.telefono} onChange={handleChange("telefono")} placeholder="123 456 7890" />
          <Field label="Correo" value={form.correo} onChange={handleChange("correo")} type="email" placeholder="juan.pablo@example.com" />

          <SelectField label="Escolaridad" value={form.escolaridad} onChange={handleChange("escolaridad")} options={["Ninguno", "Primaria", "Bachiller", "Técnico", "Tecnólogo", "Profesional", "Especialización"]} />
          <SelectField label="Estado Civil" value={form.estadoCivil} onChange={handleChange("estadoCivil")} options={["Soltero", "Casado", "Unión libre", "Separado", "Viudo"]} />

          <Field label="Estrato" value={form.estrato} onChange={handleChange("estrato")} type="number" placeholder="3" />
          <Field label="Núcleo Familiar" value={form.nucleoFamiliar} onChange={handleChange("nucleoFamiliar")} placeholder="3 personas" />

          <Field label="Contacto de Emergencia" value={form.contactoEmergencia} onChange={handleChange("contactoEmergencia")} placeholder="Nombre completo" />
          <Field label="Teléfono de Emergencia" value={form.telefonoEmergencia} onChange={handleChange("telefonoEmergencia")} placeholder="300 000 0000" />
          <Field label="Parentesco" value={form.parentescoEmergencia} onChange={handleChange("parentescoEmergencia")} placeholder="Madre, padre, pareja..." />
        </div>

        <div className="flex justify-end mt-10">
        <button
          type="button"
          onClick={guardarDatosPersonales}
          className="px-7 py-3 rounded-lg bg-blue-600 text-white text-sm font-semibold shadow-md hover:bg-blue-700 transition"
        >
          Guardar Cambios
        </button>
      </div>
    </section>

      <Afiliaciones eps={datosGuardados.eps}
         pension={datosGuardados.pension} />
      <Inducciones />
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, className = "" }) {
  return (
    <label className={className}>
      <span className="block text-sm font-semibold text-slate-600 mb-3">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-12 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  className = "",
}) {
  return (
    <label className={className}>
      <span className="block text-sm font-semibold text-slate-600 mb-3">
        {label}
      </span>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full h-12 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function DateField({ label, value, onChange, className = "" }) {
  return (
    <label className={className}>
      <span className="block text-sm font-semibold text-slate-600 mb-3">
        {label}
      </span>
      <input
        type="date"
        value={value}
        onChange={onChange}
        className="w-full h-12 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
      />
    </label>
  );
}


function Afiliaciones({ eps, pension }) {
  const [documentos, setDocumentos] = useState({
    arl: null,
    eps: null,
    pension: null,
    caja: null,
  });

  const documentosCargados = Object.values(documentos).filter(Boolean).length;
  const porcentajeAfiliaciones = Math.round((documentosCargados / 4) * 100);
  const aporteAfiliacionesTotal = porcentajeAfiliaciones / 3;

  const handleDocumento = (id) => (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setDocumentos((current) => ({
      ...current,
      [id]: file,
    }));
  };

  const afiliaciones = [
    {
      id: "arl",
      title: "ARL",
      subtitle: "Administradora de Riesgos Laborales",
      value: "ARL Bolívar",
      icon: (
        <path d="M16 11c1.66 0 3-1.34 3-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3ZM8 11c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13Zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5Z" />
      ),
    },
    {
      id: "eps",
      title: "SALUD (EPS)",
      value: eps,
      icon: (
        <path d="M16.5 3A4.5 4.5 0 0 0 12 7.5V10H9.5V7.5a4.5 4.5 0 1 0-9 0V16a5 5 0 0 0 10 0v-2H12v2a5 5 0 0 0 10 0V7.5A4.5 4.5 0 0 0 16.5 3ZM7 16a1.5 1.5 0 0 1-3 0V7.5a1.5 1.5 0 0 1 3 0V16Zm11.5 0a1.5 1.5 0 0 1-3 0V7.5a1.5 1.5 0 0 1 3 0V16Z" />
      ),
    },
    {
      id: "pension",
      title: "PENSIÓN",
      value: pension,
      icon: (
        <path d="M12 2 4 6v6c0 5.55 3.84 9.74 8 10 4.16-.26 8-4.45 8-10V6l-8-4Zm0 3.3 5 2.5V12c0 3.56-2.16 6.4-5 6.93C9.16 18.4 7 15.56 7 12V7.8l5-2.5Zm-2 5.2h4v2h-4v-2Zm0 3.5h4v2h-4v-2Z" />
      ),
    },
    {
      id: "caja",
      title: "CAJA DE COMPENSACIÓN",
      value: "Comfenalco",
      icon: (
        <path d="M12 2 1 21h22L12 2Zm1 16h-2v-2h2v2Zm0-4h-2V9h2v5Z" />
      ),
    },
  ];

  return (
    <section className="mt-12 pb-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            Afiliaciones
          </h2>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Documentos y entidades asociadas al ingreso del colaborador.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          <div
            className="w-18 h-18 rounded-full flex items-center justify-center shadow-sm bg-white"
            style={{
              background: `conic-gradient(#2563eb ${porcentajeAfiliaciones * 3.6}deg, #e2e8f0 0deg)`,
            }}
          >
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
              <span className="text-lg font-semibold text-slate-800">
                {porcentajeAfiliaciones}%
              </span>
            </div>
          </div>
          <p className="text-base font-semibold text-slate-700">
            Documentos<br />cargados
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="space-y-5">
          {afiliaciones.map((item) => {
            const done = Boolean(documentos[item.id]);
            const status = done ? "Documento cargado" : "Pendiente de cargar";
            const action = done ? "Ver documento" : "Cargar documento";

            return (
              <article
                key={item.title}
                className="group flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-5">
                  <div
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${
                      done
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-500"
                    }`}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
                      {item.icon}
                    </svg>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {item.title}{" "}
                      {item.subtitle && (
                        <span className="text-sm font-semibold text-slate-500">
                          ({item.subtitle})
                        </span>
                      )}
                    </h3>
                    <p className={`mt-3 text-sm font-semibold ${done ? "text-blue-600" : "text-slate-500"}`}>
                      {item.value}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className={`flex items-center gap-3 text-sm font-medium ${done ? "text-slate-600" : "text-slate-500"}`}>
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full border-2 ${
                        done
                          ? "border-emerald-500 text-emerald-600"
                          : "border-amber-400 text-amber-500"
                      }`}
                    >
                      {done ? "✓" : "!"}
                    </span>
                    {status}
                  </div>

                  <label
                    className={`h-11 min-w-40 rounded-lg border px-5 text-sm font-bold transition flex items-center justify-center cursor-pointer ${
                      done
                        ? "border-blue-200 text-blue-600 hover:bg-blue-50"
                        : "border-blue-200 bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {action}
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleDocumento(item.id)}
                    />
                  </label>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}


function Inducciones() {
  const areas = [
    { name: "Talento Humano", status: "Firmado", date: "10/05/2024", done: true },
    { name: "Ambiental", status: "Firmado", date: "10/05/2024", done: true },
    { name: "SST", status: "Firmado", date: "10/05/2024", done: true },
    { name: "Almacén", status: "Pendiente", done: false },
    { name: "Calidad", status: "Pendiente", done: false, active: true },
    { name: "Producción", status: "Pendiente", done: false },
    { name: "Mantenimiento", status: "Pendiente", done: false },
    { name: "Veterinaria", status: "Pendiente", done: false },
    { name: "Auxiliar Contable", status: "Pendiente", done: false },
  ];

  return (
    <section className="mt-12 pb-14">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            Inducciones
          </h2>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Seguimiento de áreas firmadas y documento de inducción del colaborador.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          <div className="w-18 h-18 rounded-full border-8 border-blue-600 border-l-slate-200 border-b-slate-200 flex items-center justify-center shadow-sm bg-white">
            <span className="text-xl font-semibold text-slate-800">44%</span>
          </div>
          <p className="text-base font-semibold text-slate-700">
            Inducciones<br />completadas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-5">
        <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-600 mb-5">
            Áreas de Inducción
          </h3>

          <div className="overflow-hidden rounded-xl border border-slate-200">
            {areas.map((area, index) => (
              <div
                key={area.name}
                className={`grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-4 text-sm ${
                  index !== areas.length - 1 ? "border-b border-slate-100" : ""
                } ${area.active ? "bg-blue-50/40" : "bg-white"}`}
              >
                <span
                  className={`font-medium ${
                    area.active
                      ? "w-fit rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-blue-600"
                      : "text-slate-600"
                  }`}
                >
                  {area.name}
                </span>

                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs font-bold ${
                    area.done
                      ? "border-emerald-500 text-emerald-600"
                      : "border-amber-400 text-amber-500"
                  }`}
                >
                  {area.done ? "✓" : "!"}
                </span>

                <div className="text-right">
                  <p
                    className={`text-xs font-semibold ${
                      area.done ? "text-emerald-500" : "text-amber-500"
                    }`}
                  >
                    {area.status}
                  </p>
                  {area.date && (
                    <p className="mt-1 text-xs text-slate-500">
                      {area.date}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-600 mb-5">
            Documento de Inducción
          </h3>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 text-slate-500">
              <div className="flex items-center gap-3">
                <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-white">
                  ‹
                </button>
                <span className="rounded-md bg-white px-3 py-1 text-sm font-semibold text-slate-700 shadow-sm">
                  1
                </span>
                <span className="text-sm font-semibold text-slate-600">/ 5</span>
              </div>

              <div className="flex items-center gap-3 text-slate-500">
                <button className="text-xl leading-none hover:text-blue-600">⌕</button>
                <button className="text-xl leading-none hover:text-blue-600">⊞</button>
                <button className="text-xl leading-none hover:text-blue-600">↗</button>
                <button className="text-xl leading-none hover:text-blue-600">⋮</button>
              </div>
            </div>

            <div className="max-h-[690px] overflow-y-auto bg-slate-100 px-5 py-6">
              <div className="mx-auto min-h-[650px] max-w-[560px] bg-white px-14 py-16 text-slate-700 shadow-sm">
                <h4 className="text-center text-2xl font-bold text-slate-900">
                  ACTA DE INDUCCIÓN
                </h4>

                <p className="mt-6 text-center text-lg font-bold text-slate-900">
                  Bienvenido a nuestra empresa
                </p>

                <p className="mt-8 leading-8 text-slate-600">
                  El objetivo de este documento es dar a conocer al colaborador
                  la información general sobre la empresa, sus políticas,
                  procedimientos y responsabilidades dentro de su área de trabajo.
                </p>

                <p className="mt-8 leading-8 text-slate-600">
                  He recibido, leído y comprendido la información proporcionada
                  en el proceso de inducción.
                </p>

                <div className="mt-20">
                  <p className="font-serif text-5xl italic text-slate-900">
                    Juan
                  </p>
                  <div className="mt-3 h-px w-64 bg-slate-300" />
                  <p className="mt-3 font-medium text-slate-600">
                    Firma del Empleado
                  </p>
                </div>

                <p className="mt-10 font-medium text-slate-600">
                  Fecha: 10/05/2024
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-md transition hover:bg-blue-700">
              Firmar Inducción
            </button>
          </div>
        </section>
      </div>
    </section>
  );
}
