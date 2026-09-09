import PageHeader from '../../../components/base/PageHeader';
import DataTable from '../../../components/base/DataTable';
import { abonos, creditos, estadosAbono, metodosPago } from '../../../data/mockData';

const columns = [
  { key: 'id', label: 'Nº Abono' },
  { key: 'credito', label: 'Crédito' },
  { key: 'fecha', label: 'Fecha Abono' },
  { key: 'monto', label: 'Monto' },
  { key: 'metodo', label: 'Método de Pago' },
  { key: 'estado', label: 'Estado' },
];

// Tabla `abono` (1:1 con crédito): id_credito, monto_pagado,
// saldo_pendiente, fecha_ultimo_abono, id_metodo_pago, comprobante_pago,
// id_estado.
const formSections = [
  {
    title: 'Crédito asociado',
    fields: [
      {
        key: 'credito',
        label: 'Crédito',
        type: 'select',
        required: true,
        span: 2,
        options: creditos.map((c) => c.id),
        hint: 'Cada crédito lleva un único registro de abono.',
      },
    ],
  },
  {
    title: 'Pago',
    fields: [
      { key: 'monto', label: 'Monto pagado (COP)', type: 'money', required: true, placeholder: '2.000.000' },
      { key: 'saldo', label: 'Saldo pendiente (COP)', type: 'money', placeholder: '0' },
      { key: 'fecha', label: 'Fecha del último abono', type: 'date', required: true },
      { key: 'metodo', label: 'Método de pago', type: 'select', required: true, options: metodosPago },
      { key: 'comprobante', label: 'Comprobante de pago', placeholder: 'TRF-88213' },
      { key: 'estado', label: 'Estado', type: 'select', required: true, options: estadosAbono },
    ],
  },
];

export default function AbonosPage() {
  return (
    <div>
      <PageHeader crumbs={['Inicio', 'Abonos']} />
      <DataTable
        title="Abonos"
        columns={columns}
        data={abonos}
        statusKey="estado"
        newLabel="Nuevo abono"
        formSections={formSections}
        entityName="abono"
        statusOptions={estadosAbono}
        filters={[{ key: 'estado', label: 'Estado', options: estadosAbono }]}
        titleKey="credito"
      />
    </div>
  );
}
