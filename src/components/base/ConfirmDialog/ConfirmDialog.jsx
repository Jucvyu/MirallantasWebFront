import { TriangleAlert, Trash2 } from 'lucide-react';
import Modal from '../Modal';

/**
 * Diálogo de confirmación (por defecto, borrado de un registro).
 *
 * `record` permite mostrar de qué fila se trata, para que el usuario no
 * confirme a ciegas — es la mejora principal sobre el diálogo original.
 */
export default function ConfirmDialog({
  title = '¿Eliminar registro?',
  message = 'Esta acción no se puede deshacer. ¿Continuar?',
  record = null,
  confirmLabel = 'Eliminar',
  onConfirm,
  onClose,
}) {
  return (
    <Modal
      title={title}
      subtitle={message}
      icon={<TriangleAlert size={17} />}
      tone="danger"
      size="sm"
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
            onClick={() => {
              onConfirm?.();
              close();
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-red-500/30 hover:bg-red-600"
          >
            <Trash2 size={15} /> {confirmLabel}
          </button>
        </>
      )}
    >
      {record ? (
        <div className="rounded-xl border border-red-200 bg-red-50/60 p-4 dark:border-red-500/20 dark:bg-red-500/5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-red-500/80">Registro seleccionado</p>
          <p className="mt-1.5 text-sm font-bold text-slate-900 dark:text-white">{record.title}</p>
          {record.subtitle && (
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{record.subtitle}</p>
          )}
        </div>
      ) : (
        <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p>
      )}
    </Modal>
  );
}
