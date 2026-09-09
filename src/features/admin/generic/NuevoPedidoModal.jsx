import { useMemo, useState } from 'react';
import { Check, ChevronDown, FileText, Plus, Search, Trash2, Wrench } from 'lucide-react';
import Modal from '../../../components/base/Modal';
import FormModal from '../../../components/base/FormModal';
import Badge from '../../../components/base/Badge';
import {
  clientes,
  estadosCotizacion,
  metodosPago,
  productos,
  proveedores,
} from '../../../data/mockData';
import { servicioInitialValues, servicioSectionsAdmin } from '../../shared/servicioSections';

const SECTION = 'text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500';
const LABEL = 'mb-1.5 block text-[13px] font-semibold text-slate-700 dark:text-slate-200';
const FIELD =
  'w-full rounded-lg border bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none ' +
  'focus:ring-2 focus:ring-amber-400/40 dark:bg-brand-navy-900 dark:text-slate-100';
const BORDER_OK = 'border-slate-200 focus:border-amber-400 dark:border-white/10';
const BORDER_ERR = 'border-red-400 dark:border-red-500/60';

let lineaSeq = 0;

/**
 * "Nuevo pedido-cotización" del administrador.
 *
 * A diferencia del formulario genérico, aquí el admin arma el detalle:
 * elige productos de una tabla con todo el catálogo del sistema (con
 * cantidad y opción de quitarlos) y puede agregar líneas de servicio con
 * el mismo formulario que usa el cliente en su portal.
 */
