import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CreditoProvider } from './context/CreditoContext';
import { ThemeProvider } from './context/ThemeContext';

import LandingPage from './features/landing/LandingPage';
import LoginPage from './features/auth/LoginPage';

import AdminLayout from './components/layout/AdminLayout';
import DashboardPage from './features/admin/dashboard/DashboardPage';
import UsuariosPage from './features/admin/usuarios/UsuariosPage';
import RolesPage from './features/admin/roles/RolesPage';
import ProveedoresPage from './features/admin/proveedores/ProveedoresPage';
import TercerosPage from './features/admin/terceros/TercerosPage';
import ProductosPage from './features/admin/generic/ProductosPage';
import CategoriasPage from './features/admin/generic/CategoriasPage';
import PedidosCotizacionPage from './features/admin/generic/PedidosCotizacionPage';
import OrdenesCompraPage from './features/admin/generic/OrdenesCompraPage';
import EntregasPage from './features/admin/generic/EntregasPage';
import ReencauchePage from './features/admin/generic/ReencauchePage';
import CreditosPage from './features/admin/generic/CreditosPage';
import AbonosPage from './features/admin/generic/AbonosPage';

import ClientLayout from './components/layout/ClientLayout';
import ClientHomePage from './features/portal/ClientHomePage';
import CatalogoPage from './features/portal/CatalogoPage';
import ClientPedidosPage from './features/portal/ClientPedidosPage';
import NuevoPedidoPage from './features/portal/NuevoPedidoPage';

export default function App() {
  return (
    <ThemeProvider>
      <CreditoProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="usuarios" element={<UsuariosPage />} />
              <Route path="roles" element={<RolesPage />} />
              <Route path="proveedores" element={<ProveedoresPage />} />
              <Route path="terceros" element={<TercerosPage />} />
              <Route path="productos" element={<ProductosPage />} />
              <Route path="categorias" element={<CategoriasPage />} />
              <Route path="pedidos-cotizacion" element={<PedidosCotizacionPage />} />
              <Route path="ordenes-compra" element={<OrdenesCompraPage />} />
              <Route path="entregas" element={<EntregasPage />} />
              <Route path="reencauche" element={<ReencauchePage />} />
              <Route path="creditos" element={<CreditosPage />} />
              <Route path="abonos" element={<AbonosPage />} />
            </Route>

            <Route path="/portal" element={<ClientLayout />}>
              <Route index element={<ClientHomePage />} />
              <Route path="catalogo" element={<CatalogoPage />} />
              <Route path="pedidos" element={<ClientPedidosPage />} />
              <Route path="nuevo-pedido" element={<NuevoPedidoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CreditoProvider>
    </ThemeProvider>
  );
}
