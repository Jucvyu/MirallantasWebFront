import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { clientCreditos, CUPO_CREDITO_TOTAL } from '../data/mockData';

const CreditoContext = createContext(null);

/** "$ 1.620.000" → 1620000 */
export function parseCOP(value) {
  return Number(String(value ?? '').replace(/\D/g, '')) || 0;
}

/** 1620000 → "$ 1.620.000" */
export function formatCOP(value) {
  return `$ ${Number(value || 0).toLocaleString('es-CO')}`;
}

/** Lo que ya está comprometido en los créditos vigentes del cliente. */
const COMPROMETIDO_INICIAL = clientCreditos.reduce((acc, c) => acc + parseCOP(c.saldo), 0);

/**
 * Saldo de crédito del cliente ("saldo usable").
 *
 * Parte de un cupo fijo (`CUPO_CREDITO_TOTAL`, 2 millones) del que se
 * descuenta lo que ya debe en créditos vigentes y lo que se le vaya
 * aprobando. Vive en la raíz de la app, por encima de los layouts, porque
 * lo consultan tanto el portal (navbar, home y el formulario de crédito
 * del pedido) como el administrador, que lo descuenta al confirmar el
 * valor de una cotización pagada a crédito.
 */
export function CreditoProvider({ children }) {
  const [comprometido, setComprometido] = useState(COMPROMETIDO_INICIAL);

  /** Descuenta un nuevo crédito del cupo. Devuelve false si no alcanza. */
  const comprometer = useCallback((valor) => {
    let alcanzo = true;
    setComprometido((prev) => {
      if (prev + valor > CUPO_CREDITO_TOTAL) {
        alcanzo = false;
        return prev;
      }
      return prev + valor;
    });
    return alcanzo;
  }, []);

  const value = useMemo(() => {
    const saldoUsable = Math.max(0, CUPO_CREDITO_TOTAL - comprometido);
    return {
      cupoTotal: CUPO_CREDITO_TOTAL,
      comprometido,
      saldoUsable,
      saldoUsableTexto: formatCOP(saldoUsable),
      alcanza: (valor) => valor > 0 && valor <= saldoUsable,
      comprometer,
    };
  }, [comprometido, comprometer]);

  return <CreditoContext.Provider value={value}>{children}</CreditoContext.Provider>;
}

export function useCredito() {
  const ctx = useContext(CreditoContext);
  if (!ctx) throw new Error('useCredito debe usarse dentro de un <CreditoProvider>');
  return ctx;
}
