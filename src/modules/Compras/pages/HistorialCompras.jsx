import { useMemo, useState } from "react";

const comprasIniciales = [
  {
    id: "REQ-00012",
    fechaSolicitud: "15/05/2024",
    fechaConfirmacion: "16/05/2024",
    solicitadoPor: "Juan Pablo",
    area: "Producción",
    producto: "Guantes de Nitrilo",
    item: "GN-001",
    cantidad: 100,
    destino: "Producción",
    estado: "confirmada",
    proveedor: "Proveedor ABC",
    observacion: "Compra confirmada para dotación de producción.",
    imagen: "https://instrumentalia.com.co/44166-large_default/guante-de-nitrilo-azul-talla-l-caja-100-unidades.jpg",
  },
  {
    id: "REQ-00011",
    fechaSolicitud: "14/05/2024",
    fechaConfirmacion: "15/05/2024",
    solicitadoPor: "Andres Aranda",
    area: "Calidad",
    producto: "Lentes de Seguridad",
    item: "LS-003",
    cantidad: 50,
    destino: "Calidad",
    estado: "confirmada",
    proveedor: "Seguridad Industrial S.A.",
    observacion: "Compra cerrada y lista para entrega.",
    imagen: "https://www.loencuentras.com.co/1509-large_default/gafas-de-seguridad-ajustables.jpg",
  },
  {
    id: "REQ-00010",
    fechaSolicitud: "13/05/2024",
    fechaConfirmacion: "13/05/2024",
    solicitadoPor: "Cristian",
    area: "Mantenimiento",
    producto: "Casco de Seguridad",
    item: "CS-002",
    cantidad: 30,
    destino: "Mantenimiento",
    estado: "rechazada",
    proveedor: "-",
    observacion: "Solicitud rechazada por disponibilidad en inventario.",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjCc1nQdy4OCLl_wUU8p15VbjTQV1pUJM7XA&s",
  },
];

