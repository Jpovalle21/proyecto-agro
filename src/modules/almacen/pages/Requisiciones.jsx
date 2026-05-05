import { useNavigate } from "react-router-dom";

const requisiciones = [
  {
    codigo: "REQ-00012",
    fecha: "15/05/2024",
    solicitante: "Juan Pablo",
    area: "Producción",
    producto: "Guantes de Nitrilo",
    codigoProd: "GN-001",
    cantidad: 100,
    destino: "Producción",
    estado: "pendiente",
    img: "https://instrumentalia.com.co/44166-large_default/guante-de-nitrilo-azul-talla-l-caja-100-unidades.jpg",
  },
  {
    codigo: "REQ-00011",
    fecha: "14/05/2024",
    solicitante: "Andres Aranda",
    area: "Calidad",
    producto: "Lentes de Seguridad",
    codigoProd: "LS-003",
    cantidad: 50,
    destino: "Calidad",
    estado: "pendiente",
    img: "https://www.loencuentras.com.co/1509-large_default/gafas-de-seguridad-ajustables.jpg",
  },
  {
    codigo: "REQ-00010",
    fecha: "13/05/2024",
    solicitante: "Cristian",
    area: "Mantenimiento",
    producto: "Casco de Seguridad",
    codigoProd: "CS-002",
    cantidad: 30,
    destino: "Mantenimiento",
    estado: "aceptada",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjCc1nQdy4OCLl_wUU8p15VbjTQV1pUJM7XA&s",
  },
];

export default function Requisiciones() {
  const navigate = useNavigate();
  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Requisiciones
        </h1>
      </div>

      {/* RESUMEN */}
      <div className="grid grid-cols-4 gap-5 mb-6">

        {[
          {
            title: "Pendientes",
            value: 12,
            color: "blue",
            icon: "📄",
            desc: "Solicitudes pendientes",
          },
          {
            title: "Aceptadas",
            value: 5,
            color: "green",
            icon: "✔",
            desc: "Enviadas a compras",
          },
          {
            title: "En proceso",
            value: 7,
            color: "yellow",
            icon: "🚚",
            desc: "En camino / Por recibir",
          },
          {
            title: "Finalizadas",
            value: 8,
            color: "purple",
            icon: "📦",
            desc: "Entregadas y recibidas",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition flex items-center gap-4"
            >
            {/* ICONO */}
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg
              bg-${item.color}-100 text-${item.color}-600`}
            >
              {item.icon}
            </div>

            {/* TEXTO */}
            <div>
              {/* NÚMERO (PROTAGONISTA) */}
              <h2 className="text-2xl font-bold text-gray-800 leading-none">
                {item.value}
              </h2>

              {/* TÍTULO (CON COLOR) */}
              <p className={`text-sm font-medium text-${item.color}-600`}>
                {item.title}
              </p>

              {/* DESCRIPCIÓN */}
              <p className="text-xs text-gray-400 mt-1">
                {item.desc}
              </p>
            </div>
          </div>
        ))}

      </div>

      {/* FILTROS */}
      <div className="flex justify-end mb-6">
        <div className="bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-lg flex items-center gap-3">

          {/* ESTADO */}
          <select className="input-pro w-44 text-sm">
            <option>Estado: Todos</option>
          </select>

          {/* BUSCADOR */}
          <div className="relative">
            <input
              className="input-pro w-64 pl-9 text-sm"
              placeholder="Buscar..."
            />
          </div>

          {/* HISTORIAL */}
          <button 
            onClick={() => navigate("/requisiciones/historial")}
            className="flex items-center gap-2 px-3 py-2 rounded-lg 
            bg-gray-50 border border-gray-200 text-gray-600 text-sm
            hover:bg-gray-100 transition"
          >
            Historial
          </button>

        </div>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

        <table className="w-full text-sm">

          {/* HEAD */}
          <thead className="bg-gray-50 text-gray-400 text-xs uppercase">
            <tr className="text-center">
              <th className="p-4 text-left">Código</th>
              <th className="py-3">Fecha</th>
              <th className="py-3">Solicitado por</th>
              <th className="py-3">Área</th>
              <th className="py-3 text-left">Producto</th>
              <th className="py-3">Cantidad</th>
              <th className="py-3">Destino</th>
              <th className="py-3">Estado</th>
              <th className="py-3">Acciones</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="text-gray-600">

            {requisiciones.map((r, i) => (
              <tr
                key={i}
                className="border-t border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="p-4 font-medium text-gray-700">
                  {r.codigo}
                </td>

                <td className="text-center">{r.fecha}</td>
                <td className="text-center">{r.solicitante}</td>
                <td className="text-center">{r.area}</td>

                {/* PRODUCTO */}
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={r.img}
                      className="w-11 h-11 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-gray-700 text-sm">
                        {r.producto}
                      </p>
                      <span className="text-xs text-gray-400">
                        {r.codigoProd}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="text-center font-medium">
                  {r.cantidad}
                </td>

                <td className="text-center">{r.destino}</td>

                {/* ESTADO */}
                <td className="text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                      ${
                        r.estado === "pendiente"
                          ? "bg-blue-100 text-blue-600"
                          : r.estado === "aceptada"
                          ? "bg-green-100 text-green-600"
                          : r.estado === "proceso"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                  >
                    {r.estado}
                  </span>
                </td>

                {/* ACCIONES */}
                <td>
                  <div className="flex justify-center gap-2">

                    <button className="w-9 h-9 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 hover:scale-105 transition flex items-center justify-center">
                      ✓
                    </button>

                    <button className="w-9 h-9 rounded-lg bg-red-100 text-red-500 hover:bg-red-200 hover:scale-105 transition flex items-center justify-center">
                      ✕
                    </button>

                  </div>
                </td>

              </tr>
            ))}

          </tbody>
        </table>

        {/* FOOTER */}
        <div className="flex justify-between items-center px-4 py-3 text-sm text-gray-400 border-t border-gray-100">

          <p>Mostrando 1 a 6 de 20 requisiciones</p>

          <div className="flex gap-1">
            <button className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-100 transition">
              1
            </button>
            <button className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-100 transition">
              2
            </button>
            <button className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-100 transition">
              3
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}