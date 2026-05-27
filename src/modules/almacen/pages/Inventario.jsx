import { useEffect, useMemo, useRef, useState } from "react";
import {
  createSalidaMovement,
  formatDate,
  loadMovements,
  loadProducts,
  saveMovements,
  saveProducts,
} from "../data/almacenStore";
import "../almacen.css";

const areas = [
  "Produccion",
  "Mantenimiento",
  "Calidad",
  "SST",
  "Almacen",
  "RH",
  "Ambiental",
  "Despacho",
  "Compras",
];

const emptySalida = {
  productos: [],
  area: "Produccion",
  fechaEntrega: new Date().toISOString().slice(0, 10),
  firmaNombre: "",
  firmaImagen: "",
  observacion: "",
};

export default function Inventario() {
  const [productos, setProductos] = useState(() => loadProducts());
  const [movimientos, setMovimientos] = useState(() => loadMovements());
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("stock-desc");
  const [productoDetalle, setProductoDetalle] = useState(null);
  const [salidaAbierta, setSalidaAbierta] = useState(false);
  const [salidaForm, setSalidaForm] = useState(emptySalida);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    saveProducts(productos);
  }, [productos]);

  useEffect(() => {
    saveMovements(movimientos);
  }, [movimientos]);

  const productosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    const filtrados = productos.filter((producto) => {
      const contenido = `${producto.nombre} ${producto.codigo} ${producto.categoria}`.toLowerCase();
      return contenido.includes(texto);
    });

    return [...filtrados].sort((a, b) => {
      if (orden === "stock-asc") return a.stock - b.stock;
      if (orden === "nombre") return a.nombre.localeCompare(b.nombre);
      if (orden === "criticos") {
        const aCritico = a.stock <= a.stockMinimo ? 0 : 1;
        const bCritico = b.stock <= b.stockMinimo ? 0 : 1;
        return aCritico - bCritico || a.stock - b.stock;
      }
      return b.stock - a.stock;
    });
  }, [busqueda, orden, productos]);

  const totalUnidades = productos.reduce((total, producto) => total + producto.stock, 0);
  const productosCriticos = productos.filter(
    (producto) => producto.stock <= producto.stockMinimo
  ).length;

  const abrirSalida = (producto = null) => {
    setError("");
    setMensaje("");
    setSalidaForm({
      ...emptySalida,
      fechaEntrega: new Date().toISOString().slice(0, 10),
      productos: [
        {
          id: crypto.randomUUID(),
          productoId: producto?.id || productos[0]?.id || "",
          cantidad: "",
        },
      ],
    });
    setSalidaAbierta(true);
  };

  const actualizarMinimo = (id, value) => {
    const stockMinimo = Math.max(0, Number(value) || 0);
    setProductos((actuales) =>
      actuales.map((producto) =>
        producto.id === id ? { ...producto, stockMinimo } : producto
      )
    );
  };

  const registrarSalida = (event) => {
    event.preventDefault();
    setError("");
    setMensaje("");

    const firma = salidaForm.firmaNombre.trim();
    const observacion = salidaForm.observacion.trim();
    const lineas = salidaForm.productos.map((linea) => {
      const product = productos.find((producto) => producto.id === linea.productoId);
      return {
        ...linea,
        product,
        cantidad: Number(linea.cantidad),
      };
    });

    if (lineas.length === 0) {
      setError("Agrega al menos un producto a la salida.");
      return;
    }

    if (lineas.some((linea) => !linea.product)) {
      setError("Todos los productos seleccionados deben ser validos.");
      return;
    }

    if (lineas.some((linea) => !Number.isInteger(linea.cantidad) || linea.cantidad <= 0)) {
      setError("Cada cantidad debe ser un numero entero mayor a cero.");
      return;
    }

    const cantidadesPorProducto = lineas.reduce((acc, linea) => {
      acc[linea.product.id] = (acc[linea.product.id] || 0) + linea.cantidad;
      return acc;
    }, {});

    const productoSinStock = productos.find(
      (producto) => (cantidadesPorProducto[producto.id] || 0) > producto.stock
    );

    if (productoSinStock) {
      setError(
        `No hay stock suficiente para ${productoSinStock.nombre}. Disponible: ${productoSinStock.stock} ${productoSinStock.unidad}(s).`
      );
      return;
    }

    if (!salidaForm.fechaEntrega || !salidaForm.area || !firma) {
      setError("Completa fecha, area y nombre de quien recibe.");
      return;
    }

    if (!salidaForm.firmaImagen) {
      setError("Agrega la firma en el panel antes de guardar la salida.");
      return;
    }

    const movimiento = createSalidaMovement({
      products: lineas.map((linea) => ({
        product: linea.product,
        cantidad: linea.cantidad,
      })),
      area: salidaForm.area,
      fechaEntrega: salidaForm.fechaEntrega,
      firma,
      firmaImagen: salidaForm.firmaImagen,
      observacion: observacion || "Salida registrada desde inventario",
    });

    setProductos((actuales) =>
      actuales.map((producto) =>
        cantidadesPorProducto[producto.id]
          ? { ...producto, stock: producto.stock - cantidadesPorProducto[producto.id] }
          : producto
      )
    );
    setMovimientos((actuales) => [movimiento, ...actuales]);
    setSalidaAbierta(false);
    setMensaje(`Salida registrada con ${lineas.length} producto(s).`);
  };

  return (
    <div className="min-h-full bg-[#f8fafc] p-6 text-slate-800">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Inventario</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Gestiona stock, minimos y salidas reales del almacen.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Metric label="Productos" value={productos.length} />
          <Metric label="Unidades" value={totalUnidades} />
          <Metric label="Stock critico" value={productosCriticos} danger={productosCriticos > 0} />
        </div>
      </div>

      {mensaje && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {mensaje}
        </div>
      )}

      <section className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="grid flex-1 gap-4 md:grid-cols-[1fr_220px]">
            <div>
              <label className="label">Buscar</label>
              <input
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
                className="input-pro"
                placeholder="Buscar por item, nombre, categoria"
              />
            </div>

            <div>
              <label className="label">Ordenar por</label>
              <select
                value={orden}
                onChange={(event) => setOrden(event.target.value)}
                className="input-pro"
              >
                <option value="stock-desc">Stock: mayor a menor</option>
                <option value="stock-asc">Stock: menor a mayor</option>
                <option value="criticos">Criticos primero</option>
                <option value="nombre">Nombre A-Z</option>
              </select>
            </div>
          </div>

          <button onClick={() => abrirSalida()} className="btn-primary h-11">
            Registrar salida
          </button>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {productosFiltrados.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            onOpen={() => setProductoDetalle(item)}
            onSalida={() => abrirSalida(item)}
          />
        ))}

        {productosFiltrados.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            No hay productos que coincidan con la busqueda.
          </div>
        )}
      </section>

      {productoDetalle && (
        <ProductDetail
          product={productos.find((producto) => producto.id === productoDetalle.id) || productoDetalle}
          movimientos={movimientos}
          onMinimoChange={actualizarMinimo}
          onClose={() => setProductoDetalle(null)}
          onSalida={() => {
            const current = productos.find((producto) => producto.id === productoDetalle.id);
            setProductoDetalle(null);
            abrirSalida(current);
          }}
        />
      )}

      {salidaAbierta && (
        <SalidaModal
          productos={productos}
          form={salidaForm}
          error={error}
          onClose={() => setSalidaAbierta(false)}
          onSubmit={registrarSalida}
          onChange={(field, value) =>
            setSalidaForm((actual) => ({ ...actual, [field]: value }))
          }
        />
      )}
    </div>
  );
}

