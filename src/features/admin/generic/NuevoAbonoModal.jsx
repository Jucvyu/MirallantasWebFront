import { useRef, useState } from 'react';
import { Check, ChevronDown, ImagePlus, Wallet, X } from 'lucide-react';
import Modal from '../../../components/base/Modal';
import {
  BORDER_ERR as BORDE_ERR,
  BORDER_OK as BORDE_OK,
  INPUT as CAMPO,
  LABEL,
  SECTION,
  formatoMiles,
} from '../../../components/base/formStyles';
import { formatCOP, parseCOP } from '../../../context/AbonosContext';
import { mediosPago } from '../../../data/mockData';
import SelectorCreditos from '../shared/SelectorCreditos';

/**
 * "Nuevo abono" del administrador.
 *
 * El crédito al que se aplica el abono se elige de un listado con buscador
 * —igual que la cotización en las compras—, no de un desplegable de
 * códigos; si el modal se abre desde un crédito concreto (`creditoFijo`),
 * ese paso se omite. La fecha es la de hoy y el saldo pendiente se calcula
 * restando el monto al saldo del crédito, así que ninguno se pide.
 *
 * La ficha exige validar la consignación antes de aprobar un abono, así
 * que el pantallazo del comprobante es obligatorio cuando el pago entra
 * por transferencia.
 */
