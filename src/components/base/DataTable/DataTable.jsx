import { useMemo, useState } from 'react';
import { Download, Eye, Pencil, Plus, RefreshCw, Search, SlidersHorizontal, Trash2 } from 'lucide-react';
import Dropdown from '../Dropdown';
import { BORDER_OK, INPUT } from '../formStyles';
import FormModal from '../FormModal';
import ConfirmDialog from '../ConfirmDialog';
import StatusSelect from '../StatusSelect';
import StatusSwitch from '../StatusSwitch';

const PAGE_SIZE = 8;

/**
 * Artículo que le corresponde al nombre de la entidad, para que los
 * títulos digan "Nueva venta" y no "Nuevo venta".
 *
 * Se deduce de la terminación —a, -ión, -dad, -tud y -umbre son femeninas—
 * y se puede forzar con la prop `entityGender`.
 */
function esFemenino(nombre) {
  return /(a|ión|dad|tud|umbre)$/i.test(String(nombre).trim());
}

/** Genera el siguiente ID siguiendo el patrón del último registro (U005 → U006). */
function nextId(rows) {
  const last = rows[rows.length - 1]?.id;
  if (typeof last !== 'string') return `REG-${rows.length + 1}`;
  const m = last.match(/^(.*?)(\d+)$/);
  if (!m) return `${last}-${rows.length + 1}`;
  const [, prefix, digits] = m;
  return prefix + String(Number(digits) + 1).padStart(digits.length, '0');
}

/** Esquema de formulario por defecto cuando la página no define uno propio. */
function fallbackSections(columns) {
  return [
    {
      title: 'Datos del registro',
      fields: columns
        .filter((c) => c.key !== 'id')
        .map((c) => ({ key: c.key, label: c.label, placeholder: c.label })),
    },
  ];
}

/**
 * columns: [{ key, label, render?(row, { update }) }] — `update(patch)`
 *   permite que una celda modifique su propia fila (p. ej. fijar el total)
 * data: array de filas, cada una con `id` único
 * formSections: esquema del formulario de crear/editar/ver (ver FormModal)
 * entityName: nombre en singular, para los títulos de los modales ("usuario")
 * normalize: deriva las columnas del listado a partir de los valores del
 *   formulario (p. ej. "medida" a partir de ancho/perfil/rin)
 * statusOptions: catálogo de estados; si se pasa, la columna `statusKey` se
 *   vuelve editable desde la propia fila
 * statusVariant: 'select' (lista desplegable) o 'switch' (interruptor
 *   verde/rojo, para catálogos binarios tipo Activo/Inactivo)
 * filters: [{ key, label, options? }] filtros de la barra superior
 * createModal: ({ onSubmit, onClose }) => nodo, para reemplazar el formulario
 *   de "Nuevo" por uno a medida
 * rows / onRowsChange: modo controlado. Cuando el listado vive en un
 *   contexto compartido (p. ej. las entregas), la tabla deja de guardar su
 *   propia copia y delega los cambios hacia afuera
 * rowActions: (row, { update }) => nodo, botones extra a la izquierda de
 *   ver/editar; `update(patch)` modifica esa misma fila
 * formValidate: (values) => ({ campo: 'mensaje' }) para las reglas del
 *   formulario que miran varios campos a la vez
 * statusFlow: { estado: [siguientes] } para limitar los cambios de estado
 *   a las transiciones válidas
 * exportable: muestra u oculta el botón de exportar
 * canView / canEdit / canDelete: muestran u ocultan cada acción de la fila.
 *   Sirven, por ejemplo, para que un módulo con su propio "ver detalle" no
 *   repita el del formulario, o para que la cartera no se pueda editar
 * entityGender: 'f' o 'm', para forzar el artículo de los títulos
 *
 * Los filtros admiten varias opciones a la vez: `activeFilters[k]` es un
 * arreglo y la fila entra si coincide con cualquiera de las marcadas.
 */
