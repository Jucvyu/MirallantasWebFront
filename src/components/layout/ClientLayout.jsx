import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import FormModal from '../base/FormModal';
import { AbonosProvider } from '../../context/AbonosContext';
import { CartProvider } from '../../context/CartContext';
import { clientProfile, tiposDocumento } from '../../data/mockData';
import ClientNavbar from './ClientNavbar';

// -------------------------------------------------------------------------
// Perfil del cliente
// Mismos campos que el modal del administrador, recortados a lo que un
// cliente puede tocar: sus datos de `usuario` más la dirección de
// facturación, que en la BD vive en la tabla `cliente`.
// -------------------------------------------------------------------------
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
    title: 'Facturación y acceso',
    fields: [
      { key: 'direccion', label: 'Dirección de facturación', span: 2 },
      {
        key: 'password',
        label: 'Nueva contraseña',
        type: 'password',
        span: 2,
        placeholder: 'Déjala vacía para no cambiarla',
      },
    ],
  },
];

export default function ClientLayout() {
  const [profile, setProfile] = useState(clientProfile);
  const [perfilOpen, setPerfilOpen] = useState(false);

  return (
    <CartProvider>
      <AbonosProvider>
        <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-brand-navy-900">
          <ClientNavbar profile={profile} onOpenProfile={() => setPerfilOpen(true)} />
          <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6 sm:py-8">
            <Outlet />
          </main>
          <footer className="border-t border-slate-200 py-5 text-center text-xs text-slate-400 dark:border-white/10 dark:text-slate-500">
            © 2024 MiraLlantas ERP · Portal de cliente
          </footer>
        </div>

        {perfilOpen && (
          <FormModal
            mode="edit"
            title="Mi perfil"
            subtitle="Actualiza tus datos de contacto y de facturación."
            sections={perfilSections}
            initialValues={profile}
            submitLabel="Guardar perfil"
            onSubmit={(values) => setProfile((p) => ({ ...p, ...values }))}
            onClose={() => setPerfilOpen(false)}
          />
        )}
      </AbonosProvider>
    </CartProvider>
  );
}
