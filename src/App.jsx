import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./Layout/MainLayout";
import RegistroFactura from "./modules/almacen/pages/RegistroFactura";
import Inventario from "./modules/almacen/pages/Inventario";
import Requisiciones from "./modules/almacen/pages/Requisiciones";
import HistorialRequisiciones from "./modules/almacen/pages/HistorialRequisiciones";
import Historial from "./modules/almacen/pages/Historial";

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<RegistroFactura />} />
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/requisiciones" element={<Requisiciones />} />
          <Route path="/requisiciones/historial" element={<HistorialRequisiciones />} />
          <Route path="/asignacion" element={<div>Asignación</div>} />
          <Route path="/historial" element={<Historial/>} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;