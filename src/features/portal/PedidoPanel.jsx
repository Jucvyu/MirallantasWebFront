import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Disc3, Minus, Plus, Save, ShoppingCart, Trash2, Wrench, X } from 'lucide-react';
import Badge from '../../components/base/Badge';
import FormModal from '../../components/base/FormModal';
import TireThumb from '../../components/base/TireThumb';
import { useCart } from '../../context/CartContext';
import { formatCOP, parseCOP, useCredito } from '../../context/CreditoContext';
import { metodosPago } from '../../data/mockData';
import {
  SERVICIO_POR_DEFECTO,
  servicioInitialValues,
  servicioSectionsCliente,
} from '../shared/servicioSections';
import CotizacionEnviadaModal from './CotizacionEnviadaModal';

const SECTION_TEXT = 'text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500';
const SELECT =
  'w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-3.5 pr-9 text-sm ' +
  'text-slate-800 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 ' +
  'dark:border-white/10 dark:bg-brand-navy-900 dark:text-slate-100';
const INPUT =
  'w-full rounded-lg border bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 ' +
  'focus:outline-none focus:ring-2 focus:ring-amber-400/40 dark:bg-brand-navy-900 dark:text-slate-100';
const BORDER_OK = 'border-slate-200 focus:border-amber-400 dark:border-white/10';
const BORDER_ERR = 'border-red-400 dark:border-red-500/60';
const LABEL = 'mb-1.5 block text-[13px] font-semibold text-slate-700 dark:text-slate-200';

/** Plazos disponibles para financiar la cotización. */
const PLAZOS = [30, 60, 90];

/**
 * Contenido del pedido-cotización en curso (el "carrito").
 *
 * Se usa en dos sitios con el mismo código: como columna derecha del
 * catálogo cuando el cliente abre el pedido, y como página completa en
 * `/portal/nuevo-pedido`. `onClose` solo se pasa en el catálogo, para
 * poder cerrar la columna.
 *
 * El pedido no lleva valores: el cliente solo indica qué necesita y cómo
 * quiere pagar. Si elige crédito, define el monto y el plazo dentro de su
 * saldo usable.
 */
