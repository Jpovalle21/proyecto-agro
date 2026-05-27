const PRODUCTS_KEY = "agro_almacen_productos";
const MOVEMENTS_KEY = "agro_almacen_movimientos";
const REQUISITIONS_KEY = "agro_almacen_requisiciones";

export const defaultProducts = [
  {
    id: "GN-001",
    nombre: "Guantes de Nitrilo Talla L",
    codigo: "GN-001",
    categoria: "Elementos de proteccion",
    proveedor: "Proveedor ABC S.A.",
    ubicacion: "Estante A-01",
    unidad: "caja",
    stock: 150,
    stockMinimo: 40,
    img: "https://instrumentalia.com.co/44166-large_default/guante-de-nitrilo-azul-talla-l-caja-100-unidades.jpg",
  },
  {
    id: "CS-002",
    nombre: "Casco de Seguridad",
    codigo: "CS-002",
    categoria: "Elementos de proteccion",
    proveedor: "Seguridad Industrial S.A.",
    ubicacion: "Estante A-02",
    unidad: "unidad",
    stock: 85,
    stockMinimo: 12,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjCc1nQdy4OCLl_wUU8p15VbjTQV1pUJM7XA&s",
  },
  {
    id: "LS-003",
    nombre: "Lentes de Seguridad",
    codigo: "LS-003",
    categoria: "Elementos de proteccion",
    proveedor: "Lo Encuentras",
    ubicacion: "Estante A-03",
    unidad: "unidad",
    stock: 60,
    stockMinimo: 20,
    img: "https://www.loencuentras.com.co/1509-large_default/gafas-de-seguridad-ajustables.jpg",
  },
  {
    id: "BS-004",
    nombre: "Botas de Seguridad",
    codigo: "BS-004",
    categoria: "Dotacion",
    proveedor: "Bata Industrials",
    ubicacion: "Bodega B-01",
    unidad: "par",
    stock: 40,
    stockMinimo: 15,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_LdxHw0CE7FlWkken5tcf2lEOf4R_uvnNYQ&s",
  },
  {
    id: "UO-005",
    nombre: "Uniforme operario",
    codigo: "UO-005",
    categoria: "Dotacion",
    proveedor: "Confecciones Agro",
    ubicacion: "Bodega B-02",
    unidad: "unidad",
    stock: 75,
    stockMinimo: 25,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr02azXmO6H0BgWfoLq_WbY_jH4ffh-Ravng&s",
  },
  {
    id: "BP-006",
    nombre: "Botas de Produccion",
    codigo: "BP-006",
    categoria: "Dotacion",
    proveedor: "Bata Industrials",
    ubicacion: "Bodega B-03",
    unidad: "par",
    stock: 30,
    stockMinimo: 30,
    img: "https://www.bataindustrials.com.co/wp-content/uploads/2015/06/lactica-802-1468-450x450.png",
  },
  {
    id: "MK-007",
    nombre: "Mascarilla KN95",
    codigo: "MK-007",
    categoria: "Elementos de proteccion",
    proveedor: "Proveedor Bioseguridad",
    ubicacion: "Estante C-01",
    unidad: "unidad",
    stock: 120,
    stockMinimo: 50,
    img: "https://http2.mlstatic.com/D_NQ_NP_862775-CBT96010636006_102025-O.webp",
  },
  {
    id: "AG-008",
    nombre: "Rodamiento",
    codigo: "AG-008",
    categoria: "Repuestos",
    proveedor: "Proveedor Mantenimiento",
    ubicacion: "Estante D-04",
    unidad: "unidad",
    stock: 55,
    stockMinimo: 10,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_wxac63LBJuz3laTDJteLPOdm-rarbjyq1Q&s",
  },
];

export const defaultMovements = [
  {
    id: "MOV-001",
    tipo: "entrada",
    fecha: "2024-05-15T10:30:00",
    fechaEntrega: "2024-05-15",
    elemento: "Guantes de Nitrilo Talla L",
    item: "GN-001",
    cantidad: 100,
    area: "Almacen",
    observacion: "Registro de factura FAC-0012345",
    firma: "Administrador",
  },
  {
    id: "MOV-002",
    tipo: "salida",
    fecha: "2024-05-15T11:20:00",
    fechaEntrega: "2024-05-15",
    elemento: "Guantes de Nitrilo Talla L",
    item: "GN-001",
    cantidad: 20,
    area: "Produccion",
    observacion: "Entrega para turno dia",
    firma: "Juan Pablo",
  },
  {
    id: "MOV-003",
    tipo: "salida",
    fecha: "2024-05-14T15:05:00",
    fechaEntrega: "2024-05-14",
    elemento: "Casco de Seguridad",
    item: "CS-002",
    cantidad: 5,
    area: "Mantenimiento",
    observacion: "Entrega a cuadrilla de mantenimiento",
    firma: "Andres Aranda",
  },
  {
    id: "MOV-004",
    tipo: "solicitud",
    fecha: "2024-05-16T08:45:00",
    fechaEntrega: "2024-05-16",
    elemento: "Mascarilla KN95",
    item: "MK-007",
    cantidad: 60,
    area: "SST",
    observacion: "Solicitud pendiente de entrega",
    firma: "Andres Aranda",
  },
  {
    id: "MOV-005",
    tipo: "entrada",
    fecha: "2024-05-18T09:15:00",
    fechaEntrega: "2024-05-18",
    elemento: "Rodamiento",
    item: "AG-008",
    cantidad: 40,
    area: "Almacen",
    observacion: "Compra proveedor externo",
    firma: "Administrador",
  },
];

