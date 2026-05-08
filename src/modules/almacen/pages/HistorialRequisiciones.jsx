import "../almacen.css";

const historial = [
  {
    codigo: "REQ-00012",
    fecha: "15/05/2024",
    solicitante: "Juan Camilo Pérez",
    area: "Producción",
    producto: "Guantes de Nitrilo",
    codigoProd: "GN-001",
    cantidad: 100,
    destino: "Producción",
    estado: "aceptada",
    fechaEstado: "15/05/2024 10:25 a.m.",
    img: "https://instrumentalia.com.co/44166-large_default/guante-de-nitrilo-azul-talla-l-caja-100-unidades.jpg",
  },
  {
    codigo: "REQ-00011",
    fecha: "14/05/2024",
    solicitante: "María López",
    area: "Calidad",
    producto: "Gafas de Seguridad",
    codigoProd: "GS-002",
    cantidad: 50,
    destino: "Calidad",
    estado: "proceso",
    fechaEstado: "14/05/2024 02:15 p.m.",
    img: "https://www.loencuentras.com.co/1509-large_default/gafas-de-seguridad-ajustables.jpg",
  },
];

export default function HistorialRequisiciones() {
  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Historial de Requisiciones
          </h1>
        </div>

        {/* FILTROS */}
        <div className="flex items-center gap-3">

          <select className="input-pro w-44 text-sm">
            <option>Estado: Todos</option>
          </select>

          <input
            type="date"
            className="input-pro text-sm"
          />

          <div className="relative">
            <input
              className="input-pro pl-9 text-sm w-56"
              placeholder="Buscar requisición..."
            />
          </div>

        </div>
      </div>

      {/* RESUMEN */}
      <div className="grid grid-cols-5 gap-5 mb-6">

        {[
          { title: "Total requisiciones", value: 48, color: "blue" },
          { title: "Aceptadas", value: 18, color: "green" },
          { title: "En proceso", value: 15, color: "yellow" },
          { title: "Finalizadas", value: 10, color: "purple" },
          { title: "Rechazadas", value: 5, color: "red" },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm"
          >
            <h2 className="text-xl font-bold text-gray-800">
              {item.value}
            </h2>
            <p className={`text-sm font-medium text-${item.color}-600`}>
              {item.title}
            </p>
          </div>
        ))}

      </div>

      {/* TABLA */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-50 text-gray-400 text-xs uppercase">
            <tr className="text-center">
              <th className="p-4 text-left">Código</th>
              <th>Fecha</th>
              <th>Solicitado por</th>
              <th>Área</th>
              <th className="text-left">Producto</th>
              <th>Cantidad</th>
              <th>Destino</th>
              <th>Estado</th>
              <th>Fecha Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {historial.map((r, i) => (
              <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">

                <td className="p-4 font-medium">{r.codigo}</td>
                <td className="text-center">{r.fecha}</td>
                <td className="text-center">{r.solicitante}</td>
                <td className="text-center">{r.area}</td>

                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <img src={r.img} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p>{r.producto}</p>
                      <span className="text-xs text-gray-400">{r.codigoProd}</span>
                    </div>
                  </div>
                </td>

                <td className="text-center">{r.cantidad}</td>
                <td className="text-center">{r.destino}</td>

                <td className="text-center">
                  <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-600">
                    {r.estado}
                  </span>
                </td>

                <td className="text-center text-xs text-gray-500">
                  {r.fechaEstado}
                </td>

                <td className="text-center">
                  <button className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100">
                    👁 Ver detalle
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}