export default function NuevoPedidoModal({ onSubmit, onClose }) {
  const [cliente, setCliente] = useState('');
  const [proveedor, setProveedor] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [metodoPago, setMetodoPago] = useState('');
  const [estado, setEstado] = useState('Pendiente');

  const [lineas, setLineas] = useState([]);
  const [query, setQuery] = useState('');
  const [servicioModal, setServicioModal] = useState(false);
  const [errors, setErrors] = useState({});

  const catalogo = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return productos;
    return productos.filter((p) => `${p.nombre} ${p.marca} ${p.medida}`.toLowerCase().includes(q));
  }, [query]);

  const agregarProducto = (p) => {
    setErrors((e) => ({ ...e, lineas: undefined }));
    setLineas((prev) => {
      const found = prev.find((l) => l.tipo === 'producto' && l.productoId === p.id);
      if (found) {
        return prev.map((l) => (l.id === found.id ? { ...l, cantidad: l.cantidad + 1 } : l));
      }
      lineaSeq += 1;
      return [
        ...prev,
        {
          id: `L-${lineaSeq}`,
          tipo: 'producto',
          productoId: p.id,
          nombre: p.nombre,
          detalle: `${p.marca} · ${p.medida}`,
          cantidad: 1,
        },
      ];
    });
  };

  const agregarServicio = (values) => {
    lineaSeq += 1;
    setErrors((e) => ({ ...e, lineas: undefined }));
    setLineas((prev) => [
      ...prev,
      {
        id: `L-${lineaSeq}`,
        tipo: 'servicio',
        nombre: values.servicio,
        detalle: values.descripcion,
        estadoEvidencia: values.estadoEvidencia || 'Pendiente de revisión',
        foto: values.foto,
        cantidad: Number(values.cantidad) || 1,
      },
    ]);
  };

  const setCantidad = (id, cantidad) =>
    setLineas((prev) =>
      prev.map((l) => (l.id === id ? { ...l, cantidad: Math.max(1, Number(cantidad) || 1) } : l)),
    );

  const quitarLinea = (id) => setLineas((prev) => prev.filter((l) => l.id !== id));

  const guardar = (close) => {
    const next = {};
    if (!cliente) next.cliente = 'Selecciona el cliente';
    if (!proveedor) next.proveedor = 'Selecciona el proveedor';
    if (lineas.length === 0) next.lineas = 'Agrega al menos un producto o servicio al pedido';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onSubmit?.({
      cliente,
      proveedor,
      fecha,
      metodoPago,
      estado,
      // La cotización nace en cero: el valor se fija y confirma después
      // desde el propio listado.
      total: '$ 0',
      confirmado: false,
      lineas,
    });
    close();
  };

  return (
    <>
      <Modal
        title="Nuevo pedido-cotización"
        subtitle="Arma el detalle con productos del catálogo y servicios de reencauche."
        icon={<FileText size={17} />}
        size="xl"
        onClose={onClose}
        footer={(close) => (
          <>
            <button
              type="button"
              onClick={close}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-brand-navy-800 dark:text-slate-200 dark:hover:bg-brand-navy-700"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => guardar(close)}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-bold text-slate-900 shadow-sm shadow-amber-400/30 hover:bg-amber-300"
            >
              <Check size={16} /> Guardar pedido
            </button>
          </>
        )}
      >
        <div className="space-y-6">
          {/* Cabecera de la cotización */}
          <section>
            <div className="mb-3 flex items-center gap-3">
              <span className={SECTION}>Datos de la cotización</span>
              <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="np-cliente" className={LABEL}>
                  Cliente <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="np-cliente"
                    value={cliente}
                    onChange={(e) => setCliente(e.target.value)}
                    className={`${FIELD} ${errors.cliente ? BORDER_ERR : BORDER_OK} appearance-none pr-9`}
                  >
                    <option value="">Seleccionar...</option>
                    {clientes.map((c) => (
                      <option key={c.id} value={c.nombre}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
                {errors.cliente && <p className="mt-1 text-xs font-medium text-red-500">{errors.cliente}</p>}
              </div>

              <div>
                <label htmlFor="np-proveedor" className={LABEL}>
                  Proveedor <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="np-proveedor"
                    value={proveedor}
                    onChange={(e) => setProveedor(e.target.value)}
                    className={`${FIELD} ${errors.proveedor ? BORDER_ERR : BORDER_OK} appearance-none pr-9`}
                  >
                    <option value="">Seleccionar...</option>
                    {proveedores.map((p) => (
                      <option key={p.id} value={p.nombre}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
                {errors.proveedor && <p className="mt-1 text-xs font-medium text-red-500">{errors.proveedor}</p>}
              </div>

              <div>
                <label htmlFor="np-fecha" className={LABEL}>
                  Fecha
                </label>
                <input
                  id="np-fecha"
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className={`${FIELD} ${BORDER_OK}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="np-pago" className={LABEL}>
                    Método de pago
                  </label>
                  <div className="relative">
                    <select
                      id="np-pago"
                      value={metodoPago}
                      onChange={(e) => setMetodoPago(e.target.value)}
                      className={`${FIELD} ${BORDER_OK} appearance-none pr-9`}
                    >
                      <option value="">Seleccionar...</option>
                      {metodosPago.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="np-estado" className={LABEL}>
                    Estado
                  </label>
                  <div className="relative">
                    <select
                      id="np-estado"
                      value={estado}
                      onChange={(e) => setEstado(e.target.value)}
                      className={`${FIELD} ${BORDER_OK} appearance-none pr-9`}
                    >
                      {estadosCotizacion.map((e) => (
                        <option key={e} value={e}>
                          {e}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Catálogo completo del sistema */}
          <section>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className={SECTION}>Productos del sistema</span>
              <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
              <div className="relative w-full sm:w-56">
                <Search
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar producto..."
                  className={`${FIELD} ${BORDER_OK} py-2 pl-9 text-sm`}
                />
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-200 dark:border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-slate-50 dark:bg-brand-navy-900">
                  <tr className="text-[11px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    <th className="px-4 py-2.5">Producto</th>
                    <th className="px-4 py-2.5">Medida</th>
                    <th className="px-4 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {catalogo.map((p) => (
                    <tr
                      key={p.id}
                      className="border-t border-slate-100 text-slate-600 dark:border-white/5 dark:text-slate-300"
                    >
                      <td className="px-4 py-2.5">
                        <p className="font-semibold text-slate-800 dark:text-slate-100">{p.nombre}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{p.marca}</p>
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5">{p.medida}</td>
                      <td className="px-4 py-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => agregarProducto(p)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-2.5 py-1.5 text-xs font-bold text-slate-900 hover:bg-amber-300"
                        >
                          <Plus size={13} /> Agregar
                        </button>
                      </td>
                    </tr>
                  ))}
                  {catalogo.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-sm text-slate-400">
                        Ningún producto coincide con la búsqueda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Detalle del pedido */}
          <section>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className={SECTION}>Detalle del pedido</span>
              <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
              <button
                type="button"
                onClick={() => setServicioModal(true)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-amber-400 px-3 py-1.5 text-xs font-bold text-amber-600 hover:bg-amber-400/10 dark:text-amber-400"
              >
                <Wrench size={14} /> Agregar servicio
              </button>
            </div>

            {lineas.length === 0 ? (
              <div
                className={`rounded-xl border border-dashed py-10 text-center ${
                  errors.lineas ? 'border-red-400' : 'border-slate-200 dark:border-white/10'
                }`}
              >
                <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
                  El pedido todavía no tiene líneas
                </p>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-600">
                  Agrega productos de la tabla de arriba o registra un servicio.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-brand-navy-900">
                    <tr className="text-[11px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                      <th className="px-4 py-2.5">Línea</th>
                      <th className="px-4 py-2.5 text-center">Cantidad</th>
                      <th className="px-4 py-2.5" />
                    </tr>
                  </thead>
                  <tbody>
                    {lineas.map((l) => (
                      <tr
                        key={l.id}
                        className="border-t border-slate-100 text-slate-600 dark:border-white/5 dark:text-slate-300"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-start gap-3">
                            {l.tipo === 'servicio' && l.foto && (
                              <img src={l.foto} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                            )}
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold tracking-wide text-slate-400 dark:text-slate-500">
                                {l.tipo === 'servicio' ? 'SERVICIO' : 'PRODUCTO'}
                              </p>
                              <p className="font-semibold text-slate-800 dark:text-slate-100">{l.nombre}</p>
                              <p className="line-clamp-1 text-xs text-slate-400 dark:text-slate-500">{l.detalle}</p>
                              {l.tipo === 'servicio' && (
                                <span className="mt-1 inline-block">
                                  <Badge>{l.estadoEvidencia}</Badge>
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input
                            type="number"
                            min="1"
                            value={l.cantidad}
                            onChange={(e) => setCantidad(l.id, e.target.value)}
                            aria-label={`Cantidad de ${l.nombre}`}
                            className="w-16 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-center text-sm text-slate-800 focus:border-amber-400 focus:outline-none dark:border-white/10 dark:bg-brand-navy-900 dark:text-slate-100"
                          />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => quitarLinea(l.id)}
                            className="rounded-lg p-1.5 text-slate-400 hover:text-red-500"
                            aria-label={`Quitar ${l.nombre}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {errors.lineas && <p className="mt-2 text-xs font-medium text-red-500">{errors.lineas}</p>}
          </section>
        </div>
      </Modal>

      {servicioModal && (
        <FormModal
          mode="create"
          title="Agregar servicio"
          subtitle="Reencauche: sube la foto de la carcasa para evaluar si es apta."
          sections={servicioSectionsAdmin}
          initialValues={servicioInitialValues}
          submitLabel="Agregar al pedido"
          onSubmit={agregarServicio}
          onClose={() => setServicioModal(false)}
        />
      )}
    </>
  );
}
