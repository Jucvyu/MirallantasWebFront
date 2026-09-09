import { useRef } from 'react';
import { ChevronDown, ImagePlus, X } from 'lucide-react';

const INPUT =
  'w-full rounded-lg border bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 ' +
  'focus:outline-none focus:ring-2 focus:ring-amber-400/40 ' +
  'dark:bg-brand-navy-900 dark:text-slate-100 dark:placeholder:text-slate-500';

const BORDER_OK = 'border-slate-200 focus:border-amber-400 dark:border-white/10 dark:focus:border-amber-400/70';
const BORDER_ERR = 'border-red-400 focus:border-red-400 dark:border-red-500/60';

/** Los valores múltiples (checkboxes) viajan como texto separado por comas. */
function toList(value) {
  return String(value ?? '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

/**
 * Un campo del esquema de formulario.
 *
 * field: { key, label, type, required, placeholder, options, hint, span }
 *   type: text | email | tel | number | password | date | money | textarea |
 *         select | checkboxes | image
 * mode: 'edit' (editable) | 'view' (solo lectura, estilo "detalle")
 */
export default function Field({ field, value, error, onChange, mode = 'edit' }) {
  const { key, label, type = 'text', required, placeholder, options = [], hint } = field;
  const readOnly = mode === 'view';
  const border = error ? BORDER_ERR : BORDER_OK;
  const id = `f-${key}`;
  const fileInput = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(key, reader.result);
    reader.readAsDataURL(file);
  };

  const toggleOption = (opt) => {
    const list = toList(value);
    const next = list.includes(opt) ? list.filter((v) => v !== opt) : [...list, opt];
    onChange(key, next.join(', '));
  };

  return (
    <div className={field.span === 2 ? 'sm:col-span-2' : ''}>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold text-slate-700 dark:text-slate-200">
        {label}
        {required && !readOnly && <span className="ml-0.5 text-red-500">*</span>}
      </label>

      {type === 'image' ? (
        <div>
          {value ? (
            <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-white/10">
              <img src={value} alt={label} className="h-40 w-full object-cover" />
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => onChange(key, '')}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 text-white hover:bg-black/80"
                  aria-label="Quitar imagen"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ) : readOnly ? (
            <div className={`${INPUT} ${BORDER_OK} cursor-default`}>Sin imagen</div>
          ) : (
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className={`flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-slate-400 hover:border-amber-400 hover:text-amber-500 ${
                error ? 'border-red-400' : 'border-slate-200 dark:border-white/10'
              }`}
            >
              <ImagePlus size={26} strokeWidth={1.5} />
              <span className="text-xs font-medium">{placeholder ?? 'Subir foto (JPG o PNG)'}</span>
            </button>
          )}
          <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      ) : type === 'checkboxes' ? (
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => {
            const active = toList(value).includes(opt);
            return (
              <button
                key={opt}
                type="button"
                disabled={readOnly}
                onClick={() => toggleOption(opt)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  active
                    ? 'border-amber-400 bg-amber-400/15 text-amber-600 dark:text-amber-400'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/5'
                } ${readOnly ? 'cursor-default' : ''}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      ) : type === 'textarea' ? (
        <textarea
          id={id}
          rows={3}
          readOnly={readOnly}
          value={value ?? ''}
          placeholder={placeholder}
          onChange={(e) => onChange(key, e.target.value)}
          className={`${INPUT} ${border} resize-none ${readOnly ? 'cursor-default' : ''}`}
        />
      ) : type === 'select' ? (
        readOnly ? (
          <div className={`${INPUT} ${BORDER_OK} cursor-default`}>{value || '—'}</div>
        ) : (
          <div className="relative">
            <select
              id={id}
              value={value ?? ''}
              onChange={(e) => onChange(key, e.target.value)}
              className={`${INPUT} ${border} appearance-none pr-9`}
            >
              <option value="">Seleccionar...</option>
              {options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        )
      ) : (
        <div className="relative">
          {type === 'money' && (
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">
              $
            </span>
          )}
          <input
            id={id}
            type={type === 'money' ? 'text' : type}
            readOnly={readOnly}
            value={value ?? ''}
            placeholder={placeholder}
            onChange={(e) => onChange(key, e.target.value)}
            className={`${INPUT} ${border} ${type === 'money' ? 'pl-7' : ''} ${readOnly ? 'cursor-default' : ''}`}
          />
        </div>
      )}

      {error ? (
        <p className="mt-1 text-xs font-medium text-red-500">{error}</p>
      ) : (
        hint && <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{hint}</p>
      )}
    </div>
  );
}
