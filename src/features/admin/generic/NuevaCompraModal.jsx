import { useMemo, useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronsDownUp,
  ChevronsUpDown,
  FileText,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
} from 'lucide-react';
import Modal from '../../../components/base/Modal';
import {
  BORDER_ERR as BORDE_ERR,
  BORDER_OK as BORDE_OK,
  INPUT as CAMPO,
  LABEL,
  SECTION,
  soloDigitos,
} from '../../../components/base/formStyles';
import { productos, proveedores } from '../../../data/mockData';
import SelectorCotizaciones from '../shared/SelectorCotizaciones';

/** Solo abastecen las cotizaciones ya aprobadas. */
const esAbastecible = (c) => c.estado === 'Aprobada' || c.estado === 'En proceso';

const pesos = (n) => `$ ${n.toLocaleString('es-CO')}`;

/** Secciones del formulario, en orden. */
const SECCIONES = ['cotizacion', 'proveedor', 'productos', 'detalle'];

/**
 * Bloque desplegable reutilizable.
 * - `resumen`: texto corto que se muestra cuando está contraído.
 * - `extra`: contenido a la derecha del título (badges, contadores).
 * - `error`: resalta el borde si la sección tiene errores.
 */
function SeccionDesplegable({ id, titulo, abierta, onToggle, resumen, extra, error, children }) {
  const panelId = `seccion-${id}`;
  return (
    <section
      className={`overflow-hidden rounded-xl border transition-colors ${
        error ? 'border-red-400' : 'border-slate-200 dark:border-white/10'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={abierta}
        aria-controls={panelId}
        className="flex w-full items-center gap-3 bg-slate-50 px-4 py-3 text-left hover:bg-slate-100 dark:bg-brand-navy-900 dark:hover:bg-brand-navy-800"
      >
        <span className={SECTION}>{titulo}</span>
        {!abierta && resumen && (
          <span className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">· {resumen}</span>
        )}
        <span className="flex-1" />
        {extra}
        {error && <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" aria-label="Sección con errores" />}
        <ChevronDown
          size={16}
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${abierta ? 'rotate-180' : ''}`}
        />
      </button>

      {abierta && (
        <div id={panelId} className="border-t border-slate-200 p-4 dark:border-white/10">
          {children}
        </div>
      )}
    </section>
  );
}

/**
 * "Nueva compra" (orden de compra al proveedor).
 *
 * La cotización de origen se elige de un listado con buscador y filtros.
 * Al elegirla, sus líneas de producto pasan directamente al detalle de la
 * compra —que es lo que hay que abastecer— y el asesor puede sumar los
 * productos extra que quiera pedirle al mismo proveedor. Cada línea guarda
 * cantidad y precio de compra, igual que `detalle_compra`. La fecha es la
 * de hoy y la compra nace pendiente, con la entrega también pendiente.
 *
 * Cada sección es desplegable; un botón superior expande o contrae todas.
 */
