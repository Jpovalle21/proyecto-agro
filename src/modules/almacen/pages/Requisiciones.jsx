import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createSalidaMovement,
  formatDate,
  loadMovements,
  loadProducts,
  loadRequisitions,
  saveMovements,
  saveProducts,
  saveRequisitions,
} from "../data/almacenStore";
import "../almacen.css";

const estadoStyles = {
  pendiente: "bg-blue-50 text-blue-700 border-blue-100",
  aceptada: "bg-emerald-50 text-emerald-700 border-emerald-100",
  finalizada: "bg-slate-100 text-slate-700 border-slate-200",
  rechazada: "bg-red-50 text-red-700 border-red-100",
};

const estadoLabels = {
  pendiente: "Pendiente",
  aceptada: "Aceptada",
  finalizada: "Finalizada",
  rechazada: "Rechazada",
};

export default function Requisiciones() {
  const navigate = useNavigate();
  const [requisiciones, setRequisiciones] = useState(() => loadRequisitions());
  const [productos, setProductos] = useState(() => loadProducts());
  const [movimientos, setMovimientos] = useState(() => loadMovements());
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [detalle, setDetalle] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    saveRequisitions(requisiciones);
  }, [requisiciones]);

  useEffect(() => {
    saveProducts(productos);
  }, [productos]);

  useEffect(() => {
    saveMovements(movimientos);
  }, [movimientos]);

  const requisicionesFiltradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return requisiciones.filter((requisicion) => {
      const coincideEstado =
        estadoFiltro === "todos" || requisicion.estado === estadoFiltro;
      const contenido = `${requisicion.codigo} ${requisicion.solicitante} ${requisicion.area} ${requisicion.destino} ${requisicion.items
        .map((item) => `${item.nombre} ${item.codigo}`)
        .join(" ")}`.toLowerCase();

      return coincideEstado && contenido.includes(texto);
    });
  }, [busqueda, estadoFiltro, requisiciones]);

  const resumen = useMemo(() => {
    return {
      pendiente: requisiciones.filter((item) => item.estado === "pendiente").length,
      aceptada: requisiciones.filter((item) => item.estado === "aceptada").length,
      finalizada: requisiciones.filter((item) => item.estado === "finalizada").length,
      rechazada: requisiciones.filter((item) => item.estado === "rechazada").length,
    };
  }, [requisiciones]);

  const getProducto = (codigo) =>
    productos.find((producto) => producto.codigo === codigo || producto.id === codigo);

  const updateRequisition = (id, updater) => {
    setRequisiciones((actuales) =>
      actuales.map((requisicion) =>
        requisicion.id === id ? updater(requisicion) : requisicion
      )
    );
    setDetalle((actual) => (actual?.id === id ? updater(actual) : actual));
  };

  const aceptarRequisicion = (requisicion) => {
    setError("");
    setMensaje(`Requisicion ${requisicion.codigo} aceptada. Ya puedes finalizarla.`);

    updateRequisition(requisicion.id, (actual) => ({
      ...actual,
      estado: "aceptada",
      fechaAceptacion: new Date().toISOString(),
    }));
  };

  const rechazarRequisicion = (requisicion) => {
    setError("");
    setMensaje(`Requisicion ${requisicion.codigo} rechazada.`);

    updateRequisition(requisicion.id, (actual) => ({
      ...actual,
      estado: "rechazada",
      fechaRechazo: new Date().toISOString(),
    }));
  };

  const finalizarRequisicion = (requisicion) => {
    setError("");
    setMensaje("");

    const lineas = requisicion.items.map((item) => {
      const product = getProducto(item.codigo);
      return {
        product,
        cantidad: Number(item.cantidad) || 0,
      };
    });

    const productoFaltante = lineas.find((linea) => !linea.product);
    if (productoFaltante) {
      setError("Hay productos de la requisicion que no existen en el inventario.");
      return;
    }

    const productoSinStock = lineas.find((linea) => linea.cantidad > linea.product.stock);
    if (productoSinStock) {
      setError(
        `No hay stock suficiente para ${productoSinStock.product.nombre}. Disponible: ${productoSinStock.product.stock}.`
      );
      return;
    }

    const cantidadesPorProducto = lineas.reduce((acc, linea) => {
      acc[linea.product.id] = (acc[linea.product.id] || 0) + linea.cantidad;
      return acc;
    }, {});

    const salida = createSalidaMovement({
      products: lineas,
      area: requisicion.destino,
      fechaEntrega: new Date().toISOString().slice(0, 10),
      firma: requisicion.solicitante,
      firmaImagen: "",
      observacion: `Entrega finalizada desde requisicion ${requisicion.codigo}`,
      requisicion: requisicion.codigo,
    });

    setProductos((actuales) =>
      actuales.map((producto) =>
        cantidadesPorProducto[producto.id]
          ? { ...producto, stock: producto.stock - cantidadesPorProducto[producto.id] }
          : producto
      )
    );
    setMovimientos((actuales) => [salida, ...actuales]);
    setMensaje(`Requisicion ${requisicion.codigo} finalizada y registrada como salida.`);

    updateRequisition(requisicion.id, (actual) => ({
      ...actual,
      estado: "finalizada",
      fechaFinalizacion: new Date().toISOString(),
    }));
  };

  return (
    <div className="min-h-full bg-[#f8fafc] p-6 text-slate-800">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Requisiciones</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Revisa, acepta y finaliza solicitudes de productos del almacen.
          </p>
        </div>

        <button
          onClick={() => navigate("/app/almacen/historial-requisiciones")}
          className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-50"
        >
          Historial
        </button>
      </div>

      {(mensaje || error) && (
        <div
          className={`mb-4 rounded-lg border px-4 py-3 text-sm font-semibold ${
            error
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {error || mensaje}
        </div>
      )}

      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Pendientes" value={resumen.pendiente} tone="blue" />
        <SummaryCard label="Aceptadas" value={resumen.aceptada} tone="emerald" />
        <SummaryCard label="Finalizadas" value={resumen.finalizada} tone="slate" />
        <SummaryCard label="Rechazadas" value={resumen.rechazada} tone="red" />
      </section>

      <section className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="grid flex-1 gap-4 md:grid-cols-[220px_1fr]">
            <div>
              <label className="label">Estado</label>
              <select
                value={estadoFiltro}
                onChange={(event) => setEstadoFiltro(event.target.value)}
                className="input-pro"
              >
                <option value="todos">Todos</option>
                <option value="pendiente">Pendientes</option>
                <option value="aceptada">Aceptadas</option>
                <option value="finalizada">Finalizadas</option>
                <option value="rechazada">Rechazadas</option>
              </select>
            </div>

            <div>
              <label className="label">Buscar</label>
              <input
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
                className="input-pro"
                placeholder="Buscar por codigo, solicitante, area o producto..."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4 text-left">Codigo</th>
                <th className="px-5 py-4 text-left">Fecha</th>
                <th className="px-5 py-4 text-left">Solicitado por</th>
                <th className="px-5 py-4 text-left">Area</th>
                <th className="px-5 py-4 text-left">Productos</th>
                <th className="px-5 py-4 text-center">Cantidad total</th>
                <th className="px-5 py-4 text-left">Estado</th>
                <th className="px-5 py-4 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {requisicionesFiltradas.map((requisicion) => (
                <tr key={requisicion.id} className="transition hover:bg-slate-50">
                  <td className="px-5 py-4 font-bold text-slate-800">
                    {requisicion.codigo}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {formatDate(requisicion.fecha)}
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">{requisicion.solicitante}</p>
                    <p className="text-xs text-slate-400">{requisicion.cargo}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{requisicion.area}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-1">
                      {requisicion.items.slice(0, 2).map((item) => (
                        <span key={`${requisicion.id}-${item.codigo}`} className="font-medium text-slate-700">
                          {item.nombre} x {item.cantidad}
                        </span>
                      ))}
                      {requisicion.items.length > 2 && (
                        <span className="text-xs font-bold text-slate-400">
                          +{requisicion.items.length - 2} producto(s) mas
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center font-black text-slate-800">
                    {totalItems(requisicion)}
                  </td>
                  <td className="px-5 py-4">
                    <EstadoBadge estado={requisicion.estado} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setDetalle(requisicion)}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                      >
                        Ver detalle
                      </button>

                      {requisicion.estado === "pendiente" && (
                        <>
                          <button
                            onClick={() => aceptarRequisicion(requisicion)}
                            className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                          >
                            Aceptar
                          </button>
                          <button
                            onClick={() => rechazarRequisicion(requisicion)}
                            className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100"
                          >
                            Rechazar
                          </button>
                        </>
                      )}

                      {requisicion.estado === "aceptada" && (
                        <button
                          onClick={() => finalizarRequisicion(requisicion)}
                          className="rounded-lg bg-[rgb(0,48,73)] px-3 py-2 text-xs font-bold text-white hover:bg-[#00263a]"
                        >
                          Finalizar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {requisicionesFiltradas.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-5 py-12 text-center">
                    <p className="text-base font-bold text-slate-700">
                      No hay requisiciones para mostrar
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Ajusta los filtros o la busqueda.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 px-5 py-4 text-sm font-medium text-slate-500">
          Mostrando {requisicionesFiltradas.length} de {requisiciones.length} requisiciones
        </div>
      </section>

      {detalle && (
        <RequisitionDetail
          requisicion={detalle}
          productos={productos}
          onClose={() => setDetalle(null)}
          onAccept={() => aceptarRequisicion(detalle)}
          onReject={() => rechazarRequisicion(detalle)}
          onFinish={() => finalizarRequisicion(detalle)}
        />
      )}
    </div>
  );
}

function SummaryCard({ label, value, tone }) {
  const styles = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    slate: "bg-slate-50 text-slate-700 border-slate-200",
    red: "bg-red-50 text-red-700 border-red-100",
  };

  return (
    <div className={`rounded-xl border p-5 shadow-sm ${styles[tone]}`}>
      <p className="text-xs font-bold uppercase tracking-wide opacity-70">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}

function EstadoBadge({ estado }) {
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${estadoStyles[estado]}`}>
      {estadoLabels[estado]}
    </span>
  );
}

function totalItems(requisicion) {
  return requisicion.items.reduce((total, item) => total + Number(item.cantidad || 0), 0);
}

function RequisitionDetail({ requisicion, productos, onClose, onAccept, onReject, onFinish }) {
  const canAccept = requisicion.estado === "pendiente";
  const canFinish = requisicion.estado === "aceptada";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50 px-6 py-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[rgb(0,48,73)]">
              Detalle de requisicion
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">{requisicion.codigo}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {requisicion.solicitante} solicita {totalItems(requisicion)} unidad(es) para {requisicion.destino}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <EstadoBadge estado={requisicion.estado} />
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50"
            >
              Cerrar
            </button>
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="rounded-xl border border-slate-200 p-5">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">
              Informacion general
            </h3>
            <div className="grid gap-3">
              <DetailRow label="Fecha" value={formatDate(requisicion.fecha)} />
              <DetailRow label="Solicitante" value={requisicion.solicitante} />
              <DetailRow label="Cargo" value={requisicion.cargo} />
              <DetailRow label="Area" value={requisicion.area} />
              <DetailRow label="Destino" value={requisicion.destino} />
              <DetailRow label="Prioridad" value={requisicion.prioridad} />
            </div>

            <div className="mt-5 rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Observacion
              </p>
              <p className="mt-2 text-sm font-medium text-slate-600">
                {requisicion.observacion || "Sin observacion registrada."}
              </p>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 p-5">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">
              Productos solicitados
            </h3>
            <div className="grid gap-3">
              {requisicion.items.map((item) => {
                const product = productos.find(
                  (producto) => producto.codigo === item.codigo || producto.id === item.productoId
                );
                const available = product?.stock ?? 0;
                const hasStock = available >= item.cantidad;

                return (
                  <div
                    key={`${requisicion.id}-${item.codigo}`}
                    className="grid gap-3 rounded-xl border border-slate-200 bg-white p-3 md:grid-cols-[64px_1fr_120px_120px]"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-50">
                      {product?.img ? (
                        <img src={product.img} alt={item.nombre} className="max-h-14 max-w-full object-contain" />
                      ) : (
                        <span className="text-xs font-bold text-slate-400">Sin img</span>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{item.nombre}</p>
                      <p className="text-xs text-slate-400">Item: {item.codigo}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Solicitado</p>
                      <p className="mt-1 text-xl font-black text-slate-800">{item.cantidad}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Stock</p>
                      <p className={`mt-1 text-xl font-black ${hasStock ? "text-emerald-600" : "text-red-600"}`}>
                        {available}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 px-6 py-5 sm:flex-row sm:justify-end">
          <button onClick={onClose} className="btn-secondary">Volver</button>

          {canAccept && (
            <>
              <button onClick={onReject} className="rounded-lg bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100">
                Rechazar requisicion
              </button>
              <button onClick={onAccept} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700">
                Aceptar requisicion
              </button>
            </>
          )}

          {canFinish && (
            <button onClick={onFinish} className="btn-primary">
              Finalizar requisicion
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 px-4 py-3">
      <span className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</span>
      <span className="text-right text-sm font-bold text-slate-700">{value}</span>
    </div>
  );
}
