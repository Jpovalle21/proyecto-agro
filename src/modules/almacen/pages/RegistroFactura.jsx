import "../almacen.css";


export default function RegistroFactura() {
  return (
    <div className="p-4 w-full">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">
          Registro de Factura
        </h1>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Registra y gestiona las facturas de compra
        </p>
      </div>

      {/* CARD */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-6 py-4">

        {/* TITLE */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[rgb(205,205,205)]/20 flex items-center justify-center">
            📄
          </div>
          <h2 className="text-lg font-semibold text-gray-700">
            Información de la Factura
          </h2>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-2 gap-5 font-medium">

          <div>
            <label className="label">Número de Factura</label>
            <input className="input-pro" placeholder="FAC-0012345" />
          </div>

          <div>
            <label className="label">Proveedor</label>
            <select className="input-pro">
              <option>Proveedor ABC S.A.</option>
            </select>
          </div>

          <div>
            <label className="label">Valor Unidad</label>
            <input className="input-pro" placeholder="$ 25.000" />
          </div>

          <div>
            <label className="label">Código de Ítem</label>
            <input className="input-pro" placeholder="GN-001" />
          </div>

          <div>
            <label className="label">Nombre del Ítem</label>
            <input className="input-pro" placeholder="Guantes..." />
          </div>

          <div>
            <label className="label">Cantidad</label>
            <input className="input-pro" placeholder="100" />
          </div>

          <div className="col-span-2">
            <label className="label">Discriminación</label>
            <input className="input-pro" placeholder="N/A" />
          </div>
        </div>

        {/* IMÁGENES */}
        <div className="grid grid-cols-2 gap-6 mt-6">

          {/* PRODUCTO */}
          <div className="upload-box">
            <p className="upload-title">Foto de Producto</p>

            <div className="upload-area">
              <span className="text-3xl">📷</span>
              <p className="text-sm text-gray-500 mt-2">
                Subir imagen
              </p>
            </div>
          </div>

          {/* FACTURA */}
          <div className="upload-box">
            <p className="upload-title">Foto de Factura</p>

            <div className="upload-area">
              <span className="text-3xl">📄</span>
              <p className="text-sm text-gray-500 mt-2">
                Subir factura
              </p>
            </div>
          </div>

        </div>

        {/* BOTONES */}
        <div className="flex justify-between items-center mt-5">

          <button className="btn-secondary">
            Limpiar
          </button>

          <button className="btn-primary">
            Guardar Registro
          </button>

        </div>
      </div>
    </div>
  );
}