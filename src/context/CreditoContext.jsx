import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CUPO_CARTERA } from '../data/mockData';

const CreditoContext = createContext(null);

/** "$ 1.620.000" → 1620000 */
export function parseCOP(value) {
  return Number(String(value ?? '').replace(/\D/g, '')) || 0;
}

/** 1620000 → "$ 1.620.000" */
export function formatCOP(value) {
  return `$ ${Number(value || 0).toLocaleString('es-CO')}`;
}

/** Un crédito sigue vigente mientras le quede saldo por pagar. */
const vigente = (credito) => parseCOP(credito.saldoPendiente) > 0;

/**
 * Cartera del cliente.
 *
 * La empresa solo financia un crédito por cliente a la vez. Mientras ese
 * crédito siga abierto, el saldo usable se muestra en negativo por el
 * valor total de la cotización financiada: es lo que el cliente debe, no
 * lo que puede gastar. Al quedar saldado, el cupo vuelve a su valor normal.
 *
 * Vive en la raíz de la app porque lo consultan tanto el portal (navbar,
 * inicio, cartera y el carrito) como el administrador, que lo descuenta al
 * confirmar el valor de una cotización pagada a crédito. `creditos` son los
 * del cliente en sesión: si no trae ninguno vigente, el cupo está entero.
 */
export function CreditoProvider({ creditos = [], children }) {
  const [comprometido, setComprometido] = useState(0);
  const [credito, setCredito] = useState(() => creditos.find(vigente) ?? null);

  /**
   * Abre un crédito nuevo. Devuelve false si el cliente ya tiene uno
   * vigente o si el monto no cabe en el cupo.
   */
  const comprometer = useCallback(
    (valor) => {
      if (credito) return false;
      if (valor <= 0 || valor > CUPO_CARTERA - comprometido) return false;
      setComprometido((prev) => prev + valor);
      setCredito({
        id: 'CRE-NUEVO',
        montoTotal: formatCOP(valor),
        saldoPendiente: formatCOP(valor),
      });
      return true;
    },
    [credito, comprometido],
  );

  /** Un abono confirmado libera cupo; al saldarlo, el crédito se cierra. */
  const liberar = useCallback((valor) => {
    setComprometido((prev) => Math.max(0, prev - valor));
    setCredito((actual) => {
      if (!actual) return null;
      const resto = parseCOP(actual.saldoPendiente) - valor;
      return resto > 0 ? { ...actual, saldoPendiente: formatCOP(resto) } : null;
    });
  }, []);

  const value = useMemo(() => {
    // Con un crédito abierto el saldo se muestra en rojo, en negativo
    const saldoUsable = credito
      ? -parseCOP(credito.montoTotal)
      : Math.max(0, CUPO_CARTERA - comprometido);

    return {
      cupoTotal: CUPO_CARTERA,
      credito,
      tieneCredito: Boolean(credito),
      comprometido,
      comprometidoTexto: formatCOP(credito ? parseCOP(credito.saldoPendiente) : comprometido),
      saldoUsable,
      saldoUsableTexto: `${saldoUsable < 0 ? '-' : ''}${formatCOP(Math.abs(saldoUsable))}`,
      // Sin crédito abierto y dentro del cupo
      alcanza: (valor) => !credito && valor > 0 && valor <= saldoUsable,
      comprometer,
      liberar,
    };
  }, [credito, comprometido, comprometer, liberar]);

  return <CreditoContext.Provider value={value}>{children}</CreditoContext.Provider>;
}

export function useCredito() {
  const ctx = useContext(CreditoContext);
  if (!ctx) throw new Error('useCredito debe usarse dentro de un <CreditoProvider>');
  return ctx;
}
