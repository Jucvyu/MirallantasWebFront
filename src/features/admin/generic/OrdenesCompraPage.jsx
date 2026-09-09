import PageHeader from '../../../components/base/PageHeader';
import DataTable from '../../../components/base/DataTable';
import { estadosOrdenCompra, ordenesCompra, proveedores, recentOrders } from '../../../data/mockData';

const columns = [
  { key: 'id', label: 'Nº Orden' },
  { key: 'proveedor', label: 'Proveedor' },
  { key: 'total', label: 'Total' },
  { key: 'estado', label: 'Estado' },
];

// Tabla `orden_compra`: id_proveedor, id_cotizacion, fecha_orden,
// fecha_recibido, valor_total, id_estado. Solo nace de líneas de producto
// (orden_compra_detalle → cotizacion_detalle_producto).
const formSections = [
  {
    title: 'Datos de la orden',
    fields: [
      {
        key: 'proveedor',
        label: 'Proveedor',
        type: 'select',
        required: true,
        options: proveedores.map((p) => p.nombre),
      },
      {
        key: 'cotizacion',
        label: 'Cotización de origen',
        type: 'select',
        options: recentOrders.map((o) => o.id),
        hint: 'Solo las líneas de producto pasan a orden de compra.',
      },
      { key: 'fechaOrden', label: 'Fecha de la orden', type: 'date', required: true },
      { key: 'fechaRecibido', label: 'Fecha de recibido', type: 'date' },
    ],
  },
  {
    title: 'Valores y estado',
    fields: [
      { key: 'total', label: 'Valor total (COP)', type: 'money', required: true, placeholder: '12.400.000' },
      { key: 'estado', label: 'Estado', type: 'select', required: true, options: estadosOrdenCompra },
    ],
  },
];

export default function OrdenesCompraPage() {
  return (
    <div>
      <PageHeader crumbs={['Inicio', 'Órd. de Compra']} />
      <DataTable
        title="Órdenes de Compra"
        columns={columns}
        data={ordenesCompra}
        statusKey="estado"
        newLabel="Nueva orden"
        formSections={formSections}
        entityName="orden de compra"
        titleKey="proveedor"
        statusOptions={estadosOrdenCompra}
        filters={[{ key: 'estado', label: 'Estado', options: estadosOrdenCompra }]}
      />
    </div>
  );
}