export const defaultRequisitions = [
  {
    id: "REQ-00012",
    codigo: "REQ-00012",
    fecha: "2024-05-15",
    solicitante: "Juan Pablo",
    cargo: "Supervisor de turno",
    area: "Produccion",
    destino: "Produccion",
    prioridad: "Alta",
    estado: "pendiente",
    observacion: "Elementos requeridos para el turno de empaque.",
    items: [
      { productoId: "GN-001", codigo: "GN-001", nombre: "Guantes de Nitrilo Talla L", cantidad: 12 },
      { productoId: "MK-007", codigo: "MK-007", nombre: "Mascarilla KN95", cantidad: 20 },
    ],
  },
  {
    id: "REQ-00011",
    codigo: "REQ-00011",
    fecha: "2024-05-14",
    solicitante: "Andres Aranda",
    cargo: "Analista de calidad",
    area: "Calidad",
    destino: "Calidad",
    prioridad: "Media",
    estado: "pendiente",
    observacion: "Reposicion para inspecciones de linea.",
    items: [
      { productoId: "LS-003", codigo: "LS-003", nombre: "Lentes de Seguridad", cantidad: 10 },
      { productoId: "GN-001", codigo: "GN-001", nombre: "Guantes de Nitrilo Talla L", cantidad: 6 },
    ],
  },
  {
    id: "REQ-00010",
    codigo: "REQ-00010",
    fecha: "2024-05-13",
    solicitante: "Cristian Rojas",
    cargo: "Tecnico de mantenimiento",
    area: "Mantenimiento",
    destino: "Mantenimiento",
    prioridad: "Media",
    estado: "aceptada",
    observacion: "Dotacion para ingreso a zona de maquinas.",
    items: [
      { productoId: "CS-002", codigo: "CS-002", nombre: "Casco de Seguridad", cantidad: 3 },
      { productoId: "BS-004", codigo: "BS-004", nombre: "Botas de Seguridad", cantidad: 2 },
    ],
  },
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getStorageValue(key, fallback) {
  if (typeof window === "undefined") return clone(fallback);

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return clone(fallback);

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : clone(fallback);
  } catch {
    return clone(fallback);
  }
}

function setStorageValue(key, value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadProducts() {
  const storedProducts = getStorageValue(PRODUCTS_KEY, defaultProducts);

  return storedProducts.map((product) => ({
    ...product,
    stock: Number(product.stock) || 0,
    stockMinimo: Number(product.stockMinimo) || 0,
  }));
}

export function saveProducts(products) {
  setStorageValue(PRODUCTS_KEY, products);
}

export function loadMovements() {
  return getStorageValue(MOVEMENTS_KEY, defaultMovements);
}

export function saveMovements(movements) {
  setStorageValue(MOVEMENTS_KEY, movements);
}

export function loadRequisitions() {
  return getStorageValue(REQUISITIONS_KEY, defaultRequisitions).map((requisition) => ({
    ...requisition,
    items: Array.isArray(requisition.items)
      ? requisition.items.map((item) => ({
          ...item,
          cantidad: Number(item.cantidad) || 0,
        }))
      : [],
  }));
}

export function saveRequisitions(requisitions) {
  setStorageValue(REQUISITIONS_KEY, requisitions);
}

export function formatDate(value) {
  if (!value) return "Sin fecha";

  const [year, month, day] = value.slice(0, 10).split("-");
  if (!year || !month || !day) return value;

  return `${day}/${month}/${year}`;
}

export function formatDateTime(value) {
  if (!value) return "Sin fecha";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function createSalidaMovement({
  product,
  products,
  cantidad,
  area,
  fechaEntrega,
  firma,
  firmaImagen,
  observacion,
  requisicion,
}) {
  const lines = products?.length
    ? products
    : [{ product, cantidad }];

  const items = lines.map((line) => ({
    productoId: line.product.id,
    codigo: line.product.codigo,
    nombre: line.product.nombre,
    cantidad: Number(line.cantidad) || 0,
  }));

  return {
    id: `SAL-${Date.now()}`,
    tipo: "salida",
    fecha: new Date().toISOString(),
    fechaEntrega,
    elemento: items.map((item) => `${item.nombre} (${item.cantidad})`).join(", "),
    item: items.map((item) => item.codigo).join(", "),
    cantidad: items.reduce((total, item) => total + item.cantidad, 0),
    area,
    observacion,
    firma,
    firmaImagen,
    requisicion,
    items,
  };
}
