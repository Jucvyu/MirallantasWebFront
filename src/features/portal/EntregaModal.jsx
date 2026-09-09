import { CalendarCheck, CalendarDays, Check, MapPin, Truck } from 'lucide-react';
import Badge from '../../components/base/Badge';
import Modal from '../../components/base/Modal';

// Avance del despacho. El índice del estado dentro del arreglo marca
// cuántos pasos van completados.
const PASOS = ['Pendiente', 'En camino', 'Entregado'];

/**
 * Estado de la entrega de un pedido.
 *
 * Reemplaza a la antigua vista "Mis Entregas": ahora el seguimiento se
 * consulta desde el detalle de la cotización a la que pertenece.
 */
export default function EntregaModal({ pedido, entrega, onClose }) {
  const pasoActual = entrega ? Math.max(0, PASOS.indexOf(entrega.estado)) : 0;
  const cancelada = entrega?.estado === 'Cancelado';

  return (
    <Modal
      title="Estado de la entrega"
      subtitle={`Pedido ${pedido.id}`}
      icon={<Truck size={17} />}
      size="md"
      onClose={onClose}
      footer={(close) => (
        <button
          type="button"
          onClick={close}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-brand-navy-800 dark:text-slate-200 dark:hover:bg-brand-navy-700"
        >
          Cerrar
        </button>
      )}
    >
      {!entrega ? (
        // ---- Sin despacho registrado todavía --------------------------
        <div className="py-6 text-center">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Todavía no hay un despacho asignado
          </p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            Cuando el pedido salga de bodega verás aquí su seguimiento.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* ---- Cabecera: número de entrega y estado ---- */}
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-slate-900 dark:text-white">{entrega.id}</p>
            <Badge>{entrega.estado}</Badge>
          </div>

          {/* ---- Línea de avance ---- */}
          {!cancelada && (
            <div className="flex items-center px-2">
              {PASOS.map((paso, i) => {
                const hecho = i <= pasoActual;
                return (
                  <div key={paso} className="flex flex-1 items-center last:flex-none">
                    <div className="flex flex-col items-center gap-2">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                          hecho
                            ? 'bg-amber-400 text-slate-900'
                            : 'bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-slate-500'
                        }`}
                      >
                        {hecho ? <Check size={15} /> : i + 1}
                      </span>
                      <span
                        className={`text-[11px] font-bold tracking-wide ${
                          hecho ? 'text-amber-500 dark:text-amber-400' : 'text-slate-400 dark:text-slate-600'
                        }`}
                      >
                        {paso.toUpperCase()}
                      </span>
                    </div>
                    {i < PASOS.length - 1 && (
                      <span
                        className={`mx-3 h-0.5 flex-1 ${
                          i < pasoActual ? 'bg-amber-400' : 'bg-slate-200 dark:bg-white/10'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ---- Datos del despacho ---- */}
          <dl className="space-y-3 border-t border-slate-100 pt-4 text-sm dark:border-white/5">
            <div className="flex items-start justify-between gap-3">
              <dt className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <MapPin size={13} /> Dirección
              </dt>
              <dd className="text-right font-medium text-slate-800 dark:text-slate-100">{entrega.direccion}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <CalendarDays size={13} /> Programada
              </dt>
              <dd className="font-medium text-slate-800 dark:text-slate-100">{entrega.programada || '—'}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <CalendarCheck size={13} /> Entregada
              </dt>
              <dd className="font-medium text-slate-800 dark:text-slate-100">{entrega.entrega || '—'}</dd>
            </div>
          </dl>
        </div>
      )}
    </Modal>
  );
}
