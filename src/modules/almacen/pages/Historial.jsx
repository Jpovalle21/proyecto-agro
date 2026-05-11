import { useMemo, useState } from "react";
import "../almacen.css";

const movimientos = [
  {
    tipo: "entrada",
    fecha: "15/05/2024 10:30",
    elemento: "Guantes de Nitrilo Talla L",
    item: "GN-001",
    cantidad: 100,
    area: "Almacén",
    observacion: "Registro de factura FAC-0012345",
    firma: "Administrador",
  },
  {
    tipo: "salida",
    fecha: "15/05/2024 11:20",
    elemento: "Guantes de Nitrilo Talla L",
    item: "GN-001",
    cantidad: 20,
    area: "Producción",
    observacion: "Entrega para turno día",
    firma: "Juan Pablo",
  },
  {
    tipo: "solicitud",
    fecha: "16/05/2024 08:45",
    elemento: "Tapabocas Industrial",
    item: "TB-014",
    cantidad: 60,
    area: "SST",
    observacion: "Solicitud pendiente de entrega",
    firma: "Andres Aranda",
  },
  {
    tipo: "salida",
    fecha: "17/05/2024 14:10",
    elemento: "Botas de Seguridad",
    item: "BS-022",
    cantidad: 8,
    area: "Mantenimiento",
    observacion: "Entrega de dotación",
    firma: "Juan Jose",
  },
  {
    tipo: "entrada",
    fecha: "18/05/2024 09:15",
    elemento: "Alcohol Antiséptico",
    item: "AL-007",
    cantidad: 40,
    area: "Almacén",
    observacion: "Compra proveedor externo",
    firma: "Administrador",
  },
];

const tabs = [
  { id: "entrada", label: "Entradas" },
  { id: "salida", label: "Salidas" },
  { id: "todos", label: "Entradas y Salidas" },
  { id: "solicitud", label: "Otras Solicitudes" },
];

export default function Historial() {
  const [activeTab, setActiveTab] = useState("todos");
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  const historialFiltrado = useMemo(() => {
    return movimientos.filter((movimiento) => {
      const coincideTab =
        activeTab === "todos" || movimiento.tipo === activeTab;

      const coincideTipo =
        tipoFiltro === "todos" || movimiento.tipo === tipoFiltro;

      const texto = `${movimiento.tipo} ${movimiento.elemento} ${movimiento.item} ${movimiento.area} ${movimiento.observacion} ${movimiento.firma}`.toLowerCase();

      const coincideBusqueda = texto.includes(busqueda.toLowerCase());

      return coincideTab && coincideTipo && coincideBusqueda;
    });
  }, [activeTab, tipoFiltro, busqueda]);

  const exportarCSV = () => {
    const headers = [
      "Tipo",
      "Fecha",
      "Elemento entregado",
      "Item",
      "Cantidad",
      "Área",
      "Observación",
      "Firma",
    ];

    const rows = historialFiltrado.map((m) => [
      m.tipo,
      m.fecha,
      m.elemento,
      m.item,
      m.cantidad,
      m.area,
      m.observacion,
      m.firma,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "historial-almacen.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-full bg-[#f8fafc] p-6 text-slate-800">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Historial
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Consulta movimientos, entregas y solicitudes realizadas dentro del almacén.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Registros visibles
          </p>
          <p className="mt-1 text-2xl font-bold text-[rgb(0,48,73)]">
            {historialFiltrado.length}
          </p>
        </div>
      </div>

      <section className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "bg-[rgb(0,48,73)] text-white shadow-md"
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <input
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              placeholder="Buscar elemento, item, área o firma..."
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-[rgb(0,48,73)] focus:ring-4 focus:ring-slate-100 md:w-80"
            />

            <select
              value={tipoFiltro}
              onChange={(event) => setTipoFiltro(event.target.value)}
              className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 outline-none transition focus:border-[rgb(0,48,73)] focus:ring-4 focus:ring-slate-100"
            >
              <option value="todos">Todos los tipos</option>
              <option value="entrada">Entradas</option>
              <option value="salida">Salidas</option>
              <option value="solicitud">Solicitudes</option>
            </select>

            <button
              onClick={exportarCSV}
              className="h-11 rounded-lg border border-[rgb(0,48,73)] px-4 text-sm font-bold text-[rgb(0,48,73)] transition hover:bg-[rgb(0,48,73)] hover:text-white"
            >
              Exportar
            </button>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4 text-left">Tipo</th>
                <th className="px-5 py-4 text-left">Fecha</th>
                <th className="px-5 py-4 text-left">Elemento entregado</th>
                <th className="px-5 py-4 text-left">Item</th>
                <th className="px-5 py-4 text-center">Cantidad</th>
                <th className="px-5 py-4 text-left">Área a la que se entrega</th>
                <th className="px-5 py-4 text-left">Observación</th>
                <th className="px-5 py-4 text-left">Firma</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-600">
              {historialFiltrado.map((m, index) => (
                <tr
                  key={`${m.item}-${index}`}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-5 py-4">
                    <TipoBadge tipo={m.tipo} />
                  </td>

                  <td className="px-5 py-4 font-medium text-slate-600">
                    {m.fecha}
                  </td>

                  <td className="px-5 py-4 font-semibold text-slate-800">
                    {m.elemento}
                  </td>

                  <td className="px-5 py-4 text-slate-500">
                    {m.item}
                  </td>

                  <td className="px-5 py-4 text-center font-bold text-slate-800">
                    {m.cantidad}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-md bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      {m.area}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-slate-500">
                    {m.observacion}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgb(0,48,73)] text-xs font-bold text-white">
                        {m.firma
                          .split(" ")
                          .map((word) => word[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <span className="font-medium text-slate-600">
                        {m.firma}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}

              {historialFiltrado.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-5 py-12 text-center">
                    <p className="text-base font-bold text-slate-700">
                      No hay movimientos para mostrar
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Intenta cambiar los filtros o la búsqueda.
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

function TipoBadge({ tipo }) {
  const styles = {
    entrada: "bg-emerald-50 text-emerald-700",
    salida: "bg-red-50 text-red-600",
    solicitud: "bg-blue-50 text-[rgb(0,48,73)]",
  };

  const labels = {
    entrada: "Entrada",
    salida: "Salida",
    solicitud: "Solicitud",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${styles[tipo]}`}>
      {labels[tipo]}
    </span>
  );
}
