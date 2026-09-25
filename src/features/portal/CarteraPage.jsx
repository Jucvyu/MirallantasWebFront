import { useState } from 'react';
import { CreditCard, HandCoins, Plus, Receipt, Wallet } from 'lucide-react';
import Badge from '../../components/base/Badge';
import StatCard from '../../components/base/StatCard';
import { useAbonos } from '../../context/AbonosContext';
import { useCredito } from '../../context/CreditoContext';
import { useSesion } from '../../context/SesionContext';
import DetalleAbonoModal from './DetalleAbonoModal';
import RegistrarAbonoModal from './RegistrarAbonoModal';
import SolicitarCreditoModal from './SolicitarCreditoModal';

/** "$ 575.000" → 575000 */
const aNumero = (v) => Number(String(v ?? '').replace(/\D/g, '')) || 0;

/** Cómo va el crédito hoy, a partir del saldo y de la fecha límite. */
function condicion(credito) {
  if (aNumero(credito.saldoPendiente) === 0) return 'Pagado';
  return new Date(credito.fechaLimite) < new Date() ? 'Vencido' : 'Al día';
}

const BORDE = {
  'Al día': 'border-emerald-400',
  Vencido: 'border-red-400',
  Pagado: 'border-slate-300 dark:border-white/25',
};

/**
 * Mi cartera.
 *
 * Reúne lo que el cliente puede hacer con su crédito según los casos de
 * uso: consultar la cartera y el detalle de cada crédito, registrar abonos
 * con su comprobante y solicitar un crédito nuevo.
 */
export default function CarteraPage() {
  const { abonos, addAbono } = useAbonos();
  const { saldoUsableTexto, comprometidoTexto, cupoTotal, tieneCredito } = useCredito();
  const { creditos, solicitudesCredito } = useSesion();

  const [abonoDe, setAbonoDe] = useState(null);
  // Abono cuyo detalle se está mirando
  const [abonoVisto, setAbonoVisto] = useState(null);
  const [solicitando, setSolicitando] = useState(false);
  const [solicitudes, setSolicitudes] = useState(solicitudesCredito);

  const registrarSolicitud = (solicitud) => {
    setSolicitudes((prev) => [
      { ...solicitud, id: `SLC-${String(100 + prev.length + 1).slice(-3)}` },
      ...prev,
    ]);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">Mi cartera</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Créditos, abonos y solicitudes · cupo total de $ {cupoTotal.toLocaleString('es-CO')}
          </p>
        </div>
        <button
          onClick={() => setSolicitando(true)}
          disabled={tieneCredito}
          title={tieneCredito ? 'Ya tienes un crédito abierto' : undefined}
          className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-bold text-slate-900 shadow-sm shadow-amber-400/30 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          <HandCoins size={16} /> Solicitar crédito
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="SALDO USABLE"
          value={saldoUsableTexto}
          sub={tieneCredito ? 'En negativo por tu crédito abierto' : 'Disponible para nuevos créditos'}
          icon="Wallet"
          accent={tieneCredito ? 'red' : 'emerald'}
        />
        <StatCard label="SALDO PENDIENTE" value={comprometidoTexto} sub="Comprometido en créditos" icon="CreditCard" accent="amber" />
        <StatCard label="CRÉDITOS" value={String(creditos.length)} sub={`${solicitudes.length} solicitudes`} icon="FileText" accent="blue" />
      </div>

      {/* ================= Créditos ================= */}
      {tieneCredito && (
        <p className="mt-5 rounded-xl border border-red-400/40 bg-red-500/5 px-4 py-3 text-xs font-medium text-red-600 dark:text-red-400">
          Solo puedes tener un crédito a la vez. Mientras esté abierto, tu saldo usable se muestra en
          negativo por el total de la cotización financiada.
        </p>
      )}

      <h2 className="mt-8 text-sm font-bold text-slate-900 dark:text-white">Mis créditos</h2>
      <div className="mt-3 grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
        {creditos.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-400 lg:col-span-2 dark:border-white/10">
            Todavía no tienes créditos: todas tus compras han sido de contado.
          </p>
        )}
        {creditos.map((credito) => {
          const estado = condicion(credito);
          const abonosDel = abonos.filter((a) => a.credito === credito.id);

          return (
            <article
              key={credito.id}
              className={`rounded-xl border-2 bg-white p-5 dark:bg-brand-navy-800 ${BORDE[estado]}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-amber-500 dark:text-amber-400">
                    <CreditCard size={17} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{credito.id}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {credito.cotizacion} · vence el {credito.fechaLimite}
                    </p>
                  </div>
                </div>
                <Badge>{estado}</Badge>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  ['MONTO', credito.montoTotal],
                  ['SALDO', credito.saldoPendiente],
                  ['PLAZO', `${credito.plazoDias} días`],
                  ['APERTURA', credito.fechaApertura],
                ].map(([etiqueta, valor]) => (
                  <div key={etiqueta} className="rounded-lg bg-slate-100/80 p-2.5 dark:bg-white/5">
                    <p className="text-[10px] font-bold tracking-wide text-slate-400 dark:text-slate-500">
                      {etiqueta}
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-slate-800 dark:text-slate-100">{valor}</p>
                  </div>
                ))}
              </div>

              {/* ---- Historial de abonos ---- */}
              {abonosDel.length > 0 && (
                <ul className="mt-3 divide-y divide-slate-100 rounded-lg border border-slate-200 dark:divide-white/5 dark:border-white/10">
                  {abonosDel.map((a) => (
                    <li key={a.id}>
                      <button
                        type="button"
                        onClick={() => setAbonoVisto(a)}
                        title="Ver el detalle del abono"
                        className="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                      >
                        <Receipt size={13} className="shrink-0 text-slate-400" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">
                            {a.id} · {a.monto}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">
                            {a.fecha} · {a.metodoPago}
                          </p>
                        </div>
                        <Badge>{a.estado}</Badge>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <button
                type="button"
                disabled={estado === 'Pagado'}
                onClick={() => setAbonoDe(credito)}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-amber-400 py-2 text-xs font-bold text-amber-600 transition-colors hover:bg-amber-400/10 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 dark:text-amber-400 dark:disabled:border-white/10 dark:disabled:text-slate-500"
              >
                <Plus size={13} /> Registrar abono
              </button>
            </article>
          );
        })}
      </div>

      {/* ================= Solicitudes de crédito ================= */}
      <h2 className="mt-8 text-sm font-bold text-slate-900 dark:text-white">Mis solicitudes de crédito</h2>
      <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-brand-navy-800">
        {solicitudes.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-slate-400">
            Todavía no has solicitado ningún crédito.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-white/5">
            {solicitudes.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 dark:bg-white/5">
                    <Wallet size={15} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {s.id} · {s.monto}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {s.fecha} · {s.plazoDias} días
                      {s.motivo ? ` · ${s.motivo}` : ''}
                    </p>
                  </div>
                </div>
                <Badge>{s.estado}</Badge>
              </li>
            ))}
          </ul>
        )}
      </div>

      {abonoVisto && (
        <DetalleAbonoModal abono={abonoVisto} onClose={() => setAbonoVisto(null)} />
      )}
      {abonoDe && (
        <RegistrarAbonoModal creditoId={abonoDe.id} onSubmit={addAbono} onClose={() => setAbonoDe(null)} />
      )}
      {solicitando && (
        <SolicitarCreditoModal onSubmit={registrarSolicitud} onClose={() => setSolicitando(false)} />
      )}
    </div>
  );
}
