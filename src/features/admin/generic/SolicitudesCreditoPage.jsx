import PageHeader from '../../../components/base/PageHeader';
import DataTable from '../../../components/base/DataTable';
import {
  clientes,
  estadosSolicitudCredito,
  FLUJO_ESTADOS_SOLICITUD_CREDITO,
  PLAZOS_CREDITO,
  solicitudesCredito,
} from '../../../data/mockData';

// Solicitudes de crédito que levantan los clientes desde el portal. El
// administrador las aprueba o las rechaza; al aprobarlas se abre el
// crédito en la cartera.
const columns = [
  { key: 'id', label: 'Nº Solicitud' },
  { key: 'cliente', label: 'Cliente' },
  { key: 'monto', label: 'Monto solicitado' },
  { key: 'plazoDias', label: 'Plazo', render: (row) => `${row.plazoDias} días` },
  { key: 'fecha', label: 'Fecha' },
  { key: 'motivo', label: 'Motivo del rechazo', render: (row) => row.motivo || '—' },
  { key: 'estado', label: 'Estado' },
];

const formSections = [
  {
    title: 'Datos de la solicitud',
    fields: [
      {
        key: 'cliente',
        label: 'Cliente',
        type: 'select',
        required: true,
        options: clientes.filter((c) => c.estado === 'Activo').map((c) => c.nombreCompleto),
        emptyLabel: 'cliente',
      },
      { key: 'monto', label: 'Monto solicitado (COP)', type: 'money', required: true, placeholder: '800.000' },
      {
        key: 'plazoDias',
        label: 'Plazo (días)',
        type: 'select',
        required: true,
        options: PLAZOS_CREDITO.map(String),
      },
      { key: 'fecha', label: 'Fecha', type: 'date' },
      { key: 'estado', label: 'Estado', type: 'select', options: estadosSolicitudCredito, only: ['edit', 'view'] },
      {
        key: 'motivo',
        label: 'Motivo del rechazo',
        type: 'textarea',
        span: 2,
        only: ['edit', 'view'],
        hint: 'Obligatorio cuando la solicitud se rechaza.',
      },
    ],
  },
];

/** Toda solicitud nueva queda pendiente de revisión. */
function normalize(values) {
  return { estado: 'Pendiente', motivo: '', ...values };
}

export default function SolicitudesCreditoPage() {
  return (
    <div>
      <PageHeader crumbs={['Inicio', 'Solicitudes de crédito']} />
      <DataTable
        title="Solicitudes de crédito"
        columns={columns}
        data={solicitudesCredito}
        statusKey="estado"
        newLabel="Nueva solicitud"
        formSections={formSections}
        entityName="solicitud"
        titleKey="cliente"
        normalize={normalize}
        statusOptions={estadosSolicitudCredito}
        statusFlow={FLUJO_ESTADOS_SOLICITUD_CREDITO}
        filters={[
          { key: 'estado', label: 'Estado', options: estadosSolicitudCredito },
          { key: 'cliente', label: 'Cliente' },
        ]}
      />
    </div>
  );
}
