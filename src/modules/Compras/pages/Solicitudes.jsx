import { useMemo, useState } from "react";

const solicitudesIniciales = [
  {
    id: "REQ-00012",
    fecha: "15/05/2024",
    solicitadoPor: "Juan Pablo",
    area: "Producción",
    producto: "Guantes de Nitrilo",
    item: "GN-001",
    cantidad: 100,
    destino: "Producción",
    estado: "pendiente",
    observacion: "Solicitud de guantes para el área de producción.",
    imagen: "https://instrumentalia.com.co/44166-large_default/guante-de-nitrilo-azul-talla-l-caja-100-unidades.jpg",
  },
  {
    id: "REQ-00011",
    fecha: "14/05/2024",
    solicitadoPor: "Andres Aranda",
    area: "Calidad",
    producto: "Lentes de Seguridad",
    item: "LS-003",
    cantidad: 50,
    destino: "Calidad",
    estado: "pendiente",
    observacion: "Reposición de lentes para inspección de calidad.",
    imagen: "https://www.loencuentras.com.co/1509-large_default/gafas-de-seguridad-ajustables.jpg",
  },
  {
    id: "REQ-00010",
    fecha: "13/05/2024",
    solicitadoPor: "Cristian",
    area: "Mantenimiento",
    producto: "Casco de Seguridad",
    item: "CS-002",
    cantidad: 30,
    destino: "Mantenimiento",
    estado: "aceptada",
    observacion: "Elementos de protección para mantenimiento.",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjCc1nQdy4OCLl_wUU8p15VbjTQV1pUJM7XA&s",
  },
];

