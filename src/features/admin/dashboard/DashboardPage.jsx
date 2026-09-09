import { Download, RefreshCw } from 'lucide-react';
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import StatCard from '../../../components/base/StatCard';
import Badge from '../../../components/base/Badge';
import { dashboardStats, recentOrders, reencauchesPorMes, salesByBrand } from '../../../data/mockData';

// Solo quedan Ventas del mes y Pedidos activos: Clientes activos y
// Crédito vigente se retiraron del dashboard.
const KPIS = dashboardStats.filter((s) => s.id === 'ventas' || s.id === 'pedidos');

export default function DashboardPage() {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">Dashboard General</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Julio 2024 · Actualizado hace 2 min</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-brand-navy-800 dark:text-slate-200 dark:hover:bg-brand-navy-700">
            <Download size={15} /> Reporte
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-3.5 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-300">
            <RefreshCw size={15} /> Actualizar
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {KPIS.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.6fr_1fr]">
        <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-brand-navy-800">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Reencauches por mes</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Enero – Julio 2024 · llantas procesadas</p>
            </div>
            <span className="rounded-md bg-amber-400/15 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
              Mensual
            </span>
          </div>
          <div className="mt-4 h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reencauchesPorMes} margin={{ left: 0, right: 10, top: 10, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis
                  domain={[0, 48]}
                  tick={{ fontSize: 11, fill: '#94A3B8' }}
                  axisLine={false}
                  tickLine={false}
                  width={32}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(251, 191, 36, 0.08)' }}
                  formatter={(v) => [`${v} llantas`, 'Reencauches']}
                  contentStyle={{ borderRadius: 8, border: 'none', fontSize: 12 }}
                />
                <Bar
                  dataKey="reencauches"
                  fill="#FBBF24"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={44}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-brand-navy-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Ventas por Marca</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Participación mensual</p>
          <div className="mx-auto mt-2 flex justify-center" style={{ width: 176, height: 176 }}>
            <PieChart width={176} height={176}>
              <Pie
                data={salesByBrand}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={76}
                paddingAngle={2}
                startAngle={90}
                endAngle={-270}
                isAnimationActive={false}
              >
                {salesByBrand.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} stroke="none" />
                ))}
              </Pie>
            </PieChart>
          </div>
          <ul className="mt-3 space-y-2">
            {salesByBrand.map((b) => (
              <li key={b.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: b.color }} />
                  {b.name}
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">{b.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-brand-navy-800">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Últimos Pedidos</h3>
          <a href="#pedidos" className="text-xs font-semibold text-amber-500 dark:text-amber-400">
            Ver todos
          </a>
        </div>
        <ul className="mt-3 divide-y divide-slate-100 dark:divide-white/5">
          {recentOrders.map((order) => (
            <li key={order.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{order.id}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{order.cliente}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-slate-700 dark:text-slate-200">{order.total}</span>
                <Badge>{order.estado}</Badge>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
