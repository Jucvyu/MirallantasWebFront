import PageHeader from '../../../components/base/PageHeader';
import DataTable from '../../../components/base/DataTable';
import { estadosActivo, proveedores, tiposDocumento } from '../../../data/mockData';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'nombre', label: 'Nombre / Razón Social' },
  { key: 'tipoDoc', label: 'Tipo Doc.' },
  { key: 'numDoc', label: 'Número Doc.' },
  { key: 'correo', label: 'Correo' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'direccion', label: 'Dirección' },
  { key: 'estado', label: 'Estado' },
];

// Tabla `proveedor`: tipo_documento, numero_documento, nombre, direccion,
// email, telefono.
const formSections = [
  {
    title: 'Identificación',
    fields: [
      {
        key: 'nombre',
        label: 'Nombre / Razón social',
        required: true,
        span: 2,
        placeholder: 'Michelin Colombia SAS',
      },
      { key: 'tipoDoc', label: 'Tipo de documento', type: 'select', required: true, options: tiposDocumento },
      { key: 'numDoc', label: 'Número de documento', required: true, placeholder: '860.345.678-9' },
    ],
  },
  {
    title: 'Contacto',
    fields: [
      { key: 'correo', label: 'Correo electrónico', type: 'email', placeholder: 'ventas@proveedor.co' },
      { key: 'telefono', label: 'Teléfono', type: 'tel', placeholder: '6017891234' },
      { key: 'direccion', label: 'Dirección', span: 2, placeholder: 'Cra 7 #71-52, Bogotá' },
      { key: 'estado', label: 'Estado', type: 'select', options: estadosActivo },
    ],
  },
];

export default function ProveedoresPage() {
  return (
    <div>
      <PageHeader crumbs={['Inicio', 'Proveedores']} />
      <DataTable
        title="Proveedores"
        columns={columns}
        data={proveedores}
        formSections={formSections}
        entityName="proveedor"
        statusKey="estado"
        statusOptions={estadosActivo}
        statusVariant="switch"
        filters={[{ key: 'estado', label: 'Estado', options: estadosActivo }]}
      />
    </div>
  );
}