export default function PedidoPanel({ onClose = null }) {
  const navigate = useNavigate();
  const cart = useCart();
  const { saldoUsable, saldoUsableTexto, alcanza } = useCredito();

  const [metodoPago, setMetodoPago] = useState('');
  const [servicioModal, setServicioModal] = useState(false);
  const [enviada, setEnviada] = useState(false);

  // Datos del crédito, solo cuando el método de pago es "Crédito"
  const [valorCredito, setValorCredito] = useState('');
  const [plazo, setPlazo] = useState(30);
  const [errorCredito, setErrorCredito] = useState('');

  const vacio = cart.count === 0;
  const esCredito = metodoPago === 'Crédito';
  const valorNum = parseCOP(valorCredito);
  const cuotas = plazo / 30;
  const cuotaAproximada = valorNum > 0 ? Math.round(valorNum / cuotas) : 0;
  const excedeSaldo = valorNum > saldoUsable;

  const guardarServicio = (values) => {
    cart.addServicio({
      servicio: SERVICIO_POR_DEFECTO,
      cantidad: Number(values.cantidad) || 1,
      foto: values.foto,
      descripcion: values.descripcion,
      observaciones: values.observaciones ?? '',
      estadoEvidencia: 'Pendiente de revisión',
    });
  };

  const guardarCotizacion = () => {
    // Con crédito hay que validar el monto contra el saldo usable
    if (esCredito) {
      if (!valorNum) {
        setErrorCredito('Indica el valor que quieres financiar');
        return;
      }
      if (!alcanza(valorNum)) {
        setErrorCredito(`Tu saldo usable es ${saldoUsableTexto}. Reduce el valor del crédito.`);
        return;
      }
    }
    setErrorCredito('');
    setEnviada(true);
  };

  /** Al cerrar el aviso, el carrito se limpia y se va al listado. */
  const cerrarAviso = () => {
    setEnviada(false);
    cart.clear();
    navigate('/portal/pedidos');
  };

  return (
    <div className="space-y-4">
      {/* ================= Líneas del pedido ================= */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-brand-navy-800">
        <div className="h-[3px] w-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400/0" />

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-amber-500 dark:text-amber-400">
              <ShoppingCart size={17} />
            </span>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Detalle del pedido</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {cart.count} {cart.count === 1 ? 'línea' : 'líneas'} · {cart.unidades} llantas
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setServicioModal(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-amber-400 px-3 py-2 text-sm font-bold text-amber-600 hover:bg-amber-400/10 dark:text-amber-400"
            >
              <Wrench size={15} /> Agregar servicio
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-100"
                aria-label="Cerrar el pedido"
              >
                <X size={17} />
              </button>
            )}
          </div>
        </div>

        {vacio ? (
          <div className="flex flex-col items-center gap-3 px-5 py-12 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-slate-500">
              <Disc3 size={22} strokeWidth={1.5} />
            </span>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Tu pedido está vacío</p>
            <p className="max-w-xs text-xs text-slate-400 dark:text-slate-500">
              Agrega llantas desde el catálogo o registra un servicio de reencauche.
            </p>
            {!onClose && (
              <Link
                to="/portal/catalogo"
                className="mt-1 rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-slate-900 hover:bg-amber-300"
              >
                Ir al catálogo
              </Link>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-white/5">
            {/* ---- Llantas: marca arriba, nombre y cantidad ---- */}
            {cart.productos.map((p) => (
              <li key={p.id} className="flex items-center gap-3 px-5 py-4">
                <TireThumb brand={p.marca} className="h-14 w-14 shrink-0 rounded-lg" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold tracking-wide text-amber-500 dark:text-amber-400">
                    {p.marca.toUpperCase()}
                  </p>
                  <p className="text-sm font-bold leading-snug text-slate-900 dark:text-white">{p.nombre}</p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => cart.setCantidad(p.id, p.cantidad - 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
                    aria-label="Quitar una"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-7 text-center text-sm font-bold text-slate-800 dark:text-slate-100">
                    {p.cantidad}
                  </span>
                  <button
                    onClick={() => cart.setCantidad(p.id, p.cantidad + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
                    aria-label="Agregar una"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                <button
                  onClick={() => cart.removeProducto(p.id)}
                  className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:text-red-500"
                  aria-label="Eliminar del pedido"
                >
                  <Trash2 size={15} />
                </button>
              </li>
            ))}

            {/* ---- Servicios de reencauche ---- */}
            {cart.servicios.map((s) => (
              <li key={s.id} className="flex items-start gap-3 px-5 py-4">
                {s.foto ? (
                  <img src={s.foto} alt="Carcasa" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                ) : (
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 dark:bg-white/5">
                    <Wrench size={20} />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold tracking-wide text-blue-500 dark:text-blue-400">SERVICIO</p>
                  <p className="text-sm font-bold leading-snug text-slate-900 dark:text-white">{s.servicio}</p>
                  <p className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{s.descripcion}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <Badge>{s.estadoEvidencia}</Badge>
                    <span className="text-xs text-slate-400 dark:text-slate-500">{s.cantidad} llantas</span>
                  </div>
                </div>

                <button
                  onClick={() => cart.removeServicio(s.id)}
                  className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:text-red-500"
                  aria-label="Eliminar del pedido"
                >
                  <Trash2 size={15} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ================= Datos de la cotización ================= */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-brand-navy-800">
        <p className={SECTION_TEXT}>Datos de la cotización</p>

        <div className="mt-4">
          <label htmlFor="pp-pago" className={LABEL}>
            Método de pago
          </label>
          <div className="relative">
            <select
              id="pp-pago"
              value={metodoPago}
              onChange={(e) => {
                setMetodoPago(e.target.value);
                setErrorCredito('');
              }}
              className={SELECT}
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

        {/* ---- Formulario de crédito ---- */}
        {esCredito && (
          <div className="mt-4 space-y-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                Saldo usable
              </span>
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{saldoUsableTexto}</span>
            </div>

            <div>
              <label htmlFor="pp-valor" className={LABEL}>
                Valor del crédito (COP)
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  $
                </span>
                <input
                  id="pp-valor"
                  value={valorCredito}
                  onChange={(e) => {
                    setValorCredito(e.target.value);
                    setErrorCredito('');
                  }}
                  placeholder="500000"
                  className={`${INPUT} ${excedeSaldo || errorCredito ? BORDER_ERR : BORDER_OK} pl-7`}
                />
              </div>
            </div>

            <div>
              <span className={LABEL}>Plazo</span>
              <div className="grid grid-cols-3 gap-2">
                {PLAZOS.map((dias) => (
                  <button
                    key={dias}
                    type="button"
                    onClick={() => setPlazo(dias)}
                    className={`rounded-lg border px-2 py-2 text-xs font-bold transition-colors ${
                      plazo === dias
                        ? 'border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                        : 'border-slate-200 text-slate-500 hover:bg-white dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/5'
                    }`}
                  >
                    {dias} días
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-emerald-500/20 pt-3">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Cuota aproximada · {cuotas} {cuotas === 1 ? 'cuota' : 'cuotas'}
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {cuotaAproximada > 0 ? formatCOP(cuotaAproximada) : '—'}
              </span>
            </div>

            {excedeSaldo && (
              <p className="text-xs font-medium text-red-500">
                El crédito supera tu saldo usable de {saldoUsableTexto}.
              </p>
            )}
            {errorCredito && !excedeSaldo && <p className="text-xs font-medium text-red-500">{errorCredito}</p>}
          </div>
        )}
      </div>

      {/* ================= Resumen y envío ================= */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-brand-navy-800">
        <p className={SECTION_TEXT}>Resumen</p>

        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-slate-500 dark:text-slate-400">Productos</dt>
            <dd className="font-semibold text-slate-800 dark:text-slate-100">{cart.productos.length}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-slate-500 dark:text-slate-400">Servicios</dt>
            <dd className="font-semibold text-slate-800 dark:text-slate-100">{cart.servicios.length}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-slate-500 dark:text-slate-400">Llantas</dt>
            <dd className="font-semibold text-slate-800 dark:text-slate-100">{cart.unidades}</dd>
          </div>
        </dl>

        <p className="mt-4 border-t border-slate-200 pt-4 text-xs leading-relaxed text-slate-400 dark:border-white/10 dark:text-slate-500">
          El valor de la cotización lo confirma un asesor después de revisar tu solicitud.
        </p>

        <div className="mt-5 space-y-2">
          <button
            onClick={guardarCotizacion}
            disabled={vacio}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-bold text-slate-900 shadow-sm shadow-amber-400/30 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          >
            <Save size={16} /> Guardar cotización
          </button>
          <button
            onClick={() => (onClose ? onClose() : navigate('/portal/catalogo'))}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-brand-navy-800 dark:text-slate-200 dark:hover:bg-brand-navy-700"
          >
            Cancelar
          </button>
        </div>
      </div>

      {servicioModal && (
        <FormModal
          mode="create"
          title="Agregar servicio"
          subtitle="Reencauche: sube la foto de la carcasa para que el asesor evalúe si es apta."
          sections={servicioSectionsCliente}
          initialValues={servicioInitialValues}
          submitLabel="Agregar al pedido"
          onSubmit={guardarServicio}
          onClose={() => setServicioModal(false)}
        />
      )}

      {enviada && (
        <CotizacionEnviadaModal
          credito={esCredito ? { valor: formatCOP(valorNum), plazo, cuota: formatCOP(cuotaAproximada) } : null}
          onClose={cerrarAviso}
        />
      )}
    </div>
  );
}
