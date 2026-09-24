import { useState } from 'react';
import { Receipt } from 'lucide-react';
import PageHeader from '../../../components/base/PageHeader';
import DataTable from '../../../components/base/DataTable';
import { useAbonosAdmin } from '../../../context/AbonosAdminContext';
import ComprobanteAbonoModal from '../../shared/ComprobanteAbonoModal';
import {
  estadosAbono,
  FLUJO_ESTADOS_ABONO,
  mediosPago,
} from '../../../data/mockData';
import NuevoAbonoModal from './NuevoAbonoModal';

// Tabla `abono`: id_credito, monto, fecha, metodo_pago. El estado y el
// comprobante no están en el modelo, pero la ficha los exige: el asesor
// debe validar la consignación antes de aprobar el abono.
const columns = [
  { key: 'id', label: 'Nº Abono' },
  { key: 'credito', label: 'Crédito' },
  { key: 'cliente', label: 'Cliente' },
  { key: 'fecha', label: 'Fecha' },
  { key: 'monto', label: 'Monto' },
  { key: 'metodoPago', label: 'Método de pago' },
  { key: 'estado', label: 'Estado' },
];

// El alta se hace desde `NuevoAbonoModal`; este esquema cubre la edición y
// el detalle. Un abono no se elimina nunca del sistema.
const formSections = [
  {
    title: 'Crédito asociado',
    fields: [
      { key: 'credito', label: 'Crédito', only: ['edit', 'view'] },
      { key: 'cliente', label: 'Cliente', only: ['edit', 'view'] },
    ],
  },
  {
    title: 'Pago',
    fields: [
      { key: 'monto', label: 'Monto (COP)', type: 'money', required: true, placeholder: '2.000.000' },
      { key: 'fecha', label: 'Fecha del abono', type: 'date', only: ['edit', 'view'] },
      { key: 'metodoPago', label: 'Método de pago', type: 'select', required: true, options: mediosPago },
      { key: 'estado', label: 'Estado', type: 'select', options: estadosAbono, only: ['edit', 'view'] },
      {
        key: 'comprobante',
        label: 'Comprobante de pago',
        type: 'image',
        span: 2,
        only: ['edit', 'view'],
        placeholder: 'Pantallazo de la consignación',
        hint: 'Debe validarse antes de confirmar el abono.',
      },
    ],
  },
];

export default function AbonosPage() {
  // La lista vive en el contexto: la comparte con la cartera
  const { abonos, setAbonos } = useAbonosAdmin();
  const [comprobanteDe, setComprobanteDe] = useState(null);

  return (
    <div>
      <PageHeader crumbs={['Inicio', 'Abonos']} />
      <DataTable
        title="Abonos"
        columns={columns}
        data={abonos}
        rows={abonos}
        onRowsChange={setAbonos}
        statusKey="estado"
        newLabel="Nuevo abono"
        formSections={formSections}
        entityName="abono"
        titleKey="credito"
        statusOptions={estadosAbono}
        statusFlow={FLUJO_ESTADOS_ABONO}
        filters={[
          { key: 'estado', label: 'Estado', options: estadosAbono },
          { key: 'metodoPago', label: 'Pago', options: mediosPago },
          { key: 'cliente', label: 'Cliente' },
        ]}
        createModal={({ onSubmit, onClose }) => (
          <NuevoAbonoModal onSubmit={onSubmit} onClose={onClose} />
        )}
        canDelete={false}
        rowActions={(row) =>
          // El comprobante solo se emite con el abono ya validado
          row.estado === 'Confirmado' ? (
            <button
              onClick={() => setComprobanteDe(row)}
              className="rounded p-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
              aria-label={`Generar el comprobante de ${row.id}`}
              title="Generar comprobante del abono"
            >
              <Receipt size={15} />
            </button>
          ) : null
        }
      />

      {comprobanteDe && (
        <ComprobanteAbonoModal abono={comprobanteDe} onClose={() => setComprobanteDe(null)} />
      )}
    </div>
  );
}
