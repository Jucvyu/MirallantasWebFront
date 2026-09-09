import { ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const STATS = [
  { value: '+500', label: 'Clientes gestionados', color: 'text-amber-400' },
  { value: '$2.1B', label: 'Ventas procesadas', color: 'text-amber-400' },
  { value: '15+', label: 'Módulos integrados', color: 'text-emerald-400' },
  { value: '99.9%', label: 'Disponibilidad', color: 'text-amber-400' },
];

export default function Hero() {
  return (
    <section>
      <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:px-10">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-brand-navy-900 px-4 py-1.5 text-xs font-semibold text-amber-400 dark:bg-white/5">
          Sistema ERP especializado en llantas <Zap size={12} />
        </span>

        <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
          Gestiona tu negocio
          <br />
          <span className="text-amber-400">de llantas</span> con poder
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base text-slate-500 dark:text-slate-400 sm:text-lg">
          MiraLlantas es la plataforma ERP completa para distribuidoras y talleres de llantas.
          Pedidos, reencauche, créditos, entregas, inventario y más — todo integrado.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-amber-300"
          >
            Probar ahora — es gratis <ArrowRight size={16} />
          </Link>
          <a
            href="#modulos"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/5"
          >
            Ver video demo
          </a>
        </div>
      </div>

      <div className="border-t border-white/10 bg-brand-navy-950">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 py-12 text-center sm:grid-cols-4 sm:px-10">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className={`font-mono text-3xl font-extrabold tabular-nums ${stat.color}`}>{stat.value}</p>
              <p className="mt-1 text-xs font-medium text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
