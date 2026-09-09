import PageHeader from '../../../components/base/PageHeader';
import DataTable from '../../../components/base/DataTable';
import { clientes, creditos, recentOrders } from '../../../data/mockData';

const columns = [
  { key: 'id', label: 'Nº Crédito' },
  { key: 'cliente', label: 'Cliente' },
  { key: 'cupo', label: 'Cupo' },
  { key: 'saldo', label: 'Saldo' },
];

// Tabla `credito`: id_cotizacion (1:1), plazo_dias, fecha_inicio,
// fecha_limite, valor_credito, id_estado. El crédito nace de una
// cotización concreta, no de un cupo global del cliente.
const formSections = [
  {
    title: 'Origen del crédito',
    fields: [
      { key: 'cliente', label: 'Cliente', type: 'select', required: true, options: clientes.map((c) => c.nombre) },
      {
        key: 'cotizacion',
        label: 'Cotización financiada',
        type: 'select',
        required: true,
        options: recentOrders.map((o) => o.id),
        hint: 'Una cotización solo puede tener un crédito.',
      },
      { key: 'cupo', label: 'Valor del crédito (COP)', type: 'money', required: true, placeholder: '20.000.000' },
      { key: 'saldo', label: 'Saldo pendiente (COP)', type: 'money', placeholder: '4.300.000' },
    ],
  },
  {
    title: 'Plazo',
    fields: [
      { key: 'plazoDias', label: 'Plazo (días)', type: 'number', required: true, placeholder: '30' },
      { key: 'fechaInicio', label: 'Fecha de inicio', type: 'date' },
      { key: 'fechaLimite', label: 'Fecha límite', type: 'date' },
    ],
  },
];

export default function CreditosPage() {
  return (
    <div>
      <PageHeader crumbs={['Inicio', 'Créditos']} />
      <DataTable
        title="Créditos"
        columns={columns}
        data={creditos}
        newLabel="Nuevo crédito"
        formSections={formSections}
        entityName="crédito"
        titleKey="cliente"
      />
    </div>
  );
}
