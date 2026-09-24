import PageHeader from '../../../components/base/PageHeader';
import DataTable from '../../../components/base/DataTable';
import { estadosActivo, roles, tiposDocumento, usuarios } from '../../../data/mockData';

// Cuentas de acceso al aplicativo. El modelo relacional no incluye la
// tabla `usuario`, pero la ficha la exige para el control de accesos.
const columns = [
  { key: 'id', label: 'ID' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'numeroDocumento', label: 'Documento' },
  { key: 'correo', label: 'Correo' },
  { key: 'rol', label: 'Rol' },
];

const formSections = [
  {
    title: 'Datos personales',
    fields: [
      { key: 'nombre', label: 'Nombre completo', required: true, span: 2 },
      { key: 'tipoDocumento', label: 'Tipo de documento', type: 'select', required: true, options: tiposDocumento },
      { key: 'numeroDocumento', label: 'Número de documento', type: 'number', required: true },
      { key: 'correo', label: 'Correo electrónico', type: 'email', required: true },
      { key: 'telefono', label: 'Teléfono', type: 'tel' },
    ],
  },
  {
    title: 'Acceso al sistema',
    fields: [
      {
        key: 'rol',
        label: 'Rol',
        type: 'select',
        required: true,
        options: roles.map((r) => r.nombre),
        emptyLabel: 'rol',
        hint: 'El rol define a qué módulos entra la cuenta.',
      },
      { key: 'estado', label: 'Estado', type: 'select', options: estadosActivo, only: ['edit', 'view'] },
      {
        key: 'password',
        label: 'Contraseña',
        type: 'password',
        span: 2,
        only: 'create',
        required: true,
        placeholder: 'Mínimo 8 caracteres',
      },
      {
        key: 'password',
        label: 'Nueva contraseña',
        type: 'password',
        span: 2,
        only: 'edit',
        placeholder: 'Déjala vacía para no cambiarla',
      },
    ],
  },
];

/** Las cuentas nuevas entran activas. */
function normalize(values) {
  return { estado: 'Activo', ...values };
}

export default function UsuariosPage() {
  return (
    <div>
      <PageHeader crumbs={['Inicio', 'Usuarios']} />
      <DataTable
        title="Usuarios"
        columns={columns}
        data={usuarios}
        newLabel="Nuevo usuario"
        formSections={formSections}
        entityName="usuario"
        normalize={normalize}
        filters={[
          { key: 'rol', label: 'Rol', options: roles.map((r) => r.nombre) },
          { key: 'estado', label: 'Estado', options: estadosActivo },
        ]}
      />
    </div>
  );
}