export default function NuevaCompraModal({ onSubmit, onClose }) {
  const [proveedor, setProveedor] = useState('');
  const [cotizacion, setCotizacion] = useState('');
  const [lineas, setLineas] = useState([]);
  const [query, setQuery] = useState('');
  const [errores, setErrores] = useState({});
  const [abiertas, setAbiertas] = useState({
    cotizacion: true,
    proveedor: true,
    productos: false,
    detalle: true,
  });

  const todasAbiertas = SECCIONES.every((s) => abiertas[s]);
  const alternar = (s) => setAbiertas((a) => ({ ...a, [s]: !a[s] }));
  const alternarTodas = () =>
    setAbiertas(Object.fromEntries(SECCIONES.map((s) => [s, !todasAbiertas])));
  const abrir = (...ss) => setAbiertas((a) => ({ ...a, ...Object.fromEntries(ss.map((s) => [s, true])) }));

  const catalogo = useMemo(() => {
    const q = query.trim().toLowerCase();
    const activos = productos.filter((p) => p.estado === 'Activo');
    if (!q) return activos;
    return activos.filter((p) => `${p.codigo} ${p.nombre} ${p.marca} ${p.medidas}`.toLowerCase().includes(q));
  }, [query]);

  const total = lineas.reduce((suma, l) => suma + l.cantidad * l.precioCompra, 0);
  const deCotizacion = lineas.filter((l) => l.deCotizacion).length;

  /**
   * Al elegir la cotización, sus productos entran como detalle de la
   * compra. Los servicios no: esos los ejecuta un tercero, no se compran.
   */
  const elegirCotizacion = (c) => {
    setCotizacion(c.id);
    setErrores((e) => ({ ...e, lineas: undefined }));
    setLineas(
      (c.detalle ?? [])
        .filter((l) => l.tipo !== 'servicio')
        .map((l) => {
          const ficha = productos.find((p) => p.nombre === l.nombre);
          return {
            id: ficha?.id ?? l.nombre,
            nombre: l.nombre,
            medidas: ficha?.medidas ?? l.medida,
            precioCompra: ficha?.precioCompra ?? 0,
            cantidad: l.cantidad,
            // Marca de origen, para distinguirlas de las que suma el asesor
            deCotizacion: true,
          };
        }),
    );
    // Muestra el detalle recién cargado
    abrir('detalle');
  };

  const agregar = (p) => {
    setErrores((e) => ({ ...e, lineas: undefined }));
    setLineas((prev) => {
      const existente = prev.find((l) => l.id === p.id);
      if (existente) {
        return prev.map((l) => (l.id === p.id ? { ...l, cantidad: l.cantidad + 1 } : l));
      }
      return [...prev, { id: p.id, nombre: p.nombre, medidas: p.medidas, precioCompra: p.precioCompra, cantidad: 1 }];
    });
  };

  const setCantidad = (id, cantidad) =>
    setLineas((prev) =>
      prev.map((l) => (l.id === id ? { ...l, cantidad: Math.max(1, Number(cantidad) || 1) } : l)),
    );

  const quitar = (id) => setLineas((prev) => prev.filter((l) => l.id !== id));

  const guardar = (close) => {
    const next = {};
    if (!proveedor) next.proveedor = 'Selecciona el proveedor';
    if (lineas.length === 0) next.lineas = 'Agrega al menos un producto a la compra';
    setErrores(next);
    if (Object.keys(next).length > 0) {
      // Despliega las secciones con errores para que se vean
      if (next.proveedor) abrir('proveedor');
      if (next.lineas) abrir('detalle', 'productos');
      return;
    }

    onSubmit?.({
      proveedor,
      cotizacion,
      fecha: new Date().toISOString().slice(0, 10),
      total: pesos(total),
      estado: 'Pendiente',
      estadoEntrega: 'Pendiente',
      detalle: lineas.map((l) => ({
        producto: l.nombre,
        cantidad: l.cantidad,
        unitario: pesos(l.precioCompra),
        subtotal: pesos(l.cantidad * l.precioCompra),
        // Distingue lo que pedía la cotización de lo que sumó el asesor
        origen: l.deCotizacion ? 'Cotización' : 'Adicional',
      })),
    });
    close();
  };

  return (
    <Modal
      title="Nueva compra"
      subtitle="Abastece una cotización aprobada con los productos de un proveedor."
      icon={<ShoppingCart size={17} />}
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
            <Check size={16} /> Guardar compra
          </button>
        </>
      )}
    >
      <div className="space-y-3">
        {/* ---- Botón general: expandir / contraer todo ---- */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={alternarTodas}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-brand-navy-800"
          >
            {todasAbiertas ? <ChevronsDownUp size={14} /> : <ChevronsUpDown size={14} />}
            {todasAbiertas ? 'Contraer todo' : 'Expandir todo'}
          </button>
        </div>

        {/* ---- Cotización de origen ---- */}
        <SeccionDesplegable
          id="cotizacion"
          titulo="Cotización de origen"
          abierta={abiertas.cotizacion}
          onToggle={() => alternar('cotizacion')}
          resumen={cotizacion ? `Cotización ${cotizacion}` : 'Sin seleccionar'}
        >
          <SelectorCotizaciones
            value={cotizacion}
            filtro={esAbastecible}
            vacioLabel="No hay cotizaciones aprobadas por abastecer."
            onChange={elegirCotizacion}
          />
          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            Al elegirla, sus productos pasan al detalle de la compra; las cantidades deben coincidir.
          </p>
        </SeccionDesplegable>

        {/* ---- Proveedor ---- */}
        <SeccionDesplegable
          id="proveedor"
          titulo="Proveedor"
          abierta={abiertas.proveedor}
          onToggle={() => alternar('proveedor')}
          resumen={proveedor || 'Sin seleccionar'}
          error={!!errores.proveedor}
        >
          <div className="sm:w-1/2">
            <label htmlFor="co-proveedor" className={LABEL}>
              Proveedor <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="co-proveedor"
                value={proveedor}
                onChange={(e) => {
                  setProveedor(e.target.value);
                  setErrores((x) => ({ ...x, proveedor: undefined }));
                }}
                className={`${CAMPO} ${errores.proveedor ? BORDE_ERR : BORDE_OK} cursor-pointer appearance-none pr-10`}
              >
                <option value="">Seleccionar...</option>
                {/* Un proveedor inactivo no puede recibir órdenes nuevas */}
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
            {errores.proveedor && <p className="mt-1 text-xs font-medium text-red-500">{errores.proveedor}</p>}
          </div>
        </SeccionDesplegable>

        {/* ---- Productos del catálogo ---- */}
        <SeccionDesplegable
          id="productos"
          titulo="Productos"
          abierta={abiertas.productos}
          onToggle={() => alternar('productos')}
          resumen="Catálogo para agregar adicionales"
        >
          <div className="relative mb-3 w-full sm:w-56">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar producto..."
              className={`${CAMPO} ${BORDE_OK} py-2 pl-9`}
            />
          </div>

          <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200 dark:border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-slate-50 dark:bg-brand-navy-900">
                <tr className="text-[11px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  <th className="px-4 py-2.5">Producto</th>
                  <th className="px-4 py-2.5 text-right">Precio compra</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {catalogo.map((p) => (
                  <tr key={p.id} className="border-t border-slate-100 text-slate-600 dark:border-white/5 dark:text-slate-300">
                    <td className="px-4 py-2.5">
                      <p className="font-semibold text-slate-800 dark:text-slate-100">{p.nombre}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {p.codigo} · {p.medidas}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-right">{pesos(p.precioCompra)}</td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => agregar(p)}
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
        </SeccionDesplegable>

        {/* ---- Detalle de la compra ---- */}
        <SeccionDesplegable
          id="detalle"
          titulo="Detalle de la compra"
          abierta={abiertas.detalle}
          onToggle={() => alternar('detalle')}
          resumen={`${lineas.length} ${lineas.length === 1 ? 'línea' : 'líneas'} · ${pesos(total)}`}
          error={!!errores.lineas}
          extra={
            deCotizacion > 0 && (
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-amber-400/15 px-2 py-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                <FileText size={12} /> {deCotizacion} de la cotización
              </span>
            )
          }
        >
          {lineas.length === 0 ? (
            <div
              className={`rounded-xl border border-dashed py-10 text-center ${
                errores.lineas ? 'border-red-400' : 'border-slate-200 dark:border-white/10'
              }`}
            >
              <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
                La compra todavía no tiene líneas
              </p>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-600">
                Elige una cotización para traer sus productos, o agrégalos del catálogo.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-brand-navy-900">
                  <tr className="text-[11px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    <th className="px-4 py-2.5">Producto</th>
                    <th className="px-4 py-2.5 text-center">Cantidad</th>
                    <th className="px-4 py-2.5 text-right">Subtotal</th>
                    <th className="px-4 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {lineas.map((l) => (
                    <tr key={l.id} className="border-t border-slate-100 text-slate-600 dark:border-white/5 dark:text-slate-300">
                      <td className="px-4 py-3">
                        <p className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                          {l.nombre}
                          {l.deCotizacion ? (
                            <span className="rounded bg-amber-400/15 px-1.5 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                              Cotización
                            </span>
                          ) : (
                            <span className="rounded bg-blue-500/15 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                              Adicional
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{l.medidas}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input
                          inputMode="numeric"
                          value={l.cantidad}
                          onChange={(e) => setCantidad(l.id, soloDigitos(e.target.value))}
                          aria-label={`Cantidad de ${l.nombre}`}
                          className={`${CAMPO} ${BORDE_OK} w-16 px-2 py-1.5 text-center`}
                        />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-slate-800 dark:text-slate-100">
                        {pesos(l.cantidad * l.precioCompra)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => quitar(l.id)}
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

          {errores.lineas && <p className="mt-2 text-xs font-medium text-red-500">{errores.lineas}</p>}
        </SeccionDesplegable>

        {/* ---- Total: siempre visible, fuera de las secciones ---- */}
        <div className="flex items-center justify-between rounded-xl border-2 border-amber-400 bg-amber-400/10 px-5 py-3">
          <span className="text-sm font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">
            Total de la compra
          </span>
          <span className="text-xl font-bold text-slate-900 dark:text-white">{pesos(total)}</span>
        </div>
      </div>
    </Modal>
  );
}