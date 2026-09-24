import PageHeader from '../../../components/base/PageHeader';
import DataTable from '../../../components/base/DataTable';
import { categorias, estadosActivo, productos } from '../../../data/mockData';

// Tabla `categoria`: nombre, descripcion, estado. El color no está en el
// modelo: es una ayuda visual que se refleja en el catálogo del cliente.
const columns = [
  { key: 'id', label: 'ID' },
  {
    key: 'nombre',
    label: 'Categoría',
    render: (row) => (
      <span className="flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-black/10 dark:ring-white/20"
          style={{ backgroundColor: row.color ?? '#94A3B8' }}
        />
        {row.nombre}
      </span>
    ),
  },
  { key: 'descripcion', label: 'Descripción' },
  {
    key: 'productos',
    label: 'Productos',
    render: (row) => productos.filter((p) => p.categoria === row.nombre).length,
  },
];

const formSections = [
  {
    title: 'Datos de la categoría',
    fields: [
      { key: 'nombre', label: 'Nombre', required: true, span: 2, placeholder: 'Turismo' },
      { key: 'descripcion', label: 'Descripción', type: 'textarea', span: 2 },
      { key: 'estado', label: 'Estado', type: 'select', options: estadosActivo, only: ['edit', 'view'] },
    ],
  },
  {
    title: 'Color',
    fields: [
      {
        key: 'color',
        label: 'Color de la categoría',
        type: 'color',
        span: 2,
        hint: 'Es el color con el que se marca la categoría en el catálogo del cliente.',
      },
    ],
  },
];

/** Las categorías nuevas entran activas y con el ámbar de la marca. */
function normalize(values) {
  return { estado: 'Activo', color: '#FBBF24', ...values };
}

export default function CategoriasPage() {
  return (
    <div>
      <PageHeader crumbs={['Inicio', 'Categorías']} />
      <DataTable
        title="Categorías"
        columns={columns}
        data={categorias}
        newLabel="Nueva categoría"
        formSections={formSections}
        entityName="categoría"
        normalize={normalize}
        exportable={false}
        canView={false}
        canDelete={false}
        filters={[{ key: 'estado', label: 'Estado', options: estadosActivo }]}
      />
    </div>
  );
}
