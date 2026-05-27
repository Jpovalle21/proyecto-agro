import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./modules/dashboard/pages/Dashboard";
import AppLayout from "./components/layout/AppLayout";
import ModuleLayout from "./components/layout/ModuleLayout";
import PlaceholderPage from "./components/ui/PlaceholderPage";

import { MODULES } from "./config/Modules";

// Almacén
import RegistroFactura from "./modules/almacen/pages/RegistroFactura";
import Inventario from "./modules/almacen/pages/Inventario";
import Requisiciones from "./modules/almacen/pages/Requisiciones";
import Historial from "./modules/almacen/pages/Historial";
import HistorialRequisiciones from "./modules/almacen/pages/HistorialRequisiciones";
import Asignacion from "./modules/almacen/pages/Asignacion";

// Gestión Humana
import Ingresos from "./modules/gestion-humana/pages/Ingresos";
import PerfilUsuario from "./modules/gestion-humana/pages/PerfilUsuario";
import Novedades from "./modules/gestion-humana/pages/Novedades";
import Bienestar from "./modules/gestion-humana/pages/Bienestar";
import Informe from "./modules/gestion-humana/pages/Informe";

// Compras
import Solicitudes from "./modules/compras/pages/Solicitudes";
import HistorialCompras from "./modules/compras/pages/HistorialCompras";

// Mantenimiento
import Maquinarias from "./modules/mantenimiento/pages/Maquinarias";
import HistorialMantenimiento from "./modules/mantenimiento/pages/HistorialMantenimiento";
import SolicitudesMantenimiento from "./modules/mantenimiento/pages/SolicitudesMantenimiento";




function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* REDIRECCIÓN INICIAL */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* DASHBOARD */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* MÓDULOS */}
        {MODULES.map((module) => {
          if (module.id === "almacen") {
            return (
              <Route
                key={module.id}
                element={<ModuleLayout moduleId={module.id} />}
              >
                <Route
                  path={module.path}
                  element={<Navigate to={`${module.path}/registro-factura`} replace />}
                />

                <Route
                  path={`${module.path}/registro-factura`}
                  element={<RegistroFactura />}
                />

                <Route
                  path={`${module.path}/inventario`}
                  element={<Inventario />}
                />

                <Route
                  path={`${module.path}/requisiciones`}
                  element={<Requisiciones />}
                />

                <Route
                  path={`${module.path}/asignacion`}
                  element={<PlaceholderPage title="Asignación" />}
                />

                <Route
                  path={`${module.path}/historial-requisiciones`}
                  element={<HistorialRequisiciones />}
                />

                <Route
                  path={`${module.path}/historial`}
                  element={<Historial />}
                />
              </Route>
            );
          }

          if (module.id === "gestion_humana") {
            return (
              <Route
                key={module.id}
                element={<ModuleLayout moduleId={module.id} />}
              >
                <Route
                  path={module.path}
                  element={<Navigate to={`${module.path}/ingresos`} replace />}
                />

                <Route
                  path={`${module.path}/ingresos`}
                  element={<Ingresos />}
                />

                <Route
                  path={`${module.path}/perfil-usuario`}
                  element={<PerfilUsuario />}
                />

                <Route
                  path={`${module.path}/novedades`}
                  element={<Novedades />}
                />

                <Route
                  path={`${module.path}/bienestar`}
                  element={<Bienestar />}
                />

                <Route
                  path={`${module.path}/informe`}
                  element={<Informe />}
                />
              </Route>
            );
          } 

          if (module.id === "compras") {
            return (
              <Route
                key={module.id}
                element={<ModuleLayout moduleId={module.id} />}
              >
                <Route
                  path={module.path}
                  element={<Navigate to={`${module.path}/solicitudes`} replace />}
                />

                <Route
                  path={`${module.path}/solicitudes`}
                  element={<Solicitudes />}
                />

                <Route
                  path={`${module.path}/historial`}
                  element={<HistorialCompras />}
                />
              </Route>
            );
          }

          if (module.id === "mantenimiento") {
            return (
              <Route
                key={module.id}
                element={<ModuleLayout moduleId={module.id} />}
              >
                <Route
                  path={module.path}
                  element={<Navigate to={`${module.path}/solicitudes-mantenimiento`} replace />}
                />

                <Route
                  path={`${module.path}/solicitudes-mantenimiento`}
                  element={<SolicitudesMantenimiento />}
                />

                <Route
                  path={`${module.path}/historial-mantenimiento`}
                  element={<HistorialMantenimiento />}
                />

                <Route
                  path={`${module.path}/maquinarias`}
                  element={<Maquinarias />}
                />

                </Route>
   
            );
          }


          return (
            <Route
              key={module.id}
              element={<ModuleLayout moduleId={module.id} />}
            >
              <Route
                path={module.path}
                element={<PlaceholderPage title={module.name} />}
              />
            </Route>
          );
        })}

        {/* RUTA POR DEFECTO */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
