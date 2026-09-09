import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import FormModal from '../base/FormModal';
import { adminProfile, roles, tiposDocumento } from '../../data/mockData';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

const TITLES = {
  '/admin': 'Dashboard',
  '/admin/usuarios': 'Usuarios',
  '/admin/roles': 'Roles',
  '/admin/proveedores': 'Proveedores',
  '/admin/terceros': 'Terceros',
  '/admin/productos': 'Productos',
  '/admin/categorias': 'Categorías',
  '/admin/pedidos-cotizacion': 'Pedidos-Cotización',
  '/admin/ordenes-compra': 'Órdenes de Compra',
  '/admin/entregas': 'Entregas',
  '/admin/reencauche': 'Reencauche',
  '/admin/creditos': 'Créditos',
  '/admin/abonos': 'Abonos',
};

// Mismos campos de la tabla `usuario` que usa el formulario de Usuarios.
const perfilSections = [
  {
    title: 'Foto de perfil',
    fields: [{ key: 'foto', label: 'Imagen', type: 'image', span: 2, placeholder: 'Sube tu foto (JPG o PNG)' }],
  },
  {
    title: 'Datos personales',
    fields: [
      { key: 'nombre', label: 'Nombre completo', required: true, span: 2 },
      { key: 'tipoDoc', label: 'Tipo de documento', type: 'select', required: true, options: tiposDocumento },
      { key: 'numDoc', label: 'Número de documento', required: true },
      { key: 'correo', label: 'Correo electrónico', type: 'email', required: true },
      { key: 'telefono', label: 'Teléfono', type: 'tel' },
    ],
  },
  {
    title: 'Acceso al sistema',
    fields: [
      { key: 'rol', label: 'Rol', type: 'select', options: roles.map((r) => r.nombre) },
      { key: 'activo', label: 'Estado', type: 'select', options: ['Activo', 'Inactivo'] },
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
    <div className="flex min-h-screen bg-slate-50 dark:bg-brand-navy-900">
      <AdminSidebar profile={profile} mobileOpen={menuOpen} onCloseMobile={() => setMenuOpen(false)} />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <AdminTopbar
          title={title}
          profile={profile}
          onOpenMenu={() => setMenuOpen(true)}
          onOpenProfile={() => setPerfilOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6">
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
  );
}
