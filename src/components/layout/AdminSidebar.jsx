import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Briefcase,
  Building2,
  ChevronDown,
  ChevronLeft,
  CreditCard,
  FileText,
  LayoutGrid,
  LogOut,
  Package,
  Receipt,
  Shield,
  ShoppingCart,
  Tag,
  Truck,
  Users,
  Wrench,
  X,
} from 'lucide-react';
import Logo from '../base/Logo';

// El Dashboard queda fuera del acordeón: es el punto de entrada y debe
// estar siempre visible.
const DASHBOARD = { to: '/admin', label: 'Dashboard', icon: LayoutGrid, end: true };

const SECTIONS = [
  {
    label: 'GESTIÓN',
    items: [
      { to: '/admin/usuarios', label: 'Usuarios', icon: Users },
      { to: '/admin/roles', label: 'Roles', icon: Shield },
      { to: '/admin/proveedores', label: 'Proveedores', icon: Building2 },
      { to: '/admin/terceros', label: 'Terceros', icon: Briefcase },
    ],
  },
  {
    label: 'CATÁLOGO',
    items: [
      { to: '/admin/productos', label: 'Productos', icon: Package },
      { to: '/admin/categorias', label: 'Categorías', icon: Tag },
    ],
  },
  {
    label: 'OPERACIÓN',
    items: [
      { to: '/admin/pedidos-cotizacion', label: 'Pedidos-Cotización', icon: FileText },
      { to: '/admin/ordenes-compra', label: 'Órd. de Compra', icon: ShoppingCart },
      { to: '/admin/entregas', label: 'Entregas', icon: Truck },
      { to: '/admin/reencauche', label: 'Reencauche', icon: Wrench },
    ],
  },
  {
    label: 'FINANZAS',
    items: [
      { to: '/admin/creditos', label: 'Créditos', icon: CreditCard },
      { to: '/admin/abonos', label: 'Abonos', icon: Receipt },
    ],
  },
];

/**
 * Sidebar del admin.
 *
 * - En escritorio (lg+) queda fijo y se puede colapsar a solo iconos.
 * - Por debajo de lg se comporta como cajón: se abre desde el botón de
 *   menú del topbar (`mobileOpen`) sobre un velo oscuro.
 */
export default function AdminSidebar({ profile, mobileOpen = false, onCloseMobile }) {
  const [collapsed, setCollapsed] = useState(false);
  // Acordeón: por defecto todo desplegado; aquí solo se anotan las
  // secciones que el usuario decidió ocultar.
  const [cerradas, setCerradas] = useState({});

  const alternarSeccion = (label) => setCerradas((prev) => ({ ...prev, [label]: !prev[label] }));
  const iniciales = profile.nombre
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <>
      {/* Velo del cajón en móvil */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
          role="presentation"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-screen shrink-0 flex-col bg-brand-navy-950 transition-all duration-200 lg:sticky lg:top-0 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'w-[76px]' : 'w-[220px]'}`}
      >
        <div className="flex items-center justify-between px-4 py-5">
          {collapsed ? (
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 text-sm font-bold text-slate-900">
              ML
            </span>
          ) : (
            <Logo size="sm" />
          )}
          {!collapsed && (
            <>
              <button
                onClick={() => setCollapsed(true)}
                className="hidden text-slate-500 hover:text-slate-300 lg:block"
                aria-label="Colapsar menú"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={onCloseMobile}
                className="text-slate-500 hover:text-slate-300 lg:hidden"
                aria-label="Cerrar menú"
              >
                <X size={18} />
              </button>
            </>
          )}
        </div>

        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="mx-auto mb-2 text-slate-500 hover:text-slate-300"
            aria-label="Expandir menú"
          >
            <ChevronLeft size={16} className="rotate-180" />
          </button>
        )}

        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          {/* Dashboard: siempre visible, sin sección ni plegado */}
          <NavLink
            to={DASHBOARD.to}
            end={DASHBOARD.end}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `mb-4 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-amber-400/10 text-amber-400'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`
            }
            title={collapsed ? DASHBOARD.label : undefined}
          >
            <DASHBOARD.icon size={16} className="shrink-0" />
            {!collapsed && <span className="truncate">{DASHBOARD.label}</span>}
          </NavLink>

          {SECTIONS.map((section) => {
            // Con el sidebar en modo icono no hay títulos que plegar, así
            // que el acordeón solo aplica cuando está expandido.
            const abierta = collapsed || !cerradas[section.label];
            return (
            <div key={section.label} className="mb-4">
              {!collapsed && (
                <div className="mb-1.5 flex items-center justify-between gap-2 px-2.5">
                  <p className="text-[10px] font-bold tracking-wider text-slate-600">{section.label}</p>
                  <button
                    type="button"
                    onClick={() => alternarSeccion(section.label)}
                    aria-expanded={abierta}
                    aria-label={`${abierta ? 'Ocultar' : 'Mostrar'} ${section.label}`}
                    className="flex h-5 w-5 items-center justify-center rounded text-slate-600 transition-colors hover:bg-white/5 hover:text-slate-300"
                  >
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-200 ${abierta ? '' : '-rotate-90'}`}
                    />
                  </button>
                </div>
              )}
              {/* El plegado se anima con grid-rows: no necesita medir alturas */}
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                  abierta ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
              <ul className="space-y-0.5">
                {section.items.map(({ to, label, icon: Icon, end }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      end={end}
                      onClick={onCloseMobile}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-amber-400/10 text-amber-400'
                            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                        }`
                      }
                      title={collapsed ? label : undefined}
                    >
                      <Icon size={16} className="shrink-0" />
                      {!collapsed && <span className="truncate">{label}</span>}
                    </NavLink>
                  </li>
                ))}
              </ul>
                </div>
              </div>
            </div>
            );
          })}
        </nav>

        <div className="border-t border-white/5 p-3">
          <div className="flex items-center gap-2.5 rounded-lg px-1 py-1.5">
            {profile.foto ? (
              <img src={profile.foto} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" />
            ) : (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-slate-900">
                {iniciales}
              </span>
            )}
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{profile.nombre}</p>
                <p className="text-xs text-slate-500">{profile.rol}</p>
              </div>
            )}
          </div>
          <NavLink
            to="/"
            className="mt-1 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-slate-500 hover:bg-white/5 hover:text-slate-300"
          >
            <LogOut size={15} />
            {!collapsed && 'Salir'}
          </NavLink>
        </div>
      </aside>
    </>
  );
}
