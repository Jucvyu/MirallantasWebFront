import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import FormModal from '../base/FormModal';
import { AbonosAdminProvider } from '../../context/AbonosAdminContext';
import { adminProfile, estadosActivo, roles, tiposDocumento } from '../../data/mockData';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

const TITLES = {
  '/admin': 'Dashboard',
  '/admin/roles': 'Roles y permisos',
  '/admin/usuarios': 'Usuarios',
  '/admin/clientes': 'Clientes',
  '/admin/proveedores': 'Proveedores',
  '/admin/terceros': 'Terceros',
  '/admin/productos': 'Productos',
  '/admin/categorias': 'Categorías',
  '/admin/marcas': 'Marcas',
  '/admin/pedidos-cotizacion': 'Pedidos-Cotización',
  '/admin/ventas': 'Ventas',
  '/admin/compras': 'Compras',
  '/admin/solicitudes-servicio': 'Solicitudes de servicio',
  '/admin/creditos': 'Cartera',
  '/admin/solicitudes-credito': 'Solicitudes de crédito',
  '/admin/abonos': 'Abonos',
};

// Mismos campos que usa el formulario de Usuarios.
const perfilSections = [
  {
    title: 'Foto de perfil',
    fields: [{ key: 'foto', label: 'Imagen', type: 'image', span: 2, placeholder: 'Sube tu foto (JPG o PNG)' }],
  },
  {
    title: 'Datos personales',
    fields: [
      { key: 'nombre', label: 'Nombre completo', required: true, span: 2 },
      { key: 'tipoDocumento', label: 'Tipo de documento', type: 'select', required: true, options: tiposDocumento },
      { key: 'numeroDocumento', label: 'Número de documento', type: 'number', required: true },
      { key: 'correo', label: 'Correo electrónico', type: 'email', required: true },
      { key: 'telefono', label: 'Teléfono', type: 'tel' },
    ],
  },
  {
    title: 'Acceso al sistema',
    fields: [
      { key: 'rol', label: 'Rol', type: 'select', options: roles.map((r) => r.nombre) },
      { key: 'estado', label: 'Estado', type: 'select', options: estadosActivo },
      {
        key: 'password',
        label: 'Nueva contraseña',
        type: 'password',
        placeholder: 'Déjala vacía para no cambiarla',
        span: 2,
      },
    ],
  },
];

export default function AdminLayout() {
  const { pathname } = useLocation();
  const title = TITLES[pathname] ?? 'Dashboard';

  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState(adminProfile);
  const [perfilOpen, setPerfilOpen] = useState(false);

  return (
    <AbonosAdminProvider>
    <div className="flex min-h-screen bg-slate-50 dark:bg-brand-navy-900">
      <AdminSidebar profile={profile} mobileOpen={menuOpen} onCloseMobile={() => setMenuOpen(false)} />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <AdminTopbar
          title={title}
          profile={profile}
          onOpenMenu={() => setMenuOpen(true)}
          onEditarPerfil={() => setPerfilOpen(true)}
        />
        {/* `key` fuerza la animación en cada cambio de módulo */}
        <main key={pathname} className="ml-vista flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

      {perfilOpen && (
        <FormModal
          mode="edit"
          title="Mi perfil"
          subtitle="Actualiza tus datos de contacto y de acceso."
          sections={perfilSections}
          initialValues={profile}
          submitLabel="Guardar perfil"
          onSubmit={(values) => setProfile((p) => ({ ...p, ...values }))}
          onClose={() => setPerfilOpen(false)}
        />
      )}
    </div>
    </AbonosAdminProvider>
  );
}
