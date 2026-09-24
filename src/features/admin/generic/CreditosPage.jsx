import { useState } from 'react';
import { Wallet } from 'lucide-react';
import PageHeader from '../../../components/base/PageHeader';
import DataTable from '../../../components/base/DataTable';
import { creditos, estadosActivo, PLAZOS_CREDITO } from '../../../data/mockData';
import HistorialAbonosModal from './HistorialAbonosModal';
import NuevoCreditoModal from './NuevoCreditoModal';

/** Un crédito está vencido si pasó su fecha límite y aún debe. */
function vencido(row) {
  if (!row.fechaLimite) return false;
  const debe = Number(String(row.saldoPendiente ?? '').replace(/\D/g, '')) > 0;
  return debe && new Date(row.fechaLimite) < new Date();
}

// Tabla `credito`: id_cliente, monto_total, saldo_pendiente,
// fecha_apertura, fecha_limite, estado.
const columns = [
  { key: 'id', label: 'Nº Crédito' },
  { key: 'cliente', label: 'Cliente' },
  { key: 'montoTotal', label: 'Monto total' },
  { key: 'saldoPendiente', label: 'Saldo pendiente' },
  { key: 'plazoDias', label: 'Plazo', render: (row) => `${row.plazoDias} días` },
  {
    key: 'fechaLimite',
    label: 'Fecha límite',
    render: (row) => (
      <span className={vencido(row) ? 'font-semibold text-red-500' : ''}>
        {row.fechaLimite}
        {vencido(row) ? ' · vencido' : ''}
      </span>
    ),
  },
  { key: 'estado', label: 'Estado' },
];

const formSections = [
  {
    title: 'Origen del crédito',
    fields: [
      // El cliente no se captura: lo aporta la venta que se financió
      { key: 'cliente', label: 'Cliente', only: ['edit', 'view'] },
      { key: 'venta', label: 'Venta financiada', only: ['edit', 'view'] },
      { key: 'montoTotal', label: 'Monto total (COP)', type: 'money', required: true },
      { key: 'saldoPendiente', label: 'Saldo pendiente (COP)', type: 'money', only: ['edit', 'view'] },
    ],
  },
  {
    title: 'Plazo',
    fields: [
      {
        key: 'plazoDias',
        label: 'Plazo (días)',
        type: 'select',
        required: true,
        options: PLAZOS_CREDITO.map(String),
      },
      { key: 'fechaApertura', label: 'Fecha de apertura', type: 'date' },
      { key: 'fechaLimite', label: 'Fecha límite', type: 'date' },
      { key: 'estado', label: 'Estado', type: 'select', options: estadosActivo, only: ['edit', 'view'] },
    ],
  },
];

export default function CreditosPage() {
  // Crédito cuyo historial de abonos se está consultando
  const [abonosDe, setAbonosDe] = useState(null);

  return (
    <div>
      <PageHeader crumbs={['Inicio', 'Cartera']} />
      <DataTable
        title="Cartera de créditos"
        columns={columns}
        data={creditos}
        newLabel="Nuevo crédito"
        formSections={formSections}
        entityName="crédito"
        titleKey="cliente"
        canEdit={false}
        canDelete={false}
        statusKey="estado"
        statusOptions={estadosActivo}
        statusVariant="switch"
        filters={[
          { key: 'estado', label: 'Estado', options: estadosActivo },
          { key: 'cliente', label: 'Cliente' },
        ]}
        createModal={({ onSubmit, onClose }) => (
          <NuevoCreditoModal onSubmit={onSubmit} onClose={onClose} />
        )}
        rowActions={(row) => (
          <button
            onClick={() => setAbonosDe(row)}
            className="rounded p-1 text-amber-600 hover:text-amber-700 dark:text-amber-400"
            aria-label={`Abonos de ${row.id}`}
            title="Subir abonos y ver el historial"
          >
            <Wallet size={15} />
          </button>
        )}
      />

      {abonosDe && <HistorialAbonosModal credito={abonosDe} onClose={() => setAbonosDe(null)} />}
    </div>
  );
}
