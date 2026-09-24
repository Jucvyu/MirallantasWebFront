import PageHeader from '../../../components/base/PageHeader';
import DataTable from '../../../components/base/DataTable';
import { estadosActivo, marcas, productos } from '../../../data/mockData';

// En el modelo relacional la marca es un texto dentro de `producto`. Se
// mantiene este catálogo porque los casos de uso piden asociar la marca al
// producto y filtrar por ella, lo que exige una lista controlada.
const columns = [
  { key: 'id', label: 'ID' },
  { key: 'nombre', label: 'Marca' },
  {
    key: 'productos',
    label: 'Productos',
    render: (row) => productos.filter((p) => p.marca === row.nombre).length,
  },
  { key: 'estado', label: 'Estado' },
];

const formSections = [
  {
    title: 'Datos de la marca',
    fields: [
      { key: 'nombre', label: 'Nombre de la marca', required: true, span: 2, placeholder: 'Michelin' },
      { key: 'estado', label: 'Estado', type: 'select', options: estadosActivo, only: ['edit', 'view'] },
    ],
  },
];

/** Las marcas nuevas entran activas. */
function normalize(values) {
  return { estado: 'Activo', ...values };
}

export default function MarcasPage() {
  return (
    <div>
      <PageHeader crumbs={['Inicio', 'Marcas']} />
      <DataTable
        title="Marcas"
        columns={columns}
        data={marcas}
        newLabel="Nueva marca"
        formSections={formSections}
        entityName="marca"
        normalize={normalize}
        statusKey="estado"
        statusOptions={estadosActivo}
        statusVariant="switch"
        filters={[{ key: 'estado', label: 'Estado', options: estadosActivo }]}
      />
    </div>
  );
}
