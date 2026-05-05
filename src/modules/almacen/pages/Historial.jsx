const movimientos = [
  {
    tipo: "entrada",
    fecha: "15/05/2024 10:30",
    referencia: "FAC-0012345",
    proveedor: "Proveedor ABC S.A.",
    elemento: "Guantes de Nitrilo Talla L",
    item: "GN-001",
    cantidad: 100,
    valor: "$ 25.000",
    destino: "Almacén",
    obs: "Registro de factura",
    usuario: "Administrador",
  },
  {
    tipo: "salida",
    fecha: "15/05/2024 11:20",
    referencia: "SAL-0001123",
    proveedor: "Producción",
    elemento: "Guantes de Nitrilo Talla L",
    item: "GN-001",
    cantidad: 20,
    valor: "-",
    destino: "Producción",
    obs: "Entrega turno día",
    usuario: "Administrador",
  },
];

export default function HistorialAlmacen() {
  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Historial
        </h1>
      </div>

      {/* TABS */}
      <div className="flex justify-between items-center mb-4">

        <div className="flex items-center gap-6 border-b border-gray-200">

            <button className="pb-3 text-sm text-gray-400 hover:text-gray-600 transition">
                Entradas (Facturas)
            </button>

            <button className="pb-3 text-sm text-gray-400 hover:text-gray-600 transition">
                Salidas
            </button>

            <button className="pb-3 text-sm font-medium text-[rgb(45,90,58)] border-b-2 border-[rgb(45,90,58)]">
                Entradas y Salidas
            </button>

        </div>

        {/* FILTROS */}
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">

            <select className="input-pro text-sm w-44 border-none focus:ring-0">
                <option>Todos los tipos</option>
            </select>

            <input
                type="text"
                placeholder="01/05/2024 - 31/05/2024"
                className="input-pro text-sm w-56 border-none focus:ring-0"
            />

            <button className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 text-gray-600 text-sm hover:bg-gray-100 transition">
                Exportar
            </button>

        </div>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

        <table className="w-full text-sm">

            <thead className="bg-gray-50 text-gray-400 text-xs uppercase">
                <tr>
                    <th className="p-4 text-left">Tipo</th>
                    <th className="text-center">Fecha</th>
                    <th className="text-center">Número / Ref</th>
                    <th className="text-center">Proveedor / Área</th>
                    <th className="text-left">Elemento</th>
                    <th className="text-center">Item</th>
                    <th className="text-center">Cantidad</th>
                    <th className="text-center">Valor Unidad</th>
                    <th className="text-center">Área Destino</th>
                    <th className="text-left">Observación</th>
                    <th className="text-center">Usuario</th>
                </tr>
            </thead>

            <tbody className="text-gray-600">

                {movimientos.map((m, i) => (
                    <tr
                        key={i}
                        className="border-t border-gray-100 hover:bg-gray-50 transition"
                    >

                        {/* TIPO */}
                        <td className="p-4">
                            <span
                            className={`px-3 py-1 rounded-full text-xs font-medium
                                ${
                                m.tipo === "entrada"
                                    ? "bg-green-100 text-green-600"
                                    : "bg-red-100 text-red-500"
                                }`}
                            >
                            {m.tipo}
                            </span>
                        </td>

                        <td className="text-center">{m.fecha}</td>
                        <td className="text-center font-medium text-gray-700">
                            {m.referencia}
                        </td>
                        <td className="text-center">{m.proveedor}</td>

                        <td className="text-left">{m.elemento}</td>

                        <td className="text-center text-gray-500">
                            {m.item}
                        </td>

                        <td className="text-center font-semibold">
                            {m.cantidad}
                        </td>

                        <td className="text-center">{m.valor}</td>

                        <td className="text-center">{m.destino}</td>

                        <td className="text-left text-gray-500">
                            {m.obs}
                        </td>

                        <td className="text-center text-gray-500">
                            {m.usuario}
                        </td>

                    </tr>
                ))}

            </tbody>
        </table>

      </div>

    </div>
  );
}