import PageHeader from '../../../components/base/PageHeader';
import DataTable from '../../../components/base/DataTable';
import { estadosActivo, terceros } from '../../../data/mockData';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'nit', label: 'NIT' },
  { key: 'contacto', label: 'Contacto' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'correo', label: 'Correo' },
  { key: 'direccion', label: 'Dirección' },
  { key: 'estado', label: 'Estado' },
];

// Tabla `tercero`: nombre, nit, contacto, telefono, email, direccion.
const formSections = [
  {
    title: 'Identificación',
    fields: [
      { key: 'nombre', label: 'Nombre / Razón social', required: true, span: 2, placeholder: 'Seguros Bolívar SA' },
      { key: 'nit', label: 'NIT', required: true, span: 2, placeholder: '860.003.128-1' },
    ],
  },
  {
    title: 'Contacto',
    fields: [
      { key: 'contacto', label: 'Persona de contacto', placeholder: 'Sandra Ruiz' },
      { key: 'telefono', label: 'Teléfono', type: 'tel', placeholder: '6013456789' },
      { key: 'correo', label: 'Correo electrónico', type: 'email', placeholder: 'contacto@tercero.com' },
      { key: 'direccion', label: 'Dirección', placeholder: 'Cra 7 #32-10, Bogotá' },
      { key: 'estado', label: 'Estado', type: 'select', options: estadosActivo },
    ],
  },
];

export default function TercerosPage() {
  return (
    <div>
      <PageHeader crumbs={['Inicio', 'Terceros']} />
      <DataTable
        title="Terceros"
        columns={columns}
        data={terceros}
        formSections={formSections}
        entityName="tercero"
        statusKey="estado"
        statusOptions={estadosActivo}
        statusVariant="switch"
        filters={[{ key: 'estado', label: 'Estado', options: estadosActivo }]}
      />
    </div>
  );
}
