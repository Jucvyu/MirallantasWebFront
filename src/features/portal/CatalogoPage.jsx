import { useMemo, useState } from 'react';
import { Check, ChevronDown, Plus, Search, ShoppingCart } from 'lucide-react';
import TireThumb from '../../components/base/TireThumb';
import Modal from '../../components/base/Modal';
import { useCart } from '../../context/CartContext';
import { productos } from '../../data/mockData';
import PedidoPanel from './PedidoPanel';

const FILTERS = [
  { key: 'marca', label: 'Marca' },
  { key: 'vehiculo', label: 'Tipo vehículo' },
  { key: 'medida', label: 'Medida' },
  { key: 'categoria', label: 'Categoría' },
];

export default function CatalogoPage() {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState({});
  const [selected, setSelected] = useState(null);
  const [added, setAdded] = useState(null);
  // Al abrirlo, el catálogo se parte en dos: catálogo a la izquierda y el
  // pedido-cotización a la derecha.
  const [pedidoAbierto, setPedidoAbierto] = useState(false);
  const cart = useCart();

  const options = useMemo(
    () => FILTERS.map((f) => ({ ...f, options: [...new Set(productos.map((p) => p[f.key]))] })),
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return productos.filter((p) => {
      const matchesQuery = !q || `${p.nombre} ${p.marca} ${p.medida}`.toLowerCase().includes(q);
      const matchesFilters = Object.entries(active).every(([k, v]) => !v || p[k] === v);
      return matchesQuery && matchesFilters;
    });
  }, [query, active]);

  const agregar = (producto) => {
    cart.addProducto(producto);
    setPedidoAbierto(true);
    setAdded(producto.id);
    setTimeout(() => setAdded((id) => (id === producto.id ? null : id)), 1400);
  };

  const gridCols = pedidoAbierto
    ? 'sm:grid-cols-2 xl:grid-cols-3'
    : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  return (
    <div
      className={
        pedidoAbierto
          ? 'flex flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-6'
          : ''
      }
    >
      {/* Columna izquierda: el catálogo */}
      <div className="min-w-0">
        <div className="mb-6 flex">
          <button
            onClick={() => setPedidoAbierto((v) => !v)}
            aria-expanded={pedidoAbierto}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-bold text-slate-900 shadow-sm shadow-amber-400/30 transition-colors hover:bg-amber-300"
          >
            <Plus size={16} /> Crear pedido-cotización
            {cart.count > 0 && (
              <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-900 px-1.5 text-[11px] font-bold text-amber-400">
                {cart.count}
              </span>
            )}
          </button>
        </div>

        <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">Catálogo de Llantas</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {filtered.length} de {productos.length} productos
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre, marca o medida..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30 dark:border-white/10 dark:bg-brand-navy-800 dark:text-slate-200"
            />
          </div>
          {options.map((f) => (
            <div key={f.key} className="relative min-w-[140px] flex-1 sm:flex-none">
              <select
                value={active[f.key] ?? ''}
                onChange={(e) => setActive((a) => ({ ...a, [f.key]: e.target.value }))}
                className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-sm text-slate-600 focus:border-amber-400 focus:outline-none dark:border-white/10 dark:bg-brand-navy-800 dark:text-slate-300"
              >
                <option value="">{f.label}: Todos</option>
                {f.options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          ))}
        </div>

        <div className={`mt-6 grid grid-cols-1 gap-4 sm:gap-5 ${gridCols}`}>
          {filtered.map((p) => (
            <div
              key={p.id}
              className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-brand-navy-800"
            >
              <button onClick={() => setSelected(p)} className="text-left">
                <TireThumb brand={p.marca} badge={p.categoria} className="h-32 w-full" />
              </button>
              <div className="flex flex-1 flex-col p-4">
                <p className="text-xs font-bold tracking-wide text-amber-500 dark:text-amber-400">
                  {p.marca.toUpperCase()}
                </p>
                <p className="mt-0.5 text-sm font-bold text-slate-900 dark:text-white">{p.nombre}</p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{p.medida}</p>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => setSelected(p)}
                    className="flex-1 rounded-lg border border-slate-200 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => agregar(p)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-colors ${
                      added === p.id ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-slate-900 hover:bg-amber-300'
                    }`}
                  >
                    {added === p.id ? (
                      <>
                        <Check size={14} /> Agregado
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={14} /> Agregar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-10 text-center text-sm text-slate-400 dark:text-slate-500">
            Ningún producto coincide con la búsqueda.
          </p>
        )}
      </div>

      {/* Columna derecha: el pedido-cotización */}
      {pedidoAbierto && (
        <aside className="order-first mb-8 lg:sticky lg:top-24 lg:order-none lg:mb-0 lg:self-start">
          <PedidoPanel onClose={() => setPedidoAbierto(false)} />
        </aside>
      )}

      {selected && (
        <Modal
          title={selected.nombre}
          subtitle={`${selected.marca} · ${selected.medida}`}
          icon={<ShoppingCart size={16} />}
          size="lg"
          onClose={() => setSelected(null)}
          footer={(close) => (
            <button
              onClick={() => {
                agregar(selected);
                close();
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-bold text-slate-900 shadow-sm shadow-amber-400/30 hover:bg-amber-300"
            >
              <ShoppingCart size={16} /> Agregar al pedido
            </button>
          )}
        >
          <div className="flex flex-col gap-4 sm:flex-row">
            <TireThumb brand={selected.marca} className="h-32 w-full shrink-0 rounded-lg sm:w-32" />
            <div>
              <p className="text-xs font-bold tracking-wide text-amber-500 dark:text-amber-400">
                {selected.marca.toUpperCase()}
              </p>
              <p className="text-base font-bold text-slate-900 dark:text-white">{selected.nombre}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{selected.medida}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Llanta {selected.categoria.toLowerCase()} diseñada para {selected.vehiculo.toLowerCase()}, con
                excelente relación de durabilidad y agarre.
              </p>
            </div>
          </div>
          <dl className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm dark:border-white/10">
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500 dark:text-slate-400">Tipo de vehículo</dt>
              <dd className="font-medium text-slate-800 dark:text-slate-100">{selected.vehiculo}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500 dark:text-slate-400">Categorías</dt>
              <dd className="font-medium text-slate-800 dark:text-slate-100">{selected.categoria}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500 dark:text-slate-400">Disponibilidad</dt>
              <dd className="font-medium text-emerald-600 dark:text-emerald-400">{selected.estado}</dd>
            </div>
          </dl>
        </Modal>
      )}
    </div>
  );
}
