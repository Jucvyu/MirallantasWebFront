import { useState } from 'react';
import { Eye, Receipt } from 'lucide-react';
import PageHeader from '../../../components/base/PageHeader';
import DataTable from '../../../components/base/DataTable';
import {
  clientes,
  cotizaciones,
  estadosCotizacion,
  ESTADO_COTIZACION_COMPLETADA,
  FLUJO_ESTADOS_COTIZACION,
  estadosEntrega,
  metodosPago,
  proveedores,
} from '../../../data/mockData';
import EstadoEntrega from '../shared/EstadoEntrega';
import NuevoPedidoModal from './NuevoPedidoModal';
import TotalCotizacion from './TotalCotizacion';
import ComprobanteVentaModal from '../../shared/ComprobanteVentaModal';
import DetalleCotizacionModal from '../../shared/DetalleCotizacionModal';

// Cotización-pedido: la solicitud que arma el cliente y que el asesor
// valora. Al pasar a "Completada" genera la venta. El estado de entrega
// vive aquí, ya que el módulo de entregas se retiró.
const columns = [
  { key: 'id', label: 'Nº Cotización' },
  { key: 'cliente', label: 'Cliente' },
  { key: 'proveedor', label: 'Proveedor' },
  { key: 'fecha', label: 'Fecha' },
  { key: 'metodoPago', label: 'Método de pago' },
  {
    key: 'total',
    label: 'Total',
    render: (row, { update }) => <TotalCotizacion row={row} update={update} />,
  },
  { key: 'estado', label: 'Estado' },
  {
    key: 'estadoEntrega',
    label: 'Entrega',
    render: (row, { update }) => <EstadoEntrega row={row} update={update} />,
  },
];

const formSections = [
  {
    title: 'Datos de la cotización',
    fields: [
      {
        key: 'cliente',
        label: 'Cliente',
        type: 'select',
        required: true,
        options: clientes.filter((c) => c.estado === 'Activo').map((c) => c.nombreCompleto),
        emptyLabel: 'cliente',
      },
      {
        key: 'proveedor',
        label: 'Proveedor',
        type: 'select',
        options: proveedores.filter((p) => p.estado === 'Activo').map((p) => p.nombreRazonSocial),
        emptyLabel: 'proveedor',
        hint: 'Proveedor que abastece los productos de la cotización.',
      },
      { key: 'fecha', label: 'Fecha', type: 'date', required: true },
      { key: 'metodoPago', label: 'Método de pago', type: 'select', options: metodosPago },
      { key: 'estado', label: 'Estado', type: 'select', options: estadosCotizacion, only: ['edit', 'view'] },
    ],
  },
  {
    title: 'Entrega',
    fields: [
      { key: 'direccionEntrega', label: 'Dirección de despacho', span: 2, required: true },
      { key: 'estadoEntrega', label: 'Estado de la entrega', type: 'select', options: estadosEntrega, only: ['edit', 'view'] },
      {
        key: 'motivoCancelacion',
        label: 'Motivo de la cancelación',
        type: 'textarea',
        span: 2,
        only: ['edit', 'view'],
        hint: 'Obligatorio si la entrega se cancela.',
      },
    ],
  },
];

export default function PedidosCotizacionPage() {
  const [comprobanteDe, setComprobanteDe] = useState(null);
  const [detalleDe, setDetalleDe] = useState(null);

  return (
    <div>
      <PageHeader crumbs={['Inicio', 'Pedidos-Cotización']} />
      <DataTable
        title="Pedidos-Cotización"
        columns={columns}
        data={cotizaciones}
        statusKey="estado"
        newLabel="Nueva cotización"
        formSections={formSections}
        entityName="cotización"
        titleKey="cliente"
        canView={false}
        normalize={(values) => ({
          estado: 'Pendiente',
          estadoEntrega: 'Pendiente',
          ...values,
        })}
        statusOptions={estadosCotizacion}
        statusFlow={FLUJO_ESTADOS_COTIZACION}
        filters={[
          { key: 'estado', label: 'Estado', options: estadosCotizacion },
          { key: 'estadoEntrega', label: 'Entrega', options: estadosEntrega },
          { key: 'metodoPago', label: 'Pago', options: metodosPago },
        ]}
        createModal={({ onSubmit, onClose }) => (
          <NuevoPedidoModal onSubmit={onSubmit} onClose={onClose} />
        )}
        rowActions={(row) => (
          <>
            <button
              onClick={() => setDetalleDe(row)}
              className="rounded p-1 text-slate-400 hover:text-amber-500"
              aria-label={`Ver el detalle de ${row.id}`}
              title="Ver productos y servicios"
            >
              <Eye size={15} />
            </button>
            {/* El comprobante solo se emite con la cotización cerrada */}
            {row.estado === ESTADO_COTIZACION_COMPLETADA && (
              <button
                onClick={() => setComprobanteDe(row)}
                className="rounded p-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                aria-label={`Generar comprobante de ${row.id}`}
                title="Generar comprobante de venta"
              >
                <Receipt size={15} />
              </button>
            )}
          </>
        )}
      />

      {detalleDe && (
        <DetalleCotizacionModal cotizacion={detalleDe} onClose={() => setDetalleDe(null)} />
      )}
      {comprobanteDe && (
        <ComprobanteVentaModal venta={comprobanteDe} onClose={() => setComprobanteDe(null)} />
      )}
    </div>
  );
}
