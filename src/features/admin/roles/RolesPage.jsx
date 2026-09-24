import PageHeader from '../../../components/base/PageHeader';
import DataTable from '../../../components/base/DataTable';
import { estadosActivo, modulosPermiso, roles } from '../../../data/mockData';

// Roles y permisos. Al crear un rol se marcan los módulos a los que
// tendrá acceso, tal como pide el proceso de configuración de la ficha.
const columns = [
  { key: 'id', label: 'ID' },
  { key: 'nombre', label: 'Rol' },
  { key: 'descripcion', label: 'Descripción' },
  {
    key: 'permisos',
    label: 'Permisos',
    render: (row) => `${String(row.permisos ?? '').split(',').filter(Boolean).length} módulos`,
  },
];

const formSections = [
  {
    title: 'Datos del rol',
    fields: [
      { key: 'nombre', label: 'Nombre del rol', required: true, span: 2, placeholder: 'Asesor de ventas' },
      { key: 'descripcion', label: 'Descripción', type: 'textarea', span: 2 },
      { key: 'estado', label: 'Estado', type: 'select', options: estadosActivo, only: ['edit', 'view'] },
    ],
  },
  {
    title: 'Permisos',
    fields: [
      {
        key: 'permisos',
        label: 'Módulos a los que accede',
        type: 'checkboxes',
        span: 2,
        required: true,
        options: modulosPermiso,
        hint: 'El rol solo verá en el menú los módulos marcados.',
      },
    ],
  },
];

/** Los roles nuevos entran activos. */
function normalize(values) {
  return { estado: 'Activo', ...values };
}

export default function RolesPage() {
  return (
    <div>
      <PageHeader crumbs={['Inicio', 'Roles']} />
      <DataTable
        title="Roles y permisos"
        columns={columns}
        data={roles}
        newLabel="Nuevo rol"
        formSections={formSections}
        entityName="rol"
        normalize={normalize}
        filters={[{ key: 'estado', label: 'Estado', options: estadosActivo }]}
      />
    </div>
  );
}
