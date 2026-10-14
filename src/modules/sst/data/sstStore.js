const STORAGE_KEYS = {
  incapacidades: "sst_incapacidades_v1",
  examenes: "sst_examenes_v1",
  solicitudes: "sst_solicitudes_v1",
};

const today = () => new Date().toISOString().slice(0, 10);

export const examStatusMeta = {
  vencido: {
    label: "Vencidos",
    tone: "red",
    description: "Examenes que ya superaron la vigencia anual.",
  },
  por_vencer: {
    label: "Por vencer",
    tone: "amber",
    description: "Examenes que vencen en los proximos 60 dias.",
  },
  vigente: {
    label: "Vigentes",
    tone: "emerald",
    description: "Examenes con mas de 60 dias de vigencia disponible.",
  },
  faltante: {
    label: "Faltan",
    tone: "slate",
    description: "Personal activo que no aparece en la matriz de examenes.",
  },
  sin_fecha: {
    label: "Sin fecha",
    tone: "sky",
    description: "Personas reportadas con examen, pero sin fecha cargada.",
  },
};

const seedIncapacidades = [
  {
    id: "inc-eps-001",
    fuente: "EPS",
    persona: "Jose Nelson Quintero Suarez",
    cedula: "1088026692",
    tipo: "General",
    dias: 2,
    fechaInicio: "2025-12-06",
    entidad: "Salud Total",
    seCobro: false,
    valor: 62634,
    pagada: false,
    observaciones: "No aplica menor a 3 dias",
  },
  {
    id: "inc-eps-002",
    fuente: "EPS",
    persona: "Jader Adolfo Tano Hernandez",
    cedula: "1073981420",
    tipo: "General",
    dias: 15,
    fechaInicio: "2025-12-18",
    entidad: "S.O.S",
    seCobro: true,
    valor: 469755,
    pagada: true,
    observaciones: "Radicada #20251222-271338",
  },
  {
    id: "inc-arl-001",
    fuente: "ARL",
    persona: "David Camilo Benavides Gallego",
    cedula: "1192803422",
    tipo: "Accidente laboral",
    dias: 4,
    fechaInicio: "2025-12-07",
    entidad: "Positiva",
    seCobro: true,
    valor: 125268,
    pagada: false,
    observaciones: "Se radica en el portal",
  },
  {
    id: "inc-arl-002",
    fuente: "ARL",
    persona: "Jhon Alberto Villada Villada",
    cedula: "1097407012",
    tipo: "Accidente laboral",
    dias: 3,
    fechaInicio: "2025-11-07",
    entidad: "Positiva",
    seCobro: true,
    valor: 93951,
    pagada: true,
    observaciones: "Se radica en el portal",
  },
  {
    id: "inc-eps-003",
    fuente: "EPS",
    persona: "Aymer Agudelo Perdomo",
    cedula: "1094940377",
    tipo: "General",
    dias: 1,
    fechaInicio: "2025-12-20",
    entidad: "Salud Total",
    seCobro: false,
    valor: 31317,
    pagada: false,
    observaciones: "No aplica menor a 3 dias",
  },
];

const seedExamenes = [
  {
    id: "ex-vencido-001",
    estado: "vencido",
    nombre: "Luis Fernando Carvajal Lemus",
    cedula: "1007361088",
    cargo: "Mantenimiento",
    tipoExamen: "Ingreso, Periodico, Alturas",
    fechaExamen: "2025-06-27",
    fechaVencimiento: "2026-06-27",
    dias: -102,
    concepto: "Apto para trabajos en alturas",
    observacion: "",
  },
  {
    id: "ex-vencido-002",
    estado: "vencido",
    nombre: "Andres Fernando Aranda Villada",
    cedula: "1094978349",
    cargo: "Tecnico en sistemas",
    tipoExamen: "Ingreso",
    fechaExamen: "2025-07-11",
    fechaVencimiento: "2026-07-11",
    dias: -88,
    concepto: "Apto para el cargo",
    observacion: "",
  },
  {
    id: "ex-por-001",
    estado: "por_vencer",
    nombre: "Jhonier Grajales Borja",
    cedula: "1010118039",
    cargo: "Aux. mantenimiento",
    tipoExamen: "Ingreso",
    fechaExamen: "2025-10-08",
    fechaVencimiento: "2026-10-08",
    dias: 1,
    concepto: "Apto para manipulacion de alimentos",
    observacion: "En la matriz figura como Jhonier Grajales Borjas.",
  },
  {
    id: "ex-por-002",
    estado: "por_vencer",
    nombre: "Valentina Ospina Cruz",
    cedula: "1115089776",
    cargo: "Calidad",
    tipoExamen: "Periodico",
    fechaExamen: "2025-11-25",
    fechaVencimiento: "2026-11-25",
    dias: 49,
    concepto: "Apto para manipulacion de alimentos",
    observacion: "",
  },
  {
    id: "ex-vigente-001",
    estado: "vigente",
    nombre: "David Camilo Benavides Gallego",
    cedula: "1192803422",
    cargo: "Operario",
    tipoExamen: "Post incapacidad",
    fechaExamen: "2026-01-08",
    fechaVencimiento: "2027-01-08",
    dias: 93,
    concepto: "Con restricciones para el cargo",
    observacion: "",
  },
  {
    id: "ex-vigente-002",
    estado: "vigente",
    nombre: "Cindy Julieth Ganan Bueno",
    cedula: "1004831566",
    cargo: "Operario",
    tipoExamen: "Ingreso",
    fechaExamen: "2026-05-12",
    fechaVencimiento: "2027-05-12",
    dias: 217,
    concepto: "Sin restricciones para el cargo",
    observacion: "",
  },
  {
    id: "ex-falta-001",
    estado: "faltante",
    nombre: "Martiniano Lopez Valle",
    cedula: "98681645",
    cargo: "Sin registrar",
    tipoExamen: "",
    fechaExamen: "",
    fechaVencimiento: "",
    dias: null,
    concepto: "",
    observacion: "No aparece en la matriz de examenes medicos.",
  },
  {
    id: "ex-falta-002",
    estado: "faltante",
    nombre: "Yeraldin Orozco Idarraga",
    cedula: "1098311441",
    cargo: "Sin registrar",
    tipoExamen: "",
    fechaExamen: "",
    fechaVencimiento: "",
    dias: null,
    concepto: "",
    observacion: "No aparece en la matriz de examenes medicos.",
  },
  {
    id: "ex-sin-fecha-001",
    estado: "sin_fecha",
    nombre: "Harby Aldivier Tapasco Andica",
    cedula: "9911866",
    cargo: "Sin registrar",
    tipoExamen: "Reportado",
    fechaExamen: "",
    fechaVencimiento: "",
    dias: null,
    concepto: "",
    observacion: "Reportado con examen; falta cargar matriz actualizada.",
  },
];

