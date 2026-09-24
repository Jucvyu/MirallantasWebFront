import { useMemo, useState } from 'react';
import { Check, Eye, Pencil, Plus } from 'lucide-react';
import Modal from '../Modal';
import Field from './Field';

/** Deja los importes con el mismo formato que usa el resto de las tablas. */
function formatMoney(raw) {
  const digits = String(raw ?? '').replace(/\D/g, '');
  if (!digits) return '';
  return `$ ${Number(digits).toLocaleString('es-CO')}`;
}

const MODE_META = {
  create: { icon: <Plus size={17} />, submit: 'Guardar cambios' },
  edit: { icon: <Pencil size={16} />, submit: 'Guardar cambios' },
  view: { icon: <Eye size={16} />, submit: null },
};

/**
 * Modal de formulario dirigido por esquema — cubre "Nuevo", "Editar" y
 * "Detalle" con la misma definición de campos.
 *
 * sections: [{ title, fields: [ ...ver Field.jsx ] }]
 * mode: 'create' | 'edit' | 'view'
 * validate: (values) => ({ campo: 'mensaje' }) para las reglas que miran
 *   varios campos a la vez, como la cuota inicial frente al total
 */
export default function FormModal({
  title,
  subtitle,
  sections: rawSections = [],
  initialValues = {},
  mode = 'create',
  size = 'lg',
  submitLabel,
  validate,
  onSubmit,
  onClose,
}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const meta = MODE_META[mode] ?? MODE_META.create;

  // Un campo puede limitarse a uno o varios modos con `only` (p. ej. la
  // contraseña, que se pide al crear, o el motivo de cancelación, que solo
  // se ve al editar o al consultar el detalle).
  const aplicaEnModo = (campo) => {
    if (!campo.only) return true;
    return Array.isArray(campo.only) ? campo.only.includes(mode) : campo.only === mode;
  };

  const sections = useMemo(
    () =>
      rawSections
        .map((s) => ({ ...s, fields: s.fields.filter(aplicaEnModo) }))
        .filter((s) => s.fields.length > 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rawSections, mode],
  );

  const requiredKeys = useMemo(
    () => sections.flatMap((s) => s.fields.filter((f) => f.required).map((f) => f.key)),
    [sections],
  );

  const handleChange = (key, val) => {
    setValues((v) => ({ ...v, [key]: val }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  };

  const handleSubmit = (e, close) => {
    e.preventDefault();
    const next = {};
    requiredKeys.forEach((k) => {
      if (!String(values[k] ?? '').trim()) next[k] = 'Este campo es obligatorio';
    });
    // Reglas que dependen de varios campos a la vez
    Object.assign(next, validate?.(values) ?? {});
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const moneyKeys = sections.flatMap((s) => s.fields.filter((f) => f.type === 'money').map((f) => f.key));
    const payload = { ...values };
    moneyKeys.forEach((k) => {
      if (payload[k]) payload[k] = formatMoney(payload[k]);
    });

    onSubmit?.(payload);
    close();
  };

  const footer =
    mode === 'view'
      ? (close) => (
          <button
            type="button"
            onClick={close}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-brand-navy-800 dark:text-slate-200 dark:hover:bg-brand-navy-700"
          >
            Cerrar
          </button>
        )
      : (close) => (
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
              onClick={(e) => handleSubmit(e, close)}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-bold text-slate-900 shadow-sm shadow-amber-400/30 hover:bg-amber-300"
            >
              <Check size={16} /> {submitLabel ?? meta.submit}
            </button>
          </>
        );

  return (
    <Modal
      title={title}
      subtitle={subtitle}
      icon={meta.icon}
      size={size}
      onClose={onClose}
      footer={footer}
    >
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {sections.map((section) => (
          <fieldset key={section.title ?? 'default'}>
            {section.title && (
              <legend className="mb-4 flex w-full items-center gap-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                  {section.title}
                </span>
                <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
              </legend>
            )}
            <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              {section.fields.map((field) => (
                <Field
                  key={field.key}
                  field={field}
                  value={values[field.key]}
                  error={errors[field.key]}
                  onChange={handleChange}
                  mode={mode === 'view' ? 'view' : 'edit'}
                />
              ))}
            </div>
          </fieldset>
        ))}
      </form>
    </Modal>
  );
}
