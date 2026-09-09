import PageHeader from '../../../components/base/PageHeader';
import DataTable from '../../../components/base/DataTable';
import { categorias } from '../../../data/mockData';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'productos', label: 'Nº Productos' },
];

// Tabla `categoria`: nombre, descripcion.
const formSections = [
  {
    title: 'Datos de la categoría',
    fields: [
      { key: 'nombre', label: 'Nombre', required: true, span: 2, placeholder: 'SUV / Camioneta' },
      {
        key: 'descripcion',
        label: 'Descripción',
        type: 'textarea',
        span: 2,
        placeholder: 'Qué tipo de llantas agrupa esta categoría...',
      },
    ],
  },
];

/** El conteo de productos lo calcula la BD; en el prototipo arranca en 0. */
function normalize(values) {
  return { productos: 0, ...values };
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
      />
    </div>
  );
}
