import { useState } from 'react';
import { Check, Pencil } from 'lucide-react';
import { formatCOP, parseCOP, useCredito } from '../../../context/CreditoContext';

/**
 * Celda del total de una cotización.
 *
 * La cotización nace en cero: el asesor escribe el valor y lo confirma. El
 * botón "Confirmar" solo existe mientras el input está abierto. Al
 * confirmar, si el pedido se paga a crédito, el valor se descuenta del
 * saldo usable del cliente.
 */
export default function TotalCotizacion({ row, update }) {
  const { comprometer, saldoUsableTexto } = useCredito();

  // Sin confirmar arranca en modo edición, que es lo que hay que hacer.
  const [editando, setEditando] = useState(!row.confirmado);
  const [valor, setValor] = useState(() => String(parseCOP(row.total) || ''));
  const [error, setError] = useState('');

  const esCredito = row.metodoPago === 'Crédito';

  const confirmar = () => {
    const monto = parseCOP(valor);
    if (!monto) {
      setError('Indica el valor');
      return;
    }
    // Con crédito hay que descontarlo del cupo del cliente
    if (esCredito && !comprometer(monto)) {
      setError(`Excede el saldo usable (${saldoUsableTexto})`);
      return;
    }
    setError('');
    update({ total: formatCOP(monto), confirmado: true });
    setEditando(false);
  };

  // ---- Ya confirmado: valor en texto con opción de reabrir -------------
  if (!editando) {
    return (
      <span className="flex items-center gap-2">
        <span className="font-medium text-slate-700 dark:text-slate-200">{row.total}</span>
        <button
          type="button"
          onClick={() => setEditando(true)}
          className="rounded p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          aria-label={`Editar el total de ${row.id}`}
        >
          <Pencil size={13} />
        </button>
      </span>
    );
  }

  // ---- En edición: input + botón de confirmar --------------------------
  return (
    <span className="flex items-center gap-1.5">
      <span className="relative">
        <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">
          $
        </span>
        <input
          value={valor}
          onChange={(e) => {
            setValor(e.target.value);
            setError('');
          }}
          placeholder="0"
          aria-label={`Valor total de ${row.id}`}
          className={`w-28 rounded-lg border bg-slate-50 py-1.5 pl-5 pr-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400/40 dark:bg-brand-navy-900 dark:text-slate-100 ${
            error ? 'border-red-400 dark:border-red-500/60' : 'border-slate-200 focus:border-amber-400 dark:border-white/10'
          }`}
        />
      </span>

      <button
        type="button"
        onClick={confirmar}
        title={error || (esCredito ? 'Confirmar y descontar del cupo del cliente' : 'Confirmar el valor')}
        className="inline-flex items-center gap-1 rounded-lg bg-amber-400 px-2.5 py-1.5 text-xs font-bold text-slate-900 hover:bg-amber-300"
      >
        <Check size={13} /> Confirmar
      </button>

      {error && <span className="text-xs font-medium text-red-500">{error}</span>}
    </span>
  );
}
