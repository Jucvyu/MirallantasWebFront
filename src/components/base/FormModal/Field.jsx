import { useRef } from 'react';
import { Check, ChevronDown, ImagePlus, Pipette, TriangleAlert, X } from 'lucide-react';
import SearchSelect from '../SearchSelect';
import {
  BORDER_ERR,
  BORDER_OK,
  INPUT,
  LABEL,
  formatoMiles,
  soloDigitos,
  soloTelefono,
} from '../formStyles';

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
 *         select | checkboxes | image | color | switch
 * mode: 'edit' (editable) | 'view' (solo lectura, estilo "detalle")
 *
 * Los catálogos (select / checkboxes) avisan cuando no tienen registros y,
 * si superan `MINIMO_PARA_BUSCAR` opciones, se muestran con buscador.
 */

/** Valores que guarda el campo de tipo interruptor. */
const ENCENDIDO = 'Sí';
const APAGADO = 'No';

/** A partir de cuántas opciones el selector incorpora barra de búsqueda. */
const MINIMO_PARA_BUSCAR = 15;

/**
 * Paleta sugerida para el campo de color, agrupada por familia para que
 * sea fácil elegir un tono que no choque con el resto de la interfaz.
 */
const PALETA = [
  { nombre: 'Ámbar', valor: '#FBBF24' },
  { nombre: 'Naranja', valor: '#F97316' },
  { nombre: 'Rojo', valor: '#EF4444' },
  { nombre: 'Rosa', valor: '#EC4899' },
  { nombre: 'Violeta', valor: '#A78BFA' },
  { nombre: 'Azul', valor: '#3B82F6' },
  { nombre: 'Cian', valor: '#06B6D4' },
  { nombre: 'Esmeralda', valor: '#22C55E' },
  { nombre: 'Lima', valor: '#84CC16' },
  { nombre: 'Pizarra', valor: '#64748B' },
  { nombre: 'Dorado', valor: '#C9A876' },
  { nombre: 'Navy', valor: '#1B2230' },
];

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

  // Dinero, cantidades y teléfonos se filtran mientras se escribe, así que
  // no hay forma de colar letras en un campo numérico.
  const alEscribir = (e) => {
    const bruto = e.target.value;
    if (type === 'money') return onChange(key, formatoMiles(bruto));
    if (type === 'number') return onChange(key, soloDigitos(bruto));
    if (type === 'tel') return onChange(key, soloTelefono(bruto));
    return onChange(key, bruto);
  };

  const esNumerico = type === 'money' || type === 'number' || type === 'tel';

  const toggleOption = (opt) => {
    const list = toList(value);
    const next = list.includes(opt) ? list.filter((v) => v !== opt) : [...list, opt];
    onChange(key, next.join(', '));
  };

  // Una clave foránea sin registros bloquea el formulario: no hay nada que
  // elegir, así que se avisa en vez de mostrar un selector vacío.
  // El interruptor guarda el mismo texto que usaria un desplegable, para
  // que el listado y el detalle lo muestren sin conversiones.
  const encendido = value === ENCENDIDO || value === true;

  const esCatalogo = type === 'select' || type === 'checkboxes';
  const catalogoVacio = esCatalogo && !readOnly && options.length === 0;

  return (
    <div className={field.span === 2 ? 'sm:col-span-2' : ''}>
      <label htmlFor={id} className={LABEL}>
        {label}
        {required && !readOnly && <span className="ml-0.5 text-red-500">*</span>}
      </label>

      {catalogoVacio && (
        <p className="flex items-start gap-2 rounded-lg border border-amber-400/40 bg-amber-400/10 px-3 py-2.5 text-xs font-medium text-amber-700 dark:text-amber-400">
          <TriangleAlert size={14} className="mt-px shrink-0" />
          No hay {field.emptyLabel ?? label.toLowerCase()} registrado, por favor registra al menos uno
          para poder continuar con el registro
        </p>
      )}

      {catalogoVacio ? null : type === 'switch' ? (
        // ---- Interruptor si / no, en vez de un desplegable de dos opciones ----
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={encendido}
          disabled={readOnly}
          onClick={() => onChange(key, encendido ? APAGADO : ENCENDIDO)}
          className={`flex w-full items-center gap-3 rounded-xl border px-4 py-2.5 text-left transition-colors ${
            readOnly ? 'cursor-default' : 'hover:border-slate-300 dark:hover:border-white/20'
          } ${
            encendido
              ? 'border-emerald-400/60 bg-emerald-500/5'
              : 'border-slate-200 bg-white dark:border-white/10 dark:bg-brand-navy-900/70'
          }`}
        >
          <span
            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
              encendido ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-white/20'
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                encendido ? 'translate-x-[1.15rem]' : 'translate-x-[0.15rem]'
              }`}
            />
          </span>
          <span
            className={`text-sm font-semibold ${
              encendido ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {encendido ? ENCENDIDO : APAGADO}
          </span>
        </button>
      ) : type === 'color' ? (
        // ---- Paleta agrupada + cuentagotas para un tono a medida ----
        <div className="rounded-xl border border-slate-200 p-3 dark:border-white/10">
          <div className="flex items-center gap-3">
            {/* Muestra grande del color elegido */}
            <span
              className="h-11 w-11 shrink-0 rounded-xl ring-1 ring-black/10 dark:ring-white/20"
              style={{ backgroundColor: value || '#E2E8F0' }}
            />
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {PALETA.find((c) => c.valor === value)?.nombre ?? (value ? 'Personalizado' : 'Sin color')}
              </p>
              <p className="font-mono text-xs uppercase text-slate-400 dark:text-slate-500">{value || '—'}</p>
            </div>

            {!readOnly && (
              <label
                title="Elegir un color a medida"
                className="ml-auto flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:border-amber-400 hover:text-amber-500 dark:border-white/10 dark:text-slate-300"
              >
                <Pipette size={13} />
                Personalizado
                <input
                  type="color"
                  value={value || '#FBBF24'}
                  onChange={(e) => onChange(key, e.target.value)}
                  className="sr-only"
                />
              </label>
            )}
          </div>

          {!readOnly && (
            <div className="mt-3 grid grid-cols-6 gap-2 border-t border-slate-100 pt-3 dark:border-white/10 sm:grid-cols-12">
              {PALETA.map((c) => (
                <button
                  key={c.valor}
                  type="button"
                  onClick={() => onChange(key, c.valor)}
                  title={c.nombre}
                  aria-label={c.nombre}
                  aria-pressed={value === c.valor}
                  className="flex h-8 w-full items-center justify-center rounded-lg ring-1 ring-black/10 transition-transform hover:scale-105 dark:ring-white/20"
                  style={{ backgroundColor: c.valor }}
                >
                  {value === c.valor && <Check size={14} className="text-white drop-shadow" strokeWidth={3} />}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : type === 'image' ? (
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
        ) : options.length > MINIMO_PARA_BUSCAR ? (
          <SearchSelect
            value={value ?? ''}
            options={options}
            onChange={(opcion) => onChange(key, opcion)}
            error={Boolean(error)}
          />
        ) : (
          <div className="relative">
            <select
              id={id}
              value={value ?? ''}
              onChange={(e) => onChange(key, e.target.value)}
              className={`${INPUT} ${border} cursor-pointer appearance-none pr-10`}
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
            // Los numéricos van como texto para poder filtrar lo que se teclea
            type={esNumerico ? 'text' : type}
            inputMode={esNumerico ? 'numeric' : undefined}
            readOnly={readOnly}
            value={value ?? ''}
            placeholder={placeholder}
            onChange={alEscribir}
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
