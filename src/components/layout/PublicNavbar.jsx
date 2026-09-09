import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../base/Logo';
import ThemeToggle from '../base/ThemeToggle';

const LINKS = [
  { href: '#modulos', label: 'Módulos' },
  { href: '#caracteristicas', label: 'Características' },
  { href: '#contacto', label: 'Contacto' },
];

export default function PublicNavbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-brand-navy-950/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-10">
        <Link to="/">
          <Logo size="sm" initials="ML" suffix="ERP" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-300"
          >
            Acceder <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </header>
  );
}