export default function DataTable({
  columns,
  data,
  title,
  newLabel = 'Nuevo registro',
  statusKey,
  toolbar = true,
  readOnly = false,
  formSections,
  entityName = 'registro',
  titleKey = 'nombre',
  normalize,
  statusOptions,
  statusVariant = 'select',
  filters = [],
  createModal,
  rows: rowsExternas,
  onRowsChange,
  rowActions,
  statusFlow,
  formValidate,
  exportable = true,
  canView = true,
  canEdit = true,
  canDelete = true,
  entityGender,
}) {
  const femenino = entityGender ? entityGender === 'f' : esFemenino(entityName);
  const nuevo = femenino ? 'Nueva' : 'Nuevo';
  const [rowsInternas, setRowsInternas] = useState(data);

  // Modo controlado: si llegan `rows`, mandan esas y los cambios salen por
  // `onRowsChange`; si no, la tabla administra su propia copia.
  const rows = rowsExternas ?? rowsInternas;
  const setRows = (actualizar) =>
    onRowsChange
      ? onRowsChange(typeof actualizar === 'function' ? actualizar(rows) : actualizar)
      : setRowsInternas(actualizar);
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [page, setPage] = useState(1);
  // { mode: 'create' | 'edit' | 'view' | 'delete', row }
  const [dialog, setDialog] = useState(null);

  const sections = useMemo(
    () => formSections ?? fallbackSections(columns),
    [formSections, columns],
  );

  const filterDefs = useMemo(
    () =>
      filters.map((f) => ({
        ...f,
        options: f.options ?? [...new Set(rows.map((r) => r[f.key]).filter(Boolean))],
      })),
    [filters, rows],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesQuery = !q || Object.values(row).some((v) => String(v).toLowerCase().includes(q));
      // Cada filtro guarda un arreglo: sin marcas no filtra, y con varias
      // basta con que la fila coincida con una de ellas.
      const matchesFilters = Object.entries(activeFilters).every(
        ([k, v]) => !v?.length || v.includes(String(row[k])),
      );
      return matchesQuery && matchesFilters;
    });
  }, [rows, query, activeFilters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const from = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, filtered.length);

  const handleCreate = (values) => {
    const row = normalize ? normalize(values) : values;
    setRows((prev) => [...prev, { ...row, id: nextId(prev) }]);
    setPage(Math.max(1, Math.ceil((rows.length + 1) / PAGE_SIZE)));
  };

  const handleEdit = (values) => {
    const row = normalize ? normalize(values) : values;
    setRows((prev) => prev.map((r) => (r.id === dialog.row.id ? { ...r, ...row } : r)));
  };

  const handleDelete = () => {
    setRows((prev) => prev.filter((r) => r.id !== dialog.row.id));
  };

  /** Cambio de estado hecho directamente sobre la fila del listado. */
  const handleStatusChange = (id, value) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [statusKey]: value } : r)));
  };

  /** Permite a una celda personalizada actualizar su propia fila. */
  const updateRow = (id, patch) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {title && <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">{title}</h1>}
        {toolbar && (
          <div className="flex items-center gap-2">
            {exportable && (
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-brand-navy-800 dark:text-slate-200 dark:hover:bg-brand-navy-700">
                <Download size={15} /> Exportar
              </button>
            )}
            <button
              onClick={() => setDialog({ mode: 'create' })}
              className="ml-pulsable inline-flex items-center gap-2 rounded-lg bg-amber-400 px-3.5 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-300"
            >
              <Plus size={15} /> {newLabel}
            </button>
          </div>
        )}
      </div>

      <div className="mt-5 rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-brand-navy-800">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 p-4 dark:border-white/10">
          <div className="relative min-w-[180px] flex-1">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Buscar..."
              className={`${INPUT} ${BORDER_OK} py-2 pl-9 pr-3`}
            />
          </div>
          {filterDefs.map((f) => (
            <Dropdown
              key={f.key}
              label={f.label}
              multiple
              value={activeFilters[f.key] ?? []}
              options={f.options}
              onChange={(valores) => {
                setActiveFilters((a) => ({ ...a, [f.key]: valores }));
                setPage(1);
              }}
              icon={<SlidersHorizontal size={13} className="shrink-0 opacity-70" />}
            />
          ))}
          <button
            onClick={() => {
              setQuery('');
              setActiveFilters({});
            }}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-brand-navy-700"
            aria-label="Refrescar"
          >
            <RefreshCw size={14} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                {columns.map((col) => (
                  <th key={col.key} className="whitespace-nowrap px-5 py-3">
                    {col.label}
                  </th>
                ))}
                <th className="px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-slate-100 text-slate-600 transition-colors hover:bg-slate-50 dark:border-white/5 dark:text-slate-300 dark:hover:bg-white/[0.03]"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="whitespace-nowrap px-5 py-3.5">
                      {col.key === statusKey && statusVariant === 'switch' ? (
                        <StatusSwitch
                          value={row[col.key]}
                          options={statusOptions}
                          onChange={(v) => handleStatusChange(row.id, v)}
                        />
                      ) : col.key === statusKey ? (
                        <StatusSelect
                          value={row[col.key]}
                          options={statusOptions}
                          flow={statusFlow}
                          onChange={(v) => handleStatusChange(row.id, v)}
                        />
                      ) : col.render ? (
                        col.render(row, { update: (patch) => updateRow(row.id, patch) })
                      ) : (
                        row[col.key]
                      )}
                    </td>
                  ))}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1.5 text-slate-400">
                      {rowActions?.(row, { update: (patch) => updateRow(row.id, patch) })}
                      {canView && (
                        <button
                          onClick={() => setDialog({ mode: 'view', row })}
                          className="rounded p-1 hover:text-slate-700 dark:hover:text-slate-200"
                          aria-label="Ver"
                        >
                          <Eye size={15} />
                        </button>
                      )}
                      {!readOnly && (
                        <>
                          {canEdit && (
                            <button
                              onClick={() => setDialog({ mode: 'edit', row })}
                              className="rounded p-1 hover:text-slate-700 dark:hover:text-slate-200"
                              aria-label="Editar"
                            >
                              <Pencil size={15} />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => setDialog({ mode: 'delete', row })}
                              className="rounded p-1 hover:text-red-500"
                              aria-label="Eliminar"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="px-5 py-10 text-center text-sm text-slate-400">
                    Sin resultados encontrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400">
          <span>
            Mostrando {from}-{to} de {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-white/10"
            >
              ‹
            </button>
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-400 font-semibold text-slate-900">
              {page}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-white/10"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {dialog?.mode === 'create' && createModal
        ? createModal({ onSubmit: handleCreate, onClose: () => setDialog(null) })
        : null}

      {dialog?.mode === 'create' && !createModal && (
        <FormModal
          mode="create"
          title={`${nuevo} ${entityName}`}
          subtitle="Completa los campos marcados con * para registrar."
          sections={sections}
          validate={formValidate}
          onSubmit={handleCreate}
          onClose={() => setDialog(null)}
        />
      )}

      {dialog?.mode === 'edit' && (
        <FormModal
          mode="edit"
          title={`Editar ${entityName}`}
          subtitle={dialog.row.id}
          sections={sections}
          initialValues={dialog.row}
          validate={formValidate}
          onSubmit={handleEdit}
          onClose={() => setDialog(null)}
        />
      )}

      {dialog?.mode === 'view' && (
        <FormModal
          mode="view"
          title={`Detalle de ${femenino ? 'la' : 'el'} ${entityName}`}
          subtitle={dialog.row.id}
          sections={sections}
          initialValues={dialog.row}
          onClose={() => setDialog(null)}
        />
      )}

      {dialog?.mode === 'delete' && (
        <ConfirmDialog
          record={{
            title: dialog.row[titleKey] ?? dialog.row.id,
            subtitle: dialog.row[titleKey] ? dialog.row.id : null,
          }}
          onConfirm={handleDelete}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  );
}
