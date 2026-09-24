import { useState } from 'react';
import { Ban, Eye, Receipt } from 'lucide-react';
import PageHeader from '../../../components/base/PageHeader';
import DataTable from '../../../components/base/DataTable';
import ConfirmDialog from '../../../components/base/ConfirmDialog';
import {
  clientes,
  CUOTA_INICIAL_CREDITO,
  estadosEntrega,
  estadosVenta,
  FLUJO_ESTADOS_VENTA,
  metodosPago,
  proveedores,
  terceros,
  ventas,
} from '../../../data/mockData';
import EstadoEntrega from '../shared/EstadoEntrega';
import ComprobanteVentaModal from '../../shared/ComprobanteVentaModal';
import DetalleCotizacionModal from '../../shared/DetalleCotizacionModal';

/** "$ 1.968.000" → 1968000 */
const aNumero = (v) => Number(String(v ?? '').replace(/\D/g, '')) || 0;

/**
 * La empresa exige que la primera cuota cubra al menos la mitad del total
 * cuando la venta se financia.
 */
function validarCuotaInicial(values) {
  if (values.metodoPago !== 'Crédito') return {};
  const total = aNumero(values.total);
  const inicial = aNumero(values.cuotaInicial);
  const minimo = Math.round(total * CUOTA_INICIAL_CREDITO);
  if (!total) return {};
  if (inicial < minimo) {
    return {
      cuotaInicial: `La primera cuota debe ser de al menos $ ${minimo.toLocaleString('es-CO')} (50% del total).`,
    };
  }
  return {};
}

// Tabla `venta`: id_cliente, id_tercero, estado, fecha, total, interes,
// cuota_inicial. La venta nace sola cuando la cotización llega a
// "Completada", y también puede registrarse directamente.
const columns = [
  { key: 'id', label: 'Nº Venta' },
  { key: 'cliente', label: 'Cliente' },
  { key: 'proveedor', label: 'Proveedor' },
  { key: 'fecha', label: 'Fecha' },
  { key: 'metodoPago', label: 'Método de pago' },
  { key: 'cotizacion', label: 'Cotización', render: (row) => row.cotizacion || 'Venta directa' },
  { key: 'total', label: 'Total' },
  { key: 'estado', label: 'Estado' },
  {
    key: 'estadoEntrega',
    label: 'Entrega',
    render: (row, { update }) => <EstadoEntrega row={row} update={update} />,
  },
];

const formSections = [
  {
    title: 'Datos de la venta',
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
        hint: 'Proveedor que surtió los productos vendidos.',
      },
      { key: 'fecha', label: 'Fecha', type: 'date', required: true },
      { key: 'metodoPago', label: 'Método de pago', type: 'select', required: true, options: metodosPago },
      {
        key: 'tercero',
        label: 'Tercero (reencauchadora)',
        type: 'select',
        options: terceros.filter((t) => t.estado === 'Activo').map((t) => t.nombreRazonSocial),
        hint: 'Solo si la venta incluye un servicio de reencauche.',
      },
      { key: 'estado', label: 'Estado', type: 'select', options: estadosVenta, only: ['edit', 'view'] },
      { key: 'estadoEntrega', label: 'Estado de la entrega', type: 'select', options: estadosEntrega, only: ['edit', 'view'] },
    ],
  },
  {
    title: 'Valores',
    fields: [
      { key: 'total', label: 'Valor total (COP)', type: 'money', required: true, placeholder: '1.968.000' },
      { key: 'interes', label: 'Interés (COP)', type: 'money', placeholder: '0' },
      {
        key: 'cuotaInicial',
        label: 'Cuota inicial (COP)',
        type: 'money',
        placeholder: '0',
        hint: 'A crédito, no puede ser menor al 50% del total.',
      },
    ],
  },
  {
    title: 'Soporte del pago',
    fields: [
      {
        key: 'comprobantePago',
        label: 'Comprobante de pago',
        type: 'image',
        span: 2,
        placeholder: 'Sube el pantallazo de la consignación o el recibo',
        hint: 'Queda adjunto a la venta como respaldo del pago recibido.',
      },
    ],
  },
];

/** Una venta registrada a mano nace pendiente y sin financiación. */
function normalize(values) {
  return {
    estado: 'Pendiente',
    estadoEntrega: 'Pendiente',
    cotizacion: '',
    interes: '$ 0',
    cuotaInicial: '$ 0',
    ...values,
  };
}

export default function VentasPage() {
  const [comprobanteDe, setComprobanteDe] = useState(null);
  const [detalleDe, setDetalleDe] = useState(null);
  // Venta que se va a anular, a la espera de la confirmación
  const [anulando, setAnulando] = useState(null);

  return (
    <div>
      <PageHeader crumbs={['Inicio', 'Ventas']} />
      <DataTable
        title="Ventas"
        columns={columns}
        data={ventas}
        statusKey="estado"
        newLabel="Nueva venta"
        formSections={formSections}
        entityName="venta"
        titleKey="cliente"
        normalize={normalize}
        statusOptions={estadosVenta}
        statusFlow={FLUJO_ESTADOS_VENTA}
        formValidate={validarCuotaInicial}
        filters={[
          { key: 'estado', label: 'Estado', options: estadosVenta },
          { key: 'estadoEntrega', label: 'Entrega', options: estadosEntrega },
          { key: 'metodoPago', label: 'Pago', options: metodosPago },
          { key: 'cliente', label: 'Cliente' },
        ]}
        rowActions={(row, { update }) => (
          <>
            {/* Una venta no se borra: se anula, y queda en el historial */}
            {row.estado !== 'Anulada' && (
              <button
                onClick={() => setAnulando({ row, update })}
                className="rounded p-1 text-red-500 hover:text-red-600"
                aria-label={`Anular ${row.id}`}
                title="Anular la venta"
              >
                <Ban size={15} />
              </button>
            )}
            <button
              onClick={() => setDetalleDe(row)}
              className="rounded p-1 text-slate-400 hover:text-amber-500"
              aria-label={`Ver el detalle de ${row.id}`}
              title="Ver productos y servicios"
            >
              <Eye size={15} />
            </button>
            {row.estado === 'Completada' && (
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

      {anulando && (
        <ConfirmDialog
          title="¿Anular la venta?"
          message="La venta queda registrada como anulada y deja de contar para los reportes."
          confirmLabel="Anular venta"
          record={{ title: anulando.row.id, subtitle: `${anulando.row.cliente} · ${anulando.row.total}` }}
          onConfirm={() => anulando.update({ estado: 'Anulada' })}
          onClose={() => setAnulando(null)}
        />
      )}
    </div>
  );
}
