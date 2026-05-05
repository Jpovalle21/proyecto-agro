const productos = [
  {
    nombre: "Guantes de Nitrilo Talla L",
    codigo: "GN-001",
    stock: 150,
    img: "https://instrumentalia.com.co/44166-large_default/…nte-de-nitrilo-azul-talla-l-caja-100-unidades.jpg",
  },
  {
    nombre: "Casco de Seguridad",
    codigo: "CS-002",
    stock: 85,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjCc1nQdy4OCLl_wUU8p15VbjTQV1pUJM7XA&s",
  },
  {
    nombre: "Lentes de Seguridad",
    codigo: "LS-003",
    stock: 60,
    img: "https://www.loencuentras.com.co/1509-large_default/gafas-de-seguridad-ajustables.jpg",
  },
  {
    nombre: "Botas de Seguridad",
    codigo: "BS-004",
    stock: 40,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_LdxHw0CE7FlWkken5tcf2lEOf4R_uvnNYQ&s",
  },
  {
    nombre: "Uniforme operario",
    codigo: "CR-005",
    stock: 75,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr02azXmO6H0BgWfoLq_WbY_jH4ffh-Ravng&s",
  },
  {
    nombre: "Botas de Producción",
    codigo: "PA-006",
    stock: 30,
    img: "https://www.bataindustrials.com.co/wp-content/uploads/2015/06/lactica-802-1468-450x450.png",
  },
  {
    nombre: "Mascarilla de Prdocucción",
    codigo: "MK-007",
    stock: 120,
    img: "https://http2.mlstatic.com/D_NQ_NP_862775-CBT96010636006_102025-O.webp",
  },
  {
    nombre: "Rodamiento",
    codigo: "AG-008",
    stock: 55,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_wxac63LBJuz3laTDJteLPOdm-rarbjyq1Q&s",
  },
];

export default function Inventario() {
  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Inventario
        </h1>
      </div>

      {/* FILTROS */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center justify-between gap-4 flex-wrap">

        {/* BUSCADOR */}
        <div className="flex-1 min-w-[250px]">
          <label className="label">Buscar</label>
          <div className="relative">
            <input
              className="input-pro pl-10"
              placeholder="Buscar por ítem o nombre..."
            />
            
          </div>
        </div>

        {/* ORDEN */}
        <div className="w-60">
          <label className="label">Ordenar por</label>
          <select className="input-pro">
            <option>Stock: Mayor a menor</option>
            <option>Stock: Menor a mayor</option>
          </select>
        </div>

        {/* BOTÓN */}
        <button className="btn-secondary mt-5">
          Ver Salidas
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-4 gap-5">

        {productos.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition group"
          >
            {/* IMAGEN */}
            <div className="h-28 flex items-center justify-center mb-4">
              <img
                src={item.img}
                alt=""
                className="h-24 object-contain group-hover:scale-105 transition"
              />
            </div>

            {/* INFO */}
            <h3 className="text-sm font-medium text-gray-800 mb-1">
              {item.nombre}
            </h3>

            <p className="text-xs text-gray-400 mb-2">
              Ítem: {item.codigo}
            </p>

            {/* STOCK */}
            <div>
              <p className="text-xs text-gray-400">Stock</p>
              <p
                className={`text-lg font-semibold ${
                  item.stock > 80
                    ? "text-green-600"
                    : item.stock > 40
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              >
                {item.stock}
              </p>
              <span className="text-xs text-gray-400">
                unidades
              </span>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}