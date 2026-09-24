import { useRef, useState } from 'react';
import { Check, ChevronDown, ImagePlus, Wallet, X } from 'lucide-react';
import Badge from '../../components/base/Badge';
import Modal from '../../components/base/Modal';
import { formatCOP, parseCOP } from '../../context/AbonosContext';
import { useSesion } from '../../context/SesionContext';
import { mediosPago } from '../../data/mockData';

import {
  BORDER_ERR,
  BORDER_OK,
  INPUT,
  LABEL,
  SECTION,
  formatoMiles,
} from '../../components/base/formStyles';

/**
 * Registro de un abono desde el portal.
 *
 * El abono siempre se aplica al crédito desde el que se abrió el modal
 * (`creditoId`), así que aquí no se elige: solo se muestra a cuál va. El
 * cliente indica el monto y, si paga por transferencia, adjunta el
 * pantallazo de la consignación; la fecha la pone el sistema y el asesor
 * valida el soporte al confirmar el pago.
 */
export default function RegistrarAbonoModal({ creditoId, onSubmit, onClose }) {
  const [monto, setMonto] = useState('');
  const [metodo, setMetodo] = useState('');
  const [soporte, setSoporte] = useState('');
  const [errors, setErrors] = useState({});
  const fileInput = useRef(null);

  const { creditos } = useSesion();
  const credito = creditos.find((c) => c.id === creditoId);
  // El pantallazo solo tiene sentido en transferencia: el efectivo se paga
  // en el local y la tarjeta deja su propio recibo.
  const requiereSoporte = metodo === 'Transferencia';
  const saldoActual = parseCOP(credito?.saldoPendiente);
  const montoNum = parseCOP(monto);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSoporte(reader.result);
      setErrors((err) => ({ ...err, soporte: undefined }));
    };
    reader.readAsDataURL(file);
  };

  const submit = (close) => {
    const next = {};
    if (!montoNum) next.monto = 'Ingresa el monto abonado';
    else if (credito && montoNum > saldoActual) next.monto = 'El monto supera el saldo pendiente';
    if (!metodo) next.metodo = 'Este campo es obligatorio';
    if (requiereSoporte && !soporte) next.soporte = 'Adjunta el pantallazo de la consignación';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onSubmit?.({
      credito: creditoId,
      fecha: new Date().toISOString().slice(0, 10),
      monto: formatCOP(montoNum),
      saldoPendiente: formatCOP(Math.max(0, saldoActual - montoNum)),
      metodoPago: metodo,
      // La consignación es el comprobante que el asesor debe validar
      comprobante: requiereSoporte ? soporte : '',
      estado: 'Pendiente',
    });
    close();
  };

  return (
    <Modal
      title="Registrar abono"
      subtitle={`Se aplicará al crédito ${creditoId}`}
      icon={<Wallet size={17} />}
      size="md"
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
            onClick={() => submit(close)}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-bold text-slate-900 shadow-sm shadow-amber-400/30 hover:bg-amber-300"
          >
            <Check size={16} /> Registrar abono
          </button>
        </>
      )}
    >
      <div className="space-y-6">
        {/* ---- Crédito al que se aplica, solo informativo ---- */}
        {credito && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{credito.id}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {credito.cotizacion} · vence el {credito.fechaLimite}
                </p>
              </div>
              <Badge>{credito.estado}</Badge>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-200 pt-3 text-sm dark:border-white/10">
              <span className="text-slate-500 dark:text-slate-400">Saldo pendiente</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">{credito.saldoPendiente}</span>
            </div>
          </div>
        )}

        {/* ---- Datos del pago ---- */}
        <section>
          <div className="mb-3 flex items-center gap-3">
            <span className={SECTION}>Datos del abono</span>
            <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ab-monto" className={LABEL}>
                Monto a abonar (COP) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  $
                </span>
                <input
                  id="ab-monto"
                  value={monto}
                  inputMode="numeric"
                  onChange={(e) => setMonto(formatoMiles(e.target.value))}
                  placeholder="500000"
                  className={`${INPUT} ${errors.monto ? BORDER_ERR : BORDER_OK} pl-7`}
                />
              </div>
              {errors.monto ? (
                <p className="mt-1 text-xs font-medium text-red-500">{errors.monto}</p>
              ) : (
                credito &&
                montoNum > 0 && (
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    Quedaría {formatCOP(Math.max(0, saldoActual - montoNum))}
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
                    if (e.target.value === 'Efectivo') setSoporte('');
                  }}
                  className={`${INPUT} ${errors.metodo ? BORDER_ERR : BORDER_OK} appearance-none pr-9`}
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
              {errors.metodo && <p className="mt-1 text-xs font-medium text-red-500">{errors.metodo}</p>}
            </div>
          </div>
        </section>

        {/* ---- Soporte de la consignación: solo en transferencia ---- */}
        {requiereSoporte && (
        <section>
          <div className="mb-3 flex items-center gap-3">
            <span className={SECTION}>Soporte de la consignación</span>
            <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
          </div>

          {soporte ? (
            <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-white/10">
              <img src={soporte} alt="Pantallazo de la consignación" className="h-48 w-full object-cover" />
              <button
                type="button"
                onClick={() => setSoporte('')}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 text-white hover:bg-black/80"
                aria-label="Quitar soporte"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className={`flex h-48 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-slate-400 hover:border-amber-400 hover:text-amber-500 ${
                errors.soporte ? 'border-red-400' : 'border-slate-200 dark:border-white/10'
              }`}
            >
              <ImagePlus size={28} strokeWidth={1.5} />
              <span className="text-xs font-medium">Sube el pantallazo de la consignación (JPG o PNG)</span>
            </button>
          )}
          <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          {errors.soporte && <p className="mt-1 text-xs font-medium text-red-500">{errors.soporte}</p>}
        </section>
        )}
      </div>
    </Modal>
  );
}