const seedSolicitudes = [
  {
    id: "sst-sol-001",
    tipo: "Incidente",
    area: "Produccion",
    reporta: "Jefe de produccion",
    fecha: "2026-10-08",
    prioridad: "Alta",
    estado: "En revision",
    titulo: "Golpe leve durante desplazamiento en planta",
    descripcion: "Se reporta incidente para revision de SST y registro de acciones.",
    acciones: "Pendiente investigacion y cierre.",
  },
  {
    id: "sst-sol-002",
    tipo: "Solicitud",
    area: "Mantenimiento",
    reporta: "Tecnico de mantenimiento",
    fecha: "2026-10-08",
    prioridad: "Media",
    estado: "Recibido",
    titulo: "Revision de EPP para trabajo en alturas",
    descripcion: "Solicitan validacion de elementos antes de actividad programada.",
    acciones: "",
  },
];

export const excelReferenceSummary = {
  incapacidades: {
    epsRegistros: 116,
    arlRegistros: 29,
    epsDias: 632,
    arlDias: 190,
    epsValor: 19573344.219,
    arlValor: 5950230,
    epsPendientesPago: 94,
    arlPendientesPago: 14,
  },
  examenes: {
    personalActivo: 86,
    faltan: 18,
    vencidos: 13,
    porVencer: 12,
    vigentes: 40,
    sinFecha: 3,
    noActivos: 82,
    fechaCorte: "2026-10-07",
  },
};

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadIncapacidades() {
  return readStorage(STORAGE_KEYS.incapacidades, seedIncapacidades);
}

export function saveIncapacidades(records) {
  writeStorage(STORAGE_KEYS.incapacidades, records);
}

export function loadExamenes() {
  return readStorage(STORAGE_KEYS.examenes, seedExamenes);
}

export function saveExamenes(records) {
  writeStorage(STORAGE_KEYS.examenes, records);
}

export function loadSolicitudesSst() {
  return readStorage(STORAGE_KEYS.solicitudes, seedSolicitudes);
}

export function saveSolicitudesSst(records) {
  writeStorage(STORAGE_KEYS.solicitudes, records);
}

export function createSolicitudSst(values) {
  return {
    id: crypto.randomUUID(),
    fecha: today(),
    estado: "Recibido",
    acciones: "",
    ...values,
  };
}

export function getExamDueDate(fechaExamen) {
  if (!fechaExamen) return "";
  const date = new Date(`${fechaExamen}T00:00:00`);
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().slice(0, 10);
}

export function getExamStatus(fechaVencimiento) {
  if (!fechaVencimiento) return "sin_fecha";
  const current = new Date(`${today()}T00:00:00`);
  const due = new Date(`${fechaVencimiento}T00:00:00`);
  const days = Math.ceil((due - current) / (1000 * 60 * 60 * 24));

  if (days < 0) return "vencido";
  if (days <= 60) return "por_vencer";
  return "vigente";
}

export function getDaysToDue(fechaVencimiento) {
  if (!fechaVencimiento) return null;
  const current = new Date(`${today()}T00:00:00`);
  const due = new Date(`${fechaVencimiento}T00:00:00`);
  return Math.ceil((due - current) / (1000 * 60 * 60 * 24));
}

export function money(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value || 0);
}
