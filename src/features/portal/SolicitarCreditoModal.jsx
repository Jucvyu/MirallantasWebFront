import { useState } from 'react';
import { Check, HandCoins } from 'lucide-react';
import Modal from '../../components/base/Modal';
import {
  BORDER_ERR,
  BORDER_OK,
  INPUT,
  LABEL,
  formatoMiles,
} from '../../components/base/formStyles';
import { formatCOP, parseCOP, useCredito } from '../../context/CreditoContext';
import { INTERES_POR_PLAZO, PLAZOS_CREDITO } from '../../data/mockData';

/**
 * Solicitud de crédito del cliente.
 *
 * El cliente pide un monto y un plazo; la solicitud queda pendiente hasta
 * que el administrador la apruebe o la rechace. El monto no puede superar
 * el saldo usable de su cartera.
 */
export default function SolicitarCreditoModal({ onSubmit, onClose }) {
  const { saldoUsable, saldoUsableTexto } = useCredito();
  const [monto, setMonto] = useState('');
  const [plazo, setPlazo] = useState(30);
  const [error, setError] = useState('');

  const valor = parseCOP(monto);
  const excede = valor > saldoUsable;
  const interes = Math.round(valor * (INTERES_POR_PLAZO[plazo] ?? 0));

  const guardar = (close) => {
    if (!valor) {
      setError('Indica el monto que necesitas');
      return;
    }
    if (excede) {
      setError(`Tu saldo usable es ${saldoUsableTexto}.`);
      return;
    }
    onSubmit?.({
      monto: formatCOP(valor),
      plazoDias: plazo,
      fecha: new Date().toISOString().slice(0, 10),
      estado: 'Pendiente',
      motivo: '',
    });
    close();
  };

  return (
    <Modal
      title="Solicitar crédito"
      subtitle="Un asesor revisa la solicitud y la aprueba o la rechaza."
      icon={<HandCoins size={17} />}
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
            onClick={() => guardar(close)}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-bold text-slate-900 shadow-sm shadow-amber-400/30 hover:bg-amber-300"
          >
            <Check size={16} /> Enviar solicitud
          </button>
        </>
      )}
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3">
          <span className="text-[11px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
            Saldo usable
          </span>
          <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{saldoUsableTexto}</span>
        </div>

        <div>
          <label htmlFor="sc-monto" className={LABEL}>
            Monto solicitado (COP) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
              $
            </span>
            <input
              id="sc-monto"
              inputMode="numeric"
              value={monto}
              onChange={(e) => {
                setMonto(formatoMiles(e.target.value));
                setError('');
              }}
              placeholder="800.000"
              className={`${INPUT} ${error || excede ? BORDER_ERR : BORDER_OK} pl-8`}
            />
          </div>
        </div>

        <div>
          <span className={LABEL}>Plazo</span>
          <div className="grid grid-cols-3 gap-2">
            {PLAZOS_CREDITO.map((dias) => (
              <button
                key={dias}
                type="button"
                onClick={() => setPlazo(dias)}
                aria-pressed={plazo === dias}
                className={`rounded-xl border px-2 py-2.5 text-xs font-bold transition-colors ${
                  plazo === dias
                    ? 'border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300 dark:border-white/10 dark:text-slate-400'
                }`}
              >
                {dias} días
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
            A {plazo} días se suma un {(INTERES_POR_PLAZO[plazo] * 100).toFixed(0)}% de interés
            {valor > 0 ? ` (${formatCOP(interes)})` : ''}.
          </p>
        </div>

        {error && <p className="text-xs font-medium text-red-500">{error}</p>}
      </div>
    </Modal>
  );
}
