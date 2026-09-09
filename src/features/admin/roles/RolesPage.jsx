import PageHeader from '../../../components/base/PageHeader';
import DataTable from '../../../components/base/DataTable';
import { modulosPermiso, roles } from '../../../data/mockData';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'permisos', label: 'Permisos' },
];

// Tablas `rol` (nombre_rol) y `rol_permiso` → `permiso` (modulo).
const formSections = [
  {
    title: 'Rol',
    fields: [
      { key: 'nombre', label: 'Nombre del rol', required: true, span: 2, placeholder: 'Vendedor' },
    ],
  },
  {
    title: 'Permisos por módulo',
    fields: [
      {
        key: 'modulos',
        label: 'Módulos con acceso',
        type: 'checkboxes',
        span: 2,
        options: modulosPermiso,
        hint: 'Cada módulo seleccionado crea una fila en rol_permiso.',
      },
    ],
  },
];

/** `permisos` del listado es el conteo de módulos seleccionados. */
function normalize(values) {
  const modulos = String(values.modulos ?? '')
    .split(',')
    .map((m) => m.trim())
    .filter(Boolean);
  return { ...values, permisos: modulos.length };
}

export default function RolesPage() {
  return (
    <div>
      <PageHeader crumbs={['Inicio', 'Roles']} />
      <DataTable
        title="Roles y permisos"
        columns={columns}
        data={roles}
        formSections={formSections}
        entityName="rol"
        normalize={normalize}
      />
    </div>
  );
}
