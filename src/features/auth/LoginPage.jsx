import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/base/Logo';
import TruckTire from '../../components/base/TruckTire';

const DEMO_ACCOUNTS = [
  { role: 'Administrador', email: 'admin@mirallantas.com', to: '/admin' },
  { role: 'Cliente', email: 'maria@gmail.com', to: '/portal' },
];

export default function LoginPage() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/admin');
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Panel de marca */}
      <div className="hidden flex-col justify-between bg-brand-navy-950 p-12 lg:flex">
        <div>
          <Logo size="md" />
          <h1 className="mt-10 max-w-sm text-4xl font-extrabold leading-tight text-white">
            ERP para tu negocio de llantas
          </h1>
          <p className="mt-4 max-w-sm text-slate-400">
            Gestión completa de ventas, pedidos, reencauche, créditos, entregas y más — en una
            sola plataforma.
          </p>
        </div>
        {/* Llantas de camión */}
        <div className="relative mt-10 flex items-end justify-center">
          <TruckTire className="h-40 w-40 shrink-0 drop-shadow-2xl" />
          <TruckTire className="-ml-8 h-52 w-52 shrink-0 drop-shadow-2xl" />
          <TruckTire className="-ml-8 h-40 w-40 shrink-0 drop-shadow-2xl" />
        </div>
      </div>

      {/* Formulario */}
      <div className="flex items-center justify-center bg-white px-6 py-16 dark:bg-brand-navy-900">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo size="sm" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Iniciar sesión</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Accede a tu cuenta ERP</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Correo electrónico <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="user@mirallantas.com"
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-amber-400 focus:outline-none dark:border-white/10 dark:bg-brand-navy-800 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-amber-400 focus:outline-none dark:border-white/10 dark:bg-brand-navy-800 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-400 py-2.5 text-sm font-semibold text-slate-900 hover:bg-amber-300"
            >
              Ingresar <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-6 rounded-xl bg-slate-50 p-4 dark:bg-white/5">
            <p className="mb-3 text-xs font-bold tracking-wide text-slate-500 dark:text-slate-400">
              CUENTAS DE DEMOSTRACIÓN
            </p>
            <div className="space-y-2.5">
              {DEMO_ACCOUNTS.map(({ role, email, to }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => navigate(to)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-1 py-1 text-left hover:bg-white dark:hover:bg-white/5"
                >
                  <span className="h-2 w-2 shrink-0 rounded-full bg-amber-400" />
                  <span>
                    <span className="block text-sm font-semibold text-slate-800 dark:text-slate-100">{role}</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">{email} · 123456</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
