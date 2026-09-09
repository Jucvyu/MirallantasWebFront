import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { clientAbonos } from '../data/mockData';

const AbonosContext = createContext(null);

/** "$ 1.620.000" → 1620000 */
export function parseCOP(value) {
  return Number(String(value ?? '').replace(/\D/g, '')) || 0;
}

/** 1620000 → "$ 1.620.000" */
export function formatCOP(value) {
  return `$ ${Number(value || 0).toLocaleString('es-CO')}`;
}

/**
 * Abonos del cliente. Vive en el ClientLayout para que "Mis Abonos" y el
 * detalle de un crédito vean siempre la misma lista: un abono registrado
 * desde cualquiera de los dos aparece en el otro.
 */
export function AbonosProvider({ children }) {
  const [abonos, setAbonos] = useState(clientAbonos);

  const addAbono = useCallback((abono) => {
    setAbonos((prev) => {
      const num = prev.length + 1;
      return [{ ...abono, id: `ABN-${String(100 + num).slice(-3)}` }, ...prev];
    });
  }, []);

  const value = useMemo(
    () => ({
      abonos,
      addAbono,
      abonosDeCredito: (creditoId) => abonos.filter((a) => a.credito === creditoId),
    }),
    [abonos, addAbono],
  );

  return <AbonosContext.Provider value={value}>{children}</AbonosContext.Provider>;
}

export function useAbonos() {
  const ctx = useContext(AbonosContext);
  if (!ctx) throw new Error('useAbonos debe usarse dentro de un <AbonosProvider>');
  return ctx;
}
