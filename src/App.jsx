import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./modules/dashboard/pages/Dashboard";
import AppLayout from "./components/layout/AppLayout";
import ModuleLayout from "./components/layout/ModuleLayout";
import PlaceholderPage from "./components/ui/PlaceholderPage";

import { MODULES } from "./config/Modules";

import RegistroFactura from "./modules/almacen/pages/RegistroFactura";
import Inventario from "./modules/almacen/pages/Inventario";
import Requisiciones from "./modules/almacen/pages/Requisiciones";
import Historial from "./modules/almacen/pages/Historial";
import HistorialRequisiciones from "./modules/almacen/pages/HistorialRequisiciones";
import Asignacion from "./modules/almacen/pages/Asignacion";
import Ingresos from "./modules/gestion-humana/pages/Ingresos";
import PerfilUsuario from "./modules/gestion-humana/pages/PerfilUsuario";



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
                  element={<PlaceholderPage title="Novedades" />}
                />

                <Route
                  path={`${module.path}/bienestar`}
                  element={<PlaceholderPage title="Bienestar" />}
                />

                <Route
                  path={`${module.path}/informe`}
                  element={<PlaceholderPage title="Informe" />}
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
