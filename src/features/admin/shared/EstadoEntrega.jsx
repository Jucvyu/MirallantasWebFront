import StatusSelect from '../../../components/base/StatusSelect';
import { estadosEntrega, FLUJO_ESTADOS_ENTREGA } from '../../../data/mockData';

/**
 * Celda del estado de entrega.
 *
 * El módulo de entregas desapareció: el despacho se sigue desde la propia
 * cotización-pedido (envío al cliente) y desde la compra (recepción de la
 * mercancía del proveedor). El flujo es secuencial —pendiente, en camino,
 * entregado— y se puede cancelar en cualquier punto previo.
 */
export default function EstadoEntrega({ row, update, campo = 'estadoEntrega' }) {
  return (
    <StatusSelect
      value={row[campo] ?? 'Pendiente'}
      options={estadosEntrega}
      flow={FLUJO_ESTADOS_ENTREGA}
      onChange={(estado) => update({ [campo]: estado })}
    />
  );
}
