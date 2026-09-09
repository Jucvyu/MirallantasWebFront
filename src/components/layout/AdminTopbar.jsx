import { LogOut, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../base/ThemeToggle';

export default function AdminTopbar({ title, profile, onOpenMenu, onOpenProfile }) {
  const iniciales = profile.nombre
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 py-3.5 backdrop-blur dark:border-white/10 dark:bg-brand-navy-950/90 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onOpenMenu}
          className="-ml-1 flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 lg:hidden"
          aria-label="Abrir menú"
        >
          <Menu size={18} />
        </button>
        <h2 className="truncate text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</h2>
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:gap-4">
        <ThemeToggle />
        <div className="flex items-center gap-2 border-l border-slate-200 pl-3 dark:border-white/10 sm:pl-4">
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
            className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <LogOut size={13} /> <span className="hidden sm:inline">Salir</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