function Metric({ label, value, danger = false }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${danger ? "text-red-600" : "text-[rgb(0,48,73)]"}`}>
        {value}
      </p>
    </div>
  );
}

function ProductCard({ item, onOpen, onSalida }) {
  const isCritical = item.stock <= item.stockMinimo;
  const statusClass = isCritical
    ? "border-red-300 bg-red-50/70"
    : "border-slate-100 bg-white";

  return (
    <article
      onClick={onOpen}
      className={`cursor-pointer rounded-xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${statusClass}`}
    >
      <div className="mb-4 flex h-32 items-center justify-center rounded-lg bg-white">
        <img
          src={item.img}
          alt={item.nombre}
          className="max-h-28 max-w-full object-contain transition"
        />
      </div>

      <div className="min-h-[72px]">
        <h3 className="text-sm font-bold text-slate-800">{item.nombre}</h3>
        <p className="mt-1 text-xs text-slate-400">Item: {item.codigo}</p>
      </div>

      <div className="mt-4">
        <div>
          <p className="text-xs font-semibold text-slate-400">Stock</p>
          <p className={`text-2xl font-bold ${isCritical ? "text-red-600" : "text-emerald-600"}`}>
            {item.stock}
          </p>
          <span className="text-xs text-slate-400">{item.unidad}(s)</span>
        </div>
      </div>

      {isCritical && (
        <p className="mt-3 rounded-lg bg-red-100 px-3 py-2 text-xs font-bold text-red-700">
          Stock en minimo o por debajo
        </p>
      )}

      <button
        onClick={(event) => {
          event.stopPropagation();
          onSalida();
        }}
        className="mt-4 w-full rounded-lg bg-[rgb(0,48,73)] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#00263a]"
      >
        Salida
      </button>
    </article>
  );
}

function ProductDetail({ product, movimientos, onMinimoChange, onClose, onSalida }) {
  const salidasProducto = movimientos
    .filter(
      (movimiento) =>
        movimiento.tipo === "salida" &&
        (movimiento.item === product.codigo ||
          movimiento.item?.split(", ").includes(product.codigo) ||
          movimiento.items?.some((item) => item.codigo === product.codigo))
    )
    .slice(0, 4);
  const isCritical = product.stock <= product.stockMinimo;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-slate-400">Detalle de producto</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">{product.nombre}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50"
          >
            Cerrar
          </button>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[300px_1fr]">
          <div className="flex min-h-72 items-center justify-center rounded-xl bg-slate-50 p-6">
            <img src={product.img} alt={product.nombre} className="max-h-64 max-w-full object-contain" />
          </div>

          <div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Detail label="Item" value={product.codigo} />
              <Detail label="Categoria" value={product.categoria} />
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Stock minimo
                </label>
                <input
                  type="number"
                  min="0"
                  value={product.stockMinimo}
                  onChange={(event) => onMinimoChange(product.id, event.target.value)}
                  className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none focus:border-[rgb(0,48,73)] focus:ring-4 focus:ring-slate-100"
                />
              </div>
            </div>

            <div className={`mt-5 rounded-xl p-4 ${isCritical ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
              <p className="text-sm font-bold">Stock actual</p>
              <p className="text-4xl font-black">{product.stock}</p>
              <p className="text-sm font-semibold">
                {isCritical ? "Requiere reposicion o control inmediato." : "Stock por encima del minimo."}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button onClick={onSalida} className="btn-primary">Registrar salida</button>
              <button onClick={onClose} className="btn-secondary">Volver</button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 px-6 py-5">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">Ultimas salidas</h3>
          <div className="mt-3 grid gap-2">
            {salidasProducto.map((salida) => (
              <div key={salida.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 px-4 py-3 text-sm">
                <span className="font-semibold text-slate-700">{formatDate(salida.fechaEntrega)}</span>
                <span className="text-slate-500">{salida.area}</span>
                <span className="font-bold text-slate-800">{salida.cantidad}</span>
                <span className="font-serif italic text-slate-600">{salida.firma}</span>
              </div>
            ))}

            {salidasProducto.length === 0 && (
              <p className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-500">
                Este producto aun no tiene salidas registradas.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 font-semibold text-slate-700">{value}</p>
    </div>
  );
}

function SalidaModal({ productos, form, error, onClose, onSubmit, onChange }) {
  const addProductLine = () => {
    onChange("productos", [
      ...form.productos,
      {
        id: crypto.randomUUID(),
        productoId: productos[0]?.id || "",
        cantidad: "",
      },
    ]);
  };

  const updateProductLine = (id, field, value) => {
    onChange(
      "productos",
      form.productos.map((linea) =>
        linea.id === id ? { ...linea, [field]: value } : linea
      )
    );
  };

  const removeProductLine = (id) => {
    if (form.productos.length === 1) return;
    onChange(
      "productos",
      form.productos.filter((linea) => linea.id !== id)
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <form onSubmit={onSubmit} className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 bg-slate-50 px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[rgb(0,48,73)]">
              Formato de entrega
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">Registrar salida de almacen</h2>
            <p className="mt-1 text-sm text-slate-500">
              El registro descuenta el stock y queda disponible en Historial.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50"
          >
            Cerrar
          </button>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">
              Datos de entrega
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="label">Fecha entrega</label>
                <input
                  type="date"
                  value={form.fechaEntrega}
                  onChange={(event) => onChange("fechaEntrega", event.target.value)}
                  className="input-pro"
                />
              </div>

              <div>
                <label className="label">Area</label>
                <select
                  value={form.area}
                  onChange={(event) => onChange("area", event.target.value)}
                  className="input-pro"
                >
                  {areas.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="label mb-0">Productos entregados</label>
                  <button
                    type="button"
                    onClick={addProductLine}
                    className="rounded-lg border border-[rgb(0,48,73)] px-3 py-1.5 text-xs font-bold text-[rgb(0,48,73)] hover:bg-[rgb(0,48,73)] hover:text-white"
                  >
                    Agregar producto
                  </button>
                </div>

                <div className="grid gap-3">
                  {form.productos.map((linea, index) => {
                    const selectedProduct = productos.find(
                      (producto) => producto.id === linea.productoId
                    );

                    return (
                      <div
                        key={linea.id}
                        className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 md:grid-cols-[1fr_110px_120px_auto]"
                      >
                        <div>
                          <label className="text-xs font-bold text-slate-400">
                            Producto {index + 1}
                          </label>
                          <select
                            value={linea.productoId}
                            onChange={(event) =>
                              updateProductLine(linea.id, "productoId", event.target.value)
                            }
                            className="input-pro mt-1 bg-white"
                          >
                            {productos.map((producto) => (
                              <option key={producto.id} value={producto.id}>
                                {producto.nombre}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-400">Cantidad</label>
                          <input
                            type="number"
                            min="1"
                            max={selectedProduct?.stock || 1}
                            value={linea.cantidad}
                            onChange={(event) =>
                              updateProductLine(linea.id, "cantidad", event.target.value)
                            }
                            className="input-pro mt-1 bg-white"
                            placeholder="0"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-400">Disponible</label>
                          <div className="mt-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700">
                            {selectedProduct ? selectedProduct.stock : 0}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeProductLine(linea.id)}
                          disabled={form.productos.length === 1}
                          className="self-end rounded-lg border border-red-200 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Quitar
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="label">Recibido por</label>
                <input
                  value={form.firmaNombre}
                  onChange={(event) => onChange("firmaNombre", event.target.value)}
                  className="input-pro"
                  placeholder="Nombre de quien recibe"
                />
              </div>

              <div className="md:col-span-2">
                <label className="label">Observacion</label>
                <textarea
                  value={form.observacion}
                  onChange={(event) => onChange("observacion", event.target.value)}
                  className="input-pro min-h-24 resize-none"
                  placeholder="Motivo de la salida, turno, responsable o nota interna..."
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">
                Firma digital
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Usa el lapiz de la tablet o el mouse para firmar en el recuadro.
              </p>
            </div>

            <SignaturePad
              value={form.firmaImagen}
              onChange={(value) => onChange("firmaImagen", value)}
            />
          </section>
        </div>

        {error && (
          <div className="mx-6 mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 px-6 py-5 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
          <button type="submit" className="btn-primary">
            Guardar salida
          </button>
        </div>
      </form>
    </div>
  );
}

function SignaturePad({ value, onChange }) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);

  const getPoint = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const startDrawing = (event) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const point = getPoint(event);

    drawingRef.current = true;
    canvas.setPointerCapture(event.pointerId);
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
  };

  const draw = (event) => {
    if (!drawingRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const point = getPoint(event);

    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0f172a";
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!drawingRef.current) return;

    drawingRef.current = false;
    onChange(canvasRef.current.toDataURL("image/png"));
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onChange("");
  };

  return (
    <div>
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3">
        <canvas
          ref={canvasRef}
          width="720"
          height="260"
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerCancel={stopDrawing}
          onPointerLeave={stopDrawing}
          className="h-48 w-full touch-none rounded-lg bg-white shadow-inner"
        />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <span className={`text-xs font-bold ${value ? "text-emerald-600" : "text-slate-400"}`}>
          {value ? "Firma capturada" : "Firma pendiente"}
        </span>
        <button
          type="button"
          onClick={clearSignature}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
        >
          Limpiar firma
        </button>
      </div>
    </div>
  );
}
