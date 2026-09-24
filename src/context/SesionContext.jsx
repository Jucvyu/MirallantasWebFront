import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CLIENTE_DEMO_POR_DEFECTO, clientesDemo } from '../data/mockData';
import { CreditoProvider } from './CreditoContext';

const SesionContext = createContext(null);

const CLAVE = 'mirallantas-cliente';

/** La cuenta elegida se recuerda para que aguante una recarga. */
function cuentaGuardada() {
  try {
    const guardada = localStorage.getItem(CLAVE);
    return clientesDemo[guardada] ? guardada : CLIENTE_DEMO_POR_DEFECTO;
  } catch {
    return CLIENTE_DEMO_POR_DEFECTO;
  }
}

/**
 * Cliente en sesión del portal.
 *
 * El prototipo trae dos cuentas de prueba —una con un crédito abierto y
 * otra sin cartera— para poder ver los dos comportamientos sin tocar los
 * datos. El login decide con cuál se entra y todo el portal (inicio,
 * cotizaciones, cartera y perfil) lee de aquí.
 */
export function SesionProvider({ children }) {
  const [correo, setCorreo] = useState(cuentaGuardada);

  const entrarComo = useCallback((correoCuenta) => {
    if (!clientesDemo[correoCuenta]) return;
    setCorreo(correoCuenta);
    try {
      localStorage.setItem(CLAVE, correoCuenta);
    } catch {
      // Sin almacenamiento local la sesión dura lo que dure la pestaña
    }
  }, []);

  const value = useMemo(() => {
    const cliente = clientesDemo[correo] ?? clientesDemo[CLIENTE_DEMO_POR_DEFECTO];
    return {
      correo,
      entrarComo,
      cliente,
      nombre: cliente.profile.nombre,
      profile: cliente.profile,
      cotizaciones: cliente.cotizaciones,
      creditos: cliente.creditos,
      abonos: cliente.abonos,
      solicitudesCredito: cliente.solicitudesCredito,
      homeStats: cliente.homeStats,
    };
  }, [correo, entrarComo]);

  return <SesionContext.Provider value={value}>{children}</SesionContext.Provider>;
}

export function useSesion() {
  const ctx = useContext(SesionContext);
  if (!ctx) throw new Error('useSesion debe usarse dentro de un <SesionProvider>');
  return ctx;
}

/**
 * Cartera de la sesión.
 *
 * La `key` hace que el cupo se recalcule desde cero al cambiar de cuenta,
 * en vez de arrastrar el saldo del cliente anterior.
 */
export function CarteraDeSesion({ children }) {
  const { correo, creditos } = useSesion();
  return (
    <CreditoProvider key={correo} creditos={creditos}>
      {children}
    </CreditoProvider>
  );
}
