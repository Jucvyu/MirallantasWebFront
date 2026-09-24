import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { abonos as abonosIniciales } from '../data/mockData';

const AbonosAdminContext = createContext(null);

/**
 * Abonos del administrador.
 *
 * Vive en el AdminLayout para que el listado de Abonos y el historial que
 * se abre desde cada crédito de la cartera trabajen sobre la misma lista:
 * un abono registrado desde la cartera aparece en el listado y al revés.
 */
export function AbonosAdminProvider({ children }) {
  const [abonos, setAbonos] = useState(abonosIniciales);

  const addAbono = useCallback((abono) => {
    setAbonos((prev) => [
      { ...abono, id: `ABO-${String(100 + prev.length + 1).slice(-3)}` },
      ...prev,
    ]);
  }, []);

  const value = useMemo(
    () => ({
      abonos,
      setAbonos,
      addAbono,
      abonosDeCredito: (creditoId) => abonos.filter((a) => a.credito === creditoId),
    }),
    [abonos, addAbono],
  );

  return <AbonosAdminContext.Provider value={value}>{children}</AbonosAdminContext.Provider>;
}

export function useAbonosAdmin() {
  const ctx = useContext(AbonosAdminContext);
  if (!ctx) throw new Error('useAbonosAdmin debe usarse dentro de un <AbonosAdminProvider>');
  return ctx;
}
