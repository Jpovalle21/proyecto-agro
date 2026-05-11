// config/modules.jsx
// Datos centralizados de módulos, navegación y permisos por rol.
// Cuando conectes el backend, los permisos vendrán del JSON de la API
// y este archivo solo mantendrá los íconos y colores.

export const MODULES = [
    {
        id: "almacen",
        name: "Almacén",
        path: "/app/almacen",
        color: "#003049",
        colorDark: "#001D2D",
        description: "Inventario y stock",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 lg:w-10 lg:h-10">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        ),
        sidebarIcon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        ),
    },
    {
        id: "mantenimiento",
        name: "Mantenimiento",
        path: "/app/mantenimiento",
        color: "#8B6914",
        colorDark: "#6b510f",
        description: "Equipos y correctivos",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 lg:w-10 lg:h-10">
                <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
            </svg>
        ),
        sidebarIcon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
            </svg>
        ),
    },
    {
        id: "sistemas",
        name: "Sistemas",
        path: "/app/sistemas",
        color: "#2D6A8F",
        colorDark: "#1e4d6b",
        description: "TI y soporte técnico",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 lg:w-10 lg:h-10">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <path d="M8 21h8M12 17v4" />
            </svg>
        ),
        sidebarIcon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <path d="M8 21h8M12 17v4" />
            </svg>
        ),
    },
    {
        id: "gestion_humana",
        name: "Gestión Humana",
        path: "/app/gestion-humana",
        color: "#7E57C2",
        colorDark: "#5a3d8f",
        description: "Personal y nómina",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 lg:w-10 lg:h-10">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
        ),
        sidebarIcon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
        ),
    },
    {
        id: "veterinaria",
        name: "Veterinaria",
        path: "/app/veterinaria",
        color: "#C0392B",
        colorDark: "#922b20",
        description: "Sanidad animal",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 lg:w-10 lg:h-10">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
        ),
        sidebarIcon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
        ),
    },
    {
        id: "gerencia",
        name: "Gerencia",
        path: "/app/gerencia",
        color: "#1A1A2E",
        colorDark: "#111122",
        description: "Indicadores y reportes",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 lg:w-10 lg:h-10">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
        ),
        sidebarIcon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
        ),
    },
    {
        id: "sst",
        name: "S.S.T",
        path: "/app/sst",
        color: "#E67E22",
        colorDark: "#b8641a",
        description: "Seguridad y salud",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 lg:w-10 lg:h-10">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
        ),
        sidebarIcon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
        ),
    },
    {
        id: "produccion",
        name: "Producción",
        path: "/app/produccion",
        color: "#27AE60",
        colorDark: "#1e8449",
        description: "Procesos productivos",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 lg:w-10 lg:h-10">
                <path d="M2 20h20M5 20V10l7-7 7 7v10" />
                <path d="M9 20v-4h6v4" />
            </svg>
        ),
        sidebarIcon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M2 20h20M5 20V10l7-7 7 7v10" />
                <path d="M9 20v-4h6v4" />
            </svg>
        ),
    },
    {
        id: "ambiental",
        name: "Ambiental",
        path: "/app/ambiental",
        color: "#2E7D32",
        colorDark: "#1b5e20",
        description: "Procesos productivos",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 lg:w-10 lg:h-10">
                <path d="m17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14h-.3a1 1 0 0 1-.7-1.7L9 9h-.2A1 1 0 0 1 8 7.3L12 3l4 4.3a1 1 0 0 1-.8 1.7H15l3 3.3a1 1 0 0 1-.7 1.7H17Z" />
                <path d="M12 22v-3" />
            </svg>
        ),
        sidebarIcon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M2 20h20M5 20V10l7-7 7 7v10" />
                <path d="M9 20v-4h6v4" />
            </svg>
        ),
    },
    {
        id: "calidad",
        name: "Calidad",
        path: "/app/calidad",
        color: "#00838F",
        colorDark: "#005662",
        description: "Procesos productivos",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 lg:w-10 lg:h-10">
                <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                <path d="m9 12 2 2 4-4" />
            </svg>
        ),
        sidebarIcon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M2 20h20M5 20V10l7-7 7 7v10" />
                <path d="M9 20v-4h6v4" />
            </svg>
        ),
    },
    {
        id: "despacho",
        name: "Despacho",
        path: "/app/despacho",
        color: "#5D4037",
        colorDark: "#3e2723",
        description: "Procesos productivos",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 lg:w-10 lg:h-10">
                <path d="M13 6v5a1 1 0 0 0 1 1h6.102a1 1 0 0 1 .712.298l.898.91a1 1 0 0 1 .288.702V17a1 1 0 0 1-1 1h-3" /><path d="M5 18H3a1 1 0 0 1-1-1V8a2 2 0 0 1 2-2h12c1.1 0 2.1.8 2.4 1.8l1.176 4.2" />
                <path d="M9 18h5" />
                <circle cx="16" cy="18" r="2" /><circle cx="7" cy="18" r="2" />
            </svg>
        ),
        sidebarIcon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M2 20h20M5 20V10l7-7 7 7v10" />
                <path d="M9 20v-4h6v4" />
            </svg>
        ),
    },
    {
        id: "compras",
        name: "Compras",
        path: "/app/compras",
        color: "#669BBC",
        colorDark: "#4A7894",
        description: "Procesos productivos",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 lg:w-10 lg:h-10">
                <path d="m15 11-1 9" />
                <path d="m19 11-4-7" />
                <path d="M2 11h20" />
                <path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4" />
                <path d="M4.5 15.5h15" />
                <path d="m5 11 4-7" />
                <path d="m9 11 1 9" />
            </svg>
        ),
        sidebarIcon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M2 20h20M5 20V10l7-7 7 7v10" />
                <path d="M9 20v-4h6v4" />
            </svg>
        ),
    },
];