export default function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState(solicitudesIniciales);
  const [search, setSearch] = useState("");
  const [detalle, setDetalle] = useState(null);
  const [confirmacion, setConfirmacion] = useState(null);

  const solicitudesFiltradas = useMemo(() => {
    return solicitudes.filter((item) =>
      `${item.id} ${item.solicitadoPor} ${item.area} ${item.producto} ${item.item}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [solicitudes, search]);

  const confirmarCompra = () => {
    setSolicitudes((current) =>
      current.map((item) =>
        item.id === confirmacion.id ? { ...item, estado: "aceptada" } : item
      )
    );
    setConfirmacion(null);
  };

  const rechazarSolicitud = (id) => {
    setSolicitudes((current) =>
      current.map((item) =>
        item.id === id ? { ...item, estado: "rechazada" } : item
      )
    );
  };

  return (
    <div className="min-h-full bg-[#f8fafc] p-4 text-slate-800 md:p-8">
      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Solicitudes de Compra
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Revisa y gestiona las solicitudes de compra realizadas por las áreas
          </p>
        </div>

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar solicitud..."
          className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-[rgb(102,155,188)] focus:ring-4 focus:ring-blue-100 lg:w-96"
        />
      </div>

      <section className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-5 py-4 text-left">Código</th>
                <th className="px-5 py-4 text-left">Fecha</th>
                <th className="px-5 py-4 text-left">Solicitado por</th>
                <th className="px-5 py-4 text-left">Área</th>
                <th className="px-5 py-4 text-left">Producto</th>
                <th className="px-5 py-4 text-center">Cantidad</th>
                <th className="px-5 py-4 text-center">Destino</th>
                <th className="px-5 py-4 text-center">Estado</th>
                <th className="px-5 py-4 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {solicitudesFiltradas.map((item) => (
                <tr key={item.id} className="transition hover:bg-slate-50">
                  <td className="px-5 py-5 font-bold text-slate-900">{item.id}</td>
                  <td className="px-5 py-5">{item.fecha}</td>
                  <td className="px-5 py-5">{item.solicitadoPor}</td>
                  <td className="px-5 py-5">{item.area}</td>

                  <td className="px-5 py-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.imagen}
                        alt={item.producto}
                        className="h-16 w-16 rounded-xl object-contain"
                      />
                      <div>
                        <p className="font-semibold text-slate-900">{item.producto}</p>
                        <p className="mt-1 text-sm text-slate-400">{item.item}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-5 text-center font-bold">{item.cantidad}</td>
                  <td className="px-5 py-5 text-center">{item.destino}</td>
                  <td className="px-5 py-5 text-center">
                    <EstadoBadge estado={item.estado} />
                  </td>

                  <td className="px-5 py-5">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => setConfirmacion(item)}
                        className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-100 text-xl font-bold text-emerald-700 transition hover:bg-emerald-200"
                        title="Confirmar compra"
                      >
                        ✓
                      </button>

                      <button
                        onClick={() => rechazarSolicitud(item.id)}
                        className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-100 text-2xl font-light text-red-600 transition hover:bg-red-200"
                        title="Rechazar solicitud"
                      >
                        ×
                      </button>

                      <button
                        onClick={() => setDetalle(item)}
                        className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-[rgb(102,155,188)] transition hover:bg-[rgb(102,155,188)] hover:text-white"
                        title="Ver detalle"
                      >
                        <EyeIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {solicitudesFiltradas.length === 0 && (
                <tr>
                  <td colSpan="9" className="px-5 py-12 text-center">
                    <p className="font-bold text-slate-700">No hay solicitudes para mostrar</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Cambia la búsqueda para ver más resultados.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4 lg:hidden">
        {solicitudesFiltradas.map((item) => (
          <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-bold text-slate-900">{item.id}</p>
                <p className="mt-1 text-sm font-medium text-slate-500">{item.fecha}</p>
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
              <Info label="Solicitado por" value={item.solicitadoPor} />
              <Info label="Área" value={item.area} />
              <Info label="Destino" value={item.destino} />
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <button onClick={() => setConfirmacion(item)} className="rounded-lg bg-emerald-100 py-3 text-lg font-bold text-emerald-700">
                ✓
              </button>
              <button onClick={() => rechazarSolicitud(item.id)} className="rounded-lg bg-red-100 py-3 text-xl font-bold text-red-600">
                ×
              </button>
              <button onClick={() => setDetalle(item)} className="rounded-lg border border-slate-200 py-3 text-[rgb(102,155,188)]">
                Ver
              </button>
            </div>
          </article>
        ))}
      </section>

      {detalle && <DetalleSolicitud solicitud={detalle} onClose={() => setDetalle(null)} />}

      {confirmacion && (
        <ConfirmModal
          solicitud={confirmacion}
          onCancel={() => setConfirmacion(null)}
          onConfirm={confirmarCompra}
        />
      )}
    </div>
  );
}

function EstadoBadge({ estado }) {
  const styles = {
    pendiente: "bg-blue-100 text-blue-700",
    aceptada: "bg-emerald-100 text-emerald-700",
    rechazada: "bg-red-100 text-red-600",
  };

  return (
    <span className={`rounded-full px-4 py-1 text-sm font-bold ${styles[estado]}`}>
      {estado}
    </span>
  );
}

function ConfirmModal({ solicitud, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-slate-900">
          ¿Deseas confirmar compra?
        </h2>
        <p className="mt-3 text-sm font-medium text-slate-500">
          Vas a confirmar la compra de la solicitud <strong>{solicitud.id}</strong> para el producto{" "}
          <strong>{solicitud.producto}</strong>.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button onClick={onCancel} className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50">
            Rechazar
          </button>
          <button onClick={onConfirm} className="rounded-lg bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-emerald-700">
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}

function DetalleSolicitud({ solicitud, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm">
      <aside className="h-full w-full overflow-y-auto bg-white shadow-2xl sm:max-w-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[rgb(102,155,188)]">
              Detalle de solicitud
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">{solicitud.id}</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-2xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
            ×
          </button>
        </div>

        <div className="p-6">
          <img src={solicitud.imagen} alt={solicitud.producto} className="mx-auto h-56 w-full rounded-xl object-contain" />

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-xl font-bold text-slate-900">{solicitud.producto}</h3>
            <p className="mt-1 text-sm font-medium text-slate-500">Código item: {solicitud.item}</p>

            <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
              <Info label="Cantidad" value={solicitud.cantidad} />
              <Info label="Estado" value={solicitud.estado} />
              <Info label="Solicitado por" value={solicitud.solicitadoPor} />
              <Info label="Fecha" value={solicitud.fecha} />
              <Info label="Área" value={solicitud.area} />
              <Info label="Destino" value={solicitud.destino} />
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
            <h4 className="font-bold text-slate-900">Observaciones</h4>
            <p className="mt-3 text-sm leading-6 text-slate-500">{solicitud.observacion}</p>
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