export default function NuevoAbonoModal({ creditoFijo = null, onSubmit, onClose }) {
  const [credito, setCredito] = useState(creditoFijo);
  const [comprobante, setComprobante] = useState('');
  const archivo = useRef(null);
  const [monto, setMonto] = useState('');
  const [metodo, setMetodo] = useState('');
  const [errores, setErrores] = useState({});
  // Se avisa cuando el monto se recortó solo por superar el saldo
  const [recortado, setRecortado] = useState(false);

  const valor = parseCOP(monto);
  const saldoActual = credito ? parseCOP(credito.saldoPendiente) : 0;
  const saldoNuevo = Math.max(0, saldoActual - valor);

  // El pantallazo solo tiene sentido en transferencia: el efectivo se paga
  // en el local y la tarjeta deja su propio recibo.
  const requiereComprobante = metodo === 'Transferencia';

  const cargarComprobante = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const lector = new FileReader();
    lector.onload = () => {
      setComprobante(lector.result);
      setErrores((x) => ({ ...x, comprobante: undefined }));
    };
    lector.readAsDataURL(file);
  };

  /**
   * Nadie puede abonar más de lo que debe: si el asesor escribe un valor
   * mayor al saldo del crédito, el campo se ajusta solo al saldo total.
   */
  const escribirMonto = (texto) => {
    const limpio = formatoMiles(texto);
    if (credito && parseCOP(limpio) > saldoActual) {
      setMonto(formatoMiles(String(saldoActual)));
      setRecortado(true);
    } else {
      setMonto(limpio);
      setRecortado(false);
    }
    setErrores((x) => ({ ...x, monto: undefined }));
  };

  const guardar = (close) => {
    const next = {};
    if (!credito) next.credito = 'Selecciona el crédito que se está abonando';
    if (!valor) next.monto = 'Indica el monto pagado';
    if (!metodo) next.metodo = 'Selecciona el método de pago';
    if (requiereComprobante && !comprobante) next.comprobante = 'Adjunta el comprobante del pago';
    setErrores(next);
    if (Object.keys(next).length > 0) return;

    onSubmit?.({
      credito: credito.id,
      cliente: credito.cliente,
      monto: formatCOP(valor),
      // El saldo del crédito sale de la resta y la fecha es la del registro
      saldoPendiente: formatCOP(saldoNuevo),
      fecha: new Date().toISOString().slice(0, 10),
      metodoPago: metodo,
      comprobante: requiereComprobante ? comprobante : '',
      estado: 'Pendiente',
    });
    close();
  };

  return (
    <Modal
      title="Nuevo abono"
      subtitle="Registra un pago sobre un crédito vigente."
      icon={<Wallet size={17} />}
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
            <Check size={16} /> Guardar abono
          </button>
        </>
      )}
    >
      <div className="space-y-6">
        {/* ---- Crédito abonado ---- */}
        <section>
          <div className="mb-3 flex items-center gap-3">
            <span className={SECTION}>Crédito abonado</span>
            <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
          </div>

          {creditoFijo ? (
            // Abierto desde la cartera: el crédito ya está decidido
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{creditoFijo.id}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{creditoFijo.cliente}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Saldo pendiente
                </p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  {creditoFijo.saldoPendiente}
                </p>
              </div>
            </div>
          ) : (
          <SelectorCreditos
            value={credito?.id ?? ''}
            onChange={(c) => {
              setCredito(c);
              // El monto escrito antes puede no caber en el nuevo crédito
              if (parseCOP(monto) > parseCOP(c.saldoPendiente)) {
                setMonto(formatoMiles(String(parseCOP(c.saldoPendiente))));
                setRecortado(true);
              }
              setErrores((e) => ({ ...e, credito: undefined }));
            }}
            error={errores.credito}
          />
          )}
        </section>

        {/* ---- Pago ---- */}
        <section>
          <div className="mb-3 flex items-center gap-3">
            <span className={SECTION}>Pago</span>
            <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ab-monto" className={LABEL}>
                Monto pagado (COP) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  $
                </span>
                <input
                  id="ab-monto"
                  inputMode="numeric"
                  value={monto}
                  onChange={(e) => escribirMonto(e.target.value)}
                  placeholder="2.000.000"
                  className={`${CAMPO} ${errores.monto ? BORDE_ERR : BORDE_OK} pl-8`}
                />
              </div>
              {errores.monto ? (
                <p className="mt-1 text-xs font-medium text-red-500">{errores.monto}</p>
              ) : (
                recortado && (
                  <p className="mt-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                    El abono no puede superar el saldo: se ajustó al total pendiente.
                  </p>
                )
              )}
            </div>

            <div>
              <label htmlFor="ab-metodo" className={LABEL}>
                Método de pago <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="ab-metodo"
                  value={metodo}
                  onChange={(e) => {
                    setMetodo(e.target.value);
                    setErrores((x) => ({ ...x, metodo: undefined }));
                  }}
                  className={`${CAMPO} ${errores.metodo ? BORDE_ERR : BORDE_OK} cursor-pointer appearance-none pr-10`}
                >
                  <option value="">Seleccionar...</option>
                  {mediosPago.map((m) => (
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
              {errores.metodo && <p className="mt-1 text-xs font-medium text-red-500">{errores.metodo}</p>}
            </div>
          </div>

          {/* ---- Comprobante de pago ---- */}
          {requiereComprobante && (
            <div className="mt-4">
              <span className={LABEL}>
                Comprobante de pago <span className="text-red-500">*</span>
              </span>
              {comprobante ? (
                <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-white/10">
                  <img src={comprobante} alt="Comprobante" className="h-40 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setComprobante('')}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 text-white hover:bg-black/80"
                    aria-label="Quitar el comprobante"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => archivo.current?.click()}
                  className={`flex h-32 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-slate-400 hover:border-amber-400 hover:text-amber-500 ${
                    errores.comprobante ? 'border-red-400' : 'border-slate-200 dark:border-white/10'
                  }`}
                >
                  <ImagePlus size={24} strokeWidth={1.5} />
                  <span className="text-xs font-medium">Sube el pantallazo de la consignación</span>
                </button>
              )}
              <input ref={archivo} type="file" accept="image/*" className="hidden" onChange={cargarComprobante} />
              {errores.comprobante ? (
                <p className="mt-1 text-xs font-medium text-red-500">{errores.comprobante}</p>
              ) : (
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  Hay que validarlo antes de confirmar el abono.
                </p>
              )}
            </div>
          )}

          {/* El saldo no se captura: se muestra ya calculado */}
          {credito && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Saldo actual
                </p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{credito.saldoPendiente}</p>
              </div>
              <ChevronDown size={16} className="-rotate-90 text-slate-300 dark:text-slate-600" />
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Saldo tras el abono
                </p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCOP(saldoNuevo)}
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </Modal>
  );
}