export default function HistorialCompras() {
  const [search, setSearch] = useState("");
  const [estado, setEstado] = useState("todos");
  const [detalle, setDetalle] = useState(null);

  const comprasFiltradas = useMemo(() => {
    return comprasIniciales.filter((compra) => {
      const matchesSearch = `${compra.id} ${compra.solicitadoPor} ${compra.area} ${compra.producto} ${compra.item} ${compra.proveedor}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesEstado = estado === "todos" || compra.estado === estado;

      return matchesSearch && matchesEstado;
    });
  }, [search, estado]);

  const confirmadas = comprasFiltradas.filter((item) => item.estado === "confirmada").length;
  const rechazadas = comprasFiltradas.filter((item) => item.estado === "rechazada").length;

  return (
    <div className="min-h-full bg-[#f8fafc] p-4 text-slate-800 md:p-8">
      <div className="mb-7">
        <p className="text-sm font-bold uppercase tracking-wide text-[rgb(102,155,188)]">
          Compras
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Historial de Compras
        </h1>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Consulta las compras confirmadas, rechazadas y su trazabilidad.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <MetricCard title="Confirmadas" value={confirmadas} tone="emerald" />
        <MetricCard title="Rechazadas" value={rechazadas} tone="red" />
      </div>

      <section className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por código, producto, área o proveedor..."
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-[rgb(102,155,188)] focus:ring-4 focus:ring-blue-100 lg:w-[440px]"
          />

          <select
            value={estado}
            onChange={(event) => setEstado(event.target.value)}
            className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm outline-none transition focus:border-[rgb(102,155,188)] focus:ring-4 focus:ring-blue-100"
          >
            <option value="todos">Estado: Todos</option>
            <option value="confirmada">Confirmadas</option>
            <option value="rechazada">Rechazadas</option>
          </select>
        </div>
      </section>

      <section className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-5 py-4 text-left">Código</th>
                <th className="px-5 py-4 text-left">Fechas</th>
                <th className="px-5 py-4 text-left">Solicitado por</th>
                <th className="px-5 py-4 text-left">Producto</th>
                <th className="px-5 py-4 text-center">Cantidad</th>
                <th className="px-5 py-4 text-left">Proveedor</th>
                <th className="px-5 py-4 text-center">Estado</th>
                <th className="px-5 py-4 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {comprasFiltradas.map((item) => (
                <tr key={item.id} className="transition hover:bg-slate-50">
                  <td className="px-5 py-5 font-bold text-slate-900">{item.id}</td>

                  <td className="px-5 py-5 text-slate-600">
                    <p>Solicitud: {item.fechaSolicitud}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Confirmación: {item.fechaConfirmacion}
                    </p>
                  </td>

                  <td className="px-5 py-5">
                    <p className="font-semibold text-slate-800">{item.solicitadoPor}</p>
                    <p className="mt-1 text-xs text-slate-400">{item.area}</p>
                  </td>

                  <td className="px-5 py-5">
                    <div className="flex items-center gap-4">
                      <img src={item.imagen} alt={item.producto} className="h-14 w-14 rounded-xl object-contain" />
                      <div>
                        <p className="font-semibold text-slate-900">{item.producto}</p>
                        <p className="mt-1 text-sm text-slate-400">{item.item}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-5 text-center font-bold">{item.cantidad}</td>
                  <td className="px-5 py-5">{item.proveedor}</td>

                  <td className="px-5 py-5 text-center">
                    <EstadoBadge estado={item.estado} />
                  </td>

                  <td className="px-5 py-5 text-center">
                    <button
                      onClick={() => setDetalle(item)}
                      className="rounded-lg border border-slate-200 p-2 text-[rgb(102,155,188)] transition hover:bg-[rgb(102,155,188)] hover:text-white"
                    >
                      <EyeIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 px-5 py-4 text-sm font-medium text-slate-500">
          Mostrando {comprasFiltradas.length} de {comprasIniciales.length} registros
        </div>
      </section>

      <section className="space-y-4 lg:hidden">
        {comprasFiltradas.map((item) => (
          <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-bold text-slate-900">{item.id}</p>
                <p className="mt-1 text-sm text-slate-500">{item.fechaConfirmacion}</p>
              </div>
              <EstadoBadge estado={item.estado} />
            </div>

            <div className="mt-5 flex gap-4">
              <img src={item.imagen} alt={item.producto} className="h-20 w-20 rounded-xl object-contain" />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-900">{item.producto}</p>
                <p className="mt-1 text-sm text-slate-400">{item.item}</p>
                <p className="mt-3 text-sm text-slate-600">
                  Cantidad: <strong>{item.cantidad}</strong>
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-600">
              <Info label="Proveedor" value={item.proveedor} />
              <Info label="Solicitado por" value={item.solicitadoPor} />
              <Info label="Destino" value={item.destino} />
              <Info label="Área" value={item.area} />
            </div>

            <button
              onClick={() => setDetalle(item)}
              className="mt-5 w-full rounded-lg bg-[rgb(102,155,188)] py-3 text-sm font-bold text-white shadow-md transition hover:bg-[rgb(77,128,160)]"
            >
              Ver detalle
            </button>
          </article>
        ))}
      </section>

      {detalle && <DetalleCompra compra={detalle} onClose={() => setDetalle(null)} />}
    </div>
  );
}

function MetricCard({ title, value, tone }) {
  const styles = {
    emerald: "text-emerald-700 bg-emerald-50",
    red: "text-red-600 bg-red-50",
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-wide text-slate-400">{title}</p>
      <p className={`mt-3 inline-flex rounded-lg px-4 py-2 text-3xl font-bold ${styles[tone]}`}>
        {value}
      </p>
    </section>
  );
}

function EstadoBadge({ estado }) {
  const styles = {
    confirmada: "bg-emerald-100 text-emerald-700",
    rechazada: "bg-red-100 text-red-600",
  };

  return (
    <span className={`rounded-full px-4 py-1 text-sm font-bold ${styles[estado]}`}>
      {estado}
    </span>
  );
}

function DetalleCompra({ compra, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm">
      <aside className="h-full w-full overflow-y-auto bg-white shadow-2xl sm:max-w-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[rgb(102,155,188)]">
              Detalle de compra
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">{compra.id}</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-2xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
            ×
          </button>
        </div>

        <div className="p-6">
          <img src={compra.imagen} alt={compra.producto} className="mx-auto h-56 w-full rounded-xl object-contain" />

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-xl font-bold text-slate-900">{compra.producto}</h3>
            <p className="mt-1 text-sm font-medium text-slate-500">Código item: {compra.item}</p>

            <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
              <Info label="Cantidad" value={compra.cantidad} />
              <Info label="Estado" value={compra.estado} />
              <Info label="Solicitado por" value={compra.solicitadoPor} />
              <Info label="Proveedor" value={compra.proveedor} />
              <Info label="Área" value={compra.area} />
              <Info label="Destino" value={compra.destino} />
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
            <h4 className="font-bold text-slate-900">Observaciones</h4>
            <p className="mt-3 text-sm leading-6 text-slate-500">{compra.observacion}</p>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 font-semibold text-slate-800">{value}</p>
    </div>
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
