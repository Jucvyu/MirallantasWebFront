import PageHeader from '../../../components/base/PageHeader';
import DataTable from '../../../components/base/DataTable';
import { clientes, entregas, estadosEntrega, recentOrders } from '../../../data/mockData';

const columns = [
  { key: 'id', label: 'Nº Entrega' },
  { key: 'pedido', label: 'Pedido' },
  { key: 'cliente', label: 'Cliente' },
  { key: 'estado', label: 'Estado' },
];

// Tabla `entrega`: id_cotizacion, direccion_entrega, fecha_programada,
// fecha_entrega, evidencia_entrega, id_estado, motivo_cancelacion.
const formSections = [
  {
    title: 'Datos de la entrega',
    fields: [
      {
        key: 'pedido',
        label: 'Cotización / pedido',
        type: 'select',
        required: true,
        options: recentOrders.map((o) => o.id),
      },
      { key: 'cliente', label: 'Cliente', type: 'select', required: true, options: clientes.map((c) => c.nombre) },
      {
        key: 'direccion',
        label: 'Dirección de entrega',
        span: 2,
        required: true,
        placeholder: 'Cra 30 #25-90, Bogotá',
      },
    ],
  },
  {
    title: 'Programación y cierre',
    fields: [
      { key: 'fechaProgramada', label: 'Fecha programada', type: 'date', required: true },
      { key: 'fechaEntrega', label: 'Fecha de entrega', type: 'date' },
      { key: 'estado', label: 'Estado', type: 'select', required: true, options: estadosEntrega },
      {
        key: 'motivoCancelacion',
        label: 'Motivo de cancelación',
        placeholder: 'Solo si la entrega se cancela',
      },
      { key: 'evidencia', label: 'Evidencia de entrega', type: 'image', span: 2 },
    ],
  },
];

export default function EntregasPage() {
  return (
    <div>
      <PageHeader crumbs={['Inicio', 'Entregas']} />
      <DataTable
        title="Entregas"
        columns={columns}
        data={entregas}
        statusKey="estado"
        newLabel="Nueva entrega"
        formSections={formSections}
        entityName="entrega"
        statusOptions={estadosEntrega}
        filters={[{ key: 'estado', label: 'Estado', options: estadosEntrega }]}
        titleKey="cliente"
      />
    </div>
  );
}
