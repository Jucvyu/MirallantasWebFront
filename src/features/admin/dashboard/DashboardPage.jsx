import { useMemo, useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import StatCard from '../../../components/base/StatCard';
import Badge from '../../../components/base/Badge';
import Dropdown from '../../../components/base/Dropdown';
import {
  categorias,
  dashboardStats,
  rankingProductos,
  reencauchesPorMes,
  salesByBrand,
  ventas,
  ventasPorMes,
} from '../../../data/mockData';

/** Periodos con los que el administrador puede acotar el dashboard. */
const PERIODOS = ['Día', 'Mes', 'Año'];

const pesos = (n) => `$ ${n.toLocaleString('es-CO')}`;

/**
 * Dashboard del administrador.
 *
 * Solo lectura: consolida las ventas cerradas en indicadores, la gráfica de
 * ventas por mes, los reencauches procesados y el ranking de productos más
 * vendidos, con filtros por periodo y por categoría.
 */
export default function DashboardPage() {
  const [periodo, setPeriodo] = useState(['Mes']);
  const [categoria, setCategoria] = useState([]);

  // Las cifras salen únicamente de las ventas completadas
  const cerradas = useMemo(() => ventas.filter((v) => v.estado === 'Completada'), []);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">Dashboard General</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Julio 2024 · {cerradas.length} ventas cerradas en el periodo
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Dropdown label="Periodo" multiple value={periodo} options={PERIODOS} onChange={setPeriodo} />
          <Dropdown
            label="Categoría"
            multiple
            value={categoria}
            options={categorias.map((c) => c.nombre)}
            onChange={setCategoria}
          />
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-brand-navy-800 dark:text-slate-200 dark:hover:bg-brand-navy-700">
            <Download size={15} /> Exportar reporte
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-3.5 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-300">
            <RefreshCw size={15} /> Actualizar
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* ---- Reporte de ventas por mes ---- */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.6fr_1fr]">
        <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-brand-navy-800">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Reporte de ventas</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enero – Julio 2024 · solo ventas cerradas
              </p>
            </div>
            <span className="rounded-md bg-amber-400/15 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
              {periodo.join(', ') || 'Mes'}
            </span>
          </div>
          <div className="mt-4 h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ventasPorMes} margin={{ left: 0, right: 10, top: 10, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94A3B8' }}
                  axisLine={false}
                  tickLine={false}
                  width={44}
                  tickFormatter={(v) => `${v / 1000000}M`}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(251, 191, 36, 0.08)' }}
                  formatter={(v) => [pesos(v), 'Ventas']}
                  contentStyle={{ borderRadius: 8, border: 'none', fontSize: 12 }}
                />
                <Bar dataKey="ventas" fill="#FBBF24" radius={[6, 6, 0, 0]} maxBarSize={44} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-brand-navy-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Ventas por marca</h3>
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

      {/* ---- Ranking y reencauches ---- */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-brand-navy-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Productos más vendidos</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Ranking del año en curso</p>
          <ol className="mt-3 divide-y divide-slate-100 dark:divide-white/5">
            {rankingProductos.map((p, i) => (
              <li key={p.producto} className="flex items-center justify-between gap-3 py-3">
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-400/15 text-xs font-bold text-amber-600 dark:text-amber-400">
                    {i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {p.producto}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">{p.unidades} unidades</span>
                  </span>
                </span>
                <span className="shrink-0 font-mono text-sm text-slate-700 dark:text-slate-200">{p.total}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-brand-navy-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Reencauches por mes</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Enero – Julio 2024 · llantas procesadas</p>
          <div className="mt-4 h-56">
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
                  cursor={{ fill: 'rgba(59, 130, 246, 0.08)' }}
                  formatter={(v) => [`${v} llantas`, 'Reencauches']}
                  contentStyle={{ borderRadius: 8, border: 'none', fontSize: 12 }}
                />
                <Bar dataKey="reencauches" fill="#3B82F6" radius={[6, 6, 0, 0]} maxBarSize={44} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ---- Últimas ventas cerradas ---- */}
      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-brand-navy-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Últimas ventas</h3>
        <ul className="mt-3 divide-y divide-slate-100 dark:divide-white/5">
          {cerradas.map((venta) => (
            <li key={venta.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{venta.id}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {venta.cliente} · {venta.fecha}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-slate-700 dark:text-slate-200">{venta.total}</span>
                <Badge>{venta.metodoPago}</Badge>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
