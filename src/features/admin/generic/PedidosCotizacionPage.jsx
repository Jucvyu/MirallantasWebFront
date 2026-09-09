import PageHeader from '../../../components/base/PageHeader';
import DataTable from '../../../components/base/DataTable';
import { clientes, estadosCotizacion, metodosPago, proveedores, recentOrders } from '../../../data/mockData';
import NuevoPedidoModal from './NuevoPedidoModal';
import TotalCotizacion from './TotalCotizacion';

const columns = [
  { key: 'id', label: 'Nº Pedido' },
  { key: 'cliente', label: 'Cliente' },
  { key: 'metodoPago', label: 'Método de pago' },
  // El total se edita y confirma desde la propia fila
  {
    key: 'total',
    label: 'Total',
    render: (row, { update }) => <TotalCotizacion row={row} update={update} />,
  },
  { key: 'estado', label: 'Estado' },
];

// Tabla `cotizacion_pedido`: id_cliente, id_proveedor, id_metodo_pago,
// fecha, url_recibo, id_estado. El proveedor se fija por cotización
// completa (todas las líneas salen del mismo proveedor, a precio fijo).
const formSections = [
  {
    title: 'Datos de la cotización',
    fields: [
      { key: 'cliente', label: 'Cliente', type: 'select', required: true, options: clientes.map((c) => c.nombre) },
      {
        key: 'proveedor',
        label: 'Proveedor',
        type: 'select',
        required: true,
        options: proveedores.map((p) => p.nombre),
        hint: 'Todas las líneas de la cotización salen de este proveedor.',
      },
      { key: 'fecha', label: 'Fecha', type: 'date', required: true },
      { key: 'metodoPago', label: 'Método de pago', type: 'select', options: metodosPago },
    ],
  },
  {
    title: 'Cierre',
    fields: [
      { key: 'estado', label: 'Estado', type: 'select', required: true, options: estadosCotizacion },
      {
        key: 'urlRecibo',
        label: 'Recibo del proveedor',
        type: 'image',
        span: 2,
        placeholder: 'Subir el comprobante recibido por FTP',
      },
    ],
  },
];

export default function PedidosCotizacionPage() {
  return (
    <div>
      <PageHeader crumbs={['Inicio', 'Pedidos-Cotización']} />
      <DataTable
        title="Pedidos-Cotización"
        columns={columns}
        data={recentOrders}
        statusKey="estado"
        newLabel="Nuevo pedido"
        formSections={formSections}
        entityName="pedido"
        titleKey="cliente"
        statusOptions={estadosCotizacion}
        filters={[
          { key: 'estado', label: 'Estado', options: estadosCotizacion },
          { key: 'metodoPago', label: 'Pago', options: metodosPago },
        ]}
        createModal={({ onSubmit, onClose }) => (
          <NuevoPedidoModal onSubmit={onSubmit} onClose={onClose} />
        )}
      />
    </div>
  );
}
