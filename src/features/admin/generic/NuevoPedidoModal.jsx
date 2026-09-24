import { useMemo, useState } from 'react';
import { Check, ChevronDown, FileText, Plus, Search, Trash2, Wrench } from 'lucide-react';
import Modal from '../../../components/base/Modal';
import FormModal from '../../../components/base/FormModal';
import Badge from '../../../components/base/Badge';
import {
  BORDER_ERR,
  BORDER_OK,
  INPUT as FIELD,
  LABEL,
  SECTION,
  formatoMiles,
  soloDigitos,
} from '../../../components/base/formStyles';
import {
  clientes,
  CUOTA_INICIAL_CREDITO,
  INTERES_POR_PLAZO,
  metodosPago,
  PLAZOS_CREDITO,
  productos,
  proveedores,
  servicios,
  SERVICIO_POR_DEFECTO,
} from '../../../data/mockData';
import { servicioInitialValues, servicioSectionsAdmin } from '../../shared/servicioSections';

const pesos = (n) => `$ ${Math.round(n).toLocaleString('es-CO')}`;

let lineaSeq = 0;

/**
 * "Nueva cotización-pedido" del administrador.
 *
 * El asesor arma el detalle: elige productos del catálogo —con su precio de
 * venta— y agrega líneas de servicio con el mismo formulario que usa el
 * cliente. Si el pago se pacta a crédito, el sistema calcula el interés
 * según el plazo y la cuota inicial del 50% que exige la empresa.
 */