// Opciones de navegación del sidebar dentro de cada módulo, por rol.
// Cuando conectes el backend, esto se reemplaza por los permisos del JSON.
export const MODULE_NAV = {
    almacen: {
        administrador: [
            { id: "inventario", label: "Inventario", path: "inventario" },
            { id: "requisiciones", label: "Requisiciones", path: "requisiciones" },
            { id: "historial", label: "Historial", path: "historial" },
        ],
        tecnico: [
            { id: "entradas_salidas", label: "Entradas / Salidas", path: "entradas-salidas" },
            { id: "consultar_stock", label: "Consultar stock", path: "stock" },
            { id: "despachos", label: "Despachos pendientes", path: "despachos" },
            { id: "solicitud_materiales", label: "Solicitud de materiales", path: "solicitud-materiales" },
        ],
        externo: [],
    },
};

// Navegación del sidebar principal (dashboard hub)
export const MAIN_NAV = [
    {
        id: "perfil",
        label: "Perfil",
        path: "/app/perfil",
        icon: (
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
        ),
    },
    {
        id: "solicitudes",
        label: "Casos Solicitados",
        path: "/app/solicitudes",
        icon: (
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
        ),
    },
    {
        id: "opciones",
        label: "Otras opciones",
        path: "/app/opciones",
        icon: (
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
        ),
    },
];

// Usuario simulado — se reemplaza con la respuesta de /api/auth/me/
export const MOCK_USER = {
    id: 1,
    name: "Carlos Méndez",
    area: "Usuario de área",
    role: "administrador",
    avatar: null,
    modulos_permitidos: ["almacen", "mantenimiento", "sistemas", "gestion_humana", "veterinaria", "gerencia", "sst", "produccion", "ambiental", "compras", "despacho", "calidad"],
};

// Helper para obtener un módulo por ID
export function getModuleById(id) {
    return MODULES.find((m) => m.id === id) || null;
}

// Helper para obtener un módulo por path
export function getModuleByPath(path) {
    return MODULES.find((m) => m.path === path) || null;
}