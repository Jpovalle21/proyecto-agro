import { useMemo, useState } from "react";

const solicitudesIniciales = [
  { id: "REQ-00012", fecha: "15/05/2024", solicitadoPor: "Juan Camilo Pérez", area: "Producción", producto: "Guantes de Nitrilo Talla L", item: "GN-001", cantidad: 100, destino: "Producción", observacion: "Solicitud prioritaria de dotación.", dias: 4 },
  { id: "REQ-00011", fecha: "14/05/2024", solicitadoPor: "María Alejandra López", area: "Calidad", producto: "Gafas de Seguridad", item: "GS-002", cantidad: 50, destino: "Calidad", observacion: "Reposición de inventario.", dias: 3 },
  { id: "REQ-00010", fecha: "13/05/2024", solicitadoPor: "Pedro José Ramírez", area: "Mantenimiento", producto: "Casco de Seguridad", item: "CS-003", cantidad: 30, destino: "Mantenimiento", observacion: "Entrega para técnicos.", dias: 2 },
  { id: "REQ-00009", fecha: "12/05/2024", solicitadoPor: "Laura Sofía Herrera", area: "Talento Humano", producto: "Botiquín de Primeros Auxilios", item: "BA-004", cantidad: 10, destino: "Talento Humano", observacion: "Dotación de oficinas.", dias: 1 },
  { id: "REQ-00008", fecha: "10/05/2024", solicitadoPor: "Andrés Felipe Giraldo", area: "Almacén", producto: "Botas de Seguridad", item: "BS-005", cantidad: 20, destino: "Almacén", observacion: "Compra para stock.", dias: 0 },
];

export default function Solicitudes() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(solicitudesIniciales[0]);
  const [checked, setChecked] = useState({});
  const [confirmadas, setConfirmadas] = useState([]);

  const solicitudes = useMemo(() => {
    return solicitudesIniciales.filter((item) =>
      `${item.id} ${item.solicitadoPor} ${item.area} ${item.producto} ${item.item}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);

  const compraRealizada = checked[selected?.id];

  const confirmarCompra = () => {
    setConfirmadas((current) =>
      current.includes(selected.id) ? current : [...current, selected.id]
    );
  };

  return (
    <div className="min-h-full bg-[#f8fafc] p-4 text-slate-800 md:p-8">
      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Solicitudes de Compra</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">Compras &gt; Solicitudes</p>
        </div>

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar solicitud..."
          className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 lg:w-80"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[920px] text-sm">
              <thead className="bg-slate-50 text-xs font-bold text-slate-500">
                <tr>
                  <th className="px-4 py-4 text-left">Código</th>
                  <th className="px-4 py-4 text-left">Fecha</th>
                  <th className="px-4 py-4 text-left">Solicitado por</th>
                  <th className="px-4 py-4 text-left">Área</th>
                  <th className="px-4 py-4 text-left">Productos</th>
                  <th className="px-4 py-4 text-center">Cantidad</th>
                  <th className="px-4 py-4 text-left">Destino</th>
                  <th className="px-4 py-4 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {solicitudes.map((item) => (
                  <tr key={item.id} className="transition hover:bg-blue-50/30">
                    <td className={`border-l-4 px-4 py-5 font-bold ${item.dias > 2 ? "border-red-500 text-red-600" : item.dias > 0 ? "border-amber-500" : "border-emerald-500"}`}>
                      {item.id}
                      <p className="mt-2 text-xs font-semibold text-slate-500">
                        {item.dias} días sin completarse
                      </p>
                    </td>
                    <td className="px-4 py-5">{item.fecha}</td>
                    <td className="px-4 py-5">{item.solicitadoPor}</td>
                    <td className="px-4 py-5">{item.area}</td>
                    <td className="px-4 py-5">
                      <p className="font-semibold text-slate-700">{item.producto}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.item}</p>
                    </td>
                    <td className="px-4 py-5 text-center font-bold">{item.cantidad}</td>
                    <td className="px-4 py-5">{item.destino}</td>
                    <td className="px-4 py-5">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => setSelected(item)} className="rounded-lg border border-slate-200 p-2 text-blue-600 hover:bg-blue-50">
                          <EyeIcon />
                        </button>
                        <input
                          type="checkbox"
                          checked={Boolean(checked[item.id])}
                          onChange={(event) =>
                            setChecked((current) => ({ ...current, [item.id]: event.target.checked }))
                          }
                          className="h-5 w-5 rounded border-slate-300 text-blue-600"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-4 p-4 md:hidden">
            {solicitudes.map((item) => (
              <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-slate-900">{item.id}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.fecha}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(checked[item.id])}
                    onChange={(event) =>
                      setChecked((current) => ({ ...current, [item.id]: event.target.checked }))
                    }
                    className="h-5 w-5 rounded border-slate-300 text-blue-600"
                  />
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-700">{item.producto}</p>
                <p className="text-xs text-slate-500">{item.item} | Cantidad: {item.cantidad}</p>
                <p className="mt-3 text-sm text-slate-500">{item.solicitadoPor} | {item.area}</p>

                <button
                  onClick={() => setSelected(item)}
                  className="mt-4 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-bold text-white"
                >
                  Ver detalle
                </button>
              </article>
            ))}
          </div>

          <div className="border-t border-slate-100 px-5 py-4 text-sm font-medium text-slate-500">
            Mostrando 1 a {solicitudes.length} de {solicitudes.length} solicitudes
          </div>
        </section>

        {selected && (
          <aside className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm xl:sticky xl:top-6 xl:h-fit">
            <div className="mb-6 flex items-start justify-between">
              <h2 className="text-xl font-bold text-slate-900">Detalle de la Solicitud</h2>
              <button onClick={() => setSelected(null)} className="text-2xl text-slate-400 hover:text-slate-700">×</button>
            </div>

            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-900">{selected.id}</h3>
              <p className="text-sm font-medium text-slate-500">Fecha: {selected.fecha}</p>
            </div>

            <div className="space-y-3 text-sm text-slate-600">
              <p><strong>Solicitado por:</strong> {selected.solicitadoPor}</p>
              <p><strong>Área:</strong> {selected.area}</p>
              <p><strong>Destino:</strong> {selected.destino}</p>
            </div>

            <div className="my-6 h-px bg-slate-200" />

            <h4 className="mb-4 font-bold text-slate-900">Productos Solicitados</h4>
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="p-4">
                      <p className="font-semibold">{selected.producto}</p>
                      <p className="mt-1 text-xs text-slate-500">{selected.item}</p>
                    </td>
                    <td className="p-4 text-right font-bold">{selected.cantidad}</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold">Total de productos</td>
                    <td className="p-4 text-right font-bold">{selected.cantidad}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4 className="mb-3 mt-6 font-bold text-slate-900">Observaciones</h4>
            <p className="text-sm text-slate-500">{selected.observacion}</p>

            <div className="my-6 h-px bg-slate-200" />

            <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={Boolean(checked[selected.id])}
                onChange={(event) =>
                  setChecked((current) => ({ ...current, [selected.id]: event.target.checked }))
                }
                className="h-5 w-5 rounded border-slate-300 text-emerald-600"
              />
              Compra realizada
            </label>

            {compraRealizada && (
              <button
                onClick={confirmarCompra}
                className="mt-5 w-full rounded-lg bg-blue-600 py-3 text-sm font-bold text-white shadow-md transition hover:bg-blue-700"
              >
                {confirmadas.includes(selected.id) ? "Compra confirmada" : "Confirmar compra"}
              </button>
            )}
          </aside>
        )}
      </div>
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
