import { Link } from 'react-router-dom';
import StatCard from '../../components/base/StatCard';
import Badge from '../../components/base/Badge';
import { useCredito } from '../../context/CreditoContext';
import { useSesion } from '../../context/SesionContext';

export default function ClientHomePage() {
  const { saldoUsableTexto, cupoTotal, tieneCredito } = useCredito();
  const { profile, homeStats, cotizaciones } = useSesion();

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
        Hola, {profile.nombre.split(' ')[0]}
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">Portal de cliente · MiraLlantas</p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {homeStats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
        {/* Cupo de cartera que le queda disponible al cliente */}
        <StatCard
          label="SALDO USABLE"
          value={saldoUsableTexto}
          sub={
            tieneCredito
              ? 'En negativo por tu crédito abierto'
              : `de un cupo de $ ${cupoTotal.toLocaleString('es-CO')}`
          }
          icon="Wallet"
          accent={tieneCredito ? 'red' : 'emerald'}
        />
      </div>

      <div className="mt-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-brand-navy-800">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Mis Pedidos-Cotización Recientes
            </h3>
            <Link to="/portal/pedidos" className="text-xs font-semibold text-amber-500 dark:text-amber-400">
              Ver todas
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-slate-100 dark:divide-white/5">
            {cotizaciones.slice(0, 4).map((cot) => (
              <li key={cot.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{cot.id}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{cot.fecha}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-slate-700 dark:text-slate-200">{cot.total}</span>
                  <Badge>{cot.estado}</Badge>
                </div>
              </li>
            ))}
          </ul>
          <p className="pt-3 text-center text-xs text-slate-400 dark:text-slate-600">
            Mostrando los 4 más recientes de {cotizaciones.length}
          </p>
        </div>
      </div>
    </div>
  );
}
