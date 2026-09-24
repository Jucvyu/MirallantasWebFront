import PageHeader from '../../../components/base/PageHeader';
import DataTable from '../../../components/base/DataTable';
import { estadosActivo, terceros, tiposDocumento } from '../../../data/mockData';

// Tabla `tercero`: las reencauchadoras que ejecutan físicamente el
// servicio. En el modelo comparte los mismos campos que proveedor.
const columns = [
  { key: 'id', label: 'ID' },
  { key: 'nombreRazonSocial', label: 'Reencauchadora' },
  { key: 'numeroDocumento', label: 'Documento' },
  { key: 'contacto', label: 'Contacto' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'estado', label: 'Estado' },
];

const formSections = [
  {
    title: 'Identificación',
    fields: [
      { key: 'nombreRazonSocial', label: 'Nombre o razón social', required: true, span: 2 },
      { key: 'tipoDocumento', label: 'Tipo de documento', type: 'select', required: true, options: tiposDocumento },
      { key: 'numeroDocumento', label: 'Número de documento', type: 'number', required: true },
    ],
  },
  {
    title: 'Contacto',
    fields: [
      { key: 'contacto', label: 'Persona de contacto' },
      { key: 'telefono', label: 'Teléfono', type: 'tel', required: true },
      { key: 'correo', label: 'Correo electrónico', type: 'email', required: true },
      { key: 'direccion', label: 'Dirección', span: 2 },
      { key: 'estado', label: 'Estado', type: 'select', options: estadosActivo, only: ['edit', 'view'] },
    ],
  },
];

/** Las reencauchadoras nuevas entran activas. */
function normalize(values) {
  return { estado: 'Activo', ...values };
}

export default function TercerosPage() {
  return (
    <div>
      <PageHeader crumbs={['Inicio', 'Terceros']} />
      <DataTable
        title="Terceros (reencauchadoras)"
        columns={columns}
        data={terceros}
        newLabel="Nuevo tercero"
        formSections={formSections}
        entityName="tercero"
        titleKey="nombreRazonSocial"
        normalize={normalize}
        statusKey="estado"
        statusOptions={estadosActivo}
        statusVariant="switch"
        filters={[{ key: 'estado', label: 'Estado', options: estadosActivo }]}
      />
    </div>
  );
}
