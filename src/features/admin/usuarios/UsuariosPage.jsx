import PageHeader from '../../../components/base/PageHeader';
import DataTable from '../../../components/base/DataTable';
import { roles, tiposDocumento, usuarios } from '../../../data/mockData';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'tipoDoc', label: 'Tipo Doc.' },
  { key: 'numDoc', label: 'Número Doc.' },
  { key: 'correo', label: 'Correo' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'rol', label: 'Rol' },
];

// Tabla `usuario`: tipo_documento, numero_documento, nombre_completo,
// email, telefono, password_hash, activo, id_rol.
const formSections = [
  {
    title: 'Datos personales',
    fields: [
      { key: 'nombre', label: 'Nombre completo', required: true, span: 2, placeholder: 'Carlos Mendoza' },
      { key: 'tipoDoc', label: 'Tipo de documento', type: 'select', required: true, options: tiposDocumento },
      { key: 'numDoc', label: 'Número de documento', required: true, placeholder: '79.456.123' },
      { key: 'correo', label: 'Correo electrónico', type: 'email', required: true, placeholder: 'user@mirallantas.com' },
      { key: 'telefono', label: 'Teléfono', type: 'tel', placeholder: '3001112233' },
    ],
  },
  {
    title: 'Acceso al sistema',
    fields: [
      { key: 'rol', label: 'Rol', type: 'select', required: true, options: roles.map((r) => r.nombre) },
      { key: 'password', label: 'Contraseña', type: 'password', required: true, only: 'create', placeholder: '••••••••' },
      {
        key: 'passwordConfirm',
        label: 'Confirmar contraseña',
        type: 'password',
        required: true,
        only: 'create',
        placeholder: '••••••••',
      },
    ],
  },
];

export default function UsuariosPage() {
  return (
    <div>
      <PageHeader crumbs={['Inicio', 'Usuarios']} />
      <DataTable
        title="Usuarios del sistema"
        columns={columns}
        data={usuarios}
        formSections={formSections}
        entityName="usuario"
        filters={[{ key: 'rol', label: 'Rol', options: roles.map((r) => r.nombre) }]}
      />
    </div>
  );
}
