import { CalendarCheck, CalendarDays, Check, ShieldCheck, Wrench } from 'lucide-react';
import Badge from '../../components/base/Badge';
import Modal from '../../components/base/Modal';

// Avance de la orden de reencauche. `paso` (1-3) dice cuántos van hechos.
const PASOS = ['Recepción', 'En proceso', 'Finalizado'];

/**
 * Estado de la orden de reencauche de una línea de servicio.
 *
 * Reemplaza a la antigua vista "Mis Reencauches": ahora el avance se
 * consulta desde el detalle del servicio dentro de su cotización.
 */
export default function ReencaucheModal({ linea, onClose }) {
  const ficha = linea.fichaServicio;

  return (
    <Modal
      title="Estado del reencauche"
      subtitle={`${ficha.orden} · ${linea.nombre}`}
      icon={<Wrench size={17} />}
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
      <div className="space-y-6">
        {/* ---- Cabecera: taller y estado de la orden ---- */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{ficha.taller}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {ficha.modalidad} · {linea.cantidad} {linea.cantidad === 1 ? 'llanta' : 'llantas'}
            </p>
          </div>
          <Badge>{ficha.estado}</Badge>
        </div>

        {/* ---- Línea de avance ---- */}
        <div className="flex items-center px-2">
          {PASOS.map((paso, i) => {
            const hecho = i + 1 <= ficha.paso;
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
                      i + 1 < ficha.paso ? 'bg-amber-400' : 'bg-slate-200 dark:bg-white/10'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* ---- Fechas y garantía ---- */}
        <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 dark:border-white/5 sm:grid-cols-3">
          {[
            ['RECEPCIÓN', ficha.recepcion, CalendarDays],
            ['ENTREGA EST.', ficha.entrega, CalendarCheck],
            ['GARANTÍA', `${ficha.garantiaDias} días`, ShieldCheck],
          ].map(([etiqueta, valor, Icono]) => (
            <div key={etiqueta} className="rounded-lg bg-slate-50 p-3 dark:bg-white/5">
              <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-wide text-slate-400 dark:text-slate-500">
                <Icono size={11} /> {etiqueta}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">{valor || '—'}</p>
            </div>
          ))}
        </div>

        {/* ---- Evidencia de la carcasa ---- */}
        <div className="border-t border-slate-100 pt-4 dark:border-white/5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
              Evidencia de la carcasa
            </p>
            <Badge>{ficha.estadoEvidencia}</Badge>
          </div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{ficha.observaciones}</p>
        </div>
      </div>
    </Modal>
  );
}
