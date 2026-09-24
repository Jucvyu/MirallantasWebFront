import { useState } from 'react';
import { Ban } from 'lucide-react';
import PageHeader from '../../../components/base/PageHeader';
import DataTable from '../../../components/base/DataTable';
import ConfirmDialog from '../../../components/base/ConfirmDialog';
import {
  compras,
  estadosCompra,
  estadosEntrega,
  FLUJO_ESTADOS_COMPRA,
  proveedores,
} from '../../../data/mockData';
import EstadoEntrega from '../shared/EstadoEntrega';
import NuevaCompraModal from './NuevaCompraModal';

// Tabla `compra` (+ `detalle_compra`): id_proveedor, estado, fecha, total.
// Cada compra abastece una cotización aprobada. La recepción de la
// mercancía se sigue con `estadoEntrega`, ya que el módulo de entregas se
// retiró del aplicativo.
const columns = [
  { key: 'id', label: 'Nº Compra' },
  { key: 'proveedor', label: 'Proveedor' },
  { key: 'cotizacion', label: 'Cotización', render: (row) => row.cotizacion || 'Compra directa' },
  { key: 'fecha', label: 'Fecha' },
  { key: 'total', label: 'Total' },
  { key: 'estado', label: 'Estado' },
  {
    key: 'estadoEntrega',
    label: 'Entrega',
    render: (row, { update }) => <EstadoEntrega row={row} update={update} />,
  },
];

// Una compra recibida no se puede editar ni borrar (trazabilidad del
// gasto), así que el formulario solo sirve para consultarla.
const formSections = [
  {
    title: 'Datos de la compra',
    fields: [
      {
        key: 'proveedor',
        label: 'Proveedor',
        type: 'select',
        required: true,
        options: proveedores.filter((p) => p.estado === 'Activo').map((p) => p.nombreRazonSocial),
        emptyLabel: 'proveedor',
      },
      { key: 'cotizacion', label: 'Cotización de origen', only: ['edit', 'view'] },
      { key: 'fecha', label: 'Fecha', type: 'date' },
      { key: 'total', label: 'Valor total (COP)', type: 'money', required: true },
      { key: 'estado', label: 'Estado', type: 'select', options: estadosCompra, only: ['edit', 'view'] },
      { key: 'estadoEntrega', label: 'Estado de la entrega', type: 'select', options: estadosEntrega, only: ['edit', 'view'] },
    ],
  },
];

export default function ComprasPage() {
  // Compra que se va a anular, a la espera de la confirmación
  const [anulando, setAnulando] = useState(null);

  return (
    <div>
      <PageHeader crumbs={['Inicio', 'Compras']} />
      <DataTable
        title="Compras"
        columns={columns}
        data={compras}
        statusKey="estado"
        newLabel="Nueva compra"
        formSections={formSections}
        entityName="compra"
        titleKey="proveedor"
        statusOptions={estadosCompra}
        statusFlow={FLUJO_ESTADOS_COMPRA}
        filters={[
          { key: 'estado', label: 'Estado', options: estadosCompra },
          { key: 'estadoEntrega', label: 'Entrega', options: estadosEntrega },
          { key: 'proveedor', label: 'Proveedor' },
        ]}
        createModal={({ onSubmit, onClose }) => (
          <NuevaCompraModal onSubmit={onSubmit} onClose={onClose} />
        )}
        canDelete={false}
        rowActions={(row, { update }) =>
          // Una compra recibida no se toca; el resto se puede anular
          row.estado === 'Pendiente' ? (
            <button
              onClick={() => setAnulando({ row, update })}
              className="rounded p-1 text-red-500 hover:text-red-600"
              aria-label={`Anular ${row.id}`}
              title="Anular la orden de compra"
            >
              <Ban size={15} />
            </button>
          ) : null
        }
      />

      {anulando && (
        <ConfirmDialog
          title="¿Anular la orden de compra?"
          message="La orden queda anulada y no se enviará al proveedor."
          confirmLabel="Anular orden"
          record={{ title: anulando.row.id, subtitle: `${anulando.row.proveedor} · ${anulando.row.total}` }}
          onConfirm={() => anulando.update({ estado: 'Anulada', estadoEntrega: 'Cancelado' })}
          onClose={() => setAnulando(null)}
        />
      )}
    </div>
  );
}
