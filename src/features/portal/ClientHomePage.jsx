import { Link } from 'react-router-dom';
import StatCard from '../../components/base/StatCard';
import { useCredito } from '../../context/CreditoContext';
import Badge from '../../components/base/Badge';
import { clientHomeStats, clientPedidos, clientProfile } from '../../data/mockData';

export default function ClientHomePage() {
  const { saldoUsableTexto, cupoTotal } = useCredito();

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
        Bienvenida, {clientProfile.nombre.split(' ')[0]}
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">Portal de cliente · MiraLlantas</p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {clientHomeStats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
        {/* Cupo de crédito que le queda disponible al cliente */}
        <StatCard
          label="SALDO USABLE"
          value={saldoUsableTexto}
          sub={`de un cupo de $ ${cupoTotal.toLocaleString('es-CO')}`}
          icon="Wallet"
          accent="emerald"
        />
      </div>

      <div className="mt-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-brand-navy-800">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Mis Pedidos-Cotización Recientes</h3>
            <Link to="/portal/pedidos" className="text-xs font-semibold text-amber-500 dark:text-amber-400">
              Ver todos
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-slate-100 dark:divide-white/5">
            {clientPedidos.slice(0, 4).map((order) => (
              <li key={order.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{order.id}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{order.fecha}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-slate-700 dark:text-slate-200">{order.total}</span>
                  <Badge>{order.estado}</Badge>
                </div>
              </li>
            ))}
          </ul>
          <p className="pt-3 text-center text-xs text-slate-400 dark:text-slate-600">
            Mostrando los 4 más recientes de {clientPedidos.length}
          </p>
        </div>
      </div>
    </div>
  );
}
