import PageHeader from '../../../components/base/PageHeader';
import DataTable from '../../../components/base/DataTable';
import {
  clientes,
  estadosOrdenReencauche,
  reencauches,
  servicios,
  terceros,
} from '../../../data/mockData';

const columns = [
  { key: 'id', label: 'Nº Reencauche' },
  { key: 'cliente', label: 'Cliente' },
  { key: 'taller', label: 'Taller' },
  { key: 'estado', label: 'Estado' },
];

// Tabla `orden_reencauche`: id_cotizacion_detalle_servicio, id_tercero,
// id_estado, fecha_recepcion, fecha_inicio, fecha_final, tiempo_estimado,
// garantia. La cantidad de llantas se deriva de la línea de servicio.
const formSections = [
  {
    title: 'Origen de la orden',
    fields: [
      { key: 'cliente', label: 'Cliente', type: 'select', required: true, options: clientes.map((c) => c.nombre) },
      {
        key: 'servicio',
        label: 'Servicio cotizado',
        type: 'select',
        required: true,
        options: servicios.map((s) => s.nombre),
        hint: 'La orden nace de una línea de servicio de la cotización.',
      },
      { key: 'taller', label: 'Taller (tercero)', type: 'select', required: true, options: terceros.map((t) => t.nombre) },
      { key: 'estado', label: 'Estado', type: 'select', required: true, options: estadosOrdenReencauche },
    ],
  },
  {
    title: 'Programación',
    fields: [
      { key: 'fechaRecepcion', label: 'Fecha de recepción', type: 'date' },
      { key: 'fechaInicio', label: 'Fecha de inicio', type: 'date' },
      { key: 'fechaFinal', label: 'Fecha final', type: 'date' },
      { key: 'tiempoEstimado', label: 'Tiempo estimado', placeholder: '9 días' },
      { key: 'garantia', label: 'Garantía', type: 'select', options: ['Sí', 'No'] },
    ],
  },
];

export default function ReencauchePage() {
  return (
    <div>
      <PageHeader crumbs={['Inicio', 'Reencauche']} />
      <DataTable
        title="Servicios de Reencauche"
        columns={columns}
        data={reencauches}
        statusKey="estado"
        newLabel="Nueva solicitud"
        formSections={formSections}
        entityName="orden de reencauche"
        statusOptions={estadosOrdenReencauche}
        filters={[{ key: 'estado', label: 'Estado', options: estadosOrdenReencauche }]}
        titleKey="cliente"
      />
    </div>
  );
}