export default function NuevoPedidoModal({ onSubmit, onClose }) {
  const [cliente, setCliente] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [metodoPago, setMetodoPago] = useState('Contado');
  const [plazo, setPlazo] = useState(30);
  const [direccion, setDireccion] = useState('');
  const [proveedor, setProveedor] = useState('');
  // Cuota inicial escrita a mano; vacía significa "el 50% de rigor"
  const [inicialManual, setInicialManual] = useState('');

  const [lineas, setLineas] = useState([]);
  const [query, setQuery] = useState('');
  const [servicioModal, setServicioModal] = useState(false);
  const [errors, setErrors] = useState({});

  const catalogo = useMemo(() => {
    const q = query.trim().toLowerCase();
    // Un producto inactivo ya no se ofrece en cotizaciones nuevas
    const activos = productos.filter((p) => p.estado === 'Activo');
    if (!q) return activos;
    return activos.filter((p) => `${p.codigo} ${p.nombre} ${p.marca} ${p.medidas}`.toLowerCase().includes(q));
  }, [query]);

  // ---- Totales: subtotal de las líneas, interés y cuota inicial --------
  const subtotal = lineas.reduce((suma, l) => suma + l.cantidad * l.unitario, 0);
  const esCredito = metodoPago === 'Crédito';
  const interes = esCredito ? subtotal * (INTERES_POR_PLAZO[plazo] ?? 0) : 0;
  const total = subtotal + interes;
  const inicialMinima = esCredito ? Math.round(total * CUOTA_INICIAL_CREDITO) : 0;
  const inicialEscrita = Number(String(inicialManual).replace(/\D/g, '')) || 0;
  const cuotaInicial = inicialManual === '' ? inicialMinima : inicialEscrita;
  // La empresa no acepta una primera cuota por debajo de la mitad del total
  const inicialInsuficiente = esCredito && total > 0 && cuotaInicial < inicialMinima;

  /** Al elegir el cliente se trae su dirección para el despacho. */
  const elegirCliente = (nombre) => {
    setCliente(nombre);
    const ficha = clientes.find((c) => c.nombreCompleto === nombre);
    if (ficha && !direccion) setDireccion(ficha.direccion ?? '');
    setErrors((e) => ({ ...e, cliente: undefined }));
  };

  const agregarProducto = (p) => {
    setErrors((e) => ({ ...e, lineas: undefined }));
    setLineas((prev) => {
      const existente = prev.find((l) => l.tipo === 'producto' && l.productoId === p.id);
      if (existente) {
        return prev.map((l) => (l.id === existente.id ? { ...l, cantidad: l.cantidad + 1 } : l));
      }
      lineaSeq += 1;
      return [
        ...prev,
        {
          id: `L-${lineaSeq}`,
          tipo: 'producto',
          productoId: p.id,
          nombre: p.nombre,
          medida: p.medidas,
          detalle: `${p.marca} · ${p.medidas}`,
          unitario: p.precioVenta,
          cantidad: 1,
        },
      ];
    });
  };

  const agregarServicio = (values) => {
    lineaSeq += 1;
    setErrors((e) => ({ ...e, lineas: undefined }));
    const nombre = values.servicio || SERVICIO_POR_DEFECTO;
    const ficha = servicios.find((s) => s.nombre === nombre);
    setLineas((prev) => [
      ...prev,
      {
        id: `L-${lineaSeq}`,
        tipo: 'servicio',
        nombre,
        medida: values.medidas ?? '',
        detalle: values.descripcion,
        estadoEvidencia: values.estadoEvidencia || 'Pendiente de revisión',
        foto: values.foto,
        unitario: ficha?.precio ?? 0,
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
    if (!direccion.trim()) next.direccion = 'Indica la dirección de despacho';
    if (lineas.length === 0) next.lineas = 'Agrega al menos un producto o servicio a la cotización';
    if (inicialInsuficiente) {
      next.inicial = `La primera cuota debe ser de al menos ${pesos(inicialMinima)} (50% del total).`;
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onSubmit?.({
      cliente,
      proveedor,
      fecha,
      metodoPago,
      direccionEntrega: direccion,
      plazoDias: esCredito ? plazo : 0,
      total: pesos(total),
      interes: pesos(interes),
      cuotaInicial: pesos(cuotaInicial),
      confirmado: true,
      estado: 'Pendiente',
      estadoEntrega: 'Pendiente',
      detalle: lineas.map((l) => ({
        tipo: l.tipo,
        nombre: l.nombre,
        medida: l.medida,
        cantidad: l.cantidad,
        unitario: pesos(l.unitario),
        subtotal: pesos(l.unitario * l.cantidad),
      })),
    });
    close();
  };

  return (
    <>
      <Modal
        title="Nueva cotización-pedido"
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
              <Check size={16} /> Guardar cotización
            </button>
          </>
        )}
      >
        <div className="space-y-6">
          {/* ---- Cabecera de la cotización ---- */}
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
                    onChange={(e) => elegirCliente(e.target.value)}
                    className={`${FIELD} ${errors.cliente ? BORDER_ERR : BORDER_OK} cursor-pointer appearance-none pr-10`}
                  >
                    <option value="">Seleccionar...</option>
                    {clientes
                      .filter((c) => c.estado === 'Activo')
                      .map((c) => (
                        <option key={c.id} value={c.nombreCompleto}>
                          {c.nombreCompleto}
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
                  Proveedor
                </label>
                <div className="relative">
                  <select
                    id="np-proveedor"
                    value={proveedor}
                    onChange={(e) => setProveedor(e.target.value)}
                    className={`${FIELD} ${BORDER_OK} cursor-pointer appearance-none pr-10`}
                  >
                    <option value="">Seleccionar...</option>
                    {/* Un proveedor inactivo ya no surte cotizaciones nuevas */}
                    {proveedores
                      .filter((p) => p.estado === 'Activo')
                      .map((p) => (
                        <option key={p.id} value={p.nombreRazonSocial}>
                          {p.nombreRazonSocial}
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

              <div>
                <label htmlFor="np-pago" className={LABEL}>
                  Método de pago
                </label>
                <div className="relative">
                  <select
                    id="np-pago"
                    value={metodoPago}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    className={`${FIELD} ${BORDER_OK} cursor-pointer appearance-none pr-10`}
                  >
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
                <label htmlFor="np-direccion" className={LABEL}>
                  Dirección de despacho <span className="text-red-500">*</span>
                </label>
                <input
                  id="np-direccion"
                  value={direccion}
                  onChange={(e) => {
                    setDireccion(e.target.value);
                    setErrors((x) => ({ ...x, direccion: undefined }));
                  }}
                  placeholder="Calle 50 #45-12, Medellín"
                  className={`${FIELD} ${errors.direccion ? BORDER_ERR : BORDER_OK}`}
                />
                {errors.direccion && <p className="mt-1 text-xs font-medium text-red-500">{errors.direccion}</p>}
              </div>
            </div>

            {/* Plazo: solo tiene sentido cuando se financia */}
            {esCredito && (
              <div className="mt-4">
                <span className={LABEL}>Plazo del crédito</span>
                <div className="flex gap-2">
                  {PLAZOS_CREDITO.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPlazo(p)}
                      aria-pressed={plazo === p}
                      className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
                        plazo === p
                          ? 'border-amber-400 bg-amber-400/10 text-amber-600 dark:text-amber-400'
                          : 'border-slate-200 text-slate-500 hover:border-slate-300 dark:border-white/10 dark:text-slate-400'
                      }`}
                    >
                      {p} días · {(INTERES_POR_PLAZO[p] * 100).toFixed(0)}%
                    </button>
                  ))}
                </div>

                <div className="mt-4 sm:w-1/2">
                  <label htmlFor="np-inicial" className={LABEL}>
                    Primera cuota (COP)
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                      $
                    </span>
                    <input
                      id="np-inicial"
                      inputMode="numeric"
                      value={inicialManual === '' ? formatoMiles(String(inicialMinima)) : inicialManual}
                      onChange={(e) => {
                        setInicialManual(formatoMiles(e.target.value));
                        setErrors((x) => ({ ...x, inicial: undefined }));
                      }}
                      className={`${FIELD} ${
                        inicialInsuficiente || errors.inicial ? BORDER_ERR : BORDER_OK
                      } pl-8`}
                    />
                  </div>
                  {inicialInsuficiente || errors.inicial ? (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      La primera cuota debe ser de al menos {pesos(inicialMinima)} (50% del total).
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                      Mínimo {pesos(inicialMinima)}, el 50% que exige la empresa.
                    </p>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* ---- Catálogo de productos ---- */}
          <section>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className={SECTION}>Productos del catálogo</span>
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

            <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200 dark:border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-slate-50 dark:bg-brand-navy-900">
                  <tr className="text-[11px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    <th className="px-4 py-2.5">Producto</th>
                    <th className="px-4 py-2.5">Stock</th>
                    <th className="px-4 py-2.5 text-right">Precio venta</th>
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
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          {p.codigo} · {p.medidas}
                        </p>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={p.stock === 0 ? 'font-semibold text-red-500' : ''}>{p.stock}</span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-right">{pesos(p.precioVenta)}</td>
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
                      <td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-400">
                        Ningún producto coincide con la búsqueda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* ---- Detalle de la cotización ---- */}
          <section>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className={SECTION}>Detalle de la cotización</span>
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
                  La cotización todavía no tiene líneas
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
                      <th className="px-4 py-2.5 text-right">Subtotal</th>
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
                            inputMode="numeric"
                            value={l.cantidad}
                            onChange={(e) => setCantidad(l.id, soloDigitos(e.target.value))}
                            aria-label={`Cantidad de ${l.nombre}`}
                            className={`${FIELD} ${BORDER_OK} w-16 px-2 py-1.5 text-center`}
                          />
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-slate-800 dark:text-slate-100">
                          {pesos(l.unitario * l.cantidad)}
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

            {/* ---- Resumen de valores ---- */}
            <dl className="mt-3 space-y-1.5 rounded-xl border-2 border-amber-400 bg-amber-400/10 px-5 py-4 text-sm">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <dt>Subtotal</dt>
                <dd className="font-semibold">{pesos(subtotal)}</dd>
              </div>
              {esCredito && (
                <>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <dt>Interés ({(INTERES_POR_PLAZO[plazo] * 100).toFixed(0)}% a {plazo} días)</dt>
                    <dd className="font-semibold">{pesos(interes)}</dd>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <dt>Primera cuota</dt>
                    <dd className="font-semibold">{pesos(cuotaInicial)}</dd>
                  </div>
                </>
              )}
              <div className="flex items-center justify-between border-t border-amber-400/40 pt-2">
                <dt className="font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">Total</dt>
                <dd className="text-xl font-bold text-slate-900 dark:text-white">{pesos(total)}</dd>
              </div>
            </dl>
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
          submitLabel="Agregar a la cotización"
          onSubmit={agregarServicio}
          onClose={() => setServicioModal(false)}
        />
      )}
    </>
  );
}
