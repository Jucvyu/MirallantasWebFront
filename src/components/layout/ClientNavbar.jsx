import { useState } from 'react';
import { LogOut, Menu, Wallet, X } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import { useCredito } from '../../context/CreditoContext';
import Logo from '../base/Logo';
import ThemeToggle from '../base/ThemeToggle';

const LINKS = [
  { to: '/portal', label: 'Inicio', end: true },
  { to: '/portal/catalogo', label: 'Catálogo' },
  { to: '/portal/pedidos', label: 'Mis Pedidos' },
];

const linkClass = ({ isActive }) =>
  `whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
    isActive
      ? 'border border-amber-400 text-amber-500 dark:text-amber-400'
      : 'border border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100'
  }`;

export default function ClientNavbar({ profile, onOpenProfile }) {
  const [open, setOpen] = useState(false);
  const { saldoUsableTexto } = useCredito();

  // Iniciales para el avatar cuando el cliente no ha subido foto.
  const iniciales = profile.nombre
    .split(' ')
    .slice(0, 2)
    .map((palabra) => palabra[0])
    .join('')
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-brand-navy-950/90">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Logo size="sm" />

        {/* Navegación de escritorio */}
        <nav className="hidden flex-1 items-center gap-1 overflow-x-auto lg:flex">
          {LINKS.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <ThemeToggle />
          {/* Saldo de crédito disponible, siempre a la vista */}
          <span
            title="Cupo de crédito disponible"
            className="hidden items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 sm:inline-flex"
          >
            <Wallet size={12} /> Saldo usable: {saldoUsableTexto}
          </span>

          {/* La foto abre el modal de perfil, igual que en el admin */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition-colors hover:bg-slate-100 dark:hover:bg-white/10"
            title="Ver y editar mi perfil"
          >
            {profile.foto ? (
              <img src={profile.foto} alt="" className="h-7 w-7 rounded-full object-cover" />
            ) : (
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-slate-900">
                {iniciales}
              </span>
            )}
            <span className="hidden text-sm font-medium text-slate-700 dark:text-slate-200 sm:inline">
              {profile.nombre}
            </span>
          </button>
          <Link
            to="/"
            className="hidden items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 sm:flex"
          >
            <LogOut size={13} /> Salir
          </Link>

          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 lg:hidden"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Navegación desplegable en móvil / tablet */}
      {open && (
        <nav className="border-t border-slate-200 px-4 pb-4 pt-2 dark:border-white/10 lg:hidden">
          <ul className="space-y-1">
            {LINKS.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  onClick={() => setOpen(false)}
                  className={(state) => `${linkClass(state)} block`}
                >
                  {label}
                </NavLink>
              </li>
            ))}
            <li>
              <Link
                to="/"
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 dark:text-slate-400"
              >
                <LogOut size={14} /> Salir
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
