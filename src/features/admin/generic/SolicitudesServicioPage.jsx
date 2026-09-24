import PageHeader from '../../../components/base/PageHeader';
import DataTable from '../../../components/base/DataTable';
import {
  clientes,
  estadosEvidenciaCarcasa,
  estadosServicio,
  FLUJO_ESTADOS_SERVICIO,
  servicios,
  solicitudesServicio,
  terceros,
} from '../../../data/mockData';

// Solicitudes de reencauche. El modelo relacional guarda el servicio
// vendido en `detalle_servicio`, pero la ficha exige además un trámite
// propio con evaluación de la carcasa, reencauchadora asignada y estados.
const columns = [
  { key: 'id', label: 'Nº Solicitud' },
  { key: 'cliente', label: 'Cliente' },
  { key: 'servicio', label: 'Servicio' },
  { key: 'tercero', label: 'Reencauchadora', render: (row) => row.tercero || 'Sin asignar' },
  { key: 'cantidad', label: 'Llantas' },
  { key: 'estadoEvidencia', label: 'Carcasa' },
  { key: 'estado', label: 'Estado' },
];

const formSections = [
  {
    title: 'Origen de la solicitud',
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
        key: 'servicio',
        label: 'Servicio',
        type: 'select',
        required: true,
        options: servicios.filter((s) => s.estado === 'Activo').map((s) => s.nombre),
        emptyLabel: 'servicio',
      },
      {
        key: 'tercero',
        label: 'Reencauchadora',
        type: 'select',
        // Una reencauchadora inactiva no puede recibir solicitudes nuevas
        options: terceros.filter((t) => t.estado === 'Activo').map((t) => t.nombreRazonSocial),
        emptyLabel: 'tercero',
        hint: 'Se asigna cuando la carcasa pasa la revisión.',
      },
      { key: 'fecha', label: 'Fecha de recepción', type: 'date' },
    ],
  },
  {
    title: 'Llanta a reencauchar',
    fields: [
      { key: 'cantidad', label: 'Cantidad de llantas', type: 'number', required: true, placeholder: '4' },
      { key: 'medidas', label: 'Medidas', placeholder: '295/80R22.5' },
      { key: 'descripcion', label: 'Descripción de la carcasa', type: 'textarea', span: 2, required: true },
      { key: 'foto', label: 'Foto de la carcasa', type: 'image', span: 2, placeholder: 'Sube la foto de la llanta usada' },
    ],
  },
  {
    title: 'Condiciones',
    fields: [
      { key: 'estadoEvidencia', label: 'Estado de la evidencia', type: 'select', options: estadosEvidenciaCarcasa },
      { key: 'tiempoEstimado', label: 'Tiempo estimado', placeholder: '9 días' },
      // Sí / No: se resuelve mejor con un interruptor que con un desplegable
      { key: 'garantia', label: '¿Incluye garantía?', type: 'switch' },
      { key: 'estado', label: 'Estado', type: 'select', options: estadosServicio, only: ['edit', 'view'] },
    ],
  },
];

/** Una solicitud nueva entra pendiente y con la carcasa sin revisar. */
function normalize(values) {
  return {
    estado: 'Pendiente',
    estadoEvidencia: 'Pendiente de revisión',
    garantia: 'No',
    ...values,
  };
}

export default function SolicitudesServicioPage() {
  return (
    <div>
      <PageHeader crumbs={['Inicio', 'Solicitudes de servicio']} />
      <DataTable
        title="Solicitudes de servicio"
        columns={columns}
        data={solicitudesServicio}
        statusKey="estado"
        newLabel="Nueva solicitud"
        formSections={formSections}
        entityName="solicitud"
        titleKey="cliente"
        normalize={normalize}
        statusOptions={estadosServicio}
        statusFlow={FLUJO_ESTADOS_SERVICIO}
        filters={[
          { key: 'estado', label: 'Estado', options: estadosServicio },
          { key: 'estadoEvidencia', label: 'Carcasa', options: estadosEvidenciaCarcasa },
          { key: 'servicio', label: 'Servicio', options: servicios.map((s) => s.nombre) },
        ]}
      />
    </div>
  );
}
