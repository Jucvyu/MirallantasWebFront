import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CarteraDeSesion, SesionProvider } from './context/SesionContext';
import { ThemeProvider } from './context/ThemeContext';

import LandingPage from './features/landing/LandingPage';
import LoginPage from './features/auth/LoginPage';
import AccesoDenegadoPage from './features/auth/AccesoDenegadoPage';

import AdminLayout from './components/layout/AdminLayout';
import DashboardPage from './features/admin/dashboard/DashboardPage';
import RolesPage from './features/admin/roles/RolesPage';
import UsuariosPage from './features/admin/usuarios/UsuariosPage';
import ClientesPage from './features/admin/clientes/ClientesPage';
import ProveedoresPage from './features/admin/proveedores/ProveedoresPage';
import TercerosPage from './features/admin/terceros/TercerosPage';
import ProductosPage from './features/admin/generic/ProductosPage';
import CategoriasPage from './features/admin/generic/CategoriasPage';
import MarcasPage from './features/admin/generic/MarcasPage';
import PedidosCotizacionPage from './features/admin/generic/PedidosCotizacionPage';
import VentasPage from './features/admin/generic/VentasPage';
import ComprasPage from './features/admin/generic/ComprasPage';
import SolicitudesServicioPage from './features/admin/generic/SolicitudesServicioPage';
import CreditosPage from './features/admin/generic/CreditosPage';
import SolicitudesCreditoPage from './features/admin/generic/SolicitudesCreditoPage';
import AbonosPage from './features/admin/generic/AbonosPage';

import ClientLayout from './components/layout/ClientLayout';
import ClientHomePage from './features/portal/ClientHomePage';
import CatalogoPage from './features/portal/CatalogoPage';
import ClientPedidosPage from './features/portal/ClientPedidosPage';
import CarteraPage from './features/portal/CarteraPage';

export default function App() {
  return (
    <ThemeProvider>
      <SesionProvider>
        <CarteraDeSesion>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/acceso-denegado" element={<AccesoDenegadoPage />} />

            {/* ---- Panel administrativo ---- */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="roles" element={<RolesPage />} />
              <Route path="usuarios" element={<UsuariosPage />} />
              <Route path="clientes" element={<ClientesPage />} />
              <Route path="proveedores" element={<ProveedoresPage />} />
              <Route path="terceros" element={<TercerosPage />} />
              <Route path="productos" element={<ProductosPage />} />
              <Route path="categorias" element={<CategoriasPage />} />
              <Route path="marcas" element={<MarcasPage />} />
              <Route path="pedidos-cotizacion" element={<PedidosCotizacionPage />} />
              <Route path="ventas" element={<VentasPage />} />
              <Route path="compras" element={<ComprasPage />} />
              <Route path="solicitudes-servicio" element={<SolicitudesServicioPage />} />
              <Route path="creditos" element={<CreditosPage />} />
              <Route path="solicitudes-credito" element={<SolicitudesCreditoPage />} />
              <Route path="abonos" element={<AbonosPage />} />
            </Route>

            {/* ---- Portal del cliente ---- */}
            <Route path="/portal" element={<ClientLayout />}>
              <Route index element={<ClientHomePage />} />
              <Route path="catalogo" element={<CatalogoPage />} />
              <Route path="pedidos" element={<ClientPedidosPage />} />
              <Route path="cartera" element={<CarteraPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
        </CarteraDeSesion>
      </SesionProvider>
    </ThemeProvider>
  );
}
